import { createServer } from './index';
import { SERVER_PORT } from './config/constant';

const port = process.env.PORT ? parseInt(process.env.PORT) : SERVER_PORT;
const app = createServer(port);

console.log(`\n🦊 FreeFire API Proxy is running at ${app.server?.hostname}:${app.server?.port}`);