export interface BaseRepositoryInterface<T, CreateDto, UpdateDto> {
  create(data: CreateDto): Promise<T>;
  findAll(skip: number, take: number, where: Partial<T>): Promise<T[]>;
  findBy(params: Partial<T>): Promise<T | null>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
