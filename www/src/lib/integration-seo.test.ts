import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IntegrationCapabilityGroup } from './integration-page.types';
import {
	buildIntegrationJsonLd,
	countToolsByRisk,
	escapeJsonLd,
	integrationApprovalSummary,
	integrationAuthSummary,
	integrationMcpFaqs,
	integrationMetaDescription,
	integrationMetaTitle,
	withMcp,
} from './integration-seo';

const gmailOps: IntegrationCapabilityGroup[] = [
	{
		resource: 'messages',
		resourceLabel: 'Messages',
		actions: [
			{ id: 'messages.list', label: 'List', riskLevel: 'read' },
			{ id: 'messages.send', label: 'Send', riskLevel: 'write' },
			{ id: 'messages.delete', label: 'Delete', riskLevel: 'destructive' },
		],
	},
	{
		resource: 'labels',
		resourceLabel: 'Labels',
		actions: [
			{ id: 'labels.list', label: 'List', riskLevel: 'read' },
			{ id: 'labels.create', label: 'Create', riskLevel: 'write' },
		],
	},
];

describe('integrationMetaTitle', () => {
	it('names the clients when the title fits in 50 characters', () => {
		assert.equal(
			integrationMetaTitle('Gmail'),
			'Gmail MCP Server for Claude, ChatGPT & Cursor',
		);
	});

	it('falls back to shorter forms for long app names', () => {
		assert.equal(
			integrationMetaTitle('Google Calendar'),
			'Google Calendar MCP Server for AI Agents',
		);
		const longName = 'Accredible Certificates Suite';
		assert.equal(integrationMetaTitle(longName), `${longName} MCP Server`);
	});

	it('never exceeds 50 characters for names up to 37 characters', () => {
		for (const name of ['Linear', 'Notion', 'Microsoft Dynamics 365']) {
			assert.ok(integrationMetaTitle(name).length <= 50, name);
		}
	});
});

describe('integrationMetaDescription', () => {
	it('stays within 160 characters and mentions the tool count', () => {
		for (const name of ['Gmail', 'Accredible Certificates Suite']) {
			const text = integrationMetaDescription(name, 23);
			assert.ok(text.length <= 160, `${name}: ${text.length}`);
			assert.match(text, /Corsair's MCP server/);
		}
		assert.match(integrationMetaDescription('Gmail', 23), /23 Gmail tools/);
		assert.match(integrationMetaDescription('Gmail', 1), /1 Gmail tool,/);
	});
});

describe('countToolsByRisk', () => {
	it('counts actions by risk level across groups', () => {
		assert.deepEqual(countToolsByRisk(gmailOps), {
			read: 2,
			write: 2,
			destructive: 1,
		});
		assert.deepEqual(countToolsByRisk([]), {
			read: 0,
			write: 0,
			destructive: 0,
		});
	});
});

describe('integrationAuthSummary', () => {
	it('leads with the default auth type and mentions the alternative', () => {
		assert.match(
			integrationAuthSummary('Gmail', ['oauth_2']),
			/^Sign in to Gmail once/,
		);
		assert.match(
			integrationAuthSummary('Zoom', ['oauth_2', 'api_key']),
			/^Sign in to Zoom or add an API key/,
		);
		assert.match(
			integrationAuthSummary('Linear', ['api_key', 'oauth_2']),
			/^Add your Linear API key or sign in with OAuth/,
		);
		assert.match(
			integrationAuthSummary('Stripe', ['api_key']),
			/^Add your Stripe API key once/,
		);
		assert.match(
			integrationAuthSummary('Telegram', ['bot_token', 'api_key', 'oauth_2']),
			/^Add your Telegram bot token/,
		);
		assert.match(
			integrationAuthSummary('Webvizio', []),
			/^Add your Webvizio API key/,
		);
	});
});

describe('integrationApprovalSummary', () => {
	it('says how many destructive tools wait for approval', () => {
		const text = integrationApprovalSummary(
			'Gmail',
			countToolsByRisk(gmailOps),
		);
		assert.match(text, /its 1 destructive tool waits for your approval/);
	});

	it('handles apps with no destructive tools', () => {
		const text = integrationApprovalSummary('Weather', {
			read: 4,
			write: 1,
			destructive: 0,
		});
		assert.match(text, /None of Weather's tools are destructive/);
		assert.match(text, /each of its 1 write,/);
	});
});

describe('integrationMcpFaqs', () => {
	it('adds client and approval questions with app-specific answers', () => {
		const faqs = integrationMcpFaqs('Gmail', countToolsByRisk(gmailOps));
		assert.deepEqual(
			faqs.map((faq) => faq.id),
			['mcp-clients', 'mcp-approval'],
		);
		assert.match(faqs[0].answer, /mcp\.corsair\.dev\/mcp/);
		assert.match(faqs[1].answer, /1 destructive Gmail tool\./);
	});
});

describe('buildIntegrationJsonLd', () => {
	it('builds a breadcrumb and an FAQPage without backticks', () => {
		const json = buildIntegrationJsonLd({
			id: 'gmail',
			displayName: 'Gmail',
			faqs: [
				{ id: 'a', question: 'Is `send` gated?', answer: 'Use `Strict`.' },
			],
		});
		const [breadcrumb, faq] = json['@graph'];
		assert.equal(breadcrumb['@type'], 'BreadcrumbList');
		assert.equal(faq['@type'], 'FAQPage');
		assert.deepEqual(faq.mainEntity, [
			{
				'@type': 'Question',
				name: 'Is send gated?',
				acceptedAnswer: { '@type': 'Answer', text: 'Use Strict.' },
			},
		]);
	});

	it('leaves out the FAQPage when there are no FAQs', () => {
		const json = buildIntegrationJsonLd({
			id: 'x',
			displayName: 'X',
			faqs: [],
		});
		assert.equal(json['@graph'].length, 1);
	});
});

describe('escapeJsonLd', () => {
	it('escapes characters that could close the script tag', () => {
		const out = escapeJsonLd(JSON.stringify({ text: '</script>&' }));
		assert.equal(/[<>&]/.test(out), false);
		assert.deepEqual(JSON.parse(out), { text: '</script>&' });
	});
});

describe('withMcp', () => {
	it('adds MCP once, even for names that already end in it', () => {
		assert.equal(withMcp('Gmail'), 'Gmail MCP');
		assert.equal(withMcp('Tavily MCP'), 'Tavily MCP');
		assert.equal(
			integrationMetaTitle('Tavily MCP'),
			'Tavily MCP Server for Claude, ChatGPT & Cursor',
		);
		assert.equal(withMcp('McpHub'), 'McpHub MCP');
	});
});
