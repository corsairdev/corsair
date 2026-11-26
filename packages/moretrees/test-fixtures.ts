// Response bodies from the More Trees OpenAPI documents and API guide, with
// made-up accounts. `projectsBody` is a trimmed copy of the live
// GET /external/projects response (11-26), kept as raw text because its
// 64-bit IDs do not survive a JSON round trip in JavaScript.

export const account = {
	account_code: 'AC1C2C',
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

/** AccountInformationResponseDto rows, made-up people. */
export const accountLookupBody =
	'[{"userId":1212386588741409999,"accountCode":"AC1C2C","accountName":"Beachy BV","emailAddress":"ops@example.com","accountId":42,"quantity":0,"index":0,"accountStatus":"ACTIVE"}]';

export const BIG_TREE_ID = '1212386588741402633';

export const projectsBody = `{"data":[{"default":true,"id":24,"name":"Usambara Mountains","description":"Located in Tanzania's Kilimanjaro and Tanga regions.","country":"Tanzania","project_type":"Agroforestry & Forest Restoration","supplier_name":"Forest Focus","project_image":"https://fcdn.moretrees.eco/projects/tanzania/photo-1.jpg","trees":[{"default":true,"id":${BIG_TREE_ID},"name":"Markhamia lutea","description":"Usambara Mountains, Tanga, Tanzania","tonnes_co2":0.3,"credits_required":1.0,"tree_image":"https://fcdn.moretrees.eco/c550c852-1dd4-4d1c-a373-e4072b423b0f_tanzania_tree_type_picture_02.jpg"}]},{"default":false,"id":20,"name":"Canada, British Columbia","description":"Wildfire restoration.","country":"Canada","project_type":"Post Wildfire Restoration","supplier_name":"Veritree","project_image":"https://fcdn.moretrees.eco/projects/canada-bc/photo-1.jpg","trees":[{"default":true,"id":28,"name":"Conifer","description":"British Columbia, Canada","tonnes_co2":2.58,"credits_required":2.0,"tree_image":"https://fcdn.moretrees.eco/f3efad57-4358-4358-aadf-672a59a1a9db_canada_wildfire_tree_type_picture_02.jpg"}]}],"total":2}`;

/** ProjectTreeCreditInformationDto. */
export const projectTreeBody = `{"projectTreeId":1212386588741402700,"projectId":24,"treeId":${BIG_TREE_ID},"creditTypeId":3,"numberOfCredits":1.0,"creditTypeStripeCode":"price_tree_1","projectName":"Usambara Mountains","treeName":"Markhamia lutea"}`;

/** TotalProjectAndCo2Dto. */
export const totalCo2 = { totalCo2: 2.88, supportedProjects: 2 };

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

/** The probed 400 envelope (11-26). */
export const badRequest = {
	status: 400,
	timeStamp: '2026-11-26',
	error: 'Bad Request',
	message: 'Bad Request',
	path: '/external/accounts/TEST',
};

/** The probed 404 envelope (11-26). */
export const notFound = {
	status: 404,
	timeStamp: '2026-11-26',
	error: 'MTC-0004',
	message: 'The requested resource does not exist.',
	path: '/external/forest/zz-not-a-forest',
};
