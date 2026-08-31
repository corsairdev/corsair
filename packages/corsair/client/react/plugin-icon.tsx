'use client';

import type { CSSProperties, ReactElement } from 'react';
import { useEffect, useState } from 'react';

// Brand icons for the connect overlay. Mirrors the Hub connect page's
// favicon-logo so the SDK dialog and the Hub page render the same marks: one
// maintained domain table, svgl SVGs for products whose favicons are generic,
// and a monogram fallback when an icon can't load.

const DOMAIN_OVERRIDES: Record<string, string> = {
	github: 'github.com',
	gitlab: 'gitlab.com',
	slack: 'slack.com',
	notion: 'notion.so',
	airtable: 'airtable.com',
	linear: 'linear.app',
	jira: 'atlassian.com',
	confluence: 'atlassian.com',
	google: 'google.com',
	gmail: 'gmail.com',
	gdrive: 'drive.google.com',
	gcalendar: 'calendar.google.com',
	hubspot: 'hubspot.com',
	salesforce: 'salesforce.com',
	stripe: 'stripe.com',
	discord: 'discord.com',
	intercom: 'intercom.com',
	zendesk: 'zendesk.com',
	figma: 'figma.com',
	dropbox: 'dropbox.com',
	asana: 'asana.com',
	trello: 'trello.com',
	clickup: 'clickup.com',
	monday: 'monday.com',
	twilio: 'twilio.com',
	sendgrid: 'sendgrid.com',
	shopify: 'shopify.com',
	agentql: 'agentql.com',
	ahrefs: 'ahrefs.com',
	amplitude: 'amplitude.com',
	bitwarden: 'bitwarden.com',
	bluesky: 'bsky.app',
	box: 'box.com',
	cal: 'cal.com',
	calendly: 'calendly.com',
	cloudflare: 'cloudflare.com',
	cursor: 'cursor.com',
	dodopayments: 'dodopayments.com',
	exa: 'exa.ai',
	firecrawl: 'firecrawl.dev',
	fireflies: 'fireflies.ai',
	googlecalendar: 'calendar.google.com',
	googledrive: 'drive.google.com',
	googlemeet: 'meet.google.com',
	googlesheets: 'docs.google.com',
	grafana: 'grafana.com',
	hackernews: 'news.ycombinator.com',
	instagram: 'instagram.com',
	onedrive: 'onedrive.live.com',
	openweathermap: 'openweathermap.org',
	oura: 'ouraring.com',
	outlook: 'outlook.live.com',
	pagerduty: 'pagerduty.com',
	posthog: 'posthog.com',
	razorpay: 'razorpay.com',
	reddit: 'reddit.com',
	resend: 'resend.com',
	sentry: 'sentry.io',
	sharepoint: 'sharepoint.com',
	spotify: 'spotify.com',
	strava: 'strava.com',
	supabase: 'supabase.com',
	tally: 'tally.so',
	tavily: 'tavily.com',
	teams: 'teams.microsoft.com',
	telegram: 'telegram.org',
	todoist: 'todoist.com',
	twitter: 'x.com',
	twitterapiio: 'twitter.com',
	typeform: 'typeform.com',
	vapi: 'vapi.ai',
	vercel: 'vercel.com',
	youtube: 'youtube.com',
	zohomail: 'zoho.com',
	zoom: 'zoom.us',
};

// Products whose public favicon is generic (Microsoft serves the same squares
// for every M365 product) — served from svgl's brand-SVG CDN instead.
const LOGO_OVERRIDES: Record<string, string> = {
	'outlook.live.com': 'https://svgl.app/library/microsoft-outlook.svg',
	'onedrive.live.com': 'https://svgl.app/library/microsoft-onedrive.svg',
	'sharepoint.com': 'https://svgl.app/library/microsoft-sharepoint.svg',
	'teams.microsoft.com': 'https://svgl.app/library/microsoft-teams.svg',
	'gmail.com': 'https://svgl.app/library/gmail.svg',
	'drive.google.com': 'https://svgl.app/library/drive.svg',
	'calendar.google.com': 'https://svgl.app/library/google-calendar.svg',
	'meet.google.com': 'https://svgl.app/library/google-meet.svg',
	'docs.google.com': 'https://svgl.app/library/google-sheets.svg',
};

/** Resolve a plugin id to a brand domain. */
export function pluginToDomain(pluginId: string): string {
	const id = pluginId.toLowerCase().replace(/_/g, '');
	return DOMAIN_OVERRIDES[id] ?? `${id}.com`;
}

/** The icon URL for a brand domain — an svgl override when the favicon is generic. */
export function resolveIconUrl(domain: string): string {
	const clean = domain
		.replace(/^(https?:\/\/)|(www\.)/g, '')
		.replace(/\/$/, '');
	return LOGO_OVERRIDES[clean] ?? `https://twenty-icons.com/${clean}`;
}

/** Title-case a plugin id for display: `google_sheets` → `Google Sheets`. */
export function titleCasePlugin(pluginId: string): string {
	return pluginId
		.replace(/[_-]+/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Brand mark for a plugin. Renders a monogram first and swaps to the loaded
 * icon only once it decodes, so a blocked or missing icon shows a clean initial
 * rather than a broken-image glyph.
 */
export function PluginIcon({
	domain,
	label,
	size = 24,
	radius,
}: {
	domain: string;
	label: string;
	size?: number;
	radius?: number;
}): ReactElement {
	const [src, setSrc] = useState<string | null>(null);
	useEffect(() => {
		let live = true;
		// Drop the prior brand mark so a reused icon shows the monogram, not the
		// last plugin's logo, while the new one loads (or if it fails).
		setSrc(null);
		const img = new Image();
		img.referrerPolicy = 'no-referrer';
		img.onload = () => {
			if (live && img.naturalWidth > 0) setSrc(img.src);
		};
		img.src = resolveIconUrl(domain);
		return () => {
			live = false;
		};
	}, [domain]);

	const box: CSSProperties = {
		width: size,
		height: size,
		borderRadius: radius ?? Math.round(size * 0.28),
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		background: src ? '#fff' : '#f1f1f1',
		border: '1px solid #1c1c1c12',
	};
	return (
		<span style={box}>
			{src ? (
				<img
					src={src}
					alt=""
					width={Math.round(size * 0.62)}
					height={Math.round(size * 0.62)}
					referrerPolicy="no-referrer"
					style={{ objectFit: 'contain' }}
				/>
			) : (
				<span
					style={{
						fontSize: Math.round(size * 0.4),
						fontWeight: 600,
						color: '#7a7a7a',
					}}
				>
					{(label[0] ?? '?').toUpperCase()}
				</span>
			)}
		</span>
	);
}
