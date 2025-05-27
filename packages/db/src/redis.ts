import { Redis as UpstashRedis } from "@upstash/redis";
import Redis from "ioredis";

export let redis: Redis | UpstashRedis;

if (process.env.NODE_ENV === "development") {
  redis = new Redis("redis://localhost:6379");

  // Add connection event listeners for debugging
  redis.on("connect", () => console.log("Redis connected to localhost:6379"));
  redis.on("error", (err) => console.error("Redis connection error:", err));
  redis.on("ready", () => console.log("Redis ready for commands"));
} else {
  redis = UpstashRedis.fromEnv(); // Use Upstash Redis in other environments (production)
}
