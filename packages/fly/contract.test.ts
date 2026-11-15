import { readFileSync } from 'node:fs';
import {
	buildSchema,
	getNamedType,
	isInputObjectType,
	Kind,
	parse,
	typeFromAST,
	validate,
} from 'graphql';
import type { z } from 'zod';
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
		input: definition.input as z.ZodObject,
	})),
);
// Mutations send one `$input` variable. GraphQL rejects unknown fields when it coerces
// variable values, which document validation does not check, so every key the Zod input
// accepts must exist on the GraphQL input type.
const mutations = documents.flatMap(({ path, query, input }) => {
	const definition = parse(query).definitions[0];
	if (definition?.kind !== Kind.OPERATION_DEFINITION) return [];
	if (definition.operation !== 'mutation') return [];
	const variable = definition.variableDefinitions?.[0];
	if (!variable) return [];
	const type = getNamedType(typeFromAST(schema, variable.type as never));
	const inner = input.shape.input as z.ZodObject;
	return [{ path, type, keys: Object.keys(inner.shape) }];
});

describe('Fly GraphQL contract', () => {
	it('covers all 31 registered documents', () => {
		expect(documents).toHaveLength(31);
	});
	it.each(documents)('$path validates against the live schema', ({ query }) => {
		expect(
			validate(schema, parse(query)).map((error) => error.message),
		).toEqual([]);
	});
	it('checks every mutation input', () => {
		expect(mutations.length).toBeGreaterThan(10);
	});
	it.each(mutations)(
		'$path accepts only fields of its GraphQL input type',
		({ type, keys }) => {
			if (!isInputObjectType(type)) throw new Error('Expected an input type');
			const fields = Object.keys(type.getFields());
			expect(keys.filter((key) => !fields.includes(key))).toEqual([]);
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
