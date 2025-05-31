# Redis Setup for Local Development

This monorepo uses Upstash Redis for production and a local Redis setup for development that mimics Upstash's HTTP interface.

## Quick Start

1. **Start Redis containers:**

   ```bash
   pnpm redis:start
   ```

2. **Check if services are running:**

   ```bash
   pnpm redis:logs
   ```

3. **Stop Redis containers:**
   ```bash
   pnpm redis:stop
   ```

## Services

The docker-compose setup includes:

- **Redis Server** (port 6379): Standard Redis instance for data storage
- **Upstash Proxy** (port 8080): HTTP interface that mimics Upstash Redis API

## Configuration

Your current Redis configuration in `packages/db/src/redis.ts` is already set up correctly:

- **Development**: Uses `http://localhost:8080` with token `"token"`
- **Production**: Uses `Redis.fromEnv()` for Upstash Redis

## Environment Variables

For production, set these environment variables:

```
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## Available Scripts

- `pnpm redis:start` - Start Redis containers in detached mode
- `pnpm redis:stop` - Stop and remove containers
- `pnpm redis:logs` - View container logs
- `pnpm redis:restart` - Restart containers
- `pnpm redis:clean` - Stop containers and remove volumes (clears data)
- `pnpm redis:cli` - Open Redis CLI for data inspection
- `pnpm redis:monitor` - Monitor Redis commands in real-time

## Inspecting Your Data

### Using Redis CLI

Access the Redis CLI to inspect your data:

```bash
# Open Redis CLI
pnpm redis:cli

# Or from packages/db directory
cd packages/db && pnpm redis:cli
```

### Common Redis CLI Commands

Once in the Redis CLI, you can use these commands:

```redis
# List all keys
KEYS *

# Get a specific value (like an OTP for a phone number)
GET "1234567890"

# Check if a key exists
EXISTS "1234567890"

# Get key expiration time (TTL)
TTL "1234567890"

# List all keys with pattern
KEYS "*123*"

# Get all keys and their values
SCAN 0

# Delete a key
DEL "1234567890"

# Get info about Redis
INFO

# Exit CLI
EXIT
```

### Real-time Monitoring

Monitor Redis commands as they happen:

```bash
pnpm redis:monitor
```

This will show you live commands like when OTPs are set/retrieved from your auth system.

## Testing the Setup

You can test the Redis connection by making HTTP requests to `http://localhost:8080`:

```bash
# Set a value
curl -X POST http://localhost:8080/set/test/hello \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json"

# Get a value
curl http://localhost:8080/get/test \
  -H "Authorization: Bearer token"
```

## Troubleshooting

1. **Port conflicts**: If port 8080 or 6379 are in use, modify the ports in `docker-compose.yml`
2. **Container won't start**: Run `docker-compose logs` to see error messages
3. **Data persistence**: Redis data is stored in a Docker volume and persists between restarts
