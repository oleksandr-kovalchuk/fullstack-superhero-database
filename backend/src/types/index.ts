export interface CreateSuperheroRequest {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
}

export interface UpdateSuperheroRequest {
  nickname?: string;
  realName?: string;
  originDescription?: string;
  superpowers?: string;
  catchPhrase?: string;
}

export interface SuperheroListItem {
  id: string;
  nickname: string;
  image?: {
    id: string;
    filename: string;
    path: string;
  };
}

export interface SuperheroDetails {
  id: string;
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
  images: Array<{
    id: string;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
