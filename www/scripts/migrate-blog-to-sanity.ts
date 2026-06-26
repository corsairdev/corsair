import 'dotenv/config';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';
import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const seedDirectory = path.join(scriptDirectory, 'seed-data');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01';

if (!projectId || !token) {
	console.error(
		'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env',
	);
	process.exit(1);
}

console.log(`Migrating to project ${projectId} (dataset: ${dataset})`);
console.log(`Token loaded (${token.length} chars)`);

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	token,
	useCdn: false,
});

const blockContentSchema = Schema.compile({
	name: 'blogPost',
	types: [
		{
			type: 'object',
			name: 'post',
			fields: [
				{
					title: 'Body',
					name: 'body',
					type: 'array',
					of: [{ type: 'block' }],
				},
			],
		},
	],
});

const blockContentType = blockContentSchema
	.get('post')
	.fields.find((field: { name: string }) => field.name === 'body')?.type;

if (!blockContentType) {
	throw new Error('Could not resolve Portable Text schema');
}

type ImageUpload = {
	assetId: string;
	alt: string;
};

async function uploadImageFromPublicPath(
	publicPath: string,
	alt: string,
): Promise<ImageUpload | null> {
	const relativePath = publicPath.replace(/^\//, '');
	const filePath = path.join(projectRoot, 'public', relativePath);

	if (!fs.existsSync(filePath)) {
		console.warn(`Skipping missing image: ${publicPath}`);
		return null;
	}

	try {
		const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
			filename: path.basename(filePath),
		});

		return {
			assetId: asset._id,
			alt,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`Failed to upload ${publicPath}: ${message}`);
		console.warn('Skipping image — add it manually in Studio at /studio');
		return null;
	}
}

async function markdownSegmentToBlocks(markdown: string) {
	const html = await marked.parse(markdown);

	return htmlToBlocks(html, blockContentType, {
		parseHtml: (htmlString) => new JSDOM(htmlString).window.document,
	});
}

async function markdownToPortableText(markdown: string) {
	const blocks: Array<Record<string, unknown>> = [];
	const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let lastIndex = 0;

	for (const match of markdown.matchAll(imagePattern)) {
		const [fullMatch, alt, imagePath] = match;
		const matchIndex = match.index ?? 0;
		const textSegment = markdown.slice(lastIndex, matchIndex).trim();

		if (textSegment) {
			const textBlocks = await markdownSegmentToBlocks(textSegment);
			blocks.push(...(textBlocks as Array<Record<string, unknown>>));
		}

		const uploadedImage = await uploadImageFromPublicPath(imagePath, alt);

		if (uploadedImage) {
			blocks.push({
				_type: 'image',
				_key: `image-${matchIndex}`,
				asset: {
					_type: 'reference',
					_ref: uploadedImage.assetId,
				},
				alt: uploadedImage.alt,
			});
		}

		lastIndex = matchIndex + fullMatch.length;
	}

	const trailingText = markdown.slice(lastIndex).trim();

	if (trailingText) {
		const trailingBlocks = await markdownSegmentToBlocks(trailingText);
		blocks.push(...(trailingBlocks as Array<Record<string, unknown>>));
	}

	return blocks;
}

async function migrateMarkdownFile(filename: string) {
	const filePath = path.join(seedDirectory, filename);
	const raw = fs.readFileSync(filePath, 'utf8');
	const { data, content } = matter(raw);
	const slug = filename.replace(/\.md$/, '');
	const body = await markdownToPortableText(content);

	const documentId = `post-${slug}`;

	try {
		await client.createOrReplace({
			_id: documentId,
			_type: 'post',
			title: String(data.title),
			slug: { _type: 'slug', current: slug },
			description: String(data.description),
			author: String(data.author ?? 'Corsair Team'),
			publishedAt: new Date(String(data.publishedAt)).toISOString(),
			body,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Failed to create post "${slug}": ${message}\n\n` +
				'Check that SANITY_API_WRITE_TOKEN is an API token with Editor permissions ' +
				'(Sanity Manage → API → Tokens → Add API token → Permissions: Editor). ' +
				'"Manager" is a project member role for humans, not an API token type.',
		);
	}

	console.log(`Migrated post: ${slug}`);
}

async function main() {
	const markdownFiles = fs
		.readdirSync(seedDirectory)
		.filter((filename) => filename.endsWith('.md'));

	if (markdownFiles.length === 0) {
		console.log('No markdown files found in scripts/seed-data');
		return;
	}

	for (const filename of markdownFiles) {
		await migrateMarkdownFile(filename);
	}

	console.log('Migration complete.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
