export interface UploadPdfFileDTO {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export interface UploadPdfInputDTO {
  userId: string;
  file: UploadPdfFileDTO;
}