import { z } from 'zod';
import type { ModalRuntime } from '../client';
import { createPickleCodec, encodeDictKey, toJsonValue } from '../codec';
import {
	createdBeforeField,
	defineOperation,
	environmentField,
	isoFromSeconds,
	limitField,
	OkSchema,
	pagedList,
} from './shared';

// The JS SDK has no Dict class: these go through its gRPC client, with keys
// and values pickled the way Modal's Python client does (see codec.ts).

const dictNameField = z.string().min(1).describe('Dict name.');
const DictKeySchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe(
		'Key: a string, number, boolean or null (the same key in Python matches).',
	);

const DictInput = z.object({
	environment: environmentField,
	name: dictNameField,
});

async function dictId(runtime: ModalRuntime, name: string, create = false) {
	try {
		const response = await runtime.client.cpClient.dictGetOrCreate({
			deploymentName: name,
			environmentName: runtime.client.environmentName(),
			// CREATE_IF_MISSING : lookup only
			objectCreationType: create ? 1 : 0,
		});
		return response.dictId;
	} catch (error) {
		if ((error as { code?: number }).code === 5) {
			throw new runtime.sdk.NotFoundError(`Dict '${name}' not found`);
		}
		throw error;
	}
}

export const createDict = defineOperation({
	group: 'dicts',
	name: 'create',
	description:
		'Get a named Dict (a key/value store shared by sandboxes and functions), creating it if it does not exist.',
	riskLevel: 'write',
	input: DictInput,
	output: z.object({ dictId: z.string(), name: z.string() }),
	run: async (runtime, input) => ({
		dictId: await dictId(runtime, input.name, true),
		name: input.name,
	}),
});

export const listDicts = defineOperation({
	group: 'dicts',
	name: 'list',
	description: 'List the named Dicts in an environment, newest first.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		limit: limitField(1000, 100),
		createdBefore: createdBeforeField,
	}),
	output: z.object({
		dicts: z.array(
			z.object({
				dictId: z.string(),
				name: z.string(),
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
			}),
		),
		nextCreatedBefore: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const environmentName = runtime.client.environmentName();
		const { items, nextCreatedBefore } = await pagedList(
			async (pagination) =>
				(
					await runtime.client.cpClient.dictList({
						environmentName,
						pagination,
					})
				).dicts,
			input.limit,
			input.createdBefore,
		);
		return {
			dicts: items.map((item) => ({
				dictId: item.dictId,
				name: item.name,
				createdAt: isoFromSeconds(item.createdAt),
				createdBy: item.metadata?.creationInfo?.createdBy || undefined,
			})),
			nextCreatedBefore,
		};
	},
});

export const deleteDict = defineOperation({
	group: 'dicts',
	name: 'delete',
	description: 'Delete a Dict and all its entries. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: DictInput.extend({
		allowMissing: z
			.boolean()
			.optional()
			.describe('Succeed even if the Dict does not exist.'),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		let id: string;
		try {
			id = await dictId(runtime, input.name);
		} catch (error) {
			if (input.allowMissing && error instanceof runtime.sdk.NotFoundError) {
				return { ok: true as const };
			}
			throw error;
		}
		await runtime.client.cpClient.dictDelete({ dictId: id });
		return { ok: true as const };
	},
});

const FoundValueSchema = z.object({
	found: z.boolean(),
	value: z.unknown().optional(),
});

export const getDictValue = defineOperation({
	group: 'dicts',
	name: 'get',
	description: 'Read the value stored under a key.',
	riskLevel: 'read',
	input: DictInput.extend({ key: DictKeySchema }),
	output: FoundValueSchema,
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const response = await runtime.client.cpClient.dictGet({
			dictId: id,
			key: encodeDictKey(input.key),
		});
		if (!response.found || !response.value) return { found: false };
		const codec = createPickleCodec(runtime.sdk);
		return {
			found: true,
			value: toJsonValue(await codec.decode(response.value)),
		};
	},
});

export const putDictValue = defineOperation({
	group: 'dicts',
	name: 'put',
	description:
		'Store a JSON value under a key. With skipIfExists an existing key is left alone.',
	riskLevel: 'write',
	input: DictInput.extend({
		key: DictKeySchema,
		value: z.unknown(),
		skipIfExists: z.boolean().optional(),
	}),
	output: z.object({ created: z.boolean() }),
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const codec = createPickleCodec(runtime.sdk);
		const response = await runtime.client.cpClient.dictUpdate({
			dictId: id,
			updates: [
				{
					key: encodeDictKey(input.key),
					value: await codec.encode(input.value),
				},
			],
			ifNotExists: input.skipIfExists ?? false,
		});
		return { created: response.created };
	},
});

export const updateDict = defineOperation({
	group: 'dicts',
	name: 'update',
	description: 'Store several key/value pairs at once.',
	riskLevel: 'write',
	input: DictInput.extend({
		entries: z
			.array(z.object({ key: DictKeySchema, value: z.unknown() }))
			.min(1)
			.max(1000),
	}),
	output: z.object({ count: z.number() }),
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const codec = createPickleCodec(runtime.sdk);
		const updates = [];
		for (const entry of input.entries) {
			updates.push({
				key: encodeDictKey(entry.key),
				value: await codec.encode(entry.value),
			});
		}
		await runtime.client.cpClient.dictUpdate({
			dictId: id,
			updates,
			ifNotExists: false,
		});
		return { count: updates.length };
	},
});

export const popDictValue = defineOperation({
	group: 'dicts',
	name: 'pop',
	description: 'Remove a key and return its value.',
	riskLevel: 'write',
	input: DictInput.extend({ key: DictKeySchema }),
	output: FoundValueSchema,
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const response = await runtime.client.cpClient.dictPop({
			dictId: id,
			key: encodeDictKey(input.key),
		});
		if (!response.found || !response.value) return { found: false };
		const codec = createPickleCodec(runtime.sdk);
		return {
			found: true,
			value: toJsonValue(await codec.decode(response.value)),
		};
	},
});

export const containsDictKey = defineOperation({
	group: 'dicts',
	name: 'contains',
	description: 'Whether a key is in the Dict.',
	riskLevel: 'read',
	input: DictInput.extend({ key: DictKeySchema }),
	output: z.object({ found: z.boolean() }),
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const response = await runtime.client.cpClient.dictContains({
			dictId: id,
			key: encodeDictKey(input.key),
		});
		return { found: response.found };
	},
});

export const lenDict = defineOperation({
	group: 'dicts',
	name: 'len',
	description: 'Number of entries in the Dict.',
	riskLevel: 'read',
	input: DictInput,
	output: z.object({ length: z.number() }),
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const response = await runtime.client.cpClient.dictLen({ dictId: id });
		return { length: response.len };
	},
});

export const dictItems = defineOperation({
	group: 'dicts',
	name: 'items',
	description:
		'Keys and values in the Dict. Keys of types JSON has no form for (tuples, bytes) come back as strings.',
	riskLevel: 'read',
	input: DictInput.extend({
		keysOnly: z.boolean().optional().describe('Return keys without values.'),
		limit: limitField(10_000, 1000),
	}),
	output: z.object({
		entries: z.array(
			z.object({ key: z.unknown(), value: z.unknown().optional() }),
		),
		truncated: z.boolean(),
	}),
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		const codec = createPickleCodec(runtime.sdk);
		const stream = runtime.client.cpClient.dictContents({
			dictId: id,
			keys: true,
			values: !input.keysOnly,
		});
		const entries: { key: unknown; value?: unknown }[] = [];
		let truncated = false;
		for await (const entry of stream) {
			if (entries.length >= input.limit) {
				truncated = true;
				break;
			}
			entries.push({
				key: toJsonValue(await codec.decode(entry.key)),
				value:
					input.keysOnly || !entry.value?.length
						? undefined
						: toJsonValue(await codec.decode(entry.value)),
			});
		}
		return { entries, truncated };
	},
});

export const clearDict = defineOperation({
	group: 'dicts',
	name: 'clear',
	description: 'Remove every entry from the Dict. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: DictInput,
	output: OkSchema,
	run: async (runtime, input) => {
		const id = await dictId(runtime, input.name);
		await runtime.client.cpClient.dictClear({ dictId: id });
		return { ok: true as const };
	},
});

export const dictsOperations = [
	createDict,
	listDicts,
	deleteDict,
	getDictValue,
	putDictValue,
	updateDict,
	popDictValue,
	containsDictKey,
	lenDict,
	dictItems,
	clearDict,
] as const;
