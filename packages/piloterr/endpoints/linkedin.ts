import type { PiloterrEndpoints } from '..';
import { call } from './call';
import {
	PiloterrEndpointInputSchemas as Inputs,
	PiloterrEndpointOutputSchemas as Outputs,
} from './types';

const V2 = '/v2';

export const companyInfo: PiloterrEndpoints['linkedinCompanyInfo'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'linkedin.companyInfo',
			input: Inputs.linkedinCompanyInfo,
			output: Outputs.linkedinCompanyInfo,
		},
		input,
		({ query, domain, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/linkedin/company/info`,
			query: { query, domain, soft_fail: softFail, fields },
		}),
		{
			log: (_, company) => ({ companyName: company.company_name ?? undefined }),
		},
	);

export const profileInfo: PiloterrEndpoints['linkedinProfileInfo'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'linkedin.profileInfo',
			input: Inputs.linkedinProfileInfo,
			output: Outputs.linkedinProfileInfo,
		},
		input,
		({ query, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/linkedin/profile/info`,
			query: { query, soft_fail: softFail, fields },
		}),
		{ log: (_, profile) => ({ username: profile.username ?? undefined }) },
	);

export const jobInfo: PiloterrEndpoints['linkedinJobInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'linkedin.jobInfo',
			input: Inputs.linkedinJobInfo,
			output: Outputs.linkedinJobInfo,
		},
		input,
		({ query, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/linkedin/job/info`,
			query: { query, soft_fail: softFail, fields },
		}),
		{ log: (_, job) => ({ jobId: job.id ?? undefined }) },
	);

export const jobSearch: PiloterrEndpoints['linkedinJobSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'linkedin.jobSearch',
			input: Inputs.linkedinJobSearch,
			output: Outputs.linkedinJobSearch,
		},
		input,
		({
			keyword,
			experienceLevel,
			jobType,
			when,
			flexibility,
			distance,
			geoId,
			companyId,
			page,
			softFail,
			fields,
		}) => ({
			method: 'GET',
			path: `${V2}/linkedin/job/search`,
			query: {
				keyword,
				experience_level: experienceLevel,
				job_type: jobType,
				when,
				flexibility,
				distance,
				geo_id: geoId,
				company_id: companyId,
				page,
				soft_fail: softFail,
				fields,
			},
		}),
		{
			// The live API answers a bare array of jobs (2026-11-21); the
			// documented { results, pagination } envelope is kept as is.
			shape: (raw) => (Array.isArray(raw) ? { results: raw } : raw),
			log: (_, page) => ({ results: page.results.length }),
		},
	);

export const postInfo: PiloterrEndpoints['linkedinPostInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'linkedin.postInfo',
			input: Inputs.linkedinPostInfo,
			output: Outputs.linkedinPostInfo,
		},
		input,
		({ query, softFail, fields }) => ({
			method: 'GET',
			path: `${V2}/linkedin/post/info`,
			query: { query, soft_fail: softFail, fields },
		}),
		{ log: (_, post) => ({ postId: post.id ?? undefined }) },
	);
