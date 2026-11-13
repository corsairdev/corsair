import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const projects: AhrefsEndpoints['siteAuditProjects'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteAuditProjects',
			method: 'GET',
			path: '/site-audit/projects',
			event: 'ahrefs.siteAudit.projects',
			logKeys: ['project_id', 'date'],
		},
		input,
	);

export const issues: AhrefsEndpoints['siteAuditIssues'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteAuditIssues',
			method: 'GET',
			path: '/site-audit/issues',
			event: 'ahrefs.siteAudit.issues',
			logKeys: ['project_id', 'date'],
		},
		input,
	);

export const pageExplorer: AhrefsEndpoints['siteAuditPageExplorer'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteAuditPageExplorer',
			method: 'GET',
			path: '/site-audit/page-explorer',
			event: 'ahrefs.siteAudit.pageExplorer',
			logKeys: ['project_id', 'date', 'issue_id'],
		},
		input,
	);

export const pageContent: AhrefsEndpoints['siteAuditPageContent'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteAuditPageContent',
			method: 'GET',
			path: '/site-audit/page-content',
			event: 'ahrefs.siteAudit.pageContent',
			logKeys: ['project_id', 'date', 'target_url'],
		},
		input,
	);
