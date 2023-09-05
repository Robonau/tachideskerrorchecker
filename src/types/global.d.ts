export {}

declare global {
  interface source {
    id: string
    name: string
    lang: string
    iconUrl: string
    supportsLatest: boolean
    isConfigurable: boolean
    isNsfw: boolean
    displayName: string
  }

  interface Category {
    id: number
    order: number
    name: string
    default: boolean
    size: number
    includeInUpdate: any
    meta: Record<string, unknown>
  }

  interface Manga {
    id: number
    sourceId: string
    url: string
    title: string
    thumbnailUrl: string
    thumbnailUrlLastFetched: number
    initialized: boolean
    artist: string
    author: string
    description: string
    genre: string[]
    status: string
    inLibrary: boolean
    inLibraryAt: number
    source: source
    meta: Record<string, unknown>
    realUrl: string
    lastFetchedAt: number
    chaptersLastFetchedAt: number
    updateStrategy: any
    freshData: boolean
    unreadCount: number
    downloadCount: number
    chapterCount: number
    lastReadAt: number
    lastChapterRead: Chapter
    age: number
    chaptersAge: number
  }

  interface Chapter {
    id: number
    url: string
    name: string
    uploadDate: number
    chapterNumber: number
    scanlator: string
    mangaId: number
    read: boolean
    bookmarked: boolean
    lastPageRead: number
    lastReadAt: number
    index: number
    fetchedAt: number
    realUrl?: string
    downloaded: boolean
    pageCount: number
    chapterCount: number
    meta: Record<string, unknown>
  }

  interface prismachapter extends Chapter {
    lastChapterReadID?: number
    id?: number
    meta?: Record<string, unknown>
  }
}
