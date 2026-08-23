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
	limit: z.coerce.number().int().min(1).max(100).optional(),
	offset: z.coerce.number().int().min(0).optional(),
};

export const WorkdayEndpointInputSchemas = {
	createBusinessTitleChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getBusinessTitleChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getBusinessTitleChangeForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
		})
		.passthrough(),
	createJobChange: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getJobById: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobChangeLocationInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobChangePosition: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobChangeReasonInstance: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobChangesWorkerValues: z
		.object({
			effectiveDate: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobPosting: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobPostingQuestionnaire: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobWorkspace: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
		})
		.passthrough(),
	getJobWorkspaces: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	updateJobChangeBusinessTitle: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	createPayrollInputs: z
		.object({
			...PaginationQueryShape,
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getPayrollInputInstance: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	updateAnExistingPayroll: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	createTimeOffRequest: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
			// Remaining fields form the JSON body (Workday resource payloads).
		})
		.passthrough(),
	getTimeOffEntriesForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getTimeOffPlansForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getTimeOffStatusValues: z
		.object({
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getCandidateAvailabilityTemplate: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getCollectionOfJobs: z
		.object({
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getCountryInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getCurrentUser: z
		.object({
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getHistoryInstanceForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
		})
		.passthrough(),
	getHistoryItemsForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getInterview: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getInterviewFeedback2: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getLeaveStatusValues: z
		.object({
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getPayGroupByJobId: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getPaySlipInstancesForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
		})
		.passthrough(),
	getPaySlipsForWorker: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getProspect: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getProspectEducations: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getProspectExperiences: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getProspectResumeAttachments: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getProspectSkills: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getWorkerBusinessTitleChanges: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getWorkerInfo: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	getWorkerServiceDates: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	getWorkerStaffingInformation: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	retrieveWorkerLeaveOfAbsenceSubresource: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			subresourceID: z.string().min(1),
			...PaginationQueryShape,
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
			...PaginationQueryShape,
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
			...PaginationQueryShape,
		})
		.passthrough(),
	listCountries: z
		.object({
			...PaginationQueryShape,
		})
		.passthrough(),
	listInterviews: z
		.object({
			status: z
				.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
				.optional(),
			...PaginationQueryShape,
		})
		.passthrough(),
	listJobs: z
		.object({
			...PaginationQueryShape,
		})
		.passthrough(),
	updateMessageTemplateById: z
		.object({
			ID: z.string().min(1),
			id: z.string().min(1).optional(),
			workerId: z.string().min(1).optional(),
			...PaginationQueryShape,
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
