import axios from 'axios';
import PQueue from 'p-queue';
import { PrismaClient } from '@prisma/client';
const db = process.env.DATABASE_URL !== undefined;
const network = new PQueue({ concurrency: 2, autoStart: true });
const database = new PQueue({ concurrency: 1, autoStart: true });
network.on('idle', () => {
    if (network.pending === 0 && network.size === 0 && database.pending === 0 && database.size === 0) {
        console.log('finished at', new Date().toString());
    }
});
let prisma;
if (db) {
    prisma = new PrismaClient();
}
const username = process.env.username ?? null;
const password = process.env.password ?? null;
const timeString = process.env.Interval ?? '';
const onlyUnread = process.env.onlyUnread === 'true';
const shuffeled = (process.env.shuffeled === 'true' || process.env.shuffeled === undefined);
const match = timeString.match(/(?:\d\.)?\d+\s?\w/g);
let milliseconds = 14400000;
if (match != null) {
    milliseconds = match.reduce((acc, cur) => {
        const multiplier = 1000;
        switch (cur.slice(-1)) {
            case 'd':
                return ((parseFloat(cur) > 0 ? parseFloat(cur) : 0) *
                    24 *
                    60 *
                    60 *
                    multiplier +
                    acc);
            case 'h':
                return ((parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * 60 * multiplier +
                    acc);
            case 'm':
                return ((parseFloat(cur) > 0 ? parseFloat(cur) : 0) * 60 * multiplier + acc);
            case 's':
                return (parseFloat(cur) > 0 ? parseFloat(cur) : 0) * multiplier + acc;
        }
        return acc;
    }, 0);
}
else {
    milliseconds = 14400000;
}
if (milliseconds < 14400000)
    milliseconds = 14400000;
const api = axios.create({
    baseURL: process.env.URLbase ?? 'http://tachidesk:4567'
});
if (username !== null && password !== null) {
    api.defaults.headers.common.Authorization =
        'Basic ' + Buffer.from(username + ':' + password).toString('base64');
}
main().catch(async (e) => {
    console.error(e);
    if (prisma !== undefined) {
        await prisma.$disconnect();
    }
    await new Promise((resolve) => setTimeout(resolve, 60000));
    process.exit(1);
});
async function doGetCats() {
    console.log('started at', new Date().toString());
    await api.get('/api/v1/downloads/clear');
    await getcategories();
}
async function getcategories() {
    try {
        const { data: categories } = await api.get('/api/v1/category');
        for (const { id, includeInUpdate, meta, ...rest } of shuffle(categories)) {
            await database.add(async () => {
                try {
                    if (prisma !== undefined) {
                        await prisma.category.upsert({
                            where: { id },
                            update: rest,
                            create: { id, ...rest }
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            await getmangas(id);
        }
    }
    catch (error) { }
}
async function getmangas(CategoryID) {
    await network.add(async () => {
        console.log('hihi1');
        try {
            const { data: mangas } = await api.get(`/api/v1/category/${CategoryID}`);
            for (const { id, genre, source, meta, lastChapterRead, updateStrategy, description, url, realUrl, title, ...rest } of shuffle(mangas)) {
                await database.add(async () => {
                    try {
                        if (prisma !== undefined) {
                            const tite = Buffer.from(title, 'utf8');
                            const urr = Buffer.from(url, 'utf8');
                            const real = realUrl !== null && realUrl !== undefined ? Buffer.from(realUrl, 'utf8') : null;
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
                            });
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                    void getchapters(id, lastChapterRead?.id);
                });
            }
        }
        catch (error) { }
    });
}
async function getchapters(mangaID, IslastChapterRead) {
    const chapDL = await new Promise((resolve, reject) => {
        void network.add(async () => {
            console.log(mangaID, IslastChapterRead);
            try {
                const chapDLIDs = [];
                const chapters = [];
                try {
                    const { data } = await api.get(`/api/v1/manga/${mangaID}/chapters?onlineFetch=true`);
                    chapters.push(...data);
                }
                catch (error) {
                    try {
                        const { data } = await api.get(`/api/v1/manga/${mangaID}/chapters?onlineFetch=false`);
                        chapters.push(...data);
                    }
                    catch (error) {
                        void database.add(() => {
                            if (prisma !== undefined) {
                                void prisma.chapter.findMany({
                                    where: {
                                        mangaId: mangaID,
                                        read: true
                                    },
                                    orderBy: { index: 'asc' }
                                })
                                    .then((chap) => {
                                    void errortodat(mangaID, chap?.pop()?.id);
                                })
                                    .catch(() => {
                                    void errortodat(mangaID);
                                });
                            }
                        });
                    }
                }
                if (prisma !== undefined) {
                    await comparechapters(chapters, mangaID);
                }
                for (const { id, meta, url, realUrl, ...rest } of chapters) {
                    try {
                        let data;
                        if (id === IslastChapterRead) {
                            data = mangaID;
                        }
                        await database.add(async () => {
                            if (prisma !== undefined) {
                                const urr = Buffer.from(url, 'utf8');
                                const real = realUrl !== null && realUrl !== undefined ? Buffer.from(realUrl, 'utf8') : null;
                                await prisma.chapter.upsert({
                                    where: { id },
                                    update: { ...rest, url: urr, realUrl: real, lastChapterReadID: data },
                                    create: { ...rest, url: urr, realUrl: real, lastChapterReadID: data, id }
                                });
                            }
                        });
                        if (!onlyUnread || rest.read) {
                            chapDLIDs.push(id);
                        }
                    }
                    catch (error) {
                        console.log(error);
                        continue;
                    }
                }
                resolve(chapDLIDs);
            }
            catch (error) {
                console.log(error);
            }
        });
    });
    const fd = { chapterIds: chapDL };
    try {
        await network.add(async () => {
            await api.post('/api/v1/download/batch', fd);
        });
    }
    catch (error) {
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}
async function comparechapters(chapters, mangaID) {
    const readCountDB = await new Promise((resolve, reject) => {
        void database.add(() => {
            if (prisma !== undefined) {
                prisma.chapter.findMany({
                    where: {
                        mangaId: mangaID,
                        read: true
                    },
                    orderBy: { index: 'asc' }
                })
                    .then(resolve)
                    .catch(reject);
            }
        });
    });
    const isread = chapters.filter((ele) => ele.read);
    if (readCountDB.length > isread.length) {
        console.log('readCountDB last', readCountDB[readCountDB.length - 1]);
        console.log('isread last', isread[isread.length - 1]);
        const lastreadId = readCountDB[readCountDB.length - 1].id;
        await errortodat(mangaID, lastreadId);
    }
}
async function errortodat(mangaId, lastreadId = null) {
    await database.add(async () => {
        if (prisma !== undefined) {
            await prisma.chapError.create({
                data: {
                    lastreadId,
                    mangaId
                }
            });
        }
    });
}
async function main() {
    if (prisma !== undefined) {
        await prisma.$connect();
    }
    void doGetCats();
    setInterval(() => {
        void doGetCats();
    }, milliseconds);
}
function shuffle(arra) {
    if (shuffeled) {
        let currentIndex = arra.length;
        let randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [arra[currentIndex], arra[randomIndex]] = [
                arra[randomIndex], arra[currentIndex]
            ];
        }
        return arra;
    }
    return arra;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBO0FBQ3pCLE9BQU8sTUFBTSxNQUFNLFNBQVMsQ0FBQTtBQUM1QixPQUFPLEVBQUUsWUFBWSxFQUErQixNQUFNLGdCQUFnQixDQUFBO0FBRTFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQTtBQUVqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDL0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBRWhFLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQzlGLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUNwRDtBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxNQUFnQyxDQUFBO0FBQ3BDLElBQUksRUFBRSxFQUFFO0lBQ0osTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7Q0FDOUI7QUFFRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUE7QUFDN0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFBO0FBQzdDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtBQUM3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUE7QUFDcEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUE7QUFFM0YsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3BELElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQTtBQUMzQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7SUFDZixZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNyQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUE7UUFDdkIsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkIsS0FBSyxHQUFHO2dCQUNKLE9BQU8sQ0FDSCxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxFQUFFO29CQUNGLEVBQUU7b0JBQ0YsRUFBRTtvQkFDRixVQUFVO29CQUNaLEdBQUcsQ0FDQSxDQUFBO1lBQ0wsS0FBSyxHQUFHO2dCQUNKLE9BQU8sQ0FDSCxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxVQUFVO29CQUN4RSxHQUFHLENBQ0EsQ0FBQTtZQUNMLEtBQUssR0FBRztnQkFDSixPQUFPLENBQ0gsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUN0RSxDQUFBO1lBQ0wsS0FBSyxHQUFHO2dCQUNKLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUE7U0FDeEU7UUFDRCxPQUFPLEdBQUcsQ0FBQTtJQUNkLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtDQUNSO0tBQU07SUFDSCxZQUFZLEdBQUcsUUFBUSxDQUFBO0NBQzFCO0FBQ0QsSUFBSSxZQUFZLEdBQUcsUUFBUTtJQUFFLFlBQVksR0FBRyxRQUFRLENBQUE7QUFFcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNyQixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksdUJBQXVCO0NBQzFELENBQUMsQ0FBQTtBQUVGLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO0lBQ3hDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhO1FBQ3pDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0NBQ3ZFO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtRQUN0QixNQUFNLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUM3QjtJQUNELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ25CLENBQUMsQ0FBQyxDQUFBO0FBRUYsS0FBSyxVQUFVLFNBQVM7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ2hELE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sYUFBYSxFQUFFLENBQUE7QUFDekIsQ0FBQztBQUVELEtBQUssVUFBVSxhQUFhO0lBQ3hCLElBQUk7UUFDQSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBYSxrQkFBa0IsQ0FBQyxDQUFBO1FBQzFFLEtBQUssTUFBTSxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFXLFVBQVUsQ0FBQyxFQUFFO1lBQ2hGLE1BQU0sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDMUIsSUFBSTtvQkFDQSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7d0JBQ3RCLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7NEJBQ3pCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTs0QkFDYixNQUFNLEVBQUUsSUFBSTs0QkFDWixNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUU7eUJBQzFCLENBQUMsQ0FBQTtxQkFDTDtpQkFDSjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2lCQUNyQjtZQUNMLENBQUMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDdEI7S0FDSjtJQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7QUFDdEIsQ0FBQztBQUVELEtBQUssVUFBVSxTQUFTLENBQUUsVUFBa0I7SUFDeEMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEIsSUFBSTtZQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUNsQyxvQkFBb0IsVUFBVSxFQUFFLENBQ25DLENBQUE7WUFDRCxLQUFLLE1BQU0sRUFDUCxFQUFFLEVBQ0YsS0FBSyxFQUNMLE1BQU0sRUFDTixJQUFJLEVBQ0osZUFBZSxFQUNmLGNBQWMsRUFDZCxXQUFXLEVBQ1gsR0FBRyxFQUNILE9BQU8sRUFDUCxLQUFLLEVBQ0wsR0FBRyxJQUFJLEVBQ1YsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLE1BQU0sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDMUIsSUFBSTt3QkFDQSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7NEJBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBOzRCQUN2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQTs0QkFDcEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBOzRCQUM1RixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2dDQUN0QixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0NBQ2IsTUFBTSxFQUFFO29DQUNKLEdBQUcsSUFBSTtvQ0FDUCxHQUFHLEVBQUUsR0FBRztvQ0FDUixPQUFPLEVBQUUsSUFBSTtvQ0FDYixLQUFLLEVBQUUsSUFBSTtvQ0FDWCxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsRUFBRTtvQ0FDdEMsVUFBVTtpQ0FDYjtnQ0FDRCxNQUFNLEVBQUU7b0NBQ0osR0FBRyxJQUFJO29DQUNQLEdBQUcsRUFBRSxHQUFHO29DQUNSLE9BQU8sRUFBRSxJQUFJO29DQUNiLEtBQUssRUFBRSxJQUFJO29DQUNYLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxFQUFFO29DQUN0QyxVQUFVO29DQUNWLEVBQUU7aUNBQ0w7NkJBQ0osQ0FBQyxDQUFBO3lCQUNMO3FCQUNKO29CQUFDLE9BQU8sS0FBSyxFQUFFO3dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7cUJBQ3JCO29CQUNELEtBQUssV0FBVyxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQzdDLENBQUMsQ0FBQyxDQUFBO2FBQ0w7U0FDSjtRQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7SUFDdEIsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsS0FBSyxVQUFVLFdBQVcsQ0FDdEIsT0FBZSxFQUNmLGlCQUFxQztJQUVyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksT0FBTyxDQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzNELEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO1lBQ3ZDLElBQUk7Z0JBQ0EsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFBO2dCQUM5QixNQUFNLFFBQVEsR0FBYyxFQUFFLENBQUE7Z0JBQzlCLElBQUk7b0JBQ0EsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FDMUIsaUJBQWlCLE9BQU8sNEJBQTRCLENBQ3ZELENBQUE7b0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO2lCQUN6QjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixJQUFJO3dCQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQzFCLGlCQUFpQixPQUFPLDZCQUE2QixDQUN4RCxDQUFBO3dCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtxQkFDekI7b0JBQUMsT0FBTyxLQUFLLEVBQUU7d0JBQ1osS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTs0QkFDbkIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO2dDQUN0QixLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO29DQUN6QixLQUFLLEVBQUU7d0NBQ0gsT0FBTyxFQUFFLE9BQU87d0NBQ2hCLElBQUksRUFBRSxJQUFJO3FDQUNiO29DQUNELE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7aUNBQzVCLENBQUM7cUNBQ0csSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0NBQ1gsS0FBSyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQ0FDN0MsQ0FBQyxDQUFDO3FDQUNELEtBQUssQ0FBQyxHQUFHLEVBQUU7b0NBQ1IsS0FBSyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7Z0NBQzVCLENBQUMsQ0FBQyxDQUFBOzZCQUNUO3dCQUNMLENBQUMsQ0FBQyxDQUFBO3FCQUNMO2lCQUNKO2dCQUNELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDdEIsTUFBTSxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO2lCQUMzQztnQkFDRCxLQUFLLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLEVBQUUsSUFBSSxRQUFRLEVBQUU7b0JBQ3hELElBQUk7d0JBQ0EsSUFBSSxJQUF3QixDQUFBO3dCQUM1QixJQUFJLEVBQUUsS0FBSyxpQkFBaUIsRUFBRTs0QkFDMUIsSUFBSSxHQUFHLE9BQU8sQ0FBQTt5QkFDakI7d0JBQ0QsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFOzRCQUMxQixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0NBQ3RCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dDQUNwQyxNQUFNLElBQUksR0FBRyxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7Z0NBQzVGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7b0NBQ3hCLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRTtvQ0FDYixNQUFNLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFO29DQUNyRSxNQUFNLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtpQ0FDNUUsQ0FBQyxDQUFBOzZCQUNMO3dCQUNMLENBQUMsQ0FBQyxDQUFBO3dCQUNGLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTs0QkFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTt5QkFDckI7cUJBQ0o7b0JBQUMsT0FBTyxLQUFLLEVBQUU7d0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDbEIsU0FBUTtxQkFDWDtpQkFDSjtnQkFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDckI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3JCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFBO0lBQ2pDLElBQUk7UUFDQSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDekIsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO0tBQ0w7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7S0FDM0Q7QUFDTCxDQUFDO0FBRUQsS0FBSyxVQUFVLGVBQWUsQ0FDMUIsUUFBbUIsRUFDbkIsT0FBZTtJQUVmLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JFLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDbkIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztvQkFDcEIsS0FBSyxFQUFFO3dCQUNILE9BQU8sRUFBRSxPQUFPO3dCQUNoQixJQUFJLEVBQUUsSUFBSTtxQkFDYjtvQkFDRCxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2lCQUM1QixDQUFDO3FCQUNHLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3JCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNqRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDekQsTUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ3hDO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxVQUFVLENBQUUsT0FBZSxFQUFFLGFBQTRCLElBQUk7SUFDeEUsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzFCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUN0QixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0YsVUFBVTtvQkFDVixPQUFPO2lCQUNWO2FBQ0osQ0FBQyxDQUFBO1NBQ0w7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCxLQUFLLFVBQVUsSUFBSTtJQUNmLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtRQUN0QixNQUFNLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtLQUMxQjtJQUNELEtBQUssU0FBUyxFQUFFLENBQUE7SUFDaEIsV0FBVyxDQUFDLEdBQUcsRUFBRTtRQUNiLEtBQUssU0FBUyxFQUFFLENBQUE7SUFDcEIsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ3BCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBSyxJQUFTO0lBQzFCLElBQUksU0FBUyxFQUFFO1FBQ1gsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUFDLElBQUksV0FBVyxDQUFBO1FBQy9DLE9BQU8sWUFBWSxLQUFLLENBQUMsRUFBRTtZQUN2QixXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUE7WUFDdEQsWUFBWSxFQUFFLENBQUM7WUFDZixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRztnQkFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7YUFBQyxDQUFBO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLENBQUE7S0FDZDtJQUNELE9BQU8sSUFBSSxDQUFBO0FBQ2YsQ0FBQyJ9