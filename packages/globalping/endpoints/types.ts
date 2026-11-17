import { z } from 'zod';
import {
	GlobalpingHealthEntity,
	GlobalpingLimitEntity,
	GlobalpingMeasurementEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});

export const ProbeSchema = z.object({
	version: z.string().optional(),
	continent: z.string().optional(),
	region: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	network: z.string().optional(),
	asn: z.number().optional(),
});

export const ProbeListResponseSchema = z.object({
	probes: z.array(ProbeSchema),
});

export const LimitResponseSchema = z.object({
	limit: GlobalpingLimitEntity,
});

export const HealthResponseSchema = z.object({
	health: GlobalpingHealthEntity,
});

const LocationSchema = z
	.object({
		magic: z.string().min(1).optional(),
		continent: z.string().length(2).optional(),
		region: z.string().min(1).optional(),
		country: z.string().length(2).optional(),
		state: z.string().min(1).optional(),
		city: z.string().min(1).optional(),
		asn: z.number().int().positive().optional(),
		network: z.string().min(1).optional(),
		tags: z.array(z.string().min(1)).optional(),
		limit: z.number().int().min(1).max(500).optional(),
	})
	.strict();

/** Options for every measurement type; Globalping rejects ones that don't fit the chosen type with a 400. */
const MeasurementOptionsSchema = z
	.object({
		packets: z.number().int().min(1).max(16).optional(),
		protocol: z
			.enum(['ICMP', 'TCP', 'UDP', 'HTTP', 'HTTPS', 'HTTP2'])
			.optional(),
		port: z.number().int().min(0).max(65535).optional(),
		ipVersion: z.union([z.literal(4), z.literal(6)]).optional(),
		query: z
			.object({ type: z.string().min(1) })
			.strict()
			.optional(),
		resolver: z.string().min(1).optional(),
		trace: z.boolean().optional(),
		request: z
			.object({
				host: z.string().min(1).optional(),
				path: z.string().optional(),
				query: z.string().optional(),
				method: z.enum(['HEAD', 'GET', 'OPTIONS']).optional(),
				headers: z.record(z.string(), z.string()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export const CreateInputSchema = z.object({
	type: z.enum(['ping', 'traceroute', 'dns', 'mtr', 'http']),
	target: z.string().min(1),
	/** Where to run from: a list of location filters, or the id of an earlier measurement to reuse its probes. */
	locations: z
		.union([z.array(LocationSchema).min(1), z.string().min(1)])
		.optional(),
	limit: z.number().int().min(1).max(500).optional(),
	timeout: z.number().int().min(5).max(30).optional(),
	measurementOptions: MeasurementOptionsSchema.optional(),
});

export const GetInputSchema = z.object({
	id: z.string().min(1),
});

export const ProbeResultSchema = z.object({
	probe: z.object({
		continent: z.string().optional(),
		region: z.string().optional(),
		country: z.string().optional(),
		state: z.string().nullable().optional(),
		city: z.string().optional(),
		asn: z.number().optional(),
		network: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		tags: z.array(z.string()).optional(),
	}),
	result: z
		.object({
			status: z.string(),
			rawOutput: z.string().nullable().optional(),
			resolvedAddress: z.string().nullable().optional(),
			resolvedHostname: z.string().nullable().optional(),
			statusCode: z.number().optional(),
			statusCodeName: z.string().optional(),
			stats: z.record(z.string(), z.number().nullable()).optional(),
		})
		// unknown: timings, hops, answers, headers and tls differ by measurement type; passed through as Globalping sends them.
		.catchall(z.unknown()),
});

export const MeasurementResponseSchema = z.object({
	measurement: GlobalpingMeasurementEntity,
	target: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	/** One entry per probe. Only on measurements.get; tests still running have status in-progress. */
	results: z.array(ProbeResultSchema).optional(),
});

export type EmptyInput = z.infer<typeof EmptyInputSchema>;
export type ProbeListResponse = z.infer<typeof ProbeListResponseSchema>;
export type LimitResponse = z.infer<typeof LimitResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type CreateInput = z.infer<typeof CreateInputSchema>;
export type GetInput = z.infer<typeof GetInputSchema>;
export type MeasurementResponse = z.infer<typeof MeasurementResponseSchema>;
export type ProbeResult = z.infer<typeof ProbeResultSchema>;

export const GlobalpingEndpointInputSchemas = {
	'probes.list': EmptyInputSchema,
	'limits.get': EmptyInputSchema,
	'health.get': EmptyInputSchema,
	'measurements.create': CreateInputSchema,
	'measurements.get': GetInputSchema,
};

export const GlobalpingEndpointOutputSchemas = {
	'probes.list': ProbeListResponseSchema,
	'limits.get': LimitResponseSchema,
	'health.get': HealthResponseSchema,
	'measurements.create': MeasurementResponseSchema,
	'measurements.get': MeasurementResponseSchema,
};
