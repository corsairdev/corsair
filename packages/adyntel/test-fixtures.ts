/**
 * Bodies copied from Adyntel's own documentation examples, trimmed to the
 * fields the plugin's schemas read.
 * Source: https://docs.adyntel.com/open-api (one page per endpoint)
 */

export const metaAdsResponse = {
	page_id: '7172307686',
	country_code: 'ALL',
	continuation_token:
		'AQHSxHvUKdkvgxfh6ESFEPpsUrDsh2rC206kS2Rw4kvD1DpX8R_Qk7zpIEiVAZ_L95Y3',
	platform: ['facebook', 'instagram'],
	media_types: 'all',
	sort_data: 'SORT_BY_TOTAL_IMPRESSIONS',
	active_status: 'active',
	is_result_complete: false,
	number_of_ads: 32,
	count_landing_pages: 24,
	unique_landing_pages: ['https://www.zappos.com/'],
	start_min_date: null,
	start_max_date: null,
	results: [
		[
			{
				ad_archive_id: '1856457768340957',
				page_id: '7172307686',
				snapshot: {
					page_id: '7172307686',
					page_profile_uri: 'https://facebook.com/zappos',
					page_name: 'Zappos.com',
					body: {
						text: "This season's must haves, only at Zappos.",
					},
					caption: 'zappos.com',
					cards: [],
					cta_text: 'Shop Now',
					cta_type: 'SHOP_NOW',
					link_description: 'Fast, FREE shipping.',
					link_url: 'https://www.zappos.com/product/7165047/color/72',
					title: 'Frye Campus 14L Cowboy Boots',
				},
				is_active: true,
				page_name: 'Zappos.com',
				categories: ['UNKNOWN'],
				collation_id: '903628362519426',
				end_date: 1773212400,
				entity_type: 'PERSON_PROFILE',
				publisher_platform: [
					'FACEBOOK',
					'INSTAGRAM',
					'AUDIENCE_NETWORK',
					'MESSENGER',
				],
				start_date: 1771660800,
				total_active_time: null,
			},
		],
	],
};

/** The 204 body of `/facebook` when the page is not public or not found. */
export const metaAdsNoResults = null;

export const metaAdSearchResponse = {
	active_status: 'all',
	ad_type: 'all',
	continuation_token:
		'AQHRpfWC3j0LHeIhUWEz9ASnhiepWqURP9SFHR24o1aI07WYi4PboxWvPMqXbMoIBTS7',
	country_code: 'US',
	is_result_complete: false,
	media_types: 'all',
	number_of_ads: 50001,
	platform: ['ALL'],
	query: 'webinar',
	search_type: 'keyword_unordered',
	start_max_date: null,
	start_min_date: null,
	results: [
		[
			{
				adArchiveID: '540995951781259',
				adid: '0',
				archiveTypes: [],
				// The keyword search sends categories as numbers, where /facebook
				// sends names. This is why they have separate schemas.
				categories: [0],
				collationCount: null,
				currency: '',
				endDate: 1729753200,
				entityType: 'person_profile',
				isActive: false,
				isProfilePage: false,
				pageID: '271789181870',
				pageName: 'Current Electric',
				publisherPlatform: ['facebook', 'instagram', 'audience_network'],
				snapshot: {
					body: {
						callerHash: '1b73237f3c35d1c21cc1454501372314',
						markup: {
							__html:
								'Live Webinar - Unlock the Economic Benefits of Solar Power',
						},
					},
					caption: 'mailchi.mp',
					cards: [],
					cta_text: 'Learn more',
					cta_type: 'LEARN_MORE',
					display_format: 'image',
					images: [
						{
							original_image_url: 'https://scontent-ord5-2.xx.fbcdn.net/a.jpg',
							resized_image_url: 'https://scontent-ord5-2.xx.fbcdn.net/b.jpg',
						},
					],
					link_description: 'Maximize your ROI',
					link_url: 'https://mailchi.mp/99b549ef4050/commercial-solar-webinar',
					page_id: 271789181870,
					page_name: 'Current Electric',
					page_like_count: 5559,
					title: 'Boost your commercial value with solar',
				},
				spend: null,
				startDate: 1727766000,
				totalActiveTime: null,
			},
		],
	],
};

export const googleAdsResponse = {
	continuation_token:
		'CgoAP7zmzWyVepVfEhCcFXFmJGX7XoQegAEAAAAAGgn8+HwJ+GfueB4=',
	country_code: 'anywhere',
	total_ad_count: 200,
	ads: [
		{
			advertiser_id: 'AR02473231714533507073',
			creative_id: 'CR05168560628939358209',
			original_url:
				'https://adstransparency.google.com/advertiser/AR02473231714533507073/creative/CR05168560628939358209?region=anywhere',
			variants: [
				{
					content:
						'<img src="https://tpc.googlesyndication.com/archive/simgad/5361381490481140088" height="133" width="348">',
					height: 133.0,
					width: 348.0,
				},
			],
			start: '2025-11-06',
			last_seen: '2026-03-11',
			advertiser_name: 'Clay Labs',
			format: 'Text',
		},
		{
			advertiser_id: 'AR02473231714533507073',
			creative_id: 'CR11130817985680244737',
			// A video variant carries null dimensions.
			variants: [
				{
					content:
						'https://displayads-formats.googleusercontent.com/ads/preview',
					height: null,
					width: null,
				},
			],
			start: '2025-12-18',
			last_seen: '2026-03-11',
			advertiser_name: 'Clay Labs',
			format: 'Video',
		},
	],
};

export const googleShoppingQueued = {
	id: '12172142-7717-0066-0000-f1e50ca3d579',
};

export const googleShoppingAds = {
	ads: [
		{
			advertiser_id: 'AR11920289341835837441',
			creative_id: 'CR15157585378866626561',
			first_shown: '2024-02-27 01:02:34 +00:00',
			format: 'text',
			last_shown: '2024-12-17 17:07:32 +00:00',
			preview_image: {
				height: 173,
				url: 'https://tpc.googlesyndication.com/archive/simgad/9720546471572168024',
				width: 380,
			},
			preview_url: null,
			rank_absolute: 1,
			rank_group: 1,
			title: 'iHerb, LLC',
			type: 'ads_search',
			url: 'https://adstransparency.google.com/advertiser/AR11920289341835837441/creative/CR15157585378866626561?region=US',
			verified: true,
		},
	],
};

export const googleShoppingPending = {
	status: 'processing',
	message: 'Task is still processing',
};

export const linkedinAdsResponse = {
	page_id: '13018048',
	continuation_token: '1362084046-1772576023482',
	is_last_page: false,
	total_ads: 834,
	ads: [
		{
			creative_type: 'SPONSORED_STATUS_UPDATE',
			ad_id: '1362645846',
			type: 'image',
			advertiser: {
				name: 'Clay',
				logo_url: 'https://media.licdn.com/dms/image/v2/logo.png',
				promoted: true,
			},
			commentary: {
				text: 'Most GTM stacks weren\u2019t built for Europe.',
				link: null,
			},
			image: {
				alt_text: 'See how Clay is scaling in Europe',
				url: 'https://media.licdn.com/dms/image/v2/ad.png',
			},
			carousel: null,
			headline: {
				title: 'See how Clay is scaling in Europe',
				description: 'Promoted',
			},
			view_details_link:
				'https://www.linkedin.com/ad-library/detail/1362645846?trk=ad_library_ad_preview_content_image',
			raw: null,
		},
		{
			creative_type: 'SPONSORED_STATUS_UPDATE',
			ad_id: '1362665306',
			// A carousel ad has no image and no headline title.
			type: 'carousel',
			advertiser: {
				name: 'Bruno Estrella\nHead of Marketing @ Clay',
				logo_url: 'https://media.licdn.com/dms/image/v2/profile.png',
				promoted: false,
			},
			commentary: {
				text: 'I\u2019m hiring!',
				link: 'https://www.linkedin.com/company/grow-with-clay',
			},
			image: null,
			carousel: null,
			headline: {
				title: null,
				description: 'Head of Marketing @ Clay',
			},
			view_details_link:
				'https://www.linkedin.com/ad-library/detail/1362665306',
			raw: null,
		},
	],
};

/** What `impression_data` adds, including the empty block for a non-EU ad. */
export const linkedinEuTransparency = {
	startDate: '2026-08-24T00:00:00.000Z',
	endDate: '2026-09-03T00:00:00.000Z',
	adDuration: 'Ran from Aug 24, 2026 to Sep 3, 2026',
	totalImpressions: '< 1k',
	impressionsByCountry: [
		{ country: 'Germany', impressions: '34%' },
		{ country: 'France', impressions: '26%' },
	],
	targeting: {
		language: 'Targeting includes English',
		location: 'Targeting includes Germany, Netherlands',
	},
};

export const linkedinKeywordSearchResponse = {
	page_id: '13018048',
	continuation_token: '1362084046-1772576023482',
	is_last_page: false,
	total_ads: 834,
	ads: [
		{
			creative_type: 'SPONSORED_STATUS_UPDATE',
			ad_id: '1362645846',
			type: 'image',
			advertiser: { name: 'Clay', logo_url: null, promoted: true },
			commentary: { text: 'Clay in Europe.', link: null },
			image: { alt_text: '', url: 'https://media.licdn.com/a.png' },
			carousel: null,
			headline: { title: 'Book a demo now', description: 'Promoted' },
			view_details_link:
				'https://www.linkedin.com/ad-library/detail/1362645846',
			raw: null,
		},
	],
};

export const tiktokAdsResponse = {
	handle: 'gymshark',
	brand_ads: [
		{
			aweme_id: '7661334167342320918',
			url: 'https://www.tiktok.com/@gymshark/video/7661334167342320918',
			posted_at: 1783793370,
			desc: 'Onyx V1 Returns. July 16th.',
			is_ad: true,
			ad_source: 1,
			bc_type: 0,
			stats: {
				play_count: 1577611,
				digg_count: 242881,
				comment_count: 1030,
				share_count: 9118,
				collect_count: 17384,
				download_count: 1051,
			},
			music: {
				title: 'original sound - gymshark',
				is_commerce_music: true,
				is_original_sound: true,
			},
			anchors: [],
			shop_product_url: null,
			region: 'GB',
			duration: null,
		},
	],
	influencers: [
		{
			handle: 'llivsole',
			uid: '7582680501585527863',
			nickname: 'LIV',
			bio: 'sweat, smiles, and your fav playlist',
			follower_count: 0,
			aweme_count: 0,
			total_favorited: 0,
			trust_tier: 'paid_disclosed',
			bc_type: 1,
			discovered_via: '#gymsharkpartner',
			sample_ad: {
				aweme_id: '7683197142659271950',
				url: 'https://www.tiktok.com/@llivsole/video/7683197142659271950',
				posted_at: 1788883747,
				desc: 'I am in looove with this color',
				is_ad: false,
				ad_source: null,
				bc_type: 1,
				stats: { play_count: 10317, digg_count: 192 },
				music: { title: 'Yukon x Up hunnybee', is_commerce_music: true },
				anchors: [],
				shop_product_url: null,
				region: 'US',
				duration: null,
			},
		},
	],
	continuation_tokens: {
		brand_ads: '1787940000001',
		influencers: { gymsharkpartner: '20' },
	},
	cache: { hit: false, age_s: 0 },
};

export const tiktokKeywordSearchResponse = {
	code: 0,
	data: [
		{
			audit_status: '1',
			estimated_audience: '1K-10K',
			first_shown_date: 1732233600000,
			id: '1816440843906114',
			image_urls: [
				'https://p21-ad-sg.ibyteimg.com/origin/tos-alisg-p-0051c001-sg/a.jpg',
			],
			impression: 0,
			last_shown_date: 1734307200000,
			name: 'Moose Toys',
			rejection_info: null,
			show_mode: 1,
			sor_audit_status: '1',
			spent: '',
			type: '2',
			videos: [
				{
					cover_img:
						'https://p21-ad-sg.ibyteimg.com/origin/tos-alisg-p-0051c001-sg/a.jpg',
					video_url:
						'https://library.tiktok.com/api/v1/cdn/1734454268/video/x.mp4',
				},
			],
		},
	],
	has_more: true,
	search_id: '20241217165105DC1A2559407258D5E6B3',
	total: 1000,
};

/** A 200 from TikTok with a non-zero code: a failure wearing a success status. */
export const tiktokNonZeroCode = {
	code: 40001,
	data: [],
};

export const tiktokAdDetailsResponse = {
	code: 0,
	data: {
		ad: {
			audit_status: '1',
			estimated_audience: '100K-200K',
			first_shown_date: 1732665600000,
			id: '1816831112281202',
			image_urls: [
				'https://p21-ad-sg.ibyteimg.com/origin/tos-alisg-p-0051c001-sg/b.jpg',
			],
			impression: 0,
			last_shown_date: 1733702400000,
			name: 'elevateshoes',
			rejection_info: null,
			show_mode: 1,
			sor_audit_status: '1',
			spent: '',
			type: '2',
			videos: [
				{
					cover_img:
						'https://p21-ad-sg.ibyteimg.com/origin/tos-alisg-p-0051c001-sg/b.jpg',
					video_url:
						'https://library.tiktok.com/api/v1/cdn/1734464111/video/y.mp4',
				},
			],
		},
		advertiser: {
			adv_biz_ids: '7401666423417765905',
			name: 'elevateshoes',
			registry_location: 'Germany',
			sponsor: 'elevateshoes',
			tt_user: null,
		},
		targeting: {
			age: [{ '18-24': true, '25-34': true, region: 'AT' }],
			audience: 'No',
			gender: [{ female: true, male: true, region: 'AT', unknown: true }],
			target_audience_size: '21.9M-26.8M',
		},
	},
};

export const paidVsOrganicResponse = {
	organic: {
		pos_1: 379,
		pos_2_3: 1035,
		pos_4_10: 3364,
		pos_11_20: 4110,
		pos_21_30: 4835,
		pos_31_40: 4781,
		pos_41_50: 3728,
		pos_51_60: 2663,
		pos_61_70: 2260,
		pos_71_80: 2022,
		pos_81_90: 1540,
		pos_91_100: 1004,
		count: 31721,
		is_new: 11585,
		is_up: 9083,
		is_down: 8971,
		is_lost: 0,
		estimated_traffic: 371656,
	},
	organic_percentages: {
		pos_1: 1.19,
		pos_2_3: 3.26,
		is_new: 36.52,
	},
	paid: {
		pos_1: 82,
		count: 94,
		is_new: 88,
		estimated_traffic: 8812,
		estimated_ad_budget: 47297,
		estimated_avg_cpc: 5.37,
	},
	paid_percentages: {
		pos_1: 87.23,
		is_new: 93.62,
	},
};

/** The single error shape most endpoints use. */
export const errorBody = { message: 'Invalid username and api key' };

/** The TikTok endpoints use `detail` instead of `message`. */
export const detailErrorBody = { detail: 'Invalid credentials' };

/** A 200 saying a webhook job was queued, instead of returning ads. */
export const jobStarted = {
	status: 'job started',
	jobId: '0b0f2b8c-6f4f-45bf-aeae-4903501193hd',
};

/** The multi-country form answers with one job ID per country. */
export const jobsStarted = {
	status: 'job started',
	jobIds: ['0b0f2b8c-6f4f-45bf-aeae-4903501193hd'],
	failedCountries: ['ES'],
	message: 'Failed to enqueue 1 of 3 countries: ES',
};
