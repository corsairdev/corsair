import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const AddEmailOverridesToEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddEmailOverridesToEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type AddEmailOverridesToEnvelopeParams = z.infer<
	typeof AddEmailOverridesToEnvelopeInputSchema
>;

export const addEmailOverridesToEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddEmailOverridesToEnvelopeParams,
) => {
	const input = AddEmailOverridesToEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/email_settings`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddEmailOverridesToEnvelopeOutputSchema.parse(data);
};

export const AddStepToEnvelopeWorkflowInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddStepToEnvelopeWorkflowOutputSchema = z.object({}).passthrough();

export type AddStepToEnvelopeWorkflowParams = z.infer<
	typeof AddStepToEnvelopeWorkflowInputSchema
>;

export const addStepToEnvelopeWorkflow = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddStepToEnvelopeWorkflowParams,
) => {
	const input = AddStepToEnvelopeWorkflowInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddStepToEnvelopeWorkflowOutputSchema.parse(data);
};

export const AddTemplatesToDocumentInEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	preserve_template_recipient: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddTemplatesToDocumentInEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type AddTemplatesToDocumentInEnvelopeParams = z.infer<
	typeof AddTemplatesToDocumentInEnvelopeInputSchema
>;

export const addTemplatesToDocumentInEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddTemplatesToDocumentInEnvelopeParams,
) => {
	const input = AddTemplatesToDocumentInEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.preserve_template_recipient !== undefined)
		query.append(
			'preserve_template_recipient',
			String(input.preserve_template_recipient),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/templates` +
			qs,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddTemplatesToDocumentInEnvelopeOutputSchema.parse(data);
};

export const AddTemplatesToEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	preserve_template_recipient: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const AddTemplatesToEnvelopeOutputSchema = z.object({}).passthrough();

export type AddTemplatesToEnvelopeParams = z.infer<
	typeof AddTemplatesToEnvelopeInputSchema
>;

export const addTemplatesToEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: AddTemplatesToEnvelopeParams,
) => {
	const input = AddTemplatesToEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.preserve_template_recipient !== undefined)
		query.append(
			'preserve_template_recipient',
			String(input.preserve_template_recipient),
		);
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/templates` + qs,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return AddTemplatesToEnvelopeOutputSchema.parse(data);
};

export const CreateCustomFieldsForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateCustomFieldsForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type CreateCustomFieldsForEnvelopeParams = z.infer<
	typeof CreateCustomFieldsForEnvelopeInputSchema
>;

export const createCustomFieldsForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateCustomFieldsForEnvelopeParams,
) => {
	const input = CreateCustomFieldsForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/custom_fields`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateCustomFieldsForEnvelopeOutputSchema.parse(data);
};

export const CreateTemplateWorkflowStepInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateTemplateWorkflowStepOutputSchema = z
	.object({})
	.passthrough();

export type CreateTemplateWorkflowStepParams = z.infer<
	typeof CreateTemplateWorkflowStepInputSchema
>;

export const createTemplateWorkflowStep = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateTemplateWorkflowStepParams,
) => {
	const input = CreateTemplateWorkflowStepInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return CreateTemplateWorkflowStepOutputSchema.parse(data);
};

export const DeleteDelayedRoutingRuleForEnvelopeStepInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
});

export const DeleteDelayedRoutingRuleForEnvelopeStepOutputSchema = z
	.object({})
	.passthrough();

export type DeleteDelayedRoutingRuleForEnvelopeStepParams = z.infer<
	typeof DeleteDelayedRoutingRuleForEnvelopeStepInputSchema
>;

export const deleteDelayedRoutingRuleForEnvelopeStep = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteDelayedRoutingRuleForEnvelopeStepParams,
) => {
	const input =
		DeleteDelayedRoutingRuleForEnvelopeStepInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'DELETE',
		},
	);
	return DeleteDelayedRoutingRuleForEnvelopeStepOutputSchema.parse(data);
};

export const DeleteDelayedRoutingRulesForTemplateInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
});

export const DeleteDelayedRoutingRulesForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type DeleteDelayedRoutingRulesForTemplateParams = z.infer<
	typeof DeleteDelayedRoutingRulesForTemplateInputSchema
>;

export const deleteDelayedRoutingRulesForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteDelayedRoutingRulesForTemplateParams,
) => {
	const input = DeleteDelayedRoutingRulesForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'DELETE',
		},
	);
	return DeleteDelayedRoutingRulesForTemplateOutputSchema.parse(data);
};

export const DeleteEnvelopeCustomFieldsInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeleteEnvelopeCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeCustomFieldsParams = z.infer<
	typeof DeleteEnvelopeCustomFieldsInputSchema
>;

export const deleteEnvelopeCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeCustomFieldsParams,
) => {
	const input = DeleteEnvelopeCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/custom_fields`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeCustomFieldsOutputSchema.parse(data);
};

export const DeleteEnvelopeEmailSettingsInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeleteEnvelopeEmailSettingsOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeEmailSettingsParams = z.infer<
	typeof DeleteEnvelopeEmailSettingsInputSchema
>;

export const deleteEnvelopeEmailSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeEmailSettingsParams,
) => {
	const input = DeleteEnvelopeEmailSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/email_settings`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeEmailSettingsOutputSchema.parse(data);
};

export const DeleteEnvelopeLockInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeleteEnvelopeLockOutputSchema = z.object({}).passthrough();

export type DeleteEnvelopeLockParams = z.infer<
	typeof DeleteEnvelopeLockInputSchema
>;

export const deleteEnvelopeLock = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeLockParams,
) => {
	const input = DeleteEnvelopeLockInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/lock`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeLockOutputSchema.parse(data);
};

export const DeleteEnvelopeScheduledSendingRulesInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeleteEnvelopeScheduledSendingRulesOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeScheduledSendingRulesParams = z.infer<
	typeof DeleteEnvelopeScheduledSendingRulesInputSchema
>;

export const deleteEnvelopeScheduledSendingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeScheduledSendingRulesParams,
) => {
	const input = DeleteEnvelopeScheduledSendingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/scheduledSending`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeScheduledSendingRulesOutputSchema.parse(data);
};

export const DeleteEnvelopeTransferRuleInputSchema = z.object({
	envelopeTransferRuleId: z.string(),
});

export const DeleteEnvelopeTransferRuleOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeTransferRuleParams = z.infer<
	typeof DeleteEnvelopeTransferRuleInputSchema
>;

export const deleteEnvelopeTransferRule = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeTransferRuleParams,
) => {
	const input = DeleteEnvelopeTransferRuleInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/transfer_rules/${encodeURIComponent(input.envelopeTransferRuleId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeTransferRuleOutputSchema.parse(data);
};

export const DeleteEnvelopeWorkflowDefinitionInputSchema = z.object({
	envelopeId: z.string(),
});

export const DeleteEnvelopeWorkflowDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeWorkflowDefinitionParams = z.infer<
	typeof DeleteEnvelopeWorkflowDefinitionInputSchema
>;

export const deleteEnvelopeWorkflowDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeWorkflowDefinitionParams,
) => {
	const input = DeleteEnvelopeWorkflowDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeWorkflowDefinitionOutputSchema.parse(data);
};

export const DeleteEnvelopeWorkflowStepInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
});

export const DeleteEnvelopeWorkflowStepOutputSchema = z
	.object({})
	.passthrough();

export type DeleteEnvelopeWorkflowStepParams = z.infer<
	typeof DeleteEnvelopeWorkflowStepInputSchema
>;

export const deleteEnvelopeWorkflowStep = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteEnvelopeWorkflowStepParams,
) => {
	const input = DeleteEnvelopeWorkflowStepInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteEnvelopeWorkflowStepOutputSchema.parse(data);
};

export const DeleteScheduledSendingRulesInputSchema = z.object({
	templateId: z.string(),
});

export const DeleteScheduledSendingRulesOutputSchema = z
	.object({})
	.passthrough();

export type DeleteScheduledSendingRulesParams = z.infer<
	typeof DeleteScheduledSendingRulesInputSchema
>;

export const deleteScheduledSendingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteScheduledSendingRulesParams,
) => {
	const input = DeleteScheduledSendingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/scheduledSending`,
		{
			method: 'DELETE',
		},
	);
	return DeleteScheduledSendingRulesOutputSchema.parse(data);
};

export const DeleteTemplateFromEnvelopeDocumentInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	templateId: z.string(),
});

export const DeleteTemplateFromEnvelopeDocumentOutputSchema = z
	.object({})
	.passthrough();

export type DeleteTemplateFromEnvelopeDocumentParams = z.infer<
	typeof DeleteTemplateFromEnvelopeDocumentInputSchema
>;

export const deleteTemplateFromEnvelopeDocument = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteTemplateFromEnvelopeDocumentParams,
) => {
	const input = DeleteTemplateFromEnvelopeDocumentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/templates/${encodeURIComponent(input.templateId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteTemplateFromEnvelopeDocumentOutputSchema.parse(data);
};

export const DeleteTemplateWorkflowStepInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
});

export const DeleteTemplateWorkflowStepOutputSchema = z
	.object({})
	.passthrough();

export type DeleteTemplateWorkflowStepParams = z.infer<
	typeof DeleteTemplateWorkflowStepInputSchema
>;

export const deleteTemplateWorkflowStep = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteTemplateWorkflowStepParams,
) => {
	const input = DeleteTemplateWorkflowStepInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteTemplateWorkflowStepOutputSchema.parse(data);
};

export const DeleteWorkflowDefinitionForTemplateInputSchema = z.object({
	templateId: z.string(),
});

export const DeleteWorkflowDefinitionForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type DeleteWorkflowDefinitionForTemplateParams = z.infer<
	typeof DeleteWorkflowDefinitionForTemplateInputSchema
>;

export const deleteWorkflowDefinitionForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteWorkflowDefinitionForTemplateParams,
) => {
	const input = DeleteWorkflowDefinitionForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow`,
		{
			method: 'DELETE',
		},
	);
	return DeleteWorkflowDefinitionForTemplateOutputSchema.parse(data);
};

export const GetEnvelopeLockInformationInputSchema = z.object({
	envelopeId: z.string(),
});

export const GetEnvelopeLockInformationOutputSchema = z
	.object({})
	.passthrough();

export type GetEnvelopeLockInformationParams = z.infer<
	typeof GetEnvelopeLockInformationInputSchema
>;

export const getEnvelopeLockInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeLockInformationParams,
) => {
	const input = GetEnvelopeLockInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/lock`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeLockInformationOutputSchema.parse(data);
};

export const GetEnvelopeWorkflowDefinitionInputSchema = z.object({
	envelopeId: z.string(),
});

export const GetEnvelopeWorkflowDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type GetEnvelopeWorkflowDefinitionParams = z.infer<
	typeof GetEnvelopeWorkflowDefinitionInputSchema
>;

export const getEnvelopeWorkflowDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeWorkflowDefinitionParams,
) => {
	const input = GetEnvelopeWorkflowDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeWorkflowDefinitionOutputSchema.parse(data);
};

export const GetEnvelopeWorkflowDelayedRoutingDefinitionInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
});

export const GetEnvelopeWorkflowDelayedRoutingDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type GetEnvelopeWorkflowDelayedRoutingDefinitionParams = z.infer<
	typeof GetEnvelopeWorkflowDelayedRoutingDefinitionInputSchema
>;

export const getEnvelopeWorkflowDelayedRoutingDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeWorkflowDelayedRoutingDefinitionParams,
) => {
	const input =
		GetEnvelopeWorkflowDelayedRoutingDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'GET',
		},
	);
	return GetEnvelopeWorkflowDelayedRoutingDefinitionOutputSchema.parse(data);
};

export const GetTemplateDelayedRoutingRulesInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
});

export const GetTemplateDelayedRoutingRulesOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateDelayedRoutingRulesParams = z.infer<
	typeof GetTemplateDelayedRoutingRulesInputSchema
>;

export const getTemplateDelayedRoutingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateDelayedRoutingRulesParams,
) => {
	const input = GetTemplateDelayedRoutingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'GET',
		},
	);
	return GetTemplateDelayedRoutingRulesOutputSchema.parse(data);
};

export const GetTemplateScheduledSendingSettingsInputSchema = z.object({
	templateId: z.string(),
});

export const GetTemplateScheduledSendingSettingsOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplateScheduledSendingSettingsParams = z.infer<
	typeof GetTemplateScheduledSendingSettingsInputSchema
>;

export const getTemplateScheduledSendingSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateScheduledSendingSettingsParams,
) => {
	const input = GetTemplateScheduledSendingSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/scheduledSending`,
		{
			method: 'GET',
		},
	);
	return GetTemplateScheduledSendingSettingsOutputSchema.parse(data);
};

export const GetTemplatesForEnvelopeDocumentInputSchema = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	include: z.string().optional(),
});

export const GetTemplatesForEnvelopeDocumentOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplatesForEnvelopeDocumentParams = z.infer<
	typeof GetTemplatesForEnvelopeDocumentInputSchema
>;

export const getTemplatesForEnvelopeDocument = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplatesForEnvelopeDocumentParams,
) => {
	const input = GetTemplatesForEnvelopeDocumentInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/documents/${encodeURIComponent(input.documentId)}/templates` +
			qs,
		{
			method: 'GET',
		},
	);
	return GetTemplatesForEnvelopeDocumentOutputSchema.parse(data);
};

export const GetTemplatesUsedInEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	include: z.string().optional(),
});

export const GetTemplatesUsedInEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type GetTemplatesUsedInEnvelopeParams = z.infer<
	typeof GetTemplatesUsedInEnvelopeInputSchema
>;

export const getTemplatesUsedInEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplatesUsedInEnvelopeParams,
) => {
	const input = GetTemplatesUsedInEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include !== undefined)
		query.append('include', String(input.include));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/templates` + qs,
		{
			method: 'GET',
		},
	);
	return GetTemplatesUsedInEnvelopeOutputSchema.parse(data);
};

export const GetWorkflowStepForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
});

export const GetWorkflowStepForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type GetWorkflowStepForEnvelopeParams = z.infer<
	typeof GetWorkflowStepForEnvelopeInputSchema
>;

export const getWorkflowStepForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetWorkflowStepForEnvelopeParams,
) => {
	const input = GetWorkflowStepForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'GET',
		},
	);
	return GetWorkflowStepForEnvelopeOutputSchema.parse(data);
};

export const ListEnvelopeAndDocumentCustomFieldsInputSchema = z.object({
	envelopeId: z.string(),
});

export const ListEnvelopeAndDocumentCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type ListEnvelopeAndDocumentCustomFieldsParams = z.infer<
	typeof ListEnvelopeAndDocumentCustomFieldsInputSchema
>;

export const listEnvelopeAndDocumentCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListEnvelopeAndDocumentCustomFieldsParams,
) => {
	const input = ListEnvelopeAndDocumentCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/custom_fields`,
		{
			method: 'GET',
		},
	);
	return ListEnvelopeAndDocumentCustomFieldsOutputSchema.parse(data);
};

export const LockAnEnvelopeForEditingInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const LockAnEnvelopeForEditingOutputSchema = z.object({}).passthrough();

export type LockAnEnvelopeForEditingParams = z.infer<
	typeof LockAnEnvelopeForEditingInputSchema
>;

export const lockAnEnvelopeForEditing = async (
	ctxOrClient: DocusignExecutionContext,
	params: LockAnEnvelopeForEditingParams,
) => {
	const input = LockAnEnvelopeForEditingInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/lock`,
		{
			method: 'POST',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return LockAnEnvelopeForEditingOutputSchema.parse(data);
};

export const RetrieveCustomFieldsForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const RetrieveCustomFieldsForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveCustomFieldsForEnvelopeParams = z.infer<
	typeof RetrieveCustomFieldsForEnvelopeInputSchema
>;

export const retrieveCustomFieldsForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveCustomFieldsForEnvelopeParams,
) => {
	const input = RetrieveCustomFieldsForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/custom_fields`,
		{
			method: 'GET',
		},
	);
	return RetrieveCustomFieldsForEnvelopeOutputSchema.parse(data);
};

export const RetrieveEnvelopeEmailOverridesInputSchema = z.object({
	envelopeId: z.string(),
});

export const RetrieveEnvelopeEmailOverridesOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveEnvelopeEmailOverridesParams = z.infer<
	typeof RetrieveEnvelopeEmailOverridesInputSchema
>;

export const retrieveEnvelopeEmailOverrides = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveEnvelopeEmailOverridesParams,
) => {
	const input = RetrieveEnvelopeEmailOverridesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/email_settings`,
		{
			method: 'GET',
		},
	);
	return RetrieveEnvelopeEmailOverridesOutputSchema.parse(data);
};

export const RetrieveWorkflowStepForTemplateInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
});

export const RetrieveWorkflowStepForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveWorkflowStepForTemplateParams = z.infer<
	typeof RetrieveWorkflowStepForTemplateInputSchema
>;

export const retrieveWorkflowStepForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveWorkflowStepForTemplateParams,
) => {
	const input = RetrieveWorkflowStepForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'GET',
		},
	);
	return RetrieveWorkflowStepForTemplateOutputSchema.parse(data);
};

export const ReturnScheduledSendingRulesForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
});

export const ReturnScheduledSendingRulesForEnvelopeOutputSchema = z
	.object({})
	.passthrough();

export type ReturnScheduledSendingRulesForEnvelopeParams = z.infer<
	typeof ReturnScheduledSendingRulesForEnvelopeInputSchema
>;

export const returnScheduledSendingRulesForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnScheduledSendingRulesForEnvelopeParams,
) => {
	const input = ReturnScheduledSendingRulesForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/scheduledSending`,
		{
			method: 'GET',
		},
	);
	return ReturnScheduledSendingRulesForEnvelopeOutputSchema.parse(data);
};

export const ReturnTemplateWorkflowDefinitionInputSchema = z.object({
	templateId: z.string(),
});

export const ReturnTemplateWorkflowDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type ReturnTemplateWorkflowDefinitionParams = z.infer<
	typeof ReturnTemplateWorkflowDefinitionInputSchema
>;

export const returnTemplateWorkflowDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnTemplateWorkflowDefinitionParams,
) => {
	const input = ReturnTemplateWorkflowDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow`,
		{
			method: 'GET',
		},
	);
	return ReturnTemplateWorkflowDefinitionOutputSchema.parse(data);
};

export const SubmitBatchHistoricalEnvelopesToWebhookInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const SubmitBatchHistoricalEnvelopesToWebhookOutputSchema = z
	.object({})
	.passthrough();

export type SubmitBatchHistoricalEnvelopesToWebhookParams = z.infer<
	typeof SubmitBatchHistoricalEnvelopesToWebhookInputSchema
>;

export const submitBatchHistoricalEnvelopesToWebhook = async (
	ctxOrClient: DocusignExecutionContext,
	params: SubmitBatchHistoricalEnvelopesToWebhookParams,
) => {
	const input =
		SubmitBatchHistoricalEnvelopesToWebhookInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/connect/envelopes/publish/historical`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return SubmitBatchHistoricalEnvelopesToWebhookOutputSchema.parse(data);
};

export const UpdateEnvelopeCustomFieldsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeCustomFieldsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeCustomFieldsParams = z.infer<
	typeof UpdateEnvelopeCustomFieldsInputSchema
>;

export const updateEnvelopeCustomFields = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeCustomFieldsParams,
) => {
	const input = UpdateEnvelopeCustomFieldsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/custom_fields`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeCustomFieldsOutputSchema.parse(data);
};

export const UpdateEnvelopeDelayedRoutingRulesInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeDelayedRoutingRulesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeDelayedRoutingRulesParams = z.infer<
	typeof UpdateEnvelopeDelayedRoutingRulesInputSchema
>;

export const updateEnvelopeDelayedRoutingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeDelayedRoutingRulesParams,
) => {
	const input = UpdateEnvelopeDelayedRoutingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeDelayedRoutingRulesOutputSchema.parse(data);
};

export const UpdateEnvelopeEmailSettingsInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeEmailSettingsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeEmailSettingsParams = z.infer<
	typeof UpdateEnvelopeEmailSettingsInputSchema
>;

export const updateEnvelopeEmailSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeEmailSettingsParams,
) => {
	const input = UpdateEnvelopeEmailSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/email_settings`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeEmailSettingsOutputSchema.parse(data);
};

export const UpdateEnvelopeScheduledSendingRulesInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeScheduledSendingRulesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeScheduledSendingRulesParams = z.infer<
	typeof UpdateEnvelopeScheduledSendingRulesInputSchema
>;

export const updateEnvelopeScheduledSendingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeScheduledSendingRulesParams,
) => {
	const input = UpdateEnvelopeScheduledSendingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/scheduledSending`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeScheduledSendingRulesOutputSchema.parse(data);
};

export const UpdateEnvelopeWorkflowDefinitionInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeWorkflowDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeWorkflowDefinitionParams = z.infer<
	typeof UpdateEnvelopeWorkflowDefinitionInputSchema
>;

export const updateEnvelopeWorkflowDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeWorkflowDefinitionParams,
) => {
	const input = UpdateEnvelopeWorkflowDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeWorkflowDefinitionOutputSchema.parse(data);
};

export const UpdateEnvelopeWorkflowStepInputSchema = z.object({
	envelopeId: z.string(),
	workflowStepId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateEnvelopeWorkflowStepOutputSchema = z
	.object({})
	.passthrough();

export type UpdateEnvelopeWorkflowStepParams = z.infer<
	typeof UpdateEnvelopeWorkflowStepInputSchema
>;

export const updateEnvelopeWorkflowStep = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateEnvelopeWorkflowStepParams,
) => {
	const input = UpdateEnvelopeWorkflowStepInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateEnvelopeWorkflowStepOutputSchema.parse(data);
};

export const UpdateLockForEnvelopeInputSchema = z.object({
	envelopeId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateLockForEnvelopeOutputSchema = z.object({}).passthrough();

export type UpdateLockForEnvelopeParams = z.infer<
	typeof UpdateLockForEnvelopeInputSchema
>;

export const updateLockForEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateLockForEnvelopeParams,
) => {
	const input = UpdateLockForEnvelopeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/envelopes/${encodeURIComponent(input.envelopeId)}/lock`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateLockForEnvelopeOutputSchema.parse(data);
};

export const UpdateTemplateDelayedRoutingRulesInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateDelayedRoutingRulesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateDelayedRoutingRulesParams = z.infer<
	typeof UpdateTemplateDelayedRoutingRulesInputSchema
>;

export const updateTemplateDelayedRoutingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateDelayedRoutingRulesParams,
) => {
	const input = UpdateTemplateDelayedRoutingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}/delayedRouting`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateDelayedRoutingRulesOutputSchema.parse(data);
};

export const UpdateTemplateScheduledSendingRulesInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateScheduledSendingRulesOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateScheduledSendingRulesParams = z.infer<
	typeof UpdateTemplateScheduledSendingRulesInputSchema
>;

export const updateTemplateScheduledSendingRules = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateScheduledSendingRulesParams,
) => {
	const input = UpdateTemplateScheduledSendingRulesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/scheduledSending`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateScheduledSendingRulesOutputSchema.parse(data);
};

export const UpdateTemplateWorkflowDefinitionInputSchema = z.object({
	templateId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateTemplateWorkflowDefinitionOutputSchema = z
	.object({})
	.passthrough();

export type UpdateTemplateWorkflowDefinitionParams = z.infer<
	typeof UpdateTemplateWorkflowDefinitionInputSchema
>;

export const updateTemplateWorkflowDefinition = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateTemplateWorkflowDefinitionParams,
) => {
	const input = UpdateTemplateWorkflowDefinitionInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateTemplateWorkflowDefinitionOutputSchema.parse(data);
};

export const UpdateWorkflowStepForTemplateInputSchema = z.object({
	templateId: z.string(),
	workflowStepId: z.string(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateWorkflowStepForTemplateOutputSchema = z
	.object({})
	.passthrough();

export type UpdateWorkflowStepForTemplateParams = z.infer<
	typeof UpdateWorkflowStepForTemplateInputSchema
>;

export const updateWorkflowStepForTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateWorkflowStepForTemplateParams,
) => {
	const input = UpdateWorkflowStepForTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}/workflow/steps/${encodeURIComponent(input.workflowStepId)}`,
		{
			method: 'PUT',
			body: input.body === undefined ? undefined : JSON.stringify(input.body),
		},
	);
	return UpdateWorkflowStepForTemplateOutputSchema.parse(data);
};

export const EnvelopeWorkflowInputSchemas = {
	addEmailOverridesToEnvelope: AddEmailOverridesToEnvelopeInputSchema,
	addStepToEnvelopeWorkflow: AddStepToEnvelopeWorkflowInputSchema,
	addTemplatesToDocumentInEnvelope: AddTemplatesToDocumentInEnvelopeInputSchema,
	addTemplatesToEnvelope: AddTemplatesToEnvelopeInputSchema,
	createCustomFieldsForEnvelope: CreateCustomFieldsForEnvelopeInputSchema,
	createTemplateWorkflowStep: CreateTemplateWorkflowStepInputSchema,
	deleteDelayedRoutingRuleForEnvelopeStep:
		DeleteDelayedRoutingRuleForEnvelopeStepInputSchema,
	deleteDelayedRoutingRulesForTemplate:
		DeleteDelayedRoutingRulesForTemplateInputSchema,
	deleteEnvelopeCustomFields: DeleteEnvelopeCustomFieldsInputSchema,
	deleteEnvelopeEmailSettings: DeleteEnvelopeEmailSettingsInputSchema,
	deleteEnvelopeLock: DeleteEnvelopeLockInputSchema,
	deleteEnvelopeScheduledSendingRules:
		DeleteEnvelopeScheduledSendingRulesInputSchema,
	deleteEnvelopeTransferRule: DeleteEnvelopeTransferRuleInputSchema,
	deleteEnvelopeWorkflowDefinition: DeleteEnvelopeWorkflowDefinitionInputSchema,
	deleteEnvelopeWorkflowStep: DeleteEnvelopeWorkflowStepInputSchema,
	deleteScheduledSendingRules: DeleteScheduledSendingRulesInputSchema,
	deleteTemplateFromEnvelopeDocument:
		DeleteTemplateFromEnvelopeDocumentInputSchema,
	deleteTemplateWorkflowStep: DeleteTemplateWorkflowStepInputSchema,
	deleteWorkflowDefinitionForTemplate:
		DeleteWorkflowDefinitionForTemplateInputSchema,
	getEnvelopeLockInformation: GetEnvelopeLockInformationInputSchema,
	getEnvelopeWorkflowDefinition: GetEnvelopeWorkflowDefinitionInputSchema,
	getEnvelopeWorkflowDelayedRoutingDefinition:
		GetEnvelopeWorkflowDelayedRoutingDefinitionInputSchema,
	getTemplateDelayedRoutingRules: GetTemplateDelayedRoutingRulesInputSchema,
	getTemplateScheduledSendingSettings:
		GetTemplateScheduledSendingSettingsInputSchema,
	getTemplatesForEnvelopeDocument: GetTemplatesForEnvelopeDocumentInputSchema,
	getTemplatesUsedInEnvelope: GetTemplatesUsedInEnvelopeInputSchema,
	getWorkflowStepForEnvelope: GetWorkflowStepForEnvelopeInputSchema,
	listEnvelopeAndDocumentCustomFields:
		ListEnvelopeAndDocumentCustomFieldsInputSchema,
	lockAnEnvelopeForEditing: LockAnEnvelopeForEditingInputSchema,
	retrieveCustomFieldsForEnvelope: RetrieveCustomFieldsForEnvelopeInputSchema,
	retrieveEnvelopeEmailOverrides: RetrieveEnvelopeEmailOverridesInputSchema,
	retrieveWorkflowStepForTemplate: RetrieveWorkflowStepForTemplateInputSchema,
	returnScheduledSendingRulesForEnvelope:
		ReturnScheduledSendingRulesForEnvelopeInputSchema,
	returnTemplateWorkflowDefinition: ReturnTemplateWorkflowDefinitionInputSchema,
	submitBatchHistoricalEnvelopesToWebhook:
		SubmitBatchHistoricalEnvelopesToWebhookInputSchema,
	updateEnvelopeCustomFields: UpdateEnvelopeCustomFieldsInputSchema,
	updateEnvelopeDelayedRoutingRules:
		UpdateEnvelopeDelayedRoutingRulesInputSchema,
	updateEnvelopeEmailSettings: UpdateEnvelopeEmailSettingsInputSchema,
	updateEnvelopeScheduledSendingRules:
		UpdateEnvelopeScheduledSendingRulesInputSchema,
	updateEnvelopeWorkflowDefinition: UpdateEnvelopeWorkflowDefinitionInputSchema,
	updateEnvelopeWorkflowStep: UpdateEnvelopeWorkflowStepInputSchema,
	updateLockForEnvelope: UpdateLockForEnvelopeInputSchema,
	updateTemplateDelayedRoutingRules:
		UpdateTemplateDelayedRoutingRulesInputSchema,
	updateTemplateScheduledSendingRules:
		UpdateTemplateScheduledSendingRulesInputSchema,
	updateTemplateWorkflowDefinition: UpdateTemplateWorkflowDefinitionInputSchema,
	updateWorkflowStepForTemplate: UpdateWorkflowStepForTemplateInputSchema,
};

export const EnvelopeWorkflowOutputSchemas = {
	addEmailOverridesToEnvelope: AddEmailOverridesToEnvelopeOutputSchema,
	addStepToEnvelopeWorkflow: AddStepToEnvelopeWorkflowOutputSchema,
	addTemplatesToDocumentInEnvelope:
		AddTemplatesToDocumentInEnvelopeOutputSchema,
	addTemplatesToEnvelope: AddTemplatesToEnvelopeOutputSchema,
	createCustomFieldsForEnvelope: CreateCustomFieldsForEnvelopeOutputSchema,
	createTemplateWorkflowStep: CreateTemplateWorkflowStepOutputSchema,
	deleteDelayedRoutingRuleForEnvelopeStep:
		DeleteDelayedRoutingRuleForEnvelopeStepOutputSchema,
	deleteDelayedRoutingRulesForTemplate:
		DeleteDelayedRoutingRulesForTemplateOutputSchema,
	deleteEnvelopeCustomFields: DeleteEnvelopeCustomFieldsOutputSchema,
	deleteEnvelopeEmailSettings: DeleteEnvelopeEmailSettingsOutputSchema,
	deleteEnvelopeLock: DeleteEnvelopeLockOutputSchema,
	deleteEnvelopeScheduledSendingRules:
		DeleteEnvelopeScheduledSendingRulesOutputSchema,
	deleteEnvelopeTransferRule: DeleteEnvelopeTransferRuleOutputSchema,
	deleteEnvelopeWorkflowDefinition:
		DeleteEnvelopeWorkflowDefinitionOutputSchema,
	deleteEnvelopeWorkflowStep: DeleteEnvelopeWorkflowStepOutputSchema,
	deleteScheduledSendingRules: DeleteScheduledSendingRulesOutputSchema,
	deleteTemplateFromEnvelopeDocument:
		DeleteTemplateFromEnvelopeDocumentOutputSchema,
	deleteTemplateWorkflowStep: DeleteTemplateWorkflowStepOutputSchema,
	deleteWorkflowDefinitionForTemplate:
		DeleteWorkflowDefinitionForTemplateOutputSchema,
	getEnvelopeLockInformation: GetEnvelopeLockInformationOutputSchema,
	getEnvelopeWorkflowDefinition: GetEnvelopeWorkflowDefinitionOutputSchema,
	getEnvelopeWorkflowDelayedRoutingDefinition:
		GetEnvelopeWorkflowDelayedRoutingDefinitionOutputSchema,
	getTemplateDelayedRoutingRules: GetTemplateDelayedRoutingRulesOutputSchema,
	getTemplateScheduledSendingSettings:
		GetTemplateScheduledSendingSettingsOutputSchema,
	getTemplatesForEnvelopeDocument: GetTemplatesForEnvelopeDocumentOutputSchema,
	getTemplatesUsedInEnvelope: GetTemplatesUsedInEnvelopeOutputSchema,
	getWorkflowStepForEnvelope: GetWorkflowStepForEnvelopeOutputSchema,
	listEnvelopeAndDocumentCustomFields:
		ListEnvelopeAndDocumentCustomFieldsOutputSchema,
	lockAnEnvelopeForEditing: LockAnEnvelopeForEditingOutputSchema,
	retrieveCustomFieldsForEnvelope: RetrieveCustomFieldsForEnvelopeOutputSchema,
	retrieveEnvelopeEmailOverrides: RetrieveEnvelopeEmailOverridesOutputSchema,
	retrieveWorkflowStepForTemplate: RetrieveWorkflowStepForTemplateOutputSchema,
	returnScheduledSendingRulesForEnvelope:
		ReturnScheduledSendingRulesForEnvelopeOutputSchema,
	returnTemplateWorkflowDefinition:
		ReturnTemplateWorkflowDefinitionOutputSchema,
	submitBatchHistoricalEnvelopesToWebhook:
		SubmitBatchHistoricalEnvelopesToWebhookOutputSchema,
	updateEnvelopeCustomFields: UpdateEnvelopeCustomFieldsOutputSchema,
	updateEnvelopeDelayedRoutingRules:
		UpdateEnvelopeDelayedRoutingRulesOutputSchema,
	updateEnvelopeEmailSettings: UpdateEnvelopeEmailSettingsOutputSchema,
	updateEnvelopeScheduledSendingRules:
		UpdateEnvelopeScheduledSendingRulesOutputSchema,
	updateEnvelopeWorkflowDefinition:
		UpdateEnvelopeWorkflowDefinitionOutputSchema,
	updateEnvelopeWorkflowStep: UpdateEnvelopeWorkflowStepOutputSchema,
	updateLockForEnvelope: UpdateLockForEnvelopeOutputSchema,
	updateTemplateDelayedRoutingRules:
		UpdateTemplateDelayedRoutingRulesOutputSchema,
	updateTemplateScheduledSendingRules:
		UpdateTemplateScheduledSendingRulesOutputSchema,
	updateTemplateWorkflowDefinition:
		UpdateTemplateWorkflowDefinitionOutputSchema,
	updateWorkflowStepForTemplate: UpdateWorkflowStepForTemplateOutputSchema,
};
