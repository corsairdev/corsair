/**
 * Response bodies for the tests, transcribed from the samples in RiteKit's
 * published Postman collection
 * (https://documenter.getpostman.com/view/2010712/SzS7Qku5) and the live refusals
 * captured from https://api.ritekit.com.
 */

// The four labels a stats entry's `color` indexes into.
export const COLOR_LEGEND = ['Unused', 'Overused', 'Good', 'Great'];

/** A stats entry as `/v1/stats/multiple-hashtags` returns it. */
export const HASHTAG_STATS = {
	hashtag: 'jobs',
	tag: 'jobs',
	tweets: 642,
	exposure: 1984429,
	retweets: 62,
	images: 0.3504673,
	links: 0.3504673,
	mentions: 0.0903427,
	color: 3,
};

export const HASHTAGS_STATS = {
	result: true,
	code: 200,
	hashtags: ['jobs', 'Chello'],
	message: 'OK',
	stats: [
		HASHTAG_STATS,
		{
			hashtag: 'chello',
			tag: 'chello',
			tweets: 0,
			exposure: 0,
			retweets: 4,
			images: 0,
			links: 0,
			mentions: 0,
			color: 2,
		},
	],
	color: COLOR_LEGEND,
};

export const HASHTAGS_AUTO = {
	result: true,
	code: 200,
	message: 'OK',
	post: 'Is artificial intelligence the future of customer service? #science #time',
};

export const HASHTAGS_SUGGESTIONS = {
	result: true,
	code: 200,
	message: 'OK',
	data: [
		{
			hashtag: 'seo',
			tag: 'seo',
			tweets: 271,
			exposure: 1661962,
			retweets: 96,
			images: 34,
			links: 34,
			mentions: 15,
			color: 3,
		},
		{
			hashtag: 'company',
			tag: 'company',
			tweets: 8,
			exposure: 5971,
			retweets: 4,
			images: 50,
			links: 50,
			mentions: 0,
			color: 3,
		},
	],
};

// This route answers `hashtags` rather than `data`, and omits `code`.
export const HASHTAGS_FOR_URL = {
	result: true,
	message: 'ok',
	hashtags: [
		{
			hashtag: 'socialmedia',
			tag: 'socialmedia',
			tweets: 317,
			exposure: 5380188,
			retweets: 75,
			images: 30.28391,
			links: 30.28391,
			mentions: 32.80757,
			color: 3,
		},
	],
};

export const HASHTAGS_FOR_IMAGE = {
	result: true,
	code: 200,
	message: 'OK',
	data: [
		{
			hashtag: 'water',
			tag: 'water',
			tweets: 75,
			exposure: 177483,
			retweets: 63,
			images: 33.33333,
			links: 33.33333,
			mentions: 10.66667,
			color: 3,
			mediaCount: 71793843,
		},
	],
};

// Trending uses `tags` and spells the image share `photos`.
export const HASHTAGS_TRENDING = {
	result: true,
	message: 'OK',
	code: 200,
	tags: [
		{
			tag: 'pahamipidanakerumunan',
			tweets: 6483,
			retweets: 405,
			exposure: 491642,
			links: 0.290452,
			photos: 0.290452,
			mentions: 0.1806263,
			color: 3,
		},
	],
};

export const BANNED_HASHTAGS = {
	result: true,
	message: 'OK',
	post: '#instaphotography #instabeauty #photography #beauty #nature',
	bannedHashtags: ['#girlsofinstagram'],
};

export const EMOJI_SUGGESTIONS = {
	result: true,
	code: 200,
	message: 'OK',
	emojis: ['🤖', '🗞', '❓'],
};

export const AUTO_EMOJIFY = {
	result: true,
	code: 200,
	message: 'OK',
	text: 'Why robots may soon steal all manufacturing jobs – but it’s not all bad news 🤖 🗞 ❓',
};

// The quote and animate samples are not published; the docs describe a URL.
export const QUOTE_IMAGE = {
	result: true,
	message: 'OK',
	url: 'https://cdn.ritekit.com/quote/abc123.jpg',
};

export const ANIMATED_IMAGE = {
	result: true,
	message: 'OK',
	url: 'https://cdn.ritekit.com/animate/def456.gif',
};

export const TOP_IMAGE = {
	result: true,
	message: 'OK',
	top_image:
		'https://fedoramagazine.org/wp-content/uploads/2020/10/secure-ntp-with-nts.jpg',
};

export const SHORT_LINK = {
	result: true,
	url: 'http://rite.ly/jr6e',
	original: 'https://ritekit.com',
	service: 'rite.ly',
	ctaId: '6530',
	limit: { remaining: 5000 },
};

export const FREEMAIL = {
	result: true,
	message: 'OK',
	domain: 'john.doe@gmail.com',
	freemail: true,
};

export const DISPOSABLE = {
	result: true,
	message: 'OK',
	email: 'john.doe@gmail.com',
	disposable: false,
};

export const EMAIL_TYPO = {
	result: true,
	message: 'OK',
	email: 'john.doe@gml.com',
	suggestions: [
		'john.doe@4mg.com',
		'john.doe@gmail.com',
		'john.doe@gmx.com',
		'john.doe@me.com',
	],
};

export const NAME_FROM_EMAIL = {
	result: true,
	message: 'OK',
	email: 'john.doe@test.com',
	info: { givenName: 'john', surname: 'doe' },
};

export const COMPANY_LOGO = {
	result: true,
	message: 'OK',
	isGenerated: false,
	domain: 'evernote.com',
	url: 'https://s3.us-east-2.amazonaws.com/storage.ritekit.com/logo/evernote.com.svg',
	permanentUrl:
		'https://api.ritekit.com/api/v2/image/logo/ae5e12b25b9f903fc5e3a113e368030289beb8c7d349a0eeb0a91fa32f8c8494',
	originalLogo: {
		url: {
			svg: 'https://s3.us-east-2.amazonaws.com/storage.ritekit.com/logo/evernote.com.svg',
		},
		permanentUrl: {
			svg: 'https://api.ritekit.com/api/v2/image/logo/ae5e12b25b9f903fc5e3a113e368030289beb8c7d349a0eeb0a91fa32f8c8494',
			png: 'https://api.ritekit.com/api/v2/image/logo/ae5e12b25b9f903fc5e3a113e368030289beb8c7d349a0eeb0a91fa32f8c8494?format=png',
		},
	},
	brandColors: ['#2dbe60', '#7b868a', '#2facb2'],
	squareLogo: {
		size: 256,
		background: 'original',
		url: {
			png: 'https://s3.us-east-2.amazonaws.com/storage.ritekit.com/logo2/evernote.com_square_256_original.png',
		},
		permanentUrl: {
			png: 'https://api.ritekit.com/api/v2/image/logo/e7fe0acd75b3f76ddb30b12699cec5edf6b0bd21adffe03c5b9c6987864d24de',
		},
	},
};

// The name-to-domain sample is not published in the collection; the docs say the
// route returns "an array of most probable domains".
// Live 11-12, trimmed: the domains come back under `data`, beside the name as
// RiteKit normalised it.
export const NAME_TO_DOMAIN = {
	result: true,
	message: 'OK',
	name: 'google',
	data: ['drive.google.com', 'cloud.google.com', 'google.com'],
};

export const BRAND_COLORS = {
	result: true,
	message: 'OK',
	name: 'producthunt.com',
	data: ['#da552f', '#534540', '#988f8c', '#00b27f'],
};

export const ARTICLE = {
	result: true,
	message: 'OK',
	url: 'https://ritekit.com/api-demo/extract-article',
	title: 'Extract article from URL API',
	text: 'Improve ROI of social media posts and ads programmatically',
};

export const LINK_PREVIEW = {
	result: true,
	message: 'OK',
	url: 'https://ritekit.com/api-demo/extract-article',
	title: 'Extract article from URL API',
	description: 'Improve ROI of social media posts and ads programmatically',
	image: 'https://cdn.ritekit.com/assets/img/common/ritekit-bg.png',
};

// Live: a call with no Client ID at all.
export const NO_KEY = {
	result: false,
	message: 'Endpoint is not accessible',
	info: 'Please make sure you authenticate your call with your Client ID or Access token as described here https://documenter.getpostman.com/view/2010712/SzS7Qku5?version=latest',
	code: 401,
};

// Live: a Client ID RiteKit does not recognise.
export const BAD_KEY = {
	result: false,
	message: 'Verification failed',
	code: 401,
};

export const BAD_REQUEST = {
	result: false,
	message: 'Parameter url is not a valid URL',
	code: 400,
};

export const NOT_ON_PLAN = {
	result: false,
	message: 'This endpoint is not available on your plan',
	code: 403,
};

export const OUT_OF_CREDITS = {
	result: false,
	message: 'Monthly API credits exhausted',
	code: 402,
};

export const RATE_LIMITED = {
	result: false,
	message: 'Too many requests',
	code: 429,
};

export const SERVER_ERROR = {
	result: false,
	message: 'Internal server error',
	code: 500,
};
