const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const faviconsDir = path.join(projectRoot, 'assets', 'favicon');
const sourceIcoPath = path.join(faviconsDir, 'favicon.ico');

const sizes = [16, 32, 48, 64, 128, 256];

async function ensureSourceExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`Arquivo não encontrado ou sem permissão de leitura: ${filePath}`);
  }
}

async function generatePngFromIco(size) {
  const targetPath = path.join(faviconsDir, `favicon-${size}x${size}.png`);
  await sharp(sourceIcoPath)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(targetPath);
  return targetPath;
}

(async () => {
  try {
    console.log('Gerando PNGs a partir de favicon.ico ...');
    await fs.promises.mkdir(faviconsDir, { recursive: true });
    await ensureSourceExists(sourceIcoPath);

    for (const size of sizes) {
      const out = await generatePngFromIco(size);
      console.log(`✔ Gerado: ${path.basename(out)}`);
    }

    console.log('Todos os favicons PNG foram atualizados com sucesso.');
  } catch (err) {
    console.error('Falha ao gerar favicons:', err.message);
    process.exit(1);
  }
})();
