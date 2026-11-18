// Generated with endpoints/operation-types.ts from Litescrape's OpenAPI spec: one
// entry per operation in litescrape-manifest.json, plus the hand-written `keys` operations.
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import * as Keys from './keys';
import { litescrapeSchemaEntry } from './openapi-schema';
import { createLitescrapeOperation as op } from './operations';

export const litescrapeEndpointsNested = {
	airbnb: {
		search: op('airbnb.search'),
	},
	aliexpress: {
		product: op('aliexpress.product'),
		search: op('aliexpress.search'),
	},
	allkeyshop: {
		product: op('allkeyshop.product'),
		search: op('allkeyshop.search'),
	},
	amazon: {
		autocomplete: op('amazon.autocomplete'),
		product: op('amazon.product'),
		search: op('amazon.search'),
	},
	apartments: {
		property: op('apartments.property'),
		search: op('apartments.search'),
	},
	appleAppStore: {
		product: op('appleAppStore.product'),
		reviews: op('appleAppStore.reviews'),
		search: op('appleAppStore.search'),
	},
	appleMaps: {
		places: op('appleMaps.places'),
		reviews: op('appleMaps.reviews'),
	},
	ashby: {
		search: op('ashby.search'),
	},
	baidu: {
		search: op('baidu.search'),
	},
	bestbuy: {
		product: op('bestbuy.product'),
		search: op('bestbuy.search'),
	},
	bing: {
		autocomplete: op('bing.autocomplete'),
		images: op('bing.images'),
		maps: op('bing.maps'),
		product: op('bing.product'),
		search: op('bing.search'),
		shopping: op('bing.shopping'),
	},
	bluesky: {
		followers: op('bluesky.followers'),
		posts: op('bluesky.posts'),
		profile: op('bluesky.profile'),
	},
	booking: {
		detail: op('booking.detail'),
		rooms: op('booking.rooms'),
		search: op('booking.search'),
	},
	brave: {
		aiMode: op('brave.aiMode'),
		search: op('brave.search'),
	},
	copilot: {
		chat: op('copilot.chat'),
	},
	duckduckgo: {
		maps: op('duckduckgo.maps'),
		search: op('duckduckgo.search'),
	},
	ebay: {
		product: op('ebay.product'),
		search: op('ebay.search'),
		seller: op('ebay.seller'),
	},
	etsy: {
		product: op('etsy.product'),
		search: op('etsy.search'),
	},
	eventbrite: {
		search: op('eventbrite.search'),
	},
	facebook: {
		hashtagPosts: op('facebook.hashtagPosts'),
		marketplaceBrowse: op('facebook.marketplaceBrowse'),
		pagePosts: op('facebook.pagePosts'),
		post: op('facebook.post'),
		reel: op('facebook.reel'),
		searchPages: op('facebook.searchPages'),
		searchProfiles: op('facebook.searchProfiles'),
	},
	farmavazquez: {
		product: op('farmavazquez.product'),
		search: op('farmavazquez.search'),
	},
	github: {
		issues: op('github.issues'),
		releases: op('github.releases'),
		repository: op('github.repository'),
		search: op('github.search'),
		user: op('github.user'),
	},
	glassdoor: {
		search: op('glassdoor.search'),
	},
	google: {
		ads: op('google.ads'),
		aiMode: op('google.aiMode'),
		aiOverview: op('google.aiOverview'),
		autocomplete: op('google.autocomplete'),
		flights: op('google.flights'),
		gemini: op('google.gemini'),
		images: op('google.images'),
		jobs: op('google.jobs'),
		local: op('google.local'),
		news: op('google.news'),
		patents: op('google.patents'),
		reverseImageSearch: op('google.reverseImageSearch'),
		scholar: op('google.scholar'),
		search: op('google.search'),
		shopping: op('google.shopping'),
		shoppingMerchantUrls: op('google.shoppingMerchantUrls'),
		shoppingProduct: op('google.shoppingProduct'),
		trends: op('google.trends'),
	},
	googleMaps: {
		contributorReviews: op('googleMaps.contributorReviews'),
		menu: op('googleMaps.menu'),
		photoMeta: op('googleMaps.photoMeta'),
		photos: op('googleMaps.photos'),
		popularTimes: op('googleMaps.popularTimes'),
		posts: op('googleMaps.posts'),
		reviews: op('googleMaps.reviews'),
		search: op('googleMaps.search'),
	},
	googlePlay: {
		apps: op('googlePlay.apps'),
		books: op('googlePlay.books'),
		games: op('googlePlay.games'),
		movies: op('googlePlay.movies'),
		product: op('googlePlay.product'),
		reviews: op('googlePlay.reviews'),
	},
	greenhouse: {
		job: op('greenhouse.job'),
		jobs: op('greenhouse.jobs'),
	},
	hackernews: {
		item: op('hackernews.item'),
		stories: op('hackernews.stories'),
		user: op('hackernews.user'),
	},
	homedepot: {
		product: op('homedepot.product'),
		search: op('homedepot.search'),
	},
	homes: {
		property: op('homes.property'),
		search: op('homes.search'),
	},
	idealo: {
		product: op('idealo.product'),
		search: op('idealo.search'),
	},
	ikea: {
		product: op('ikea.product'),
		search: op('ikea.search'),
	},
	indeed: {
		search: op('indeed.search'),
	},
	instagram: {
		embed: op('instagram.embed'),
		post: op('instagram.post'),
		posts: op('instagram.posts'),
		profile: op('instagram.profile'),
		profilePostCount: op('instagram.profilePostCount'),
		searchPopular: op('instagram.searchPopular'),
	},
	kroger: {
		product: op('kroger.product'),
		search: op('kroger.search'),
	},
	levels: {
		search: op('levels.search'),
	},
	lever: {
		jobs: op('lever.jobs'),
	},
	linkedin: {
		company: op('linkedin.company'),
		companyPosts: op('linkedin.companyPosts'),
		job: op('linkedin.job'),
		jobs: op('linkedin.jobs'),
	},
	naturitas: {
		product: op('naturitas.product'),
		search: op('naturitas.search'),
	},
	naver: {
		aiOverview: op('naver.aiOverview'),
		search: op('naver.search'),
	},
	npm: {
		package: op('npm.package'),
		search: op('npm.search'),
	},
	pinterest: {
		profile: op('pinterest.profile'),
	},
	producthunt: {
		launches: op('producthunt.launches'),
	},
	pypi: {
		project: op('pypi.project'),
	},
	realtor: {
		property: op('realtor.property'),
		search: op('realtor.search'),
	},
	reddit: {
		post: op('reddit.post'),
		search: op('reddit.search'),
		subredditPosts: op('reddit.subredditPosts'),
	},
	redfin: {
		property: op('redfin.property'),
		search: op('redfin.search'),
	},
	remoteok: {
		jobs: op('remoteok.jobs'),
	},
	shopify: {
		products: op('shopify.products'),
	},
	soundcloud: {
		track: op('soundcloud.track'),
	},
	spotify: {
		item: op('spotify.item'),
	},
	sprouts: {
		product: op('sprouts.product'),
		search: op('sprouts.search'),
	},
	stackoverflow: {
		answers: op('stackoverflow.answers'),
		comments: op('stackoverflow.comments'),
		question: op('stackoverflow.question'),
		search: op('stackoverflow.search'),
	},
	steam: {
		app: op('steam.app'),
		search: op('steam.search'),
	},
	substack: {
		posts: op('substack.posts'),
	},
	target: {
		product: op('target.product'),
		search: op('target.search'),
	},
	telegram: {
		posts: op('telegram.posts'),
	},
	tiktok: {
		collectionVideos: op('tiktok.collectionVideos'),
		commentReplies: op('tiktok.commentReplies'),
		comments: op('tiktok.comments'),
		followers: op('tiktok.followers'),
		following: op('tiktok.following'),
		live: op('tiktok.live'),
		profile: op('tiktok.profile'),
		profileVideos: op('tiktok.profileVideos'),
		searchHashtag: op('tiktok.searchHashtag'),
		searchSuggestions: op('tiktok.searchSuggestions'),
		song: op('tiktok.song'),
		songVideos: op('tiktok.songVideos'),
		transcript: op('tiktok.transcript'),
		trendingFeed: op('tiktok.trendingFeed'),
		userLive: op('tiktok.userLive'),
		video: op('tiktok.video'),
	},
	tripadvisor: {
		place: op('tripadvisor.place'),
		reviews: op('tripadvisor.reviews'),
		search: op('tripadvisor.search'),
	},
	walmart: {
		product: op('walmart.product'),
		search: op('walmart.search'),
	},
	wayfair: {
		product: op('wayfair.product'),
		search: op('wayfair.search'),
	},
	web: {
		fetch: op('web.fetch'),
		screenshot: op('web.screenshot'),
	},
	wholefoods: {
		product: op('wholefoods.product'),
		search: op('wholefoods.search'),
	},
	wikipedia: {
		article: op('wikipedia.article'),
		search: op('wikipedia.search'),
	},
	workday: {
		jobs: op('workday.jobs'),
	},
	x: {
		community: op('x.community'),
		communityPosts: op('x.communityPosts'),
		post: op('x.post'),
		profile: op('x.profile'),
		userPosts: op('x.userPosts'),
	},
	yahoo: {
		financeHistory: op('yahoo.financeHistory'),
		images: op('yahoo.images'),
		search: op('yahoo.search'),
	},
	yandex: {
		images: op('yandex.images'),
		search: op('yandex.search'),
	},
	yelp: {
		place: op('yelp.place'),
		reviews: op('yelp.reviews'),
		search: op('yelp.search'),
	},
	youtube: {
		channel: op('youtube.channel'),
		comments: op('youtube.comments'),
		search: op('youtube.search'),
		video: op('youtube.video'),
	},
	zillow: {
		locations: op('zillow.locations'),
		property: op('zillow.property'),
		search: op('zillow.search'),
	},
	ziprecruiter: {
		search: op('ziprecruiter.search'),
	},
	keys: {
		status: Keys.status,
		usage: Keys.usage,
	},
} as const;

export const litescrapeEndpointSchemas = {
	'airbnb.search': litescrapeSchemaEntry('airbnb.search'),
	'aliexpress.product': litescrapeSchemaEntry('aliexpress.product'),
	'aliexpress.search': litescrapeSchemaEntry('aliexpress.search'),
	'allkeyshop.product': litescrapeSchemaEntry('allkeyshop.product'),
	'allkeyshop.search': litescrapeSchemaEntry('allkeyshop.search'),
	'amazon.autocomplete': litescrapeSchemaEntry('amazon.autocomplete'),
	'amazon.product': litescrapeSchemaEntry('amazon.product'),
	'amazon.search': litescrapeSchemaEntry('amazon.search'),
	'apartments.property': litescrapeSchemaEntry('apartments.property'),
	'apartments.search': litescrapeSchemaEntry('apartments.search'),
	'appleAppStore.product': litescrapeSchemaEntry('appleAppStore.product'),
	'appleAppStore.reviews': litescrapeSchemaEntry('appleAppStore.reviews'),
	'appleAppStore.search': litescrapeSchemaEntry('appleAppStore.search'),
	'appleMaps.places': litescrapeSchemaEntry('appleMaps.places'),
	'appleMaps.reviews': litescrapeSchemaEntry('appleMaps.reviews'),
	'ashby.search': litescrapeSchemaEntry('ashby.search'),
	'baidu.search': litescrapeSchemaEntry('baidu.search'),
	'bestbuy.product': litescrapeSchemaEntry('bestbuy.product'),
	'bestbuy.search': litescrapeSchemaEntry('bestbuy.search'),
	'bing.autocomplete': litescrapeSchemaEntry('bing.autocomplete'),
	'bing.images': litescrapeSchemaEntry('bing.images'),
	'bing.maps': litescrapeSchemaEntry('bing.maps'),
	'bing.product': litescrapeSchemaEntry('bing.product'),
	'bing.search': litescrapeSchemaEntry('bing.search'),
	'bing.shopping': litescrapeSchemaEntry('bing.shopping'),
	'bluesky.followers': litescrapeSchemaEntry('bluesky.followers'),
	'bluesky.posts': litescrapeSchemaEntry('bluesky.posts'),
	'bluesky.profile': litescrapeSchemaEntry('bluesky.profile'),
	'booking.detail': litescrapeSchemaEntry('booking.detail'),
	'booking.rooms': litescrapeSchemaEntry('booking.rooms'),
	'booking.search': litescrapeSchemaEntry('booking.search'),
	'brave.aiMode': litescrapeSchemaEntry('brave.aiMode'),
	'brave.search': litescrapeSchemaEntry('brave.search'),
	'copilot.chat': litescrapeSchemaEntry('copilot.chat'),
	'duckduckgo.maps': litescrapeSchemaEntry('duckduckgo.maps'),
	'duckduckgo.search': litescrapeSchemaEntry('duckduckgo.search'),
	'ebay.product': litescrapeSchemaEntry('ebay.product'),
	'ebay.search': litescrapeSchemaEntry('ebay.search'),
	'ebay.seller': litescrapeSchemaEntry('ebay.seller'),
	'etsy.product': litescrapeSchemaEntry('etsy.product'),
	'etsy.search': litescrapeSchemaEntry('etsy.search'),
	'eventbrite.search': litescrapeSchemaEntry('eventbrite.search'),
	'facebook.hashtagPosts': litescrapeSchemaEntry('facebook.hashtagPosts'),
	'facebook.marketplaceBrowse': litescrapeSchemaEntry(
		'facebook.marketplaceBrowse',
	),
	'facebook.pagePosts': litescrapeSchemaEntry('facebook.pagePosts'),
	'facebook.post': litescrapeSchemaEntry('facebook.post'),
	'facebook.reel': litescrapeSchemaEntry('facebook.reel'),
	'facebook.searchPages': litescrapeSchemaEntry('facebook.searchPages'),
	'facebook.searchProfiles': litescrapeSchemaEntry('facebook.searchProfiles'),
	'farmavazquez.product': litescrapeSchemaEntry('farmavazquez.product'),
	'farmavazquez.search': litescrapeSchemaEntry('farmavazquez.search'),
	'github.issues': litescrapeSchemaEntry('github.issues'),
	'github.releases': litescrapeSchemaEntry('github.releases'),
	'github.repository': litescrapeSchemaEntry('github.repository'),
	'github.search': litescrapeSchemaEntry('github.search'),
	'github.user': litescrapeSchemaEntry('github.user'),
	'glassdoor.search': litescrapeSchemaEntry('glassdoor.search'),
	'google.ads': litescrapeSchemaEntry('google.ads'),
	'google.aiMode': litescrapeSchemaEntry('google.aiMode'),
	'google.aiOverview': litescrapeSchemaEntry('google.aiOverview'),
	'google.autocomplete': litescrapeSchemaEntry('google.autocomplete'),
	'google.flights': litescrapeSchemaEntry('google.flights'),
	'google.gemini': litescrapeSchemaEntry('google.gemini'),
	'google.images': litescrapeSchemaEntry('google.images'),
	'google.jobs': litescrapeSchemaEntry('google.jobs'),
	'google.local': litescrapeSchemaEntry('google.local'),
	'google.news': litescrapeSchemaEntry('google.news'),
	'google.patents': litescrapeSchemaEntry('google.patents'),
	'google.reverseImageSearch': litescrapeSchemaEntry(
		'google.reverseImageSearch',
	),
	'google.scholar': litescrapeSchemaEntry('google.scholar'),
	'google.search': litescrapeSchemaEntry('google.search'),
	'google.shopping': litescrapeSchemaEntry('google.shopping'),
	'google.shoppingMerchantUrls': litescrapeSchemaEntry(
		'google.shoppingMerchantUrls',
	),
	'google.shoppingProduct': litescrapeSchemaEntry('google.shoppingProduct'),
	'google.trends': litescrapeSchemaEntry('google.trends'),
	'googleMaps.contributorReviews': litescrapeSchemaEntry(
		'googleMaps.contributorReviews',
	),
	'googleMaps.menu': litescrapeSchemaEntry('googleMaps.menu'),
	'googleMaps.photoMeta': litescrapeSchemaEntry('googleMaps.photoMeta'),
	'googleMaps.photos': litescrapeSchemaEntry('googleMaps.photos'),
	'googleMaps.popularTimes': litescrapeSchemaEntry('googleMaps.popularTimes'),
	'googleMaps.posts': litescrapeSchemaEntry('googleMaps.posts'),
	'googleMaps.reviews': litescrapeSchemaEntry('googleMaps.reviews'),
	'googleMaps.search': litescrapeSchemaEntry('googleMaps.search'),
	'googlePlay.apps': litescrapeSchemaEntry('googlePlay.apps'),
	'googlePlay.books': litescrapeSchemaEntry('googlePlay.books'),
	'googlePlay.games': litescrapeSchemaEntry('googlePlay.games'),
	'googlePlay.movies': litescrapeSchemaEntry('googlePlay.movies'),
	'googlePlay.product': litescrapeSchemaEntry('googlePlay.product'),
	'googlePlay.reviews': litescrapeSchemaEntry('googlePlay.reviews'),
	'greenhouse.job': litescrapeSchemaEntry('greenhouse.job'),
	'greenhouse.jobs': litescrapeSchemaEntry('greenhouse.jobs'),
	'hackernews.item': litescrapeSchemaEntry('hackernews.item'),
	'hackernews.stories': litescrapeSchemaEntry('hackernews.stories'),
	'hackernews.user': litescrapeSchemaEntry('hackernews.user'),
	'homedepot.product': litescrapeSchemaEntry('homedepot.product'),
	'homedepot.search': litescrapeSchemaEntry('homedepot.search'),
	'homes.property': litescrapeSchemaEntry('homes.property'),
	'homes.search': litescrapeSchemaEntry('homes.search'),
	'idealo.product': litescrapeSchemaEntry('idealo.product'),
	'idealo.search': litescrapeSchemaEntry('idealo.search'),
	'ikea.product': litescrapeSchemaEntry('ikea.product'),
	'ikea.search': litescrapeSchemaEntry('ikea.search'),
	'indeed.search': litescrapeSchemaEntry('indeed.search'),
	'instagram.embed': litescrapeSchemaEntry('instagram.embed'),
	'instagram.post': litescrapeSchemaEntry('instagram.post'),
	'instagram.posts': litescrapeSchemaEntry('instagram.posts'),
	'instagram.profile': litescrapeSchemaEntry('instagram.profile'),
	'instagram.profilePostCount': litescrapeSchemaEntry(
		'instagram.profilePostCount',
	),
	'instagram.searchPopular': litescrapeSchemaEntry('instagram.searchPopular'),
	'kroger.product': litescrapeSchemaEntry('kroger.product'),
	'kroger.search': litescrapeSchemaEntry('kroger.search'),
	'levels.search': litescrapeSchemaEntry('levels.search'),
	'lever.jobs': litescrapeSchemaEntry('lever.jobs'),
	'linkedin.company': litescrapeSchemaEntry('linkedin.company'),
	'linkedin.companyPosts': litescrapeSchemaEntry('linkedin.companyPosts'),
	'linkedin.job': litescrapeSchemaEntry('linkedin.job'),
	'linkedin.jobs': litescrapeSchemaEntry('linkedin.jobs'),
	'naturitas.product': litescrapeSchemaEntry('naturitas.product'),
	'naturitas.search': litescrapeSchemaEntry('naturitas.search'),
	'naver.aiOverview': litescrapeSchemaEntry('naver.aiOverview'),
	'naver.search': litescrapeSchemaEntry('naver.search'),
	'npm.package': litescrapeSchemaEntry('npm.package'),
	'npm.search': litescrapeSchemaEntry('npm.search'),
	'pinterest.profile': litescrapeSchemaEntry('pinterest.profile'),
	'producthunt.launches': litescrapeSchemaEntry('producthunt.launches'),
	'pypi.project': litescrapeSchemaEntry('pypi.project'),
	'realtor.property': litescrapeSchemaEntry('realtor.property'),
	'realtor.search': litescrapeSchemaEntry('realtor.search'),
	'reddit.post': litescrapeSchemaEntry('reddit.post'),
	'reddit.search': litescrapeSchemaEntry('reddit.search'),
	'reddit.subredditPosts': litescrapeSchemaEntry('reddit.subredditPosts'),
	'redfin.property': litescrapeSchemaEntry('redfin.property'),
	'redfin.search': litescrapeSchemaEntry('redfin.search'),
	'remoteok.jobs': litescrapeSchemaEntry('remoteok.jobs'),
	'shopify.products': litescrapeSchemaEntry('shopify.products'),
	'soundcloud.track': litescrapeSchemaEntry('soundcloud.track'),
	'spotify.item': litescrapeSchemaEntry('spotify.item'),
	'sprouts.product': litescrapeSchemaEntry('sprouts.product'),
	'sprouts.search': litescrapeSchemaEntry('sprouts.search'),
	'stackoverflow.answers': litescrapeSchemaEntry('stackoverflow.answers'),
	'stackoverflow.comments': litescrapeSchemaEntry('stackoverflow.comments'),
	'stackoverflow.question': litescrapeSchemaEntry('stackoverflow.question'),
	'stackoverflow.search': litescrapeSchemaEntry('stackoverflow.search'),
	'steam.app': litescrapeSchemaEntry('steam.app'),
	'steam.search': litescrapeSchemaEntry('steam.search'),
	'substack.posts': litescrapeSchemaEntry('substack.posts'),
	'target.product': litescrapeSchemaEntry('target.product'),
	'target.search': litescrapeSchemaEntry('target.search'),
	'telegram.posts': litescrapeSchemaEntry('telegram.posts'),
	'tiktok.collectionVideos': litescrapeSchemaEntry('tiktok.collectionVideos'),
	'tiktok.commentReplies': litescrapeSchemaEntry('tiktok.commentReplies'),
	'tiktok.comments': litescrapeSchemaEntry('tiktok.comments'),
	'tiktok.followers': litescrapeSchemaEntry('tiktok.followers'),
	'tiktok.following': litescrapeSchemaEntry('tiktok.following'),
	'tiktok.live': litescrapeSchemaEntry('tiktok.live'),
	'tiktok.profile': litescrapeSchemaEntry('tiktok.profile'),
	'tiktok.profileVideos': litescrapeSchemaEntry('tiktok.profileVideos'),
	'tiktok.searchHashtag': litescrapeSchemaEntry('tiktok.searchHashtag'),
	'tiktok.searchSuggestions': litescrapeSchemaEntry('tiktok.searchSuggestions'),
	'tiktok.song': litescrapeSchemaEntry('tiktok.song'),
	'tiktok.songVideos': litescrapeSchemaEntry('tiktok.songVideos'),
	'tiktok.transcript': litescrapeSchemaEntry('tiktok.transcript'),
	'tiktok.trendingFeed': litescrapeSchemaEntry('tiktok.trendingFeed'),
	'tiktok.userLive': litescrapeSchemaEntry('tiktok.userLive'),
	'tiktok.video': litescrapeSchemaEntry('tiktok.video'),
	'tripadvisor.place': litescrapeSchemaEntry('tripadvisor.place'),
	'tripadvisor.reviews': litescrapeSchemaEntry('tripadvisor.reviews'),
	'tripadvisor.search': litescrapeSchemaEntry('tripadvisor.search'),
	'walmart.product': litescrapeSchemaEntry('walmart.product'),
	'walmart.search': litescrapeSchemaEntry('walmart.search'),
	'wayfair.product': litescrapeSchemaEntry('wayfair.product'),
	'wayfair.search': litescrapeSchemaEntry('wayfair.search'),
	'web.fetch': litescrapeSchemaEntry('web.fetch'),
	'web.screenshot': litescrapeSchemaEntry('web.screenshot'),
	'wholefoods.product': litescrapeSchemaEntry('wholefoods.product'),
	'wholefoods.search': litescrapeSchemaEntry('wholefoods.search'),
	'wikipedia.article': litescrapeSchemaEntry('wikipedia.article'),
	'wikipedia.search': litescrapeSchemaEntry('wikipedia.search'),
	'workday.jobs': litescrapeSchemaEntry('workday.jobs'),
	'x.community': litescrapeSchemaEntry('x.community'),
	'x.communityPosts': litescrapeSchemaEntry('x.communityPosts'),
	'x.post': litescrapeSchemaEntry('x.post'),
	'x.profile': litescrapeSchemaEntry('x.profile'),
	'x.userPosts': litescrapeSchemaEntry('x.userPosts'),
	'yahoo.financeHistory': litescrapeSchemaEntry('yahoo.financeHistory'),
	'yahoo.images': litescrapeSchemaEntry('yahoo.images'),
	'yahoo.search': litescrapeSchemaEntry('yahoo.search'),
	'yandex.images': litescrapeSchemaEntry('yandex.images'),
	'yandex.search': litescrapeSchemaEntry('yandex.search'),
	'yelp.place': litescrapeSchemaEntry('yelp.place'),
	'yelp.reviews': litescrapeSchemaEntry('yelp.reviews'),
	'yelp.search': litescrapeSchemaEntry('yelp.search'),
	'youtube.channel': litescrapeSchemaEntry('youtube.channel'),
	'youtube.comments': litescrapeSchemaEntry('youtube.comments'),
	'youtube.search': litescrapeSchemaEntry('youtube.search'),
	'youtube.video': litescrapeSchemaEntry('youtube.video'),
	'zillow.locations': litescrapeSchemaEntry('zillow.locations'),
	'zillow.property': litescrapeSchemaEntry('zillow.property'),
	'zillow.search': litescrapeSchemaEntry('zillow.search'),
	'ziprecruiter.search': litescrapeSchemaEntry('ziprecruiter.search'),
	'keys.status': {
		input: Keys.KeysStatusInputSchema,
		output: Keys.KeysStatusResponseSchema,
	},
	'keys.usage': {
		input: Keys.KeysUsageInputSchema,
		output: Keys.KeysUsageResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof litescrapeEndpointsNested
>;

// Every operation reads public web data. Each call spends one prepaid Litescrape
// call, which R8 counts as a metered read, not a destructive spend.
export const litescrapeEndpointMeta = {
	'airbnb.search': {
		riskLevel: 'read',
		description: 'Search Airbnb stays by destination and dates',
	},
	'aliexpress.product': {
		riskLevel: 'read',
		description: "Get an AliExpress product's details and price (Alpha)",
	},
	'aliexpress.search': {
		riskLevel: 'read',
		description: 'Search AliExpress products with prices (Alpha)',
	},
	'allkeyshop.product': {
		riskLevel: 'read',
		description: 'Get Allkeyshop product details, prices, and available offers',
	},
	'allkeyshop.search': {
		riskLevel: 'read',
		description: 'Search Allkeyshop products with prices and product links',
	},
	'amazon.autocomplete': {
		riskLevel: 'read',
		description:
			'Get Amazon search suggestions for a prefix and department (Alpha)',
	},
	'amazon.product': {
		riskLevel: 'read',
		description:
			'Get an Amazon product page, with optional seller offers (Alpha)',
	},
	'amazon.search': {
		riskLevel: 'read',
		description: 'Search Amazon products (Alpha)',
	},
	'apartments.property': {
		riskLevel: 'read',
		description: 'Get an Apartments.com property by URL (Alpha)',
	},
	'apartments.search': {
		riskLevel: 'read',
		description: 'Search Apartments.com listings from a search URL (Alpha)',
	},
	'appleAppStore.product': {
		riskLevel: 'read',
		description:
			'Get an Apple App Store product page with version history and privacy labels (Alpha)',
	},
	'appleAppStore.reviews': {
		riskLevel: 'read',
		description:
			'Get Apple App Store reviews, newest or most helpful first (Alpha)',
	},
	'appleAppStore.search': {
		riskLevel: 'read',
		description:
			'Search the Apple App Store for apps with developer, price and rating (Alpha)',
	},
	'appleMaps.places': {
		riskLevel: 'read',
		description:
			'Get Apple Maps places by MUID with address, hours and ratings',
	},
	'appleMaps.reviews': {
		riskLevel: 'read',
		description: 'Get Apple Maps rating summary and written reviews by MUID',
	},
	'ashby.search': {
		riskLevel: 'read',
		description: "Search jobs on a company's Ashby job board",
	},
	'baidu.search': {
		riskLevel: 'read',
		description: 'Get Baidu search results as JSON',
	},
	'bestbuy.product': {
		riskLevel: 'read',
		description:
			"Get a Best Buy product's details, price and availability (Alpha)",
	},
	'bestbuy.search': {
		riskLevel: 'read',
		description:
			'Search Best Buy products with prices and availability (Alpha)',
	},
	'bing.autocomplete': {
		riskLevel: 'read',
		description:
			'Get Bing search suggestions for a partial query, with entity details when Bing shows them',
	},
	'bing.images': {
		riskLevel: 'read',
		description:
			'Search Bing Images with size, color, date and license filters',
	},
	'bing.maps': {
		riskLevel: 'read',
		description: 'Get Bing Maps listings by query or one place by ID',
	},
	'bing.product': {
		riskLevel: 'read',
		description:
			"Get a Bing Shopping product's details using its product token",
	},
	'bing.search': {
		riskLevel: 'read',
		description:
			'Search Bing for organic results, knowledge cards and rich modules',
	},
	'bing.shopping': {
		riskLevel: 'read',
		description: 'Search Bing Shopping products',
	},
	'bluesky.followers': {
		riskLevel: 'read',
		description: 'List the public followers of a Bluesky account',
	},
	'bluesky.posts': {
		riskLevel: 'read',
		description: 'Read public posts from a Bluesky account with pagination',
	},
	'bluesky.profile': {
		riskLevel: 'read',
		description: 'Get a public Bluesky profile and follower counts',
	},
	'booking.detail': {
		riskLevel: 'read',
		description:
			'Get property photos, facilities, policies, review summaries, guest questions, and a quote for selected dates and guests',
	},
	'booking.rooms': {
		riskLevel: 'read',
		description:
			'Get room types and available rate options for a property stay, including capacity, beds, facilities, prices, and cancellation terms',
	},
	'booking.search': {
		riskLevel: 'read',
		description:
			'Search accommodations by destination and stay, with locations, prices, rate terms, ratings, and room configurations',
	},
	'brave.aiMode': {
		riskLevel: 'read',
		description: 'Get Brave AI answers with citations',
	},
	'brave.search': {
		riskLevel: 'read',
		description: 'Get Brave web search results',
	},
	'copilot.chat': {
		riskLevel: 'read',
		description: 'Text completions through Microsoft Copilot (Alpha)',
	},
	'duckduckgo.maps': {
		riskLevel: 'read',
		description: 'Get DuckDuckGo Maps places within a bounding box',
	},
	'duckduckgo.search': {
		riskLevel: 'read',
		description:
			'Search DuckDuckGo for organic results with region and safe-search controls',
	},
	'ebay.product': {
		riskLevel: 'read',
		description: 'Get an eBay listing by item ID',
	},
	'ebay.search': {
		riskLevel: 'read',
		description: 'Search eBay listings by keyword or category',
	},
	'ebay.seller': {
		riskLevel: 'read',
		description: "Get an eBay seller's profile and listings",
	},
	'etsy.product': {
		riskLevel: 'read',
		description: "Get an Etsy listing's details and price (Alpha)",
	},
	'etsy.search': {
		riskLevel: 'read',
		description: 'Search Etsy listings with prices (Alpha)',
	},
	'eventbrite.search': {
		riskLevel: 'read',
		description: 'Search Eventbrite events by location and keyword',
	},
	'facebook.hashtagPosts': {
		riskLevel: 'read',
		description: 'Get public Facebook posts for a hashtag (Alpha)',
	},
	'facebook.marketplaceBrowse': {
		riskLevel: 'read',
		description:
			'Browse or search Facebook Marketplace listings by city (Alpha)',
	},
	'facebook.pagePosts': {
		riskLevel: 'read',
		description: 'Get recent public posts from a Facebook Page (Alpha)',
	},
	'facebook.post': {
		riskLevel: 'read',
		description: 'Get a public Facebook post by its URL (Alpha)',
	},
	'facebook.reel': {
		riskLevel: 'read',
		description: 'Get a public Facebook reel by its URL (Alpha)',
	},
	'facebook.searchPages': {
		riskLevel: 'read',
		description: 'Search public Facebook Pages by name (Alpha)',
	},
	'facebook.searchProfiles': {
		riskLevel: 'read',
		description: 'Search public Facebook profiles by name (Alpha)',
	},
	'farmavazquez.product': {
		riskLevel: 'read',
		description:
			'Get FarmaVázquez product details, prices, and available offers',
	},
	'farmavazquez.search': {
		riskLevel: 'read',
		description: 'Search FarmaVázquez products with prices and product links',
	},
	'github.issues': {
		riskLevel: 'read',
		description:
			'List repository issues and pull requests with their authors and labels',
	},
	'github.releases': {
		riskLevel: 'read',
		description: 'List repository releases and downloadable assets',
	},
	'github.repository': {
		riskLevel: 'read',
		description:
			'Get repository details, stars, forks, topics, and activity dates',
	},
	'github.search': {
		riskLevel: 'read',
		description: 'Search public GitHub repositories by keywords and qualifiers',
	},
	'github.user': {
		riskLevel: 'read',
		description: 'Get a public GitHub user or organization profile',
	},
	'glassdoor.search': {
		riskLevel: 'read',
		description:
			'Search Glassdoor jobs by keyword and location, with salary, seniority and remote filters',
	},
	'google.ads': {
		riskLevel: 'read',
		description:
			'Get Google text, local and shopping ads plus the rest of the results page (Alpha)',
	},
	'google.aiMode': {
		riskLevel: 'read',
		description:
			'Ask Google AI Mode a question and get text blocks with cited references',
	},
	'google.aiOverview': {
		riskLevel: 'read',
		description:
			"Get Google's AI Overview for a query as text blocks and cited references",
	},
	'google.autocomplete': {
		riskLevel: 'read',
		description: 'Get search suggestions for a partial query',
	},
	'google.flights': {
		riskLevel: 'read',
		description:
			'Search flights with passenger fares, multiple airports, airline logos, emissions, price insights, compatible return itineraries and booking links',
	},
	'google.gemini': {
		riskLevel: 'read',
		description: 'Get a completed text reply from Gemini',
	},
	'google.images': {
		riskLevel: 'read',
		description:
			'Search Google Images. Embedded images may use an x-raw-image:/// reference in original instead of an HTTP URL; thumbnail remains an HTTP image URL',
	},
	'google.jobs': {
		riskLevel: 'read',
		description:
			'Search Google Jobs listings by query and location, including descriptions and application links when available',
	},
	'google.local': {
		riskLevel: 'read',
		description:
			'Get Google local results with rating, reviews, category, address and place IDs',
	},
	'google.news': {
		riskLevel: 'read',
		description: 'Find recent news articles by topic, language, and country',
	},
	'google.patents': {
		riskLevel: 'read',
		description:
			'Search patent publications by query, patent office, status, and publication date',
	},
	'google.reverseImageSearch': {
		riskLevel: 'read',
		description: 'Find visually similar images and pages using an image URL',
	},
	'google.scholar': {
		riskLevel: 'read',
		description:
			'Search scholarly articles with publication details, citation counts, and full-text links',
	},
	'google.search': {
		riskLevel: 'read',
		description:
			'Search Google for organic results, Knowledge Graph, related searches and the AI Overview',
	},
	'google.shopping': {
		riskLevel: 'read',
		description:
			'Get Google Shopping products with price, merchant, rating and delivery',
	},
	'google.shoppingMerchantUrls': {
		riskLevel: 'read',
		description: 'Get direct merchant URLs for Google Shopping offers',
	},
	'google.shoppingProduct': {
		riskLevel: 'read',
		description:
			'Get one Google Shopping product page with every merchant offer and specification',
	},
	'google.trends': {
		riskLevel: 'read',
		description: 'Get currently trending searches and related news by country',
	},
	'googleMaps.contributorReviews': {
		riskLevel: 'read',
		description:
			'Get the public review history for one Google Maps contributor',
	},
	'googleMaps.menu': {
		riskLevel: 'read',
		description:
			"Get a restaurant's menu, prices, booking links, and opening hours",
	},
	'googleMaps.photoMeta': {
		riskLevel: 'read',
		description: 'Get the place, contributor and date of a Google Maps photo',
	},
	'googleMaps.photos': {
		riskLevel: 'read',
		description:
			"List a place's photos and videos, including only the ones its owner posted",
	},
	'googleMaps.popularTimes': {
		riskLevel: 'read',
		description: 'See how busy a Google Maps place is right now',
	},
	'googleMaps.posts': {
		riskLevel: 'read',
		description: 'Read the posts published by a Google Maps business',
	},
	'googleMaps.reviews': {
		riskLevel: 'read',
		description:
			'Get Google Maps reviews with rating, text, author, date and likes',
	},
	'googleMaps.search': {
		riskLevel: 'read',
		description: 'Get Google Maps places by query or one place by ID',
	},
	'googlePlay.apps': {
		riskLevel: 'read',
		description:
			'Search and browse Google Play apps with charts, categories and storefronts (Alpha)',
	},
	'googlePlay.books': {
		riskLevel: 'read',
		description:
			'Browse Google Play ebooks and audiobooks with categories and charts (Alpha)',
	},
	'googlePlay.games': {
		riskLevel: 'read',
		description:
			'Browse Google Play games by category, chart and device (Alpha)',
	},
	'googlePlay.movies': {
		riskLevel: 'read',
		description:
			'Browse Google Play movies, shows and episodes with categories and charts (Alpha)',
	},
	'googlePlay.product': {
		riskLevel: 'read',
		description:
			'Get a Google Play product page with ratings, permissions, media and reviews (Alpha)',
	},
	'googlePlay.reviews': {
		riskLevel: 'read',
		description:
			'Get Google Play reviews filtered by rating and platform (Alpha)',
	},
	'greenhouse.job': {
		riskLevel: 'read',
		description:
			'Get a public Greenhouse job description, departments, published pay ranges, and application questions',
	},
	'greenhouse.jobs': {
		riskLevel: 'read',
		description: 'List public employer jobs and filter by title or location',
	},
	'hackernews.item': {
		riskLevel: 'read',
		description: 'Get a Hacker News story, comment, job, or poll by ID',
	},
	'hackernews.stories': {
		riskLevel: 'read',
		description:
			'Get ranked Hacker News stories with scores and discussion IDs',
	},
	'hackernews.user': {
		riskLevel: 'read',
		description:
			'Get a public Hacker News profile and recent submitted item IDs',
	},
	'homedepot.product': {
		riskLevel: 'read',
		description:
			"Get a Home Depot product's details, price and availability (Alpha)",
	},
	'homedepot.search': {
		riskLevel: 'read',
		description:
			'Search Home Depot products with prices and availability (Alpha)',
	},
	'homes.property': {
		riskLevel: 'read',
		description: 'Get a Homes.com property by URL (Alpha)',
	},
	'homes.search': {
		riskLevel: 'read',
		description: 'Search Homes.com listings from a search URL (Alpha)',
	},
	'idealo.product': {
		riskLevel: 'read',
		description:
			'Get Idealo Italy product details, prices, and available offers',
	},
	'idealo.search': {
		riskLevel: 'read',
		description: 'Search Idealo Italy products with prices and product links',
	},
	'ikea.product': {
		riskLevel: 'read',
		description:
			"Get an IKEA product's details, price and availability (Alpha)",
	},
	'ikea.search': {
		riskLevel: 'read',
		description: 'Search IKEA products with prices and availability (Alpha)',
	},
	'indeed.search': {
		riskLevel: 'read',
		description:
			'Search Indeed jobs by keyword and location, with salary, experience and remote filters',
	},
	'instagram.embed': {
		riskLevel: 'read',
		description: 'Retrieve public Instagram embed data (Alpha)',
	},
	'instagram.post': {
		riskLevel: 'read',
		description: 'Retrieve public Instagram post data (Alpha)',
	},
	'instagram.posts': {
		riskLevel: 'read',
		description: 'Retrieve public Instagram posts data (Alpha)',
	},
	'instagram.profile': {
		riskLevel: 'read',
		description: 'Retrieve public Instagram profile data (Alpha)',
	},
	'instagram.profilePostCount': {
		riskLevel: 'read',
		description: 'Retrieve public Instagram profile post count data (Alpha)',
	},
	'instagram.searchPopular': {
		riskLevel: 'read',
		description: 'Get popular Instagram posts for a search topic (Alpha)',
	},
	'kroger.product': {
		riskLevel: 'read',
		description:
			"Get a Kroger product's details, price and availability (Alpha)",
	},
	'kroger.search': {
		riskLevel: 'read',
		description: 'Search Kroger products with prices and availability (Alpha)',
	},
	'levels.search': {
		riskLevel: 'read',
		description: 'Search Levels.fyi jobs by company, location, level and pay',
	},
	'lever.jobs': {
		riskLevel: 'read',
		description:
			"Page through an employer's public jobs, descriptions, and application links",
	},
	'linkedin.company': {
		riskLevel: 'read',
		description:
			'Read public company profiles with follower and employee counts, office locations, and similar companies',
	},
	'linkedin.companyPosts': {
		riskLevel: 'read',
		description:
			'Read recent public company posts and reposts with reaction and comment counts, authors, and media',
	},
	'linkedin.job': {
		riskLevel: 'read',
		description:
			'Get a public LinkedIn job description, employment details, published salary, and applicant count',
	},
	'linkedin.jobs': {
		riskLevel: 'read',
		description:
			'Search public LinkedIn job listings by keywords, location, and workplace type',
	},
	'naturitas.product': {
		riskLevel: 'read',
		description:
			'Get Naturitas product details, prices, pack discounts, ratings, and categories',
	},
	'naturitas.search': {
		riskLevel: 'read',
		description:
			'Search Naturitas products with prices, discounts, ratings, and product links',
	},
	'naver.aiOverview': {
		riskLevel: 'read',
		description: 'Get Naver AI Briefing answers with citations',
	},
	'naver.search': {
		riskLevel: 'read',
		description: 'Search Naver web, news, video and image results',
	},
	'npm.package': {
		riskLevel: 'read',
		description: 'Get an npm package version and its dependencies',
	},
	'npm.search': {
		riskLevel: 'read',
		description: 'Search npm packages by keywords and qualifiers',
	},
	'pinterest.profile': {
		riskLevel: 'read',
		description:
			'Get a public Pinterest profile, biography, and follower counts',
	},
	'producthunt.launches': {
		riskLevel: 'read',
		description:
			"Read today's public launches with product names, links, and taglines",
	},
	'pypi.project': {
		riskLevel: 'read',
		description: 'Get Python package metadata and release files from PyPI',
	},
	'realtor.property': {
		riskLevel: 'read',
		description: 'Get a Realtor.com property by URL (Alpha)',
	},
	'realtor.search': {
		riskLevel: 'read',
		description: 'Search Realtor.com listings from a search URL (Alpha)',
	},
	'reddit.post': {
		riskLevel: 'read',
		description: 'Get a public Reddit post and available discussion comments',
	},
	'reddit.search': {
		riskLevel: 'read',
		description:
			'Search public Reddit posts by keywords, sort order, and time range',
	},
	'reddit.subredditPosts': {
		riskLevel: 'read',
		description: 'Read public posts from a subreddit with pagination',
	},
	'redfin.property': {
		riskLevel: 'read',
		description: 'Get a Redfin property by listing URL',
	},
	'redfin.search': {
		riskLevel: 'read',
		description: 'Search Redfin homes for sale or recently sold',
	},
	'remoteok.jobs': {
		riskLevel: 'read',
		description: 'Find remote jobs by keywords and tags',
	},
	'shopify.products': {
		riskLevel: 'read',
		description:
			'Page through published product catalogs with variants, prices, and availability',
	},
	'soundcloud.track': {
		riskLevel: 'read',
		description:
			'Read public track metadata, duration, and available engagement counts',
	},
	'spotify.item': {
		riskLevel: 'read',
		description:
			'Read public track, album, artist, and playlist metadata and available track lists',
	},
	'sprouts.product': {
		riskLevel: 'read',
		description:
			"Get a Sprouts product's details, price and availability (Alpha)",
	},
	'sprouts.search': {
		riskLevel: 'read',
		description: 'Search Sprouts products with prices and availability (Alpha)',
	},
	'stackoverflow.answers': {
		riskLevel: 'read',
		description: 'Read answers to a Stack Overflow question with pagination',
	},
	'stackoverflow.comments': {
		riskLevel: 'read',
		description: 'Read comments on a Stack Overflow question with pagination',
	},
	'stackoverflow.question': {
		riskLevel: 'read',
		description:
			'Get a Stack Overflow question, its text, tags, and statistics',
	},
	'stackoverflow.search': {
		riskLevel: 'read',
		description: 'Search Stack Overflow questions by keywords and tags',
	},
	'steam.app': {
		riskLevel: 'read',
		description:
			'Get Steam app details, descriptions, publishers, and regional prices',
	},
	'steam.search': {
		riskLevel: 'read',
		description: 'Find Steam games and software with regional pricing',
	},
	'substack.posts': {
		riskLevel: 'read',
		description:
			'Page through public publication archives with titles, dates, and engagement counts',
	},
	'target.product': {
		riskLevel: 'read',
		description:
			'Get a product sold by the US retailer Target, with its details, price and availability (Alpha)',
	},
	'target.search': {
		riskLevel: 'read',
		description:
			'Search products sold by the US retailer Target, with prices and availability (Alpha)',
	},
	'telegram.posts': {
		riskLevel: 'read',
		description:
			'Read public channel posts with dates, text, and displayed view counts',
	},
	'tiktok.collectionVideos': {
		riskLevel: 'read',
		description:
			'Page through posts saved in a public TikTok collection (Alpha)',
	},
	'tiktok.commentReplies': {
		riskLevel: 'read',
		description: 'Page through replies to a TikTok comment (Alpha)',
	},
	'tiktok.comments': {
		riskLevel: 'read',
		description: 'Page through public comments on a TikTok post (Alpha)',
	},
	'tiktok.followers': {
		riskLevel: 'read',
		description: 'Page through public followers of a TikTok user (Alpha)',
	},
	'tiktok.following': {
		riskLevel: 'read',
		description:
			'Page through the public accounts a TikTok user follows (Alpha)',
	},
	'tiktok.live': {
		riskLevel: 'read',
		description: "Get a TikTok live room's status and metrics (Alpha)",
	},
	'tiktok.profile': {
		riskLevel: 'read',
		description:
			'Get public TikTok profile fields and statistics by handle or numeric user ID (Alpha)',
	},
	'tiktok.profileVideos': {
		riskLevel: 'read',
		description:
			'Page through posts from a public TikTok profile by handle or numeric user ID (Alpha)',
	},
	'tiktok.searchHashtag': {
		riskLevel: 'read',
		description: 'Resolve a public hashtag and page through its posts (Alpha)',
	},
	'tiktok.searchSuggestions': {
		riskLevel: 'read',
		description: 'Get public TikTok autocomplete suggestions in order (Alpha)',
	},
	'tiktok.song': {
		riskLevel: 'read',
		description: "Get a TikTok sound's details and usage count (Alpha)",
	},
	'tiktok.songVideos': {
		riskLevel: 'read',
		description: 'Page through TikTok posts that use a sound (Alpha)',
	},
	'tiktok.transcript': {
		riskLevel: 'read',
		description: 'Get public TikTok captions with timed segments (Alpha)',
	},
	'tiktok.trendingFeed': {
		riskLevel: 'read',
		description: "Get TikTok's trending feed (Alpha)",
	},
	'tiktok.userLive': {
		riskLevel: 'read',
		description: "Get a TikTok user's live status and room metadata (Alpha)",
	},
	'tiktok.video': {
		riskLevel: 'read',
		description:
			'Get a TikTok video or photo post with its media and metrics (Alpha)',
	},
	'tripadvisor.place': {
		riskLevel: 'read',
		description: 'Get Tripadvisor place details by place ID',
	},
	'tripadvisor.reviews': {
		riskLevel: 'read',
		description: 'Get Tripadvisor reviews sorted by recency or relevance',
	},
	'tripadvisor.search': {
		riskLevel: 'read',
		description: 'Search Tripadvisor hotels, restaurants and attractions',
	},
	'walmart.product': {
		riskLevel: 'read',
		description:
			"Get a Walmart product's details, price and availability (Alpha)",
	},
	'walmart.search': {
		riskLevel: 'read',
		description: 'Search Walmart products with prices and availability (Alpha)',
	},
	'wayfair.product': {
		riskLevel: 'read',
		description:
			"Get a Wayfair product's details, price and availability (Alpha)",
	},
	'wayfair.search': {
		riskLevel: 'read',
		description: 'Search Wayfair products with prices and availability (Alpha)',
	},
	'web.fetch': {
		riskLevel: 'read',
		description:
			'Render a public web page and return it as Markdown, HTML or text (Alpha)',
	},
	'web.screenshot': {
		riskLevel: 'read',
		description:
			'Capture a web page screenshot, returned as base64 PNG data in screenshot_base64 (Alpha)',
	},
	'wholefoods.product': {
		riskLevel: 'read',
		description:
			"Get a Whole Foods product's details, price and availability (Alpha)",
	},
	'wholefoods.search': {
		riskLevel: 'read',
		description:
			'Search Whole Foods products with prices and availability (Alpha)',
	},
	'wikipedia.article': {
		riskLevel: 'read',
		description: 'Get the text of a Wikipedia article in a selected language',
	},
	'wikipedia.search': {
		riskLevel: 'read',
		description: 'Search Wikipedia articles in a selected language',
	},
	'workday.jobs': {
		riskLevel: 'read',
		description:
			"Search an employer's Workday career board with result totals and pagination",
	},
	'x.community': {
		riskLevel: 'read',
		description:
			'Get X community details, including its creator, member count and rules (Alpha)',
	},
	'x.communityPosts': {
		riskLevel: 'read',
		description:
			'Get posts from an X community, including authors, engagement and media (Alpha)',
	},
	'x.post': {
		riskLevel: 'read',
		description:
			'Get an X post with its text, author, engagement counts and media (Alpha)',
	},
	'x.profile': {
		riskLevel: 'read',
		description:
			'Get a public X profile, including its bio, follower counts and profile images (Alpha)',
	},
	'x.userPosts': {
		riskLevel: 'read',
		description: 'Get posts from an X user (Alpha)',
	},
	'yahoo.financeHistory': {
		riskLevel: 'read',
		description:
			'Read daily, weekly, or monthly prices and volume for a market symbol',
	},
	'yahoo.images': {
		riskLevel: 'read',
		description: 'Search Yahoo Images',
	},
	'yahoo.search': {
		riskLevel: 'read',
		description: 'Get Yahoo web search results',
	},
	'yandex.images': {
		riskLevel: 'read',
		description: 'Search Yandex Images, including reverse image search',
	},
	'yandex.search': {
		riskLevel: 'read',
		description: 'Get Yandex web search results',
	},
	'yelp.place': {
		riskLevel: 'read',
		description: "Get a Yelp business's details and menu",
	},
	'yelp.reviews': {
		riskLevel: 'read',
		description:
			'Get Yelp reviews with rating, text, reviewer and owner replies',
	},
	'yelp.search': {
		riskLevel: 'read',
		description:
			'Search Yelp businesses with rating, reviews, categories and filters',
	},
	'youtube.channel': {
		riskLevel: 'read',
		description:
			"Get a YouTube channel's profile, videos, Shorts, playlists and posts",
	},
	'youtube.comments': {
		riskLevel: 'read',
		description: 'Read public YouTube video comments with pagination',
	},
	'youtube.search': {
		riskLevel: 'read',
		description: 'Search YouTube videos, channels, playlists and Shorts',
	},
	'youtube.video': {
		riskLevel: 'read',
		description:
			'Get a public YouTube video title, description, channel, and view count',
	},
	'zillow.locations': {
		riskLevel: 'read',
		description: 'Get Zillow region and address suggestions',
	},
	'zillow.property': {
		riskLevel: 'read',
		description: 'Get a Zillow property by ID or URL',
	},
	'zillow.search': {
		riskLevel: 'read',
		description: 'Search Zillow homes for sale, for rent or recently sold',
	},
	'ziprecruiter.search': {
		riskLevel: 'read',
		description:
			'Search ZipRecruiter jobs in the US and Canada by keyword and location',
	},
	'keys.status': {
		riskLevel: 'read',
		description:
			'Get LiteScrape key status, remaining calls and concurrency limit',
	},
	'keys.usage': {
		riskLevel: 'read',
		description: 'Get call usage for the key over the last 24 hours to 90 days',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof litescrapeEndpointsNested
>;
