import type { CorsairPlugin } from '../core/plugins';
import { runWorkflowChild } from '../workflows/child';

// Test child module: mirrors what an app ships — imports its plugin array (no
// createCorsair, no kek, no db) and hands it to the SDK child runner. Named
// `-fixture` (not `.test`) so jest does not run it as a suite.
const testPlugin = {
	id: 'testkey',
	options: { authType: 'api_key' },
} as unknown as CorsairPlugin;

runWorkflowChild([testPlugin]);
