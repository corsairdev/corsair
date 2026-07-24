import { z } from 'zod';

const DatasetReference = z.object({
	datasetId: z.string(),
	projectId: z.string().optional(),
});

const TableReference = z.object({
	projectId: z.string().optional(),
	datasetId: z.string(),
	tableId: z.string(),
});

const RoutineReference = z.object({
	projectId: z.string().optional(),
	datasetId: z.string(),
	routineId: z.string(),
});

const JobReference = z.object({
	projectId: z.string().optional(),
	jobId: z.string().optional(),
	location: z.string().optional(),
});

const ErrorProto = z.object({
	reason: z.string().optional(),
	location: z.string().optional(),
	message: z.string().optional(),
});

export const GoogleBigqueryDataset = z.object({
	id: z.string(),
	datasetReference: DatasetReference,
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	selfLink: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});
export type GoogleBigqueryDataset = z.infer<typeof GoogleBigqueryDataset>;

export const GoogleBigqueryTable = z.object({
	id: z.string(),
	tableReference: TableReference,
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	location: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	numRows: z.string().optional(),
	numBytes: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	expirationTime: z.string().optional(),
	selfLink: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});
export type GoogleBigqueryTable = z.infer<typeof GoogleBigqueryTable>;

export const GoogleBigqueryJob = z.object({
	id: z.string(),
	jobReference: JobReference.optional(),
	kind: z.string().optional(),
	// Job statistics vary heavily by job type (query/load/extract/copy) and contain
	// deeply nested, type-specific fields we don't model individually.
	statistics: z.record(z.string(), z.unknown()).optional(),
	status: z
		.object({
			state: z.string().optional(),
			errorResult: ErrorProto.optional(),
			errors: z.array(ErrorProto).optional(),
		})
		.optional(),
	selfLink: z.string().optional(),
	user_email: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});
export type GoogleBigqueryJob = z.infer<typeof GoogleBigqueryJob>;

export const GoogleBigqueryRoutine = z.object({
	id: z.string(),
	routineReference: RoutineReference,
	routineType: z.string().optional(),
	language: z.string().optional(),
	description: z.string().optional(),
	definitionBody: z.string().optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});
export type GoogleBigqueryRoutine = z.infer<typeof GoogleBigqueryRoutine>;

export const GoogleBigqueryModel = z.object({
	id: z.string(),
	modelReference: z.object({
		projectId: z.string().optional(),
		datasetId: z.string(),
		modelId: z.string(),
	}),
	modelType: z.string().optional(),
	friendlyName: z.string().optional(),
	description: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
	creationTime: z.string().optional(),
	lastModifiedTime: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});
export type GoogleBigqueryModel = z.infer<typeof GoogleBigqueryModel>;
