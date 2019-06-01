export class Indexer {
  private static i = 0;

  public static get index() {
    return Indexer.i++;
  }

  public static reset() {
    Indexer.i = 0;
  }
}
