import type { RawWebhookRequest } from 'corsair/core';
import { bannerbear, bannerbearEndpointSchemas } from './index';
import {
	createBannerbearImageCompletedMatch,
	createBannerbearVideoCompletedMatch,
} from './webhooks/types';

describe('Bannerbear plugin registry', () => {
	const plugin = bannerbear();

	const endpointTree = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;

	function nestedPaths(): string[] {
		const paths: string[] = [];
		for (const [group, leaves] of Object.entries(endpointTree)) {
			for (const leaf of Object.keys(leaves)) {
				paths.push(`${group}.${leaf}`);
			}
		}
		return paths.sort();
	}

	it('registers all 38 operations in the endpoint tree', () => {
		const paths = nestedPaths();
		expect(paths).toHaveLength(38);
	});

	it('keeps the endpoint tree, schemas, and metadata in lockstep', () => {
		const paths = nestedPaths();
		expect(Object.keys(bannerbearEndpointSchemas).sort()).toEqual(paths);
		expect(
			Object.keys(plugin.endpointMeta as Record<string, unknown>).sort(),
		).toEqual(paths);
	});

	it('defines input and output schemas for every endpoint', () => {
		for (const [path, schema] of Object.entries(bannerbearEndpointSchemas)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});

	it('defines metadata with riskLevel and description for every endpoint', () => {
		const metaMap = (plugin.endpointMeta ?? {}) as Record<
			string,
			{ riskLevel?: string; description?: string }
		>;
		for (const [_path, meta] of Object.entries(metaMap)) {
			expect(['read', 'write']).toContain(meta.riskLevel);
			expect(typeof meta.description).toBe('string');
			expect(meta.description?.length).toBeGreaterThan(0);
		}
	});
});

describe('Bannerbear webhooks', () => {
	it('matches image completed webhook payloads', () => {
		const matcher = createBannerbearImageCompletedMatch();

		const validImagePayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'completed',
				files: { png: 'https://cdn.bannerbear.com/sample.png' },
			}),
		};

		const pendingPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'pending',
				files: null,
			}),
		};

		const videoPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'vid_123',
				status: 'completed',
				video_url: 'https://cdn.bannerbear.com/sample.mp4',
			}),
		};

		expect(matcher(validImagePayload)).toBe(true);
		expect(matcher(pendingPayload)).toBe(false);
		expect(matcher(videoPayload)).toBe(false);
	});

	it('matches video completed webhook payloads', () => {
		const matcher = createBannerbearVideoCompletedMatch();

		const validVideoPayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'vid_123',
				status: 'completed',
				video_url: 'https://cdn.bannerbear.com/sample.mp4',
			}),
		};

		const imagePayload: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				uid: 'img_123',
				status: 'completed',
				files: { png: 'https://cdn.bannerbear.com/sample.png' },
			}),
		};

		expect(matcher(validVideoPayload)).toBe(true);
		expect(matcher(imagePayload)).toBe(false);
	});
});
