import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateConnectConfigurationForAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateConnectConfigurationForAccountOutputSchema = z
	.object({})
	.passthrough();

export type CreateConnectConfigurationForAccountParams = z.infer<
	typeof CreateConnectConfigurationForAccountInputSchema
>;

export const createConnectConfigurationForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateConnectConfigurationForAccountParams,
) => {
	const input = CreateConnectConfigurationForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateConnectConfigurationForAccountOutputSchema.parse(data);
};

export const DeleteConnectConfigurationInputSchema = z.object({
	connectId: z.string(),
});

export const DeleteConnectConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type DeleteConnectConfigurationParams = z.infer<
	typeof DeleteConnectConfigurationInputSchema
>;

export const deleteConnectConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteConnectConfigurationParams,
) => {
	const input = DeleteConnectConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/connect/${encodeURIComponent(input.connectId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteConnectConfigurationOutputSchema.parse(data);
};

export const DeleteConnectFailureLogEntryInputSchema = z.object({
	failureId: z.string(),
});

export const DeleteConnectFailureLogEntryOutputSchema = z
	.object({})
	.passthrough();

export type DeleteConnectFailureLogEntryParams = z.infer<
	typeof DeleteConnectFailureLogEntryInputSchema
>;

export const deleteConnectFailureLogEntry = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteConnectFailureLogEntryParams,
) => {
	const input = DeleteConnectFailureLogEntryInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/connect/failures/${encodeURIComponent(input.failureId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteConnectFailureLogEntryOutputSchema.parse(data);
};

export const DeleteConnectLogEntriesInputSchema = z.object({});

export const DeleteConnectLogEntriesOutputSchema = z.object({}).passthrough();

export type DeleteConnectLogEntriesParams = z.infer<
	typeof DeleteConnectLogEntriesInputSchema
>;

export const deleteConnectLogEntries = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteConnectLogEntriesParams,
) => {
	const input = DeleteConnectLogEntriesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/logs`, {
		method: 'DELETE',
	});
	return DeleteConnectLogEntriesOutputSchema.parse(data);
};

export const DeleteConnectOauthConfigurationInputSchema = z.object({});

export const DeleteConnectOauthConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type DeleteConnectOauthConfigurationParams = z.infer<
	typeof DeleteConnectOauthConfigurationInputSchema
>;

export const deleteConnectOauthConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteConnectOauthConfigurationParams,
) => {
	const input = DeleteConnectOauthConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/oauth`, {
		method: 'DELETE',
	});
	return DeleteConnectOauthConfigurationOutputSchema.parse(data);
};

export const DeleteSpecificConnectLogEntryInputSchema = z.object({
	logId: z.string(),
});

export const DeleteSpecificConnectLogEntryOutputSchema = z
	.object({})
	.passthrough();

export type DeleteSpecificConnectLogEntryParams = z.infer<
	typeof DeleteSpecificConnectLogEntryInputSchema
>;

export const deleteSpecificConnectLogEntry = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteSpecificConnectLogEntryParams,
) => {
	const input = DeleteSpecificConnectLogEntryInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/connect/logs/${encodeURIComponent(input.logId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteSpecificConnectLogEntryOutputSchema.parse(data);
};

export const RepublishConnectDataForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const RepublishConnectDataForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type RepublishConnectDataForEnvelopeParams = z.infer<
	typeof RepublishConnectDataForEnvelopeInputSchema
>;

export const republishConnectDataForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: RepublishConnectDataForEnvelopeParams,
) => {
	const input = RepublishConnectDataForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/connect/envelopes/${encodeURIComponent(input.envelopeId)}/retry_queue`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return RepublishConnectDataForEnvelopeOutputSchema.parse(data);
};

export const RepublishConnectInfoForEnvelopesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const RepublishConnectInfoForEnvelopesOutputSchema = z
	.object({})
	.passthrough();

export type RepublishConnectInfoForEnvelopesParams = z.infer<
	typeof RepublishConnectInfoForEnvelopesInputSchema
>;

export const republishConnectInfoForEnvelopes = async (
	ctxOrClient: DocusignExecutionContext,
	params: RepublishConnectInfoForEnvelopesParams,
) => {
	const input = RepublishConnectInfoForEnvelopesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/envelopes/retry_queue`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return RepublishConnectInfoForEnvelopesOutputSchema.parse(data);
};

export const RetrieveConnectConfigurationDetailsInputSchema = z.object({
	connectId: z.string(),
});

export const RetrieveConnectConfigurationDetailsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveConnectConfigurationDetailsParams = z.infer<
	typeof RetrieveConnectConfigurationDetailsInputSchema
>;

export const retrieveConnectConfigurationDetails = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectConfigurationDetailsParams,
) => {
	const input = RetrieveConnectConfigurationDetailsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/connect/${encodeURIComponent(input.connectId)}`,
		{
			method: 'GET',
		},
	);
	return RetrieveConnectConfigurationDetailsOutputSchema.parse(data);
};

export const RetrieveConnectConfigurationsInputSchema = z.object({});

export const RetrieveConnectConfigurationsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveConnectConfigurationsParams = z.infer<
	typeof RetrieveConnectConfigurationsInputSchema
>;

export const retrieveConnectConfigurations = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectConfigurationsParams,
) => {
	const input = RetrieveConnectConfigurationsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect`, {
		method: 'GET',
	});
	return RetrieveConnectConfigurationsOutputSchema.parse(data);
};

export const RetrieveConnectFailureLogsInputSchema = z.object({
	from_date: z.string().optional(),
	to_date: z.string().optional(),
});

export const RetrieveConnectFailureLogsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveConnectFailureLogsParams = z.infer<
	typeof RetrieveConnectFailureLogsInputSchema
>;

export const retrieveConnectFailureLogs = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectFailureLogsParams,
) => {
	const input = RetrieveConnectFailureLogsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/connect/failures` + qs, {
		method: 'GET',
	});
	return RetrieveConnectFailureLogsOutputSchema.parse(data);
};

export const RetrieveConnectLogEntryInputSchema = z.object({
	logId: z.string(),
	additional_info: z.string().optional(),
});

export const RetrieveConnectLogEntryOutputSchema = z.object({}).passthrough();

export type RetrieveConnectLogEntryParams = z.infer<
	typeof RetrieveConnectLogEntryInputSchema
>;

export const retrieveConnectLogEntry = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectLogEntryParams,
) => {
	const input = RetrieveConnectLogEntryInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.additional_info !== undefined)
		query.append('additional_info', String(input.additional_info));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/connect/logs/${encodeURIComponent(input.logId)}` + qs,
		{
			method: 'GET',
		},
	);
	return RetrieveConnectLogEntryOutputSchema.parse(data);
};

export const RetrieveConnectLogsInputSchema = z.object({
	from_date: z.string().optional(),
	to_date: z.string().optional(),
});

export const RetrieveConnectLogsOutputSchema = z.object({}).passthrough();

export type RetrieveConnectLogsParams = z.infer<
	typeof RetrieveConnectLogsInputSchema
>;

export const retrieveConnectLogs = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectLogsParams,
) => {
	const input = RetrieveConnectLogsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.from_date !== undefined)
		query.append('from_date', String(input.from_date));
	if (input.to_date !== undefined)
		query.append('to_date', String(input.to_date));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/connect/logs` + qs, {
		method: 'GET',
	});
	return RetrieveConnectLogsOutputSchema.parse(data);
};

export const RetrieveConnectOauthConfigurationInputSchema = z.object({});

export const RetrieveConnectOauthConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveConnectOauthConfigurationParams = z.infer<
	typeof RetrieveConnectOauthConfigurationInputSchema
>;

export const retrieveConnectOauthConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveConnectOauthConfigurationParams,
) => {
	const input = RetrieveConnectOauthConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/oauth`, {
		method: 'GET',
	});
	return RetrieveConnectOauthConfigurationOutputSchema.parse(data);
};

export const ReturnAllConnectServiceUsersInputSchema = z.object({
	connectId: z.string(),
	count: z.string().optional(),
	domain_users_only: z.string().optional(),
	email_substring: z.string().optional(),
	start_position: z.string().optional(),
	status: z.string().optional(),
	user_name_substring: z.string().optional(),
});

export const ReturnAllConnectServiceUsersOutputSchema = z
	.object({})
	.passthrough();

export type ReturnAllConnectServiceUsersParams = z.infer<
	typeof ReturnAllConnectServiceUsersInputSchema
>;

export const returnAllConnectServiceUsers = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnAllConnectServiceUsersParams,
) => {
	const input = ReturnAllConnectServiceUsersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.domain_users_only !== undefined)
		query.append('domain_users_only', String(input.domain_users_only));
	if (input.email_substring !== undefined)
		query.append('email_substring', String(input.email_substring));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.status !== undefined) query.append('status', String(input.status));
	if (input.user_name_substring !== undefined)
		query.append('user_name_substring', String(input.user_name_substring));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/connect/${encodeURIComponent(input.connectId)}/all/users` + qs,
		{
			method: 'GET',
		},
	);
	return ReturnAllConnectServiceUsersOutputSchema.parse(data);
};

export const ReturnUsersFromConnectServiceInputSchema = z.object({
	connectId: z.string(),
	count: z.string().optional(),
	email_substring: z.string().optional(),
	list_included_users: z.string().optional(),
	start_position: z.string().optional(),
	status: z.string().optional(),
	user_name_substring: z.string().optional(),
});

export const ReturnUsersFromConnectServiceOutputSchema = z
	.object({})
	.passthrough();

export type ReturnUsersFromConnectServiceParams = z.infer<
	typeof ReturnUsersFromConnectServiceInputSchema
>;

export const returnUsersFromConnectService = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnUsersFromConnectServiceParams,
) => {
	const input = ReturnUsersFromConnectServiceInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.email_substring !== undefined)
		query.append('email_substring', String(input.email_substring));
	if (input.list_included_users !== undefined)
		query.append('list_included_users', String(input.list_included_users));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.status !== undefined) query.append('status', String(input.status));
	if (input.user_name_substring !== undefined)
		query.append('user_name_substring', String(input.user_name_substring));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/connect/${encodeURIComponent(input.connectId)}/users` + qs,
		{
			method: 'GET',
		},
	);
	return ReturnUsersFromConnectServiceOutputSchema.parse(data);
};

export const SetUpConnectOauthConfigurationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SetUpConnectOauthConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type SetUpConnectOauthConfigurationParams = z.infer<
	typeof SetUpConnectOauthConfigurationInputSchema
>;

export const setUpConnectOauthConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetUpConnectOauthConfigurationParams,
) => {
	const input = SetUpConnectOauthConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/oauth`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return SetUpConnectOauthConfigurationOutputSchema.parse(data);
};

export const UpdateConnectOauthConfigurationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateConnectOauthConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateConnectOauthConfigurationParams = z.infer<
	typeof UpdateConnectOauthConfigurationInputSchema
>;

export const updateConnectOauthConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateConnectOauthConfigurationParams,
) => {
	const input = UpdateConnectOauthConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/oauth`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateConnectOauthConfigurationOutputSchema.parse(data);
};

export const UpdateDocusignConnectConfigurationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateDocusignConnectConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateDocusignConnectConfigurationParams = z.infer<
	typeof UpdateDocusignConnectConfigurationInputSchema
>;

export const updateDocusignConnectConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateDocusignConnectConfigurationParams,
) => {
	const input = UpdateDocusignConnectConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateDocusignConnectConfigurationOutputSchema.parse(data);
};

export const ConnectInputSchemas = {
	createConnectConfigurationForAccount:
		CreateConnectConfigurationForAccountInputSchema,
	deleteConnectConfiguration: DeleteConnectConfigurationInputSchema,
	deleteConnectFailureLogEntry: DeleteConnectFailureLogEntryInputSchema,
	deleteConnectLogEntries: DeleteConnectLogEntriesInputSchema,
	deleteConnectOauthConfiguration: DeleteConnectOauthConfigurationInputSchema,
	deleteSpecificConnectLogEntry: DeleteSpecificConnectLogEntryInputSchema,
	republishConnectDataForEnvelope: RepublishConnectDataForEnvelopeInputSchema,
	republishConnectInfoForEnvelopes: RepublishConnectInfoForEnvelopesInputSchema,
	retrieveConnectConfigurationDetails:
		RetrieveConnectConfigurationDetailsInputSchema,
	retrieveConnectConfigurations: RetrieveConnectConfigurationsInputSchema,
	retrieveConnectFailureLogs: RetrieveConnectFailureLogsInputSchema,
	retrieveConnectLogEntry: RetrieveConnectLogEntryInputSchema,
	retrieveConnectLogs: RetrieveConnectLogsInputSchema,
	retrieveConnectOauthConfiguration:
		RetrieveConnectOauthConfigurationInputSchema,
	returnAllConnectServiceUsers: ReturnAllConnectServiceUsersInputSchema,
	returnUsersFromConnectService: ReturnUsersFromConnectServiceInputSchema,
	setUpConnectOauthConfiguration: SetUpConnectOauthConfigurationInputSchema,
	updateConnectOauthConfiguration: UpdateConnectOauthConfigurationInputSchema,
	updateDocusignConnectConfiguration:
		UpdateDocusignConnectConfigurationInputSchema,
};

export const ConnectOutputSchemas = {
	createConnectConfigurationForAccount:
		CreateConnectConfigurationForAccountOutputSchema,
	deleteConnectConfiguration: DeleteConnectConfigurationOutputSchema,
	deleteConnectFailureLogEntry: DeleteConnectFailureLogEntryOutputSchema,
	deleteConnectLogEntries: DeleteConnectLogEntriesOutputSchema,
	deleteConnectOauthConfiguration: DeleteConnectOauthConfigurationOutputSchema,
	deleteSpecificConnectLogEntry: DeleteSpecificConnectLogEntryOutputSchema,
	republishConnectDataForEnvelope: RepublishConnectDataForEnvelopeOutputSchema,
	republishConnectInfoForEnvelopes:
		RepublishConnectInfoForEnvelopesOutputSchema,
	retrieveConnectConfigurationDetails:
		RetrieveConnectConfigurationDetailsOutputSchema,
	retrieveConnectConfigurations: RetrieveConnectConfigurationsOutputSchema,
	retrieveConnectFailureLogs: RetrieveConnectFailureLogsOutputSchema,
	retrieveConnectLogEntry: RetrieveConnectLogEntryOutputSchema,
	retrieveConnectLogs: RetrieveConnectLogsOutputSchema,
	retrieveConnectOauthConfiguration:
		RetrieveConnectOauthConfigurationOutputSchema,
	returnAllConnectServiceUsers: ReturnAllConnectServiceUsersOutputSchema,
	returnUsersFromConnectService: ReturnUsersFromConnectServiceOutputSchema,
	setUpConnectOauthConfiguration: SetUpConnectOauthConfigurationOutputSchema,
	updateConnectOauthConfiguration: UpdateConnectOauthConfigurationOutputSchema,
	updateDocusignConnectConfiguration:
		UpdateDocusignConnectConfigurationOutputSchema,
};
