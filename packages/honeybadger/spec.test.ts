import { HoneybadgerEndpointOutputSchemas } from './endpoints/types';
import { SPEC_RESPONSES } from './spec-fixtures';

/**
 * Every output schema is checked against a document built from the published
 * OpenAPI spec with required fields only. A schema that requires a field the
 * spec marks optional would fail here, which is the defect a hand-written
 * fixture cannot catch: it is written by the same person who wrote the schema.
 *
 * Spec: https://docs.honeybadger.io/api/v3/openapi.json
 */
describe('output schemas accept what the spec documents', () => {
	it.each(SPEC_RESPONSES)(
		'$operation parses its documented response',
		({ operation, document }) => {
			const schema =
				HoneybadgerEndpointOutputSchemas[
					operation as keyof typeof HoneybadgerEndpointOutputSchemas
				];
			expect(schema).toBeDefined();
			const parsed = schema.safeParse(document);
			expect(parsed.error?.issues ?? []).toEqual([]);
			expect(parsed.success).toBe(true);
		},
	);

	it('has a schema for every operation in the fixture set', () => {
		const registered = Object.keys(HoneybadgerEndpointOutputSchemas).sort();
		const deletes = registered.filter((name) => name.endsWith('.delete'));
		const covered = SPEC_RESPONSES.map((entry) => entry.operation).sort();

		// A delete answers 204 with no body, so it is built by the endpoint rather
		// than parsed from a provider document.
		expect(covered).toEqual(
			registered.filter((name) => !deletes.includes(name)).sort(),
		);
	});
});

describe('output schemas reject a wrong-shaped body', () => {
	it('refuses a list where a single resource belongs', () => {
		expect(
			HoneybadgerEndpointOutputSchemas['projects.get'].safeParse({
				data: [],
			}).success,
		).toBe(false);
	});

	it('refuses a missing envelope', () => {
		expect(
			HoneybadgerEndpointOutputSchemas['faults.list'].safeParse({}).success,
		).toBe(false);
	});

	it('refuses a fault whose message is a number', () => {
		const parsed = HoneybadgerEndpointOutputSchemas['faults.list'].safeParse({
			data: [
				{
					id: '1',
					project_id: 'p',
					message: 42,
					created_at: '2026-01-01T00:00:00Z',
					links: { web: 'https://app.honeybadger.io/x' },
				},
			],
		});
		expect(parsed.success).toBe(false);
	});
});
