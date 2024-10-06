const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/UserRoute.js");
const { authRouter } = require("./routes/AuthRoute.js");
const { listRouter } = require("./routes/ListRoute.js");
dotenv.config();

const app = express();
const corsOptions = {
  origin: true, // This will allow any origin for development
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
