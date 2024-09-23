
export default interface ScannerStrategy {
  scan(
    codeSnippets: string[],
    modelName?: string
  ): Promise<unknown[] | undefined>;
}
