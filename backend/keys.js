import dotenv from "dotenv";
dotenv.config(); 

export const DATABASE_URI = process.env.DATABASE_URI;
export const SECRETKEY = process.env.SECRETKEY;
export const PORT = process.env.PORT || 2530;


export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
