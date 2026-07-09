import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(morgan("dev")) 
// "dev" have limited feature that we need for now , different modes have different features
app.use(cookieParser())

app.use("/api/auth", authRouter);


// app.use("/",(req,rest)=>{
//     console.log("hello");
//     rest.status(200).json({
//         message:"Hello",
//     }) // // just for testing
// })

export default app;