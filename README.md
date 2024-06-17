# Nome do Seu Projeto

Descrição do seu projeto.

## Instalação

Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

## Executando a Aplicação

Para executar a aplicação, você pode usar os seguintes comandos:

```bash
# Modo de desenvolvimento
npm run start

# Modo de observação
npm run start:dev

# Modo de produção
npm run start:prod
```

## Testes

Execute os testes com os seguintes comandos:

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Usando PKG

Para compilar sua aplicação em um único executável usando PKG, siga as etapas abaixo:

1. Instale o PKG globalmente:

   ```bash
   npm install -g pkg
   ```

2. Construa a aplicação:

   ```bash
   npm run build
   ```

3. Compile com PKG:

   ```bash
   npm run pkg
   ```

4. Adicione o caminho `C:\Users\SeuNomeDeUsuario\AppData\Roaming\npm` ao final da lista de caminhos das variáveis de ambiente no PATH (substitua `SeuNomeDeUsuario` pelo seu nome de usuário).

## Usando PowerShell

Para alterar a política de execução para "RemoteSigned" (ou "Unrestricted" se necessário), abra o PowerShell como administrador e execute o seguinte comando:

```powershell
Set-ExecutionPolicy RemoteSigned
```

## Usando Nexe

Para compilar sua aplicação Node.js em um único executável usando Nexe, siga as etapas abaixo. Estas instruções incluem a instalação de todas as ferramentas necessárias e a configuração do ambiente no Windows.

### Passos para Configurar o Ambiente

1. Abra o PowerShell como Administrador:

   - Clique com o botão direito no ícone do PowerShell e selecione "Executar como administrador".

2. Execute os Comandos para Configurar o Ambiente:

   ```powershell
   Set-ExecutionPolicy Unrestricted -Force
   iex ((New-Object System.Net.WebClient).DownloadString('https://boxstarter.org/bootstrapper.ps1'))
   get-boxstarter -Force
   Install-BoxstarterPackage https://raw.githubusercontent.com/nodejs/node/master/tools/bootstrap/windows_boxstarter -DisableReboots
   ```

3. Configure o npm para usar o Visual Studio e Python:

   ```powershell
   npm config set msvs_version 2022
   npm config set python python3.8
   ```

4. Instale o Nexe globalmente:

   ```bash
   npm install -g nexe
   ```

5. Para compilar, adicione o seguinte trecho no `package.json`:

   ```json
   {
     "scripts": {
       "nexe": "nexe dist/main.js -o ./build/sdiApi.exe -t windows-x64-20.0.0 -r \"certificate/*_/_\" --build"
     }
   }
   ```

6. Em seguida, execute o comando:

   ```bash
   npm run nexe
   ```
