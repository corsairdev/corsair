/**
 * Downloads plugin brand icons into `explorer/icons/` and writes
 * `explorer/data/icon-manifest.json`.
 *
 * Run after adding plugins or when icons look stale:
 *   pnpm fetch:plugin-icons
 *   pnpm fetch:plugin-icons -- --force
 *   pnpm fetch:plugin-icons -- --only=slack,github
 *
 * `--only` limits which PNGs are fetched; the manifest always lists the full catalog.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import type { PluginCatalogIndex } from '../explorer/src/types.ts';
import {
	buildPluginDomainMap,
	resolvePluginDomain,
} from './plugin-icon-domains.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRIMARY_SOURCE = 'https://twenty-icons.com';
const FALLBACK_SOURCE = 'https://www.google.com/s2/favicons';
const ICON_SIZE = 128;
const ICON_FORMAT = 'png';
const CONCURRENCY = 12;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

type IconSource = 'twenty-icons' | 'google-favicon' | 'url-override';

/**
 * Dark marks on a transparent background that vanish on a dark surface (Lug's
 * picker draws icons with no tile behind them). These are flattened onto a
 * white tile with some padding after fetching.
 */
const PLUGIN_ICON_LIGHT_TILE = new Set(['api2pdf', 'attio', 'bigml']);

const LIGHT_TILE_SIZE = 256;
const LIGHT_TILE_MARK = 200;

/**
 * Trim the transparent margin, fit the mark in 200px and center it on an
 * opaque 256px white tile. Throws when the image can't be decoded, so the
 * caller reports the icon as failed instead of keeping the dark original.
 */
async function onLightTile(bytes: Buffer): Promise<Buffer> {
	const { data, info } = await sharp(bytes)
		.trim()
		.resize(LIGHT_TILE_MARK, LIGHT_TILE_MARK, { fit: 'inside' })
		.png()
		.toBuffer({ resolveWithObject: true });
	const left = Math.floor((LIGHT_TILE_SIZE - info.width) / 2);
	const top = Math.floor((LIGHT_TILE_SIZE - info.height) / 2);
	return sharp(data)
		.extend({
			top,
			bottom: LIGHT_TILE_SIZE - info.height - top,
			left,
			right: LIGHT_TILE_SIZE - info.width - left,
			background: '#ffffff',
		})
		.flatten({ background: '#ffffff' })
		.png()
		.toBuffer();
}

/** Product marks twenty-icons can't distinguish (Docs vs Sheets on docs.google.com). */
const PLUGIN_ICON_URL_OVERRIDES: Record<string, string> = {
	gmail:
		'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_96dp.png',
	googledocs:
		'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_96dp.png',
	googlesheets:
		'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_96dp.png',
	filevine:
		'https://media.licdn.com/dms/image/v2/D560BAQGBEC5giXvomQ/company-logo_200_200/B56ZlidRJjIsAM-/0/1758293463972/filevine_logo?e=2147483647&v=beta&t=oruRrK3tPc5_e8haya4o-oxpBMhFDjjgoa_1xePKBYI',
	currentsapi:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://currentsapi.services&size=128',
	// starton.io answers 402 and starton.com has no favicon; the GitHub org mark is the public logo.
	starton: 'https://github.com/starton-io.png?size=200',
	// twenty-icons only has a 32px blur; the site apple touch icon is 180px.
	turso: 'https://turso.tech/apple-touch-icon.png',
	// twenty-icons only has a 32px blur; the site apple touch icon is 180px.
	browseruse: 'https://browser-use.com/apple-touch-icon.png',
	// plugin-docs.yaml names graph.microsoft.com (the API host), whose icon is the
	// Microsoft logo; excel.cloud.microsoft carries Excel's own mark.
	excel: 'https://twenty-icons.com/excel.cloud.microsoft/128',
	// twenty-icons returns a 32px blur; Google's favicon is the sharp site mark.
	octen: 'https://www.google.com/s2/favicons?domain=octen.ai&sz=128',
	// twenty-icons has an old blue and green mark; typesafe.ai's apple touch icon
	// is the current black knot on pink.
	typesafe:
		'https://framerusercontent.com/images/kcuF2BEp5XaVfkmFB634IPRKQH0.png',
	// plugin-docs.yaml names zoho.com, whose icon is the generic 32px Zoho mark.
	// Zoho Desk's own mark is its App Store icon (zoho.com/desk has no touch icon).
	zohodesk:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a9/08/3e/a9083ec8-1697-2db1-92d4-d175d9121cac/AppIcon-0-0-1x_U007emarketing-0-0-0-8-0-0-85-220.png/180x180bb.png',
	// dnsfilter.com only has a 32px favicon, so twenty-icons returns a blur.
	// DNSFilter's App Store icon (Roaming Client) is the same mark at 180px.
	dnsfilter:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4f/32/b4/4f32b46f-f35c-8b7c-6784-c862067f7400/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/180x180bb.png',
	// twenty-icons has Retell's old dot grid; the site's apple touch icon is the
	// current ring of dots.
	retellai:
		'https://cdn.prod.website-files.com/64ada0f2685b2d18caa5e699/69d7b35ce160f153aa823cf0_output-Retellai%20(2).png',
	// twenty-icons has Qdrant's old cube mark; the site's apple touch icon is the
	// current red hexagon.
	qdrant: 'https://qdrant.tech/favicon/apple-touch-icon.png',
	// twenty-icons returns a blur; mem0.ai only has an SVG favicon, and the
	// GitHub org mark is the same logo as a PNG.
	mem0: 'https://github.com/mem0ai.png?size=200',
	// twenty-icons returns a screenshot of the homepage, not the logo.
	emailoctopus: 'https://emailoctopus.com/apple-touch-icon.png',
	// twenty-icons only has a 32px blur; the site's 192px favicon is the same mark.
	esignatures: 'https://esignatures.com/favicon-192.png',
	// ticketmaster.com only has a 32px favicon, so twenty-icons returns a blur.
	// Ticketmaster's App Store icon is the same mark at 180px.
	ticketmaster:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b6/1c/09/b61c097d-c719-f0a7-9062-d602b89e8161/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/180x180bb.png',
	// netsuite.com only has a 32px favicon (and blocks scripted fetches), so
	// twenty-icons returns a blur. Oracle's NetSuite App Store icon is the same
	// mark at 180px.
	netsuite:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/19/ca/fb/19cafb9e-8f0b-d237-e0ea-a4b3ed3f88e4/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/180x180bb.png',
	// The default domain (<id>.com) belongs to someone else, or serves a
	// parked-domain or generic placeholder, so the icon was the wrong brand.
	// alibaba.com marketplace logo; the plugin is Alibaba Cloud.
	alibaba: 'https://twenty-icons.com/alibabacloud.com',
	// plain light-blue circle; App Store icon carries the Ambee mark.
	ambee:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/07/77/a9/0777a98a-2f46-ca8b-05d3-5f8fdf374fa0/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/256x256bb.png',
	// "nP" mark from appointo.com, not Appointo (appointo.me).
	appointo:
		'https://cdn.prod.website-files.com/6555e79256c1657a9a2e92c3/65608f40416c64f555b756e5_logo256.png',
	// GoDaddy parked-domain icon from browsertool.com; the toolkit is Composio's.
	browsertool: 'https://composio.dev/apple-touch-icon.png',
	// GoDaddy parked-domain icon from callpage.com; CallPage is callpage.io.
	callpage: 'https://twenty-icons.com/callpage.io',
	// starburst from canny.com, not Canny (canny.io).
	canny:
		'https://assets.canny.io/7673ed8964c6377226e64bb8ee33126f64a8c271/logo-icon.png',
	// 32px mark from canvas.com; Canvas LMS is Instructure's red dots.
	canvas:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/71/a8/f3/71a8f3d4-60d9-84c4-0dd7-483072d04dee/AppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/256x256bb.png',
	// GoDaddy parked-domain icon from certifier.com; Certifier is certifier.io.
	certifier: 'https://certifier.io/favicon/apple-touch-icon.png',
	// starburst from chaser.com, not Chaser (chaserhq.com).
	chaser: 'https://www.chaserhq.com/hubfs/Chaser%20logo%20600x600-100.jpg',
	// GoDaddy parked-domain icon from claidai.com; Claid is claid.ai.
	claidai:
		'https://claid.ai/icons/icon-256x256.png?v=929123789de593fc4153206756197444',
	// "U4" logo from coda.com, not Coda (coda.io).
	coda: 'https://cdn.coda.io/icons/png/color/coda-192.png',
	// MongoDB logo; the plugin is LibreChat's Code Interpreter.
	codeinterpreter: 'https://www.librechat.ai/apple-touch-icon.png',
	// 16px mark from cody.com; Cody is meetcody.ai.
	cody: 'https://twenty-icons.com/meetcody.ai',
	// 32px mark from convex.com; Convex is convex.dev.
	convex: 'https://avatars.githubusercontent.com/u/81530787?s=256',
	// green "e" from exist.com; Exist is exist.io.
	exist:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/eb/2d/87/eb2d8749-e29e-c363-0b02-515eec684bce/Icon-0-0-1x_U007epad-0-0-0-1-0-0-85-220.png/256x256bb.png',
	// GoDaddy parked-domain icon from extractaai.com; Extracta is extracta.ai.
	extractaai: 'https://extracta.ai/wp-content/uploads/2024/01/logo192.png',
	// Fundable crowdfunding "F"; the plugin is Fundable (tryfundable.ai).
	fundable:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tryfundable.ai&size=256',
	// Blogger logo; Gladia is gladia.io.
	gladia:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://gladia.io&size=256',
	// red "MINIMAX" block from minimax.com; MiniMax AI's mark is the pink waveform.
	minimax: 'https://github.com/MiniMax-AI.png?size=256',
	// "Q" mark from orbit.com; the API is Orbit (orbitsearch.com).
	orbit: 'https://orbitsearch.com/images/apple-touch-icon.png?v=2',
	// striped mark from prisma.com, not Prisma (prisma.io).
	prisma: 'https://github.com/prisma.png?size=256',
	// plain blue circle; GitHub org avatar is the Recall.ai wordmark.
	recallai: 'https://github.com/recallai.png?size=256',
	// GoDaddy parked-domain icon from revai.com; Rev AI is rev.ai.
	revai: 'https://github.com/revdotcom.png?size=256',
	// GoDaddy parked-domain icon from supadata.com; Supadata is supadata.ai.
	supadata: 'https://github.com/supadata-ai.png?size=256',
	// Surf detergent logo; the API is Surf (asksurf.ai).
	surf: 'https://github.com/asksurf-ai.png?size=256',
	// Suzanne Somers logo from suzanne.com; the API is suzanne3d.com.
	suzanne: 'https://twenty-icons.com/suzanne3d.com',
	// pink brush mark from winstonai.com; Winston AI is gowinston.ai.
	winstonai:
		'https://gowinston.ai/wp-content/uploads/2023/01/cropped-favicon-2-192x192.png',
	// 32px generic Zoho mark; App Store icon is Zoho Inventory's own.
	zohoinventory:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/05/cd/1c/05cd1ccf-f203-a247-f0e3-d14e1b5af0d2/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/256x256bb.png',
	// 32px generic Zoho mark; App Store icon is Zoho Mail's own.
	zohomail:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9b/d0/c4/9bd0c4c3-c05f-07d8-4944-5c1344808d78/AppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/256x256bb.png',
	// twenty-icons only had a 16-64px favicon, or a 128px file upscaled from
	// one, which shows as a blur. These are the brand's own larger marks: the
	// App Store icon, the GitHub org avatar, or the site's touch icon.
	ably: 'https://github.com/ably.png?size=256',
	abuseipdb: 'https://github.com/abuseipdb.png?size=256',
	activetrail:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/1e/88/58/1e8858d6-d38d-86f4-eaba-ec0def3a1abf/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/256x256bb.png',
	agentmail: 'https://github.com/agentmail-to.png?size=256',
	api2pdf: 'https://github.com/api2pdf.png?size=256',
	apipie:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://apipie.ai&size=256',
	attio: 'https://github.com/attio.png?size=256',
	bart: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/a4/ba/9c/a4ba9c69-42da-ea8a-2563-2a61af13b85a/BartAppIcon-0-0-1x_U007emarketing-0-11-0-sRGB-85-220.png/256x256bb.png',
	beeminder:
		'https://www.beeminder.com/assets/small_logo_bee_256-e807d274abc2d10aad17390dfe41eecb07b851f1a106f6b06be069a1b2d92749.png',
	bestbuy:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4c/d0/aa/4cd0aa20-24a4-3477-ea0c-c4cfd922eef9/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/256x256bb.png',
	bigdatacloud: 'https://www.bigdatacloud.com/apple-touch-icon.png',
	bigml: 'https://github.com/bigmlcom.png?size=256',
	blackbaud: 'https://github.com/blackbaud.png?size=256',
	booqable: 'https://github.com/booqable.png?size=256',
	boxhero:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bd/a5/8f/bda58fea-77be-f64c-2a75-760da526e309/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/256x256bb.png',
	brex: 'https://github.com/brexhq.png?size=256',
	browseai:
		'https://cdn.prod.website-files.com/628be7c04ab34bfc699e4acb/68b9c656f48bca83e2a16839_webclip.png',
	calendly: 'https://calendly.com/media/favicon/apple-touch-icon.png',
	carbone: 'https://github.com/carboneio.png?size=256',
	chatwork:
		'https://go.chatwork.com/en/image/common/touch-icon-ipad-retina.png?v=20230526',
	clickmeeting: 'https://github.com/ClickMeeting.png?size=256',
	cloudcart: 'https://cloudcart.com/apple-touch-icon.png',
	confluence:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/04/52/01/045201ed-6725-c7ef-6e2a-d7eb13a7e42e/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/256x256bb.png',
	contactout: 'https://contactout.com/android-chrome-512x512.png',
	cosmic: 'https://github.com/cosmicjs.png?size=256',
	diffbot: 'https://www.diffbot.com/favicon-192.png',
	docmosis:
		'https://www.docmosis.com/wp-content/uploads/2021/07/favicon-2-300x300.png',
	dropbox:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/94/2b/ca/942bcaba-f8db-9467-f3c9-10f6f35267a3/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.png',
	epicgames: 'https://github.com/EpicGames.png?size=256',
	filloutforms: 'https://github.com/fillout.png?size=256',
	firecrawl: 'https://github.com/firecrawl.png?size=256',
	gitlab: 'https://about.gitlab.com/images/ico/favicon-192x192.png',
	grafana:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1a/d7/9d/1ad79d36-8142-fb4a-0b83-61747215388e/AppIcon-0-0-1x_U007ephone-0-1-sRGB-85-220.png/256x256bb.png',
	heygen: 'https://github.com/HeyGen-Official.png?size=256',
	jira: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/41/38/ef/4138ef7d-0ec9-9782-6029-04b69aa60f26/AppIcon-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	kaggle: 'https://github.com/Kaggle.png?size=256',
	leexi:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/db/74/d1/db74d11f-37da-68e4-5962-dca0a950dd68/AppIcon-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	linkedin:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/81/62/17/81621741-aef5-e3e0-c20d-645b83902669/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.png',
	loyverse:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9d/74/00/9d740077-094a-1b77-59e9-d71085575fa9/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/256x256bb.png',
	mailboxlayer: 'https://mailboxlayer.com/images/icons/mailboxlayer_icon.png',
	nextdns: 'https://github.com/nextdns.png?size=256',
	openrouter: 'https://openrouter.ai/favicon/glyph.png',
	pdfco: 'https://pdf.co/favicon.png',
	pdl: 'https://github.com/peopledatalabs.png?size=256',
	perplexityai: 'https://github.com/perplexityai.png?size=256',
	pinecone: 'https://github.com/pinecone-io.png?size=256',
	pushbullet: 'https://github.com/pushbullet.png?size=256',
	salesforce: 'https://github.com/salesforce.png?size=256',
	scaleai: 'https://scale.com/static/global/favicon/v3/apple-touch-icon.png',
	sentry: 'https://github.com/getsentry.png?size=256',
	slack:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/8e/a6/9e/8ea69e16-151a-811a-75a7-bce97339b000/slack_icon_prod-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	slackbot:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/8e/a6/9e/8ea69e16-151a-811a-75a7-bce97339b000/slack_icon_prod-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	snapchat:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/30/cc/d2/30ccd285-16f5-c44b-1b20-35ba6f52e26f/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/256x256bb.png',
	spotify: 'https://github.com/spotify.png?size=256',
	strava: 'https://github.com/strava.png?size=256',
	tavily: 'https://www.tavily.com/apple-icon.png?apple-icon.2rsjznomrsf77.png',
	tavilymcp:
		'https://www.tavily.com/apple-icon.png?apple-icon.2rsjznomrsf77.png',
	textrazor: 'https://github.com/TextRazor.png?size=256',
	todoist:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/28/db/77/28db7718-8ed9-e73d-cce4-88879b0e87ae/AppIcon-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	twentyonerisk:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://21risk.com&size=256',
	webscrapingai: 'https://github.com/webscraping-ai.png?size=256',
	whatsapp:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/15/eb/39/15eb3965-bec3-4737-950a-9d9df5303e93/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/256x256bb.png',
	witai: 'https://github.com/wit-ai.png?size=256',
	workday: 'https://github.com/Workday.png?size=256',
	zoom: 'https://github.com/zoom.png?size=256',
};

type FetchResult =
	| { ok: true; bytes: Buffer; source: IconSource }
	| { ok: false; error: string };

type Manifest = {
	generatedAt: string;
	primarySource: string;
	fallbackSource: string;
	size: number;
	format: string;
	total: number;
	succeeded: number;
	failed: number;
	domains: Record<string, string>;
	sources: Record<string, IconSource>;
	failures: Array<{ id: string; domain: string; error: string }>;
};

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

function parseArgs(argv: string[]) {
	const force = argv.includes('--force');
	const onlyArg = argv.find((arg) => arg.startsWith('--only='));
	const only = onlyArg
		? onlyArg
				.slice('--only='.length)
				.split(',')
				.map((value) => value.trim())
				.filter(Boolean)
		: [];

	return { force, only };
}

function isPng(bytes: Buffer): boolean {
	return (
		bytes.length >= PNG_MAGIC.length && bytes.subarray(0, 8).equals(PNG_MAGIC)
	);
}

/** Raster formats some override CDNs serve instead of PNG. */
const CONVERTIBLE_FORMATS = new Set(['jpeg', 'webp', 'gif']);

/** Normalize url-override bytes to PNG; null when they aren't a raster image. */
async function normalizeOverrideToPng(bytes: Buffer): Promise<Buffer | null> {
	if (isPng(bytes)) return bytes;
	try {
		const image = sharp(bytes);
		const { format } = await image.metadata();
		if (!format || !CONVERTIBLE_FORMATS.has(format)) return null;
		return await image.png().toBuffer();
	} catch {
		return null;
	}
}

async function fetchDirectIcon(url: string): Promise<FetchResult> {
	try {
		const response = await fetch(url, {
			headers: { 'User-Agent': 'corsair-plugin-icon-fetch/1.0' },
		});
		if (!response.ok) {
			return {
				ok: false,
				error: `url-override HTTP ${response.status}`,
			};
		}
		const raw = Buffer.from(await response.arrayBuffer());
		if (raw.length === 0) {
			return { ok: false, error: 'url-override returned empty body' };
		}
		const bytes = await normalizeOverrideToPng(raw);
		if (!bytes) {
			return { ok: false, error: 'url-override returned no PNG' };
		}
		return { ok: true, bytes, source: 'url-override' };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { ok: false, error: `url-override failed: ${message}` };
	}
}

async function fetchPluginIcon(
	pluginId: string,
	domain: string,
): Promise<FetchResult> {
	const overrideUrl = PLUGIN_ICON_URL_OVERRIDES[pluginId];
	if (overrideUrl) {
		return fetchDirectIcon(overrideUrl);
	}
	return fetchIcon(domain);
}

async function fetchIcon(domain: string): Promise<FetchResult> {
	const primaryUrl = `${PRIMARY_SOURCE}/${domain}`;

	try {
		const response = await fetch(primaryUrl, {
			headers: { 'User-Agent': 'corsair-plugin-icon-fetch/1.0' },
		});
		if (response.ok) {
			const bytes = Buffer.from(await response.arrayBuffer());
			if (bytes.length > 0 && isPng(bytes)) {
				return { ok: true, bytes, source: 'twenty-icons' };
			}
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fetchGoogleFavicon(domain, `twenty-icons failed: ${message}`);
	}

	return fetchGoogleFavicon(domain, 'twenty-icons returned no PNG');
}

async function fetchGoogleFavicon(
	domain: string,
	reason: string,
): Promise<FetchResult> {
	const fallbackUrl = `${FALLBACK_SOURCE}?domain=${encodeURIComponent(domain)}&sz=${ICON_SIZE}`;

	try {
		const response = await fetch(fallbackUrl, {
			headers: { 'User-Agent': 'corsair-plugin-icon-fetch/1.0' },
		});
		if (!response.ok) {
			return {
				ok: false,
				error: `${reason}; google-favicon HTTP ${response.status}`,
			};
		}

		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.length === 0 || !isPng(bytes)) {
			return {
				ok: false,
				error: `${reason}; google-favicon returned no PNG`,
			};
		}

		return { ok: true, bytes, source: 'google-favicon' };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return {
			ok: false,
			error: `${reason}; google-favicon failed: ${message}`,
		};
	}
}

async function mapWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let index = 0;

	async function worker(): Promise<void> {
		while (index < items.length) {
			const current = index++;
			results[current] = await fn(items[current]!);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
	);

	return results;
}

async function main(): Promise<void> {
	const { force, only } = parseArgs(process.argv.slice(2));
	const root = repoRoot();
	const catalogPath = join(root, 'explorer/data/catalog.json');
	const iconsDir = join(root, 'explorer/icons');
	const manifestPath = join(root, 'explorer/data/icon-manifest.json');

	if (!existsSync(catalogPath)) {
		console.error(`[plugin-icons] Missing catalog: ${catalogPath}`);
		process.exit(1);
	}

	const catalog = JSON.parse(
		readFileSync(catalogPath, 'utf8'),
	) as PluginCatalogIndex;
	const allPluginIds = catalog.plugins.map((plugin) => plugin.id).sort();

	const fetchPluginIds =
		only.length > 0
			? allPluginIds.filter((id) => only.includes(id))
			: allPluginIds;

	mkdirSync(iconsDir, { recursive: true });

	const domains = buildPluginDomainMap(allPluginIds);
	const sources: Record<string, IconSource> = {};
	const failures: Manifest['failures'] = [];

	const targets = fetchPluginIds.filter((id) => {
		if (force) return true;
		return !existsSync(join(iconsDir, `${id}.png`));
	});

	if (targets.length === 0) {
		console.log(
			'[plugin-icons] All icons already present. Use --force to re-fetch.',
		);
	} else {
		console.log(`[plugin-icons] Fetching ${targets.length} icon(s)...`);

		await mapWithConcurrency(targets, CONCURRENCY, async (pluginId) => {
			const domain = domains[pluginId] ?? resolvePluginDomain(pluginId);
			const result = await fetchPluginIcon(pluginId, domain);

			if (!result.ok) {
				failures.push({ id: pluginId, domain, error: result.error });
				console.warn(`[plugin-icons] ${pluginId}: ${result.error}`);
				return;
			}

			try {
				const bytes = PLUGIN_ICON_LIGHT_TILE.has(pluginId)
					? await onLightTile(result.bytes)
					: result.bytes;
				writeFileSync(join(iconsDir, `${pluginId}.png`), bytes);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				failures.push({
					id: pluginId,
					domain,
					error: `write failed: ${message}`,
				});
				console.warn(`[plugin-icons] ${pluginId}: write failed: ${message}`);
				return;
			}
			sources[pluginId] = result.source;
			console.log(`[plugin-icons] ${pluginId} (${result.source})`);
		});
	}

	let existingSources: Record<string, IconSource> = {};
	if (existsSync(manifestPath)) {
		const existing = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
		existingSources = existing.sources ?? {};
	}

	// Listed in catalog order, not fetch-completion order, so reruns diff cleanly.
	const sortedSources: Record<string, IconSource> = {};
	for (const pluginId of allPluginIds) {
		const source =
			sources[pluginId] ??
			(existsSync(join(iconsDir, `${pluginId}.png`))
				? (existingSources[pluginId] ?? 'twenty-icons')
				: undefined);
		if (source) sortedSources[pluginId] = source;
	}

	const manifest: Manifest = {
		generatedAt: new Date().toISOString(),
		primarySource: PRIMARY_SOURCE,
		fallbackSource: FALLBACK_SOURCE,
		size: ICON_SIZE,
		format: ICON_FORMAT,
		total: allPluginIds.length,
		succeeded: allPluginIds.filter((id) =>
			existsSync(join(iconsDir, `${id}.png`)),
		).length,
		failed: failures.length,
		domains,
		sources: sortedSources,
		failures,
	};

	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

	console.log(
		[
			'[plugin-icons] Done.',
			`${manifest.succeeded}/${manifest.total} icons on disk`,
			failures.length > 0 ? `${failures.length} failed` : '0 failed',
		].join(' '),
	);

	if (failures.length > 0) {
		process.exitCode = 1;
	}
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
