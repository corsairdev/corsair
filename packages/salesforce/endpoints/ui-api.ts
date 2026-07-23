import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const createARecord: SalesforceEndpoints['createARecord'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		id: string;
		apiName?: string;
	}>('ui-api/records', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'salesforce.ui_api.create_record',
		input,
		'completed',
	);
	return response;
};

export const createRecordUiApi: SalesforceEndpoints['createRecordUiApi'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			id: string;
			apiName?: string;
		}>('ui-api/records', ctx.key, { method: 'POST', body: input });

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.create_record_ui',
			input,
			'completed',
		);
		return response;
	};

export const getUiapiListInfoAccountAllAccounts: SalesforceEndpoints['getUiapiListInfoAccountAllAccounts'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/list-info/Account/AllAccounts',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_info_account_all',
			{},
			'completed',
		);
		return response;
	};

export const getUiapiListInfoAccountSearchResult: SalesforceEndpoints['getUiapiListInfoAccountSearchResult'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/list-info/Account/__SearchResult',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_info_account_search',
			{},
			'completed',
		);
		return response;
	};

export const headAppmenuSalesforce1: SalesforceEndpoints['headAppmenuSalesforce1'] =
	async (ctx, _input) => {
		await makeSalesforceRequest<void>('appmenu/Salesforce1', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.head_appmenu',
			{},
			'completed',
		);
		return { status: 200 };
	};

export const getCompactLayouts: SalesforceEndpoints['getCompactLayouts'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/compact-layouts/${input.sobjects.join(',')}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.compact_layouts',
			input,
			'completed',
		);
		return response;
	};

export const getListViewActions: SalesforceEndpoints['getListViewActions'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/actions/list-view/${input.sobject}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_view_actions',
			input,
			'completed',
		);
		return response;
	};

export const getUiapiListInfoAccountRecent: SalesforceEndpoints['getUiapiListInfoAccountRecent'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/list-info/Account/Recent',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_info_account_recent',
			{},
			'completed',
		);
		return response;
	};

export const getUiApiListInfoRecent: SalesforceEndpoints['getUiApiListInfoRecent'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/list-info/${input.sobject}/Recent`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_info_recent',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const getUiapimruListInfoAccount: SalesforceEndpoints['getUiapimruListInfoAccount'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/mru-list-info/Account',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.mru_list_info_account_deprecated',
			{},
			'completed',
		);
		return response;
	};

/** @deprecated */
export const getUiApiMruListRecordsAccount: SalesforceEndpoints['getUiApiMruListRecordsAccount'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/mru-list-records/Account',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.mru_list_records_account_deprecated',
			{},
			'completed',
		);
		return response;
	};

export const getUiapiActionsMruListAccount: SalesforceEndpoints['getUiapiActionsMruListAccount'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/actions/mru-list/Account',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.actions_mru_list_account',
			{},
			'completed',
		);
		return response;
	};

export const getMruListViewMetadata: SalesforceEndpoints['getMruListViewMetadata'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/mru-list-info/${input.sobject}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.mru_list_view_metadata',
			input,
			'completed',
		);
		return response;
	};

export const getUiApiAppsUserNavItems: SalesforceEndpoints['getUiApiAppsUserNavItems'] =
	async (ctx, input) => {
		const endpoint = input.appId
			? `ui-api/apps/${input.appId}/user-nav-items`
			: 'ui-api/apps/user-nav-items';
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			endpoint,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.apps_user_nav_items',
			input,
			'completed',
		);
		return response;
	};

export const getAllNavigationItems: SalesforceEndpoints['getAllNavigationItems'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/nav-items',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.all_nav_items',
			{},
			'completed',
		);
		return response;
	};

export const getApp: SalesforceEndpoints['getApp'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`ui-api/apps/${input.appId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.ui_api.get_app',
		input,
		'completed',
	);
	return response;
};

export const getApps: SalesforceEndpoints['getApps'] = async (ctx, _input) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		'ui-api/apps',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'salesforce.ui_api.get_apps', {}, 'completed');
	return response;
};

export const getListViewMetadataBatch: SalesforceEndpoints['getListViewMetadataBatch'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/list-info/${input.listViewIds.join(',')}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_view_metadata_batch',
			input,
			'completed',
		);
		return response;
	};

export const getRelatedListPreferencesBatch: SalesforceEndpoints['getRelatedListPreferencesBatch'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/related-list-preferences/${input.relatedListIds.join(',')}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.related_list_preferences_batch',
			input,
			'completed',
		);
		return response;
	};

export const getLastSelectedApp: SalesforceEndpoints['getLastSelectedApp'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/apps/last-selected',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.last_selected_app',
			{},
			'completed',
		);
		return response;
	};

export const getListViewMetadataByName: SalesforceEndpoints['getListViewMetadataByName'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/list-info/${input.sobject}/${input.listViewName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_view_metadata_by_name',
			input,
			'completed',
		);
		return response;
	};

export const getListViewRecordsByName: SalesforceEndpoints['getListViewRecordsByName'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/list-records/${input.sobject}/${input.listViewName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_view_records_by_name',
			input,
			'completed',
		);
		return response;
	};

export const getListViewRecordsById: SalesforceEndpoints['getListViewRecordsById'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/list-records/${input.listViewId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.list_view_records_by_id',
			input,
			'completed',
		);
		return response;
	};

export const listViewResults: SalesforceEndpoints['listViewResults'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`ui-api/list-records/${input.listViewId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.ui_api.list_view_results',
		input,
		'completed',
	);
	return response;
};

export const getListViewResults: SalesforceEndpoints['getListViewResults'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/listviews/${input.listViewId}/results`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.get_list_view_results',
			input,
			'completed',
		);
		return response;
	};

export const getObjectListViews: SalesforceEndpoints['getObjectListViews'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/listviews`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.object_list_views',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectListViews: SalesforceEndpoints['getSobjectListViews'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/listviews`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.sobject_list_views',
			input,
			'completed',
		);
		return response;
	};

export const getUiApiActionsLookupAccount: SalesforceEndpoints['getUiApiActionsLookupAccount'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/actions/lookup/Account',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.actions_lookup_account',
			{},
			'completed',
		);
		return response;
	};

export const getUiapiLookupsOpportunityAccountId: SalesforceEndpoints['getUiapiLookupsOpportunityAccountId'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/lookups/Opportunity/AccountId',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.lookups_opportunity_account_id',
			{},
			'completed',
		);
		return response;
	};

export const getLookupFieldSuggestions: SalesforceEndpoints['getLookupFieldSuggestions'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/lookups/${input.sobject}/${input.field}`,
			ctx.key,
			{
				method: 'GET',
				query: input.q ? { q: input.q } : undefined,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.lookup_field_suggestions',
			input,
			'completed',
		);
		return response;
	};

export const getLookupSuggestionsOpportunityAccount: SalesforceEndpoints['getLookupSuggestionsOpportunityAccount'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/lookups/Opportunity/AccountId',
			ctx.key,
			{
				method: 'POST',
				body: input.q ? { q: input.q } : {},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.lookup_suggestions_opp_acc',
			input,
			'completed',
		);
		return response;
	};

export const getLookupSuggestionsCaseContact: SalesforceEndpoints['getLookupSuggestionsCaseContact'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			'ui-api/lookups/Case/ContactId',
			ctx.key,
			{
				method: 'POST',
				body: input.q ? { q: input.q } : {},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.lookup_suggestions_case_contact',
			input,
			'completed',
		);
		return response;
	};

export const getMruListViewRecords: SalesforceEndpoints['getMruListViewRecords'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/mru-list-records/${input.sobject}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.mru_list_view_records',
			input,
			'completed',
		);
		return response;
	};

export const getPhotoActions: SalesforceEndpoints['getPhotoActions'] = async (
	ctx,
	input,
) => {
	const endpoint = input.pageId
		? `ui-api/actions/photo/${input.pageId}`
		: 'ui-api/actions/photo';
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		endpoint,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.ui_api.photo_actions',
		input,
		'completed',
	);
	return response;
};

export const getRecordUiDataAndMetadata: SalesforceEndpoints['getRecordUiDataAndMetadata'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/record-ui/${input.recordId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.record_ui_data_metadata',
			input,
			'completed',
		);
		return response;
	};

export const getRecordEditPageActions: SalesforceEndpoints['getRecordEditPageActions'] =
	async (ctx, input) => {
		const endpoint = input.recordId
			? `ui-api/actions/record-edit/${input.sobject}/${input.recordId}`
			: `ui-api/actions/record-edit/${input.sobject}`;
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			endpoint,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.record_edit_page_actions',
			input,
			'completed',
		);
		return response;
	};

export const getUiApiActionsRecordRelatedList: SalesforceEndpoints['getUiApiActionsRecordRelatedList'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/actions/record-related-list/${input.parentRecordId}/${input.relationshipName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.actions_record_related_list',
			input,
			'completed',
		);
		return response;
	};

export const getRelatedListActions: SalesforceEndpoints['getRelatedListActions'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/actions/related-list/${input.parentRecordId}/${input.relationshipName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.related_list_actions',
			input,
			'completed',
		);
		return response;
	};

export const getRelatedListRecordsContacts: SalesforceEndpoints['getRelatedListRecordsContacts'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/related-list-records/Account/${input.parentRecordId}/Contacts`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.related_list_records_contacts',
			input,
			'completed',
		);
		return response;
	};

export const getUiapiRelatedListPreferences: SalesforceEndpoints['getUiapiRelatedListPreferences'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`ui-api/related-list-preferences/${input.parentRecordId}/${input.relationshipName}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.related_list_preferences',
			input,
			'completed',
		);
		return response;
	};

export const getSobjectListView: SalesforceEndpoints['getSobjectListView'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/${input.sobject}/listviews/${input.listViewId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.ui_api.sobject_list_view_info',
			input,
			'completed',
		);
		return response;
	};
