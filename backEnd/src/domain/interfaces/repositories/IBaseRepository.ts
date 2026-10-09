
export interface IBaseRepository<TEntity, TCreate> {
  create(data: TCreate): Promise<TEntity>;

  findById(id: string): Promise<TEntity | null>;

  update(
    id: string,
    data: Partial<TEntity>
  ): Promise<TEntity | null>;

  delete(id: string): Promise<boolean>;
}
