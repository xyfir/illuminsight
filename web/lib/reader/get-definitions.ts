import { Illuminsight } from 'types/illuminsight';
import axios from 'axios';

export async function getDefinitions(
  text: string
): Promise<Illuminsight.DefinitionInsight | undefined> {
  try {
    const res = await axios.get(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${text}`
    );
    return res.data;
  } catch {}
}
