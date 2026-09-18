import {
	CloseActivityCall,
	CloseActivityEmail,
	CloseActivityNote,
	CloseContact,
	CloseCustomField,
	CloseLead,
	CloseOpportunity,
	CloseTask,
	CloseUser,
} from './database';

export const CloseSchema = {
	version: '1.0.0',
	entities: {
		lead: CloseLead,
		contact: CloseContact,
		opportunity: CloseOpportunity,
		task: CloseTask,
		activityNote: CloseActivityNote,
		activityCall: CloseActivityCall,
		activityEmail: CloseActivityEmail,
		user: CloseUser,
		customField: CloseCustomField,
	},
} as const;

export * from './database';
