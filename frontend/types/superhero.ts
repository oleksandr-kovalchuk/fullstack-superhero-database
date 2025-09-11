export interface SuperheroImage {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
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

export interface Superhero {
  id: string;
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
  images: SuperheroImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuperheroData {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
  images?: FileList | File[];
}

export interface UpdateSuperheroData extends Partial<Omit<CreateSuperheroData, 'images'>> {
  id: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SuperheroListResponse {
  success: boolean;
  data: SuperheroListItem[];
  pagination: PaginationData;
}

export interface SuperheroResponse {
  success: boolean;
  data: Superhero;
}