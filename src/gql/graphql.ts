/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
  /** A 64-bit signed integer as a String */
  LongString: { input: any; output: any; }
  /** A file part in a multipart request */
  Upload: { input: any; output: any; }
};

export type AboutPayload = {
  __typename?: 'AboutPayload';
  buildTime: Scalars['LongString']['output'];
  buildType: Scalars['String']['output'];
  discord: Scalars['String']['output'];
  github: Scalars['String']['output'];
  name: Scalars['String']['output'];
  revision: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export enum BackupRestoreState {
  Idle = 'IDLE',
  RestoringCategories = 'RESTORING_CATEGORIES',
  RestoringManga = 'RESTORING_MANGA'
}

export type BackupRestoreStatus = {
  __typename?: 'BackupRestoreStatus';
  mangaProgress: Scalars['Int']['output'];
  state: BackupRestoreState;
  totalManga: Scalars['Int']['output'];
};

export type BooleanFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type CategoryConditionInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryEdge = Edge & {
  __typename?: 'CategoryEdge';
  cursor: Scalars['Cursor']['output'];
  node: CategoryType;
};

export type CategoryFilterInput = {
  and?: InputMaybe<Array<CategoryFilterInput>>;
  default?: InputMaybe<BooleanFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CategoryFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
  order?: InputMaybe<IntFilterInput>;
};

export type CategoryMetaType = MetaType & {
  __typename?: 'CategoryMetaType';
  category: CategoryType;
  categoryId: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CategoryMetaTypeInput = {
  categoryId: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CategoryNodeList = NodeList & {
  __typename?: 'CategoryNodeList';
  edges: Array<CategoryEdge>;
  nodes: Array<CategoryType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum CategoryOrderBy {
  Id = 'ID',
  Name = 'NAME',
  Order = 'ORDER'
}

export type CategoryType = {
  __typename?: 'CategoryType';
  default: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  includeInUpdate: IncludeInUpdate;
  mangas: MangaNodeList;
  meta: Array<CategoryMetaType>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
};

export type ChapterConditionInput = {
  chapterNumber?: InputMaybe<Scalars['Float']['input']>;
  fetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isDownloaded?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
  lastReadAt?: InputMaybe<Scalars['LongString']['input']>;
  mangaId?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pageCount?: InputMaybe<Scalars['Int']['input']>;
  realUrl?: InputMaybe<Scalars['String']['input']>;
  scanlator?: InputMaybe<Scalars['String']['input']>;
  sourceOrder?: InputMaybe<Scalars['Int']['input']>;
  uploadDate?: InputMaybe<Scalars['LongString']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type ChapterEdge = Edge & {
  __typename?: 'ChapterEdge';
  cursor: Scalars['Cursor']['output'];
  node: ChapterType;
};

export type ChapterFilterInput = {
  and?: InputMaybe<Array<ChapterFilterInput>>;
  chapterNumber?: InputMaybe<FloatFilterInput>;
  fetchedAt?: InputMaybe<LongFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  inLibrary?: InputMaybe<BooleanFilterInput>;
  isBookmarked?: InputMaybe<BooleanFilterInput>;
  isDownloaded?: InputMaybe<BooleanFilterInput>;
  isRead?: InputMaybe<BooleanFilterInput>;
  lastPageRead?: InputMaybe<IntFilterInput>;
  lastReadAt?: InputMaybe<LongFilterInput>;
  mangaId?: InputMaybe<IntFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ChapterFilterInput>;
  or?: InputMaybe<Array<ChapterFilterInput>>;
  pageCount?: InputMaybe<IntFilterInput>;
  realUrl?: InputMaybe<StringFilterInput>;
  scanlator?: InputMaybe<StringFilterInput>;
  sourceOrder?: InputMaybe<IntFilterInput>;
  uploadDate?: InputMaybe<LongFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type ChapterMetaType = MetaType & {
  __typename?: 'ChapterMetaType';
  chapter: ChapterType;
  chapterId: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChapterMetaTypeInput = {
  chapterId: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ChapterNodeList = NodeList & {
  __typename?: 'ChapterNodeList';
  edges: Array<ChapterEdge>;
  nodes: Array<ChapterType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ChapterOrderBy {
  ChapterNumber = 'CHAPTER_NUMBER',
  FetchedAt = 'FETCHED_AT',
  Id = 'ID',
  LastReadAt = 'LAST_READ_AT',
  Name = 'NAME',
  SourceOrder = 'SOURCE_ORDER',
  UploadDate = 'UPLOAD_DATE'
}

export type ChapterType = {
  __typename?: 'ChapterType';
  chapterNumber: Scalars['Float']['output'];
  fetchedAt: Scalars['LongString']['output'];
  id: Scalars['Int']['output'];
  isBookmarked: Scalars['Boolean']['output'];
  isDownloaded: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  lastPageRead: Scalars['Int']['output'];
  lastReadAt: Scalars['LongString']['output'];
  manga: MangaType;
  mangaId: Scalars['Int']['output'];
  meta: Array<ChapterMetaType>;
  name: Scalars['String']['output'];
  pageCount: Scalars['Int']['output'];
  realUrl?: Maybe<Scalars['String']['output']>;
  scanlator?: Maybe<Scalars['String']['output']>;
  sourceOrder: Scalars['Int']['output'];
  uploadDate: Scalars['LongString']['output'];
  url: Scalars['String']['output'];
};

export type CheckBoxFilter = {
  __typename?: 'CheckBoxFilter';
  default: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type CheckBoxPreference = {
  __typename?: 'CheckBoxPreference';
  currentValue?: Maybe<Scalars['Boolean']['output']>;
  default: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type CheckForServerUpdatesPayload = {
  __typename?: 'CheckForServerUpdatesPayload';
  channel: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ClearDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ClearDownloaderPayload = {
  __typename?: 'ClearDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type CreateBackupInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  includeCategories?: InputMaybe<Scalars['Boolean']['input']>;
  includeChapters?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateBackupPayload = {
  __typename?: 'CreateBackupPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type CreateCategoryInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  default?: InputMaybe<Scalars['Boolean']['input']>;
  includeInUpdate?: InputMaybe<IncludeInUpdate>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCategoryPayload = {
  __typename?: 'CreateCategoryPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteCategoryInput = {
  categoryId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteCategoryMetaInput = {
  categoryId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteCategoryMetaPayload = {
  __typename?: 'DeleteCategoryMetaPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<CategoryMetaType>;
};

export type DeleteCategoryPayload = {
  __typename?: 'DeleteCategoryPayload';
  category?: Maybe<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type DeleteChapterMetaInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteChapterMetaPayload = {
  __typename?: 'DeleteChapterMetaPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<ChapterMetaType>;
};

export type DeleteDownloadedChapterInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type DeleteDownloadedChapterPayload = {
  __typename?: 'DeleteDownloadedChapterPayload';
  chapters: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteDownloadedChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type DeleteDownloadedChaptersPayload = {
  __typename?: 'DeleteDownloadedChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteGlobalMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteGlobalMetaPayload = {
  __typename?: 'DeleteGlobalMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<GlobalMetaType>;
};

export type DeleteMangaMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  mangaId: Scalars['Int']['input'];
};

export type DeleteMangaMetaPayload = {
  __typename?: 'DeleteMangaMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
  meta?: Maybe<MangaMetaType>;
};

export type DequeueChapterDownloadInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type DequeueChapterDownloadPayload = {
  __typename?: 'DequeueChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type DequeueChapterDownloadsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type DequeueChapterDownloadsPayload = {
  __typename?: 'DequeueChapterDownloadsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type DownloadEdge = Edge & {
  __typename?: 'DownloadEdge';
  cursor: Scalars['Cursor']['output'];
  node: DownloadType;
};

export type DownloadNodeList = NodeList & {
  __typename?: 'DownloadNodeList';
  edges: Array<DownloadEdge>;
  nodes: Array<DownloadType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum DownloadState {
  Downloading = 'DOWNLOADING',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Queued = 'QUEUED'
}

export type DownloadStatus = {
  __typename?: 'DownloadStatus';
  queue: Array<DownloadType>;
  state: DownloaderState;
};

export type DownloadType = {
  __typename?: 'DownloadType';
  chapter: ChapterType;
  manga: MangaType;
  progress: Scalars['Float']['output'];
  state: DownloadState;
  tries: Scalars['Int']['output'];
};

export enum DownloaderState {
  Started = 'STARTED',
  Stopped = 'STOPPED'
}

export type Edge = {
  /** A cursor for use in pagination. */
  cursor: Scalars['Cursor']['output'];
  /** The [T] at the end of the edge. */
  node: Node;
};

export type EditTextPreference = {
  __typename?: 'EditTextPreference';
  currentValue?: Maybe<Scalars['String']['output']>;
  default?: Maybe<Scalars['String']['output']>;
  dialogMessage?: Maybe<Scalars['String']['output']>;
  dialogTitle?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type EnqueueChapterDownloadInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type EnqueueChapterDownloadPayload = {
  __typename?: 'EnqueueChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type EnqueueChapterDownloadsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type EnqueueChapterDownloadsPayload = {
  __typename?: 'EnqueueChapterDownloadsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type ExtensionConditionInput = {
  apkName?: InputMaybe<Scalars['String']['input']>;
  hasUpdate?: InputMaybe<Scalars['Boolean']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  isInstalled?: InputMaybe<Scalars['Boolean']['input']>;
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
  isObsolete?: InputMaybe<Scalars['Boolean']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pkgName?: InputMaybe<Scalars['String']['input']>;
  versionCode?: InputMaybe<Scalars['Int']['input']>;
  versionName?: InputMaybe<Scalars['String']['input']>;
};

export type ExtensionEdge = Edge & {
  __typename?: 'ExtensionEdge';
  cursor: Scalars['Cursor']['output'];
  node: ExtensionType;
};

export type ExtensionFilterInput = {
  and?: InputMaybe<Array<ExtensionFilterInput>>;
  apkName?: InputMaybe<StringFilterInput>;
  hasUpdate?: InputMaybe<BooleanFilterInput>;
  iconUrl?: InputMaybe<StringFilterInput>;
  isInstalled?: InputMaybe<BooleanFilterInput>;
  isNsfw?: InputMaybe<BooleanFilterInput>;
  isObsolete?: InputMaybe<BooleanFilterInput>;
  lang?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ExtensionFilterInput>;
  or?: InputMaybe<Array<ExtensionFilterInput>>;
  pkgName?: InputMaybe<StringFilterInput>;
  versionCode?: InputMaybe<IntFilterInput>;
  versionName?: InputMaybe<StringFilterInput>;
};

export type ExtensionNodeList = NodeList & {
  __typename?: 'ExtensionNodeList';
  edges: Array<ExtensionEdge>;
  nodes: Array<ExtensionType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ExtensionOrderBy {
  ApkName = 'APK_NAME',
  Name = 'NAME',
  PkgName = 'PKG_NAME'
}

export type ExtensionType = {
  __typename?: 'ExtensionType';
  apkName: Scalars['String']['output'];
  hasUpdate: Scalars['Boolean']['output'];
  iconUrl: Scalars['String']['output'];
  isInstalled: Scalars['Boolean']['output'];
  isNsfw: Scalars['Boolean']['output'];
  isObsolete: Scalars['Boolean']['output'];
  lang: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pkgName: Scalars['String']['output'];
  source: SourceNodeList;
  versionCode: Scalars['Int']['output'];
  versionName: Scalars['String']['output'];
};

export type FetchChapterPagesInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchChapterPagesPayload = {
  __typename?: 'FetchChapterPagesPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  pages: Array<Scalars['String']['output']>;
};

export type FetchChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  mangaId: Scalars['Int']['input'];
};

export type FetchChaptersPayload = {
  __typename?: 'FetchChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type FetchExtensionsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchExtensionsPayload = {
  __typename?: 'FetchExtensionsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extensions: Array<ExtensionType>;
};

export type FetchMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type FetchMangaPayload = {
  __typename?: 'FetchMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type FetchSourceMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<FilterChangeInput>>;
  page: Scalars['Int']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  source: Scalars['LongString']['input'];
  type: FetchSourceMangaType;
};

export type FetchSourceMangaPayload = {
  __typename?: 'FetchSourceMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  mangas: Array<MangaType>;
};

export enum FetchSourceMangaType {
  Latest = 'LATEST',
  Popular = 'POPULAR',
  Search = 'SEARCH'
}

export type Filter = CheckBoxFilter | GroupFilter | HeaderFilter | SelectFilter | SeparatorFilter | SortFilter | TextFilter | TriStateFilter;

export type FilterChangeInput = {
  checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
  groupChange?: InputMaybe<FilterChangeInput>;
  position: Scalars['Int']['input'];
  selectState?: InputMaybe<Scalars['Int']['input']>;
  sortState?: InputMaybe<SortSelectionInput>;
  textState?: InputMaybe<Scalars['String']['input']>;
  triState?: InputMaybe<TriState>;
};

export type FloatFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Float']['input']>;
  equalTo?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Float']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Float']['input']>;
  notEqualTo?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type GlobalMetaNodeList = NodeList & {
  __typename?: 'GlobalMetaNodeList';
  edges: Array<MetaEdge>;
  nodes: Array<GlobalMetaType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GlobalMetaType = MetaType & {
  __typename?: 'GlobalMetaType';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type GlobalMetaTypeInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type GroupFilter = {
  __typename?: 'GroupFilter';
  filters: Array<Filter>;
  name: Scalars['String']['output'];
};

export type HeaderFilter = {
  __typename?: 'HeaderFilter';
  name: Scalars['String']['output'];
};

export enum IncludeInUpdate {
  Exclude = 'EXCLUDE',
  Include = 'INCLUDE',
  Unset = 'UNSET'
}

export type InstallExternalExtensionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  extensionFile: Scalars['Upload']['input'];
};

export type InstallExternalExtensionPayload = {
  __typename?: 'InstallExternalExtensionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extension: ExtensionType;
};

export type IntFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type LastUpdateTimestampPayload = {
  __typename?: 'LastUpdateTimestampPayload';
  timestamp: Scalars['LongString']['output'];
};

export type ListPreference = {
  __typename?: 'ListPreference';
  currentValue?: Maybe<Scalars['String']['output']>;
  default?: Maybe<Scalars['String']['output']>;
  entries: Array<Scalars['String']['output']>;
  entryValues: Array<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LongFilterInput = {
  distinctFrom?: InputMaybe<Scalars['LongString']['input']>;
  equalTo?: InputMaybe<Scalars['LongString']['input']>;
  greaterThan?: InputMaybe<Scalars['LongString']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  in?: InputMaybe<Array<Scalars['LongString']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['LongString']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['LongString']['input']>;
  notEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  notIn?: InputMaybe<Array<Scalars['LongString']['input']>>;
};

export type MangaConditionInput = {
  artist?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  chaptersLastFetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
  inLibraryAt?: InputMaybe<Scalars['LongString']['input']>;
  initialized?: InputMaybe<Scalars['Boolean']['input']>;
  lastFetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  realUrl?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['LongString']['input']>;
  status?: InputMaybe<MangaStatus>;
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type MangaEdge = Edge & {
  __typename?: 'MangaEdge';
  cursor: Scalars['Cursor']['output'];
  node: MangaType;
};

export type MangaFilterInput = {
  and?: InputMaybe<Array<MangaFilterInput>>;
  artist?: InputMaybe<StringFilterInput>;
  author?: InputMaybe<StringFilterInput>;
  chaptersLastFetchedAt?: InputMaybe<LongFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  inLibrary?: InputMaybe<BooleanFilterInput>;
  inLibraryAt?: InputMaybe<LongFilterInput>;
  initialized?: InputMaybe<BooleanFilterInput>;
  lastFetchedAt?: InputMaybe<LongFilterInput>;
  not?: InputMaybe<MangaFilterInput>;
  or?: InputMaybe<Array<MangaFilterInput>>;
  realUrl?: InputMaybe<StringFilterInput>;
  sourceId?: InputMaybe<LongFilterInput>;
  status?: InputMaybe<MangaStatusFilterInput>;
  thumbnailUrl?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type MangaMetaType = MetaType & {
  __typename?: 'MangaMetaType';
  key: Scalars['String']['output'];
  manga: MangaType;
  mangaId: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type MangaMetaTypeInput = {
  key: Scalars['String']['input'];
  mangaId: Scalars['Int']['input'];
  value: Scalars['String']['input'];
};

export type MangaNodeList = NodeList & {
  __typename?: 'MangaNodeList';
  edges: Array<MangaEdge>;
  nodes: Array<MangaType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum MangaOrderBy {
  Id = 'ID',
  InLibraryAt = 'IN_LIBRARY_AT',
  LastFetchedAt = 'LAST_FETCHED_AT',
  Title = 'TITLE'
}

export enum MangaStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Licensed = 'LICENSED',
  Ongoing = 'ONGOING',
  OnHiatus = 'ON_HIATUS',
  PublishingFinished = 'PUBLISHING_FINISHED',
  Unknown = 'UNKNOWN'
}

export type MangaStatusFilterInput = {
  distinctFrom?: InputMaybe<MangaStatus>;
  equalTo?: InputMaybe<MangaStatus>;
  greaterThan?: InputMaybe<MangaStatus>;
  greaterThanOrEqualTo?: InputMaybe<MangaStatus>;
  in?: InputMaybe<Array<MangaStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<MangaStatus>;
  lessThanOrEqualTo?: InputMaybe<MangaStatus>;
  notDistinctFrom?: InputMaybe<MangaStatus>;
  notEqualTo?: InputMaybe<MangaStatus>;
  notIn?: InputMaybe<Array<MangaStatus>>;
};

export type MangaType = {
  __typename?: 'MangaType';
  age?: Maybe<Scalars['LongString']['output']>;
  artist?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  categories: CategoryNodeList;
  chapters: ChapterNodeList;
  chaptersAge?: Maybe<Scalars['LongString']['output']>;
  chaptersLastFetchedAt?: Maybe<Scalars['LongString']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  downloadCount: Scalars['Int']['output'];
  genre: Array<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  inLibrary: Scalars['Boolean']['output'];
  inLibraryAt: Scalars['LongString']['output'];
  initialized: Scalars['Boolean']['output'];
  lastFetchedAt?: Maybe<Scalars['LongString']['output']>;
  lastReadChapter?: Maybe<ChapterType>;
  meta: Array<MangaMetaType>;
  realUrl?: Maybe<Scalars['String']['output']>;
  source?: Maybe<SourceType>;
  sourceId: Scalars['LongString']['output'];
  status: MangaStatus;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unreadCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type MetaConditionInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type MetaEdge = Edge & {
  __typename?: 'MetaEdge';
  cursor: Scalars['Cursor']['output'];
  node: GlobalMetaType;
};

export type MetaFilterInput = {
  and?: InputMaybe<Array<MetaFilterInput>>;
  key?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<MetaFilterInput>;
  or?: InputMaybe<Array<MetaFilterInput>>;
  value?: InputMaybe<StringFilterInput>;
};

export enum MetaOrderBy {
  Key = 'KEY',
  Value = 'VALUE'
}

export type MetaType = {
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MultiSelectListPreference = {
  __typename?: 'MultiSelectListPreference';
  currentValue?: Maybe<Array<Scalars['String']['output']>>;
  default?: Maybe<Array<Scalars['String']['output']>>;
  dialogMessage?: Maybe<Scalars['String']['output']>;
  dialogTitle?: Maybe<Scalars['String']['output']>;
  entries: Array<Scalars['String']['output']>;
  entryValues: Array<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  clearDownloader: ClearDownloaderPayload;
  createBackup: CreateBackupPayload;
  createCategory: CreateCategoryPayload;
  deleteCategory: DeleteCategoryPayload;
  deleteCategoryMeta: DeleteCategoryMetaPayload;
  deleteChapterMeta: DeleteChapterMetaPayload;
  deleteDownloadedChapter: DeleteDownloadedChapterPayload;
  deleteDownloadedChapters: DeleteDownloadedChaptersPayload;
  deleteGlobalMeta: DeleteGlobalMetaPayload;
  deleteMangaMeta: DeleteMangaMetaPayload;
  dequeueChapterDownload: DequeueChapterDownloadPayload;
  dequeueChapterDownloads: DequeueChapterDownloadsPayload;
  enqueueChapterDownload: EnqueueChapterDownloadPayload;
  enqueueChapterDownloads: EnqueueChapterDownloadsPayload;
  fetchChapterPages: FetchChapterPagesPayload;
  fetchChapters: FetchChaptersPayload;
  fetchExtensions: FetchExtensionsPayload;
  fetchManga: FetchMangaPayload;
  fetchSourceManga: FetchSourceMangaPayload;
  installExternalExtension: InstallExternalExtensionPayload;
  reorderChapterDownload: ReorderChapterDownloadPayload;
  resetSettings: ResetSettingsPayload;
  restoreBackup: RestoreBackupPayload;
  setCategoryMeta: SetCategoryMetaPayload;
  setChapterMeta: SetChapterMetaPayload;
  setGlobalMeta: SetGlobalMetaPayload;
  setMangaMeta: SetMangaMetaPayload;
  setSettings: SetSettingsPayload;
  startDownloader: StartDownloaderPayload;
  stopDownloader: StopDownloaderPayload;
  updateCategories: UpdateCategoriesPayload;
  updateCategory: UpdateCategoryPayload;
  updateCategoryManga: UpdateCategoryMangaPayload;
  updateCategoryOrder: UpdateCategoryOrderPayload;
  updateChapter: UpdateChapterPayload;
  updateChapters: UpdateChaptersPayload;
  updateExtension: UpdateExtensionPayload;
  updateExtensions: UpdateExtensionsPayload;
  updateLibraryManga: UpdateLibraryMangaPayload;
  updateManga: UpdateMangaPayload;
  updateMangaCategories: UpdateMangaCategoriesPayload;
  updateMangas: UpdateMangasPayload;
  updateMangasCategories: UpdateMangasCategoriesPayload;
  updateSourcePreference: UpdateSourcePreferencePayload;
  updateStop: UpdateStopPayload;
  updateWebUI: WebUiUpdatePayload;
};


export type MutationClearDownloaderArgs = {
  input: ClearDownloaderInput;
};


export type MutationCreateBackupArgs = {
  input?: InputMaybe<CreateBackupInput>;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};


export type MutationDeleteCategoryMetaArgs = {
  input: DeleteCategoryMetaInput;
};


export type MutationDeleteChapterMetaArgs = {
  input: DeleteChapterMetaInput;
};


export type MutationDeleteDownloadedChapterArgs = {
  input: DeleteDownloadedChapterInput;
};


export type MutationDeleteDownloadedChaptersArgs = {
  input: DeleteDownloadedChaptersInput;
};


export type MutationDeleteGlobalMetaArgs = {
  input: DeleteGlobalMetaInput;
};


export type MutationDeleteMangaMetaArgs = {
  input: DeleteMangaMetaInput;
};


export type MutationDequeueChapterDownloadArgs = {
  input: DequeueChapterDownloadInput;
};


export type MutationDequeueChapterDownloadsArgs = {
  input: DequeueChapterDownloadsInput;
};


export type MutationEnqueueChapterDownloadArgs = {
  input: EnqueueChapterDownloadInput;
};


export type MutationEnqueueChapterDownloadsArgs = {
  input: EnqueueChapterDownloadsInput;
};


export type MutationFetchChapterPagesArgs = {
  input: FetchChapterPagesInput;
};


export type MutationFetchChaptersArgs = {
  input: FetchChaptersInput;
};


export type MutationFetchExtensionsArgs = {
  input: FetchExtensionsInput;
};


export type MutationFetchMangaArgs = {
  input: FetchMangaInput;
};


export type MutationFetchSourceMangaArgs = {
  input: FetchSourceMangaInput;
};


export type MutationInstallExternalExtensionArgs = {
  input: InstallExternalExtensionInput;
};


export type MutationReorderChapterDownloadArgs = {
  input: ReorderChapterDownloadInput;
};


export type MutationResetSettingsArgs = {
  input: ResetSettingsInput;
};


export type MutationRestoreBackupArgs = {
  input: RestoreBackupInput;
};


export type MutationSetCategoryMetaArgs = {
  input: SetCategoryMetaInput;
};


export type MutationSetChapterMetaArgs = {
  input: SetChapterMetaInput;
};


export type MutationSetGlobalMetaArgs = {
  input: SetGlobalMetaInput;
};


export type MutationSetMangaMetaArgs = {
  input: SetMangaMetaInput;
};


export type MutationSetSettingsArgs = {
  input: SetSettingsInput;
};


export type MutationStartDownloaderArgs = {
  input: StartDownloaderInput;
};


export type MutationStopDownloaderArgs = {
  input: StopDownloaderInput;
};


export type MutationUpdateCategoriesArgs = {
  input: UpdateCategoriesInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCategoryMangaArgs = {
  input: UpdateCategoryMangaInput;
};


export type MutationUpdateCategoryOrderArgs = {
  input: UpdateCategoryOrderInput;
};


export type MutationUpdateChapterArgs = {
  input: UpdateChapterInput;
};


export type MutationUpdateChaptersArgs = {
  input: UpdateChaptersInput;
};


export type MutationUpdateExtensionArgs = {
  input: UpdateExtensionInput;
};


export type MutationUpdateExtensionsArgs = {
  input: UpdateExtensionsInput;
};


export type MutationUpdateLibraryMangaArgs = {
  input: UpdateLibraryMangaInput;
};


export type MutationUpdateMangaArgs = {
  input: UpdateMangaInput;
};


export type MutationUpdateMangaCategoriesArgs = {
  input: UpdateMangaCategoriesInput;
};


export type MutationUpdateMangasArgs = {
  input: UpdateMangasInput;
};


export type MutationUpdateMangasCategoriesArgs = {
  input: UpdateMangasCategoriesInput;
};


export type MutationUpdateSourcePreferenceArgs = {
  input: UpdateSourcePreferenceInput;
};


export type MutationUpdateStopArgs = {
  input: UpdateStopInput;
};


export type MutationUpdateWebUiArgs = {
  input: WebUiUpdateInput;
};

export type Node = CategoryMetaType | CategoryType | ChapterMetaType | ChapterType | DownloadType | ExtensionType | GlobalMetaType | MangaMetaType | MangaType | PartialSettingsType | SettingsType | SourceType;

export type NodeList = {
  /** A list of edges which contains the [T] and cursor to aid in pagination. */
  edges: Array<Edge>;
  /** A list of [T] objects. */
  nodes: Array<Node>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of all nodes you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PartialSettingsType = Settings & {
  __typename?: 'PartialSettingsType';
  autoDownloadNewChapters?: Maybe<Scalars['Boolean']['output']>;
  backupInterval?: Maybe<Scalars['Int']['output']>;
  backupPath?: Maybe<Scalars['String']['output']>;
  backupTTL?: Maybe<Scalars['Int']['output']>;
  backupTime?: Maybe<Scalars['String']['output']>;
  basicAuthEnabled?: Maybe<Scalars['Boolean']['output']>;
  basicAuthPassword?: Maybe<Scalars['String']['output']>;
  basicAuthUsername?: Maybe<Scalars['String']['output']>;
  debugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  downloadAsCbz?: Maybe<Scalars['Boolean']['output']>;
  downloadsPath?: Maybe<Scalars['String']['output']>;
  electronPath?: Maybe<Scalars['String']['output']>;
  excludeCompleted?: Maybe<Scalars['Boolean']['output']>;
  excludeNotStarted?: Maybe<Scalars['Boolean']['output']>;
  excludeUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  globalUpdateInterval?: Maybe<Scalars['Float']['output']>;
  initialOpenInBrowserEnabled?: Maybe<Scalars['Boolean']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  localSourcePath?: Maybe<Scalars['String']['output']>;
  maxSourcesInParallel?: Maybe<Scalars['Int']['output']>;
  port?: Maybe<Scalars['Int']['output']>;
  socksProxyEnabled?: Maybe<Scalars['Boolean']['output']>;
  socksProxyHost?: Maybe<Scalars['String']['output']>;
  socksProxyPort?: Maybe<Scalars['String']['output']>;
  systemTrayEnabled?: Maybe<Scalars['Boolean']['output']>;
  webUIChannel?: Maybe<WebUiChannel>;
  webUIFlavor?: Maybe<WebUiFlavor>;
  webUIInterface?: Maybe<WebUiInterface>;
  webUIUpdateCheckInterval?: Maybe<Scalars['Float']['output']>;
};

export type PartialSettingsTypeInput = {
  autoDownloadNewChapters?: InputMaybe<Scalars['Boolean']['input']>;
  backupInterval?: InputMaybe<Scalars['Int']['input']>;
  backupPath?: InputMaybe<Scalars['String']['input']>;
  backupTTL?: InputMaybe<Scalars['Int']['input']>;
  backupTime?: InputMaybe<Scalars['String']['input']>;
  basicAuthEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  basicAuthPassword?: InputMaybe<Scalars['String']['input']>;
  basicAuthUsername?: InputMaybe<Scalars['String']['input']>;
  debugLogsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  downloadAsCbz?: InputMaybe<Scalars['Boolean']['input']>;
  downloadsPath?: InputMaybe<Scalars['String']['input']>;
  electronPath?: InputMaybe<Scalars['String']['input']>;
  excludeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  excludeNotStarted?: InputMaybe<Scalars['Boolean']['input']>;
  excludeUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
  globalUpdateInterval?: InputMaybe<Scalars['Float']['input']>;
  initialOpenInBrowserEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  localSourcePath?: InputMaybe<Scalars['String']['input']>;
  maxSourcesInParallel?: InputMaybe<Scalars['Int']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  socksProxyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  socksProxyHost?: InputMaybe<Scalars['String']['input']>;
  socksProxyPort?: InputMaybe<Scalars['String']['input']>;
  systemTrayEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  webUIChannel?: InputMaybe<WebUiChannel>;
  webUIFlavor?: InputMaybe<WebUiFlavor>;
  webUIInterface?: InputMaybe<WebUiInterface>;
  webUIUpdateCheckInterval?: InputMaybe<Scalars['Float']['input']>;
};

export type Preference = CheckBoxPreference | EditTextPreference | ListPreference | MultiSelectListPreference | SwitchPreference;

export type Query = {
  __typename?: 'Query';
  about: AboutPayload;
  categories: CategoryNodeList;
  category: CategoryType;
  chapter: ChapterType;
  chapters: ChapterNodeList;
  checkForServerUpdates: Array<CheckForServerUpdatesPayload>;
  checkForWebUIUpdate: WebUiUpdateInfo;
  downloadStatus: DownloadStatus;
  extension: ExtensionType;
  extensions: ExtensionNodeList;
  getWebUIUpdateStatus: WebUiUpdateStatus;
  lastUpdateTimestamp: LastUpdateTimestampPayload;
  manga: MangaType;
  mangas: MangaNodeList;
  meta: GlobalMetaType;
  metas: GlobalMetaNodeList;
  restoreStatus: BackupRestoreStatus;
  settings: SettingsType;
  source: SourceType;
  sources: SourceNodeList;
  updateStatus: UpdateStatus;
  validateBackup: ValidateBackupResult;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CategoryConditionInput>;
  filter?: InputMaybe<CategoryFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CategoryOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChapterArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChaptersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChapterConditionInput>;
  filter?: InputMaybe<ChapterFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ChapterOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryExtensionArgs = {
  pkgName: Scalars['String']['input'];
};


export type QueryExtensionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ExtensionConditionInput>;
  filter?: InputMaybe<ExtensionFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExtensionOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryMangaArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMangasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MangaConditionInput>;
  filter?: InputMaybe<MangaFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MangaOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryMetaArgs = {
  key: Scalars['String']['input'];
};


export type QueryMetasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MetaConditionInput>;
  filter?: InputMaybe<MetaFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MetaOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QuerySourceArgs = {
  id: Scalars['LongString']['input'];
};


export type QuerySourcesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SourceConditionInput>;
  filter?: InputMaybe<SourceFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SourceOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryValidateBackupArgs = {
  input: ValidateBackupInput;
};

export type ReorderChapterDownloadInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['Int']['input'];
};

export type ReorderChapterDownloadPayload = {
  __typename?: 'ReorderChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type ResetSettingsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ResetSettingsPayload = {
  __typename?: 'ResetSettingsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  settings: SettingsType;
};

export type RestoreBackupInput = {
  backup: Scalars['Upload']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type RestoreBackupPayload = {
  __typename?: 'RestoreBackupPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  status: BackupRestoreStatus;
};

export type SelectFilter = {
  __typename?: 'SelectFilter';
  default: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
};

export type SeparatorFilter = {
  __typename?: 'SeparatorFilter';
  name: Scalars['String']['output'];
};

export type SetCategoryMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: CategoryMetaTypeInput;
};

export type SetCategoryMetaPayload = {
  __typename?: 'SetCategoryMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: CategoryMetaType;
};

export type SetChapterMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: ChapterMetaTypeInput;
};

export type SetChapterMetaPayload = {
  __typename?: 'SetChapterMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: ChapterMetaType;
};

export type SetGlobalMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: GlobalMetaTypeInput;
};

export type SetGlobalMetaPayload = {
  __typename?: 'SetGlobalMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: GlobalMetaType;
};

export type SetMangaMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: MangaMetaTypeInput;
};

export type SetMangaMetaPayload = {
  __typename?: 'SetMangaMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: MangaMetaType;
};

export type SetSettingsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  settings: PartialSettingsTypeInput;
};

export type SetSettingsPayload = {
  __typename?: 'SetSettingsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  settings: SettingsType;
};

export type Settings = {
  autoDownloadNewChapters?: Maybe<Scalars['Boolean']['output']>;
  backupInterval?: Maybe<Scalars['Int']['output']>;
  backupPath?: Maybe<Scalars['String']['output']>;
  backupTTL?: Maybe<Scalars['Int']['output']>;
  backupTime?: Maybe<Scalars['String']['output']>;
  basicAuthEnabled?: Maybe<Scalars['Boolean']['output']>;
  basicAuthPassword?: Maybe<Scalars['String']['output']>;
  basicAuthUsername?: Maybe<Scalars['String']['output']>;
  debugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  downloadAsCbz?: Maybe<Scalars['Boolean']['output']>;
  downloadsPath?: Maybe<Scalars['String']['output']>;
  electronPath?: Maybe<Scalars['String']['output']>;
  excludeCompleted?: Maybe<Scalars['Boolean']['output']>;
  excludeNotStarted?: Maybe<Scalars['Boolean']['output']>;
  excludeUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  globalUpdateInterval?: Maybe<Scalars['Float']['output']>;
  initialOpenInBrowserEnabled?: Maybe<Scalars['Boolean']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  localSourcePath?: Maybe<Scalars['String']['output']>;
  maxSourcesInParallel?: Maybe<Scalars['Int']['output']>;
  port?: Maybe<Scalars['Int']['output']>;
  socksProxyEnabled?: Maybe<Scalars['Boolean']['output']>;
  socksProxyHost?: Maybe<Scalars['String']['output']>;
  socksProxyPort?: Maybe<Scalars['String']['output']>;
  systemTrayEnabled?: Maybe<Scalars['Boolean']['output']>;
  webUIChannel?: Maybe<WebUiChannel>;
  webUIFlavor?: Maybe<WebUiFlavor>;
  webUIInterface?: Maybe<WebUiInterface>;
  webUIUpdateCheckInterval?: Maybe<Scalars['Float']['output']>;
};

export type SettingsType = Settings & {
  __typename?: 'SettingsType';
  autoDownloadNewChapters: Scalars['Boolean']['output'];
  backupInterval: Scalars['Int']['output'];
  backupPath: Scalars['String']['output'];
  backupTTL: Scalars['Int']['output'];
  backupTime: Scalars['String']['output'];
  basicAuthEnabled: Scalars['Boolean']['output'];
  basicAuthPassword: Scalars['String']['output'];
  basicAuthUsername: Scalars['String']['output'];
  debugLogsEnabled: Scalars['Boolean']['output'];
  downloadAsCbz: Scalars['Boolean']['output'];
  downloadsPath: Scalars['String']['output'];
  electronPath: Scalars['String']['output'];
  excludeCompleted: Scalars['Boolean']['output'];
  excludeNotStarted: Scalars['Boolean']['output'];
  excludeUnreadChapters: Scalars['Boolean']['output'];
  globalUpdateInterval: Scalars['Float']['output'];
  initialOpenInBrowserEnabled: Scalars['Boolean']['output'];
  ip: Scalars['String']['output'];
  localSourcePath: Scalars['String']['output'];
  maxSourcesInParallel: Scalars['Int']['output'];
  port: Scalars['Int']['output'];
  socksProxyEnabled: Scalars['Boolean']['output'];
  socksProxyHost: Scalars['String']['output'];
  socksProxyPort: Scalars['String']['output'];
  systemTrayEnabled: Scalars['Boolean']['output'];
  webUIChannel: WebUiChannel;
  webUIFlavor: WebUiFlavor;
  webUIInterface: WebUiInterface;
  webUIUpdateCheckInterval: Scalars['Float']['output'];
};

export type SortFilter = {
  __typename?: 'SortFilter';
  default?: Maybe<SortSelection>;
  name: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
};

export enum SortOrder {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type SortSelection = {
  __typename?: 'SortSelection';
  ascending: Scalars['Boolean']['output'];
  index: Scalars['Int']['output'];
};

export type SortSelectionInput = {
  ascending: Scalars['Boolean']['input'];
  index: Scalars['Int']['input'];
};

export type SourceConditionInput = {
  id?: InputMaybe<Scalars['LongString']['input']>;
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SourceEdge = Edge & {
  __typename?: 'SourceEdge';
  cursor: Scalars['Cursor']['output'];
  node: SourceType;
};

export type SourceFilterInput = {
  and?: InputMaybe<Array<SourceFilterInput>>;
  id?: InputMaybe<LongFilterInput>;
  isNsfw?: InputMaybe<BooleanFilterInput>;
  lang?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<SourceFilterInput>;
  or?: InputMaybe<Array<SourceFilterInput>>;
};

export type SourceNodeList = NodeList & {
  __typename?: 'SourceNodeList';
  edges: Array<SourceEdge>;
  nodes: Array<SourceType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum SourceOrderBy {
  Id = 'ID',
  Lang = 'LANG',
  Name = 'NAME'
}

export type SourcePreferenceChangeInput = {
  checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
  editTextState?: InputMaybe<Scalars['String']['input']>;
  listState?: InputMaybe<Scalars['String']['input']>;
  multiSelectState?: InputMaybe<Array<Scalars['String']['input']>>;
  position: Scalars['Int']['input'];
  switchState?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SourceType = {
  __typename?: 'SourceType';
  displayName: Scalars['String']['output'];
  extension: ExtensionType;
  filters: Array<Filter>;
  iconUrl: Scalars['String']['output'];
  id: Scalars['LongString']['output'];
  isConfigurable: Scalars['Boolean']['output'];
  isNsfw: Scalars['Boolean']['output'];
  lang: Scalars['String']['output'];
  manga: MangaNodeList;
  name: Scalars['String']['output'];
  preferences: Array<Preference>;
  supportsLatest: Scalars['Boolean']['output'];
};

export type StartDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StartDownloaderPayload = {
  __typename?: 'StartDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type StopDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StopDownloaderPayload = {
  __typename?: 'StopDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type StringFilterInput = {
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  equalTo?: InputMaybe<Scalars['String']['input']>;
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  includes?: InputMaybe<Scalars['String']['input']>;
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['String']['input']>;
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  notLike?: InputMaybe<Scalars['String']['input']>;
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  downloadChanged: DownloadStatus;
  updateStatusChanged: UpdateStatus;
  webUIUpdateStatusChange: WebUiUpdateStatus;
};

export type SwitchPreference = {
  __typename?: 'SwitchPreference';
  currentValue?: Maybe<Scalars['Boolean']['output']>;
  default: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type TextFilter = {
  __typename?: 'TextFilter';
  default: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum TriState {
  Exclude = 'EXCLUDE',
  Ignore = 'IGNORE',
  Include = 'INCLUDE'
}

export type TriStateFilter = {
  __typename?: 'TriStateFilter';
  default: TriState;
  name: Scalars['String']['output'];
};

export type UpdateCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateCategoryPatchInput;
};

export type UpdateCategoriesPayload = {
  __typename?: 'UpdateCategoriesPayload';
  categories: Array<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateCategoryPatchInput;
};

export type UpdateCategoryMangaInput = {
  categories: Array<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryMangaPayload = {
  __typename?: 'UpdateCategoryMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: UpdateStatus;
};

export type UpdateCategoryOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  position: Scalars['Int']['input'];
};

export type UpdateCategoryOrderPayload = {
  __typename?: 'UpdateCategoryOrderPayload';
  categories: Array<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryPatchInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  includeInUpdate?: InputMaybe<IncludeInUpdate>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryPayload = {
  __typename?: 'UpdateCategoryPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChapterInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateChapterPatchInput;
};

export type UpdateChapterPatchInput = {
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateChapterPayload = {
  __typename?: 'UpdateChapterPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateChapterPatchInput;
};

export type UpdateChaptersPayload = {
  __typename?: 'UpdateChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateExtensionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionPatchInput = {
  install?: InputMaybe<Scalars['Boolean']['input']>;
  uninstall?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateExtensionPayload = {
  __typename?: 'UpdateExtensionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extension: ExtensionType;
};

export type UpdateExtensionsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['String']['input']>;
  patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionsPayload = {
  __typename?: 'UpdateExtensionsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extensions: Array<ExtensionType>;
};

export type UpdateLibraryMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLibraryMangaPayload = {
  __typename?: 'UpdateLibraryMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: UpdateStatus;
};

export type UpdateMangaCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangaCategoriesPatchInput = {
  addToCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
  clearCategories?: InputMaybe<Scalars['Boolean']['input']>;
  removeFromCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateMangaCategoriesPayload = {
  __typename?: 'UpdateMangaCategoriesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type UpdateMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateMangaPatchInput;
};

export type UpdateMangaPatchInput = {
  inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMangaPayload = {
  __typename?: 'UpdateMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type UpdateMangasCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangasCategoriesPayload = {
  __typename?: 'UpdateMangasCategoriesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type UpdateMangasInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateMangaPatchInput;
};

export type UpdateMangasPayload = {
  __typename?: 'UpdateMangasPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type UpdateSourcePreferenceInput = {
  change: SourcePreferenceChangeInput;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  source: Scalars['LongString']['input'];
};

export type UpdateSourcePreferencePayload = {
  __typename?: 'UpdateSourcePreferencePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  preferences: Array<Preference>;
};

export enum UpdateState {
  Downloading = 'DOWNLOADING',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Stopped = 'STOPPED'
}

export type UpdateStatus = {
  __typename?: 'UpdateStatus';
  completeJobs: UpdateStatusType;
  failedJobs: UpdateStatusType;
  isRunning: Scalars['Boolean']['output'];
  pendingJobs: UpdateStatusType;
  runningJobs: UpdateStatusType;
  skippedCategories: UpdateStatusCategoryType;
  skippedJobs: UpdateStatusType;
  updatingCategories: UpdateStatusCategoryType;
};

export type UpdateStatusCategoryType = {
  __typename?: 'UpdateStatusCategoryType';
  categories: CategoryNodeList;
};

export type UpdateStatusType = {
  __typename?: 'UpdateStatusType';
  mangas: MangaNodeList;
};

export type UpdateStopInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStopPayload = {
  __typename?: 'UpdateStopPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ValidateBackupInput = {
  backup: Scalars['Upload']['input'];
};

export type ValidateBackupResult = {
  __typename?: 'ValidateBackupResult';
  missingSources: Array<ValidateBackupSource>;
};

export type ValidateBackupSource = {
  __typename?: 'ValidateBackupSource';
  id: Scalars['LongString']['output'];
  name: Scalars['String']['output'];
};

export enum WebUiChannel {
  Bundled = 'BUNDLED',
  Preview = 'PREVIEW',
  Stable = 'STABLE'
}

export enum WebUiFlavor {
  Custom = 'CUSTOM',
  Webui = 'WEBUI'
}

export enum WebUiInterface {
  Browser = 'BROWSER',
  Electron = 'ELECTRON'
}

export type WebUiUpdateInfo = {
  __typename?: 'WebUIUpdateInfo';
  channel: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  updateAvailable: Scalars['Boolean']['output'];
};

export type WebUiUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type WebUiUpdatePayload = {
  __typename?: 'WebUIUpdatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: WebUiUpdateStatus;
};

export type WebUiUpdateStatus = {
  __typename?: 'WebUIUpdateStatus';
  info: WebUiUpdateInfo;
  progress: Scalars['Int']['output'];
  state: UpdateState;
};

export type FetchMangaChaptersMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FetchMangaChaptersMutation = { __typename?: 'Mutation', fetchManga: { __typename?: 'FetchMangaPayload', manga: { __typename?: 'MangaType', id: number, title: string, lastFetchedAt?: any | null, thumbnailUrl?: string | null, lastReadChapter?: { __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean } | null } }, fetchChapters: { __typename?: 'FetchChaptersPayload', chapters: Array<{ __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean }> } };

export type ClearDownloaderMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearDownloaderMutation = { __typename?: 'Mutation', clearDownloader: { __typename?: 'ClearDownloaderPayload', downloadStatus: { __typename?: 'DownloadStatus', state: DownloaderState } } };

export type EnqueueChapterDownloadsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type EnqueueChapterDownloadsMutation = { __typename?: 'Mutation', enqueueChapterDownloads: { __typename?: 'EnqueueChapterDownloadsPayload', clientMutationId?: string | null } };

export type StartDownloaderMutationVariables = Exact<{ [key: string]: never; }>;


export type StartDownloaderMutation = { __typename?: 'Mutation', startDownloader: { __typename?: 'StartDownloaderPayload', downloadStatus: { __typename?: 'DownloadStatus', state: DownloaderState } } };

export type MangasQueryVariables = Exact<{ [key: string]: never; }>;


export type MangasQuery = { __typename?: 'Query', mangas: { __typename?: 'MangaNodeList', nodes: Array<{ __typename?: 'MangaType', id: number, title: string, lastFetchedAt?: any | null, thumbnailUrl?: string | null, chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean }> }, lastReadChapter?: { __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean } | null }> } };

export type MangaQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type MangaQuery = { __typename?: 'Query', manga: { __typename?: 'MangaType', id: number, title: string, lastFetchedAt?: any | null, thumbnailUrl?: string | null, chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean }> }, lastReadChapter?: { __typename?: 'ChapterType', name: string, chapterNumber: number, id: number, isDownloaded: boolean, sourceOrder: number, isRead: boolean } | null } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any>) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const FetchMangaChaptersDocument = new TypedDocumentString(`
    mutation fetchMangaChapters($id: Int!) {
  fetchManga(input: {id: $id}) {
    manga {
      id
      title
      lastFetchedAt
      thumbnailUrl
      lastReadChapter {
        name
        chapterNumber
        id
        isDownloaded
        sourceOrder
        isRead
      }
    }
  }
  fetchChapters(input: {mangaId: $id}) {
    chapters {
      name
      chapterNumber
      id
      isDownloaded
      sourceOrder
      isRead
    }
  }
}
    `) as unknown as TypedDocumentString<FetchMangaChaptersMutation, FetchMangaChaptersMutationVariables>;
export const ClearDownloaderDocument = new TypedDocumentString(`
    mutation clearDownloader {
  clearDownloader(input: {clientMutationId: ""}) {
    downloadStatus {
      state
    }
  }
}
    `) as unknown as TypedDocumentString<ClearDownloaderMutation, ClearDownloaderMutationVariables>;
export const EnqueueChapterDownloadsDocument = new TypedDocumentString(`
    mutation enqueueChapterDownloads($ids: [Int!]!) {
  enqueueChapterDownloads(input: {ids: $ids}) {
    clientMutationId
  }
}
    `) as unknown as TypedDocumentString<EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsMutationVariables>;
export const StartDownloaderDocument = new TypedDocumentString(`
    mutation startDownloader {
  startDownloader(input: {clientMutationId: ""}) {
    downloadStatus {
      state
    }
  }
}
    `) as unknown as TypedDocumentString<StartDownloaderMutation, StartDownloaderMutationVariables>;
export const MangasDocument = new TypedDocumentString(`
    query mangas {
  mangas(condition: {inLibrary: true}) {
    nodes {
      id
      title
      lastFetchedAt
      thumbnailUrl
      chapters {
        nodes {
          name
          chapterNumber
          id
          isDownloaded
          sourceOrder
          isRead
        }
      }
      lastReadChapter {
        name
        chapterNumber
        id
        isDownloaded
        sourceOrder
        isRead
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MangasQuery, MangasQueryVariables>;
export const MangaDocument = new TypedDocumentString(`
    query manga($id: Int!) {
  manga(id: $id) {
    id
    title
    lastFetchedAt
    thumbnailUrl
    chapters {
      nodes {
        name
        chapterNumber
        id
        isDownloaded
        sourceOrder
        isRead
      }
    }
    lastReadChapter {
      name
      chapterNumber
      id
      isDownloaded
      sourceOrder
      isRead
    }
  }
}
    `) as unknown as TypedDocumentString<MangaQuery, MangaQueryVariables>;