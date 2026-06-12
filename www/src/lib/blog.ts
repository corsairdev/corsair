import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export type BlogPostMeta = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	author: string;
};

export type BlogPost = BlogPostMeta & {
	content: string;
};

function getSlugFromFilename(filename: string) {
	return filename.replace(/\.md$/, '');
}

function parsePostMeta(slug: string, data: Record<string, unknown>): BlogPostMeta {
	return {
		slug,
		title: String(data.title ?? slug),
		description: String(data.description ?? ''),
		publishedAt: String(data.publishedAt ?? ''),
		author: String(data.author ?? 'Corsair'),
	};
}

export function getAllPosts(): BlogPostMeta[] {
	if (!fs.existsSync(BLOG_DIR)) return [];

	const posts = fs
		.readdirSync(BLOG_DIR)
		.filter((filename) => filename.endsWith('.md'))
		.map((filename) => {
			const slug = getSlugFromFilename(filename);
			const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
			const { data } = matter(raw);
			return parsePostMeta(slug, data);
		});

	return posts.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}

export function getPostBySlug(slug: string): BlogPost | null {
	const filepath = path.join(BLOG_DIR, `${slug}.md`);
	if (!fs.existsSync(filepath)) return null;

	const raw = fs.readFileSync(filepath, 'utf8');
	const { data, content } = matter(raw);

	return {
		...parsePostMeta(slug, data),
		content,
	};
}

export function getAllSlugs(): string[] {
	if (!fs.existsSync(BLOG_DIR)) return [];

	return fs
		.readdirSync(BLOG_DIR)
		.filter((filename) => filename.endsWith('.md'))
		.map(getSlugFromFilename);
}

export function formatPostDate(date: string) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(date));
}
