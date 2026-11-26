import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lushaEndpointSchemas } from './index';

/**
 * Every response example in docs.lusha.com/openapi.json, keyed by operation
 * (fixtures/spec-examples.json is written by the same generator as the
 * schemas). Each must parse with its operation's output schema: Lusha's own
 * examples are the closest thing to a live response without a key.
 */
// unknown: the examples are arbitrary JSON; each is parsed by its schema.
const fixtures = JSON.parse(
	readFileSync(join(__dirname, 'fixtures', 'spec-examples.json'), 'utf8'),
) as { responses: Record<string, unknown[]> };
const byOperation = fixtures.responses;
// Spec keys for the hand-written operations.
const HAND_WRITTEN: Record<string, keyof typeof lushaEndpointSchemas> = {
	searchContacts: 'person.searchContacts',
	enrichContacts: 'person.enrichContacts',
	searchAndEnrichContacts: 'person.searchAndEnrichContacts',
	searchCompanies: 'company.searchCompanies',
	enrichCompanies: 'company.enrichCompanies',
	searchAndEnrichCompanies: 'company.searchAndEnrichCompanies',
	getAccountUsage: 'account.getAccountUsage',
	getContactsEnrichJob: 'jobs.getContactsEnrichJob',
};

const cases = Object.entries(byOperation).flatMap(([key, list]) =>
	list.map((example, index) => {
		const operation = (HAND_WRITTEN[key] ??
			key) as keyof typeof lushaEndpointSchemas;
		return [`${operation} #${index}`, operation, example] as const;
	}),
);

describe('documented response examples', () => {
	it('has examples to check', () => {
		expect(cases.length).toBeGreaterThan(40);
	});

	it.each(cases)('%s parses', (_label, operation, example) => {
		const schema = lushaEndpointSchemas[operation];
		expect(schema).toBeDefined();
		const result = schema.output.safeParse(example);
		expect(result.error?.issues ?? []).toEqual([]);
	});
});
