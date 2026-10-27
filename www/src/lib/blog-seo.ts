import type { PortableTextBlock } from '@portabletext/types';

const SITE_URL = 'https://corsair.dev';

export type BlogFaq = {
	id: string;
	question: string;
	answer: string;
};

export type BlogJsonLdInput = {
	slug: string;
	title: string;
	description: string;
	author: string;
	publishedAt: string;
	updatedAt?: string;
	keywords: string[];
	faqs: BlogFaq[];
	imageUrl?: string;
};

// The jsonLd field is free-form JSON typed by editors, so its values have no
// schema we can trust; they stay unknown until isObject/typeof checks narrow them.
type JsonObject = Record<string, unknown>;

// Accepts unknown because it is the type guard that narrows parsed JSON and
// Portable Text children, whose shape isn't guaranteed.
function isObject(value: unknown): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasType(node: JsonObject, type: string) {
	const value = node['@type'];
	return Array.isArray(value) ? value.includes(type) : value === type;
}

// Posts published before the FAQs field was filled in keep their FAQ only
// inside the hand-written jsonLd field. Read it from there so those posts
// still show an FAQ. Anything that doesn't parse is ignored.
export function faqsFromJsonLd(raw: string | null | undefined): BlogFaq[] {
	if (!raw?.trim()) return [];

	// JSON.parse can return any JSON value; unknown forces the checks below.
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}

	const nodes = (Array.isArray(parsed) ? parsed : [parsed]).flatMap((node) =>
		isObject(node) && Array.isArray(node['@graph']) ? node['@graph'] : [node],
	);
	const faqPage = nodes.find(
		(node): node is JsonObject => isObject(node) && hasType(node, 'FAQPage'),
	);
	if (!faqPage || !Array.isArray(faqPage.mainEntity)) return [];

	return faqPage.mainEntity.flatMap((entity, index) => {
		if (!isObject(entity)) return [];
		const answer = isObject(entity.acceptedAnswer)
			? entity.acceptedAnswer.text
			: undefined;
		if (typeof entity.name !== 'string' || typeof answer !== 'string') {
			return [];
		}
		const question = entity.name.trim();
		const text = answer.trim();
		return question && text
			? [{ id: `jsonld-${index}`, question, answer: text }]
			: [];
	});
}

function blockText(block: PortableTextBlock) {
	return (block.children ?? [])
		.map((child) =>
			isObject(child) && typeof child.text === 'string' ? child.text : '',
		)
		.join('');
}

function normalize(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

// Posts write their FAQ into the body, and the FAQs field repeats it. Google
// only accepts FAQ markup for content the reader can see, and the field can
// drift from the body when one is edited, so keep an item only when both its
// question and its answer appear in the body.
export function faqsVisibleInBody(faqs: BlogFaq[], body: PortableTextBlock[]) {
	const bodyText = normalize(
		body
			.filter((block) => block._type === 'block')
			.map(blockText)
			.join(' '),
	);
	return faqs.filter((faq) => {
		const question = normalize(faq.question);
		const answer = normalize(faq.answer);
		return (
			question.length > 0 &&
			answer.length > 0 &&
			bodyText.includes(question) &&
			bodyText.includes(answer)
		);
	});
}

function plainText(value: string) {
	return value.replace(/`/g, '');
}

function authorNode(author: string) {
	if (!author || author === 'Corsair Team') {
		return { '@type': 'Organization', name: 'Corsair', url: SITE_URL };
	}
	return { '@type': 'Person', name: author };
}

export function buildBlogPostJsonLd(post: BlogJsonLdInput) {
	const url = `${SITE_URL}/blog/${post.slug}`;
	const graph: JsonObject[] = [
		{
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.description,
			url,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			datePublished: post.publishedAt,
			dateModified: post.updatedAt ?? post.publishedAt,
			author: authorNode(post.author),
			publisher: {
				'@type': 'Organization',
				name: 'Corsair',
				url: SITE_URL,
				logo: { '@type': 'ImageObject', url: `${SITE_URL}/corsair-logo.png` },
			},
			...(post.imageUrl ? { image: post.imageUrl } : {}),
			...(post.keywords.length > 0
				? { keywords: post.keywords.join(', ') }
				: {}),
		},
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Blog',
					item: `${SITE_URL}/blog`,
				},
				{ '@type': 'ListItem', position: 2, name: post.title, item: url },
			],
		},
	];

	if (post.faqs.length > 0) {
		graph.push({
			'@type': 'FAQPage',
			mainEntity: post.faqs.map((faq) => ({
				'@type': 'Question',
				name: plainText(faq.question),
				acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
			})),
		});
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}

// Takes unknown like JSON.stringify does: callers pass whatever JSON-LD
// object they built, and its shape doesn't matter for escaping.
export function serializeJsonLd(value: unknown) {
	return JSON.stringify(value)
		.replace(/&/g, '\\u0026')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e');
}
