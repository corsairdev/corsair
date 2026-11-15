import * as foldersModule from './folders';
import * as formsModule from './forms';
import * as labelsModule from './labels';
import * as reportsModule from './reports';
import * as submissionsModule from './submissions';
import * as systemModule from './system';
import * as userModule from './user';

export const User = {
	get: userModule.get,
	getForms: userModule.getForms,
	getSubmissions: userModule.getSubmissions,
	getFolders: userModule.getFolders,
	getHistory: userModule.getHistory,
	getSettings: userModule.getSettings,
	updateSettings: userModule.updateSettings,
	getSettingByKey: userModule.getSettingByKey,
	getSubusers: userModule.getSubusers,
	getUsage: userModule.getUsage,
	getReports: userModule.getReports,
	getInvoices: userModule.getInvoices,
	getLabels: userModule.getLabels,
	login: userModule.login,
	logout: userModule.logout,
	register: userModule.register,
};

export const Forms = {
	get: formsModule.get,
	create: formsModule.create,
	createForms: formsModule.createForms,
	delete: formsModule.deleteForm,
	clone: formsModule.clone,
	getFiles: formsModule.getFiles,
	getQuestions: formsModule.getQuestions,
	getQuestion: formsModule.getQuestion,
	createQuestion: formsModule.createQuestion,
	createQuestions: formsModule.createQuestions,
	updateQuestion: formsModule.updateQuestion,
	deleteQuestion: formsModule.deleteQuestion,
	getProperties: formsModule.getProperties,
	getProperty: formsModule.getProperty,
	setProperties: formsModule.setProperties,
	getReports: formsModule.getReports,
	createReport: formsModule.createReport,
	getSubmissions: formsModule.getSubmissions,
	createSubmission: formsModule.createSubmission,
	createSubmissions: formsModule.createSubmissions,
};

export const Submissions = {
	get: submissionsModule.get,
	update: submissionsModule.update,
	delete: submissionsModule.deleteSubmission,
};

export const Reports = {
	get: reportsModule.get,
	delete: reportsModule.deleteReport,
};

export const Folders = {
	get: foldersModule.get,
	create: foldersModule.create,
	update: foldersModule.update,
	delete: foldersModule.deleteFolder,
};

export const Labels = {
	get: labelsModule.get,
	create: labelsModule.create,
	update: labelsModule.update,
	delete: labelsModule.deleteLabel,
	getResources: labelsModule.getResources,
	addResources: labelsModule.addResources,
	removeResources: labelsModule.removeResources,
};

export const System = {
	getPlan: systemModule.getPlan,
};

export * from './types';
