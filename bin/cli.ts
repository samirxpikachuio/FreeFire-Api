#!/usr/bin/env bun
import { createServer } from '../src/index';
import { SERVER_PORT } from '../src/config/constant';

const port = process.env.PORT ? parseInt(process.env.PORT) : SERVER_PORT;
const app = createServer(port);

console.log(`\n🚀 FreeFire API Proxy CLI`);
console.log(`🌍 Server: http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📜 Version: 2.0.0\n`);
