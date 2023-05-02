import axios from 'axios'
import PQueue from 'p-queue'
import { PrismaClient } from '@prisma/client'

const network = new PQueue({ concurrency: 1 })
const database = new PQueue({ concurrency: 1 })

const prisma = new PrismaClient({
    log: [
        { level: 'error', emit: 'event' }
    ]
})

const username = process.env.username ?? null
const password = process.env.password ?? null
const timeString = process.env.Interval ?? ''
const onlyUnread = process.env.onlyUnread === 'true'

const match = timeString.match(/(?:\d\.)?\d+\s?\w/g)
let milliseconds = 14400000
if (match != null) {
    milliseconds = match.reduce((acc, cur) => {
        const multiplier = 1000
        switch (cur.slice(-1)) {
        case 'd':
            return (
                ((parseFloat(cur)) > 0 ? parseFloat(cur) : 0) * 24 * 60 * 60 * multiplier +
          acc
            )
        case 'h':
            return (
                (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * 60 * multiplier + acc
            )
        case 'm':
            return (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * multiplier + acc
        case 's':
            return (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * multiplier + acc
        }
        return acc
    }, 0)
} else {
    milliseconds = 14400000
}
if (milliseconds < 14400000) milliseconds = 14400000

const api = axios.create({
    baseURL: process.env.URLbase ?? 'http://tachidesk:4567'
})

if (username !== null && password !== null) {
    api.defaults.headers.common.Authorization =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64')
}

main().catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await new Promise((resolve) => setTimeout(resolve, 60000))
    process.exit(1)
})

async function doGetCats (): Promise<void> {
    console.log('started at', new Date().toString())
    try {
        await api.get('/api/v1/downloads/clear')
    } catch (error) {
        console.error('1')
        throw error
    }
    await getcategories()
    console.log('finished at', new Date().toString())
}

async function getcategories (): Promise<void> {
    try {
        const { data: categories } = await api.get<Category[]>('/api/v1/category')
        for (const { id, ...rest } of categories) {
            await database.add(async () => {
                await prisma.category.upsert({
                    where: { id },
                    update: rest,
                    create: { id, ...rest }
                })
            })
            await getmangas(id)
        }
    } catch (error) { }
}

async function getmangas (CategoryID: number): Promise<void> {
    await network.add(async () => {
        try {
            const { data: mangas } = await api.get<Manga[]>(`/api/v1/category/${CategoryID}`)
            for (const { id, genre, source, meta, lastChapterRead, ...rest } of mangas) {
                await database.add(async () => {
                    await prisma.manga.upsert({
                        where: { id },
                        update: { ...rest, lastChapterReadID: lastChapterRead.id, CategoryID },
                        create: { ...rest, lastChapterReadID: lastChapterRead.id, CategoryID, id }
                    })
                    await getchapters(id, lastChapterRead.id)
                })
            }
        } catch (error) { }
    })
}

async function getchapters (mangaID: number, IslastChapterRead: number): Promise<void> {
    const chapDL = new Promise<number[]>((resolve, reject) => {
        void network.add(async () => {
            try {
                const chapDLIDs: number[] = []
                const { data: chapters } = await api.get<Chapter[]>(`/api/v1/manga/${mangaID}/chapters?onlineFetch=true`)
                await comparechapters(chapters, mangaID)
                for (const { id, meta, ...rest } of chapters) {
                    let data: undefined | number
                    if (id === IslastChapterRead) {
                        data = mangaID
                    }
                    await database.add(async () => {
                        await prisma.chapter.upsert({
                            where: { id },
                            update: { ...rest, lastChapterReadID: data },
                            create: { ...rest, lastChapterReadID: data, id }
                        })
                    })
                    if (!onlyUnread || rest.read) {
                        chapDLIDs.push(id)
                    }
                }
                resolve(chapDLIDs)
            } catch (error) {
                reject(error)
            }
        })
    })
    const fd = { chapterIds: chapDL }
    await network.add(async () => {
        await api.post('/api/v1/download/batch', fd)
    })
}

async function comparechapters (chapters: Chapter[], mangaID: number): Promise<void> {
    const readCountDB = await new Promise<number>((resolve, reject) => {
        void database.add(() => {
            prisma.chapter.count({
                where: {
                    id: mangaID,
                    read: true
                }
            })
                .then(resolve)
                .catch(reject)
        })
    })
    const isread = chapters.filter(ele => ele.read)
    const readCountLive = isread.length
    if (readCountDB > readCountLive) {
        const lastreadId = isread.pop()?.id
        await database.add(async () => {
            await prisma.chapError.create({
                data: {
                    lastreadId,
                    mangaId: mangaID
                }
            })
        })
    }
}

async function main (): Promise<void> {
    await prisma.$connect()
    prisma.$on('error', (e) => {
        console.log('Error: ')
        console.log(e)
    })
    void doGetCats()
    setInterval(() => { void doGetCats() }, milliseconds)
}
