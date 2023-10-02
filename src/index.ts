import { GraphQLClient } from 'graphql-request';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
import { MangasQuery, MangasDocument } from './gql/graphql';
import { getBase64, isEqual, prisma, shuffle, sleep, url, webhookClient } from './util';

type MangaQuery = MangasQuery['mangas']['nodes'][0]

const client = new GraphQLClient(`${url}/api/graphql`);

async function GetMangas(): Promise<MangasQuery['mangas']['nodes'] | undefined> {
    try {
        const res = await client.request<MangasQuery>(MangasDocument.toString());
        return res?.mangas.nodes
    } catch (error) {
        return undefined
    }
};

function idsSame(mag1: MangaQuery, mag2: MangaQuery) {
    const tmp1 = mag1.chapters.nodes.map(e => e.id)
    const tmp2 = mag2.chapters.nodes.map(e => e.id)
    return !tmp1.find((e) => !tmp2.includes(e)) && !tmp2.find((e) => !tmp1.includes(e))
}

async function PrismaGetMangas(): Promise<MangaQuery[] | undefined> {
    const prim = await prisma?.manga.findMany({
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
    return prim.map(pri => ({ ...pri, chapters: { nodes: pri.chapters } }))
}

function HighestChapterRead(manga: MangaQuery): MangaQuery['lastReadChapter'] {
    return manga.chapters.nodes.reduce((a, c) => {
        return c.sourceOrder > (a?.sourceOrder || -1) && c.isRead ? c : a
    }, undefined as MangaQuery['lastReadChapter'] | undefined)
}

async function run() {
    console.log('started at', new Date().toString())
    const mangas = await GetMangas()
    if (mangas && prisma) {
        const pmias = await PrismaGetMangas()
        for (let manga of shuffle<typeof mangas[0]>(mangas)) {
            const prima = pmias?.find(ele => ele.id === manga.id)
            console.log(`id: ${manga.id} name: ${manga.title}`);
            await dealWithManga(prima, manga)
        }
        await deleteExess(pmias, mangas);
    }
    console.log('finished at', new Date().toString())
}

async function deleteExess(pmias: MangaQuery[] | undefined, mangas: MangaQuery[]) {
    if (pmias) {
        for (let pmia of pmias) {
            const manga = mangas?.find(e => e.id === pmia.id);
            if (manga && (pmia.chapters.nodes.length > manga.chapters.nodes.length || !idsSame(manga, pmia))) {
                console.log(`deleting exess ${pmia.id} chapters`);
                await prisma?.chapters.deleteMany({
                    where: {
                        MangaId: pmia.id,
                        id: {
                            notIn: manga.chapters.nodes.map(e => e.id)
                        }
                    }
                });
            } else if (!manga) {
                console.log(`deleting ${pmia.id} manga and chapters, since it no longer exists in tachidesk`);
                await prisma?.chapters.deleteMany({
                    where: {
                        MangaId: pmia.id,
                    }
                });
                await prisma?.manga.delete({
                    where: { id: pmia.id }
                });
            }
        }
    }
}

async function dealWithManga(manga: MangaQuery | undefined, mag: MangaQuery) {
    const oldHighestChapterRead = manga ? HighestChapterRead(manga) : undefined
    const newHighestChapterRead = HighestChapterRead(mag)
    if (manga && (oldHighestChapterRead?.sourceOrder || -1) > (newHighestChapterRead?.sourceOrder || -1)) {
        await discorderr(manga, oldHighestChapterRead, newHighestChapterRead)
        await updateCreateChapterEntry(mag, manga)
    }
    if (
        (!manga && prisma) ||
        (oldHighestChapterRead?.sourceOrder || -1) !== (newHighestChapterRead?.sourceOrder || -1) ||
        manga?.chapters.nodes.length !== mag.chapters.nodes.length ||
        !idsSame(manga, mag)
    ) {
        console.log((!manga && prisma));
        console.log((oldHighestChapterRead?.sourceOrder || -1) !== (newHighestChapterRead?.sourceOrder || -1));
        console.log(manga?.chapters.nodes.length !== mag.chapters.nodes.length);
        if (manga) {
            console.log(!idsSame(manga, mag));
            console.log(manga.chapters.nodes.map(e => e.id));
            console.log(mag.chapters.nodes.map(e => e.id));
        }

        await updateCreateChapterEntry(mag, manga)
    }
}

async function updateCreateChapterEntry(manga: MangaQuery, old: MangaQuery | undefined): Promise<void> {
    if (prisma) {
        console.log('updating chapters in db');
        for (let chap of manga.chapters.nodes) {
            const oldchap = old?.chapters.nodes.find(e => e.id === chap.id)
            if (!oldchap || !isEqual(oldchap, chap)) {
                console.log(chap.id);

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
        console.log('updating done');
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

async function discorderr(manga: MangaQuery, lastchapter: MangaQuery['lastReadChapter'] | null = null, newchapter: MangaQuery['lastReadChapter'] | null = null): Promise<void> {
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

