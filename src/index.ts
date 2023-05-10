import axios from 'axios'
import PQueue from 'p-queue'
import { PrismaClient, type Chapter as prisChapter } from '@prisma/client'

const db = process.env.DATABASE_URL !== undefined

const network = new PQueue({ concurrency: 2, autoStart: true })
const database = new PQueue({ concurrency: 1, autoStart: true })

network.on('idle', () => {
    if (network.pending === 0 && network.size === 0 && database.pending === 0 && database.size === 0) {
        console.log('finished at', new Date().toString())
    }
})

let prisma: PrismaClient | undefined
if (db) {
    prisma = new PrismaClient()
}

const username = process.env.username ?? null
const password = process.env.password ?? null
const timeString = process.env.Interval ?? ''
const onlyUnread = process.env.onlyUnread === 'true'
const shuffeled = (process.env.shuffeled === 'true' || process.env.shuffeled === undefined)
const displayurl = process.env.displayurl
const webhookURL = process.env.webhookURL

const match = timeString.match(/(?:\d\.)?\d+\s?\w/g)
let milliseconds = 14400000
if (match != null) {
    milliseconds = match.reduce((acc, cur) => {
        const multiplier = 1000
        switch (cur.slice(-1)) {
        case 'd':
            return (
                (parseFloat(cur) > 0 ? parseFloat(cur) : 0) *
            24 *
            60 *
            60 *
            multiplier +
          acc
            )
        case 'h':
            return (
                (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * 60 * multiplier +
          acc
            )
        case 'm':
            return (
                (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * multiplier + acc
            )
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
    if (prisma !== undefined) {
        await prisma.$disconnect()
    }
    await new Promise((resolve) => setTimeout(resolve, 60000))
    process.exit(1)
})

async function doGetCats (): Promise<void> {
    console.log('started at', new Date().toString())
    await api.get('/api/v1/downloads/clear')
    await getcategories()
}

async function getcategories (): Promise<void> {
    try {
        const { data: categories } = await api.get<Category[]>('/api/v1/category')
        for (const { id, includeInUpdate, meta, ...rest } of shuffle<Category>(categories)) {
            await database.add(async () => {
                try {
                    if (prisma !== undefined) {
                        await prisma.category.upsert({
                            where: { id },
                            update: rest,
                            create: { id, ...rest }
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            await getmangas(id)
        }
    } catch (error) {}
}

async function getmangas (CategoryID: number): Promise<void> {
    await network.add(async () => {
        console.log(`new category: ${CategoryID}`)
        try {
            const { data: mangas } = await api.get<Manga[]>(
                `/api/v1/category/${CategoryID}`
            )
            for (const {
                id,
                genre,
                source,
                meta,
                lastChapterRead,
                updateStrategy,
                description,
                url,
                realUrl,
                title,
                ...rest
            } of shuffle(mangas)) {
                await database.add(async () => {
                    try {
                        if (prisma !== undefined) {
                            const tite = Buffer.from(title, 'utf8')
                            const urr = Buffer.from(url, 'utf8')
                            const real = realUrl !== null && realUrl !== undefined ? Buffer.from(realUrl, 'utf8') : null
                            await prisma.manga.upsert({
                                where: { id },
                                update: {
                                    ...rest,
                                    url: urr,
                                    realUrl: real,
                                    title: tite,
                                    lastChapterReadID: lastChapterRead?.id,
                                    CategoryID
                                },
                                create: {
                                    ...rest,
                                    url: urr,
                                    realUrl: real,
                                    title: tite,
                                    lastChapterReadID: lastChapterRead?.id,
                                    CategoryID,
                                    id
                                }
                            })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    void getchapters({
                        id,
                        genre,
                        source,
                        meta,
                        lastChapterRead,
                        updateStrategy,
                        description,
                        url,
                        realUrl,
                        title,
                        ...rest
                    }, lastChapterRead?.id)
                })
            }
        } catch (error) {}
    })
}

async function getchapters (
    manga: Manga,
    IslastChapterRead: number | undefined
): Promise<void> {
    const chapDL = await new Promise<number[]>((resolve, reject) => {
        void network.add(async () => {
            console.log(manga.id)
            try {
                const chapDLIDs: number[] = []
                const chapters: Chapter[] = []
                try {
                    const { data } = await api.get<Chapter[]>(
                        `/api/v1/manga/${manga.id}/chapters?onlineFetch=true`
                    )
                    chapters.push(...data)
                } catch (error) {
                    try {
                        const { data } = await api.get<Chapter[]>(
                            `/api/v1/manga/${manga.id}/chapters?onlineFetch=false`
                        )
                        chapters.push(...data)
                    } catch (error) {
                        void database.add(() => {
                            if (prisma !== undefined) {
                                void prisma.chapter.findMany({
                                    where: {
                                        mangaId: manga.id,
                                        read: true
                                    },
                                    orderBy: { index: 'asc' }
                                })
                                    .then((chap) => {
                                        void errortodat(manga.id, chap?.pop()?.id)
                                    })
                                    .catch(() => {
                                        void errortodat(manga.id)
                                    })
                            }
                        })
                    }
                }
                if (prisma !== undefined) {
                    await comparechapters(chapters, manga)
                }
                for (const { id, meta, url, realUrl, ...rest } of chapters) {
                    try {
                        let data: undefined | number
                        if (id === IslastChapterRead) {
                            data = manga.id
                        }
                        await database.add(async () => {
                            if (prisma !== undefined) {
                                const urr = Buffer.from(url, 'utf8')
                                const real = realUrl !== null && realUrl !== undefined ? Buffer.from(realUrl, 'utf8') : null
                                await prisma.chapter.upsert({
                                    where: { id },
                                    update: { ...rest, url: urr, realUrl: real, lastChapterReadID: data },
                                    create: { ...rest, url: urr, realUrl: real, lastChapterReadID: data, id }
                                })
                            }
                        })
                        if (!onlyUnread || rest.read) {
                            chapDLIDs.push(id)
                        }
                    } catch (error) {
                        console.log(error)
                        continue
                    }
                }
                resolve(chapDLIDs)
            } catch (error) {
                console.log(error)
            }
        })
    })
    const fd = { chapterIds: chapDL }
    try {
        await network.add(async () => {
            await api.post('/api/v1/download/batch', fd)
        })
    } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 60000))
    }
}

async function comparechapters (
    chapters: Chapter[],
    manga: Manga
): Promise<void> {
    const readCountDB = await new Promise<prisChapter[]>((resolve, reject) => {
        void database.add(() => {
            if (prisma !== undefined) {
                prisma.chapter.findMany({
                    where: {
                        mangaId: manga.id,
                        read: true
                    },
                    orderBy: { index: 'asc' }
                })
                    .then(resolve)
                    .catch(reject)
            }
        })
    })
    const isread = chapters.filter((ele) => ele.read)
    if (readCountDB.length > isread.length) {
        console.log('readCountDB last', readCountDB[readCountDB.length - 1])
        console.log('isread last', isread[isread.length - 1])
        const lastreadId = readCountDB[readCountDB.length - 1].id
        discorderr(manga, readCountDB[readCountDB.length - 1], isread[isread.length - 1])
        await errortodat(manga.id, lastreadId)
    }
}

interface discordembed {
    title: string
    description: string
    url: string
    color: number
    thumbnail?: {
      url: string
    }
  }

interface discordhook {
    content: string
    embeds: discordembed[]
    attachments: []
  }

function discorderr (manga: Manga, lastchapter: prisChapter, newchapter: Chapter): void {
    let dispurl: string
    let msgcontent: discordhook
    if (displayurl !== undefined) {
        dispurl = `${displayurl}${manga.thumbnailUrl}`
        msgcontent = {
            content: 'Tachidesk Weirdness:',
            embeds: [
                {
                    title: manga.title,
                    description: `old chapter : ${lastchapter.name}\nnew chapter : ${newchapter.name}\nthis is unexpected`,
                    url: `${displayurl}/manga/${manga.id}/`,
                    color: 5814783,
                    thumbnail: {
                        url: dispurl
                    }
                }
            ],
            attachments: []
        }
    } else {
        msgcontent = {
            content: 'Tachidesk Weirdness:',
            embeds: [
                {
                    title: manga.title,
                    description: `old chapter : ${lastchapter.name}\nnew chapter : ${newchapter.name}\nthis is unexpected`,
                    url: `http://localhost:4567/manga/${manga.id}/`,
                    color: 5814783
                }
            ],
            attachments: []
        }
    }
    const data = JSON.stringify({ msgcontent })
    if (webhookURL !== undefined) {
        const config = {
            method: 'POST',
            url: webhookURL,
            headers: { 'Content-Type': 'application/json' },
            data
        }
        void axios.request(config)
    }
}

async function errortodat (mangaId: number, lastreadId: number | null = null): Promise<void> {
    await database.add(async () => {
        if (prisma !== undefined) {
            await prisma.chapError.create({
                data: {
                    lastreadId,
                    mangaId
                }
            })
        }
    })
}

async function main (): Promise<void> {
    if (prisma !== undefined) {
        await prisma.$connect()
    }
    void doGetCats()
    setInterval(() => {
        void doGetCats()
    }, milliseconds)
}

function shuffle<T> (arra: T[]): T[] {
    if (shuffeled) {
        let currentIndex = arra.length; let randomIndex
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--;
            [arra[currentIndex], arra[randomIndex]] = [
                arra[randomIndex], arra[currentIndex]]
        }
        return arra
    }
    return arra
}
