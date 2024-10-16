import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { buscaParametro, formatClientFields, normalizeName, normalizePhoneNumber } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getAllClients(cod_empresa) {
    const separaClientes = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query:
          separaClientes == 'S'
            ? `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email, cod_cidade, cod_classcli
          from clientes
          where TIPO_CLI = 'A' and cod_empresa = ${cod_empresa} and status_cliforn != 'F' and status_cliforn != 'T'
          order by cod_cliente
        `
            : `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email, cod_cidade, cod_classcli  
          from clientes
          where TIPO_CLI = 'A' and status_cliforn != 'F' and status_cliforn != 'T'
          order by cod_cliente
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.NOME = r.NOME ? r.NOME.trim() : r.NOME
              r.ENDERECO = r.ENDERECO ? r.ENDERECO.trim() : r.ENDERECO
              r.COMPLEMENTO = r.COMPLEMENTO
                ? r.COMPLEMENTO.trim()
                : r.COMPLEMENTO
              r.BAIRRO = r.BAIRRO ? r.BAIRRO.trim() : r.BAIRRO
              r.CEP = r.CEP ? r.CEP.trim() : r.CEP
              r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
              r.CPF = r.CPF ? r.CPF.trim() : r.CPF
              r.FONE = r.FONE ? r.FONE.trim() : r.FONE
              r.EMAIL = r.EMAIL ? r.EMAIL.trim() : r.EMAIL
            })
            resolve(result)
          }
        }
      })
    })
  }

  async getOneClient(cod_empresa: number, cod_cliente: number) {
    const separaClientes = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query:
          separaClientes == 'S'
            ? `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email, cod_cidade, cod_classcli
          from clientes
          where TIPO_CLI = 'A' and cod_empresa = ${cod_empresa} and cod_cliente = ${cod_cliente} and status_cliforn != 'F' and status_cliforn != 'T'
          order by cod_cliente
        `
            : `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email, cod_cidade, cod_classcli
          from clientes
          where TIPO_CLI = 'A' and cod_cliente = ${cod_cliente} and status_cliforn != 'F' and status_cliforn != 'T'
          order by cod_cliente
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.NOME = r.NOME ? r.NOME.trim() : r.NOME
              r.ENDERECO = r.ENDERECO ? r.ENDERECO.trim() : r.ENDERECO
              r.COMPLEMENTO = r.COMPLEMENTO
                ? r.COMPLEMENTO.trim()
                : r.COMPLEMENTO
              r.BAIRRO = r.BAIRRO ? r.BAIRRO.trim() : r.BAIRRO
              r.CEP = r.CEP ? r.CEP.trim() : r.CEP
              r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
              r.CPF = r.CPF ? r.CPF.trim() : r.CPF
              r.FONE = r.FONE ? r.FONE.trim() : r.FONE
              r.EMAIL = r.EMAIL ? r.EMAIL.trim() : r.EMAIL
            })
            resolve(result)
          }
        }
      })
    })
  }

  async quickCreateClient(name: string, phone?: string) {
    // Verificar o parâmetro CADASTRO_DADOS_MINIMOS
    const cadastroDadosMinimos = await new Promise((resolve) => {
      buscaParametro(this.firebirdClient, 'CADASTRO_DADOS_MINIMOS', (result) => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result[0].VALOR_PARAM);
        } else if (typeof result === 'object' && result.VALOR_PARAM) {
          resolve(result.VALOR_PARAM);
        } else {
          resolve(result);
        }
      });
    });

    if (typeof cadastroDadosMinimos !== 'string') {
      this.logger.error(`Valor inesperado para CADASTRO_DADOS_MINIMOS: ${JSON.stringify(cadastroDadosMinimos)}`);
      throw new BadRequestException('Erro ao verificar configuração de cadastro mínimo.');
    }
    
    if (cadastroDadosMinimos.toUpperCase() !== 'S') {
      throw new BadRequestException('É necessário habilitar o cadastro com dados mínimos no Sistema.');
    }

    if (!name) {
      this.logger.error('Tentativa de criar cliente sem nome');
      throw new BadRequestException('Nome do cliente é obrigatório');
    }

    const normalizedName = normalizeName(name);
    const normalizedPhone = normalizePhoneNumber(phone);
    const cityCode = await this.getCompanyCityCode();

    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
          INSERT INTO clientes (
            COD_CLIENTE, NOME, ENDERECO, NUMERO, BAIRRO, COD_CIDADE, CELULAR, TIPO_CLI, STATUS_CLIFORN,
            DT_CAD, TIPO_PESSOA
          ) VALUES (
            (SELECT COALESCE(MAX(COD_CLIENTE), 0) + 1 FROM clientes),
            ?, 'RUA A', 'S/N', 'SEM BAIRRO', ?, ?, 'A', 'A',
            CURRENT_DATE, 'F'
          ) RETURNING COD_CLIENTE, NOME, ENDERECO, NUMERO, BAIRRO, COD_CIDADE, CELULAR, TIPO_CLI, STATUS_CLIFORN,
            DT_CAD, TIPO_PESSOA
        `,
        params: [normalizedName, cityCode, normalizedPhone],
        buffer: async (result: any, err: any) => {
          if (err) {
            this.logger.error(`Erro ao inserir cliente: ${err.message}`);
            reject(err);
          } else {
            if (result && typeof result === 'object' && 'COD_CLIENTE' in result) {
              const newClient = formatClientFields(result);
              resolve(newClient);
            } else {
              this.logger.error('Resultado inesperado ao inserir cliente');
              this.logger.error(`Resultado: ${JSON.stringify(result)}`);
              reject(new Error('Falha ao inserir novo cliente'));
            }
          }
        }
      });
    });
  }

  private async getCompanyCityCode(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: 'SELECT FIRST 1 COD_CIDADE FROM EMPRESAS',
        params: [],
        buffer: (result: any) => {
          if (result && result.length > 0 && result[0].COD_CIDADE) {
            resolve(result[0].COD_CIDADE);
          } else {
            this.logger.error('Não foi possível obter o código da cidade da empresa');
            reject(new Error('Código da cidade da empresa não encontrado'));
          }
        }
      });
    });
  }
  
  async findClientByName(name: string): Promise<any | null> {
    const normalizedName = normalizeName(name);
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
          SELECT FIRST 1 COD_CLIENTE, NOME, ENDERECO, NUMERO, BAIRRO, COD_CIDADE, CELULAR, TIPO_CLI, STATUS_CLIFORN,
            DT_CAD, TIPO_PESSOA
          FROM clientes
          WHERE UPPER(NOME) = UPPER(?)
          AND TIPO_CLI = 'A'
          AND STATUS_CLIFORN != 'F'
          AND STATUS_CLIFORN != 'T'
        `,
        params: [normalizedName],
        buffer: (result: any, err: any) => {
          if (err) {
            this.logger.error(`Erro ao buscar cliente por nome: ${err.message}`);
            reject(err);
          } else {
            if (result && result.length > 0) {
              resolve(formatClientFields(result[0]));
            } else {
              resolve(null);
            }
          }
        }
      });
    });
  }
}
