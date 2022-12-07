import axios from 'axios';
import { AxiosResponse } from 'axios';

interface source {
  id: string;
  name: string;
  lang: string;
  iconUrl: string;
  supportsLatest: boolean;
  isConfigurable: boolean;
  isNsfw: boolean;
  displayName: string;
}

interface Category {
  id: number;
  order: number;
  name: string;
  default: boolean;
  meta: object;
}

interface Manga {
  id: number;
  sourceId: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  initialized: boolean;
  artist: string;
  author: string;
  description: string;
  genre: string[];
  status: string;
  inLibrary: boolean;
  inLibraryAt: number;
  source: source;
  meta: Record<string, unknown>;
  realUrl: string;
  lastFetchedAt: number;
  chaptersLastFetchedAt: number;
  freshData: boolean;
  unreadCount: number;
  downloadCount: number;
  chapterCount: number;
  lastChapterRead: Chapter;
  age: number;
  chaptersAge: number;
}

interface Chapter {
  id: number;
  url: string;
  name: string;
  uploadDate: number;
  chapterNumber: number;
  scanlator: string;
  mangaId: number;
  read: boolean;
  bookmarked: boolean;
  lastPageRead: number;
  lastReadAt: number;
  index: number;
  fetchedAt: number;
  downloaded: boolean;
  pageCount: number;
  chapterCount: number;
  meta: Record<string, unknown>;
}

const username = process.env.username || null;
const password = process.env.password || null;
const timeString = process.env.Interval || '';

const match = timeString.match(/(?:\d\.)?\d+\s?\w/g);
let milliseconds = 14400000;
if (match) {
  milliseconds = match.reduce((acc, cur) => {
    const multiplier = 1000;
    switch (cur.slice(-1)) {
      case 'd':
        return (
          (parseFloat(cur) ? parseFloat(cur) : 0) * 24 * 60 * 60 * multiplier +
          acc
        );
      case 'h':
        return (
          (parseFloat(cur) ? parseFloat(cur) : 0) * 60 * 60 * multiplier + acc
        );
      case 'm':
        return (parseFloat(cur) ? parseFloat(cur) : 0) * 60 * multiplier + acc;
      case 's':
        return (parseFloat(cur) ? parseFloat(cur) : 0) * multiplier + acc;
    }
    return acc;
  }, 0);
} else {
  milliseconds = 14400000;
}
if (milliseconds < 14400000) milliseconds = 14400000;

const api = axios.create({
  baseURL: process.env.URLbase || 'http://tachidesk:4567',
});

console.log(api.defaults.baseURL);
if (username !== null && password !== null) {
  api.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(
    username + ':' + password
  ).toString('base64')}`;
}

async function getCats() {
  try {
    const { data } = <AxiosResponse<Category[]>>(
      await api.get('/api/v1/category')
    );
    return data;
  } catch (error) {
    console.log(6);
    throw error;
  }
}

async function getmangas(categoryID: number) {
  try {
    const data = <AxiosResponse<Manga[]>>(
      await api.get(`/api/v1/category/${categoryID}`)
    );
    console.log(data);
    return data.data;
  } catch (error) {
    console.log(1);
    throw error;
  }
}

async function getChapters(mangaID: number) {
  try {
    const { data } = <AxiosResponse<Chapter[]>>(
      await api.get(`/api/v1/manga/${mangaID}/chapters?onlineFetch=true`)
    );
    return data;
  } catch (_) {
    try {
      const { data } = <AxiosResponse<Chapter[]>>(
        await api.get(`/api/v1/manga/${mangaID}/chapters?onlineFetch=false`)
      );
      return data;
    } catch (error) {
      console.log(2);
      throw error;
    }
  }
}

async function doGetCats() {
  console.log('started at', new Date().toString());
  try {
    await api.get('/api/v1/downloads/clear');
  } catch (error) {
    console.error('9');
    throw error;
  }

  const mangas = [] as Manga[];
  try {
    const Categories = await getCats();
    console.log(Categories);
    for (const cat in Categories) {
      const tmp = Categories[cat];
      if (tmp != undefined) {
        try {
          mangas.push(...(await getmangas(tmp.id)));
          console.log(`Category: ${tmp.id}, numMangas ${mangas.length}`);
        } catch (error) {
          console.log(`Category: ${tmp.id}, errored ${error}`);
        }
      }
    }
  } catch (error) {
    console.log(7);
    throw error;
  }

  const shuffeled =
    process.env.shuffeled == 'false'
      ? mangas
      : mangas
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

  try {
    for (const manga in shuffeled) {
      const tmp = shuffeled[manga];
      if (tmp != undefined) {
        try {
          const tmpp = await getChapters(tmp.id);
          const notDld = tmpp.filter((ele: Chapter) => !ele.downloaded);
          console.log(`manga: ${tmp.id}. chapters: ${notDld.length}`);
          if (notDld) {
            const fd = { chapterIds: notDld.map((ele: Chapter) => ele.id) };
            api.post('/api/v1/download/batch', fd);
          }
        } catch (error) {
          console.log(`manga: ${tmp.id}, errored ${error}`);
        }
      }
    }
  } catch (error) {
    console.log(8);
    throw error;
  }
  console.log('finished at', new Date().toString());
}

doGetCats();
setInterval(doGetCats, milliseconds);
