import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



const dbConnection = async() =>{
    try {
      const connection = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
      console.log("DataBase is connected");
      return connection
      
    } catch (error) {
     console.log("Database is not connected", error);
    //  process.exit(1);
       
    }
}

export default dbConnection