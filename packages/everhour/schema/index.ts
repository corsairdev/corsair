import {
	EverhourClient,
	EverhourExpense,
	EverhourExpenseCategory,
	EverhourInvoice,
	EverhourPlatform,
	EverhourProject,
	EverhourSection,
	EverhourTag,
	EverhourTask,
	EverhourTimecard,
	EverhourTimeEntry,
	EverhourUser,
	EverhourWebhook,
} from './database';

export const EverhourSchema = {
	version: '1.0.0',
	entities: {
		users: EverhourUser,
		projects: EverhourProject,
		tasks: EverhourTask,
		timeEntries: EverhourTimeEntry,
		clients: EverhourClient,
		platforms: EverhourPlatform,
		sections: EverhourSection,
		timecards: EverhourTimecard,
		expenses: EverhourExpense,
		expenseCategories: EverhourExpenseCategory,
		invoices: EverhourInvoice,
		webhooks: EverhourWebhook,
		tags: EverhourTag,
	},
} as const;
