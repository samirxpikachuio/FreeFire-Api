# FreeFire API

FreeFire API library and proxy server

## Features
- **Library & Proxy**: Use it as an npm package in your project or run it as a standalone proxy server.
- **CLI Tool**: Start the proxy server with a single command.
- **Flexible Config**: Configure URLs and versions via environment variables.
- **Type-safe**: Built with TypeScript and Elysia.

## Installation

```bash
bun install freefire-api
# or
npm install freefire-api
```

## Usage as a Library

```typescript
import { PlayerService, AuthService } from 'freefire-api';

// Example: Search for a player
const session = await AuthService.loginForRegion('BD');
const players = await PlayerService.searchPlayers(session.serverUrl, session.token, 'PlayerName');
console.log(players);
```

## Usage as a Proxy Server

### Run via CLI
If installed globally:
```bash
freefire-api
```

### Run via NPM Scripts
```bash
npm start
```

### Configuration (Environment Variables)
- `PORT`: Server port (default: 5000)
- `RELEASE_VERSION`: Game version (default: OB53)
- `DEBUG`: Enable debug logging (true/false)
- `GARENA_AUTH_URL`: Custom Garena Auth endpoint
- `LOGIN_BP_URL`: Custom MajorLogin endpoint

## API Endpoints
- `GET /api/player/search?keyword=...`
- `GET /api/player/stats?uid=...`
- `GET /api/player/profile?uid=...`

## License
MIT
