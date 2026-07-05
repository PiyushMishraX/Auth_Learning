import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use(morgan("dev")) 
// "dev" have limited feature that we need for now , different modes have different features

app.use("/api/auth", authRouter);

export default app;