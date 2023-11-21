import { existsSync } from 'fs';
import path from 'path';

export default function isGitRepository(fullPath: string) {
  return existsSync(path.join(fullPath, '.git'));
}
