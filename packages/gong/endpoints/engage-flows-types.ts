import { z } from 'zod';

// unknown: flow steps, folders and overrides are nested objects passed through as Gong defines them.
const opaqueObject = z.record(z.string(), z.unknown());
// Gong ids are 64-bit; a string keeps the digits a JavaScript number would round.
const gongId = z.union([
	z.string().regex(/^\d{1,20}$/),
	z.number().int().nonnegative(),
]);
const flow = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		folderId: z.string().optional(),
		folderName: z.string().optional(),
		visibility: z.string().optional(),
		creationDate: z.string().optional(),
		exclusive: z.boolean().optional(),
	})
	.passthrough();
const records = z.object({ cursor: z.string().optional() }).passthrough();
const assignedFlow = z
	.object({
		flowId: z.string().optional(),
		flowName: z.string().optional(),
		crmProspectId: z.string().optional(),
		flowInstanceId: z.string().optional(),
		flowInstanceOwnerEmail: z.string().optional(),
		flowInstanceOwnerFullName: z.string().optional(),
		flowInstanceCreateDate: z.string().optional(),
		flowInstanceStatus: z.string().optional(),
		workspaceId: z.string().optional(),
		exclusive: z.boolean().optional(),
	})
	.passthrough();
const prospect = z
	.object({
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.string().optional(),
		jobTitle: z.string().optional(),
		linkedInUrl: z.string().optional(),
		crmId: z.string().optional(),
		accountCrmId: z.string().optional(),
		companyName: z.string().optional(),
	})
	.passthrough();
const assignmentResult = z
	.object({
		prospect: prospect.optional(),
		status: z.string().optional(),
		crmId: z.string().optional(),
		crmObjectType: z.string().optional(),
		flowInstanceId: z.string().optional(),
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	})
	.passthrough();
const flowBulkResult = z
	.object({
		requestId: z.string(),
		id: z.string(),
		status: z.string(),
		totalCount: z.number(),
		processedCount: z.number(),
		successCount: z.number(),
		failedCount: z.number(),
		results: z.array(assignmentResult).optional(),
	})
	.passthrough();
const flowListResult = z
	.object({
		requestId: z.string(),
		records: records.optional(),
		flows: z.array(flow),
	})
	.passthrough();
const stepsResult = z
	.object({ requestId: z.string(), flows: z.array(opaqueObject) })
	.passthrough();

export const GongEngageFlowsInputSchemas = {
	getFlowSteps: z.object({ flowIds: z.array(z.string()).max(20) }),
	getProspectsAssignedFlows: z
		.object({
			crmProspectsIds: z.array(z.string()).optional(),
			flowInstanceIds: z.array(z.string()).optional(),
		})
		.refine((v) => !!v.crmProspectsIds?.length || !!v.flowInstanceIds?.length),
	unassignFlows: z.object({
		flowInstanceIds: z.array(z.string()).min(1),
		unassignedByUserEmail: z.string().email().optional(),
	}),
	unassignProspectFlows: z.object({
		crmProspectId: z.string().min(1),
		flowId: z.string().optional(),
		unassignedByUserEmail: z.string().email().optional(),
	}),
	submitFlowProspectsBulkAssignment: z.object({
		flowInstanceOwnerEmail: z.string().email(),
		flowId: z.string().min(1),
		prospects: z.array(prospect),
	}),
	assignProspects: z.object({
		crmProspectsIds: z.array(z.string()).min(1),
		flowId: z.string().min(1),
		flowInstanceOwnerEmail: z.string().email(),
		overrides: z
			.object({
				steps: z.array(opaqueObject).optional(),
				flowInstanceVariables: z.array(opaqueObject).optional(),
				coolOffOverride: z.boolean().optional(),
			})
			.optional(),
		flowInstanceDescription: z.string().optional(),
	}),
	listFlows: z.object({
		flowOwnerEmail: z.string().email(),
		cursor: z.string().optional(),
		workspaceId: z.string().optional(),
		folderId: z.string().optional(),
		mostRecentlyAssigned: z.boolean().optional(),
	}),
	searchFlows: z.object({
		flowOwnerEmail: z.string().email(),
		query: z.string().max(256),
		workspaceId: z.string().optional(),
		limit: z.number().int().min(1).max(50).optional(),
	}),
	getFlowProspectsBulkAssignment: z.object({ id: z.string().min(1) }),
	listFlowsFolders: z.object({
		flowFolderOwnerEmail: z.string().email(),
		cursor: z.string().optional(),
		parentId: gongId.optional(),
		workspaceId: z.string().optional(),
	}),
} as const;

export const GongEngageFlowsOutputSchemas = {
	getFlowSteps: stepsResult,
	getProspectsAssignedFlows: z
		.object({ requestId: z.string(), prospectsAssigned: z.array(assignedFlow) })
		.passthrough(),
	unassignFlows: z
		.object({
			requestId: z.string(),
			unassignedFlowInstanceIds: z.array(z.string()),
		})
		.passthrough(),
	unassignProspectFlows: z
		.object({
			requestId: z.string(),
			unassignedFlowInstanceIds: z.array(z.string()),
		})
		.passthrough(),
	submitFlowProspectsBulkAssignment: flowBulkResult,
	assignProspects: z
		.object({
			requestId: z.string(),
			flowInstanceIds: z.array(z.string()).optional(),
		})
		.passthrough(),
	listFlows: flowListResult,
	searchFlows: z
		.object({ requestId: z.string(), flows: z.array(flow) })
		.passthrough(),
	getFlowProspectsBulkAssignment: flowBulkResult,
	listFlowsFolders: z
		.object({
			requestId: z.string(),
			records: records.optional(),
			// Gong's reference documents the list under `flows`; `folders` is accepted too.
			flows: z.array(opaqueObject).optional(),
			folders: z.array(opaqueObject).optional(),
		})
		.passthrough(),
} as const;

export type GongEngageFlowsInputs = {
	[K in keyof typeof GongEngageFlowsInputSchemas]: z.infer<
		(typeof GongEngageFlowsInputSchemas)[K]
	>;
};
export type GongEngageFlowsOutputs = {
	[K in keyof typeof GongEngageFlowsOutputSchemas]: z.infer<
		(typeof GongEngageFlowsOutputSchemas)[K]
	>;
};
