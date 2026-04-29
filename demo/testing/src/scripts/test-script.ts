import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	await setupCorsair(corsair);

	// List all assistants
	const assistants = await corsair.vapi.api.assistants.list({});
	console.log('Assistants:', JSON.stringify(assistants, null, 2));

	// Create an assistant
	const created = await corsair.vapi.api.assistants.create({
		name: 'Demo Assistant',
		firstMessage: 'Hello! How can I help you today?',
	});
	console.log('Created:', created.id, created.name);

	// List calls
	const calls = await corsair.vapi.api.calls.list({ limit: 5 });
	console.log('Recent calls:', calls.length);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
