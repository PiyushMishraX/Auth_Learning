import dotenv from "dotenv";

dotenv.config(); // without this we can not access the environment variables in dotenv file

// more potimization
if(!process.env.MONGO_URI) {
    throw new Error("Mongo_URI is not defined in environment variables") // throws error if cann't find the variable in env file , this stops server from start runnign without the required URI 
    // we need to do this in config.js file for better and safer development
    // for every variable we create in inside MONGO_URI / .env we add checks t check if these varibales exist or not in our .env file , if not we throw error
    // this increase the quality of development /// if a new team memeber froks the project then he can easily know what variables he needs



}

const config = {
    MONGO_URI: process.env.MONGO_URI
}

export default config;