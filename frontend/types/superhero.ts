export interface SuperheroImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Superhero {
  id: string;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: SuperheroImage[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateSuperheroData {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: Omit<SuperheroImage, 'id'>[];
}

export interface UpdateSuperheroData extends Partial<CreateSuperheroData> {
  id: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuperheroListResponse {
  superheroes: Superhero[];
  pagination: PaginationData;
}