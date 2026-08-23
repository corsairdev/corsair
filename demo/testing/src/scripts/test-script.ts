import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { witai } from '@corsair-dev/witai';
import { corsair } from '@/server/corsair';

const main = async () => {
	// ── 1. Inject the API key into the Corsair key store ─────────────────────
	const apiKey = process.env.WIT_AI_API_KEY;
	if (!apiKey) {
		throw new Error(
			'WIT_AI_API_KEY is not set.\n' +
				'Open demo/.env and paste your Wit.ai Server Access Token.',
		);
	}
	await corsair.witai.keys.set_api_key(apiKey);
	console.log('✅ API key stored\n');

	// ── 2. List apps ──────────────────────────────────────────────────────────
	console.log('📋 Listing Wit.ai apps...');
	try {
		const apps = await corsair.witai.api.apps.listApps({});
		if (apps.length === 0) {
			console.log('   (no apps found — create one at wit.ai)\n');
		} else {
			apps.forEach((app: { name: string; id: string }) =>
				console.log(`   • ${app.name}  [${app.id}]`),
			);
			console.log();
		}
	} catch (err) {
		console.log(
			'   ⚠️  Could not list apps (this is expected if using an app-level Server Access Token instead of a Personal Access Token).\n',
		);
	}

	// ── 3. NLU message analysis ───────────────────────────────────────────────
	const query = 'Book a flight to Paris tomorrow';
	console.log(`🧠 Analysing: "${query}"`);
	const nlp = await corsair.witai.api.message.getMessage({ q: query });
	console.log(
		'   Intents  :',
		nlp.intents?.map((i: { name: string }) => i.name) ?? [],
	);
	console.log('   Entities :', Object.keys(nlp.entities ?? {}));
	console.log('   Traits   :', Object.keys(nlp.traits ?? {}));
	console.log();

	// ── 4. Language detection ─────────────────────────────────────────────────
	const phrase = 'Bonjour le monde';
	console.log(`🌍 Detecting language of: "${phrase}"`);
	const langs = await corsair.witai.api.message.detectLanguage({ q: phrase });
	langs.detected_locales.forEach((l: { locale: string; confidence?: number }) =>
		console.log(
			`   ${l.locale}  (${((l.confidence ?? 0) * 100).toFixed(1)} %)`,
		),
	);
	console.log();

	// ── 5. List intents ───────────────────────────────────────────────────────
	console.log('🎯 Intents in app:');
	const intents = await corsair.witai.api.intents.listIntents({});
	if (intents.length === 0) {
		console.log('   (none yet)');
	} else {
		intents.forEach((i: { name: string }) => console.log(`   • ${i.name}`));
	}
	console.log();

	// ── 6. List TTS voices (first 5 locales) ─────────────────────────────────
	console.log('🔊 TTS voice locales (first 5):');
	const voices = await corsair.witai.api.voices.listVoices({});
	Object.keys(voices)
		.slice(0, 5)
		.forEach((locale) => console.log(`   • ${locale}`));
	console.log();

	console.log('🎉 All Wit.ai endpoints responded successfully!');
};

main().catch((err: Error) => {
	console.error('❌', err.message ?? err);
	process.exit(1);
});
