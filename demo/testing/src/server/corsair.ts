import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { createCorsair } from 'corsair';
import { createChildProcessExecutor } from 'corsair/tunnel';

import { sqlite } from '../db';
import { getPlugins } from './plugins';

const hubProjectApiKey =
	process.env.CORSAIR_DEV_API_KEY ?? process.env.CORSAIR_API_KEY!;
const hubSigningSecret =
	process.env.CORSAIR_DEV_SIGNING_SECRET ?? process.env.CORSAIR_SIGNING_SECRET!;
// const hubApiUrl = process.env.HUB_API_URL;
// const hubOAuthCallbackUrl = process.env.HUB_OAUTH_CALLBACK_URL;

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	permissions: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	hub: {
		// apiUrl: hubApiUrl,
		// oauthCallbackUrl: hubOAuthCallbackUrl,
		projectApiKey: hubProjectApiKey,
		signingSecret: hubSigningSecret,
		allowWorkflowExecution: true,
		workflowExecutor: createChildProcessExecutor({
			childModulePath: fileURLToPath(
				new URL('./workflow-child.ts', import.meta.url),
			),
			execArgv: ['--import', 'tsx'],
			maxOldSpaceMb: 256,
		}),
	},
	plugins: getPlugins(),
});
