import { z } from 'zod';

/**
 * Workday REST entity shapes for Corsair DB cache (`ctx.db.*`).
 * Field names follow Workday REST Directory resources:
 * Staffing v6 Workers/Jobs, Recruiting v4 Job Postings/Requisitions/Prospects/Interviews,
 * Payroll v1 Payroll Inputs, Absence Management v5 Balances.
 *
 * Common identity: every Workday REST instance exposes `id`, `descriptor`, `href`.
 * Loose + catchall — responses include tenant-specific extras.
 */

const WorkdayRef = z
	.object({
		id: z.string().optional(),
		descriptor: z.string().optional(),
		href: z.string().optional(),
	})
	.catchall(z.unknown());

const WorkdayEntityBase = {
	id: z.string().optional(),
	descriptor: z.string().optional(),
	href: z.string().optional(),
	updatedAt: z.coerce.date().optional(),
};

/** Staffing v6 GET /workers/{ID} (WorkersApi.getStaffingInformation). */
export const WorkdayWorker = z
	.object({
		...WorkdayEntityBase,
		businessTitle: z.string().optional(),
		primaryWorkEmail: z.string().optional(),
		primaryWorkPhone: z.string().optional(),
		workerID: z.string().optional(),
		employeeID: z.string().optional(),
		isManager: z.boolean().optional(),
		primaryJob: WorkdayRef.optional(),
		primarySupervisoryOrganization: WorkdayRef.optional(),
		location: WorkdayRef.optional(),
		workerType: WorkdayRef.optional(),
	})
	.catchall(z.unknown());
export type WorkdayWorker = z.infer<typeof WorkdayWorker>;

/** Staffing v6 GET /jobs/{ID} (JobsApi.getJobById). */
export const WorkdayJob = z
	.object({
		...WorkdayEntityBase,
		businessTitle: z.string().optional(),
		jobProfile: WorkdayRef.optional(),
		location: WorkdayRef.optional(),
		supervisoryOrganization: WorkdayRef.optional(),
		worker: WorkdayRef.optional(),
		jobType: WorkdayRef.optional(),
	})
	.catchall(z.unknown());
export type WorkdayJob = z.infer<typeof WorkdayJob>;

/** Recruiting v4 GET /jobPostings/{ID}. */
export const WorkdayJobPosting = z
	.object({
		...WorkdayEntityBase,
		title: z.string().optional(),
		jobDescription: z.string().optional(),
		jobRequisition: WorkdayRef.optional(),
		jobPostingSite: WorkdayRef.optional(),
		location: WorkdayRef.optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	})
	.catchall(z.unknown());
export type WorkdayJobPosting = z.infer<typeof WorkdayJobPosting>;

/** Recruiting v4 GET /jobRequisitions (getMyJobPostings entry). */
export const WorkdayJobRequisition = z
	.object({
		...WorkdayEntityBase,
		status: z.string().optional(),
		hiringManager: WorkdayRef.optional(),
		recruiter: WorkdayRef.optional(),
		jobProfile: WorkdayRef.optional(),
		supervisoryOrganization: WorkdayRef.optional(),
		location: WorkdayRef.optional(),
		numberOfOpenings: z.number().optional(),
	})
	.catchall(z.unknown());
export type WorkdayJobRequisition = z.infer<typeof WorkdayJobRequisition>;

/** Payroll v1 GET /payrollInputs/{ID}. */
export const WorkdayPayrollInput = z
	.object({
		...WorkdayEntityBase,
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		worker: WorkdayRef.optional(),
		payComponent: WorkdayRef.optional(),
		comment: z.string().optional(),
		amount: z.union([z.number(), z.string()]).optional(),
	})
	.catchall(z.unknown());
export type WorkdayPayrollInput = z.infer<typeof WorkdayPayrollInput>;

/** Recruiting v4 GET /prospects/{ID}. */
export const WorkdayProspect = z
	.object({
		...WorkdayEntityBase,
		email: z.string().optional(),
		phone: z.string().optional(),
		candidate: WorkdayRef.optional(),
	})
	.catchall(z.unknown());
export type WorkdayProspect = z.infer<typeof WorkdayProspect>;

/** Recruiting v4 GET /interviews/{ID}. */
export const WorkdayInterview = z
	.object({
		...WorkdayEntityBase,
		status: z.string().optional(),
		interviewDate: z.string().optional(),
		jobRequisition: WorkdayRef.optional(),
		candidate: WorkdayRef.optional(),
	})
	.catchall(z.unknown());
export type WorkdayInterview = z.infer<typeof WorkdayInterview>;

/** Absence Management v5 GET /balances/{ID}. */
export const WorkdayAbsenceBalance = z
	.object({
		...WorkdayEntityBase,
		worker: WorkdayRef.optional(),
		absencePlan: WorkdayRef.optional(),
		category: WorkdayRef.optional(),
		unitOfTime: z.string().optional(),
		quantity: z.union([z.number(), z.string()]).optional(),
		effectiveDate: z.string().optional(),
	})
	.catchall(z.unknown());
export type WorkdayAbsenceBalance = z.infer<typeof WorkdayAbsenceBalance>;
