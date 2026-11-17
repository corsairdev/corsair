import * as Account from './account';
import * as Tasks from './tasks';

export const TasksEndpoints = {
	create: Tasks.create,
	result: Tasks.result,
};

export const AccountEndpoints = {
	balance: Account.getBalance,
	reportCorrect: Account.reportCorrect,
	reportIncorrect: Account.reportIncorrect,
};

export * from './types';
