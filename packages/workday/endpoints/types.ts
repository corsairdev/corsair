import { z } from 'zod';
import type { WorkdayRouteName } from './routes';
import { workdayRoutes } from './routes';

// Workday responses vary widely across services; validate known keys + allow extras.
export const WorkdayResourceSchema = z
	.object({
		id: z.string().optional(),
		descriptor: z.string().optional(),
		href: z.string().optional(),
	})
	.catchall(z.unknown());

export const WorkdayCollectionSchema = z
	.object({
		data: z.array(WorkdayResourceSchema).optional(),
		total: z.number().optional(),
	})
	.catchall(z.unknown());

const PaginationQueryShape = {
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
};

export const WorkdayEndpointInputSchemas = {
	createBusinessTitleChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getBusinessTitleChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getBusinessTitleChangeForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	createJobChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getJobById: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangeFrequencies: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangeLocationInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangePosition: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangeReasonInstance: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangeReasonValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangeReasons: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangesGroupTemplates: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangesJobValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobChangesWorkerValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobClassifications: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobPosting: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobPostingQuestionnaire: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobProfilesValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobRequisitionValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobWorkspace: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getJobWorkspaces: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	listJobPostings: z
		.object({
			jobRequisition: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			category: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			id: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			jobSite: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	updateJobChangeBusinessTitle: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	createPayrollInputs: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getPayrollInputInstance: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	updateAnExistingPayroll: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getCollectionOfPayroll: z
		.object({
			startDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			endDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			payComponent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	createTimeOffRequest: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getTimeOffEntriesForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getTimeOffPlansForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getTimeOffStatusValues: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getTimeTypes: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getAbsenceBalance: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			absencePlan: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			effective: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	listBalances: z
		.object({
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			category: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			effective: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getAssignmentChangeGroupCostCenters: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getAssignmentChangeGroupJobs: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getAssignmentTypes: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCandidateAvailabilityTemplate: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCollectionOfJobs: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCompanyInsiderTypes: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getContingentWorkerTypes: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCountryInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCurrencies: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getCurrentUser: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getGrants: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getHeadcountOptions: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getHistoryInstanceForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getHistoryItemsForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getHolidayEvents: z
		.object({
			fromDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			toDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getInterview: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getInterviewFeedback2: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getLeaveStatusValues: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getMyJobPostings: z
		.object({
			status: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			supervisoryOrganization: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getOrganizationAssignmentBusinessUnits: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getOrganizationAssignmentCustoms: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getOrganizationAssignmentFunds: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getOrganizationAssignmentRegions: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getOrganizationAssignmentWorkers: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			organizationType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getPayGroupByJobId: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getPaySlipInstancesForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getPaySlipsForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProposedPositionValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProspect: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProspectEducations: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProspectExperiences: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProspectResumeAttachments: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getProspectSkills: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getSupervisoryOrgValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkStudyAwards: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerBusinessTitleChanges: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerEligibleAbsenceTypes: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			effective: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerLeavesOfAbsence: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			fromDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			toDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			status: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerServiceDates: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerStaffingInformation: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerTimeOffDetails: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			fromDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			toDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerTypes: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkerValidTimeOffDates: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			fromDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			toDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			timeOffType: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	retrieveWorkerLeaveOfAbsenceSubresource: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkersCollectionStaffing: z
		.object({
			includeTerminatedWorkers: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			search: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	getWorkspaceInstances: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			event: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			job: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			location: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			manager: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			staffingEvent: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			worker: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	listCountries: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	listInterviews: z
		.object({
			status: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	listJobs: z
		.object({
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
		})
		.passthrough(),
	updateMessageTemplateById: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(100).optional(),
			offset: z.number().int().min(0).optional(),
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
} as const;

export const WorkdayEndpointOutputSchemas = {
	createBusinessTitleChange: WorkdayResourceSchema,
	getBusinessTitleChange: WorkdayResourceSchema,
	getBusinessTitleChangeForWorker: WorkdayResourceSchema,
	createJobChange: WorkdayResourceSchema,
	getJobById: WorkdayResourceSchema,
	getJobChangeFrequencies: WorkdayCollectionSchema,
	getJobChangeLocationInfo: WorkdayResourceSchema,
	getJobChangePosition: WorkdayResourceSchema,
	getJobChangeReasonInstance: WorkdayResourceSchema,
	getJobChangeReasonValues: WorkdayCollectionSchema,
	getJobChangeReasons: WorkdayCollectionSchema,
	getJobChangesGroupTemplates: WorkdayCollectionSchema,
	getJobChangesJobValues: WorkdayCollectionSchema,
	getJobChangesWorkerValues: WorkdayCollectionSchema,
	getJobClassifications: WorkdayCollectionSchema,
	getJobPosting: WorkdayResourceSchema,
	getJobPostingQuestionnaire: WorkdayCollectionSchema,
	getJobProfilesValues: WorkdayCollectionSchema,
	getJobRequisitionValues: WorkdayCollectionSchema,
	getJobWorkspace: WorkdayResourceSchema,
	getJobWorkspaces: WorkdayCollectionSchema,
	listJobPostings: WorkdayCollectionSchema,
	updateJobChangeBusinessTitle: WorkdayResourceSchema,
	createPayrollInputs: WorkdayResourceSchema,
	getPayrollInputInstance: WorkdayResourceSchema,
	updateAnExistingPayroll: WorkdayResourceSchema,
	getCollectionOfPayroll: WorkdayCollectionSchema,
	createTimeOffRequest: WorkdayResourceSchema,
	getTimeOffEntriesForWorker: WorkdayCollectionSchema,
	getTimeOffPlansForWorker: WorkdayCollectionSchema,
	getTimeOffStatusValues: WorkdayCollectionSchema,
	getTimeTypes: WorkdayCollectionSchema,
	getAbsenceBalance: WorkdayResourceSchema,
	listBalances: WorkdayCollectionSchema,
	getAssignmentChangeGroupCostCenters: WorkdayCollectionSchema,
	getAssignmentChangeGroupJobs: WorkdayCollectionSchema,
	getAssignmentTypes: WorkdayCollectionSchema,
	getCandidateAvailabilityTemplate: WorkdayResourceSchema,
	getCollectionOfJobs: WorkdayCollectionSchema,
	getCompanyInsiderTypes: WorkdayCollectionSchema,
	getContingentWorkerTypes: WorkdayCollectionSchema,
	getCountryInfo: WorkdayResourceSchema,
	getCurrencies: WorkdayCollectionSchema,
	getCurrentUser: WorkdayResourceSchema,
	getGrants: WorkdayCollectionSchema,
	getHeadcountOptions: WorkdayCollectionSchema,
	getHistoryInstanceForWorker: WorkdayResourceSchema,
	getHistoryItemsForWorker: WorkdayCollectionSchema,
	getHolidayEvents: WorkdayCollectionSchema,
	getInterview: WorkdayResourceSchema,
	getInterviewFeedback2: WorkdayCollectionSchema,
	getLeaveStatusValues: WorkdayCollectionSchema,
	getMyJobPostings: WorkdayCollectionSchema,
	getOrganizationAssignmentBusinessUnits: WorkdayCollectionSchema,
	getOrganizationAssignmentCustoms: WorkdayCollectionSchema,
	getOrganizationAssignmentFunds: WorkdayCollectionSchema,
	getOrganizationAssignmentRegions: WorkdayCollectionSchema,
	getOrganizationAssignmentWorkers: WorkdayCollectionSchema,
	getPayGroupByJobId: WorkdayResourceSchema,
	getPaySlipInstancesForWorker: WorkdayResourceSchema,
	getPaySlipsForWorker: WorkdayCollectionSchema,
	getProposedPositionValues: WorkdayCollectionSchema,
	getProspect: WorkdayResourceSchema,
	getProspectEducations: WorkdayCollectionSchema,
	getProspectExperiences: WorkdayCollectionSchema,
	getProspectResumeAttachments: WorkdayCollectionSchema,
	getProspectSkills: WorkdayCollectionSchema,
	getSupervisoryOrgValues: WorkdayCollectionSchema,
	getWorkStudyAwards: WorkdayCollectionSchema,
	getWorkerBusinessTitleChanges: WorkdayCollectionSchema,
	getWorkerEligibleAbsenceTypes: WorkdayCollectionSchema,
	getWorkerInfo: WorkdayResourceSchema,
	getWorkerLeavesOfAbsence: WorkdayCollectionSchema,
	getWorkerServiceDates: WorkdayCollectionSchema,
	getWorkerStaffingInformation: WorkdayResourceSchema,
	getWorkerTimeOffDetails: WorkdayCollectionSchema,
	getWorkerTypes: WorkdayCollectionSchema,
	getWorkerValidTimeOffDates: WorkdayCollectionSchema,
	retrieveWorkerLeaveOfAbsenceSubresource: WorkdayResourceSchema,
	getWorkersCollectionStaffing: WorkdayCollectionSchema,
	getWorkspaceInstances: WorkdayCollectionSchema,
	listCountries: WorkdayCollectionSchema,
	listInterviews: WorkdayCollectionSchema,
	listJobs: WorkdayCollectionSchema,
	updateMessageTemplateById: WorkdayResourceSchema,
} as const;

export type WorkdayEndpointInputs = {
	[K in WorkdayRouteName]: z.infer<(typeof WorkdayEndpointInputSchemas)[K]>;
};
export type WorkdayEndpointOutputs = {
	[K in WorkdayRouteName]: z.infer<(typeof WorkdayEndpointOutputSchemas)[K]>;
};

// Flat input used by the shared factory (index signature for aliases).
export type WorkdayEndpointInput = {
	[key: string]: unknown;
	body?: unknown;
	query?: Record<string, unknown>;
};
