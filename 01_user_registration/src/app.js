import express from 'express'
import morgan from 'morgan'

const app = express();

app.use(express.json());
app.use(morgan("dev")) 
// "dev" have limited feature that we need for now , different modes have different features

export default app;