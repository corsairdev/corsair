// Sample TikHub responses for offline tests. The envelope matches
// ResponseModel in https://api.tikhub.io/openapi.json; payloads follow each
// operation's documented return fields, trimmed to a few items.

export function envelope(
	router: string,
	params: Record<string, string | number | boolean>,
	// unknown: each test supplies its own payload shape.
	data: unknown,
) {
	return {
		code: 200,
		request_id: '810a9d5a-d61e-46a5-b1c8-088a24647631',
		message: 'Request successful. This request will incur a charge.',
		message_zh: '请求成功，本次请求将被计费。',
		support: 'Discord: https://discord.gg/aMEAS8Xsvz',
		time: '2026-10-26 05:56:06',
		time_stamp: 1793019366,
		time_zone: 'America/Los_Angeles',
		docs: `https://api.tikhub.io/#/${router}`,
		cache_message:
			'This response is cached and accessible via the URL below for 24 hours at no extra cost.',
		cache_message_zh:
			'本次响应已缓存，可通过下方 URL 直接查看，有效期 24 小时。',
		cache_url: 'https://cache.tikhub.io/api/v1/cache/810a9d5a',
		router,
		params,
		data,
	};
}

export function errorBody(
	code: number,
	router: string,
	message: string,
	params: Record<string, string> = {},
) {
	return {
		detail: {
			code,
			request_id: 'd714edd7-b26e-4c6b-8f73-f8ff1fc36e28',
			message,
			message_zh: '请求失败',
			docs: null,
			support: 'Discord: https://discord.gg/aMEAS8Xsvz',
			time: '2026-10-26 05:55:53',
			time_stamp: 1793019353,
			time_zone: 'America/Los_Angeles',
			router,
			params,
		},
	};
}

const urlList = (uri: string) => ({
	uri,
	url_list: [`https://p16-sign.tiktokcdn-us.com/${uri}.jpeg`],
	width: 720,
	height: 720,
});

export const tiktokAuthor = {
	uid: '107955',
	sec_uid: 'MS4wLjABAAAAv7iSuuXDJGDvJkmH_vz1qkDZYo1apxgzaxdBSeIuPiM',
	unique_id: 'tiktok',
	nickname: 'TikTok',
	signature: 'Your next discovery is waiting on TikTok.',
	region: 'US',
	follower_count: 96400000,
	following_count: 1,
	total_favorited: 466100000,
	aweme_count: 1513,
	avatar_thumb: urlList('tos-useast5-avt-0068-tx/ba67b11de451'),
	verification_type: 1,
};

export const tiktokVideo = {
	aweme_id: '7350810998023949599',
	desc: 'Behind the scenes at TikTok HQ #tiktok',
	create_time: 1711497600,
	region: 'US',
	share_url: 'https://www.tiktok.com/@tiktok/video/7350810998023949599',
	author: tiktokAuthor,
	statistics: {
		aweme_id: '7350810998023949599',
		play_count: 12890331,
		digg_count: 1203344,
		comment_count: 18233,
		share_count: 20981,
		collect_count: 90211,
		download_count: 3302,
		whatsapp_share_count: 410,
	},
	video: {
		duration: 15069,
		width: 1080,
		height: 1920,
		ratio: '720p',
		cover: urlList('tos-useast5-p-0068-tx/cover'),
		play_addr: urlList('tos-useast5-pve-0068-tx/play'),
		download_addr: urlList('tos-useast5-pve-0068-tx/download'),
		has_watermark: true,
	},
	music: {
		id_str: '7350811123456789000',
		title: 'original sound - tiktok',
		author: 'TikTok',
		duration: 15,
		play_url: urlList('tos-useast5-ve-0068-tx/music'),
	},
	text_extra: [
		{
			start: 31,
			end: 38,
			type: 1,
			hashtag_id: '10889',
			hashtag_name: 'tiktok',
			is_commerce: false,
		},
	],
	is_ads: false,
	aweme_type: 0,
};

export const tiktokComment = {
	cid: '7326160112094421765',
	aweme_id: '7326156045968067873',
	text: 'This is the best one yet',
	create_time: 1705881600,
	digg_count: 5120,
	reply_comment_total: 14,
	is_author_digged: false,
	user: {
		uid: '6812345678901234567',
		sec_uid: 'MS4wLjABAAAAexamplecommenter',
		unique_id: 'creator.fan',
		nickname: 'Creator Fan',
	},
};

export const instagramUser = {
	id: '25025320',
	username: 'instagram',
	full_name: 'Instagram',
	biography: 'Discover what’s new on Instagram 🔎✨',
	bio_links: [
		{ title: '', url: 'https://about.instagram.com', link_type: 'external' },
	],
	external_url: 'https://about.instagram.com',
	edge_followed_by: { count: 697000000 },
	edge_follow: { count: 220 },
	profile_pic_url:
		'https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/profile.jpg',
	profile_pic_url_hd:
		'https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/profile_hd.jpg',
	is_private: false,
	is_verified: true,
	is_business_account: false,
	is_professional_account: true,
	highlight_reel_count: 15,
	edge_owner_to_timeline_media: { count: 8230, edges: [] },
	category_name: 'Digital creator',
};

export const instagramMedia = {
	id: '3742637871112032100_25025320',
	pk: '3742637871112032100',
	code: 'DPwhVB-jo9k',
	media_type: 2,
	product_type: 'clips',
	taken_at: 1760400000,
	like_count: 402311,
	comment_count: 5120,
	play_count: 10233412,
	caption: { pk: '17951234567890123', text: 'New features, who dis 👀' },
	user: {
		pk: '25025320',
		id: '25025320',
		username: 'instagram',
		full_name: 'Instagram',
		is_verified: true,
		profile_pic_url:
			'https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/profile.jpg',
	},
	video_versions: [
		{
			type: 101,
			width: 720,
			height: 1280,
			url: 'https://instagram.fbom3-1.fna.fbcdn.net/o1/v/t16/video.mp4',
		},
	],
};

export const instagramWebPost = {
	id: '4014515767420229441',
	shortcode: 'De2bNIWSZdB',
	__typename: 'GraphVideo',
	is_video: true,
	taken_at_timestamp: 1792787702,
	display_url:
		'https://instagram.fbcn2-1.fna.fbcdn.net/v/t51.82787-15/post.jpg',
	video_url: 'https://instagram.fbcn2-1.fna.fbcdn.net/o1/v/t2/f2/m86/post.mp4',
	video_view_count: 69071025,
	video_play_count: 69071025,
	accessibility_caption: 'this paper art? peak cozy vibes 🍂📚',
	comments_disabled: false,
	edge_media_preview_like: { count: 355135, edges: [] },
	edge_media_to_parent_comment: {
		count: 16056,
		page_info: { has_next_page: false, end_cursor: null },
		edges: [],
	},
	edge_media_to_caption: {
		edges: [{ node: { text: 'this paper art? peak cozy vibes 🍂📚' } }],
	},
	owner: {
		id: '25025320',
		username: 'instagram',
		full_name: 'Instagram',
		is_verified: true,
	},
};

export const instagramComment = {
	pk: '18063412345678901',
	text: 'Finally!',
	created_at: 1760401234,
	created_at_utc: 1760401234,
	comment_like_count: 1520,
	child_comment_count: 3,
	is_liked_by_media_owner: false,
	has_translation: false,
	preview_child_comments: [],
	user: {
		pk: '1234567890',
		username: 'early.adopter',
		full_name: 'Early Adopter',
		is_verified: false,
		profile_pic_url:
			'https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/fan.jpg',
	},
};

export const youtubeVideo = {
	video_id: 'dQw4w9WgXcQ',
	video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
	title: 'Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)',
	description:
		'The official video for “Never Gonna Give You Up” by Rick Astley.',
	author: 'Rick Astley',
	channel_id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
	channel_handle: '@RickAstleyYT',
	channel_url: 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw',
	subscriber_count_text: '455万位订阅者',
	is_verified: true,
	publish_date: '2009-10-24T23:57:33-07:00',
	upload_date: '2009-10-24T23:57:33-07:00',
	length_seconds: '213',
	view_count: '1830731742',
	like_count: '19497271',
	comment_count: '246万',
	keywords: ['rick astley', 'Never Gonna Give You Up'],
	category: 'Music',
	is_live_content: false,
	is_private: false,
	is_unlisted: false,
	is_family_safe: true,
	playability_status: 'OK',
	thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
	thumbnails: [
		{
			url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
			width: 1280,
			height: 720,
		},
	],
	captions: [{ language_code: 'de-DE', kind: '', is_translatable: true }],
	chapters: null,
};
