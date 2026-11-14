// Shapes captured from live responses of Kontent's public sample environment
// (`975bf280-fd91-488c-994c-2f04416e5ee3`), not from the docs' examples.
// `pagination.next_page` is a full URL, and an element's `value` type follows
// its `type`.

export const ENVIRONMENT_ID = '975bf280-fd91-488c-994c-2f04416e5ee3';

export const itemSystem = {
	id: 'ef23e568-6aa2-42cd-a120-7823c0ef19f7',
	name: 'About us',
	codename: 'about_us',
	language: 'en-US',
	type: 'about_us',
	collection: 'default',
	sitemap_locations: [],
	last_modified: '2022-07-18T11:39:34.0233275Z',
	workflow: 'default',
	workflow_step: 'published',
};

export const item = {
	system: itemSystem,
	elements: {
		facts: {
			type: 'modular_content',
			name: 'Facts',
			value: [
				'our_philosophy',
				'how_we_source_our_coffees',
				'how_we_roast_our_coffees',
			],
		},
		url_pattern: { type: 'url_slug', name: 'URL pattern' },
		metadata__meta_title: { type: 'text', name: 'Meta title' },
	},
};

export const items = {
	items: [
		item,
		{ ...item, system: { ...itemSystem, codename: 'home', name: 'Home' } },
	],
	modular_content: {
		our_philosophy: { system: { codename: 'our_philosophy' }, elements: {} },
	},
	pagination: { skip: 0, limit: 0, count: 2, next_page: '' },
};

/** A page whose `next_page` is a full URL, as the live API sends. */
export const itemsWithNext = {
	items: [item],
	modular_content: {},
	pagination: {
		skip: 0,
		limit: 1,
		count: 1,
		next_page: `https://deliver.kontent.ai/${ENVIRONMENT_ID}/items?limit=1&skip=1`,
	},
};

export const itemDetail = {
	item,
	modular_content: {
		our_philosophy: { system: { codename: 'our_philosophy' }, elements: {} },
	},
};

export const contentTypes = {
	types: [
		{
			system: {
				id: 'b2c14f2c-6467-460b-a70b-bca17972a33a',
				name: 'About us',
				codename: 'about_us',
				last_modified: '2022-07-18T11:29:29.8850486Z',
			},
			elements: {
				facts: { type: 'modular_content', name: 'Facts' },
				url_pattern: { type: 'url_slug', name: 'URL pattern' },
				sitemap: {
					type: 'taxonomy',
					name: 'Sitemap',
					taxonomy_group: 'sitemap_538125f',
				},
				metadata__meta_title: { type: 'text', name: 'Meta title' },
			},
		},
	],
	pagination: { skip: 0, limit: 0, count: 1, next_page: '' },
};

// GET /types/{codename} answers the type itself, `system` at the root.
export const contentType = contentTypes.types[0];

export const taxonomies = {
	taxonomies: [
		{
			system: {
				id: '4ce421e9-c403-eee8-fdc2-74f09392a749',
				name: 'Manufacturer',
				codename: 'manufacturer',
				last_modified: '2023-03-09T16:16:19.6167234Z',
			},
			terms: [
				{ name: 'Aerobie', codename: 'aerobie', terms: [] },
				{
					name: 'Hario',
					codename: 'hario',
					terms: [{ name: 'V60', codename: 'v60', terms: [] }],
				},
			],
		},
	],
	pagination: { skip: 0, limit: 0, count: 1, next_page: '' },
};

export const languages = {
	languages: [
		{
			system: {
				id: '00000000-0000-0000-0000-000000000000',
				name: 'English (United States)',
				codename: 'en-US',
			},
		},
		{
			system: {
				id: 'd1f95fde-af02-b3b5-bd9e-f232311ccab8',
				name: 'Spanish (Spain)',
				codename: 'es-ES',
			},
		},
	],
	pagination: { skip: 0, limit: 0, count: 2, next_page: '' },
};

/** The 404 body for an unknown content item. */
export const itemNotFound = {
	message: "The requested content item 'nope' was not found.",
	request_id: 'fc4c2800fa381362',
	error_code: 100,
	specific_code: 0,
};

/** The 404 body for an unknown environment, which is a config mistake. */
export const environmentNotFound = {
	message:
		"The specified environment with the ID '00000000-0000-0000-0000-000000000000' doesn't exist. Check for the correct environment ID in Kontent.ai > Environment settings > General.",
	request_id: '850732b170748d8d',
	error_code: 105,
	specific_code: 0,
};

/** An unknown content type. */
export const typeNotFound = {
	message: "The requested content type 'nope' was not found.",
	request_id: '8163c00d49205346',
	error_code: 101,
	specific_code: 0,
};

/** A refused preview token. */
export const unauthorized = {
	message: 'The preview token is not valid for this environment.',
	request_id: 'aaaaaaaaaaaaaaaa',
	error_code: 4,
	specific_code: 0,
};
