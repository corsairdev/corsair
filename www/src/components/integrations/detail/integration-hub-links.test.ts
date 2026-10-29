import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { hubMcpConnectUrl, hubWwwPluginLoginUrl } from '@/lib/site-links';

// tsx compiles the components with the classic JSX runtime (the Next tsconfig
// has jsx: preserve), so React must be global before they load.
Object.assign(globalThis, { React });
const { IntegrationHubCta } = await import('./integration-hub-cta');
const { IntegrationMcpSetup } = await import('./integration-mcp-setup');

function hubLinks(html: string): string[] {
	return [...html.matchAll(/href="([^"]+)"/g)]
		.map((match) => match[1].replaceAll('&amp;', '&'))
		.filter((href) => href.startsWith('https://hub.corsair.dev'));
}

describe('integration page Hub links', () => {
	it('sends the card to MCP setup and its developer line to SDK sign-in', () => {
		const html = renderToStaticMarkup(
			createElement(IntegrationHubCta, {
				pluginId: 'linear',
				displayName: 'Linear',
			}),
		);
		assert.deepEqual(hubLinks(html), [
			hubMcpConnectUrl('linear'),
			hubWwwPluginLoginUrl('linear'),
		]);
	});

	it('sends MCP setup step 1 to /me/onboarding with the app picked', () => {
		const html = renderToStaticMarkup(
			createElement(IntegrationMcpSetup, {
				integration: {
					id: 'linear',
					displayName: 'Linear',
					authTypes: ['oauth_2'],
					operations: [],
				},
			}),
		);
		assert.deepEqual(hubLinks(html), [hubMcpConnectUrl('linear')]);
	});

	it('never links to the agent handoff, which mints a project per click', () => {
		const html =
			renderToStaticMarkup(
				createElement(IntegrationHubCta, {
					pluginId: 'gmail',
					displayName: 'Gmail',
				}),
			) +
			renderToStaticMarkup(
				createElement(IntegrationMcpSetup, {
					integration: {
						id: 'gmail',
						displayName: 'Gmail',
						authTypes: ['oauth_2'],
						operations: [],
					},
				}),
			);
		for (const href of hubLinks(html)) {
			assert.equal(new URL(href).searchParams.has('title'), false, href);
		}
	});
});
