import { z } from 'zod';
import { B, N, Obj, S, StrArray, UnknownArray } from './primitives';

/**
 * Result objects that are not persisted. Field names match official samples.
 * https://help.blazemeter.com/apidocs/performance/the_schedule_object.htm
 * https://help.blazemeter.com/apidocs/performance/multi_tests_create_a_test.htm
 * https://help.blazemeter.com/apidocs/performance/private_locations_list_private_locations.htm
 * https://help.blazemeter.com/apidocs/performance/tests_start_a_test.htm
 * https://help.blazemeter.com/apidocs/performance/masters_summary_statistics.htm
 * https://help.blazemeter.com/apidocs/functional/list_test_files.htm
 * https://help.blazemeter.com/apidocs/test-data/get.htm
 * https://help.blazemeter.com/apidocs/test-data/validate.htm
 * https://help.blazemeter.com/apidocs/service-virtualization/template_update_properties.htm
 * https://help.blazemeter.com/apidocs/service-virtualization/transaction_create.htm
 */

const Id = z.union([z.string(), z.number()]);

export const BlazemeterScheduleResult = z
	.object({
		id: S,
		cron: S,
		nextRun: N,
		enabled: B,
		type: S,
		created: N,
		updated: N,
		testId: N,
		testCollectionId: N,
		createdById: N,
		lastUpdatedById: N,
		nextExecutions: UnknownArray,
	})
	.loose();

export const BlazemeterMultiTestResult = z
	.object({
		id: N,
		name: S,
		collectionType: S,
		userId: N,
		created: N,
		updated: N,
		creatorClientId: S,
		shouldSendReportEmail: B,
		projectId: N,
		filesToSplit: UnknownArray,
		dataFiles: UnknownArray,
	})
	.loose();

export const BlazemeterPrivateLocationResult = z
	.object({
		id: S,
		name: S,
		userId: N,
		consoleXms: N,
		consoleXmx: N,
		engineXms: N,
		engineXmx: N,
		threadsPerEngine: N,
		slots: N,
		type: S,
		funcIds: StrArray,
		hidden: B,
		disabled: B,
		created: N,
		updated: N,
		accountId: N,
		shipsId: UnknownArray,
		workspacesId: UnknownArray,
		ships: UnknownArray,
	})
	.loose();

export const BlazemeterPrivateLocationAgentResult = z
	.object({
		id: S,
		name: S,
		address: S,
		publicIpAddress: S,
		state: S,
		lastHeartBeat: N,
	})
	.loose();

export const BlazemeterTestFileResult = z
	.object({
		lastModified: N,
		name: S,
		size: N,
		link: S,
		linkExpire: N,
	})
	.loose();

export const BlazemeterMasterResult = z
	.object({
		id: N,
		name: S,
		userId: N,
		created: N,
		updated: N,
		testId: N,
		projectId: N,
		sessionsId: StrArray,
		locations: StrArray,
		executions: UnknownArray,
		isDebugRun: B,
	})
	.loose();

export const BlazemeterMasterSummaryRow = z
	.object({
		avg: N,
		bytes: N,
		concurrency: N,
		duration: N,
		durationIsNotConfigured: B,
		failed: N,
		first: N,
		hits: N,
		id: S,
		last: N,
		lb: S,
		tp90: N,
		min: N,
		max: N,
		histogram: Obj,
	})
	.loose();

export const BlazemeterMasterSummaryResult = z
	.object({
		summary: z.array(BlazemeterMasterSummaryRow).nullable().optional(),
		jmeterLogSummary: UnknownArray,
		jmeterLogTypeSummary: UnknownArray,
		maxUsers: N,
	})
	.loose();

export const BlazemeterTagResult = z
	.object({
		id: Id.optional(),
		label: S,
		name: S,
	})
	.loose();

export const BlazemeterSearchHitResult = z
	.object({
		id: Id.optional(),
		name: S,
		type: S,
		projectId: N,
		userId: N,
	})
	.loose();

export const BlazemeterRegionResult = z
	.object({
		id: S,
		name: S,
		title: S,
		provider: S,
	})
	.loose();

export const BlazemeterSharedFolderResult = z
	.object({
		id: Id.optional(),
		name: S,
		workspaceId: N,
	})
	.loose();

export const BlazemeterSessionResult = z
	.object({
		id: S,
		name: S,
		status: S,
		testId: N,
		projectId: N,
	})
	.loose();

export const BlazemeterInviteResult = z
	.object({
		id: Id.optional(),
		email: S,
		status: S,
	})
	.loose();

export const BlazemeterValidationResult = z
	.object({
		id: Id.optional(),
		status: S,
		fileName: S,
	})
	.loose();

export const BlazemeterDependencyResult = z
	.object({
		id: S,
		type: S,
		sourceId: S,
		targetId: S,
	})
	.loose();

export const BlazemeterHealthResult = z
	.object({
		status: S,
		healthy: B,
	})
	.loose();

export const BlazemeterVersionResult = z
	.object({
		version: S,
		branch: S,
		commit: S,
		build: S,
	})
	.loose();

export const BlazemeterDataModelResult = z
	.object({
		id: S,
		title: S,
		description: S,
		type: S,
		kind: S,
		repeat: N,
		properties: Obj,
		requirements: Obj,
	})
	.loose();

export const BlazemeterDataModelValidationResult = z
	.object({
		isValid: B,
		entities: Obj,
	})
	.loose();

export const BlazemeterGeneratedRow = z.record(z.string(), z.unknown());

export const BlazemeterServiceMockTemplateResult = z
	.object({
		id: N,
		name: S,
		description: S,
		created: S,
		createdBy: S,
		updated: S,
		updatedBy: S,
		liveSystemHost: S,
		liveSystemPort: N,
		noMatchingRequestPreference: S,
		noMatchingRequestTxnId: N,
		thinkTime: N,
		serviceId: N,
		serviceName: S,
		mockServiceTransactions: UnknownArray,
	})
	.loose();

export const BlazemeterTransactionResult = z
	.object({
		id: N,
		name: S,
		description: S,
		link: S,
		serviceId: N,
		serviceName: S,
		tags: StrArray,
		dsl: Obj,
	})
	.loose();

export const BlazemeterGeneratorFunctionResult = z
	.object({
		name: S,
		category: S,
		description: S,
		signature: S,
	})
	.loose();

export const BlazemeterSeedListResult = z
	.object({
		name: S,
		fileName: S,
	})
	.loose();

export const BlazemeterCardIssuerResult = z
	.object({
		name: S,
		lengths: UnknownArray,
	})
	.loose();
