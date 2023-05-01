import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config({ path: `${__dirname}/../../.env.${process.env.NODE_ENV}` });
}

export default {
  api_secret_key: process.env.API_SECRET_KEY,
};
