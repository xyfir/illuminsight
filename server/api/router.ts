import * as Express from 'express';
import * as multer from 'multer';
import { extname } from 'path';
import * as c from './controllers';

export const router = Express.Router();

router.post(
  '/convert',
  multer({
    storage: multer.diskStorage({
      destination: process.enve.TEMP_DIR,
      filename(req, file, cb) {
        cb(null, Date.now() + extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 2e8, // 200mb
      files: 1
    }
  }).single('file'),
  c.api_convert
);
