import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const DeleteRequestLogFilesInputSchema = z.object({});

export const DeleteRequestLogFilesOutputSchema = z.object({}).passthrough();

export type DeleteRequestLogFilesParams = z.infer<
	typeof DeleteRequestLogFilesInputSchema
>;

export const deleteRequestLogFiles = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteRequestLogFilesParams,
) => {
	const input = DeleteRequestLogFilesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/diagnostics/request_logs`, {
		method: 'DELETE',
	});
	return DeleteRequestLogFilesOutputSchema.parse(data);
};

export const GetRequestLoggingLogFileInputSchema = z.object({
	requestLogId: z.string(),
});

export const GetRequestLoggingLogFileOutputSchema = z.object({}).passthrough();

export type GetRequestLoggingLogFileParams = z.infer<
	typeof GetRequestLoggingLogFileInputSchema
>;

export const getRequestLoggingLogFile = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetRequestLoggingLogFileParams,
) => {
	const input = GetRequestLoggingLogFileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/v2.1/diagnostics/request_logs/${input.requestLogId}`,
		{
			method: 'GET',
		},
	);
	return GetRequestLoggingLogFileOutputSchema.parse(data);
};

export const GetRequestLogsInputSchema = z.object({
	encoding: z.string().optional(),
});

export const GetRequestLogsOutputSchema = z.object({}).passthrough();

export type GetRequestLogsParams = z.infer<typeof GetRequestLogsInputSchema>;

export const getRequestLogs = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetRequestLogsParams,
) => {
	const input = GetRequestLogsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.encoding !== undefined)
		query.append('encoding', String(input.encoding));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/v2.1/diagnostics/request_logs` + qs, {
		method: 'GET',
	});
	return GetRequestLogsOutputSchema.parse(data);
};

export const GetRequestLogSettingsInputSchema = z.object({});

export const GetRequestLogSettingsOutputSchema = z.object({}).passthrough();

export type GetRequestLogSettingsParams = z.infer<
	typeof GetRequestLogSettingsInputSchema
>;

export const getRequestLogSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetRequestLogSettingsParams,
) => {
	const input = GetRequestLogSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/diagnostics/settings`, {
		method: 'GET',
	});
	return GetRequestLogSettingsOutputSchema.parse(data);
};

export const GetResourceInformationInputSchema = z.object({});

export const GetResourceInformationOutputSchema = z.object({}).passthrough();

export type GetResourceInformationParams = z.infer<
	typeof GetResourceInformationInputSchema
>;

export const getResourceInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetResourceInformationParams,
) => {
	const input = GetResourceInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1`, {
		method: 'GET',
	});
	return GetResourceInformationOutputSchema.parse(data);
};

export const GetServiceInformationInputSchema = z.object({});

export const GetServiceInformationOutputSchema = z.object({}).passthrough();

export type GetServiceInformationParams = z.infer<
	typeof GetServiceInformationInputSchema
>;

export const getServiceInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetServiceInformationParams,
) => {
	const input = GetServiceInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/service_information`, {
		method: 'GET',
	});
	return GetServiceInformationOutputSchema.parse(data);
};

export const ToggleApiRequestLoggingInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ToggleApiRequestLoggingOutputSchema = z.object({}).passthrough();

export type ToggleApiRequestLoggingParams = z.infer<
	typeof ToggleApiRequestLoggingInputSchema
>;

export const toggleApiRequestLogging = async (
	ctxOrClient: DocusignExecutionContext,
	params: ToggleApiRequestLoggingParams,
) => {
	const input = ToggleApiRequestLoggingInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/diagnostics/settings`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return ToggleApiRequestLoggingOutputSchema.parse(data);
};

export const DiagnosticsInputSchemas = {
	deleteRequestLogFiles: DeleteRequestLogFilesInputSchema,
	getRequestLoggingLogFile: GetRequestLoggingLogFileInputSchema,
	getRequestLogs: GetRequestLogsInputSchema,
	getRequestLogSettings: GetRequestLogSettingsInputSchema,
	getResourceInformation: GetResourceInformationInputSchema,
	getServiceInformation: GetServiceInformationInputSchema,
	toggleApiRequestLogging: ToggleApiRequestLoggingInputSchema,
};

export const DiagnosticsOutputSchemas = {
	deleteRequestLogFiles: DeleteRequestLogFilesOutputSchema,
	getRequestLoggingLogFile: GetRequestLoggingLogFileOutputSchema,
	getRequestLogs: GetRequestLogsOutputSchema,
	getRequestLogSettings: GetRequestLogSettingsOutputSchema,
	getResourceInformation: GetResourceInformationOutputSchema,
	getServiceInformation: GetServiceInformationOutputSchema,
	toggleApiRequestLogging: ToggleApiRequestLoggingOutputSchema,
};
