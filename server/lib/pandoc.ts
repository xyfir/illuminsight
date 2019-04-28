import { exec } from 'child_process';

export function pandoc({
  output,
  input,
  from,
  to,
  ...opt
}: {
  output: string;
  input: string;
  from: string;
  to: string;
  [x: string]: string;
}): Promise<void> {
  const options = Object.entries(opt)
    .map(o => `--${o[0]}="${o[1]}"`)
    .join(' ');
  return new Promise((resolve, reject) => {
    exec(
      `pandoc -f ${from} -t ${to} -o "${output}" "${input}" ${options}`,
      (err, stdout, stderr) => {
        if (err || stderr) reject(err || stderr);
        resolve();
      }
    );
  });
}
