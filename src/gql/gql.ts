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
    "query mangas {\n  mangas(condition: {inLibrary: true}) {\n    nodes {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      chapters {\n        nodes {\n          name\n          chapterNumber\n          id\n          isDownloaded\n          sourceOrder\n          isRead\n        }\n      }\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n}": types.MangasDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query mangas {\n  mangas(condition: {inLibrary: true}) {\n    nodes {\n      id\n      title\n      lastFetchedAt\n      thumbnailUrl\n      chapters {\n        nodes {\n          name\n          chapterNumber\n          id\n          isDownloaded\n          sourceOrder\n          isRead\n        }\n      }\n      lastReadChapter {\n        name\n        chapterNumber\n        id\n        isDownloaded\n        sourceOrder\n        isRead\n      }\n    }\n  }\n}"): typeof import('./graphql').MangasDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
