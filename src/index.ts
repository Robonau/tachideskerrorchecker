import { GraphQLClient } from 'graphql-request';
import { MangasQuery, MangasDocument, MangaDocument, MangaQueryVariables, ClearDownloaderDocument, FetchMangaChaptersDocument, FetchMangaChaptersMutation, FetchMangaChaptersMutationVariables, MangaQuery, MangaEdge, EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsDocument, EnqueueChapterDownloadsMutationVariables } from './gql/graphql';
import { getBase64, prisma, shuffle, url, webhookClient } from './util';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js'

import dotenv from "dotenv"
dotenv.config()

const client = new GraphQLClient(`${url}/api/graphql`);

async function GetMangas(): Promise<MangasQuery['mangas']['nodes'] | undefined> {
    try {
        const res = await client.request<MangasQuery>(MangasDocument.toString());
        return res?.mangas.nodes
    } catch (error) {
        return undefined
    }
};

async function FetchManga(manga: MangasQuery['mangas']['nodes'][0]): Promise<MangaQuery['manga'] | undefined> {
    try {
        const res = await client.request<FetchMangaChaptersMutation, FetchMangaChaptersMutationVariables>(
            FetchMangaChaptersDocument.toString(),
            { id: manga.id }
        );
        return { ...res.fetchManga.manga, chapters: { nodes: res.fetchChapters.chapters } }
    } catch (error) {
        return undefined
    }
}

async function GetManga(manga: MangasQuery['mangas']['nodes'][0]): Promise<MangaQuery['manga'] | undefined> {
    try {
        const res = await client.request<MangaQuery, MangaQueryVariables>(
            MangaDocument.toString(),
            { id: manga.id }
        );
        return res.manga
    } catch (error) {
        return undefined
    }
}

function idsSame(mag1: MangaQuery['manga'], mag2: MangaQuery['manga']) {
    return !mag1.chapters.nodes.find((element, index) => element.id !== mag2.chapters.nodes[index].id)
}

async function DLchapts(ids: number[]): Promise<void> {
    try {
        await client.request<EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsMutationVariables>(
            EnqueueChapterDownloadsDocument.toString(),
            { ids }
        );
    } catch (error) { }
}

async function PrismaGetManga(id: number): Promise<MangaQuery['manga'] | undefined> {
    const prim = await prisma?.manga.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            lastFetchedAt: true,
            chapters: {
                select: {
                    id: true,
                    chapterNumber: true,
                    isDownloaded: true,
                    sourceOrder: true,
                    isRead: true,
                    name: true
                }
            }
        }
    })
    if (!prim) { return undefined }
    return { ...prim, chapters: { nodes: prim.chapters } }
}

function HighestChapterRead(manga: MangaQuery['manga']): MangaQuery['manga']['lastReadChapter'] {
    return manga.chapters.nodes.reduce((a, c) => {
        return c.sourceOrder > (a?.sourceOrder || -1) && c.isRead ? c : a
    }, undefined as MangaQuery['manga']['lastReadChapter'] | undefined)
}

async function run() {
    console.log('started at', new Date().toString())
    try {
        await client.request(ClearDownloaderDocument.toString())
    } catch (error) { }
    const mangas = await GetMangas()
    const chapsToDownload: number[] = []
    if (mangas) {
        for (let manga of shuffle<typeof mangas[0]>(mangas)) {
            console.log(`id: ${manga.id} name: ${manga.title}`);
            await prisma?.manga.upsert({
                create: {
                    id: manga.id,
                    title: manga.title,
                    lastFetchedAt: manga.lastFetchedAt,
                    thumbnailUrl: manga.thumbnailUrl || ''
                },
                update: {
                    title: manga.title,
                    lastFetchedAt: manga.lastFetchedAt,
                    thumbnailUrl: manga.thumbnailUrl || ''
                },
                where: {
                    id: manga.id
                },
            })
            let mag = await FetchManga(manga)
            if (mag === undefined) {
                mag = await GetManga(manga)
            }
            const prima = await PrismaGetManga(manga.id)
            if (mag !== undefined) {
                chapsToDownload.push(...dealWithManga(prima, mag))
            } else {
                //this manga is dead, no responce from either fetch or current
                if (prima) {
                    prisma?.chapters.deleteMany({ where: { id: manga.id } })
                }
            }
        }
        await DLchapts(chapsToDownload)
    }
}

function dealWithManga(manga: MangaQuery['manga'] | undefined, mag: MangaQuery['manga']) {
    const chapsToDownload: number[] = []
    mag.chapters.nodes.forEach(ma => {
        if (!ma.isDownloaded) {
            chapsToDownload.push(ma.id)
        }
    })
    const oldHighestChapterRead = manga ? HighestChapterRead(manga) : undefined
    const newHighestChapterRead = HighestChapterRead(mag)
    if (manga && (oldHighestChapterRead?.sourceOrder || -1) > (newHighestChapterRead?.sourceOrder || -1)) {
        discorderr(manga, oldHighestChapterRead, newHighestChapterRead)
        updateCreateChapterEntry(mag)
    }
    if (
        (!manga && prisma) ||
        (oldHighestChapterRead?.sourceOrder || -1) !== (newHighestChapterRead?.sourceOrder || -1) ||
        manga?.chapters.nodes.length !== mag.chapters.nodes.length ||
        !idsSame(manga, mag)
    ) {
        updateCreateChapterEntry(mag)
    }
    return chapsToDownload
}

async function updateCreateChapterEntry(manga: MangaQuery['manga']): Promise<void> {
    if (prisma) {
        console.log('updating chapters in db');
        prisma?.chapters.deleteMany({
            where: {
                MangaId: manga.id,
                id: {
                    notIn: manga.chapters.nodes.map(e => e.id)
                }
            }
        })
        for (let chap of manga.chapters.nodes) {
            let { __typename, ...create } = { ...chap, MangaId: manga.id }
            let { id, ...update } = create
            await prisma?.chapters.upsert({
                create,
                update,
                where: {
                    id
                },
            })
        }
    }
}

async function main() {
    if (prisma !== undefined) {
        try {
            await prisma.$connect()
        } catch (error) {
            console.log(error);
        }
    }

    void run()
    setInterval(() => {
        void run()
    }, 14400000)
}

main().catch(async (e) => {
    console.error(e)
    if (prisma !== undefined) {
        await prisma.$disconnect()
    }
    await new Promise((resolve) => setTimeout(resolve, 60000))
    process.exit(1)
})

async function discorderr(manga: MangaQuery['manga'], lastchapter: MangaQuery['manga']['lastReadChapter'] | null = null, newchapter: MangaQuery['manga']['lastReadChapter'] | null = null): Promise<void> {
    let imgdata = await getBase64(manga.thumbnailUrl)
    const file = new AttachmentBuilder(imgdata, {
        name: 'img.jpeg'
    })
    const msgcontent = new EmbedBuilder()
        .setTitle(manga.title)
        .setColor(5814783)
        .setThumbnail('attachment://img.jpeg')
    if (lastchapter !== null && newchapter !== null) {
        msgcontent
            .setDescription(`Old Chapter: ${lastchapter.name}\nNew Chapter: ${newchapter.name}\nthis is unexpected`)
    } else if (lastchapter !== null) {
        msgcontent
            .setDescription(`there was an error getting chapter data for mangaID: '${manga.id}'\nthe last known chapter was '${lastchapter.name}'`)
    } else {
        msgcontent
            .setDescription(`there was an error getting chapter data for mangaID: ${manga.id}\n last chapter unknown`)
    }
    msgcontent
        .setURL(`${url}/manga/${manga.id}/`)
    if (webhookClient !== undefined) {
        void webhookClient.send({
            content: 'Tachidesk Weirdness:',
            embeds: [msgcontent],
            files: [file]
        })
    }
}

