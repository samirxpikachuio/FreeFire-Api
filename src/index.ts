// Export Services
export * from './services/auth.service';
export * from './services/player.service';

// Export Routes
export * from './routes/player.routes';

// Export Server App (without starting it automatically)
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { playerRoutes } from './routes/player.routes';

export const createServer = (port: number = 5000) => {
    return new Elysia()
        .use(cors())
        .group('/api', (app) => app.use(playerRoutes))
        .get('/', () => Bun.file('src/public/index.html'))
        .listen(port);
};

export { playerRoutes };
