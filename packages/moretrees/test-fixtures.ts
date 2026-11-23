// Response bodies modeled on the examples in the More Trees API guide
// (https://moretrees.eco/learn/user-guides/api), with made-up accounts.

export const account = {
	account_name: 'Beachy BV',
	credit_balance: 123,
	forest_name: 'Beachy Forest',
	forest_slug: 'beachy',
};

export const forest = {
	forest_name: 'THG',
	logo_url: 'https://example.com/123.png',
	brand_color: '#000000',
	totals: {
		trees_planted: 123,
		trees_gifted: 12,
		trees_received: 1,
		co2_captured: 21,
		projects_supported: 2,
	},
};

export const project = {
	id: 1,
	name: 'Green Tree Reforestation',
	description: 'Reforestation in Germany.',
	country: 'Germany',
	project_type: 'Mangrove',
	supplier_name: 'Eden',
	default: true,
	project_image: 'https://example.com/project.png',
	trees: [
		{
			id: 1,
			name: 'Bald cypress',
			description: 'Small brown cones all year round.',
			tonnes_c02: 0.3,
			credits_required: 2,
			default: true,
			tree_image: 'https://example.com/tree.png',
		},
	],
};

export const projects = [project];

export const plantSelfResponse = {
	test: false,
	plant_for_others: false,
	credits_used: 2,
	credits_remaining: 2,
	project_id: 1,
	tree_id: 1,
};

export const plantOthersResponse = {
	test: true,
	plant_for_others: true,
	credits_used: 2,
	credits_remaining: 2,
	project_id: 1,
	tree_id: 1,
	recipients: [
		{ account_code: 'A1AB2B', account_name: 'abc', quantity: 1 },
		{ account_code: 'ACE2MK', account_name: 'def', quantity: 1 },
	],
};

/** The probed JSON envelope for a 400 without a key. */
export const badRequest = {
	status: 400,
	error: 'Bad Request',
	message: 'Bad Request',
	path: '/external/accounts/TEST',
};
