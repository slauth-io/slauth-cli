import { OpenAIModels } from '@slauth.io/langchain-wrapper';

export default interface ScannerStrategy {
  scan(
    codeSnippets: string[],
    modelName?: keyof typeof OpenAIModels
  ): Promise<unknown[] | undefined>;
}
