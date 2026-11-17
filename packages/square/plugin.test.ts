import { z } from 'zod';
import {
	square,
	squareAuthConfig,
	squareEndpointMeta,
	squareEndpointSchemas,
	squareReplayableOperations,
} from './index';

// unknown: only the function's existence is checked, not what it returns.
type Leaf = (...args: never[]) => unknown;

/** Dot paths of every function in the endpoint tree. */
function endpointPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		return value && typeof value === 'object' ? endpointPaths(value, path) : [];
	});
}

const plugin = square();
const meta = squareEndpointMeta;
const paths = endpointPaths(plugin.endpoints ?? {}).sort();

// Deletes and ends: no way back through the API.
const IRREVERSIBLE = [
	'cards.disable',
	'catalog.delete',
	'customAttributeDefinitions.customer.delete',
	'customAttributeDefinitions.location.delete',
	'customAttributeDefinitions.merchant.delete',
	'customAttributes.customer.delete',
	'customAttributes.location.bulkDelete',
	'customAttributes.location.delete',
	'customAttributes.merchant.bulkDelete',
	'customAttributes.merchant.delete',
	'customerGroups.delete',
	'customers.bulkDelete',
	'customers.delete',
	'disputes.accept',
	'disputes.deleteEvidence',
	'disputes.submitEvidence',
	'invoices.cancel',
	'invoices.delete',
	'invoices.deleteAttachment',
	'paymentLinks.delete',
	'payments.cancel',
	'payments.cancelByIdempotencyKey',
	'payments.refund',
	'webhookSubscriptions.delete',
];

// R8: an operation that spends money, sends a message or can't be undone is
// destructive. These eight have a way back (a refund, a cancel, a new key, a
// later edit), so they are destructive without being irreversible.
const DESTRUCTIVE_WITH_UNDO = [
	'invoices.createAttachment',
	'invoices.publish',
	'invoices.update',
	'orders.pay',
	'payments.complete',
	'payments.create',
	'payments.update',
	'webhookSubscriptions.test',
] as const;

const DESTRUCTIVE = [...IRREVERSIBLE, ...DESTRUCTIVE_WITH_UNDO].sort();

const MONEY_MOVING = [
	'disputes.accept',
	'invoices.publish',
	'orders.pay',
	'payments.cancel',
	'payments.cancelByIdempotencyKey',
	'payments.complete',
	'payments.create',
	'payments.refund',
	'payments.update',
] as const;

// Square's invoice guides: after these calls Square emails or texts the
// customer, per the invoice's delivery_method. R8: sending a message is
// destructive.
const NOTIFIES_CUSTOMER = [
	'invoices.createAttachment',
	'invoices.deleteAttachment',
	'invoices.update',
] as const;
const NOTIFIES_CUSTOMER_FACT =
	"Notifies the customer by email or text message when the invoice's delivery_method is EMAIL or SMS; the API has no option to skip this.";

type Node = z.core.$ZodType;

/** Looks through optional, nullable and array wrappers to the object inside. */
function unwrap(node: Node): Node {
	if (node instanceof z.ZodOptional || node instanceof z.ZodNullable) {
		return unwrap(node.unwrap());
	}
	if (node instanceof z.ZodArray) return unwrap(node.element);
	return node;
}

/** The schema of the field at `path` below `schema`, or undefined when there is none. */
function fieldAt(schema: Node, path: string[]): Node | undefined {
	let node: Node | undefined = schema;
	for (const key of path) {
		const object: Node | undefined = node && unwrap(node);
		if (!(object instanceof z.ZodObject)) return undefined;
		node = object.shape[key];
	}
	return node;
}

/** True when the field may be left out, false when it is required, undefined when there is no such field. */
function isOptional(field: Node | undefined): boolean | undefined {
	return field && field._zod.optin === 'optional';
}

/**
 * Square shares one schema between create and update, so the fields only
 * creating needs are not in its required list. The plugin requires them on the
 * create operations (which is what these tables name) and on no other.
 */
const CREATE_ONLY: Array<{
	path: string[];
	fields: string[];
	create: string[];
	update: string[];
}> = [
	{
		path: ['invoice'],
		fields: ['order_id', 'payment_requests', 'accepted_payment_methods'],
		create: ['invoices.create'],
		update: ['invoices.update'],
	},
	{
		path: ['invoice', 'payment_requests'],
		fields: ['request_type', 'due_date'],
		create: ['invoices.create'],
		update: ['invoices.update'],
	},
	{
		path: ['custom_attribute_definition'],
		fields: ['key', 'schema'],
		create: [
			'customAttributeDefinitions.customer.create',
			'customAttributeDefinitions.location.create',
			'customAttributeDefinitions.merchant.create',
		],
		update: [
			'customAttributeDefinitions.customer.update',
			'customAttributeDefinitions.location.update',
			'customAttributeDefinitions.merchant.update',
		],
	},
];

const by = (level: string) =>
	Object.entries(meta)
		.filter(([, entry]) => entry.riskLevel === level)
		.map(([op]) => op)
		.sort();

describe('Square plugin definition', () => {
	it('has metadata and schemas for every endpoint, and nothing else', () => {
		expect(paths).toHaveLength(123);
		expect(Object.keys(meta).sort()).toEqual(paths);
		expect(Object.keys(squareEndpointSchemas).sort()).toEqual(paths);
		for (const { input, output } of Object.values(squareEndpointSchemas)) {
			expect(input).toBeDefined();
			expect(output).toBeDefined();
		}
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('classifies operations as the API inventory does', () => {
		expect(by('read')).toHaveLength(56);
		expect(by('write')).toHaveLength(35);
		expect(by('destructive')).toEqual(DESTRUCTIVE);
		expect(DESTRUCTIVE).toHaveLength(32);
	});

	it('marks irreversible only destructive operations', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => 'irreversible' in entry && entry.irreversible)
			.map(([op]) => op)
			.sort();
		expect(irreversible).toEqual(IRREVERSIBLE);
		for (const op of DESTRUCTIVE_WITH_UNDO) {
			expect('irreversible' in meta[op]).toBe(false);
		}
		// Each has a way back, so it is a write.
		expect(meta['customers.removeGroup'].riskLevel).toBe('write');
		expect('irreversible' in meta['customers.addGroup']).toBe(false);
		expect('irreversible' in meta['invoices.publish']).toBe(false);
		expect('irreversible' in meta['locations.create']).toBe(false);
		expect(
			'irreversible' in meta['webhookSubscriptions.updateSignatureKey'],
		).toBe(false);
	});

	it('says which operations move money, and only those', () => {
		const saying = Object.entries(meta)
			.filter(([, entry]) => entry.description.includes('Moves money.'))
			.map(([op]) => op)
			.sort();
		expect(saying).toEqual(MONEY_MOVING);
		// R8: spending money is destructive.
		for (const op of MONEY_MOVING) {
			expect(meta[op].riskLevel).toBe('destructive');
		}
		// Storing a card moves nothing; later charges are payments.create.
		expect(meta['cards.create'].riskLevel).toBe('write');
	});

	it('marks the invoice calls that notify the customer destructive, and says so', () => {
		const saying = Object.entries(meta)
			.filter(([, entry]) => entry.description.includes(NOTIFIES_CUSTOMER_FACT))
			.map(([op]) => op)
			.sort();
		expect(saying).toEqual(NOTIFIES_CUSTOMER);
		for (const op of NOTIFIES_CUSTOMER) {
			expect(meta[op].riskLevel).toBe('destructive');
		}
		// Deleting a draft notifies no one; cancelling already says it can't be undone.
		expect(meta['invoices.delete'].description).not.toContain('Notifies');
	});

	it('carries the facts an agent needs before it acts', () => {
		expect(meta['invoices.publish'].description).toContain(
			'Sends the invoice to the customer and may charge the card on file; cancel with invoices.cancel.',
		);
		expect(meta['locations.create'].description).toContain(
			"Locations can't be deleted; deactivate with locations.update.",
		);
		expect(
			meta['webhookSubscriptions.updateSignatureKey'].description,
		).toContain(
			'The old signature key stops verifying as soon as the new one is issued.',
		);
		expect(meta['payments.cancelByIdempotencyKey'].description).toContain(
			"Voids a payment by the idempotency_key of the payments.create call that made it; use when that call's response was lost.",
		);
	});

	it('says which invoice calls need the invoice current version', () => {
		const increments =
			'every committed change, including adding or removing an attachment, increments it.';
		for (const op of [
			'invoices.update',
			'invoices.publish',
			'invoices.cancel',
		] as const) {
			expect(meta[op].description).toContain(
				`Pass the invoice's current version; ${increments} Read it with invoices.get.`,
			);
		}
		// Square makes version optional on delete, so the wording is conditional.
		expect(meta['invoices.delete'].description).toContain(
			`If you pass version, it must be the current one; ${increments} Read it with invoices.get.`,
		);
	});

	it('names the idempotency_key on every operation that takes one', () => {
		for (const op of [
			'payments.create',
			'payments.update',
			'payments.refund',
			'orders.pay',
			'cards.create',
			'catalog.upsert',
			'disputes.createEvidenceText',
			'disputes.createEvidenceFile',
		] as const) {
			expect(meta[op].description).toContain('idempotency_key');
		}
	});

	it('replays after a 5xx only reads and the operations whose input requires idempotency_key', () => {
		const keyRequired = Object.entries(squareEndpointSchemas)
			.filter(
				([, { input }]) =>
					input !== undefined &&
					isOptional(fieldAt(input, ['idempotency_key'])) === false,
			)
			.map(([op]) => op);
		// The two upload operations carry the key in their JSON request part.
		expect(keyRequired).toContain('disputes.createEvidenceFile');
		expect(keyRequired).toHaveLength(9);
		expect([...squareReplayableOperations].sort()).toEqual(
			[...by('read'), ...keyRequired].sort(),
		);
	});

	it('requires the fields only creating needs on create operations, and on no others', () => {
		const inputs = Object.entries(squareEndpointSchemas);
		for (const { path, fields, create, update } of CREATE_ONLY) {
			for (const field of fields) {
				const where = (optional: boolean) =>
					inputs
						.filter(
							([, { input }]) =>
								input !== undefined &&
								isOptional(fieldAt(input, [...path, field])) === optional,
						)
						.map(([op]) => op)
						.sort();
				expect(where(false)).toEqual(create);
				expect(where(true)).toEqual(expect.arrayContaining(update));
			}
		}
		for (const { create } of CREATE_ONLY) {
			for (const op of create) expect(op).toMatch(/\.create$/);
		}
	});

	it('leaves delivery_method optional, since request_method can stand in', () => {
		const input = squareEndpointSchemas['invoices.create'].input;
		expect(input).toBeDefined();
		const delivery = input && fieldAt(input, ['invoice', 'delivery_method']);
		expect(isOptional(delivery)).toBe(true);
		expect(meta['invoices.create'].description).toContain(
			'the schema does not require delivery_method',
		);
	});

	it('offers an access token and OAuth, and needs nothing else', () => {
		expect(Object.keys(squareAuthConfig).sort()).toEqual([
			'api_key',
			'oauth_2',
		]);
		expect(squareAuthConfig.api_key.account).toEqual([]);
		expect(plugin.authConfig).toBe(squareAuthConfig);
		expect(plugin.endpointMeta).toBe(squareEndpointMeta);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://connect.squareup.com/oauth2/token',
		);
	});

	it.each([
		[undefined, 'https://connect.squareup.com'],
		['production', 'https://connect.squareup.com'],
		['sandbox', 'https://connect.squareupsandbox.com'],
	] as const)(
		'sends OAuth to the host of the %s environment',
		(environment, host) => {
			expect(square({ environment }).oauthConfig).toMatchObject({
				authUrl: `${host}/oauth2/authorize`,
				tokenUrl: `${host}/oauth2/token`,
			});
		},
	);

	it('keeps DEFAULT the last error handler whatever the caller adds', () => {
		const custom = square({
			errorHandlers: {
				NOT_FOUND_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('NOT_FOUND_ERROR');
		expect(names.indexOf('PAYMENT_METHOD_ERROR')).toBe(0);
	});

	it('lets the caller replace DEFAULT itself', () => {
		const DEFAULT = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const custom = square({ errorHandlers: { DEFAULT } });
		expect(custom.errorHandlers?.DEFAULT).toBe(DEFAULT);
	});

	it('exposes only functions at the leaves', () => {
		const leaves: Leaf[] = [];
		const walk = (node: object) => {
			for (const value of Object.values(node)) {
				if (typeof value === 'function') leaves.push(value);
				else if (value && typeof value === 'object') walk(value);
			}
		};
		walk(plugin.endpoints ?? {});
		expect(leaves).toHaveLength(123);
	});
});

type DocsExample = {
	path?: string;
	// unknown: example args are free-form YAML; each operation's schema checks them.
	args?: Record<string, unknown>;
};

// jest-yaml-transform turns the yaml into a plain object.
const docs: {
	examples?: Record<string, DocsExample>;
	apiExamples?: Record<string, DocsExample>;
} = require('./plugin-docs.yaml');

const inputSchemas = new Map(
	Object.entries(squareEndpointSchemas).map(([op, { input }]) => [op, input]),
);

const docsExamples: [string, DocsExample][] = [
	...Object.entries(docs.examples ?? {}).map(
		([name, example]): [string, DocsExample] => [
			`${name} (${example.path})`,
			example,
		],
	),
	...Object.entries(docs.apiExamples ?? {}).map(
		([op, example]): [string, DocsExample] => [op, { ...example, path: op }],
	),
];

describe('plugin-docs.yaml examples', () => {
	it('has an example for every operation', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(paths);
	});

	// Input schemas drop keys they don't list, so a misspelled key would still
	// parse: the parsed value must keep every key the example shows.
	it.each(docsExamples)(
		'%s parses against its input schema and keeps every key',
		(_, example) => {
			const input = example.path ? inputSchemas.get(example.path) : undefined;
			expect(input).toBeDefined();
			const result = input?.safeParse(example.args ?? {});
			expect(result?.error?.issues ?? []).toEqual([]);
			expect(result?.data).toEqual(example.args ?? {});
		},
	);

	// First bytes of each type Square accepts for uploads.
	const MAGIC: Record<string, string> = {
		'image/jpeg': 'ffd8ff',
		'image/png': '89504e47',
		'application/pdf': '25504446',
	};

	it.each(['disputes.createEvidenceFile', 'invoices.createAttachment'])(
		'%s example uploads a real file of its content_type',
		(op) => {
			const args = docs.apiExamples?.[op]?.args ?? {};
			const type = String(args.content_type);
			const bytes = Buffer.from(String(args.file_base64), 'base64');
			expect(MAGIC[type]).toBeDefined();
			expect(bytes.subarray(0, 4).toString('hex')).toMatch(
				new RegExp(`^${MAGIC[type]}`),
			);
			expect(String(args.filename)).toMatch(
				type === 'image/jpeg' ? /\.jpe?g$/ : /\.(png|pdf)$/,
			);
		},
	);
});
