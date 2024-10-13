// multer.config.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

export const multerUpload = multer({ storage });
