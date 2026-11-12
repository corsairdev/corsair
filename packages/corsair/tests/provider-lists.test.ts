import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { BaseProviders, ProviderDisplayNames } from '../core/constants';

// Every plugin PR adds its id to BaseProviders and to the AllProviders union by
// hand. Neither list caught a second 'replicate', and the union went without
// 'builtwith' and 'dnsfilter' unnoticed, because it ends in `(string & {})`
// and so accepts any id at compile time.
function allProvidersUnionIds(): string[] {
	const source = readFileSync(
		join(__dirname, '..', 'core', 'constants.ts'),
		'utf8',
	);
	const start = source.indexOf('export type AllProviders =');
	const end = source.indexOf(';', start);
	return [...source.slice(start, end).matchAll(/\|\s*'([^']+)'/g)].map(
		(match) => match[1]!,
	);
}

describe('provider lists in core/constants.ts', () => {
	it('lists each provider once in BaseProviders', () => {
		const seen = new Set<string>();
		const repeated = BaseProviders.filter((id) => {
			if (seen.has(id)) return true;
			seen.add(id);
			return false;
		});
		expect(repeated).toEqual([]);
	});

	it('lists each provider once in the AllProviders union', () => {
		const ids = allProvidersUnionIds();
		expect(ids.length).toBeGreaterThan(400);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
	});

	it('has the same ids in BaseProviders, AllProviders and ProviderDisplayNames', () => {
		const base = [...BaseProviders].sort();
		expect([...new Set(allProvidersUnionIds())].sort()).toEqual(base);
		expect(Object.keys(ProviderDisplayNames).sort()).toEqual(base);
	});
});
