import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setAsinDataApiCredentials() {
	const apiKey = process.env.ASINDATA_API_KEY;
	if (apiKey) {
		await corsair.asindataapi.keys.set_api_key(apiKey);
	}
}

const main = async () => {
	await setAsinDataApiCredentials();

	// ── Product Data API ──────────────────────────────────────────────────
	// Search for products
	const searchResult = await corsair.asindataapi.api.search.get({
		search_term: 'highlighter pens',
		amazon_domain: 'amazon.com',
	});
	console.log(
		'[search.get] Found',
		searchResult.search_results?.length ?? 0,
		'results',
	);

	// Get a specific product by ASIN
	const productResult = await corsair.asindataapi.api.products.get({
		asin: 'B00I8RKMSM',
		amazon_domain: 'amazon.com',
	});
	console.log('[products.get] Product:', productResult.product?.title);

	// Get offers for a product
	const offersResult = await corsair.asindataapi.api.offers.get({
		asin: 'B00I8RKMSM',
		amazon_domain: 'amazon.com',
	});
	console.log(
		'[offers.get] Found',
		offersResult.offers?.length ?? 0,
		'offers',
	);

	// Get category data
	const categoriesResult = await corsair.asindataapi.api.categories.get({
		category_id: '1064954',
		amazon_domain: 'amazon.com',
	});
	console.log(
		'[categories.get] Found',
		categoriesResult.category_results?.length ?? 0,
		'category results',
	);

	// ── Collections API ───────────────────────────────────────────────────
	// Create a collection
	const createResult = await corsair.asindataapi.api.collections.create({
		name: 'Test Collection',
		schedule_type: 'manual',
		enabled: true,
	});
	const collectionId = createResult.collection.id;
	console.log('[collections.create] Created collection:', collectionId);

	// List collections
	const listResult = await corsair.asindataapi.api.collections.list({});
	console.log(
		'[collections.list] Total collections:',
		listResult.total_count ?? 0,
	);

	// Get collection details
	const getResult = await corsair.asindataapi.api.collections.get({
		id: collectionId,
	});
	console.log(
		'[collections.get] Collection status:',
		getResult.collection.status,
	);

	// Add requests to the collection
	const addResult = await corsair.asindataapi.api.requests.add({
		collectionId,
		requests: [
			{
				type: 'product',
				asin: 'B00I8RKMSM',
				amazon_domain: 'amazon.com',
			},
			{
				type: 'search',
				search_term: 'highlighter pens',
				amazon_domain: 'amazon.com',
			},
		],
	});
	console.log(
		'[requests.add] Collection now has',
		addResult.collection?.requests_total_count ?? 0,
		'requests',
	);

	// List requests in the collection
	const requestsResult = await corsair.asindataapi.api.requests.list({
		collectionId,
		page: 1,
	});
	console.log(
		'[requests.list] Page 1 has',
		requestsResult.requests?.length ?? 0,
		'requests',
	);

	// Update collection configuration
	const updateResult = await corsair.asindataapi.api.collections.update({
		id: collectionId,
		name: 'Updated Test Collection',
	});
	console.log(
		'[collections.update] Updated name:',
		updateResult.collection.name,
	);

	// Start the collection
	const startResult = await corsair.asindataapi.api.collections.start({
		id: collectionId,
	});
	console.log('[collections.start] Success:', startResult.request_info?.success);

	// List result sets
	const resultsListResult = await corsair.asindataapi.api.resultSets.list({
		collectionId,
	});
	console.log(
		'[resultSets.list] Found',
		resultsListResult.results?.length ?? 0,
		'result sets',
	);

	// Clear requests from collection
	const clearResult = await corsair.asindataapi.api.requests.clear({
		collectionId,
		requestIds: requestsResult.requests?.map((r) => r.id) ?? [],
	});
	console.log('[requests.clear] Success:', clearResult.request_info?.success);

	// Delete the collection
	const deleteResult = await corsair.asindataapi.api.collections.delete({
		id: collectionId,
	});
	console.log('[collections.delete] Success:', deleteResult.request_info?.success);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
