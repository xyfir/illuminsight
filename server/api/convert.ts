import { NextFunction, Response, Request } from 'express';
import { convert } from 'lib/convert';

export function api_convert(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const opt = req.file ? { file: req.file.path } : req.body;
  delete req.file;
  convert(opt)
    .then(file => file.pipe(res.status(200)))
    .catch(next);
}
