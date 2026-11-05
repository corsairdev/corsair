import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';

const ccrPath = (index: string, suffix: string) =>
	`/${encodeIndexTarget(index)}/_ccr/${suffix}`;

export const follow: ElasticsearchEndpoints['ccrFollow'] = (ctx, input) =>
	call(ctx, 'ccrFollow', 'ccr.follow', input, {
		method: 'PUT',
		path: (parsed) => ccrPath(parsed.index, 'follow'),
		query: (parsed) => pickQuery(parsed, ['master_timeout']),
		body: (parsed) =>
			pickBody(parsed, [
				'leader_index',
				'remote_cluster',
				'max_outstanding_read_requests',
				'max_retry_delay',
				'read_poll_timeout',
				'settings',
			]),
	});

export const followInfo: ElasticsearchEndpoints['ccrFollowInfo'] = (
	ctx,
	input,
) =>
	call(ctx, 'ccrFollowInfo', 'ccr.followInfo', input, {
		path: (parsed) => ccrPath(parsed.index, 'info'),
		query: (parsed) => pickQuery(parsed, ['master_timeout']),
	});

export const followStats: ElasticsearchEndpoints['ccrFollowStats'] = (
	ctx,
	input,
) =>
	call(ctx, 'ccrFollowStats', 'ccr.followStats', input, {
		path: (parsed) => ccrPath(parsed.index, 'stats'),
		query: (parsed) => pickQuery(parsed, ['timeout']),
	});

export const forgetFollower: ElasticsearchEndpoints['ccrForgetFollower'] = (
	ctx,
	input,
) =>
	call(ctx, 'ccrForgetFollower', 'ccr.forgetFollower', input, {
		method: 'POST',
		path: (parsed) => ccrPath(parsed.index, 'forget_follower'),
		query: (parsed) => pickQuery(parsed, ['timeout']),
		body: (parsed) =>
			pickBody(parsed, [
				'follower_cluster',
				'follower_index',
				'follower_index_uuid',
				'leader_remote_cluster',
			]),
	});

export const pauseFollow: ElasticsearchEndpoints['ccrPauseFollow'] = (
	ctx,
	input,
) =>
	call(ctx, 'ccrPauseFollow', 'ccr.pauseFollow', input, {
		method: 'POST',
		path: (parsed) => ccrPath(parsed.index, 'pause_follow'),
		query: (parsed) => pickQuery(parsed, ['master_timeout']),
	});

export const resumeFollow: ElasticsearchEndpoints['ccrResumeFollow'] = (
	ctx,
	input,
) =>
	call(ctx, 'ccrResumeFollow', 'ccr.resumeFollow', input, {
		method: 'POST',
		path: (parsed) => ccrPath(parsed.index, 'resume_follow'),
		query: (parsed) => pickQuery(parsed, ['master_timeout']),
	});

export const unfollow: ElasticsearchEndpoints['ccrUnfollow'] = (ctx, input) =>
	call(ctx, 'ccrUnfollow', 'ccr.unfollow', input, {
		method: 'POST',
		path: (parsed) => ccrPath(parsed.index, 'unfollow'),
		query: (parsed) => pickQuery(parsed, ['master_timeout']),
	});
