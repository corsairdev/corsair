import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import {
	assertSobjectName,
	cloneableFields,
	createableNames,
	escapeSoql,
} from '../utils';
import { salesforceCall } from './shared';

export const createSObjectRecord: SalesforceEndpoints['createSObjectRecord'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			id: string;
			success?: boolean;
		}>(ctx, `sobjects/${input.sobject}`, {
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
	const orig = await salesforceCall<Record<string, unknown>>(
		ctx,
		`sobjects/${input.sobject}/${input.recordId}`,
		{ method: 'GET' },
	);
	const describe = await salesforceCall<{
		fields?: Array<{ name?: string; createable?: boolean }>;
	}>(ctx, `sobjects/${input.sobject}/describe`, { method: 'GET' });
	const allowed = createableNames(describe);
	const body = {
		...cloneableFields(orig, allowed),
		...cloneableFields(input.overrides ?? {}, allowed),
	};

	const response = await salesforceCall<{ id: string }>(
		ctx,
		`sobjects/${input.sobject}`,
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

		const response = await salesforceCall<{
			id: string;
			success?: boolean;
		}>(ctx, 'tooling/sobjects/CustomField', { method: 'POST', body });

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

		const response = await salesforceCall<{
			id: string;
			success?: boolean;
		}>(ctx, 'tooling/sobjects/CustomObject', { method: 'POST', body });

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
	await salesforceCall<void>(ctx, `sobjects/${input.sobject}/${input.id}`, {
		method: 'DELETE',
	});

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
		await salesforceCall<void>(ctx, `sobjects/${input.sobject}/${input.id}`, {
			method: 'DELETE',
		});

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
	const response = await salesforceCall<{
		encoding?: string;
		maxBatchSize?: number;
		sobjects: Array<Record<string, unknown>>;
	}>(ctx, 'sobjects', { method: 'GET' });

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

		const response = await salesforceCall<{
			success: boolean;
			recordId?: string;
		}>(ctx, endpoint, {
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		endpoint,
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'chatter',
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'sobjects/PlatformAction/describe',
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
	await salesforceCall<void>(ctx, 'quickActions', { method: 'HEAD' });

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
		await salesforceCall<void>(ctx, `sobjects/User/${input.userId}/password`, {
			method: 'HEAD',
		});

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`ui-api/object-info/${input.sobject}/picklist-values/${input.recordTypeId}`,
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
		const response = await salesforceCall<{
			fields: Array<Record<string, unknown>>;
		}>(ctx, `sobjects/${input.sobject}/describe`, { method: 'GET' });

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
		const response = await salesforceCall<{
			sobjects: Array<Record<string, unknown>>;
		}>(ctx, 'sobjects', { method: 'GET' });

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/describe/approvalLayouts`,
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/approvalLayouts`,
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
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, `sobjects/Account/${input.parentId}/${input.relationshipName}`, {
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		'consent/action',
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
		await salesforceCall<void>(ctx, 'actions/custom', {
			method: 'HEAD',
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
		const response = await salesforceCall<{
			actions: Array<Record<string, unknown>>;
		}>(ctx, 'actions/custom', { method: 'GET' });

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'ui-api/object-info',
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
	const response = await salesforceCall<{
		actions: Array<Record<string, unknown>>;
	}>(ctx, 'quickActions', { method: 'GET' });

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
		await salesforceCall<void>(ctx, 'sobjects/Global/describe/layouts', {
			method: 'HEAD',
		});

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/describe/layouts/${input.recordTypeId}`,
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		'limits',
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
		await salesforceCall<void>(ctx, `process/rules/${input.sobject}`, {
			method: 'HEAD',
		});

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

		await salesforceCall<void>(ctx, endpoint, { method: 'HEAD' });

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
	const response = await salesforceCall<{
		actions: Array<Record<string, unknown>>;
	}>(ctx, 'quickActions', { method: 'GET' });

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
	const response = await salesforceCall<{
		sObjects: Array<Record<string, unknown>>;
	}>(ctx, 'limits/recordCount', {
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/${input.id}/${input.fieldName}`,
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/quickActions/${input.actionName}/defaultValues`,
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

		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			endpoint,
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/${input.sobject}/${input.fieldName}/${encodeURIComponent(input.fieldValue)}`,
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
		await salesforceCall<void>(
			ctx,
			`sobjects/${input.sobject}/quickActions/${input.actionName}`,
			{ method: 'HEAD' },
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		`sobjects/${input.sobject}/${input.id}`,
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
		await salesforceCall<void>(ctx, 'actions/standard', {
			method: 'HEAD',
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
		const response = await salesforceCall<{
			actions: Array<Record<string, unknown>>;
		}>(ctx, 'actions/standard', { method: 'GET' });

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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		'support/data',
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'support/knowledgeArticles',
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
	const response = await salesforceCall<Record<string, unknown>>(ctx, 'theme', {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'salesforce.metadata.theme', {}, 'completed');
	return response;
};

export const getSObjectsUpdated: SalesforceEndpoints['getSObjectsUpdated'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			ids: string[];
			latestDateCovered: string;
		}>(ctx, `sobjects/${input.sobject}/updated`, {
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		endpoint,
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
		const response = await salesforceCall<{ isExpired?: boolean }>(
			ctx,
			`sobjects/User/${input.userId}/password`,
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
		const sobject = assertSobjectName(input.sobject);
		const recordIds = input.recordIds ? [...input.recordIds] : [];
		if (recordIds.length === 0) {
			const safeFromUserId = escapeSoql(input.fromUserId);
			let endpoint = 'query';
			let query: Record<string, string> | undefined = {
				q: `SELECT Id FROM ${sobject} WHERE OwnerId = '${safeFromUserId}' LIMIT 200`,
			};
			while (true) {
				const queryRes = await salesforceCall<{
					records?: Array<{ Id: string }>;
					done?: boolean;
					nextRecordsUrl?: string;
				}>(ctx, endpoint, { method: 'GET', query });
				for (const r of queryRes.records ?? []) {
					recordIds.push(r.Id);
				}
				if (queryRes.done !== false || !queryRes.nextRecordsUrl) break;
				endpoint = queryRes.nextRecordsUrl;
				query = undefined;
			}
		}

		const failed: Array<{ id?: string; errors?: unknown }> = [];
		let transferred = 0;
		for (let i = 0; i < recordIds.length; i += 200) {
			const chunk = recordIds.slice(i, i + 200);
			const result = await salesforceCall<unknown>(ctx, 'composite/sobjects', {
				method: 'PATCH',
				body: {
					records: chunk.map((id) => ({
						attributes: { type: sobject },
						Id: id,
						OwnerId: input.toUserId,
					})),
				},
			});
			const rows = Array.isArray(result)
				? result
				: Array.isArray((result as { results?: unknown }).results)
					? (result as { results: unknown[] }).results
					: [];
			if (rows.length === 0) {
				transferred += chunk.length;
				continue;
			}
			for (let j = 0; j < chunk.length; j++) {
				const row = rows[j] as
					| { success?: boolean; id?: string; errors?: unknown }
					| undefined;
				if (row && row.success === false) {
					failed.push({ id: row.id ?? chunk[j], errors: row.errors });
				} else {
					transferred += 1;
				}
			}
		}

		await logEventFromContext(
			ctx,
			'salesforce.metadata.mass_transfer_ownership',
			input,
			'completed',
		);
		return { success: failed.length === 0, transferred, failed };
	};

export const updateSobject: SalesforceEndpoints['updateSobject'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `sobjects/${input.sobject}/${input.id}`, {
		method: 'PATCH',
		body: input.fields,
	});
	await logEventFromContext(
		ctx,
		'salesforce.metadata.update_sobject',
		input,
		'completed',
	);
	return { success: true };
};

export const sobjectRowsUpdate: SalesforceEndpoints['sobjectRowsUpdate'] =
	updateSobject as unknown as SalesforceEndpoints['sobjectRowsUpdate'];

export const upsertSobjectByExternalId: SalesforceEndpoints['upsertSobjectByExternalId'] =
	async (ctx, input) => {
		const response = await salesforceCall<{
			id?: string;
			created?: boolean;
			success?: boolean;
		}>(
			ctx,
			`sobjects/${input.sobject}/${input.fieldName}/${encodeURIComponent(input.fieldValue)}`,
			{ method: 'PATCH', body: input.fields },
		);
		await logEventFromContext(
			ctx,
			'salesforce.metadata.upsert_by_external_id',
			input,
			'completed',
		);
		return response;
	};

export const setUserPassword: SalesforceEndpoints['setUserPassword'] = async (
	ctx,
	input,
) => {
	const body = input.password ? { NewPassword: input.password } : {};
	const response = await salesforceCall<unknown>(
		ctx,
		`sobjects/User/${input.userId}/password`,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'salesforce.metadata.set_user_password',
		{ userId: input.userId },
		'completed',
	);
	return { result: response };
};
