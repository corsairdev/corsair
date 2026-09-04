/**
 * Benchmark Email account endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (User, Partner, Help folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery, eventLogPayload } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const addRemoveInboxTestsFromSubAccount: BenchmarkEmailEndpoints['accountAddRemoveInboxTestsFromSubAccount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountAddRemoveInboxTestsFromSubAccount']
		>(`Client/SubAccount/${encodeURIComponent(input.id)}/Inbox`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.addRemoveInboxTestsFromSubAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const copyImageToSubAccount: BenchmarkEmailEndpoints['accountCopyImageToSubAccount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountCopyImageToSubAccount']
		>(`Images/${encodeURIComponent(input.imageID)}/Copy`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.copyImageToSubAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteLinkedAgencyAccount: BenchmarkEmailEndpoints['accountDeleteLinkedAgencyAccount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountDeleteLinkedAgencyAccount']
		>(`Client/LinkAccount/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.deleteLinkedAgencyAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCommissionList: BenchmarkEmailEndpoints['accountGetCommissionList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetCommissionList']
		>(`Partner/CommissionList`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getCommissionList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getLinkedAgencyAccountDetails: BenchmarkEmailEndpoints['accountGetLinkedAgencyAccountDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetLinkedAgencyAccountDetails']
		>(`Client/LinkAccount/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getLinkedAgencyAccountDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getLinkedAgencyAccounts: BenchmarkEmailEndpoints['accountGetLinkedAgencyAccounts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetLinkedAgencyAccounts']
		>(`Client/LinkAccount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getLinkedAgencyAccounts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPartnerProfileDetails: BenchmarkEmailEndpoints['accountGetPartnerProfileDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetPartnerProfileDetails']
		>(`Partner/Profile`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getPartnerProfileDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReferralsList: BenchmarkEmailEndpoints['accountGetReferralsList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetReferralsList']
		>(`Partner/ReferralsList`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getReferralsList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccountHistory: BenchmarkEmailEndpoints['accountGetSubAccountHistory'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccountHistory']
		>(`Client/SubAccount/History`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccountHistory',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccounts: BenchmarkEmailEndpoints['accountGetSubAccounts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccounts']
		>(`Client/SubAccount`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccounts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccountsPlanList: BenchmarkEmailEndpoints['accountGetSubAccountsPlanList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccountsPlanList']
		>(`Client/SubAccount/${encodeURIComponent(input.id)}/PlanList`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccountsPlanList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReferralsLevel1List: BenchmarkEmailEndpoints['accountGetReferralsLevel1List'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetReferralsLevel1List']
		>(`Partner/ReferralsLevel1List`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getReferralsLevel1List',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccountBalance: BenchmarkEmailEndpoints['accountGetSubAccountBalance'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccountBalance']
		>(`Client/SubAccount/${encodeURIComponent(input.id)}/Balance`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccountBalance',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccountDetails: BenchmarkEmailEndpoints['accountGetSubAccountDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccountDetails']
		>(`Client/SubAccount/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccountDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSubAccountHistoryDetails: BenchmarkEmailEndpoints['accountGetSubAccountHistoryDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetSubAccountHistoryDetails']
		>(
			`Client/SubAccount/History/${encodeURIComponent(input.historyID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getSubAccountHistoryDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const linkAgencyAccount: BenchmarkEmailEndpoints['accountLinkAgencyAccount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountLinkAgencyAccount']
		>(`Client/LinkAccount/`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.linkAgencyAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const shareListsWithSubAccounts: BenchmarkEmailEndpoints['accountShareListsWithSubAccounts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountShareListsWithSubAccounts']
		>(
			`Contact/${encodeURIComponent(input.listID)}/ShareLists/${encodeURIComponent(input.clientIDs)}`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.shareListsWithSubAccounts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateLinkedAgencyAccount: BenchmarkEmailEndpoints['accountUpdateLinkedAgencyAccount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountUpdateLinkedAgencyAccount']
		>(`Client/LinkAccount/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'PATCH',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.updateLinkedAgencyAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updatePartnerProfile: BenchmarkEmailEndpoints['accountUpdatePartnerProfile'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountUpdatePartnerProfile']
		>(`Partner/Profile`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.updatePartnerProfile',
			{ ...input },
			'completed',
		);
		return response;
	};

export const changePassword: BenchmarkEmailEndpoints['accountChangePassword'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountChangePassword']
		>(`Client/Password`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.changePassword',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

export const changeSecurityPIN: BenchmarkEmailEndpoints['accountChangeSecurityPIN'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountChangeSecurityPIN']
		>(`Client/PIN`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.changeSecurityPIN',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

export const checkIfResponsive: BenchmarkEmailEndpoints['accountCheckIfResponsive'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountCheckIfResponsive']
		>(`Client/Responsive`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.checkIfResponsive',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disableSecurityPIN: BenchmarkEmailEndpoints['accountDisableSecurityPIN'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountDisableSecurityPIN']
		>(`Client/PIN/Disable`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.disableSecurityPIN',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAllConfirmedEmails: BenchmarkEmailEndpoints['accountGetAllConfirmedEmails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetAllConfirmedEmails']
		>(`Client/ConfirmedEmail/All`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getAllConfirmedEmails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientAccountSettings: BenchmarkEmailEndpoints['accountGetClientAccountSettings'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientAccountSettings']
		>(`Client/Setting`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientAccountSettings',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientPlanInformation: BenchmarkEmailEndpoints['accountGetClientPlanInformation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientPlanInformation']
		>(`Client/Plan`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientPlanInformation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCurrentEmailAtTimeOfReset: BenchmarkEmailEndpoints['accountGetCurrentEmailAtTimeOfReset'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetCurrentEmailAtTimeOfReset']
		>(`Client/Email/Reset`, ctx.key, {
			method: 'GET',
			query: compactQuery({ guid: input.guid }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getCurrentEmailAtTimeOfReset',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDMARCList: BenchmarkEmailEndpoints['accountGetDMARCList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetDMARCList']
		>(`Client/DMarc`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getDMARCList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getListOfConfirmedEmails: BenchmarkEmailEndpoints['accountGetListOfConfirmedEmails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetListOfConfirmedEmails']
		>(`Client/ConfirmedEmail`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getListOfConfirmedEmails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientDetails: BenchmarkEmailEndpoints['accountGetClientDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientDetails']
		>(`Client/`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientFilterDomain: BenchmarkEmailEndpoints['accountGetClientFilterDomain'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientFilterDomain']
		>(`Client/FilterDomain`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientFilterDomain',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientProfileDetails: BenchmarkEmailEndpoints['accountGetClientProfileDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientProfileDetails']
		>(`Client/ProfileDetails`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientProfileDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClientsRatingRange: BenchmarkEmailEndpoints['accountGetClientsRatingRange'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetClientsRatingRange']
		>(`Client/RatingRange`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getClientsRatingRange',
			{ ...input },
			'completed',
		);
		return response;
	};

export const loginRedirectUsingToken: BenchmarkEmailEndpoints['accountLoginRedirectUsingToken'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountLoginRedirectUsingToken']
		>(`Client/Token`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.loginRedirectUsingToken',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

export const patchUpdateClientSettings: BenchmarkEmailEndpoints['accountPatchUpdateClientSettings'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountPatchUpdateClientSettings']
		>(`Client/Setting`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.patchUpdateClientSettings',
			{ ...input },
			'completed',
		);
		return response;
	};

export const resendConfirmEmail: BenchmarkEmailEndpoints['accountResendConfirmEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountResendConfirmEmail']
		>(`Client/ConfirmedEmail/${encodeURIComponent(input.email)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.resendConfirmEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const saveSecurityPIN: BenchmarkEmailEndpoints['accountSaveSecurityPIN'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSaveSecurityPIN']
		>(`Client/PIN`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.saveSecurityPIN',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

export const saveWebsiteDomain: BenchmarkEmailEndpoints['accountSaveWebsiteDomain'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSaveWebsiteDomain']
		>(`Client/InitSurvey`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.saveWebsiteDomain',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendPINViaEmail: BenchmarkEmailEndpoints['accountSendPINViaEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSendPINViaEmail']
		>(`Client/PIN/Email`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.sendPINViaEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendResetEmail: BenchmarkEmailEndpoints['accountSendResetEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSendResetEmail']
		>(`Client/Email/ResetLink`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.sendResetEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const setResponsive: BenchmarkEmailEndpoints['accountSetResponsive'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSetResponsive']
		>(`Client/Responsive`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.setResponsive',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateEditProfile: BenchmarkEmailEndpoints['accountUpdateEditProfile'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountUpdateEditProfile']
		>(`Client/`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.updateEditProfile',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateResetEmail: BenchmarkEmailEndpoints['accountUpdateResetEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountUpdateResetEmail']
		>(`Client/Email/Reset`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.updateResetEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getNotification: BenchmarkEmailEndpoints['accountGetNotification'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetNotification']
		>(`Client/Notification`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getNotification',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getWebPageAdsDetail: BenchmarkEmailEndpoints['accountGetWebPageAdsDetail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetWebPageAdsDetail']
		>(`Partner/WebPageAdsDetail`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getWebPageAdsDetail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getHelpTopics: BenchmarkEmailEndpoints['accountGetHelpTopics'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetHelpTopics']
		>(`Help/`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getHelpTopics',
			{ ...input },
			'completed',
		);
		return response;
	};

export const generateSupportTicket: BenchmarkEmailEndpoints['accountGenerateSupportTicket'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGenerateSupportTicket']
		>(`Help/Ticket`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.generateSupportTicket',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendSupportFeedback: BenchmarkEmailEndpoints['accountSendSupportFeedback'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountSendSupportFeedback']
		>(`Help/`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.sendSupportFeedback',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCommunityDomain: BenchmarkEmailEndpoints['accountGetCommunityDomain'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetCommunityDomain']
		>(`Client/Community/Domain`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getCommunityDomain',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAccountSummary: BenchmarkEmailEndpoints['accountGetAccountSummary'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['accountGetAccountSummary']
		>(`Images/Summary`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.account.getAccountSummary',
			{ ...input },
			'completed',
		);
		return response;
	};
