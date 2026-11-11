const fs = require("fs");
const sharp = require("sharp");

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="badgeGlow" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#cf593b"/>
      <stop offset="70%" stop-color="#b64f32"/>
      <stop offset="100%" stop-color="#9a3c22"/>
    </radialGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.22"/>
    </filter>
  </defs>

  <circle cx="256" cy="256" r="236" fill="url(#badgeGlow)"/>
  <circle cx="256" cy="256" r="232" fill="none" stroke="#f27c5e" stroke-width="6" opacity="0.45"/>
  <circle cx="256" cy="256" r="228" fill="none" stroke="#772914" stroke-width="4" opacity="0.35"/>

  <g filter="url(#subtleShadow)">
    <text
      x="256"
      y="370"
      font-family="'Playfair Display', Didot, 'Bodoni MT', Georgia, 'Times New Roman', serif"
      font-size="345"
      font-weight="700"
      fill="#171816"
      text-anchor="middle"
      letter-spacing="-0.02em"
    >A</text>
  </g>
</svg>`;

async function createIco(pngBuffers, outputPath) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += item.buffer.length;
    dirEntries.push(entry);
  }

  const finalBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(b => b.buffer)
  ]);

  fs.writeFileSync(outputPath, finalBuffer);
}

async function run() {
  const svgBuf = Buffer.from(svgContent);

  fs.writeFileSync("app/icon.svg", svgContent);
  fs.writeFileSync("public/icon.svg", svgContent);

  const p16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  const p180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  const p192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  const p512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();

  fs.writeFileSync("app/apple-icon.png", p180);
  fs.writeFileSync("public/apple-touch-icon.png", p180);
  fs.writeFileSync("public/icon-192.png", p192);
  fs.writeFileSync("public/icon-512.png", p512);

  await createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 },
  ], "app/favicon.ico");

  fs.copyFileSync("app/favicon.ico", "public/favicon.ico");

  console.log("All icons generated successfully!");
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run };
