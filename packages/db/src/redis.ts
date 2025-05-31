import { Redis } from "@upstash/redis";

export let redis: Redis;

if (process.env.NODE_ENV === "development") {
  redis = new Redis({
    url: "http://localhost:8080",
    token: "token",
  });
} else {
  redis = Redis.fromEnv(); // Use Upstash Redis in production
}
