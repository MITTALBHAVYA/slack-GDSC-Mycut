import mongoose from "mongoose";

const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "gdsc_slack",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.log(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
};

export default mongoConnection;