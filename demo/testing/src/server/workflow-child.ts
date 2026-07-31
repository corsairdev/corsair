import { runWorkflowChild } from 'corsair/tunnel';

import { getPlugins } from './plugins';

// Forked per run by createChildProcessExecutor. Builds a KEK-less, DB-less
// client from the injected credential map and runs the workflow. Imports the
// plugin array only — never the configured createCorsair instance (that holds
// the kek). Deliberately does NOT load .env: the parent forks this with the KEK
// stripped from the environment, and re-reading .env here would put it back,
// defeating the process boundary. Credentials arrive over IPC, not from env.
runWorkflowChild(getPlugins());
