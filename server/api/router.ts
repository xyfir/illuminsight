import * as Express from 'express';
import * as multer from 'multer';
import * as c from './controllers';

export const router = Express.Router();

router.post(
  '/convert',
  multer({
    dest: process.enve.TEMP_DIR,
    limits: {
      fileSize: 2e8, // 200mb
      files: 1
    }
  }).single('file'),
  c.api_convert
);
