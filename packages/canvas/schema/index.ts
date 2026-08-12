import {
	CanvasAccount,
	CanvasAssignment,
	CanvasCourse,
	CanvasEnrollment,
	CanvasUser,
} from './database';

export const CanvasSchema = {
	version: '1.0.0',
	entities: {
		courses: CanvasCourse,
		accounts: CanvasAccount,
		users: CanvasUser,
		assignments: CanvasAssignment,
		enrollments: CanvasEnrollment,
	},
} as const;

export {
	CanvasAccount,
	CanvasAssignment,
	CanvasCourse,
	CanvasEnrollment,
	CanvasUser,
} from './database';
