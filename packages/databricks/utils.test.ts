import { parseCsvRecords } from './utils';

describe('Databricks utils', () => {
	it('keeps embedded newlines inside quoted CSV fields', () => {
		const csv = 'name,note\nalpha,"first\nsecond"\nbeta,plain';
		expect(parseCsvRecords(csv)).toEqual([
			{ name: 'alpha', note: 'first\nsecond' },
			{ name: 'beta', note: 'plain' },
		]);
	});
});
