import { readFileSync } from 'node:fs';
import { buildSchema, parse, validate } from 'graphql';
import { operations } from './endpoints/operations';

// Schema printed from an unauthenticated introspection of https://api.fly.io/graphql
// on 2026-11-15. fly-go's checked-in schema.graphql lags the live API (it still lists
// delegated WireGuard tokens and AddOn.hostname, which api.fly.io no longer serves).
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
	it('covers all 31 registered documents', () => {
		expect(documents).toHaveLength(31);
	});
	it.each(documents)('$path validates against the live schema', ({ query }) => {
		expect(
			validate(schema, parse(query)).map((error) => error.message),
		).toEqual([]);
	});
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
