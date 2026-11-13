import { readFileSync } from 'node:fs';
import { buildSchema, parse, validate } from 'graphql';
import { operations } from './endpoints/operations';

// Unmodified Apache-2.0 schema from:
// https://github.com/superfly/fly-go/blob/494ae940b5bdaf7ed50d53ce01ed973915e268ce/schema.graphql
const schema = buildSchema(
	readFileSync(`${__dirname}/fly-schema.graphql.txt`, 'utf8'),
);
const documents = Object.entries(operations).flatMap(([group, entries]) =>
	Object.entries(entries).map(([name, definition]) => ({
		path: `${group}.${name}`,
		query: definition.query,
	})),
);

describe('Fly GraphQL contract', () => {
	it('covers all 34 registered documents', () => {
		expect(documents).toHaveLength(34);
	});
	it.each(documents)(
		'$path validates against the pinned schema',
		({ query }) => {
			expect(
				validate(schema, parse(query)).map((error) => error.message),
			).toEqual([]);
		},
	);
	it('rejects a misspelled field and an invalid variable type', () => {
		expect(
			validate(schema, parse('query { userOnlyTokenn }')),
		).not.toHaveLength(0);
		expect(
			validate(
				schema,
				parse('query ($name: Int!) { app(name: $name) { id } }'),
			),
		).not.toHaveLength(0);
	});
});
