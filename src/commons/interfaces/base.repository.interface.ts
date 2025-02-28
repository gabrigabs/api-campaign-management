export interface BaseRepositoryInterface<T, CreateDto, UpdateDto> {
  create(data: CreateDto): Promise<T>;
  findAll(filter?: any): Promise<T[]>;
  findBy(params: Partial<T>): Promise<T | null>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
