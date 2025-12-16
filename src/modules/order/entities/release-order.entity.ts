export class ReleaseOrder {
  id: number
  salesRepId: number
  productId: number
  requestId: string
  released: string
  creationDate: Date
  releaseDate?: Date
  originalPrice: number
  salePrice: number
}
