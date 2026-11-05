import { z } from 'zod';
import { B, N, NumId, Obj, S, StrArray, UnknownArray } from './primitives';

/**
 * Field names match official JSON keys.
 * https://help.blazemeter.com/apidocs/performance/introduction_authorization.htm
 * https://help.blazemeter.com/apidocs/performance/the_workspace_object.htm
 * https://help.blazemeter.com/apidocs/functional/the_project_object.htm
 * https://help.blazemeter.com/apidocs/performance/the_test_object.htm
 * https://help.blazemeter.com/apidocs/performance/workspaces_user_list.htm
 * https://help.blazemeter.com/apidocs/test-data/create.htm
 *
 * Only slow-changing account structure is mirrored: accounts, workspaces,
 * projects, tests, workspace users, and Asset Repository metadata.
 * Generated test data, file contents, masters, reports, sessions, and
 * download URLs are not persisted.
 */

/** Nested owner on workspace (and account) objects. */
export const BlazemeterOwnerRef = z
	.object({
		id: N,
		email: S,
		displayName: S,
	})
	.loose();
export type BlazemeterOwnerRef = z.infer<typeof BlazemeterOwnerRef>;

/** Workspace.allowance — https://help.blazemeter.com/apidocs/performance/the_workspace_object.htm */
export const BlazemeterAllowance = z
	.object({
		amount: N,
		type: S,
	})
	.loose();
export type BlazemeterAllowance = z.infer<typeof BlazemeterAllowance>;

/** Location.limits on the workspace object. */
export const BlazemeterLocationLimits = z
	.object({
		threadsPerEngine: N,
		concurrency: N,
		engines: N,
		duration: N,
	})
	.loose();
export type BlazemeterLocationLimits = z.infer<typeof BlazemeterLocationLimits>;

/** Location.capabilities on the workspace object. */
export const BlazemeterLocationCapabilities = z
	.object({
		dedicatedIps: B,
	})
	.loose();
export type BlazemeterLocationCapabilities = z.infer<
	typeof BlazemeterLocationCapabilities
>;

/** Location.purposes on the workspace object. */
export const BlazemeterLocationPurposes = z
	.object({
		load: B,
		functional: B,
		grid: B,
		serviceMock: B,
	})
	.loose();
export type BlazemeterLocationPurposes = z.infer<
	typeof BlazemeterLocationPurposes
>;

/** Workspace.locations[] — https://help.blazemeter.com/apidocs/performance/the_workspace_object.htm */
export const BlazemeterWorkspaceLocation = z
	.object({
		id: S,
		title: S,
		name: S,
		provider: S,
		limits: BlazemeterLocationLimits.nullable().optional(),
		capabilities: BlazemeterLocationCapabilities.nullable().optional(),
		sandbox: B,
		purposes: BlazemeterLocationPurposes.nullable().optional(),
	})
	.loose();
export type BlazemeterWorkspaceLocation = z.infer<
	typeof BlazemeterWorkspaceLocation
>;

/** Workspace.activeMember — the requester's membership on that workspace. */
export const BlazemeterActiveMember = z
	.object({
		id: N,
		email: S,
		displayName: S,
		roles: StrArray,
		enabled: B,
		access: N,
	})
	.loose();
export type BlazemeterActiveMember = z.infer<typeof BlazemeterActiveMember>;

/**
 * GET /accounts — no dedicated object page; `id` is the accountId from
 * https://help.blazemeter.com/apidocs/performance/appendix_glossary.htm
 * Owner shape matches the workspace object. Extra plan fields stay via .loose().
 */
export const BlazemeterAccountEntity = z
	.object({
		id: NumId,
		name: S,
		owner: BlazemeterOwnerRef.nullable().optional(),
	})
	.loose();
export type BlazemeterAccountEntity = z.infer<typeof BlazemeterAccountEntity>;

/** GET /workspaces, GET /workspaces/{id} — The workspace object. */
export const BlazemeterWorkspaceEntity = z
	.object({
		id: NumId,
		name: S,
		userId: N,
		created: N,
		updated: N,
		enabled: B,
		dedicatedIpsEnabled: B,
		privateLocationsEnabled: B,
		owner: BlazemeterOwnerRef.nullable().optional(),
		membersCount: N,
		allowance: BlazemeterAllowance.nullable().optional(),
		accountId: N,
		locations: z.array(BlazemeterWorkspaceLocation).nullable().optional(),
		activeMember: BlazemeterActiveMember.nullable().optional(),
		features: Obj,
	})
	.loose();
export type BlazemeterWorkspaceEntity = z.infer<
	typeof BlazemeterWorkspaceEntity
>;

/** GET /projects, GET /projects/{id} — The project object. */
export const BlazemeterProjectEntity = z
	.object({
		id: NumId,
		name: S,
		userId: N,
		description: S,
		created: N,
		updated: N,
		workspaceId: N,
		testsCount: N,
	})
	.loose();
export type BlazemeterProjectEntity = z.infer<typeof BlazemeterProjectEntity>;

/** Test.tags[] on the performance test object. */
export const BlazemeterTestTag = z
	.object({
		id: N,
		label: S,
	})
	.loose();
export type BlazemeterTestTag = z.infer<typeof BlazemeterTestTag>;

/**
 * GET /tests, GET /tests/{id} — The performance test object.
 * `configuration`, `executions`, and `overrideExecutions` stay unmodelled:
 * they vary by test type (taurus / functionalApi / functionalGui) and
 * inventing a closed shape would drop valid rows.
 */
export const BlazemeterTestEntity = z
	.object({
		id: NumId,
		name: S,
		description: S,
		isNewTest: B,
		lastRunTime: N,
		userId: N,
		creatorClientId: S,
		overrideExecutions: UnknownArray,
		executions: UnknownArray,
		hasThreadGroupsToOverride: B,
		hasNonRegularThreadGroup: B,
		shouldSendReportEmail: B,
		dependencies: z.unknown().optional(),
		tags: z.array(BlazemeterTestTag).nullable().optional(),
		created: N,
		updated: N,
		projectId: N,
		lastUpdatedById: N,
		configuration: Obj,
	})
	.loose();
export type BlazemeterTestEntity = z.infer<typeof BlazemeterTestEntity>;

/**
 * GET /user — Authorization using basic authentication sample.
 * https://help.blazemeter.com/apidocs/performance/introduction_authorization.htm
 */
export const BlazemeterUserEntity = z
	.object({
		id: NumId,
		email: S,
		access: N,
		login: N,
		firstName: S,
		lastName: S,
		timezone: N,
		enabled: B,
		roles: StrArray,
	})
	.loose();
export type BlazemeterUserEntity = z.infer<typeof BlazemeterUserEntity>;

/** GET /workspaces/{id}/users — Workspace user list. */
export const BlazemeterWorkspaceUserEntity = z
	.object({
		id: NumId,
		email: S,
		displayName: S,
		firstName: S,
		lastName: S,
		login: N,
		access: N,
		roles: StrArray,
		enabled: B,
		lastAccess: N,
		type: S,
	})
	.loose();
export type BlazemeterWorkspaceUserEntity = z.infer<
	typeof BlazemeterWorkspaceUserEntity
>;

/**
 * Asset Repository asset metadata.
 * https://help.blazemeter.com/apidocs/test-data/create.htm
 * `data.content` is file payload and is not stored.
 */
export const BlazemeterAssetEntity = z
	.object({
		id: z.string(),
		name: S,
		displayName: S,
		type: S,
		accountId: N,
		workspaceId: N,
		packageId: S,
		metadata: Obj,
		createdAt: S,
		updatedAt: S,
		createdBy: N,
		updatedBy: N,
		dependencies: Obj,
	})
	.loose();
export type BlazemeterAssetEntity = z.infer<typeof BlazemeterAssetEntity>;

/**
 * Asset Repository package metadata.
 * https://help.blazemeter.com/apidocs/test-data/asset_repository.htm
 */
export const BlazemeterPackageEntity = z
	.object({
		id: z.string(),
		name: S,
		displayName: S,
		version: S,
		accountId: N,
		workspaceId: N,
		dependencies: Obj,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type BlazemeterPackageEntity = z.infer<typeof BlazemeterPackageEntity>;
