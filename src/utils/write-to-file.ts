import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export default async function writeToFile(filePath: string, contents: string) {
  const directoryName = path.dirname(filePath);

  if (!existsSync(directoryName)) {
    await mkdir(directoryName, { recursive: true });
  }

  await writeFile(filePath, contents);
}
