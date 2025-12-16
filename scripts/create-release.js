const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Lê argumentos da linha de comando
const args = process.argv.slice(2);
const includeAllPhotos = args.includes('--all-photos');
const includeDevFiles = args.includes('--dev');

// Lê a versão do package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Caminhos
const buildDir = path.join(__dirname, '..', 'build');
const exeFileName = `sdiApi_V_${version}.exe`;
const zipFileName = `sdiApi_V_${version}.zip`;
const exePath = path.join(buildDir, exeFileName);
const zipPath = path.join(buildDir, zipFileName);

console.log(`🔄 Iniciando criação do pacote de distribuição...`);
console.log(`📁 Versão: ${version}`);
console.log(`📁 Executável: ${exeFileName}`);
console.log(`📦 ZIP: ${zipFileName}`);

// Verifica se o executável existe
if (!fs.existsSync(exePath)) {
  console.error(`❌ Erro: Executável não encontrado: ${exePath}`);
  console.log(`💡 Execute primeiro: npm run pkg`);
  process.exit(1);
}

// Remove ZIP existente se houver
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log(`🗑️  ZIP anterior removido`);
}

// Cria o arquivo ZIP
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Máxima compressão
});

// Event listeners
output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Pacote criado com sucesso!`);
  console.log(`📦 Arquivo: ${zipFileName}`);
  console.log(`📊 Tamanho: ${sizeInMB} MB`);
  console.log(`📍 Localização: ${zipPath}`);
  console.log(`\n🚀 Pronto para distribuição!`);
});

output.on('error', (err) => {
  console.error('❌ Erro ao criar ZIP:', err);
  process.exit(1);
});

archive.on('error', (err) => {
  console.error('❌ Erro durante compressão:', err);
  process.exit(1);
});

// Conecta o arquivo ao archiver
archive.pipe(output);

console.log(`\n📦 Adicionando arquivos ao pacote...`);

// 1. Adiciona o executável (obrigatório)
archive.file(exePath, { name: exeFileName });
console.log(`   ✓ ${exeFileName} (${(fs.statSync(exePath).size / 1024 / 1024).toFixed(1)} MB)`);

// 2. Adiciona arquivos de configuração
const configFiles = [
  { file: 'README.md', desc: 'Documentação' },
  { file: 'EMPACOTAMENTO.md', desc: 'Guia de empacotamento' }
];

configFiles.forEach(({ file, desc }) => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
    console.log(`   ✓ ${file} (${desc})`);
  }
});

// 3. Adiciona certificados (obrigatório)
const certDir = path.join(__dirname, '..', 'certificate');
if (fs.existsSync(certDir)) {
  archive.directory(certDir, 'certificate');
  const certFiles = fs.readdirSync(certDir).length;
  console.log(`   ✓ certificate/ (${certFiles} arquivos)`);
}

// 4. Adiciona fotos (APENAS se especificado)
if (includeAllPhotos) {
  const fotosDir = path.join(__dirname, '..', 'Fotos');
  if (fs.existsSync(fotosDir)) {
    const allFotos = fs.readdirSync(fotosDir).filter(f => 
      fs.statSync(path.join(fotosDir, f)).isFile()
    );
    
    // Inclui todas as fotos
    allFotos.forEach(foto => {
      const fotoPath = path.join(fotosDir, foto);
      archive.file(fotoPath, { name: `Fotos/${foto}` });
    });
    console.log(`   ✓ Fotos/ (TODAS as ${allFotos.length} fotos)`);
  }
} else {
  console.log(`   ⚪ Fotos/ (não incluídas - use --all-photos se necessário)`);
}

// 5. Adiciona arquivos de desenvolvimento (opcional)
if (includeDevFiles) {
  const devFiles = [
    'package.json',
    'tsconfig.json',
    'nest-cli.json'
  ];
  
  devFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: `dev/${file}` });
      console.log(`   ✓ dev/${file}`);
    }
  });
}

// 6. Cria arquivo de informações sobre a versão
const versionInfo = {
  version: version,
  buildDate: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch,
  files: {
    executable: exeFileName,
    hasPhotos: includeAllPhotos && fs.existsSync(fotosDir),
    hasCertificates: fs.existsSync(certDir),
    includesPhotos: includeAllPhotos,
    includesDevFiles: includeDevFiles
  }
};

archive.append(JSON.stringify(versionInfo, null, 2), { name: 'VERSION_INFO.json' });
console.log(`   ✓ VERSION_INFO.json (informações da build)`);

// Finaliza o ZIP
archive.finalize().then(() => {
  console.log(`\n🎯 Arquivos incluídos no pacote:`);
  console.log(`   • Executável principal (${exeFileName})`);
  console.log(`   • Certificados SSL`);
  console.log(`   • Configuração do banco`);
  console.log(`   • Documentação`);
  console.log(`   • ${includeAllPhotos ? 'Todas as fotos' : 'Fotos de exemplo'}`);
  if (includeDevFiles) console.log(`   • Arquivos de desenvolvimento`);
  
  console.log(`\n📋 Para usar:`);
  console.log(`   1. Extraia o ZIP no servidor`);
  console.log(`   2. Execute: ${exeFileName}`);
  console.log(`   3. Certifique-se que DBSDI.INI está configurado`);
}).catch(err => {
  console.error('❌ Erro ao finalizar ZIP:', err);
  process.exit(1);
});
