import {
	pluginToDomain,
	resolveIconUrl,
	titleCasePlugin,
} from '../client/react/plugin-icon';

describe('pluginToDomain', () => {
	it('maps known plugin ids to their brand domain', () => {
		expect(pluginToDomain('github')).toBe('github.com');
		expect(pluginToDomain('linear')).toBe('linear.app');
		expect(pluginToDomain('gdrive')).toBe('drive.google.com');
	});

	it('normalizes underscores and case in the id', () => {
		expect(pluginToDomain('google_sheets')).toBe('docs.google.com');
	});

	it('falls back to <id>.com when nothing matches', () => {
		expect(pluginToDomain('madeupplugin')).toBe('madeupplugin.com');
	});
});

describe('resolveIconUrl', () => {
	it('uses the svgl override for generic-favicon products', () => {
		expect(resolveIconUrl('outlook.live.com')).toBe(
			'https://svgl.app/library/microsoft-outlook.svg',
		);
	});

	it('uses twenty-icons for everything else, stripping scheme/www/trailing slash', () => {
		expect(resolveIconUrl('github.com')).toBe(
			'https://twenty-icons.com/github.com',
		);
		expect(resolveIconUrl('https://www.linear.app/')).toBe(
			'https://twenty-icons.com/linear.app',
		);
	});
});

describe('titleCasePlugin', () => {
	it('humanizes an id', () => {
		expect(titleCasePlugin('google_sheets')).toBe('Google Sheets');
		expect(titleCasePlugin('github')).toBe('Github');
	});
});
