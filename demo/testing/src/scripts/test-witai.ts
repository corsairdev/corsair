import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	// Set the Wit.ai API key for the local (single-tenant) demo
	const apiKey = process.env.WIT_AI_API_KEY;
	if (!apiKey) {
		throw new Error('WIT_AI_API_KEY is not set in your .env file');
	}
	await corsair.witai.keys.set_api_key(apiKey);

	console.log('--- Wit.ai Plugin Demo ---\n');

	// 1. List all apps
	console.log('1. Listing apps...');
	const apps = await corsair.witai.api.apps.listApps({});
	console.log(`   Found ${apps.length} app(s)`);
	apps.forEach((app: { name: string; id: string }) =>
		console.log(`   - ${app.name} (${app.id})`),
	);

	// 2. Analyze a message (NLU)
	console.log('\n2. Analyzing message: "Book a flight to Paris tomorrow"...');
	const nlp = await corsair.witai.api.message.getMessage({
		q: 'Book a flight to Paris tomorrow',
	});
	console.log(
		'   Intents:',
		nlp.intents?.map((i: { name: string }) => i.name),
	);
	console.log('   Entities:', Object.keys(nlp.entities ?? {}));
	console.log('   Traits:', Object.keys(nlp.traits ?? {}));

	// 3. Detect language
	console.log('\n3. Detecting language of "Bonjour le monde"...');
	const lang = await corsair.witai.api.message.detectLanguage({
		q: 'Bonjour le monde',
	});
	console.log(
		'   Detected locales:',
		lang.map(
			(l: { locale: string; confidence?: number }) =>
				`${l.locale} (${(l.confidence ?? 0 * 100).toFixed(1)}%)`,
		),
	);

	// 4. List intents
	console.log('\n4. Listing intents...');
	const intents = await corsair.witai.api.intents.listIntents({});
	console.log(
		`   Found ${intents.length} intent(s):`,
		intents.map((i: { name: string }) => i.name),
	);

	// 5. List entities
	console.log('\n5. Listing entities...');
	const entities = await corsair.witai.api.entities.listEntities({});
	console.log(
		`   Found ${entities.length} entit(ies):`,
		entities.map((e: { name: string }) => e.name),
	);

	// 6. List voices (TTS)
	console.log('\n6. Listing TTS voices...');
	const voices = await corsair.witai.api.voices.listVoices({});
	const locales = Object.keys(voices);
	console.log(
		`   Found voices for ${locales.length} locale(s):`,
		locales.slice(0, 5),
	);

	console.log('\n✅ All Wit.ai API calls succeeded!');
};

main().catch((err) => {
	console.error('❌ Error:', err.message ?? err);
	process.exit(1);
});
