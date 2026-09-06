import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function main() {
	const configuredKey = process.env.CALLPAGE_API_KEY;
	if (!configuredKey) {
		throw new Error('CALLPAGE_API_KEY is required to run the CallPage demo test');
	}

	const plugin = corsair.callpage;
	if (!plugin) {
		throw new Error('CallPage plugin is not registered in the demo');
	}

	await plugin.api.users.list({ limit: 1 });
	await plugin.api.widgets.get({ encrypted_id: 'demo' });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
