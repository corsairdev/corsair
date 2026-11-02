import { z } from 'zod';
import { introspectPluginForDocs } from '../core/inspect';
import type { CorsairPlugin, EndpointJob } from '../core/plugins';

const JOB: EndpointJob = {
	idPath: 'id',
	status: {
		op: 'predictions.get',
		idArg: 'predictionId',
		statusPath: 'status',
		done: ['succeeded'],
		failed: ['failed', 'canceled'],
	},
	cancel: { op: 'predictions.cancel', idArg: 'predictionId' },
};

const noop = async () => ({});

// The smallest plugin introspection reads: an endpoint tree, its meta and its schemas.
// Cast: a typed CorsairPlugin also needs a registered plugin id, keys, hooks and
// an endpoint tree built through the plugin factory. Introspection reads none of
// those, and the test needs a made-up id so no real plugin's meta leaks in.
const plugin = {
	id: 'jobdemo',
	endpoints: { predictions: { create: noop, get: noop, cancel: noop } },
	endpointMeta: {
		'predictions.create': { riskLevel: 'write', job: JOB },
		'predictions.get': { riskLevel: 'read' },
		'predictions.cancel': { riskLevel: 'write' },
	},
	endpointSchemas: {
		'predictions.create': {
			input: z.object({ version: z.string() }),
			output: z.object({ id: z.string() }),
		},
		'predictions.get': {
			input: z.object({ predictionId: z.string() }),
			output: z.object({ status: z.string() }),
		},
		'predictions.cancel': {
			input: z.object({ predictionId: z.string() }),
			output: z.object({ status: z.string() }),
		},
	},
} as unknown as CorsairPlugin;

describe('a declared job in the docs introspection', () => {
	it('rides on the operation that starts it, and nowhere else', () => {
		const result = introspectPluginForDocs([plugin], 'jobdemo');
		if (!result.ok) throw new Error(result.error);
		const byPath = new Map(result.data.api.map((ep) => [ep.shortPath, ep]));
		expect(byPath.get('predictions.create')?.job).toEqual(JOB);
		expect(byPath.get('predictions.get')).not.toHaveProperty('job');
		expect(byPath.get('predictions.cancel')).not.toHaveProperty('job');
	});
});
