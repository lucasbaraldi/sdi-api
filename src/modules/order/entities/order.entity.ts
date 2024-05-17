export class Order {
  id: number
  dtEmissao: Date
  idCliente: number
  codTransp?: number
  codFormaPgto?: number
  codBanco?: number
  vlrFrete?: number
  vlrTotal: number
  vlrProd: number
  tipoFrete?: string
  obs?: string
  status: string
  email?: string
  codVendedor: number
  nroControle?: number
  hrEmissao?: string
  nroTablet?: number
}
