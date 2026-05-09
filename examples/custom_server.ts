import { createServer } from '../src/index';

/**
 * This example shows how to spin up your own instance of the API server
 * programmatically, perhaps with a custom port or within another application.
 */

const PORT = 3000;
const app = createServer(PORT);

console.log(`🚀 Custom FreeFire API Server is now running on port ${PORT}`);
console.log(`🔗 Try accessing: http://localhost:${PORT}/api/player/search?keyword=test`);
