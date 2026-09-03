import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddOrUpdateAccountStampsInputSchema = z.object({
	decode_only: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddOrUpdateAccountStampsOutputSchema = z.object({}).passthrough();

export type AddOrUpdateAccountStampsParams = z.infer<
	typeof AddOrUpdateAccountStampsInputSchema
>;

export const addOrUpdateAccountStamps = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddOrUpdateAccountStampsParams,
) => {
	const input = AddOrUpdateAccountStampsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.decode_only !== undefined)
		query.append('decode_only', String(input.decode_only));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/signatures` + qs, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return AddOrUpdateAccountStampsOutputSchema.parse(data);
};

export const CreateAccountCustomFieldInputSchema = z.object({
	apply_to_templates: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateAccountCustomFieldOutputSchema = z.object({}).passthrough();

export type CreateAccountCustomFieldParams = z.infer<
	typeof CreateAccountCustomFieldInputSchema
>;

export const createAccountCustomField = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateAccountCustomFieldParams,
) => {
	const input = CreateAccountCustomFieldInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.apply_to_templates !== undefined)
		query.append('apply_to_templates', String(input.apply_to_templates));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/custom_fields` + qs, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateAccountCustomFieldOutputSchema.parse(data);
};

export const CreateBccEmailArchiveConfigurationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateBccEmailArchiveConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type CreateBccEmailArchiveConfigurationParams = z.infer<
	typeof CreateBccEmailArchiveConfigurationInputSchema
>;

export const createBccEmailArchiveConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateBccEmailArchiveConfigurationParams,
) => {
	const input = CreateBccEmailArchiveConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/bcc_email_archives`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateBccEmailArchiveConfigurationOutputSchema.parse(data);
};

export const DeleteAccountCustomFieldInputSchema = z.object({
	customFieldId: z.string(),
	apply_to_templates: z.string().optional(),
});

export const DeleteAccountCustomFieldOutputSchema = z.object({}).passthrough();

export type DeleteAccountCustomFieldParams = z.infer<
	typeof DeleteAccountCustomFieldInputSchema
>;

export const deleteAccountCustomField = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteAccountCustomFieldParams,
) => {
	const input = DeleteAccountCustomFieldInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.apply_to_templates !== undefined)
		query.append('apply_to_templates', String(input.apply_to_templates));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/custom_fields/${encodeURIComponent(input.customFieldId)}` + qs,
		{
			method: 'DELETE',
		},
	);
	return DeleteAccountCustomFieldOutputSchema.parse(data);
};

export const DeleteAccountStampInputSchema = z.object({
	signatureId: z.string(),
});

export const DeleteAccountStampOutputSchema = z.object({}).passthrough();

export type DeleteAccountStampParams = z.infer<
	typeof DeleteAccountStampInputSchema
>;

export const deleteAccountStamp = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteAccountStampParams,
) => {
	const input = DeleteAccountStampInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signatures/${encodeURIComponent(input.signatureId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteAccountStampOutputSchema.parse(data);
};

export const DeleteBccEmailArchiveConfigurationInputSchema = z.object({
	bccEmailArchiveId: z.string(),
});

export const DeleteBccEmailArchiveConfigurationOutputSchema = z
	.object({})
	.passthrough();

export type DeleteBccEmailArchiveConfigurationParams = z.infer<
	typeof DeleteBccEmailArchiveConfigurationInputSchema
>;

export const deleteBccEmailArchiveConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteBccEmailArchiveConfigurationParams,
) => {
	const input = DeleteBccEmailArchiveConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/settings/bcc_email_archives/${encodeURIComponent(input.bccEmailArchiveId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteBccEmailArchiveConfigurationOutputSchema.parse(data);
};

export const DeleteEnoteConfigurationInputSchema = z.object({});

export const DeleteEnoteConfigurationOutputSchema = z.object({}).passthrough();

export type DeleteEnoteConfigurationParams = z.infer<
	typeof DeleteEnoteConfigurationInputSchema
>;

export const deleteEnoteConfiguration = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnoteConfigurationParams,
) => {
	const input = DeleteEnoteConfigurationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/enote_configuration`, {
		method: 'DELETE',
	});
	return DeleteEnoteConfigurationOutputSchema.parse(data);
};

export const DeleteSignatureForCaptiveRecipientsInputSchema = z.object({
	recipientPart: z.string(),
});

export const DeleteSignatureForCaptiveRecipientsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteSignatureForCaptiveRecipientsParams = z.infer<
	typeof DeleteSignatureForCaptiveRecipientsInputSchema
>;

export const deleteSignatureForCaptiveRecipients = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteSignatureForCaptiveRecipientsParams,
) => {
	const input = DeleteSignatureForCaptiveRecipientsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/captive_recipients/${encodeURIComponent(input.recipientPart)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteSignatureForCaptiveRecipientsOutputSchema.parse(data);
};

export const DeleteSpecifiedAccountInputSchema = z.object({
	redact_user_data: z.string().optional(),
});

export const DeleteSpecifiedAccountOutputSchema = z.object({}).passthrough();

export type DeleteSpecifiedAccountParams = z.infer<
	typeof DeleteSpecifiedAccountInputSchema
>;

export const deleteSpecifiedAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteSpecifiedAccountParams,
) => {
	const input = DeleteSpecifiedAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.redact_user_data !== undefined)
		query.append('redact_user_data', String(input.redact_user_data));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`` + qs, {
		method: 'DELETE',
	});
	return DeleteSpecifiedAccountOutputSchema.parse(data);
};

export const DeleteStampImageForAccountInputSchema = z.object({
	signatureId: z.string(),
	imageType: z.string(),
});

export const DeleteStampImageForAccountOutputSchema = z
	.object({})
	.passthrough();

export type DeleteStampImageForAccountParams = z.infer<
	typeof DeleteStampImageForAccountInputSchema
>;

export const deleteStampImageForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteStampImageForAccountParams,
) => {
	const input = DeleteStampImageForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signatures/${encodeURIComponent(input.signatureId)}/${encodeURIComponent(input.imageType)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteStampImageForAccountOutputSchema.parse(data);
};

export const GetAccountBillingChargesListInputSchema = z.object({
	include_charges: z.string().optional(),
});

export const GetAccountBillingChargesListOutputSchema = z
	.object({})
	.passthrough();

export type GetAccountBillingChargesListParams = z.infer<
	typeof GetAccountBillingChargesListInputSchema
>;

export const getAccountBillingChargesList = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetAccountBillingChargesListParams,
) => {
	const input = GetAccountBillingChargesListInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_charges !== undefined)
		query.append('include_charges', String(input.include_charges));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/billing_charges` + qs, {
		method: 'GET',
	});
	return GetAccountBillingChargesListOutputSchema.parse(data);
};

export const GetAccountPasswordRulesInputSchema = z.object({});

export const GetAccountPasswordRulesOutputSchema = z.object({}).passthrough();

export type GetAccountPasswordRulesParams = z.infer<
	typeof GetAccountPasswordRulesInputSchema
>;

export const getAccountPasswordRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetAccountPasswordRulesParams,
) => {
	const input = GetAccountPasswordRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/password_rules`, {
		method: 'GET',
	});
	return GetAccountPasswordRulesOutputSchema.parse(data);
};

export const GetAccountStampImageInputSchema = z.object({
	signatureId: z.string(),
	imageType: z.string(),
	include_chrome: z.string().optional(),
});

export const GetAccountStampImageOutputSchema = z.unknown();

export type GetAccountStampImageParams = z.infer<
	typeof GetAccountStampImageInputSchema
>;

export const getAccountStampImage = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetAccountStampImageParams,
) => {
	const input = GetAccountStampImageInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_chrome !== undefined)
		query.append('include_chrome', String(input.include_chrome));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/signatures/${encodeURIComponent(input.signatureId)}/${encodeURIComponent(input.imageType)}` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetAccountStampImageOutputSchema.parse(data);
};

export const GetBccEmailArchiveConfigurationsInputSchema = z.object({
	count: z.string().optional(),
	start_position: z.string().optional(),
});

export const GetBccEmailArchiveConfigurationsOutputSchema = z
	.object({})
	.passthrough();

export type GetBccEmailArchiveConfigurationsParams = z.infer<
	typeof GetBccEmailArchiveConfigurationsInputSchema
>;

export const getBccEmailArchiveConfigurations = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBccEmailArchiveConfigurationsParams,
) => {
	const input = GetBccEmailArchiveConfigurationsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/settings/bcc_email_archives` + qs, {
		method: 'GET',
	});
	return GetBccEmailArchiveConfigurationsOutputSchema.parse(data);
};

export const GetBccemailArchiveHistoryInputSchema = z.object({
	bccEmailArchiveId: z.string(),
	count: z.string().optional(),
	start_position: z.string().optional(),
});

export const GetBccemailArchiveHistoryOutputSchema = z.object({}).passthrough();

export type GetBccemailArchiveHistoryParams = z.infer<
	typeof GetBccemailArchiveHistoryInputSchema
>;

export const getBccemailArchiveHistory = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBccemailArchiveHistoryParams,
) => {
	const input = GetBccemailArchiveHistoryInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/settings/bcc_email_archives/${encodeURIComponent(input.bccEmailArchiveId)}` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetBccemailArchiveHistoryOutputSchema.parse(data);
};

export const GetElectronicRecordAndSignatureDisclosureInputSchema = z.object({
	langCode: z.string().optional(),
});

export const GetElectronicRecordAndSignatureDisclosureOutputSchema = z
	.object({})
	.passthrough();

export type GetElectronicRecordAndSignatureDisclosureParams = z.infer<
	typeof GetElectronicRecordAndSignatureDisclosureInputSchema
>;

export const getElectronicRecordAndSignatureDisclosure = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetElectronicRecordAndSignatureDisclosureParams,
) => {
	const input =
		GetElectronicRecordAndSignatureDisclosureInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.langCode !== undefined)
		query.append('langCode', String(input.langCode));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/consumer_disclosure` + qs, {
		method: 'GET',
	});
	return GetElectronicRecordAndSignatureDisclosureOutputSchema.parse(data);
};

export const GetEnoteIntegrationSettingsInputSchema = z.object({});

export const GetEnoteIntegrationSettingsOutputSchema = z
	.object({})
	.passthrough();

export type GetEnoteIntegrationSettingsParams = z.infer<
	typeof GetEnoteIntegrationSettingsInputSchema
>;

export const getEnoteIntegrationSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnoteIntegrationSettingsParams,
) => {
	const input = GetEnoteIntegrationSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/enote_configuration`, {
		method: 'GET',
	});
	return GetEnoteIntegrationSettingsOutputSchema.parse(data);
};

export const GetSpecifiedAccountStampInfoInputSchema = z.object({
	signatureId: z.string(),
});

export const GetSpecifiedAccountStampInfoOutputSchema = z
	.object({})
	.passthrough();

export type GetSpecifiedAccountStampInfoParams = z.infer<
	typeof GetSpecifiedAccountStampInfoInputSchema
>;

export const getSpecifiedAccountStampInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetSpecifiedAccountStampInfoParams,
) => {
	const input = GetSpecifiedAccountStampInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/signatures/${encodeURIComponent(input.signatureId)}`,
		{
			method: 'GET',
		},
	);
	return GetSpecifiedAccountStampInfoOutputSchema.parse(data);
};

export const GetSupportedLanguagesForRecipientsInputSchema = z.object({});

export const GetSupportedLanguagesForRecipientsOutputSchema = z
	.object({})
	.passthrough();

export type GetSupportedLanguagesForRecipientsParams = z.infer<
	typeof GetSupportedLanguagesForRecipientsInputSchema
>;

export const getSupportedLanguagesForRecipients = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetSupportedLanguagesForRecipientsParams,
) => {
	const input = GetSupportedLanguagesForRecipientsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/supported_languages`, {
		method: 'GET',
	});
	return GetSupportedLanguagesForRecipientsOutputSchema.parse(data);
};

export const GetTabSettingsForAccountInputSchema = z.object({});

export const GetTabSettingsForAccountOutputSchema = z.object({}).passthrough();

export type GetTabSettingsForAccountParams = z.infer<
	typeof GetTabSettingsForAccountInputSchema
>;

export const getTabSettingsForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTabSettingsForAccountParams,
) => {
	const input = GetTabSettingsForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/tabs`, {
		method: 'GET',
	});
	return GetTabSettingsForAccountOutputSchema.parse(data);
};

export const GetUnsupportedFileTypesListInputSchema = z.object({});

export const GetUnsupportedFileTypesListOutputSchema = z
	.object({})
	.passthrough();

export type GetUnsupportedFileTypesListParams = z.infer<
	typeof GetUnsupportedFileTypesListInputSchema
>;

export const getUnsupportedFileTypesList = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetUnsupportedFileTypesListParams,
) => {
	const input = GetUnsupportedFileTypesListInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/unsupported_file_types`, {
		method: 'GET',
	});
	return GetUnsupportedFileTypesListOutputSchema.parse(data);
};

export const GetWatermarkDetailsForAccountInputSchema = z.object({});

export const GetWatermarkDetailsForAccountOutputSchema = z
	.object({})
	.passthrough();

export type GetWatermarkDetailsForAccountParams = z.infer<
	typeof GetWatermarkDetailsForAccountInputSchema
>;

export const getWatermarkDetailsForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetWatermarkDetailsForAccountParams,
) => {
	const input = GetWatermarkDetailsForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/watermark`, {
		method: 'GET',
	});
	return GetWatermarkDetailsForAccountOutputSchema.parse(data);
};

export const ListSignatureProvidersForAccountInputSchema = z.object({});

export const ListSignatureProvidersForAccountOutputSchema = z
	.object({})
	.passthrough();

export type ListSignatureProvidersForAccountParams = z.infer<
	typeof ListSignatureProvidersForAccountInputSchema
>;

export const listSignatureProvidersForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListSignatureProvidersForAccountParams,
) => {
	const input = ListSignatureProvidersForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signatureProviders`, {
		method: 'GET',
	});
	return ListSignatureProvidersForAccountOutputSchema.parse(data);
};

export const ModifyAccountNotificationSettingsInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ModifyAccountNotificationSettingsOutputSchema = z
	.object({})
	.passthrough();

export type ModifyAccountNotificationSettingsParams = z.infer<
	typeof ModifyAccountNotificationSettingsInputSchema
>;

export const modifyAccountNotificationSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: ModifyAccountNotificationSettingsParams,
) => {
	const input = ModifyAccountNotificationSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/notification_defaults`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return ModifyAccountNotificationSettingsOutputSchema.parse(data);
};

export const ModifyTabSettingsForAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const ModifyTabSettingsForAccountOutputSchema = z
	.object({})
	.passthrough();

export type ModifyTabSettingsForAccountParams = z.infer<
	typeof ModifyTabSettingsForAccountInputSchema
>;

export const modifyTabSettingsForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ModifyTabSettingsForAccountParams,
) => {
	const input = ModifyTabSettingsForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/tabs`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return ModifyTabSettingsForAccountOutputSchema.parse(data);
};

export const RetrieveAccountEnvelopePurgeConfigInputSchema = z.object({});

export const RetrieveAccountEnvelopePurgeConfigOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountEnvelopePurgeConfigParams = z.infer<
	typeof RetrieveAccountEnvelopePurgeConfigInputSchema
>;

export const retrieveAccountEnvelopePurgeConfig = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountEnvelopePurgeConfigParams,
) => {
	const input = RetrieveAccountEnvelopePurgeConfigInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/envelope_purge_configuration`, {
		method: 'GET',
	});
	return RetrieveAccountEnvelopePurgeConfigOutputSchema.parse(data);
};

export const RetrieveAccountInformationForSpecifiedAccountInputSchema =
	z.object({
		include_account_settings: z.string().optional(),
		include_trial_eligibility: z.string().optional(),
	});

export const RetrieveAccountInformationForSpecifiedAccountOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountInformationForSpecifiedAccountParams = z.infer<
	typeof RetrieveAccountInformationForSpecifiedAccountInputSchema
>;

export const retrieveAccountInformationForSpecifiedAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountInformationForSpecifiedAccountParams,
) => {
	const input =
		RetrieveAccountInformationForSpecifiedAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_account_settings !== undefined)
		query.append(
			'include_account_settings',
			String(input.include_account_settings),
		);
	if (input.include_trial_eligibility !== undefined)
		query.append(
			'include_trial_eligibility',
			String(input.include_trial_eligibility),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`` + qs, {
		method: 'GET',
	});
	return RetrieveAccountInformationForSpecifiedAccountOutputSchema.parse(data);
};

export const RetrieveAccountProvisioningInfoInputSchema = z.object({});

export const RetrieveAccountProvisioningInfoOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountProvisioningInfoParams = z.infer<
	typeof RetrieveAccountProvisioningInfoInputSchema
>;

export const retrieveAccountProvisioningInfo = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountProvisioningInfoParams,
) => {
	const input = RetrieveAccountProvisioningInfoInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/v2.1/accounts/provisioning`, {
		method: 'GET',
	});
	return RetrieveAccountProvisioningInfoOutputSchema.parse(data);
};

export const RetrieveAccountSealProvidersInputSchema = z.object({});

export const RetrieveAccountSealProvidersOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountSealProvidersParams = z.infer<
	typeof RetrieveAccountSealProvidersInputSchema
>;

export const retrieveAccountSealProviders = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountSealProvidersParams,
) => {
	const input = RetrieveAccountSealProvidersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/seals`, {
		method: 'GET',
	});
	return RetrieveAccountSealProvidersOutputSchema.parse(data);
};

export const RetrieveAccountSettingsInformationInputSchema = z.object({});

export const RetrieveAccountSettingsInformationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountSettingsInformationParams = z.infer<
	typeof RetrieveAccountSettingsInformationInputSchema
>;

export const retrieveAccountSettingsInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountSettingsInformationParams,
) => {
	const input = RetrieveAccountSettingsInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings`, {
		method: 'GET',
	});
	return RetrieveAccountSettingsInformationOutputSchema.parse(data);
};

export const RetrieveAvailableAccountStampsInputSchema = z.object({
	stamp_format: z.string().optional(),
	stamp_name: z.string().optional(),
	stamp_type: z.string().optional(),
});

export const RetrieveAvailableAccountStampsOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAvailableAccountStampsParams = z.infer<
	typeof RetrieveAvailableAccountStampsInputSchema
>;

export const retrieveAvailableAccountStamps = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAvailableAccountStampsParams,
) => {
	const input = RetrieveAvailableAccountStampsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.stamp_format !== undefined)
		query.append('stamp_format', String(input.stamp_format));
	if (input.stamp_name !== undefined)
		query.append('stamp_name', String(input.stamp_name));
	if (input.stamp_type !== undefined)
		query.append('stamp_type', String(input.stamp_type));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/signatures` + qs, {
		method: 'GET',
	});
	return RetrieveAvailableAccountStampsOutputSchema.parse(data);
};

export const RetrieveSharedItemStatusForUsersInputSchema = z.object({
	count: z.string().optional(),
	envelopes_not_shared_user_status: z.string().optional(),
	folder_ids: z.string().optional(),
	item_type: z.string().optional(),
	search_text: z.string().optional(),
	shared: z.string().optional(),
	start_position: z.string().optional(),
	user_ids: z.string().optional(),
});

export const RetrieveSharedItemStatusForUsersOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveSharedItemStatusForUsersParams = z.infer<
	typeof RetrieveSharedItemStatusForUsersInputSchema
>;

export const retrieveSharedItemStatusForUsers = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveSharedItemStatusForUsersParams,
) => {
	const input = RetrieveSharedItemStatusForUsersInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.count !== undefined) query.append('count', String(input.count));
	if (input.envelopes_not_shared_user_status !== undefined)
		query.append(
			'envelopes_not_shared_user_status',
			String(input.envelopes_not_shared_user_status),
		);
	if (input.folder_ids !== undefined)
		query.append('folder_ids', String(input.folder_ids));
	if (input.item_type !== undefined)
		query.append('item_type', String(input.item_type));
	if (input.search_text !== undefined)
		query.append('search_text', String(input.search_text));
	if (input.shared !== undefined) query.append('shared', String(input.shared));
	if (input.start_position !== undefined)
		query.append('start_position', String(input.start_position));
	if (input.user_ids !== undefined)
		query.append('user_ids', String(input.user_ids));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/shared_access` + qs, {
		method: 'GET',
	});
	return RetrieveSharedItemStatusForUsersOutputSchema.parse(data);
};

export const SetEnvelopePurgeConfigForAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SetEnvelopePurgeConfigForAccountOutputSchema = z
	.object({})
	.passthrough();

export type SetEnvelopePurgeConfigForAccountParams = z.infer<
	typeof SetEnvelopePurgeConfigForAccountInputSchema
>;

export const setEnvelopePurgeConfigForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetEnvelopePurgeConfigForAccountParams,
) => {
	const input = SetEnvelopePurgeConfigForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/envelope_purge_configuration`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return SetEnvelopePurgeConfigForAccountOutputSchema.parse(data);
};

export const SetSharedAccessForUsersAndTemplatesInputSchema = z.object({
	item_type: z.string().optional(),
	preserve_existing_shared_access: z.string().optional(),
	user_ids: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SetSharedAccessForUsersAndTemplatesOutputSchema = z
	.object({})
	.passthrough();

export type SetSharedAccessForUsersAndTemplatesParams = z.infer<
	typeof SetSharedAccessForUsersAndTemplatesInputSchema
>;

export const setSharedAccessForUsersAndTemplates = async (
	ctxOrClient: DocusignExecutionContext,
	params: SetSharedAccessForUsersAndTemplatesParams,
) => {
	const input = SetSharedAccessForUsersAndTemplatesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.item_type !== undefined)
		query.append('item_type', String(input.item_type));
	if (input.preserve_existing_shared_access !== undefined)
		query.append(
			'preserve_existing_shared_access',
			String(input.preserve_existing_shared_access),
		);
	if (input.user_ids !== undefined)
		query.append('user_ids', String(input.user_ids));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/shared_access` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return SetSharedAccessForUsersAndTemplatesOutputSchema.parse(data);
};

export const UpdateAccountCustomFieldInputSchema = z.object({
	customFieldId: z.string(),
	apply_to_templates: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountCustomFieldOutputSchema = z.object({}).passthrough();

export type UpdateAccountCustomFieldParams = z.infer<
	typeof UpdateAccountCustomFieldInputSchema
>;

export const updateAccountCustomField = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountCustomFieldParams,
) => {
	const input = UpdateAccountCustomFieldInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.apply_to_templates !== undefined)
		query.append('apply_to_templates', String(input.apply_to_templates));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/custom_fields/${encodeURIComponent(input.customFieldId)}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateAccountCustomFieldOutputSchema.parse(data);
};

export const UpdateAccountPasswordRulesInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountPasswordRulesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateAccountPasswordRulesParams = z.infer<
	typeof UpdateAccountPasswordRulesInputSchema
>;

export const updateAccountPasswordRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountPasswordRulesParams,
) => {
	const input = UpdateAccountPasswordRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/password_rules`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountPasswordRulesOutputSchema.parse(data);
};

export const UpdateAccountSettingsInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountSettingsOutputSchema = z.object({}).passthrough();

export type UpdateAccountSettingsParams = z.infer<
	typeof UpdateAccountSettingsInputSchema
>;

export const updateAccountSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountSettingsParams,
) => {
	const input = UpdateAccountSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountSettingsOutputSchema.parse(data);
};

export const UpdateAccountStampByIdInputSchema = z.object({
	signatureId: z.string(),
	close_existing_signature: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountStampByIdOutputSchema = z.object({}).passthrough();

export type UpdateAccountStampByIdParams = z.infer<
	typeof UpdateAccountStampByIdInputSchema
>;

export const updateAccountStampById = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountStampByIdParams,
) => {
	const input = UpdateAccountStampByIdInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.close_existing_signature !== undefined)
		query.append(
			'close_existing_signature',
			String(input.close_existing_signature),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/signatures/${encodeURIComponent(input.signatureId)}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateAccountStampByIdOutputSchema.parse(data);
};

export const UpdateAccountStampsInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountStampsOutputSchema = z.object({}).passthrough();

export type UpdateAccountStampsParams = z.infer<
	typeof UpdateAccountStampsInputSchema
>;

export const updateAccountStamps = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountStampsParams,
) => {
	const input = UpdateAccountStampsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/signatures`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountStampsOutputSchema.parse(data);
};

export const UpdateAccountWatermarkInformationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountWatermarkInformationOutputSchema = z
	.object({})
	.passthrough();

export type UpdateAccountWatermarkInformationParams = z.infer<
	typeof UpdateAccountWatermarkInformationInputSchema
>;

export const updateAccountWatermarkInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountWatermarkInformationParams,
) => {
	const input = UpdateAccountWatermarkInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/watermark`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountWatermarkInformationOutputSchema.parse(data);
};

export const UpdateAccountWatermarkPreviewInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountWatermarkPreviewOutputSchema = z
	.object({})
	.passthrough();

export type UpdateAccountWatermarkPreviewParams = z.infer<
	typeof UpdateAccountWatermarkPreviewInputSchema
>;

export const updateAccountWatermarkPreview = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountWatermarkPreviewParams,
) => {
	const input = UpdateAccountWatermarkPreviewInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/watermark/preview`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountWatermarkPreviewOutputSchema.parse(data);
};

export const UpdateElectronicRecordDisclosureInputSchema = z.object({
	langCode: z.string(),
	include_metadata: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateElectronicRecordDisclosureOutputSchema = z
	.object({})
	.passthrough();

export type UpdateElectronicRecordDisclosureParams = z.infer<
	typeof UpdateElectronicRecordDisclosureInputSchema
>;

export const updateElectronicRecordDisclosure = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateElectronicRecordDisclosureParams,
) => {
	const input = UpdateElectronicRecordDisclosureInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_metadata !== undefined)
		query.append('include_metadata', String(input.include_metadata));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/consumer_disclosure/${encodeURIComponent(input.langCode)}` + qs,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateElectronicRecordDisclosureOutputSchema.parse(data);
};

export const UpdateEnoteIntegrationConfigInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnoteIntegrationConfigOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnoteIntegrationConfigParams = z.infer<
	typeof UpdateEnoteIntegrationConfigInputSchema
>;

export const updateEnoteIntegrationConfig = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnoteIntegrationConfigParams,
) => {
	const input = UpdateEnoteIntegrationConfigInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/settings/enote_configuration`, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateEnoteIntegrationConfigOutputSchema.parse(data);
};

export const AccountsInputSchemas = {
	addOrUpdateAccountStamps: AddOrUpdateAccountStampsInputSchema,
	createAccountCustomField: CreateAccountCustomFieldInputSchema,
	createBccEmailArchiveConfiguration:
		CreateBccEmailArchiveConfigurationInputSchema,
	deleteAccountCustomField: DeleteAccountCustomFieldInputSchema,
	deleteAccountStamp: DeleteAccountStampInputSchema,
	deleteBccEmailArchiveConfiguration:
		DeleteBccEmailArchiveConfigurationInputSchema,
	deleteEnoteConfiguration: DeleteEnoteConfigurationInputSchema,
	deleteSignatureForCaptiveRecipients:
		DeleteSignatureForCaptiveRecipientsInputSchema,
	deleteSpecifiedAccount: DeleteSpecifiedAccountInputSchema,
	deleteStampImageForAccount: DeleteStampImageForAccountInputSchema,
	getAccountBillingChargesList: GetAccountBillingChargesListInputSchema,
	getAccountPasswordRules: GetAccountPasswordRulesInputSchema,
	getAccountStampImage: GetAccountStampImageInputSchema,
	getBccEmailArchiveConfigurations: GetBccEmailArchiveConfigurationsInputSchema,
	getBccemailArchiveHistory: GetBccemailArchiveHistoryInputSchema,
	getElectronicRecordAndSignatureDisclosure:
		GetElectronicRecordAndSignatureDisclosureInputSchema,
	getEnoteIntegrationSettings: GetEnoteIntegrationSettingsInputSchema,
	getSpecifiedAccountStampInfo: GetSpecifiedAccountStampInfoInputSchema,
	getSupportedLanguagesForRecipients:
		GetSupportedLanguagesForRecipientsInputSchema,
	getTabSettingsForAccount: GetTabSettingsForAccountInputSchema,
	getUnsupportedFileTypesList: GetUnsupportedFileTypesListInputSchema,
	getWatermarkDetailsForAccount: GetWatermarkDetailsForAccountInputSchema,
	listSignatureProvidersForAccount: ListSignatureProvidersForAccountInputSchema,
	modifyAccountNotificationSettings:
		ModifyAccountNotificationSettingsInputSchema,
	modifyTabSettingsForAccount: ModifyTabSettingsForAccountInputSchema,
	retrieveAccountEnvelopePurgeConfig:
		RetrieveAccountEnvelopePurgeConfigInputSchema,
	retrieveAccountInformationForSpecifiedAccount:
		RetrieveAccountInformationForSpecifiedAccountInputSchema,
	retrieveAccountProvisioningInfo: RetrieveAccountProvisioningInfoInputSchema,
	retrieveAccountSealProviders: RetrieveAccountSealProvidersInputSchema,
	retrieveAccountSettingsInformation:
		RetrieveAccountSettingsInformationInputSchema,
	retrieveAvailableAccountStamps: RetrieveAvailableAccountStampsInputSchema,
	retrieveSharedItemStatusForUsers: RetrieveSharedItemStatusForUsersInputSchema,
	setEnvelopePurgeConfigForAccount: SetEnvelopePurgeConfigForAccountInputSchema,
	setSharedAccessForUsersAndTemplates:
		SetSharedAccessForUsersAndTemplatesInputSchema,
	updateAccountCustomField: UpdateAccountCustomFieldInputSchema,
	updateAccountPasswordRules: UpdateAccountPasswordRulesInputSchema,
	updateAccountSettings: UpdateAccountSettingsInputSchema,
	updateAccountStampById: UpdateAccountStampByIdInputSchema,
	updateAccountStamps: UpdateAccountStampsInputSchema,
	updateAccountWatermarkInformation:
		UpdateAccountWatermarkInformationInputSchema,
	updateAccountWatermarkPreview: UpdateAccountWatermarkPreviewInputSchema,
	updateElectronicRecordDisclosure: UpdateElectronicRecordDisclosureInputSchema,
	updateEnoteIntegrationConfig: UpdateEnoteIntegrationConfigInputSchema,
};

export const AccountsOutputSchemas = {
	addOrUpdateAccountStamps: AddOrUpdateAccountStampsOutputSchema,
	createAccountCustomField: CreateAccountCustomFieldOutputSchema,
	createBccEmailArchiveConfiguration:
		CreateBccEmailArchiveConfigurationOutputSchema,
	deleteAccountCustomField: DeleteAccountCustomFieldOutputSchema,
	deleteAccountStamp: DeleteAccountStampOutputSchema,
	deleteBccEmailArchiveConfiguration:
		DeleteBccEmailArchiveConfigurationOutputSchema,
	deleteEnoteConfiguration: DeleteEnoteConfigurationOutputSchema,
	deleteSignatureForCaptiveRecipients:
		DeleteSignatureForCaptiveRecipientsOutputSchema,
	deleteSpecifiedAccount: DeleteSpecifiedAccountOutputSchema,
	deleteStampImageForAccount: DeleteStampImageForAccountOutputSchema,
	getAccountBillingChargesList: GetAccountBillingChargesListOutputSchema,
	getAccountPasswordRules: GetAccountPasswordRulesOutputSchema,
	getAccountStampImage: GetAccountStampImageOutputSchema,
	getBccEmailArchiveConfigurations:
		GetBccEmailArchiveConfigurationsOutputSchema,
	getBccemailArchiveHistory: GetBccemailArchiveHistoryOutputSchema,
	getElectronicRecordAndSignatureDisclosure:
		GetElectronicRecordAndSignatureDisclosureOutputSchema,
	getEnoteIntegrationSettings: GetEnoteIntegrationSettingsOutputSchema,
	getSpecifiedAccountStampInfo: GetSpecifiedAccountStampInfoOutputSchema,
	getSupportedLanguagesForRecipients:
		GetSupportedLanguagesForRecipientsOutputSchema,
	getTabSettingsForAccount: GetTabSettingsForAccountOutputSchema,
	getUnsupportedFileTypesList: GetUnsupportedFileTypesListOutputSchema,
	getWatermarkDetailsForAccount: GetWatermarkDetailsForAccountOutputSchema,
	listSignatureProvidersForAccount:
		ListSignatureProvidersForAccountOutputSchema,
	modifyAccountNotificationSettings:
		ModifyAccountNotificationSettingsOutputSchema,
	modifyTabSettingsForAccount: ModifyTabSettingsForAccountOutputSchema,
	retrieveAccountEnvelopePurgeConfig:
		RetrieveAccountEnvelopePurgeConfigOutputSchema,
	retrieveAccountInformationForSpecifiedAccount:
		RetrieveAccountInformationForSpecifiedAccountOutputSchema,
	retrieveAccountProvisioningInfo: RetrieveAccountProvisioningInfoOutputSchema,
	retrieveAccountSealProviders: RetrieveAccountSealProvidersOutputSchema,
	retrieveAccountSettingsInformation:
		RetrieveAccountSettingsInformationOutputSchema,
	retrieveAvailableAccountStamps: RetrieveAvailableAccountStampsOutputSchema,
	retrieveSharedItemStatusForUsers:
		RetrieveSharedItemStatusForUsersOutputSchema,
	setEnvelopePurgeConfigForAccount:
		SetEnvelopePurgeConfigForAccountOutputSchema,
	setSharedAccessForUsersAndTemplates:
		SetSharedAccessForUsersAndTemplatesOutputSchema,
	updateAccountCustomField: UpdateAccountCustomFieldOutputSchema,
	updateAccountPasswordRules: UpdateAccountPasswordRulesOutputSchema,
	updateAccountSettings: UpdateAccountSettingsOutputSchema,
	updateAccountStampById: UpdateAccountStampByIdOutputSchema,
	updateAccountStamps: UpdateAccountStampsOutputSchema,
	updateAccountWatermarkInformation:
		UpdateAccountWatermarkInformationOutputSchema,
	updateAccountWatermarkPreview: UpdateAccountWatermarkPreviewOutputSchema,
	updateElectronicRecordDisclosure:
		UpdateElectronicRecordDisclosureOutputSchema,
	updateEnoteIntegrationConfig: UpdateEnoteIntegrationConfigOutputSchema,
};
