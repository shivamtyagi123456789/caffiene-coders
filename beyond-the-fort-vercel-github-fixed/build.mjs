import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'public');
const files = ['index.html', 'css', 'images', 'js'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of files) {
  await cp(join(root, name), join(output, name), { recursive: true });
}
await writeFile(join(output, '.nojekyll'), '');
console.log(`Static site written to ${output}`);
