import 'dotenv/config';
import { runStdioMcpServer } from '@corsair-dev/mcp';
import { corsair } from '@/server/corsair';

runStdioMcpServer({ corsair }).catch((err: unknown) => {
	console.error('[corsair-mcp] Fatal:', err);
	process.exit(1);
});
