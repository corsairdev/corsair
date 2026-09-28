import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	ApplicationChangeStageResponse,
	ApplicationCreateResponse,
	ApplicationInfoResponse,
	ApplicationListResponse,
	ApplicationTransferResponse,
	ApplicationUpdateResponse,
} from './types';

export const info: AshbyEndpoints['application.info'] = async (ctx, input) => {
	return await ashbyCall<ApplicationInfoResponse>(ctx, 'application.info', {
		applicationId: input.applicationId,
	});
};

export const list: AshbyEndpoints['application.list'] = async (ctx, input) => {
	return await ashbyCall<ApplicationListResponse>(ctx, 'application.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		candidateId: input.candidateId,
		jobId: input.jobId,
		status: input.status,
	});
};

export const create: AshbyEndpoints['application.create'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<ApplicationCreateResponse>(ctx, 'application.create', {
		candidateId: input.candidateId,
		jobId: input.jobId,
		interviewStageId: input.interviewStageId,
		sourceId: input.sourceId,
		customFields: input.customFields,
	});
};

export const changeStage: AshbyEndpoints['application.changeStage'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<ApplicationChangeStageResponse>(
		ctx,
		'application.changeStage',
		{
			applicationId: input.applicationId,
			interviewStageId: input.interviewStageId,
			archiveReasonId: input.archiveReasonId,
		},
	);
};

export const update: AshbyEndpoints['application.update'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<ApplicationUpdateResponse>(ctx, 'application.update', {
		applicationId: input.applicationId,
		archiveReasonId: input.archiveReasonId,
		customFields: input.customFields,
	});
};

export const transfer: AshbyEndpoints['application.transfer'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<ApplicationTransferResponse>(
		ctx,
		'application.transfer',
		{
			applicationId: input.applicationId,
			jobId: input.jobId,
			interviewStageId: input.interviewStageId,
		},
	);
};
