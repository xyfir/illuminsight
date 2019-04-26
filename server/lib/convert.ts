import { createReadStream, ReadStream, writeFile, remove } from 'fs-extra';
import * as archiver from 'archiver';
import { Calibre } from 'node-calibre';
import { resolve } from 'path';
import { Extract } from 'unzipper';
import { JSDOM } from 'jsdom';

const calibre = new Calibre({ log: process.enve.NODE_ENV == 'development' });

export async function convert({
  file,
  link,
  text
}: {
  file?: string;
  link?: string;
  text?: string;
}): Promise<ReadStream> {
  // Save to .txt file
  if (text) {
    file = resolve(process.enve.TEMP_DIR, `${Date.now()}.txt`);
    await writeFile(file, text);
    text = undefined;
  }

  // Create EPUB from webpage
  if (link) {
    // Download HTML
    // Parse HTML with jsdom
    // Convert links and images
    // Convert HTML to commonmark-raw_html to throw out unwanted elements
    // Download images remaining in Markdown (read as JSON?)
    // Convert Markdown to EPUB (outside of dir)
    // Delete directory
  }

  if (!file) throw new Error('Bad or missing input');

  // Convert to EPUB
  // Even if already an EPUB, it will validate and rebuild as we expect it
  const originalFile = file;
  file = await calibre.ebookConvert(file, 'epub');

  // Extract files from EPUB
  const unzipDirectory = resolve(process.enve.TEMP_DIR, `unzip-${Date.now()}`);
  const unzipStream = createReadStream(file);
  unzipStream.pipe(Extract({ path: unzipDirectory }));
  await new Promise(resolve => unzipStream.on('close', resolve));

  // Delete converted EPUB file and original source
  await remove(originalFile);
  await remove(file);

  // Parse OPF with jsdom
  // Create directory for our zip file
  // Move all images (found in OPF) from EPUB dir to ours
  // Loop through all [X]HTML files from OPF
  // Convert HTML to our JSON via jsdom or from Pandoc
  // Write meta.json with info from OPF
  // Generate TOC
  // Zip directory
  // Delete directories

  // Return stream to new file in our format
  const stream = createReadStream('./');
  return stream;

  // Delete file
}
