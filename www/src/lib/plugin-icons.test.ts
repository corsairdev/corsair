import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	missingIconResponse,
	parseIconQuery,
	pickIconFile,
	placeholderSvg,
} from './plugin-icons';

const files =
	(...names: string[]) =>
	(file: string) =>
		names.includes(file);

describe('parseIconQuery', () => {
	it('defaults to light and auto, and ignores other values', () => {
		assert.deepEqual(parseIconQuery(new URLSearchParams('v=4')), {
			theme: 'light',
			format: 'auto',
		});
		assert.deepEqual(
			parseIconQuery(new URLSearchParams('theme=dark&format=png')),
			{ theme: 'dark', format: 'png' },
		);
		assert.deepEqual(
			parseIconQuery(new URLSearchParams('theme=blue&format=gif')),
			{ theme: 'light', format: 'auto' },
		);
	});
});

describe('pickIconFile', () => {
	const light = { theme: 'light', format: 'auto' } as const;
	const dark = { theme: 'dark', format: 'auto' } as const;

	it('serves the SVG when there is one, the PNG otherwise', () => {
		assert.deepEqual(
			pickIconFile('slack', light, files('slack.svg', 'slack.png')),
			{
				file: 'slack.svg',
				type: 'image/svg+xml',
			},
		);
		assert.deepEqual(pickIconFile('typesafe', light, files('typesafe.png')), {
			file: 'typesafe.png',
			type: 'image/png',
		});
	});

	it('serves the dark variant on dark surfaces, and the normal icon when there is none', () => {
		const github = files('github.svg', 'github.png', 'github.dark.png');
		assert.equal(pickIconFile('github', dark, github)?.file, 'github.dark.png');
		assert.equal(pickIconFile('github', light, github)?.file, 'github.svg');
		assert.equal(
			pickIconFile('slack', dark, files('slack.svg', 'slack.png'))?.file,
			'slack.svg',
		);
	});

	it('serves PNG when asked for it', () => {
		assert.equal(
			pickIconFile(
				'slack',
				{ theme: 'light', format: 'png' },
				files('slack.svg', 'slack.png'),
			)?.file,
			'slack.png',
		);
	});

	it('returns null when the plugin has no icon file', () => {
		assert.equal(pickIconFile('newplugin', light, files()), null);
	});
});

describe('placeholderSvg', () => {
	it('draws the first letter on a Corsair blue tile', () => {
		const svg = placeholderSvg('salesflare');
		assert.match(svg, /fill="#4a38f5"/);
		assert.match(svg, />S<\/text>/);
		assert.match(placeholderSvg('1password'), />P<\/text>/);
	});
});

describe('missingIconResponse', () => {
	it('sends the SVG placeholder, but a 404 to clients that asked for PNG', () => {
		assert.equal(
			missingIconResponse({ theme: 'light', format: 'auto' }),
			'placeholder',
		);
		assert.equal(
			missingIconResponse({ theme: 'dark', format: 'auto' }),
			'placeholder',
		);
		assert.equal(
			missingIconResponse({ theme: 'light', format: 'png' }),
			'not-found',
		);
	});
});
