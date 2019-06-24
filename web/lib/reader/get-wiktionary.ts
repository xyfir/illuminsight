import wtf from 'wtf_wikipedia';

export function getWiktionary(text: string): Promise<wtf.Document | null> {
  return wtf.fetch(
    text,
    undefined,
    (() => {
      let runs = 0;
      const opt = {
        get wikiUrl() {
          // @ts-ignore oh yes I can, TypeScript
          if (++runs == 2) delete opt.wikiUrl;
          return 'https://en.wiktionary.org/w/api.php';
        }
      };
      return opt;
    })()
  );
}
