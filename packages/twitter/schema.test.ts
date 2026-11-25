import { z } from 'zod';
import { TwitterManifestSchema, twitterOperations } from './endpoints/manifest';
import {
	getTwitterInputSchema,
	getTwitterOutputSchema,
	twitterInputFields,
} from './endpoints/openapi-schema';
import { TWITTER_OPERATION_IDS } from './endpoints/operation-types';
import {
	TweetsCreateInputSchema,
	TweetsCreateReplyInputSchema,
} from './endpoints/tweets';
import { TwitterEndpointInputSchemas } from './endpoints/types';
import manifestJson from './twitter-manifest.json';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	displayName: string;
	domain: string;
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

describe('twitter-manifest.json', () => {
	it('parses with TwitterManifestSchema', () => {
		expect(() => TwitterManifestSchema.parse(manifestJson)).not.toThrow();
	});

	it('has 257 operations from X’s spec, ids unique and matching the generated types', () => {
		const ids = twitterOperations.map((o) => o.id);
		expect(ids).toHaveLength(257);
		expect(new Set(ids).size).toBe(ids.length);
		expect([...ids].sort()).toEqual([...TWITTER_OPERATION_IDS].sort());
	});

	it('uses api.x.com routes under /2 and leaves the streams out', () => {
		const parsed = TwitterManifestSchema.parse(manifestJson);
		expect(parsed.source).toBe('https://api.x.com/2/openapi.json');
		for (const operation of twitterOperations) {
			expect(operation.path.startsWith('/2/')).toBe(true);
			expect(operation.path).not.toMatch(/\/stream$/);
		}
		const skipped = Object.keys(parsed.skipped);
		expect(skipped).toContain('GET /2/tweets/search/stream');
		expect(skipped).toContain('GET /2/tweets/sample/stream');
		expect(skipped).toHaveLength(16);
	});

	it('builds an input and output schema for every operation', () => {
		for (const id of TWITTER_OPERATION_IDS) {
			expect([id, getTwitterInputSchema(id)]).toEqual([
				id,
				expect.any(z.ZodType),
			]);
			expect([id, getTwitterOutputSchema(id)]).toEqual([
				id,
				expect.any(z.ZodType),
			]);
			expect(TwitterEndpointInputSchemas[id]).toBe(getTwitterInputSchema(id));
		}
	});

	it('marks every path parameter as required and in the path', () => {
		for (const operation of twitterOperations) {
			const placeholders = [...operation.path.matchAll(/\{([^}]+)\}/g)].map(
				(m) => m[1] as string,
			);
			const fields = twitterInputFields(operation.id);
			const required = Array.isArray(operation.input.required)
				? (operation.input.required as string[])
				: [];
			for (const name of placeholders) {
				expect([operation.id, fields.find((f) => f.name === name)?.in]).toEqual(
					[operation.id, 'path'],
				);
				expect([operation.id, name, required.includes(name)]).toEqual([
					operation.id,
					name,
					true,
				]);
			}
			// And the input schema refuses a call without them.
			if (placeholders.length > 0) {
				expect([
					operation.id,
					getTwitterInputSchema(operation.id).safeParse({}).success,
				]).toEqual([operation.id, false]);
			}
		}
	});

	it('takes media as a file input sent base64', () => {
		const media = twitterInputFields('media.upload.single').find(
			(f) => f.name === 'media',
		);
		expect(media).toEqual({ name: 'media', in: 'body', base64: true });
	});

	it('parses responses leniently: unknown fields kept, nulls allowed', () => {
		const out = getTwitterOutputSchema('users.me').parse({
			data: { id: '1', name: null, username: 'a', brand_new_field: 1 },
		}) as { data: { brand_new_field: number } };
		expect(out.data.brand_new_field).toBe(1);
	});
});

describe('plugin-docs.yaml', () => {
	it('names X and its domain for the icon', () => {
		expect(docs.displayName).toBe('X (Twitter)');
		expect(docs.domain).toBe('x.com');
	});

	it('has one example per operation and each parses with its input schema', () => {
		const ids = [
			...TWITTER_OPERATION_IDS,
			'tweets.create',
			'tweets.createReply',
		];
		expect(Object.keys(docs.apiExamples).sort()).toEqual([...ids].sort());
		for (const id of TWITTER_OPERATION_IDS) {
			const result = getTwitterInputSchema(id).safeParse(
				docs.apiExamples[id]!.args,
			);
			expect([
				id,
				result.success,
				result.success ? '' : result.error.message,
			]).toEqual([id, true, '']);
		}
		expect(
			TweetsCreateInputSchema.safeParse(docs.apiExamples['tweets.create']!.args)
				.success,
		).toBe(true);
		expect(
			TweetsCreateReplyInputSchema.safeParse(
				docs.apiExamples['tweets.createReply']!.args,
			).success,
		).toBe(true);
	});
});

describe('string checks', () => {
	it('counts characters, not UTF-16 units, against length limits', () => {
		const schema = getTwitterInputSchema('users.search');
		// 50 supplementary-plane letters: 100 UTF-16 units, 50 characters.
		const fifty = '𝐀'.repeat(50);
		expect(schema.safeParse({ query: fifty }).success).toBe(true);
		expect(schema.safeParse({ query: `${fifty}𝐀` }).success).toBe(false);
		expect(schema.safeParse({ query: 'a'.repeat(50) }).success).toBe(true);
		expect(schema.safeParse({ query: 'a'.repeat(51) }).success).toBe(false);
	});

	it("reads the spec's \\x{FFFF} code points as JavaScript does", () => {
		expect(
			getTwitterInputSchema('account.ensure').safeParse({ metadata: 'yearly' })
				.success,
		).toBe(true);
	});
});
