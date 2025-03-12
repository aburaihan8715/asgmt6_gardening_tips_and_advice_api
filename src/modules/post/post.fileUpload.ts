import { CloudinaryStorage } from '@fluidjs/multer-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dhcfqmwzc',
  api_key: '596939577594493',
  api_secret: 'sxN219PBDge5jWE_68j4MNHUbLo',
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gardenSage/posts', // Optional: Folder for uploaded files in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Optional: Restrict allowed file types
    transformation: [{ width: 889, height: 500, crop: 'limit' }], // Optional: Apply image transformations on upload
    public_id: uuidv4(),
  },
});

const postFileUpload = multer({ storage: storage });

export default postFileUpload;
