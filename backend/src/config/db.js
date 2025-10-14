import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}hostelDB`);
    console.log("Mongodb is connected");
  } catch (error) {
    console.log("Error in connecting database", error);
    process.exit(1);
  }
};

export default connectToDB;
