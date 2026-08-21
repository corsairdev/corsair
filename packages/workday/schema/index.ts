import {
	WorkdayAbsenceBalance,
	WorkdayInterview,
	WorkdayJob,
	WorkdayJobPosting,
	WorkdayJobRequisition,
	WorkdayPayrollInput,
	WorkdayProspect,
	WorkdayWorker,
} from './database';

export const WorkdaySchema = {
	version: '1.0.0',
	entities: {
		workers: WorkdayWorker,
		jobs: WorkdayJob,
		jobPostings: WorkdayJobPosting,
		jobRequisitions: WorkdayJobRequisition,
		payrollInputs: WorkdayPayrollInput,
		prospects: WorkdayProspect,
		interviews: WorkdayInterview,
		absenceBalances: WorkdayAbsenceBalance,
	},
} as const;

export {
	WorkdayAbsenceBalance,
	WorkdayInterview,
	WorkdayJob,
	WorkdayJobPosting,
	WorkdayJobRequisition,
	WorkdayPayrollInput,
	WorkdayProspect,
	WorkdayWorker,
} from './database';
