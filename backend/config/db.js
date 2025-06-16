import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to database :${ conn.connection.host}`)
    }
    catch(error)
    {
        console.error(`Error : ${error.message}`)
        console.log("unable to connect to database")
        process.exit(1)
    }
}