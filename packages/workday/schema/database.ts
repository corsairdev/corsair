import { z } from 'zod';

/**
 * Workday REST resources use a common identity shape (id / descriptor / href).
 * @see Staffing v6 WorkersApi / JobsApi, Recruiting v4, Payroll v1, Absence Management v5
 */
const WorkdayEntityBase = {
	id: z.string().optional(),
	descriptor: z.string().optional(),
	href: z.string().optional(),
	updatedAt: z.coerce.date().optional(),
};

export const WorkdayWorker = z.object(WorkdayEntityBase).catchall(z.unknown());
export type WorkdayWorker = z.infer<typeof WorkdayWorker>;

export const WorkdayJob = z.object(WorkdayEntityBase).catchall(z.unknown());
export type WorkdayJob = z.infer<typeof WorkdayJob>;

export const WorkdayJobPosting = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayJobPosting = z.infer<typeof WorkdayJobPosting>;

/** Recruiting v4 /jobRequisitions — used by getMyJobPostings entry point. */
export const WorkdayJobRequisition = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayJobRequisition = z.infer<typeof WorkdayJobRequisition>;

export const WorkdayPayrollInput = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayPayrollInput = z.infer<typeof WorkdayPayrollInput>;

export const WorkdayProspect = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayProspect = z.infer<typeof WorkdayProspect>;

export const WorkdayInterview = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayInterview = z.infer<typeof WorkdayInterview>;

/** Absence Management v5 /balances */
export const WorkdayAbsenceBalance = z
	.object(WorkdayEntityBase)
	.catchall(z.unknown());
export type WorkdayAbsenceBalance = z.infer<typeof WorkdayAbsenceBalance>;
