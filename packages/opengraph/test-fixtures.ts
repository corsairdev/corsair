// Bodies taken from OpenGraph.io's documented examples:
// https://www.opengraph.io/docs/api

export const siteResponse = {
	hybridGraph: {
		title: "GitHub: Let's build from here",
		description:
			'GitHub is where over 100 million developers shape the future of software.',
		image:
			'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
		url: 'https://github.com/',
		site_name: 'GitHub',
		type: 'website',
		favicon: 'https://github.githubassets.com/favicons/favicon.svg',
	},
	openGraph: {
		title: "GitHub: Let's build from here",
		description: 'GitHub is where over 100 million developers...',
		type: 'website',
		url: 'https://github.com/',
		site_name: 'GitHub',
		image: {
			url: 'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
		},
	},
	htmlInferred: {
		title: "GitHub: Let's build from here",
		description: 'GitHub is where over 100 million developers...',
		favicon: 'https://github.githubassets.com/favicons/favicon.svg',
	},
	requestInfo: {
		redirects: 0,
		host: 'github.com',
		responseCode: 200,
	},
};

export const scrapeResponse = {
	htmlContent: '<!DOCTYPE html><html>...</html>',
	requestInfo: {
		redirects: 0,
		host: 'example.com',
		responseCode: 200,
		responseContentType: 'text/html',
	},
};

export const screenshotResponse = {
	screenshotUrl: 'https://cdn.opengraph.io/screenshots/abc123.png',
	dimensions: {
		width: 1280,
		height: 800,
	},
	requestInfo: {
		host: 'github.com',
		responseCode: 200,
	},
};

export const extractResponse = {
	url: 'https://example.com',
	concatenatedText:
		'Example Domain This domain is for use in illustrative examples...',
	data: {
		heading: 'Example Domain',
		allLinks: ['https://www.iana.org/domains/example'],
	},
};

export const extractSanitizedResponse = {
	url: 'https://example.com',
	concatenatedText: 'cleaned text',
	data: {},
	ai_safety: {
		risk_score: 0.02,
		risk_level: 'low',
		signals: {},
	},
};

export const queryResponse = {
	answer: {
		headline: 'Welcome to Example',
		products: ['Product A', 'Product B', 'Product C'],
	},
	requestInfo: {
		host: 'example.com',
		responseCode: 200,
	},
};

export const oembedResponse = {
	type: 'hybridEmbed',
	version: '1.0',
	provider_name: 'Example Site',
	width: 800,
	height: 600,
	source: 'og_frame',
	embed_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
	frame_url: 'https://frames.opengraph.io/oembed/9f8e7d6c5b4a/1a2b3c4d5e6f',
	html: '<iframe src="https://frames.opengraph.io/oembed/9f8e7d6c5b4a/1a2b3c4d5e6f" width="800" height="600"></iframe>',
};

export const markdownResponse = {
	markdown: '# Example Article\n\nMain content here...',
	metadata: {
		title: 'Example Article Title',
		description: "A short description from the page's meta tags.",
		canonical_url: 'https://example.com/article',
		site_name: 'Example Site',
		image: 'https://example.com/og-image.jpg',
		language: 'en',
		final_url: 'https://example.com/article',
	},
	usage: {
		character_count: 4820,
		estimated_token_count: 1205,
		truncated: false,
		truncation_reason: null,
		max_chars: null,
	},
	debug: {
		full_render_used: false,
		auto_render_triggered: false,
		proxy_used: null,
		retry_used: false,
		retry_attempts: 1,
		final_status_code: 200,
	},
	request_id: '3f1a9c2e-8b4d-4e7a-9c1a-2d6f8e0b5a7c',
};

export const markdownChunkedResponse = {
	...markdownResponse,
	chunks: [
		{
			index: 0,
			text: 'Install the client with your package manager...',
			heading_path: ['Getting Started', 'Installation'],
			character_count: 1840,
			estimated_token_count: 460,
			start_offset: 0,
			end_offset: 1840,
			overlap_character_count: 0,
			split_mid_block: false,
		},
	],
	usage: {
		...markdownResponse.usage,
		chunk_count: 12,
		chunks_truncated: false,
	},
};

export const brandResponse = {
	brand: {
		domain: 'asana.com',
		name: 'Asana',
		description:
			'Asana is a work management platform where teams and AI agents coordinate critical workflows on shared plans.',
		tagline: 'The OS for human-agent teams',
		category: 'Work management and collaboration software',
	},
	identity: {
		logos: [
			{
				url: 'https://assets.asana.biz/m/5f083bc48e06e1e2/original/asana-logo-1200x1200.png',
				type: 'logo',
				theme: null,
				format: 'png',
			},
		],
		icon: {
			url: 'https://brand.asana.biz/image/upload/asana_favicon_194x194.png',
			format: 'png',
		},
		colors: [
			{ hex: '#690031', role: 'primary' },
			{ hex: '#F0D3D9', role: 'accent' },
		],
		fonts: [{ family: 'TWK Lausanne', role: 'heading', weights: [250, 400] }],
	},
	products: [
		{
			name: 'AI Studio',
			description: 'A no-code automation tool for structured work processes.',
			url: 'https://asana.com/product/ai',
			category: 'Workflow automation',
		},
	],
	audiences: [
		{
			name: 'Cross-functional teams',
			description: 'Teams coordinating shared workflows across functions.',
		},
	],
	positioning: {
		value_proposition:
			'Asana helps teams and AI agents run critical workflows together from one shared plan.',
		market_position:
			'An enterprise-scale work management and agentic work platform.',
		differentiators: ['Work Graph connects people, agents and tasks.'],
	},
	messaging: {
		key_messages: ['Bring humans and AI agents together on one shared plan.'],
		themes: ['Human-agent collaboration', 'Shared context and memory'],
		claims: ['Asana integrates with 270+ apps.'],
		common_phrases: ['The OS for human-agent teams'],
	},
	voice: {
		traits: ['Clear', 'Confident', 'Outcome-oriented'],
		description: 'Asana communicates in direct, benefit-led language.',
		formality: 0.65,
		technicality: 0.62,
		energy: 0.72,
		do: ['Lead with a clear operational benefit.'],
		avoid: ['Presenting AI as autonomous without human oversight.'],
	},
	visual: {
		style: 'Modern, AI-forward enterprise SaaS.',
		imagery: null,
		ui_style: 'Structured work-management interfaces.',
	},
	links: {
		website: 'https://asana.com',
		about: 'https://asana.com/company',
		socials: {
			x: 'https://x.com/intent/follow?screen_name=asana',
			linkedin: 'https://www.linkedin.com/company/asana',
		},
		brand_assets: null,
		pricing: 'https://asana.com/pricing',
	},
};

export const flatError = {
	error: true,
	message: 'Invalid App ID',
	code: 'INVALID_APP_ID',
};

export const nestedError = {
	error: {
		code: -2201,
		message: 'Invalid max_chars value. Must be a positive integer.',
	},
	request_id: '3f1a9c2e-8b4d-4e7a-9c1a-2d6f8e0b5a7c',
};

export const oembedResolutionError = {
	success: false,
	error: {
		code: 'oembed_resolution_failed',
		message: 'Unable to resolve an embed for this URL.',
		stage: 'fallback',
		details: null,
	},
};

export const brandOptionsError = {
	error: 'A maximum of 3 custom questions may be supplied per request.',
};

export const rateLimitError = {
	error: true,
	message: 'Too many concurrent requests',
	code: 'RATE_LIMITED',
};

export const blockedError = {
	error: true,
	message: 'Target site blocked the request',
	code: 'TARGET_BLOCKED',
};
