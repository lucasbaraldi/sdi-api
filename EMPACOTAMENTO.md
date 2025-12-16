# 📦 Guia de Empacotamento - SDI API

## 🚀 Scripts Disponíveis

### **Empacotamento Completo (Executável + ZIP):**

```bash
npm run build:prod        # Build + Executável + ZIP básico
npm run build:release     # Build + Executável + ZIP completo
npm run release:full      # ZIP com TODAS as fotos
npm run release:dev       # ZIP com arquivos de desenvolvimento
```

### **Apenas Empacotamento:**

```bash
npm run pkg               # Apenas executável (requer build anterior)
npm run zip               # Apenas ZIP básico (requer executável)
npm run release           # Apenas ZIP completo (requer executável)
```

### **Empacotamento com Opções:**

```bash
npm run pkg:debug         # Com logs detalhados
```

### **Multiplataforma:**

```bash
npm run pkg:linux         # Linux x64
npm run pkg:macos         # macOS x64
```

## 📦 Tipos de Pacotes Criados

### **Arquivos Gerados:**

1. **`sdiApi_V_1.0.exe`** - Executável principal (90-40MB com compressão)
2. **`sdiApi_V_1.0.zip`** - Pacote completo para distribuição

### **Conteúdo do ZIP:**

#### **ZIP Básico (`npm run zip`):**

- ✅ Executável principal
- ✅ Certificados SSL (`certificate/`)
- ✅ Documentação (`README.md`, `EMPACOTAMENTO.md`)
- ✅ Informações da versão (`VERSION_INFO.json`)
- ⚪ Fotos e DBSDI.INI (ficam separados)

#### **ZIP Completo (`npm run release`):**

- ✅ Todos os itens do ZIP básico
- ✅ Relatório detalhado de arquivos incluídos
- ⚪ Fotos e DBSDI.INI (ficam separados)

#### **ZIP Full (`npm run release:full`):**

- ✅ Todos os itens do ZIP básico
- ✅ **TODAS** as fotos do diretório `Fotos/`
- ⚪ DBSDI.INI (fica separado)

#### **ZIP Dev (`npm run release:dev`):**

- ✅ Todos os itens do ZIP básico
- ✅ Arquivos de desenvolvimento (`package.json`, `tsconfig.json`, etc.)

## � Arquivos Externos (Não Empacotados)

### **Arquivos que devem ficar no mesmo diretório do executável:**

1. **`DBSDI.INI`** - Configuração da conexão com banco de dados
2. **`Fotos/`** - Diretório com todas as imagens do sistema

### **Estrutura final de distribuição:**

```
pasta_distribuicao/
├── sdiApi_V_1.0.exe          # Executável principal
├── DBSDI.INI                 # Configuração do banco
└── Fotos/                    # Diretório de imagens
    ├── 000018_02.JPG
    ├── 005114_01.JPG
    └── ... (todas as fotos)
```

## �📊 Tamanhos Típicos

### **Executável:**

- **Sem compressão:** ~90MB
- **Com compressão Brotli:** ~35-40MB

### **ZIP:**

- **ZIP básico:** ~40-50MB
- **ZIP completo:** ~40-50MB
- **ZIP full (todas fotos):** Varia conforme quantidade de fotos
- **ZIP dev:** ~45-55MB

## ⚠️ Warnings Normais (Podem ser Ignorados)

### **NPM Warnings:**

```
npm warn Unknown env config "msvs-version"
npm warn Unknown env config "python"
```

- Configurações antigas do npm, não afetam o funcionamento

### **Bytecode Warnings:**

```
Warning Failed to make bytecode node22-x64 for file ...
```

- Alguns módulos não podem ser convertidos para bytecode
- São incluídos como JavaScript normal
- **NÃO afetam o funcionamento do executável**

## 📁 Arquivos Incluídos Automaticamente

### **Scripts (Convertidos para bytecode):**

- `dist/**/*.js` - Todo código compilado

### **Assets (Incluídos como arquivos):**

- `certificate/**/*` - Certificados SSL
- `node_modules/swagger/**/*` - Documentação Swagger

### **Arquivos NÃO empacotados (ficam externos):**

- `Fotos/**/*` - Imagens do sistema (devem ficar no mesmo diretório do .exe)
- `DBSDI.INI` - Configuração do banco (deve ficar no mesmo diretório do .exe)

## 🔍 Verificando o Conteúdo do Executável

Para ver o que foi incluído no executável:

```bash
npm run pkg:debug
set DEBUG_PKG=1
./build/sdiApi.exe
```

## 📊 Tamanhos Típicos

- **Sem compressão:** ~90MB
- **Com compressão Brotli:** ~35-40MB
- **Com compressão GZip:** ~45-50MB

## 🛠️ Resolução de Problemas

### **Import Dinâmico não detectado:**

Se houver erros de módulos não encontrados, adicione ao `assets` no `package.json`:

```json
"assets": [
  "path/to/missing/module/**/*"
]
```

### **Arquivo muito grande:**

Use compressão:

```bash
npm run pkg:compress
```

### **Erro de execução:**

1. Verifique se todos os certificados estão na pasta `certificate/`
2. Verifique se o arquivo `DBSDI.INI` existe
3. Execute com debug para ver logs detalhados

## 🎯 Configuração Otimizada

A configuração atual no `package.json` já está otimizada para:

- ✅ Node.js 22 (versão mais recente suportada)
- ✅ Todos os assets necessários incluídos
- ✅ Suporte a módulos ES experimentais
- ✅ Compressão disponível
- ✅ Debug mode disponível

## 📝 Notas Importantes

1. **Certificados**: Sempre incluídos automaticamente
2. **Fotos**: Todas as imagens são empacotadas
3. **Configuração DB**: DBSDI.INI é incluído
4. **Swagger**: Documentação disponível no executável
5. **Performance**: Bytecode melhora velocidade de inicialização
6. **Segurança**: Código fonte não fica exposto (bytecode)

## 🚀 Exemplo de Uso Completo

```bash
# 1. Fazer build e empacotar com compressão
npm run build
npm run pkg

# 2. O executável estará em: ./build/sdiApi_V_1.0.exe

# 3. Para distribuir, copie junto:
# - sdiApi_V_1.0.exe (executável)
# - DBSDI.INI (configuração do banco)
# - Fotos/ (diretório completo com imagens)
```

## 🔗 Links Úteis

- [Documentação yao/pkg](https://github.com/yao-pkg/pkg)
- [Troubleshooting](https://github.com/yao-pkg/pkg#troubleshooting)
- [Configuração Avançada](https://github.com/yao-pkg/pkg#config)
