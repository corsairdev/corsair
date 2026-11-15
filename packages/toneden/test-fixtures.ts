/** Shapes from the live API and ToneDen's published OpenAPI. */

export const link = {
	id: 48213,
	title: 'New single',
	user_id: 1,
	target_type: 'music',
	target_url: 'https://open.spotify.com/album/abc',
	custom_domain: null,
	subdomain: 'ada',
	shortened_path: 'new-single',
	isrc: 'USRC17607839',
	upc: null,
	click_count: 1200,
	clickthrough_count: 340,
	show_socials: true,
	skip_landing_page: false,
	sort_services_by_clickthroughs: true,
	use_saved_service: false,
	affiliate_codes: [],
	pixels: [{ platform: 'facebook' }, { platform: 'google' }],
	services: [{ name: 'spotify', url: 'https://open.spotify.com/album/abc' }],
	social_settings: {},
	header: 'Listen now',
	metadata_title: 'New single',
	metadata_description: 'Out now',
	metadata_image_url: 'https://cdn.toneden.io/art.jpg',
	author: 'Ada Lovelace',
	bg_color: '#000000',
	bg_url: null,
	image_url: null,
	preview_url: null,
	autoplay_preview: false,
	button_color: '#ffffff',
	call_to_action: 'Listen',
	date: null,
	location: null,
	price: null,
};

export const linksEnvelope = {
	links: [link, { ...link, id: 48214, title: 'B-side' }],
};
export const linkEnvelope = { link };

export const attachment = {
	id: 9100,
	owner_id: 1,
	type: 'contest',
	actions: [{ type: 'follow', platform: 'spotify' }],
	artwork_url: 'https://cdn.toneden.io/art.jpg',
	title: 'Win a vinyl',
	link_path: 'win-a-vinyl',
	is_private: false,
	is_hidden: false,
	secret_token: 'abc123',
	message: 'Enter to win',
};

export const attachmentsEnvelope = { attachments: [attachment] };
export const attachmentEnvelope = { attachment };

export const adCampaign = {
	id: 7788,
	title: 'Spring tour',
	status: 'active',
	target_type: 'link',
	target: 'https://toneden.io/ada/new-single',
	user_id: 1,
};

export const adCampaignsEnvelope = { ad_campaigns: [adCampaign] };
export const adCampaignEnvelope = { ad_campaign: adCampaign };

export const playbookCampaign = {
	id: 9900,
	title: 'Album rollout',
	user_id: 1,
	template_id: 12,
	is_archived: false,
	status: 'draft',
	subcampaigns: [],
};

export const playbookEnvelope = { playbook_campaign: playbookCampaign };

export const user = {
	id: 1,
	username: 'ada',
	display_name: 'Ada Lovelace',
	email: 'ada@example.com',
	type: 'artist',
	about: 'Composer',
	avatar_url: 'https://cdn.toneden.io/avatar.jpg',
	account_count: 2,
	birthday: null,
	city: 'London',
	country: 'GB',
	first_name: 'Ada',
	last_name: 'Lovelace',
	state: null,
	subscription_id: 3,
};

export const userEnvelope = { user };

export const userListsEnvelope = {
	user_lists: [
		{
			id: 55,
			name: 'Tour RSVPs',
			type: 'email',
			external_ad_account_id: 'act_123',
			size: 4200,
		},
	],
};

/** `/links/validPath` answers 200 with a verdict rather than an error. */
export const validPathOk = { valid: true };
export const validPathTaken = {
	valid: false,
	reason: 'That link URL is already in use.',
	type: 'path',
};

export const expandedLink = {
	is_active: true,
	pixels: [{ platform: 'facebook' }, { platform: 'google' }],
	services: [],
	url: 'https://toneden.io/ada/new-single',
};

export const insights = {
	data: [{ date: '2026-05-01', clicks: 120, views: 900 }],
	series: [],
};

export const attachmentStats = {
	data: [{ timestamp: '2026-05-01T00:00:00Z', spotify: 40, facebook: 12 }],
	totals: { day: 52, week: 300, month: 1200, lifetime: 4200 },
};

export const deleted = { success: true };

export const unauthorized = {
	message: 'Unauthenticated.',
};
