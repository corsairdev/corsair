import { z } from 'zod';

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * Project record from GET /api/v2/projects/{projectId}/.
 * Field names match `ProjectRetrieveResponse` in the public OpenAPI spec.
 * https://docs.datarobot.com/en/docs/api/reference/public-api/openapi.yaml
 *
 * Official required keys include id, projectName, stage, target, metric, and
 * catalog fields. Live payloads omit several of those before Autopilot starts,
 * so only `id` is required here.
 */
export const DatarobotProject = z
	.object({
		id: z.string(),
		projectName: S,
		fileName: S,
		stage: S,
		target: S,
		targetType: S,
		metric: S,
		created: S,
		catalogId: S,
		catalogVersionId: S,
		holdoutUnlocked: B,
		unsupervisedMode: B,
		useFeatureDiscovery: B,
		positiveClass: z.unknown().optional(),
		partition: z.unknown().optional(),
		advancedOptions: z.unknown().optional(),
	})
	.loose();
export type DatarobotProject = z.infer<typeof DatarobotProject>;

/**
 * Dataset record from GET /api/v2/datasets/{datasetId}/.
 * Field names match `FullDatasetDetailsResponse` in the public OpenAPI spec.
 * https://docs.datarobot.com/en/docs/api/reference/public-api/openapi.yaml
 *
 * Official required keys include datasetId, name, versionId, processingState,
 * and size/row counters. Catalog items still ingesting omit most of those, so
 * only `datasetId` is required here.
 */
export const DatarobotDataset = z
	.object({
		datasetId: z.string(),
		name: S,
		versionId: S,
		categories: z.array(z.string()).nullable().optional(),
		columnCount: N,
		rowCount: N,
		datasetSize: N,
		createdBy: S,
		creationDate: S,
		description: S,
		processingState: S,
		dataPersisted: B,
		isSnapshot: B,
		isLatestVersion: B,
		tags: z.array(z.string()).nullable().optional(),
		uri: S,
	})
	.loose();
export type DatarobotDataset = z.infer<typeof DatarobotDataset>;

/**
 * Deployment record from GET /api/v2/deployments/{deploymentId}/.
 * Field names match `DeploymentRetrieveResponse` in the public OpenAPI spec.
 * https://docs.datarobot.com/en/docs/api/reference/public-api/openapi.yaml
 */
export const DatarobotDeployment = z
	.object({
		id: z.string(),
		label: S,
		description: S,
		status: S,
		createdAt: S,
		importance: S,
		model: z.unknown().optional(),
		modelPackage: z.unknown().optional(),
		settings: z.unknown().optional(),
		permissions: z.unknown().optional(),
		tags: z.array(z.unknown()).nullable().optional(),
	})
	.loose();
export type DatarobotDeployment = z.infer<typeof DatarobotDeployment>;

/**
 * Use case record from GET /api/v2/useCases/{useCaseId}/.
 * Field names match `UseCaseResponse` in the public OpenAPI spec.
 * https://docs.datarobot.com/en/docs/api/reference/public-api/openapi.yaml
 */
export const DatarobotUseCase = z
	.object({
		id: z.string(),
		name: S,
		description: S,
		created: S,
		createdAt: S,
		updated: S,
		updatedAt: S,
		tenantId: S,
		role: S,
		projectsCount: N,
		datasetsCount: N,
		deploymentsCount: N,
		notebooksCount: N,
		members: z.array(z.unknown()).nullable().optional(),
	})
	.loose();
export type DatarobotUseCase = z.infer<typeof DatarobotUseCase>;

/**
 * User stub from `DataRobotUser` in the public OpenAPI spec.
 * https://docs.datarobot.com/en/docs/api/reference/public-api/openapi.yaml
 */
export const DatarobotUser = z
	.object({
		id: z.string(),
		name: S,
		userhash: S,
	})
	.loose();
export type DatarobotUser = z.infer<typeof DatarobotUser>;
