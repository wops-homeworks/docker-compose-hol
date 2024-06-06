import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import mongoose from "mongoose";
import redis from "redis";
import path from "path";

const app = express();
const port = process.env.PORT;


async function checkMongoConnection() {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the application on connection failure
  }
}

async function checkRedisConnection() {
  try {
    const client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    await client.connect();
    console.log("Connected to Redis successfully!");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    process.exit(1); // Exit the application on connection failure
  }
}

const logDir = path.resolve(process.cwd(), "logs");

// Configure express-winston to log to a file
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: path.join(logDir, "log.txt"),
      }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

(async () => {
  await Promise.all([checkMongoConnection(), checkRedisConnection()]);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})();
