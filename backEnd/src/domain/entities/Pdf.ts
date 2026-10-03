export class Pdf {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public fileName: string,
    public readonly pageCount: number,
    public readonly fileSize: number,
    public readonly gridFsId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}