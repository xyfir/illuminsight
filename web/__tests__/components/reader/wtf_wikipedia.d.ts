declare module 'wtf_wikipedia' {
  export function fetch(titles: string | string[]): Promise<any>;
}
