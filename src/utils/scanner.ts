import { OpenAIModels } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../types/scanner-strategy';

export default class Scanner {
  private strategy: ScannerStrategy;

  constructor(strategy: ScannerStrategy) {
    this.strategy = strategy;
  }

  public async scan(
    codeSnippets: string[],
    modelName?: keyof typeof OpenAIModels
  ) {
    return await this.strategy.scan(codeSnippets, modelName);
  }
}
