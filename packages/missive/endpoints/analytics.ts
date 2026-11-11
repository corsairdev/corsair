import { defineEndpoint } from './factory';

export const createReport = defineEndpoint('analytics.createReport');
export const getReport = defineEndpoint('analytics.getReport');

export const endpoints = {
	createReport,
	getReport,
} as const;
