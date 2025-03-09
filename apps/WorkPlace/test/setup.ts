import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, '../.env.test');
dotenv.config({ path: envPath });
