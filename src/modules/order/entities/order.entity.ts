import { OrderItem } from './order-item.entity'

export class Order {
  id: number
  cod_empresa: number
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
  codVendedor: number
  nroControle?: number
  itens?: OrderItem[]
}
