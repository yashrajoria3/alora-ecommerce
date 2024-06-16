import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connection.on("diconnected", () => {
  console.log("disconnected from DB.");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to db.");
  } catch (err) {
    console.log(err);
  }
};

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
app.listen(process.env.PORT || 8000, () => {
  connectDB();
  console.log("connected to server.");
});
