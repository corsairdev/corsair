import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PortableTextBlock } from '@portabletext/types';

import {
	buildBlogPostJsonLd,
	faqsFromJsonLd,
	faqsVisibleInBody,
	serializeJsonLd,
} from './blog-seo';

const faqPage = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: 'Are Google APIs free?',
			acceptedAnswer: { '@type': 'Answer', text: 'Most have a free tier.' },
		},
		{ '@type': 'Question', name: 'No answer here' },
	],
};

function block(style: string, ...spans: string[]): PortableTextBlock {
	return {
		_type: 'block',
		_key: spans.join(''),
		style,
		children: spans.map((text, i) => ({
			_type: 'span',
			_key: `s${i}`,
			text,
			marks: [],
		})),
		markDefs: [],
	};
}

describe('faqsFromJsonLd', () => {
	it('reads the FAQPage out of an array of nodes and drops incomplete items', () => {
		const raw = JSON.stringify([{ '@type': 'Article' }, faqPage]);
		assert.deepEqual(faqsFromJsonLd(raw), [
			{
				id: 'jsonld-0',
				question: 'Are Google APIs free?',
				answer: 'Most have a free tier.',
			},
		]);
	});

	it('also finds it inside an @graph or as a single object', () => {
		const graph = JSON.stringify({ '@graph': [faqPage] });
		assert.equal(faqsFromJsonLd(graph).length, 1);
		assert.equal(faqsFromJsonLd(JSON.stringify(faqPage)).length, 1);
	});

	it('returns nothing for empty, invalid or FAQ-less JSON', () => {
		assert.deepEqual(faqsFromJsonLd(undefined), []);
		assert.deepEqual(faqsFromJsonLd(''), []);
		assert.deepEqual(faqsFromJsonLd('{ not json'), []);
		assert.deepEqual(faqsFromJsonLd('{"@type":"Article"}'), []);
	});
});

describe('faqsVisibleInBody', () => {
	const faqs = [
		{ id: 'a', question: 'Are Google APIs free?', answer: 'Mostly.' },
		{ id: 'b', question: 'Do I need CASA?', answer: 'Sometimes.' },
	];

	it('keeps questions the body shows, whatever the block style or spans', () => {
		const body = [
			block('blockquote', 'Frequently Asked Questions'),
			block('normal', 'Are Google ', 'APIs', ' free?'),
			block('normal', 'Mostly.'),
		];
		assert.deepEqual(
			faqsVisibleInBody(faqs, body).map((f) => f.id),
			['a'],
		);
	});

	it('ignores case and punctuation differences', () => {
		const body = [
			block('h3', 'are google APIs free'),
			block('normal', 'MOSTLY'),
		];
		assert.equal(faqsVisibleInBody(faqs, body).length, 1);
	});

	it('drops an item whose answer in the body was changed or removed', () => {
		const edited = [
			block('normal', 'Are Google APIs free?'),
			block('normal', 'Only some of them.'),
		];
		assert.deepEqual(faqsVisibleInBody(faqs, edited), []);
		const questionOnly = [block('normal', 'Do I need CASA?')];
		assert.deepEqual(faqsVisibleInBody(faqs, questionOnly), []);
	});

	it('drops everything when the body has no FAQ', () => {
		assert.deepEqual(faqsVisibleInBody(faqs, [block('normal', 'Intro')]), []);
		assert.deepEqual(faqsVisibleInBody(faqs, []), []);
	});
});

describe('buildBlogPostJsonLd', () => {
	const base = {
		slug: 'gmail-mcp',
		title: 'Gmail MCP',
		description: 'Connect Gmail to an agent.',
		author: 'Dev Jain',
		publishedAt: '2026-09-07T16:39:00.000Z',
		keywords: [],
		faqs: [],
	};

	it('builds a BlogPosting and breadcrumb with Corsair as publisher', () => {
		const json = buildBlogPostJsonLd(base);
		const [posting, breadcrumb] = json['@graph'];
		assert.equal(posting['@type'], 'BlogPosting');
		assert.equal(posting.url, 'https://corsair.dev/blog/gmail-mcp');
		assert.equal(posting.dateModified, base.publishedAt);
		assert.deepEqual(posting.author, { '@type': 'Person', name: 'Dev Jain' });
		assert.equal((posting.publisher as { name: string }).name, 'Corsair');
		assert.equal('image' in posting, false);
		assert.equal(breadcrumb['@type'], 'BreadcrumbList');
		assert.equal(json['@graph'].length, 2);
	});

	it('adds image, keywords and an FAQPage when the post has them', () => {
		const json = buildBlogPostJsonLd({
			...base,
			author: 'Corsair Team',
			updatedAt: '2026-10-01T00:00:00Z',
			imageUrl: 'https://cdn.sanity.io/images/x.png',
			keywords: ['gmail mcp', 'mcp server'],
			faqs: [{ id: 'a', question: 'Is `send` gated?', answer: 'Yes.' }],
		});
		const [posting, , faq] = json['@graph'];
		assert.equal(posting.image, 'https://cdn.sanity.io/images/x.png');
		assert.equal(posting.keywords, 'gmail mcp, mcp server');
		assert.equal(posting.dateModified, '2026-10-01T00:00:00Z');
		assert.equal(
			(posting.author as { '@type': string })['@type'],
			'Organization',
		);
		assert.equal(faq['@type'], 'FAQPage');
		assert.deepEqual(faq.mainEntity, [
			{
				'@type': 'Question',
				name: 'Is send gated?',
				acceptedAnswer: { '@type': 'Answer', text: 'Yes.' },
			},
		]);
	});
});

describe('serializeJsonLd', () => {
	it('escapes characters that could close the script tag', () => {
		const out = serializeJsonLd({ text: '</script><b>&' });
		assert.equal(out.includes('<'), false);
		assert.equal(out.includes('>'), false);
		assert.equal(out.includes('&'), false);
		assert.deepEqual(JSON.parse(out), { text: '</script><b>&' });
	});
});
