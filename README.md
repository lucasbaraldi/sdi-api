# SDI API

> API robusta desenvolvida em NestJS para o Sistema de Dados Integrados (SDI), oferecendo endpoints RESTful para gestão completa de operações comerciais.

## 📥 Download

[![Latest Release](https://img.shields.io/github/v/release/lucasbaraldi/sdi-api?label=Download&style=for-the-badge)](https://github.com/lucasbaraldi/sdi-api/releases/latest)
[![Build Status](https://img.shields.io/github/actions/workflow/status/lucasbaraldi/sdi-api/build-release.yml?branch=main&style=for-the-badge&label=Build)](https://github.com/lucasbaraldi/sdi-api/actions)

**[⬇️ Baixar última versão (.exe)](https://github.com/lucasbaraldi/sdi-api/releases/latest)**

> O executável é gerado automaticamente via GitHub Actions quando um PR é mergeado na branch `main`.

## 📋 Índice

- [Download](#-download)
- [Sobre o Projeto](#sobre-o-projeto)
- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Empacotamento](#empacotamento)
- [CI/CD](#cicd)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Troubleshooting](#troubleshooting)

## 📖 Sobre o Projeto

A SDI API é uma aplicação backend desenvolvida para gerenciar operações comerciais de forma integrada, incluindo:

- **Gestão de Pedidos**: Criação, consulta e processamento de pedidos
- **Controle de Estoque**: Movimentações e consultas de produtos
- **Gestão de Clientes**: CRUD completo de informações de clientes
- **Sistema de Comandas**: Controle de comandas para estabelecimentos
- **Tabelas de Preços**: Gerenciamento de preços por cliente/produto
- **Integração com Firebird**: Conexão nativa com banco de dados Firebird

## ✨ Recursos

- 🚀 **Alta Performance** - Arquitetura otimizada com NestJS
- 🔒 **Segurança** - HTTPS obrigatório com certificados SSL
- 📊 **Documentação Automática** - Swagger/OpenAPI integrado
- 🗃️ **Banco Firebird** - Integração nativa com charset ISO8859_1
- 📦 **Executável Standalone** - Geração de .exe para Windows
- 🛡️ **Tratamento de Erros** - Sistema robusto de captura e logging
- 🧹 **Sanitização de Dados** - Prevenção automática de erros de charset

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **NPM** 8+
- **Firebird** 2.5+ (com banco configurado)
- **Windows** (para executável .exe)
- **Certificados SSL** (key.pem e cert.pem)

## 🚀 Instalação

1. **Clone o repositório**:
   ```bash
   git clone [url-do-repositorio]
   cd sdi-api
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o ambiente** (ver seção [Configuração](#configuração))

## ⚙️ Configuração

### Arquivo DBSDI.INI
Crie o arquivo `DBSDI.INI` na raiz do projeto:
```ini
[INICIALIZACAO]
CAMINHO_GDB=C:\Caminho\Para\Banco\
NOME_GDB=BANCO.FDB
USER_NAME=SYSDBA
PASSWORD=masterkey
```

### Certificados SSL
Coloque os certificados na pasta `certificate/`:
- `certificate/key.pem` - Chave privada
- `certificate/cert.pem` - Certificado público

### Variáveis de Ambiente
Crie um arquivo `.env` (opcional):
```env
PORT=3000
```

## 🔧 Executando a Aplicação

### Desenvolvimento

```bash
# Modo de desenvolvimento com hot-reload
npm run start:dev

# Modo padrão
npm run start

# Modo debug
npm run start:debug
```

A aplicação estará disponível em `https://localhost:3000`

### Produção

```bash
# Build e execução
npm run build
npm run start:prod
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📋 Code Quality

```bash
# Verificar código com ESLint
npm run lint

# Formatar código com Prettier
npm run format
```

## 📦 Empacotamento

A API pode ser empacotada como um executável standalone para Windows usando `@yao-pkg/pkg`.

### 🚀 Comando Principal

```bash
# Build completo + executável + pacote ZIP
npm run build:release
```

### ⚙️ Comandos Específicos

```bash
# 1. Build do TypeScript
npm run build

# 2. Gerar executável (após build)
npm run pkg

# 3. Criar pacote ZIP (após executável)
npm run release

# 4. Pacote com TODAS as fotos
npm run release:full

# 5. Pacote para desenvolvimento
npm run release:dev
```

### 📄 Arquivos Gerados

| Arquivo | Descrição | Tamanho |
|---------|-----------|---------|
| `sdiApi_V_X.X.X.exe` | Executável comprimido (Brotli) | ~40MB |
| `sdiApi_V_X.X.X.zip` | Pacote completo | ~30MB |

### 📋 Conteúdo do Pacote

**Incluído automaticamente:**
- ✅ Executável principal
- ✅ Certificados SSL (`certificate/`)
- ✅ Documentação (README.md, EMPACOTAMENTO.md)
- ✅ Informações de versão (VERSION_INFO.json)

**Deve ficar no mesmo diretório:**
- 📁 `DBSDI.INI` - Configuração do banco
- 📁 `Fotos/` - Imagens do sistema (opcional no ZIP)

### 🖥️ Instalação no Servidor

1. **Extraia** o arquivo ZIP no servidor Windows
2. **Copie** `DBSDI.INI` para o mesmo diretório do executável
3. **Copie** pasta `Fotos/` (se necessária)
4. **Execute** `sdiApi_V_X.X.X.exe`

A aplicação iniciará em `https://[IP-DA-MAQUINA]:3000`

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para automação de build e release.

### Fluxo de Trabalho

```
dev (desenvolvimento)
  │
  └──► PR para main
         │
         └──► Merge ──► GitHub Actions
                           │
                           ├── Build NestJS
                           ├── Gera .exe com @yao-pkg/pkg
                           ├── Cria Release no GitHub
                           └── Disponibiliza download
```

### Branches

| Branch | Propósito |
|--------|-----------|
| `main` | Produção - triggers de release |
| `dev` | Desenvolvimento ativo |

### Releases Automáticas

Quando um PR é mergeado na `main`:
1. O workflow compila o projeto
2. Gera o executável `.exe`
3. Cria uma Release com notas automáticas
4. Disponibiliza o download

## 📖 Documentação da API

### Swagger/OpenAPI
A documentação interativa da API está disponível em:
```
https://localhost:3000/docs/swagger
```

### Principais Endpoints

| Módulo | Endpoint Base | Descrição |
|--------|---------------|-----------|
| Auth | `/auth` | Autenticação e autorização |
| Pedidos | `/orders` | Gestão de pedidos |
| Clientes | `/clients` | CRUD de clientes |
| Produtos | `/products` | Catálogo de produtos |
| Estoque | `/stock` | Controle de estoque |
| Comandas | `/comandas` | Sistema de comandas |
| Fotos | `/photos` | Gestão de imagens |

## 🏗️ Estrutura do Projeto

```
src/
├── Auth/                 # Módulo de autenticação
├── modules/              # Módulos de negócio
│   ├── client/          # Gestão de clientes
│   ├── order/           # Gestão de pedidos
│   ├── product/         # Catálogo de produtos
│   ├── comanda/         # Sistema de comandas
│   └── ...
├── firebird/            # Cliente Firebird
├── filters/             # Filtros globais (erros)
├── utils/              # Utilitários e helpers
├── config/             # Configurações (Swagger, etc.)
└── commons.ts          # Funções compartilhadas
```

## 🔧 Tecnologias

### Core
- **[NestJS](https://nestjs.com/)** - Framework Node.js
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem principal
- **[node-firebird](https://www.npmjs.com/package/node-firebird)** - Driver Firebird

### Empacotamento
- **[@yao-pkg/pkg](https://github.com/yao-pkg/pkg)** - Geração de executáveis
- **[archiver](https://www.npmjs.com/package/archiver)** - Criação de ZIPs

### Qualidade de Código
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formatação
- **[Jest](https://jestjs.io/)** - Testes

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API
- **[class-validator](https://github.com/typestack/class-validator)** - Validação

## 🚨 Troubleshooting

### Problemas Comuns

#### ❌ Erro de Charset/Transliteração
```
Cannot transliterate character between character sets
```
**Solução**: A API agora possui sanitização automática de dados. O charset ISO8859_1 está configurado.

#### ❌ Certificado SSL não encontrado
```
ENOENT: no such file or directory 'certificate/key.pem'
```
**Solução**: Certifique-se de ter os arquivos SSL na pasta `certificate/`.

#### ❌ Database not found
```
Database not found
```
**Solução**: Verifique se o arquivo `DBSDI.INI` existe e está configurado corretamente.

#### ❌ Erro de conexão com Firebird
```
Database connection failed
```
**Solução**: 
1. Verifique se o Firebird está rodando
2. Confirme o caminho do banco no `DBSDI.INI`
3. Teste credenciais (SYSDBA/masterkey)

### Logs de Erro
Os erros são automaticamente salvos em:
```
logs/errosApi/
├── error-YYYY-MM-DD-HH-MM-SS-timestamp.json
└── errors-YYYY-MM-DD.log
```

### Performance
- **Timeout de requisições**: 5 minutos
- **Conexões Firebird**: Fechadas automaticamente
- **Tamanho do executável**: ~40MB (comprimido)

---

## 📝 Changelog

### v2.3.0
- ✅ GitHub Actions para build automático do .exe
- ✅ Release automática com notas de versão
- ✅ Badge de status do build no README
- ✅ Branch `dev` para desenvolvimento

### v2.2.0
- ✅ Melhorias de performance
- ✅ Correções de bugs

### v2.1.0
- ✅ Sistema de sanitização de dados
- ✅ Filtro global de exceções
- ✅ Charset ISO8859_1 configurado
- ✅ Logging estruturado de erros
- ✅ Documentação melhorada

---

**Desenvolvido por SDI Sistemas** 🚀
