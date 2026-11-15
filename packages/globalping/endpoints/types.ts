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

export const CreateInputSchema = z.object({
	type: z.enum(['ping', 'traceroute', 'dns', 'mtr', 'http']),
	target: z.string().min(1),
	limit: z.number().int().min(1).max(500).optional(),
});

export const GetInputSchema = z.object({
	id: z.string().min(1),
});

export const MeasurementResponseSchema = z.object({
	measurement: GlobalpingMeasurementEntity,
});

export type EmptyInput = z.infer<typeof EmptyInputSchema>;
export type ProbeListResponse = z.infer<typeof ProbeListResponseSchema>;
export type LimitResponse = z.infer<typeof LimitResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type CreateInput = z.infer<typeof CreateInputSchema>;
export type GetInput = z.infer<typeof GetInputSchema>;
export type MeasurementResponse = z.infer<typeof MeasurementResponseSchema>;

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
