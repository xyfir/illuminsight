export class Indexer {
  private static i = 0;

  public static get index(): number {
    return Indexer.i++;
  }

  public static reset(): void {
    Indexer.i = 0;
  }
}
