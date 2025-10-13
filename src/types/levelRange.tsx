export interface LevelRange {
  id: string
  name: string
  fromExp: number
  toExp: number
  isActive: boolean
  createdAt: string
}

export interface LevelRangesListResponse {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
  data: LevelRange[]
  succeeded: boolean
  message: string
}

export interface CreateLevelRangeData {
  name: string
  fromExp: number
  toExp: number
}

export interface UpdateLevelRangeData {
  id: string
  name: string
  fromExp: number
  toExp: number
}
