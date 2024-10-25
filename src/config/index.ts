import dotenv from 'dotenv';
dotenv.config();

export default {
  // reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  reset_pass_ui_link:
    process.env.NODE_ENV === 'production'
      ? process.env.RESET_PASS_UI_LINK
      : process.env.RESET_PASS_UI_LINK_LOCAL,

  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url_atlas: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  jwt_password_reset_secret: process.env.JWT_PASSWORD_RESET_SECRET,
  jwt_password_reset_expires_in: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  subscription_price: process.env.SUBSCRIPTION_PRICE,

  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
