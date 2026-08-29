import { EmployeeSchema, LeaveSchema } from '../endpoints/types';

export const BreatheHrSchema = {
	version: '1.0.0',
	entities: {
		employees: EmployeeSchema,
		leaves: LeaveSchema,
	},
} as const;
