import dotenv from "dotenv";

dotenv.config(); // without this we can not access the environment variables in dotenv file

const config = {
    MONGO_URI: process.env.MONGO_URI
}

export default config;