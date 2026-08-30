import { AshbyAPIError } from '../client';
import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	InterviewInfoResponse,
	InterviewListResponse,
	InterviewScheduleListResponse,
	InterviewStageListResponse,
} from './types';
import { InterviewScheduleInfoResponseSchema } from './types';

export const info: AshbyEndpoints['interview.info'] = async (ctx, input) => {
	return await ashbyCall<InterviewInfoResponse>(ctx, 'interview.info', {
		interviewId: input.interviewId,
	});
};

export const list: AshbyEndpoints['interview.list'] = async (ctx, input) => {
	return await ashbyCall<InterviewListResponse>(ctx, 'interview.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		interviewPlanId: input.interviewPlanId,
	});
};

export const scheduleInfo: AshbyEndpoints['interview.scheduleInfo'] = async (
	ctx,
	input,
) => {
	let cursor: string | undefined;
	for (;;) {
		const page = await ashbyCall<InterviewScheduleListResponse>(
			ctx,
			'interviewSchedule.list',
			{
				limit: 100,
				...(cursor ? { cursor } : {}),
			},
		);
		const found = page.results.find(
			(schedule) => schedule.id === input.interviewScheduleId,
		);
		if (found) {
			return InterviewScheduleInfoResponseSchema.parse({
				success: true,
				results: found,
			});
		}
		if (!page.moreDataAvailable || !page.nextCursor) {
			throw new AshbyAPIError(
				'Interview schedule not found',
				404,
				'resource_not_found',
			);
		}
		cursor = page.nextCursor;
	}
};

export const scheduleList: AshbyEndpoints['interview.scheduleList'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<InterviewScheduleListResponse>(
		ctx,
		'interviewSchedule.list',
		{
			limit: input.limit,
			cursor: input.cursor,
			syncToken: input.syncToken,
			applicationId: input.applicationId,
		},
	);
};

export const stageList: AshbyEndpoints['interview.stageList'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<InterviewStageListResponse>(
		ctx,
		'interviewStage.list',
		{
			jobId: input.jobId,
			interviewPlanId: input.interviewPlanId,
		},
	);
};
