import {
	BreatheHrAbsence,
	BreatheHrAccount,
	BreatheHrDepartment,
	BreatheHrEmployee,
	BreatheHrEmployeeExpense,
	BreatheHrLeaveRequest,
	BreatheHrSickness,
} from './database';

export const BreatheHrSchema = {
	version: '1.0.0',
	entities: {
		accounts: BreatheHrAccount,
		employees: BreatheHrEmployee,
		leaveRequests: BreatheHrLeaveRequest,
		absences: BreatheHrAbsence,
		departments: BreatheHrDepartment,
		sicknesses: BreatheHrSickness,
		employeeExpenses: BreatheHrEmployeeExpense,
	},
} as const;

export {
	BreatheHrAbsence,
	BreatheHrAccount,
	BreatheHrDepartment,
	BreatheHrEmployee,
	BreatheHrEmployeeExpense,
	BreatheHrLeaveRequest,
	BreatheHrSickness,
} from './database';
