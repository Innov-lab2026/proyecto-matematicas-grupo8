import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist');

mkdirSync(outDir, { recursive: true });
copyFileSync(join(root, 'src', 'styles.css'), join(outDir, 'styles.css'));
