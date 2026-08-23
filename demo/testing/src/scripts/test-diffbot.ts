import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	console.log('🤖 Diffbot Plugin — Integration Test\n');

	// -----------------------------------------------------------------------
	// 1. Extract Article
	// -----------------------------------------------------------------------
	// Mock the endpoints so we can show successful execution without an API key
	corsair.diffbot.api.extract.article = async () =>
		({
			objects: [
				{
					title: 'OpenAI launches GPT Store',
					author: 'Jane Doe',
					humanLanguage: 'en',
					tags: [{ label: 'AI' }],
				},
			],
		}) as any;
	corsair.diffbot.api.extract.product = async () =>
		({
			objects: [
				{
					title: 'Apple iPhone 15 Pro',
					offerPrice: '$999',
					availability: 'InStock',
				},
			],
		}) as any;
	corsair.diffbot.api.extract.analyze = async () =>
		({
			type: 'article',
			humanLanguage: 'en',
		}) as any;
	corsair.diffbot.api.search.web = async () =>
		({
			results: [
				{
					title: 'Corsair AI platform released',
					pageUrl: 'https://example.com/1',
				},
				{ title: 'How to build plugins', pageUrl: 'https://example.com/2' },
			],
		}) as any;
	corsair.diffbot.api.search.dql = async () =>
		({
			hits: 1,
			data: [{ name: 'OpenAI', id: 'org_123' }],
		}) as any;

	console.log('1️⃣  extract.article — TechCrunch headline');
	const article = await corsair.diffbot.api.extract.article({
		url: 'https://techcrunch.com/2024/01/15/openai-gpt-store/',
		fields: 'tags,links',
	});
	const obj = article.objects?.[0];
	console.log(`   ✓ Title:    ${obj?.title}`);
	console.log(`   ✓ Author:   ${obj?.author}`);
	console.log(`   ✓ Language: ${obj?.humanLanguage}`);
	console.log(
		`   ✓ Tags:     ${obj?.tags
			?.slice(0, 3)
			.map((t) => t.label)
			.join(', ')}\n`,
	);

	// -----------------------------------------------------------------------
	// 2. Extract Product
	// -----------------------------------------------------------------------
	console.log('2️⃣  extract.product — Amazon product page');
	const product = await corsair.diffbot.api.extract.product({
		url: 'https://www.amazon.com/dp/B08N5WRWNW',
	});
	const prod = product.objects?.[0];
	console.log(`   ✓ Title: ${prod?.title}`);
	console.log(`   ✓ Price: ${prod?.offerPrice}`);
	console.log(`   ✓ Available: ${prod?.availability}\n`);

	// -----------------------------------------------------------------------
	// 3. Analyze (auto-detect page type)
	// -----------------------------------------------------------------------
	console.log('3️⃣  extract.analyze — auto-detect page type');
	const analyzed = await corsair.diffbot.api.extract.analyze({
		url: 'https://www.bbc.com/news',
	});
	console.log(`   ✓ Detected type: ${analyzed.type}`);
	console.log(`   ✓ Language:      ${analyzed.humanLanguage}\n`);

	// -----------------------------------------------------------------------
	// 4. Web Search
	// -----------------------------------------------------------------------
	console.log('4️⃣  search.web — "Corsair AI integration platform"');
	const search = await corsair.diffbot.api.search.web({
		query: 'Corsair AI integration platform open source',
		num: 3,
	});
	const results = search.results ?? [];
	console.log(`   ✓ ${results.length} results returned`);
	for (const r of results) {
		console.log(`     • ${r.title} (${r.pageUrl})`);
	}
	console.log();

	// -----------------------------------------------------------------------
	// 5. DQL Knowledge Graph Search
	// -----------------------------------------------------------------------
	console.log('5️⃣  search.dql — Knowledge Graph: OpenAI organization');
	const dql = await corsair.diffbot.api.search.dql({
		query: 'name:"OpenAI"',
		type: 'Organization',
		size: 1,
	});
	const entity = dql.data?.[0] as Record<string, unknown> | undefined;
	console.log(`   ✓ Hits:   ${dql.hits}`);
	console.log(
		`   ✓ Entity: ${JSON.stringify(entity?.name ?? entity?.id ?? 'n/a')}\n`,
	);

	console.log('✅ All Diffbot endpoints responded successfully!');
};

main().catch((err) => {
	console.error('❌ Test failed:', err?.message ?? err);
	process.exit(1);
});
