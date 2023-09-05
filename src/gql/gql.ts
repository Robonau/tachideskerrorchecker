/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation fetchMangaChapters($id: Int!) {\n  fetchManga(input: {id: $id}) {\n    manga {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n  fetchChapters(input: {mangaId: $id}) {\n    chapters {\n      name\n      chapterNumber\n      id\n      isDownloaded\n      sourceOrder\n      isRead\n    }\n  }\n}\n\nmutation clearDownloader {\n  clearDownloader(input: {clientMutationId: \"\"}) {\n    downloadStatus {\n      state\n    }\n  }\n}\n\nmutation enqueueChapterDownloads($ids: [Int!]!) {\n  enqueueChapterDownloads(input: {ids: $ids}) {\n    clientMutationId\n  }\n}\n\nmutation startDownloader {\n  startDownloader(input: {clientMutationId: \"\"}) {\n    downloadStatus {\n      state\n    }\n  }\n}": types.FetchMangaChaptersDocument,
    "query mangas {\n  mangas(condition: {inLibrary: true}) {\n    nodes {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      chapters {\n        nodes {\n          chapterNumber\n          id\n          isDownloaded\n          sourceOrder\n          isRead\n        }\n      }\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n}\n\nquery manga($id: Int!) {\n  manga(id: $id) {\n    id\n    title\n    lastFetchedAt\n    thumbnailUrl\n    chapters {\n      nodes {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n    lastReadChapter {\n      name\n      chapterNumber\n      id\n      isDownloaded\n      sourceOrder\n      isRead\n    }\n  }\n}": types.MangasDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation fetchMangaChapters($id: Int!) {\n  fetchManga(input: {id: $id}) {\n    manga {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n  fetchChapters(input: {mangaId: $id}) {\n    chapters {\n      name\n      chapterNumber\n      id\n      isDownloaded\n      sourceOrder\n      isRead\n    }\n  }\n}\n\nmutation clearDownloader {\n  clearDownloader(input: {clientMutationId: \"\"}) {\n    downloadStatus {\n      state\n    }\n  }\n}\n\nmutation enqueueChapterDownloads($ids: [Int!]!) {\n  enqueueChapterDownloads(input: {ids: $ids}) {\n    clientMutationId\n  }\n}\n\nmutation startDownloader {\n  startDownloader(input: {clientMutationId: \"\"}) {\n    downloadStatus {\n      state\n    }\n  }\n}"): typeof import('./graphql').FetchMangaChaptersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query mangas {\n  mangas(condition: {inLibrary: true}) {\n    nodes {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      chapters {\n        nodes {\n          chapterNumber\n          id\n          isDownloaded\n          sourceOrder\n          isRead\n        }\n      }\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n}\n\nquery manga($id: Int!) {\n  manga(id: $id) {\n    id\n    title\n    lastFetchedAt\n    thumbnailUrl\n    chapters {\n      nodes {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n    lastReadChapter {\n      name\n      chapterNumber\n      id\n      isDownloaded\n      sourceOrder\n      isRead\n    }\n  }\n}"): typeof import('./graphql').MangasDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
