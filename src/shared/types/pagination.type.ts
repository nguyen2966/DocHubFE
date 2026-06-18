export interface PagePaginatedMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PagePaginatedResponse<T> {
  data: T[]
  meta: PagePaginatedMeta
}
