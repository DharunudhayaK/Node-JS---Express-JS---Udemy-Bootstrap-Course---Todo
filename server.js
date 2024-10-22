const cors = require("cors");
const express = require("express");
const { router } = require("./routes/routes");
const HttpError = require("./controllers/Errorhandler");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./env/config.env" });

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection failed:", err));

const app = express();
app.use(cors());

const PORT = process.env.PORT || 7000;
app.use(express.json());

app.use("/restapi", router);

app.all("*", (req, res, next) => {
  next(new HttpError("Cannot find the route on this server", 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.code || 500;
  res.status(statusCode).json({
    error: 1,
    statusCode: statusCode,
    message: err.message || "An unknown error occurred!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
