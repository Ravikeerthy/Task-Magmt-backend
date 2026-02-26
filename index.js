import express from "express"
import dotenv from "dotenv"
import dbConnection from "./config/db.js";
import userRouter from "./routers/user.router.js";
import cookieParser from "cookie-parser";
import dns from "node:dns/promises";
import taskRoutes from "./routers/task.router.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);



dotenv.config()
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.get( "/", (req, res)=>{
    res.status(200).send("Welcome to the backend app")
})

app.use("/taskapp/user", userRouter);
app.use("/taskapp/tasks", taskRoutes);

dbConnection();

app.listen(port, ()=>{
    console.log(`App is listening in ${port}`);
    
} )