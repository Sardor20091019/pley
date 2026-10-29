const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../apps/web/dist/web/browser');
if (fs.existsSync(srcDir)) {
  const rootBrowser = path.resolve(__dirname, '../browser');
  const webBrowser = path.resolve(__dirname, '../apps/web/browser');

  fs.cpSync(srcDir, rootBrowser, { recursive: true });
  fs.cpSync(srcDir, webBrowser, { recursive: true });
  console.log('Build output mirrored to ./browser and ./apps/web/browser');
}
