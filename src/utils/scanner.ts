import ScannerStrategy from '../types/scanner-strategy';

export default class Scanner {
  private strategy: ScannerStrategy;

  constructor(strategy: ScannerStrategy) {
    this.strategy = strategy;
  }

  public async scan(
    codeSnippets: string[],
    modelName?: string
  ) {
    return await this.strategy.scan(codeSnippets, modelName);
  }
}
