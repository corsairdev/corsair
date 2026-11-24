import { inkboxDefinitions, inkboxOperations } from './endpoints/manifest';
import { getInkboxInputSchema } from './endpoints/openapi-schema';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	displayName: string;
	description: string;
	examples?: Record<
		string,
		// `unknown` because example args are free-form YAML values.
		{ path: string; args?: Record<string, unknown> }
	>;
	// `unknown` because example args are free-form YAML values.
	apiExamples?: Record<string, { args?: Record<string, unknown> }>;
};

// `unknown` because the walk covers raw JSON Schema documents and example values.
function resolve(schema: unknown): Record<string, unknown> {
	let current = schema;
	for (let depth = 0; depth < 20; depth++) {
		// `unknown` because the walk covers raw JSON Schema documents.
		const record = current as Record<string, unknown> | undefined;
		if (!record || typeof record.$ref !== 'string') break;
		current = inkboxDefinitions[record.$ref];
	}
	// `unknown` because the walk covers raw JSON Schema documents.
	return (current ?? {}) as Record<string, unknown>;
}

/** Every branch of a union or intersection, resolved. */
// `unknown` because the walk covers raw JSON Schema documents.
function branches(schema: unknown): Record<string, unknown>[] {
	const resolved = resolve(schema);
	const members = [
		// `unknown` because union members are raw JSON Schema documents.
		...((resolved.oneOf as unknown[]) ?? []),
		...((resolved.anyOf as unknown[]) ?? []),
		...((resolved.allOf as unknown[]) ?? []),
	];
	return [resolved, ...members.flatMap(branches)];
}

/** Paths of keys in `value` that no schema branch declares (maps excepted). */
// `unknown` because example values are free-form YAML.
function unknownKeys(value: unknown, schema: unknown, path: string): string[] {
	const options = branches(schema);
	if (Array.isArray(value)) {
		const items = options.find((o) => o.items !== undefined)?.items;
		return value.flatMap((item, i) => unknownKeys(item, items, `${path}.${i}`));
	}
	if (typeof value !== 'object' || value === null) return [];
	// `unknown` because declared property schemas are raw JSON Schema documents.
	const declared = new Map<string, unknown>();
	for (const option of options) {
		for (const [key, inner] of Object.entries(
			// `unknown` because declared property schemas are raw JSON Schema documents.
			(option.properties as Record<string, unknown>) ?? {},
		)) {
			if (!declared.has(key)) declared.set(key, inner);
		}
	}
	const map = options.find(
		(o) => typeof o.additionalProperties === 'object' && o.additionalProperties,
	)?.additionalProperties;
	if (declared.size === 0) {
		// A map takes any key, but its values still follow the map's schema
		// (a metadata map's values, say). Untyped: nothing to check.
		return map
			? Object.entries(value).flatMap(([key, inner]) =>
					unknownKeys(inner, map, `${path}.${key}`),
				)
			: [];
	}
	return Object.entries(value).flatMap(([key, inner]) =>
		declared.has(key)
			? unknownKeys(inner, declared.get(key), `${path}.${key}`)
			: map
				? unknownKeys(inner, map, `${path}.${key}`)
				: [`${path}.${key}`],
	);
}

describe('plugin-docs.yaml', () => {
	it('names the provider and says what the plugin covers', () => {
		expect(docs.displayName).toBe('Inkbox');
		expect(docs.description).toMatch(/454 operations/);
	});

	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			inkboxOperations.map((operation) => operation.id).sort(),
		);
	});

	it.each(inkboxOperations.map((operation) => operation.id))(
		'%s apiExample passes its input schema',
		(id) => {
			const result = getInkboxInputSchema(id).safeParse(
				docs.apiExamples?.[id]?.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(inkboxOperations.map((operation) => operation.id))(
		'%s apiExample uses only fields the operation takes, nested ones too',
		(id) => {
			// Input schemas keep unknown keys (Inkbox may add fields first), so a
			// misspelt example would still parse: check every name here.
			const operation = inkboxOperations.find((o) => o.id === id);
			expect(
				unknownKeys(
					docs.apiExamples?.[id]?.args ?? {},
					operation?.input,
					'args',
				),
			).toEqual([]);
		},
	);

	it('catches a misspelt field inside a nested object', () => {
		const send = inkboxOperations.find((o) => o.id === 'mail.messages.send');
		const args = {
			email_address: 'support-agent@inkboxmail.com',
			subject: 'Hi',
			recipients: { to: ['ada@example.com'], ccc: ['bob@example.com'] },
		};
		expect(unknownKeys(args, send?.input, 'args')).toEqual([
			'args.recipients.ccc',
		]);
	});

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getInkboxInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
