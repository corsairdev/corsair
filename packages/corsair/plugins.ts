import { createRequire } from 'node:module';

// Core Plugins (Direct Re-exports)
export { airtable } from '@corsair-dev/airtable';
export { cal } from '@corsair-dev/cal';
export { discord } from '@corsair-dev/discord';
export { github } from '@corsair-dev/github';
export { gmail } from '@corsair-dev/gmail';
export { googlecalendar } from '@corsair-dev/googlecalendar';
export { googledrive } from '@corsair-dev/googledrive';
export { hubspot } from '@corsair-dev/hubspot';
export { linear } from '@corsair-dev/linear';
export { notion } from '@corsair-dev/notion';
export { slack } from '@corsair-dev/slack';
export { todoist } from '@corsair-dev/todoist';

// Setup require for lazy loading community plugins
const require = createRequire(import.meta.url);

function createLazyPlugin(name: string, packageName: string) {
	return (options: any) => {
		try {
			// In Node.js ESM, createRequire allows sync loading of CJS or ESM (if compatible)
			const plugin = require(packageName);
			return plugin[name](options);
		} catch (e) {
			throw new Error(
				`Plugin '${packageName}' not found. To reduce package size, this plugin is now optional.\n\n` +
					`Please install it manually:\n  pnpm add ${packageName}`,
			);
		}
	};
}

// Community Plugins (Lazy Re-exports)
export const amplitude = createLazyPlugin('amplitude', '@corsair-dev/amplitude');
export const asana = createLazyPlugin('asana', '@corsair-dev/asana');
export const box = createLazyPlugin('box', '@corsair-dev/box');
export const calendly = createLazyPlugin('calendly', '@corsair-dev/calendly');
export const cursor = createLazyPlugin('cursor', '@corsair-dev/cursor');
export const dodopayments = createLazyPlugin(
	'dodopayments',
	'@corsair-dev/dodopayments',
);
export const dropbox = createLazyPlugin('dropbox', '@corsair-dev/dropbox');
export const exa = createLazyPlugin('exa', '@corsair-dev/exa');
export const figma = createLazyPlugin('figma', '@corsair-dev/figma');
export const firecrawl = createLazyPlugin('firecrawl', '@corsair-dev/firecrawl');
export const fireflies = createLazyPlugin('fireflies', '@corsair-dev/fireflies');
export const googlesheets = createLazyPlugin(
	'googlesheets',
	'@corsair-dev/googlesheets',
);
export const grafana = createLazyPlugin('grafana', '@corsair-dev/grafana');
export const hackernews = createLazyPlugin(
	'hackernews',
	'@corsair-dev/hackernews',
);
export const intercom = createLazyPlugin('intercom', '@corsair-dev/intercom');
export const jira = createLazyPlugin('jira', '@corsair-dev/jira');
export const monday = createLazyPlugin('monday', '@corsair-dev/monday');
export const onedrive = createLazyPlugin('onedrive', '@corsair-dev/onedrive');
export const openweathermap = createLazyPlugin(
	'openweathermap',
	'@corsair-dev/openweathermap',
);
export const oura = createLazyPlugin('oura', '@corsair-dev/oura');
export const outlook = createLazyPlugin('outlook', '@corsair-dev/outlook');
export const pagerduty = createLazyPlugin('pagerduty', '@corsair-dev/pagerduty');
export const posthog = createLazyPlugin('posthog', '@corsair-dev/posthog');
export const razorpay = createLazyPlugin('razorpay', '@corsair-dev/razorpay');
export const reddit = createLazyPlugin('reddit', '@corsair-dev/reddit');
export const resend = createLazyPlugin('resend', '@corsair-dev/resend');
export const sentry = createLazyPlugin('sentry', '@corsair-dev/sentry');
export const sharepoint = createLazyPlugin(
	'sharepoint',
	'@corsair-dev/sharepoint',
);
export const spotify = createLazyPlugin('spotify', '@corsair-dev/spotify');
export const strava = createLazyPlugin('strava', '@corsair-dev/strava');
export const stripe = createLazyPlugin('stripe', '@corsair-dev/stripe');
export const tavily = createLazyPlugin('tavily', '@corsair-dev/tavily');
export const teams = createLazyPlugin('teams', '@corsair-dev/teams');
export const telegram = createLazyPlugin('telegram', '@corsair-dev/telegram');
export const trello = createLazyPlugin('trello', '@corsair-dev/trello');
export const twitter = createLazyPlugin('twitter', '@corsair-dev/twitter');
export const twitterapiio = createLazyPlugin(
	'twitterapiio',
	'@corsair-dev/twitterappio',
);
export const typeform = createLazyPlugin('typeform', '@corsair-dev/typeform');
export const youtube = createLazyPlugin('youtube', '@corsair-dev/youtube');
export const zoom = createLazyPlugin('zoom', '@corsair-dev/zoom');
