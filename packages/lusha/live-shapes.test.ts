/**
 * Responses recorded from Lusha's live API (free plan, 11-26), trimmed to one
 * item per list with placeholder people. Each must parse, and every field in
 * it must be named in the output schema, so a field Lusha really sends is
 * typed rather than passed through by `.loose()` unseen.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { describeLushaError } from './client';
import { LushaSpecOutputSchemas as SpecOutputs } from './endpoints/generated/spec-schemas';
import { LushaEndpointOutputSchemas as Outputs } from './endpoints/types';

const SCHEMAS: Record<string, z.ZodType> = {
	'company.searchCompanies': Outputs.companySearchCompanies,
	'company.prospectCompanies': SpecOutputs.companyProspectCompanies,
	'company.enrichCompanies': Outputs.companyEnrichCompanies,
	'company.searchAndEnrichCompanies': Outputs.companySearchAndEnrichCompanies,
	'person.searchContacts': Outputs.personSearchContacts,
	'person.prospectContacts': SpecOutputs.personProspectContacts,
	'person.enrichContacts': Outputs.personEnrichContacts,
	'person.searchAndEnrichContacts': Outputs.personSearchAndEnrichContacts,
	'person.getContactRecommendations':
		SpecOutputs.personGetContactRecommendations,
	'account.getAccountUsage': Outputs.accountGetAccountUsage,
};

function unwrap(schema: z.ZodType): z.ZodType {
	let current = schema;
	while (
		current instanceof z.ZodOptional ||
		current instanceof z.ZodNullable ||
		current instanceof z.ZodDefault
	) {
		current = current.unwrap() as z.ZodType;
	}
	return current;
}

/** Paths in `value` that `schema` does not name (records name every key). */
// unknown: value is a recorded JSON response walked alongside its schema.
function unnamed(schema: z.ZodType, value: unknown, path = ''): string[] {
	const s = unwrap(schema);
	if (s instanceof z.ZodUnion) {
		const tries = (s.options as z.ZodType[]).map((o) =>
			unnamed(o, value, path),
		);
		return tries.reduce((a, b) => (b.length < a.length ? b : a));
	}
	if (s instanceof z.ZodArray && Array.isArray(value)) {
		return value.flatMap((item) =>
			unnamed(s.element as z.ZodType, item, `${path}[]`),
		);
	}
	if (
		s instanceof z.ZodObject &&
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value)
	) {
		const shape = s.shape as Record<string, z.ZodType>;
		return Object.entries(value).flatMap(([key, child]) => {
			const field = shape[key];
			return field
				? unnamed(field, child, `${path}.${key}`)
				: [`${path}.${key}`];
		});
	}
	return [];
}

// unknown: recorded JSON, checked against each schema below.
const RECORDED = JSON.parse(
	readFileSync(join(__dirname, '__fixtures__', 'live-responses.json'), 'utf8'),
) as Record<string, unknown>;

describe('Lusha live responses (recorded 11-26)', () => {
	it('records every operation the billed live run covered', () => {
		expect(Object.keys(SCHEMAS).every((op) => op in RECORDED)).toBe(true);
	});

	it.each(Object.keys(SCHEMAS))('%s parses', (op) => {
		expect(() => SCHEMAS[op]!.parse(RECORDED[op])).not.toThrow();
	});

	it.each(Object.keys(SCHEMAS))('%s names every live field', (op) => {
		expect(unnamed(SCHEMAS[op]!, RECORDED[op])).toEqual([]);
	});

	it('reads the 402 body company signals sent on the free plan', () => {
		// Sent with 28 of 40 credits left: the free plan does not cover
		// signals, though Lusha names it a credit limit.
		expect(
			describeLushaError(
				402,
				RECORDED['company.getCompanySignals.error402'],
				'fallback',
			),
		).toBe(
			"Lusha 402: You've reached your credit limit. Upgrade your account for more credits",
		);
	});
});
