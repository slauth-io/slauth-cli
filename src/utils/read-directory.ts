import { existsSync } from 'fs';
import { stat, readdir } from 'fs/promises';
import path from 'path';
import { programmingLanguageExtensions } from './language-extensions';
import { LangChain } from '@slauth.io/langchain-wrapper';

const FILE_FILTER_REGEX = /(package.*\.json|.*\.d.ts|node_modules\/.*)$/g;
const DOT_PATH_REGEX = /\/\..+/g;

async function listFiles(directoryOrFilePath: string): Promise<string[]> {
  const exists = existsSync(directoryOrFilePath);

  if (!exists) {
    return [];
  }

  const pathStats = await stat(directoryOrFilePath);

  // add more filter, e.g. node_modules, etc
  if (
    directoryOrFilePath.match(DOT_PATH_REGEX) ||
    directoryOrFilePath.match(FILE_FILTER_REGEX)
  ) {
    return [];
  }

  if (pathStats.isFile()) {
    const EXT_REGEX_PARTIAL = programmingLanguageExtensions
      .map(ext => {
        // escape regex special characters that might be in the extension
        return ext.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      })
      .concat(['.az'])  // Assuming '.az' as Azure-specific file extension
      .join('|');

    const EXT_REGEX = new RegExp(`.*(${EXT_REGEX_PARTIAL})$`, 'g');

    if (!directoryOrFilePath.match(EXT_REGEX)) {
      return [];
    }

    return [directoryOrFilePath];
  }

  const contents = await readdir(directoryOrFilePath);
  const filePaths = contents.map(async content => {
    const contentPath = path.join(directoryOrFilePath, content);
    return await listFiles(contentPath);
  });

  return (await Promise.all(filePaths))
    .flat()
    .filter((path): path is string => {
      return Boolean(path);
    });
}

export default async function readDirectory(
  dirPath: string
): Promise<{ pageContent: string }[]> {
  const files = await listFiles(dirPath);
  const textSplitter =
    new LangChain.TextSplitters.RecursiveCharacterTextSplitter({
      chunkSize: 5000,
      chunkOverlap: 1000,
    });

  const docs = (
    await Promise.all(
      files.map(async f => {
        const textLoader = new LangChain.TextLoader(f);
        return await textLoader.loadAndSplit(textSplitter);
      })
    )
  ).flat();

  return docs;
}
