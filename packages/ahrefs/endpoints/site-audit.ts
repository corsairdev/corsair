import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	SiteAuditIssuesResponse,
	SiteAuditPageContentResponse,
	SiteAuditPageExplorerResponse,
	SiteAuditProjectsResponse,
} from './types';

export const projects: AhrefsEndpoints['siteAuditProjects'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<SiteAuditProjectsResponse>(
		'/site-audit/projects',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteAudit.projects',
		{
			project_id: input.project_id,
			date: input.date,
			resultCount: response.healthscores.length,
		},
		'completed',
	);

	return response;
};

export const issues: AhrefsEndpoints['siteAuditIssues'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<SiteAuditIssuesResponse>(
		'/site-audit/issues',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteAudit.issues',
		{
			project_id: input.project_id,
			date: input.date,
			resultCount: response.issues.length,
		},
		'completed',
	);

	return response;
};

export const pageExplorer: AhrefsEndpoints['siteAuditPageExplorer'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<SiteAuditPageExplorerResponse>(
		'/site-audit/page-explorer',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteAudit.pageExplorer',
		{
			project_id: input.project_id,
			date: input.date,
			issue_id: input.issue_id,
			resultCount: response.pages.length,
		},
		'completed',
	);

	return response;
};

export const pageContent: AhrefsEndpoints['siteAuditPageContent'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<SiteAuditPageContentResponse>(
		'/site-audit/page-content',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteAudit.pageContent',
		{
			project_id: input.project_id,
			date: input.date,
			target_url: input.target_url,
		},
		'completed',
	);

	return response;
};
