import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { escapeSoql } from '../utils';

export const createSObjectRecord: SalesforceEndpoints['createSObjectRecord'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			id: string;
			success?: boolean;
		}>(`sobjects/${input.sobject}`, ctx.key, {
			method: 'POST',
			body: input.fields,
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.create_sobject',
			input,
			'completed',
		);
		return response;
	};

export const cloneRecord: SalesforceEndpoints['cloneRecord'] = async (
	ctx,
	input,
) => {
	const orig = await makeSalesforceRequest<Record<string, unknown>>(
		`sobjects/${input.sobject}/${input.recordId}`,
		ctx.key,
		{ method: 'GET' },
	);

	const {
		Id,
		CreatedDate,
		CreatedById,
		LastModifiedDate,
		LastModifiedById,
		SystemModstamp,
		...fieldsToClone
	} = orig;

	const body = { ...fieldsToClone, ...(input.overrides ?? {}) };

	const response = await makeSalesforceRequest<{ id: string }>(
		`sobjects/${input.sobject}`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.clone_record',
		input,
		'completed',
	);
	return { id: response.id };
};

export const createCustomField: SalesforceEndpoints['createCustomField'] =
	async (ctx, input) => {
		const body = {
			FullName: `${input.sobject}.${input.developerName}__c`,
			Metadata: {
				label: input.label,
				type: input.type,
				length: input.length,
			},
		};

		const response = await makeSalesforceRequest<{
			id: string;
			success?: boolean;
		}>('tooling/sobjects/CustomField', ctx.key, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.create_custom_field',
			input,
			'completed',
		);
		return response;
	};

export const createCustomObject: SalesforceEndpoints['createCustomObject'] =
	async (ctx, input) => {
		const body = {
			FullName: `${input.developerName}__c`,
			Metadata: {
				label: input.label,
				pluralLabel: input.pluralLabel,
				nameField: {
					type: 'Text',
					label: `${input.label} Name`,
				},
				deploymentStatus: 'Deployed',
				sharingModel: 'ReadWrite',
			},
		};

		const response = await makeSalesforceRequest<{
			id: string;
			success?: boolean;
		}>('tooling/sobjects/CustomObject', ctx.key, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.create_custom_object',
			input,
			'completed',
		);
		return response;
	};

export const deleteSobject: SalesforceEndpoints['deleteSobject'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(
		`sobjects/${input.sobject}/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.delete_sobject',
		input,
		'completed',
	);
	return { success: true };
};

export const deleteSobjectRows: SalesforceEndpoints['deleteSobjectRows'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/${input.sobject}/${input.id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.delete_sobject_rows',
			input,
			'completed',
		);
		return { success: true };
	};

export const getSobjects: SalesforceEndpoints['getSobjects'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<{
		encoding?: string;
		maxBatchSize?: number;
		sobjects: Array<Record<string, unknown>>;
	}>('sobjects', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'salesforce.metadata.get_sobjects',
		{},
		'completed',
	);
	return response;
};

export const executeSobjectQuickAction: SalesforceEndpoints['executeSobjectQuickAction'] =
	async (ctx, input) => {
		const endpoint = input.contextId
			? `sobjects/${input.sobject}/quickActions/${input.actionName}/${input.contextId}`
			: `sobjects/${input.sobject}/quickActions/${input.actionName}`;

		const response = await makeSalesforceRequest<{
			success: boolean;
			recordId?: string;
		}>(endpoint, ctx.key, {
			method: 'POST',
			body: input.record ?? {},
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.execute_quick_action',
			input,
			'completed',
		);
		return response;
	};

export const getApi: SalesforceEndpoints['getApi'] = async (ctx, input) => {
	const endpoint = input.version ? `v${input.version}` : '';
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		endpoint,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.get_api',
		input,
		'completed',
	);
	return response;
};

export const getChatterResources: SalesforceEndpoints['getChatterResources'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'chatter',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.chatter_resources',
			{},
			'completed',
		);
		return response;
	};

export const getSobjectPlatformaction: SalesforceEndpoints['getSobjectPlatformaction'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'sobjects/PlatformAction/describe',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.platformaction',
			{},
			'completed',
		);
		return response;
	};

export const headQuickActions: SalesforceEndpoints['headQuickActions'] = async (
	ctx,
	_input,
) => {
	await makeSalesforceRequest<void>('quickActions', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'salesforce.metadata.head_quick_actions',
		{},
		'completed',
	);
	return { status: 200 };
};

export const headSobjectsUserPassword: SalesforceEndpoints['headSobjectsUserPassword'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/User/${input.userId}/password`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_user_password',
			input,
			'completed',
		);
		return { status: 200 };
	};

export const getPicklistValuesByRecordType: SalesforceEndpoints['getPicklistValuesByRecordType'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/object-info/${input.sobject}/picklist-values/${input.recordTypeId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.picklist_values',
			input,
			'completed',
		);
		return response;
	};

export const getAllFieldsForObject: SalesforceEndpoints['getAllFieldsForObject'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			fields: Array<Record<string, unknown>>;
		}>(`sobjects/${input.sobject}/describe`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.all_fields',
			input,
			'completed',
		);
		return { fields: response.fields ?? [] };
	};

export const getAllCustomObjects: SalesforceEndpoints['getAllCustomObjects'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<{
			sobjects: Array<Record<string, unknown>>;
		}>('sobjects', ctx.key, { method: 'GET' });

		const customObjects = (response.sobjects ?? []).filter(
			(obj) => obj.custom === true,
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.all_custom_objects',
			{},
			'completed',
		);
		return { sobjects: customObjects };
	};

export const getSobjectsSobjectDescribeApprovallayouts: SalesforceEndpoints['getSobjectsSobjectDescribeApprovallayouts'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/describe/approvalLayouts`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.approval_layouts_describe',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectApprovalLayouts: SalesforceEndpoints['getSobjectApprovalLayouts'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/approvalLayouts`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.approval_layouts',
			input,
			'completed',
		);
		return response;
	};

export const getChildRecords: SalesforceEndpoints['getChildRecords'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>(`sobjects/Account/${input.parentId}/${input.relationshipName}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'salesforce.metadata.child_records',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};

export const getConsentAction: SalesforceEndpoints['getConsentAction'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		'consent/action',
		ctx.key,
		{
			method: 'GET',
			query: {
				action: input.action,
				ids: input.ids.join(','),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.consent_action',
		input,
		'completed',
	);
	return response;
};

export const headActionsCustom: SalesforceEndpoints['headActionsCustom'] =
	async (ctx, _input) => {
		await makeSalesforceRequest<void>('actions/custom', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_custom_actions',
			{},
			'completed',
		);
		return { status: 200 };
	};

export const listCustomInvocableActions: SalesforceEndpoints['listCustomInvocableActions'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<{
			actions: Array<Record<string, unknown>>;
		}>('actions/custom', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.custom_invocable_actions',
			{},
			'completed',
		);
		return { actions: response.actions ?? [] };
	};

export const getSupportedObjectsDirectory: SalesforceEndpoints['getSupportedObjectsDirectory'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/object-info',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.supported_objects_dir',
			{},
			'completed',
		);
		return response;
	};

export const getGlobalActions: SalesforceEndpoints['getGlobalActions'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<{
		actions: Array<Record<string, unknown>>;
	}>('quickActions', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'salesforce.metadata.global_actions',
		{},
		'completed',
	);
	return { actions: response.actions ?? [] };
};

export const headSobjectsGlobalDescribeLayouts: SalesforceEndpoints['headSobjectsGlobalDescribeLayouts'] =
	async (ctx, _input) => {
		await makeSalesforceRequest<void>(
			'sobjects/Global/describe/layouts',
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_global_describe_layouts',
			{},
			'completed',
		);
		return { status: 200 };
	};

export const getSObjectsDescribeLayoutsRecordTypeId: SalesforceEndpoints['getSObjectsDescribeLayoutsRecordTypeId'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/describe/layouts/${input.recordTypeId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.layouts_record_type_id',
			input,
			'completed',
		);
		return response;
	};

export const getOrgLimits: SalesforceEndpoints['getOrgLimits'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		'limits',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.org_limits',
		{},
		'completed',
	);
	return response;
};

export const headProcessRulesSObject: SalesforceEndpoints['headProcessRulesSObject'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`process/rules/${input.sobject}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_process_rules',
			input,
			'completed',
		);
		return { status: 200 };
	};

export const headSobjectQuickActionDefaultValues: SalesforceEndpoints['headSobjectQuickActionDefaultValues'] =
	async (ctx, input) => {
		const endpoint = input.contextId
			? `sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues/${input.contextId}`
			: `sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues`;

		await makeSalesforceRequest<void>(endpoint, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_quick_action_defaults',
			input,
			'completed',
		);
		return { status: 200 };
	};

export const getQuickActions: SalesforceEndpoints['getQuickActions'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<{
		actions: Array<Record<string, unknown>>;
	}>('quickActions', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'salesforce.metadata.get_quick_actions',
		{},
		'completed',
	);
	return { actions: response.actions ?? [] };
};

export const getRecordCounts: SalesforceEndpoints['getRecordCounts'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		sObjects: Array<Record<string, unknown>>;
	}>('limits/recordCount', ctx.key, {
		method: 'GET',
		query: { sObjects: input.sobjects.join(',') },
	});

	await logEventFromContext(
		ctx,
		'salesforce.metadata.record_counts',
		input,
		'completed',
	);
	return response;
};

export const getSobjectRelationship: SalesforceEndpoints['getSobjectRelationship'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/${input.id}/${input.fieldName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.sobject_relationship',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectQuickActionDefaultValues: SalesforceEndpoints['getSobjectQuickActionDefaultValues'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.quick_action_default_values',
			input,
			'completed',
		);
		return response;
	};

export const getSObjectQuickActionDefaultValues: SalesforceEndpoints['getSObjectQuickActionDefaultValues'] =
	async (ctx, input) => {
		const endpoint = input.contextId
			? `sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues/${input.contextId}`
			: `sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues`;

		const response = await makeSalesforceRequest<Record<string, unknown>>(
			endpoint,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.quick_action_default_values_context',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectByExternalId: SalesforceEndpoints['getSobjectByExternalId'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/${input.fieldName}/${input.fieldValue}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.sobject_external_id',
			input,
			'completed',
		);
		return response;
	};

export const headSobjectsQuickAction: SalesforceEndpoints['headSobjectsQuickAction'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/${input.sobject}/quickActions/${input.actionName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_sobject_quick_action',
			input,
			'completed',
		);
		return { status: 200 };
	};

export const getSObjectRecord: SalesforceEndpoints['getSObjectRecord'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`sobjects/${input.sobject}/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query: input.fields ? { fields: input.fields.join(',') } : undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.get_sobject_record',
		input,
		'completed',
	);
	return response;
};

export const headActionsStandard: SalesforceEndpoints['headActionsStandard'] =
	async (ctx, _input) => {
		await makeSalesforceRequest<void>('actions/standard', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.head_standard_actions',
			{},
			'completed',
		);
		return { status: 200 };
	};

export const listStandardInvocableActions: SalesforceEndpoints['listStandardInvocableActions'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<{
			actions: Array<Record<string, unknown>>;
		}>('actions/standard', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.metadata.standard_invocable_actions',
			{},
			'completed',
		);
		return { actions: response.actions ?? [] };
	};

export const getSupport: SalesforceEndpoints['getSupport'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		'support/data',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.support',
		{},
		'completed',
	);
	return response;
};

export const getSupportKnowledgeArticles: SalesforceEndpoints['getSupportKnowledgeArticles'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'support/knowledgeArticles',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.support_articles',
			{},
			'completed',
		);
		return response;
	};

export const getTheme: SalesforceEndpoints['getTheme'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		'theme',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'salesforce.metadata.theme', {}, 'completed');
	return response;
};

export const getSObjectsUpdated: SalesforceEndpoints['getSObjectsUpdated'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			ids: string[];
			latestDateCovered: string;
		}>(`sobjects/${input.sobject}/updated`, ctx.key, {
			method: 'GET',
			query: {
				start: input.start,
				end: input.end,
			},
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.sobjects_updated',
			input,
			'completed',
		);
		return response;
	};

export const getUserInfo: SalesforceEndpoints['getUserInfo'] = async (
	ctx,
	input,
) => {
	const endpoint = input.userId
		? `sobjects/User/${input.userId}`
		: 'chatter/users/me';
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		endpoint,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.metadata.user_info',
		input,
		'completed',
	);
	return response;
};

export const sobjectUserPassword: SalesforceEndpoints['sobjectUserPassword'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ isExpired?: boolean }>(
			`sobjects/User/${input.userId}/password`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.metadata.user_password_expiration',
			input,
			'completed',
		);
		return response;
	};

export const massTransferOwnership: SalesforceEndpoints['massTransferOwnership'] =
	async (ctx, input) => {
		const recordIds = input.recordIds ? [...input.recordIds] : [];
		if (recordIds.length === 0) {
			const safeSobject = escapeSoql(input.sobject);
			const safeFromUserId = escapeSoql(input.fromUserId);
			const queryRes = await makeSalesforceRequest<{
				records: Array<{ Id: string }>;
			}>('query', ctx.key, {
				method: 'GET',
				query: {
					q: `SELECT Id FROM ${safeSobject} WHERE OwnerId = '${safeFromUserId}' LIMIT 200`,
				},
			});
			for (const r of queryRes.records ?? []) {
				recordIds.push(r.Id);
			}
		}

		const compositeRecords = recordIds.map((id) => ({
			attributes: { type: input.sobject },
			Id: id,
			OwnerId: input.toUserId,
		}));

		await makeSalesforceRequest<unknown>('composite/sobjects', ctx.key, {
			method: 'PATCH',
			body: { records: compositeRecords },
		});

		await logEventFromContext(
			ctx,
			'salesforce.metadata.mass_transfer_ownership',
			input,
			'completed',
		);
		return { success: true };
	};
