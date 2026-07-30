import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { runWorkflowChild } from 'corsair/tunnel';

import { getPlugins } from './plugins';

// Forked per run by createChildProcessExecutor. Builds a KEK-less, DB-less
// client from the injected credential map and runs the workflow. Imports the
// plugin array only — never the configured createCorsair instance (that holds
// the kek).
runWorkflowChild(getPlugins());
