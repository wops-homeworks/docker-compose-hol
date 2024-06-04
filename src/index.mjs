import chalk from "chalk";
import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import mongoose from "mongoose";
import redis from "redis";

const app = express();
const port = process.env.PORT;

const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;


const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

async function checkMongoConnection() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the application on connection failure
  }
}

async function checkRedisConnection() {
  try {
    const client = redis.createClient({ host: redisHost, port: redisPort });
    await client.connect();
    console.log("Connected to Redis successfully!");
    client.quit(); // Disconnect from Redis after successful check
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    process.exit(1); // Exit the application on connection failure
  }
}

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
    ],
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

(async () => {
  await Promise.all([checkMongoConnection(), checkRedisConnection()]);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})();
