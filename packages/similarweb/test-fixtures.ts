/**
 * Shapes taken from the example responses in Similarweb's published specs at
 * https://developers.similarweb.com/reference, with values that keep every
 * documented field type honest.
 */

export const globalRank = {
	meta: {
		request: {
			main_domain_only: false,
			show_verified: false,
			state: null,
			format: 'json',
			domain: 'cnn.com',
			start_date: '2023-01-01',
			end_date: '2023-03-31',
			country: 'world',
		},
		status: 'Success',
		last_updated: '2023-05-31',
	},
	global_rank: [
		{ date: '2023-01', global_rank: 86 },
		{ date: '2023-02', global_rank: 88 },
		{ date: '2023-03', global_rank: 90 },
	],
};

export const countryRank = {
	meta: {
		request: {
			format: 'json',
			domain: 'cnn.com',
			start_date: '2023-01-01',
			end_date: '2023-03-31',
			country: 'us',
		},
		status: 'Success',
		last_updated: '2023-05-31',
	},
	country_rank: [
		{ date: '2023-01', country_rank: 34 },
		{ date: '2023-02', country_rank: 34 },
		{ date: '2023-03', country_rank: 35 },
	],
};

export const industryRank = {
	meta: {
		request: { domain: 'amazon.com', format: 'json' },
		status: 'Success',
	},
	category: 'E-commerce_and_Shopping/Marketplace',
	rank: 1,
};

export const topSites = {
	meta: {
		request: { limit: 3, format: 'json' },
		status: 'Success',
		last_updated: '2023-05-31',
	},
	top_sites: [
		{ domain: 'google.com', rank: 1 },
		{ domain: 'youtube.com', rank: 2 },
		{ domain: 'facebook.com', rank: 3 },
	],
};

export const appRank = {
	meta: {
		request: {
			country: 'us',
			format: 'json',
			store: 'Google',
			app_id: 'com.whatsapp',
			mode: 'free',
			category: 'all',
			device: 'android-phone',
			duration: 30,
		},
		status: 'Success',
		last_updated: '2022-11-02',
	},
	ranks: [
		{ date: '2022-10-03', value: 3.0 },
		{ date: '2022-10-04', value: 4.0 },
	],
};

export const appDescribe = {
	app_rank: {
		countries: ['ae', 'us', 'world'],
		stores: [
			{ store: 'google', mode: 'free', device: 'androidphone' },
			{ store: 'apple', mode: 'topfree', device: 'iphone' },
		],
	},
};

export const categories = {
	'E-commerce_and_Shopping': {
		Marketplace: 'E-commerce_and_Shopping~Marketplace',
		Auctions: 'E-commerce_and_Shopping~Auctions',
	},
	AI_Chatbots_and_Tools: {},
};

export const capabilities = {
	remaining_tokens: 100,
	features: { website: true },
};

export const usage = {
	allowance: 10000,
	user_remaining: 4989,
};
