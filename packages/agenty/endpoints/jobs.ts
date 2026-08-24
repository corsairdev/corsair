import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const downloadAgentResultRoute = getRoute('downloadAgentResult');
export const downloadAgentResult: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, downloadAgentResultRoute);
};

const getAgentResultRoute = getRoute('getAgentResult');
export const getAgentResult: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getAgentResultRoute);
};

const getJobResultRoute = getRoute('getJobResult');
export const getJobResult: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getJobResultRoute);
};

const jobsDownloadRoute = getRoute('jobsDownload');
export const jobsDownload: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsDownloadRoute);
};

const jobsDownloadFilesByIdRoute = getRoute('jobsDownloadFilesById');
export const jobsDownloadFilesById: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, jobsDownloadFilesByIdRoute);
};

const jobsDownloadResultByIdRoute = getRoute('jobsDownloadResultById');
export const jobsDownloadResultById: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, jobsDownloadResultByIdRoute);
};

const jobsGetAllRoute = getRoute('jobsGetAll');
export const jobsGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsGetAllRoute);
};

const jobsGetByIdRoute = getRoute('jobsGetById');
export const jobsGetById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsGetByIdRoute);
};

const jobsGetLogsByIdRoute = getRoute('jobsGetLogsById');
export const jobsGetLogsById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsGetLogsByIdRoute);
};

const jobsListFilesByIdRoute = getRoute('jobsListFilesById');
export const jobsListFilesById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsListFilesByIdRoute);
};

const jobsStartRoute = getRoute('jobsStart');
export const jobsStart: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsStartRoute);
};

const jobsStopByIdRoute = getRoute('jobsStopById');
export const jobsStopById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, jobsStopByIdRoute);
};

export const JobsEndpoints = {
	downloadAgentResult,
	getAgentResult,
	getJobResult,
	jobsDownload,
	jobsDownloadFilesById,
	jobsDownloadResultById,
	jobsGetAll,
	jobsGetById,
	jobsGetLogsById,
	jobsListFilesById,
	jobsStart,
	jobsStopById,
} as const;
