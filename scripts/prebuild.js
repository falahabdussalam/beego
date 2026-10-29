import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appDir = path.join(rootDir, 'src', 'app');
const nextDir = path.join(rootDir, '.next');
const nextServerApp = path.join(nextDir, 'server', 'app');
const nextTypesApp = path.join(nextDir, 'types', 'app');
const nextStaticChunksApp = path.join(nextDir, 'static', 'chunks', 'app');

function ensureDir(p) {
  try {
    fs.mkdirSync(p, { recursive: true });
  } catch (e) {
    // ignore
  }
}

ensureDir(path.join(nextDir, 'server', 'vendor-chunks'));
ensureDir(path.join(nextDir, 'server', 'pages'));
ensureDir(path.join(nextDir, 'cache'));
ensureDir(nextServerApp);
ensureDir(nextTypesApp);
ensureDir(nextStaticChunksApp);

function mirrorDirectories(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(currentDir, entry.name);
      const relative = path.relative(appDir, fullPath);
      
      const targetServer = path.join(nextServerApp, relative);
      const targetTypes = path.join(nextTypesApp, relative);
      const targetChunks = path.join(nextStaticChunksApp, relative);

      ensureDir(targetServer);
      ensureDir(targetTypes);
      ensureDir(targetChunks);

      mirrorDirectories(fullPath);
    }
  }
}

try {
  mirrorDirectories(appDir);
  console.log('[prebuild] Pre-created all .next build directories successfully.');
} catch (e) {
  console.warn('[prebuild] Note:', e.message);
}
