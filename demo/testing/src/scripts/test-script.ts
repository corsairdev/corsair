import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

async function testTavilySearch() {
	console.log('\n=== TAVILY_MCP_TAVILY_SEARCH ===');

	const res = await corsair.tavilymcp.api.tavily.search({
		query: 'What is the Model Context Protocol?',
		max_results: 3,
		include_answer: true,
	});

	console.log(`query:         ${res.query}`);
	console.log(`answer:        ${res.answer ?? '(none)'}`);
	console.log(`results:       ${res.results.length}`);
	console.log(`response_time: ${res.response_time}s`);

	for (const [i, result] of res.results.entries()) {
		console.log(`\n  ${i + 1}. ${result.title}`);
		console.log(`     ${result.url}`);
		console.log(`     score: ${result.score}`);
		console.log(`     ${result.content.slice(0, 160)}...`);
	}
}

async function testTavilyMap() {
	console.log('\n=== TAVILY_MCP_TAVILY_MAP ===');

	const res = await corsair.tavilymcp.api.tavily.map({
		url: 'https://docs.tavily.com',
		max_depth: 1,
		limit: 10,
	});

	console.log(`base_url: ${res.base_url}`);
	console.log(`urls:     ${res.results.length}`);
	for (const url of res.results.slice(0, 10)) {
		console.log(`  - ${url}`);
	}
}

const main = async () => {
	await testTavilySearch();
	await testTavilyMap();
	console.log('\nDone.');
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
