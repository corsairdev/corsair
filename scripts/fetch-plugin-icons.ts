/**
 * Writes plugin brand icons into `explorer/icons/` and
 * `explorer/data/icon-manifest.json`.
 *
 * Our own curated SVGs in `scripts/plugin-icon-sources/<id>.svg` come first:
 * each is a cleaned, reviewed copy (see that folder's README), re-rendered to
 * `<id>.svg` + `<id>.png` on every run, without the network. Every other icon
 * is downloaded once as a PNG: a hand-picked URL, else the domain's favicon.
 * Marks drawn largely in black also get `<id>.dark.png` for dark surfaces.
 *
 * Run after adding plugins or when icons look stale:
 *   pnpm fetch:plugin-icons
 *   pnpm fetch:plugin-icons -- --force
 *   pnpm fetch:plugin-icons -- --only=slack,github
 *
 * `--only` limits which icons are fetched; the manifest always lists the full catalog.
 */
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import type { PluginCatalogIndex } from '../explorer/src/types.ts';
import {
	buildPluginDomainMap,
	resolvePluginDomain,
} from './plugin-icon-domains.ts';
import {
	analyzeInk,
	darkVariantPng,
	detectTrace,
	needsDarkVariant,
	renderSvgToPng,
	sanitizeSvg,
} from './plugin-icon-svg.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRIMARY_SOURCE = 'https://twenty-icons.com';
const FALLBACK_SOURCE = 'https://www.google.com/s2/favicons';
const ICON_SIZE = 128;
const ICON_FORMAT = 'png';
const CONCURRENCY = 12;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

type IconSource =
	| 'curated'
	| 'twenty-icons'
	| 'google-favicon'
	| 'url-override';

/** Our own cleaned SVGs, one per plugin id. */
const CURATED_DIR = join(__dirname, 'plugin-icon-sources');

/**
 * Dark marks on a transparent background that vanish on a dark surface (Lug's
 * picker draws icons with no tile behind them). These are flattened onto a
 * white tile with some padding after fetching.
 */
const PLUGIN_ICON_LIGHT_TILE = new Set(['attio']);

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

/**
 * Marks drawn on an opaque white square, which shows as a white box on a dark
 * surface. The white connected to the image edge becomes transparent; white
 * inside the mark stays.
 */
const PLUGIN_ICON_CLEAR_EDGE_WHITE = new Set(['griptape', 'recallai']);

/** A channel value at or above this counts as background white. */
const EDGE_WHITE_MIN = 236;

async function clearEdgeWhite(bytes: Buffer): Promise<Buffer> {
	const { data, info } = await sharp(bytes)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width, height } = info;
	const isWhite = (p: number) =>
		data[p * 4 + 3]! > 0 &&
		data[p * 4]! >= EDGE_WHITE_MIN &&
		data[p * 4 + 1]! >= EDGE_WHITE_MIN &&
		data[p * 4 + 2]! >= EDGE_WHITE_MIN;
	const seen = new Uint8Array(width * height);
	const stack: number[] = [];
	for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
	for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
	while (stack.length > 0) {
		const p = stack.pop()!;
		if (seen[p] || !isWhite(p)) continue;
		seen[p] = 1;
		data[p * 4 + 3] = 0;
		const x = p % width;
		if (x > 0) stack.push(p - 1);
		if (x < width - 1) stack.push(p + 1);
		if (p >= width) stack.push(p - width);
		if (p < (height - 1) * width) stack.push(p + width);
	}
	return sharp(data, { raw: info }).png().toBuffer();
}

/**
 * Raster icons chosen by hand: PNG, JPEG or WebP only. A vector mark is not
 * fetched from a URL; it is imported into scripts/plugin-icon-sources/ with
 * `pnpm import:plugin-icon`, reviewed, and served from there.
 */
const PLUGIN_ICON_URL_OVERRIDES: Record<string, string> = {
	googledocs:
		'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_96dp.png',
	filevine:
		'https://media.licdn.com/dms/image/v2/D560BAQGBEC5giXvomQ/company-logo_200_200/B56ZlidRJjIsAM-/0/1758293463972/filevine_logo?e=2147483647&v=beta&t=oruRrK3tPc5_e8haya4o-oxpBMhFDjjgoa_1xePKBYI',
	currentsapi:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://currentsapi.services&size=128',
	// starton.io answers 402 and starton.com has no favicon; the GitHub org mark is the public logo.
	starton: 'https://github.com/starton-io.png?size=200',
	// twenty-icons only has a 32px blur; the site apple touch icon is 180px.
	browseruse: 'https://browser-use.com/apple-touch-icon.png',
	// The site's own logo (header, favicon and touch icon), a green lock. Its
	// /icon.svg is an unreferenced purple shield, not the brand's mark.
	anonyflow: 'https://anonyflow.com/anonyflow-logo.avif',
	// The brand's own large icons: the site's web-app icon, or the App Store
	// icon where the site only has a small favicon.
	cal: 'https://cal.com/icon.png',
	// Clay's 2026 mark (the arch); twenty-icons still has the old "C".
	clay: 'https://cdn.prod.website-files.com/61477f2c24a826836f969afe/6a3a92ab2ebcb50096cbd51a_dot-com_favicon_2026_512.png',
	// Griptape's current round mark; the old one was a square tile.
	griptape:
		'https://cdn.prod.website-files.com/65d658559223871198e78bca/6995e1929b75bc0cd4eecdfa_griptape%20favicon2.png',
	postman:
		'https://www.postman.com/_mk-www-next/icons/android-chrome-512x512.png',
	recallai:
		'https://cdn.prod.website-files.com/620d732b1f1f7b244ac89f0e/620d732c1f1f7ba1edc89f35_Favicon%20256.png',
	// The site only has a 32px favicon; the context.dev Brand API has the same
	// mark at 144px.
	classmarker:
		'https://media.brand.dev/90bbd6a6-80a8-44fc-ba31-fbad0b3a875f.png',
	waboxapp: 'https://media.brand.dev/c94b6487-73cb-4185-8ed1-27d6a2e0c3b0.png',
	zoom: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/fc/d0/96/fcd09664-56c3-f856-4311-da9dcbae1fd2/AppIcon-0-0-1x_U007epad-0-1-0-0-85-220.png/512x512bb.png',
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
	// MongoDB logo; the plugin is LibreChat's Code Interpreter.
	codeinterpreter: 'https://www.librechat.ai/apple-touch-icon.png',
	// green "e" from exist.com; Exist is exist.io.
	exist:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/eb/2d/87/eb2d8749-e29e-c363-0b02-515eec684bce/Icon-0-0-1x_U007epad-0-0-0-1-0-0-85-220.png/256x256bb.png',
	// GoDaddy parked-domain icon from extractaai.com; Extracta is extracta.ai.
	extractaai: 'https://extracta.ai/wp-content/uploads/2024/01/logo192.png',
	// Fundable crowdfunding "F"; the plugin is Fundable (tryfundable.ai).
	fundable:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tryfundable.ai&size=256',
	// red "MINIMAX" block from minimax.com; MiniMax AI's mark is the pink waveform.
	minimax: 'https://github.com/MiniMax-AI.png?size=256',
	// "Q" mark from orbit.com; the API is Orbit (orbitsearch.com).
	orbit: 'https://orbitsearch.com/images/apple-touch-icon.png?v=2',
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
	agentmail: 'https://github.com/agentmail-to.png?size=256',
	attio: 'https://github.com/attio.png?size=256',
	bart: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/a4/ba/9c/a4ba9c69-42da-ea8a-2563-2a61af13b85a/BartAppIcon-0-0-1x_U007emarketing-0-11-0-sRGB-85-220.png/256x256bb.png',
	beeminder:
		'https://www.beeminder.com/assets/small_logo_bee_256-e807d274abc2d10aad17390dfe41eecb07b851f1a106f6b06be069a1b2d92749.png',
	bestbuy:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4c/d0/aa/4cd0aa20-24a4-3477-ea0c-c4cfd922eef9/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/256x256bb.png',
	bigdatacloud: 'https://www.bigdatacloud.com/apple-touch-icon.png',
	blackbaud: 'https://github.com/blackbaud.png?size=256',
	booqable: 'https://github.com/booqable.png?size=256',
	boxhero:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bd/a5/8f/bda58fea-77be-f64c-2a75-760da526e309/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/256x256bb.png',
	brex: 'https://github.com/brexhq.png?size=256',
	browseai:
		'https://cdn.prod.website-files.com/628be7c04ab34bfc699e4acb/68b9c656f48bca83e2a16839_webclip.png',
	carbone: 'https://github.com/carboneio.png?size=256',
	chatwork:
		'https://go.chatwork.com/en/image/common/touch-icon-ipad-retina.png?v=20230526',
	clickmeeting: 'https://github.com/ClickMeeting.png?size=256',
	cloudcart: 'https://cloudcart.com/apple-touch-icon.png',
	confluence:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/04/52/01/045201ed-6725-c7ef-6e2a-d7eb13a7e42e/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/256x256bb.png',
	contactout: 'https://contactout.com/android-chrome-512x512.png',
	cosmic: 'https://github.com/cosmicjs.png?size=256',
	docmosis:
		'https://www.docmosis.com/wp-content/uploads/2021/07/favicon-2-300x300.png',
	heygen: 'https://github.com/HeyGen-Official.png?size=256',
	jira: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/41/38/ef/4138ef7d-0ec9-9782-6029-04b69aa60f26/AppIcon-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	kaggle: 'https://github.com/Kaggle.png?size=256',
	leexi:
		'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/db/74/d1/db74d11f-37da-68e4-5962-dca0a950dd68/AppIcon-0-0-1x_U007epad-0-1-85-220.png/256x256bb.png',
	mailboxlayer: 'https://mailboxlayer.com/images/icons/mailboxlayer_icon.png',
	openrouter: 'https://openrouter.ai/favicon/glyph.png',
	pdfco: 'https://pdf.co/favicon.png',
	pdl: 'https://github.com/peopledatalabs.png?size=256',
	pinecone: 'https://github.com/pinecone-io.png?size=256',
	pushbullet: 'https://github.com/pushbullet.png?size=256',
	scaleai: 'https://scale.com/static/global/favicon/v3/apple-touch-icon.png',
	spotify: 'https://github.com/spotify.png?size=256',
	tavily: 'https://www.tavily.com/apple-icon.png?apple-icon.2rsjznomrsf77.png',
	textrazor: 'https://github.com/TextRazor.png?size=256',
	twentyonerisk:
		'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://21risk.com&size=256',
	webscrapingai: 'https://github.com/webscraping-ai.png?size=256',
	witai: 'https://github.com/wit-ai.png?size=256',
	workday: 'https://github.com/Workday.png?size=256',
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
	/** Ids with a vector `<id>.svg` next to the PNG. */
	svg: string[];
	/** Ids with an `<id>.dark.png` variant for dark surfaces. */
	dark: string[];
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

/** Raster formats some override CDNs serve instead of PNG (heif covers AVIF). */
const CONVERTIBLE_FORMATS = new Set(['jpeg', 'webp', 'gif', 'heif']);

/**
 * Normalize url-override bytes to PNG: null when they aren't a raster image.
 * SVG is refused here; vector marks come from scripts/plugin-icon-sources/.
 */
async function normalizeOverrideToPng(bytes: Buffer): Promise<Buffer | null> {
	if (isPng(bytes)) return bytes;
	try {
		const { format } = await sharp(bytes).metadata();
		if (!format || !CONVERTIBLE_FORMATS.has(format)) return null;
		return await sharp(bytes).png().toBuffer();
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
			return {
				ok: false,
				error:
					'url-override returned no raster image (an SVG goes through pnpm import:plugin-icon)',
			};
		}
		return { ok: true, bytes, source: 'url-override' };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { ok: false, error: `url-override failed: ${message}` };
	}
}

type CuratedIcon = { svg: string; png: Buffer } | { error: string };

/**
 * Read our own SVG for a plugin. It is sanitized again (the file is served
 * from corsair.dev) and refused if it is a trace: a traced file has to be
 * redrawn or replaced, not shipped.
 */
async function readCuratedIcon(pluginId: string): Promise<CuratedIcon> {
	const raw = readFileSync(join(CURATED_DIR, `${pluginId}.svg`), 'utf8');
	const trace = detectTrace(raw);
	if (trace.traced) {
		return { error: `curated svg looks traced: ${trace.reasons.join('; ')}` };
	}
	const clean = sanitizeSvg(raw);
	if (!clean.ok) return { error: `curated svg: ${clean.error}` };
	try {
		return { svg: clean.svg, png: await renderSvgToPng(clean.svg) };
	} catch (error) {
		return { error: `curated svg did not render: ${String(error)}` };
	}
}

function curatedIds(): Set<string> {
	if (!existsSync(CURATED_DIR)) return new Set();
	return new Set(
		readdirSync(CURATED_DIR)
			.filter((file) => file.endsWith('.svg'))
			.map((file) => file.slice(0, -'.svg'.length)),
	);
}

/**
 * `<id>.dark.png` for a mark that is largely black and would vanish on a dark
 * surface, built from the PNG on disk; removed when the mark doesn't need one.
 */
async function writeDarkVariant(iconsDir: string, pluginId: string) {
	const png = readFileSync(join(iconsDir, `${pluginId}.png`));
	const darkPath = join(iconsDir, `${pluginId}.dark.png`);
	if (needsDarkVariant(await analyzeInk(png))) {
		writeFileSync(darkPath, await darkVariantPng(png));
	} else {
		rmSync(darkPath, { force: true });
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

	const curated = curatedIds();
	for (const id of curated) {
		if (!allPluginIds.includes(id)) {
			failures.push({
				id,
				domain: '',
				error: `scripts/plugin-icon-sources/${id}.svg matches no catalog plugin`,
			});
		}
	}

	// Our own files render offline, so they are redone on every run.
	for (const pluginId of fetchPluginIds.filter((id) => curated.has(id))) {
		const icon = await readCuratedIcon(pluginId);
		if ('error' in icon) {
			failures.push({ id: pluginId, domain: '', error: icon.error });
			console.warn(`[plugin-icons] ${pluginId}: ${icon.error}`);
			continue;
		}
		writeFileSync(join(iconsDir, `${pluginId}.svg`), icon.svg);
		writeFileSync(join(iconsDir, `${pluginId}.png`), icon.png);
		sources[pluginId] = 'curated';
	}
	// A vector file with no curated source behind it is left over: remove it.
	for (const pluginId of allPluginIds) {
		if (!curated.has(pluginId)) {
			rmSync(join(iconsDir, `${pluginId}.svg`), { force: true });
		}
	}

	const targets = fetchPluginIds.filter((id) => {
		if (curated.has(id)) return false;
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
					: PLUGIN_ICON_CLEAR_EDGE_WHITE.has(pluginId)
						? await clearEdgeWhite(result.bytes)
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

	for (const pluginId of fetchPluginIds) {
		if (existsSync(join(iconsDir, `${pluginId}.png`))) {
			await writeDarkVariant(iconsDir, pluginId);
		}
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
			(curated.has(pluginId) ? 'curated' : undefined) ??
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
		svg: allPluginIds.filter((id) => existsSync(join(iconsDir, `${id}.svg`))),
		dark: allPluginIds.filter((id) =>
			existsSync(join(iconsDir, `${id}.dark.png`)),
		),
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

// A rejection can carry any value, not only an Error, so it is typed unknown
// and printed as is.
main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
