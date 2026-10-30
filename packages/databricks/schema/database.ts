import { z } from 'zod';

export const DatabricksClusterEntity = z.object({
	cluster_id: z.string(),
	cluster_name: z.string(),
	spark_version: z.string().optional().nullable(),
	node_type_id: z.string().optional().nullable(),
	state: z.string().optional().nullable(),
	num_workers: z.number().optional().nullable(),
	created_at: z.string().optional().nullable(),
});
export type DatabricksClusterEntity = z.infer<typeof DatabricksClusterEntity>;

export const DatabricksJobEntity = z.object({
	job_id: z.number(),
	name: z.string(),
	creator_user_name: z.string().optional().nullable(),
	created_time: z.number().optional().nullable(),
});
export type DatabricksJobEntity = z.infer<typeof DatabricksJobEntity>;

export const DatabricksCatalogEntity = z.object({
	name: z.string(),
	metastore_id: z.string().optional().nullable(),
	owner: z.string().optional().nullable(),
	comment: z.string().optional().nullable(),
});
export type DatabricksCatalogEntity = z.infer<typeof DatabricksCatalogEntity>;

export const DatabricksWarehouseEntity = z.object({
	id: z.string(),
	name: z.string(),
	cluster_size: z.string().optional().nullable(),
	state: z.string().optional().nullable(),
	creator_name: z.string().optional().nullable(),
});
export type DatabricksWarehouseEntity = z.infer<
	typeof DatabricksWarehouseEntity
>;
