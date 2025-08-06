import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hostlee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB conectada correctamente");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
  }
};

export default connectDB;
