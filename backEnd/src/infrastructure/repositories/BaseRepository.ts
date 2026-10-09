
import {
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose';

import { IBaseRepository } from '../../domain/interfaces/repositories/IBaseRepository.js';

export abstract class BaseRepository<TEntity, TCreate>
  implements IBaseRepository<TEntity, TCreate>
{
  protected constructor(
    protected readonly _model: Model<any>
  ) {}

  async create(data: TCreate): Promise<TEntity> {
    const document = await this._model.create(
      data as Record<string, unknown>
    );

    return this.map(document);
  }

  async findById(id: string): Promise<TEntity | null> {
    const document = await this._model.findById(id).exec();

    return document ? this.map(document) : null;
  }

  async update(
    id: string,
    data: Partial<TEntity>
  ): Promise<TEntity | null> {
    const document = await this._model
      .findByIdAndUpdate(
        id,
        { $set: data } as UpdateQuery<any>,
        { new: true, runValidators: true }
      )
      .exec();

    return document ? this.map(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteDocument({ _id: id });
  }

  protected async deleteDocument(
    filter: FilterQuery<any>
  ): Promise<boolean> {
    const result = await this._model.deleteOne(filter).exec();

    return result.deletedCount === 1;
  }

  protected abstract map(document: any): TEntity;
}
