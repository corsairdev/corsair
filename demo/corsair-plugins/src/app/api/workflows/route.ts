import { NextRequest, NextResponse } from 'next/server';
import * as workflows from '@/workflows';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Get all workflow metadata
export async function GET() {
	try {
		const metadataDir = join(process.cwd(), 'src/workflows/metadata');
		const files = readdirSync(metadataDir);
		const metadataFiles = files.filter((f) => f.endsWith('.json'));

		const workflowsData = metadataFiles.map((file) => {
			const filePath = join(metadataDir, file);
			const content = readFileSync(filePath, 'utf-8');
			return JSON.parse(content);
		});

		// Separate by trigger type
		const manual = workflowsData.filter((w) => w.trigger.type === 'manual');
		const cron = workflowsData.filter((w) => w.trigger.type === 'cron');
		const webhook = workflowsData.filter((w) => w.trigger.type === 'webhook');

		return NextResponse.json({
			manual,
			cron,
			webhook,
			all: workflowsData,
		});
	} catch (error) {
		console.error('Error loading workflows:', error);
		return NextResponse.json(
			{ error: 'Failed to load workflows' },
			{ status: 500 },
		);
	}
}

// Trigger a workflow
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { workflowId, params } = body;

		if (!workflowId) {
			return NextResponse.json(
				{ error: 'workflowId is required' },
				{ status: 400 },
			);
		}

		// Map workflow IDs to functions
		const workflowMap: Record<string, (...args: any[]) => Promise<any>> = {
			'sync-posthog-events-to-linear': workflows.syncPosthogEventsToLinear,
			'backup-slack-messages-to-google-sheets':
				workflows.backupSlackMessagesToGoogleSheets,
			'export-posthog-events-to-google-sheets':
				workflows.exportPosthogEventsToGoogleSheets,
			'sync-slack-channels-to-linear': workflows.syncSlackChannelsToLinear,
			'export-slack-analytics-to-posthog':
				workflows.exportSlackAnalyticsToPosthog,
			'alert-on-posthog-anomalies': workflows.alertOnPosthogAnomalies,
			'create-github-issues-from-linear-backlog':
				workflows.createGithubIssuesFromLinearBacklog,
			'sync-hubspot-contacts-to-slack': workflows.syncHubspotContactsToSlack,
			'archive-completed-linear-issues': workflows.archiveCompletedLinearIssues,
			'generate-weekly-report-document':
				workflows.generateWeeklyReportDocument,
			// Cron workflows (can also be triggered manually)
			'daily-standup-summary': workflows.dailyStandupSummary,
			'weekly-github-activity-report': workflows.weeklyGithubActivityReport,
			'send-email-digest-of-linear-issues':
				workflows.sendEmailDigestOfLinearIssues,
			'daily-posthog-metrics-to-slack': workflows.dailyPosthogMetricsToSlack,
			'weekly-linear-issue-summary': workflows.weeklyLinearIssueSummary,
			'daily-github-star-count-to-slack':
				workflows.dailyGithubStarCountToSlack,
			'weekly-team-productivity-report':
				workflows.weeklyTeamProductivityReport,
			'daily-linear-burndown-to-slack': workflows.dailyLinearBurndownToSlack,
			'weekly-cross-platform-summary': workflows.weeklyCrossPlatformSummary,
		};

		const workflowFn = workflowMap[workflowId];

		if (!workflowFn) {
			return NextResponse.json(
				{ error: `Workflow ${workflowId} not found` },
				{ status: 404 },
			);
		}

		// Default params
		const defaultParams = {
			tenantId: 'default',
			...params,
		};

		// Execute workflow
		const result = await workflowFn(defaultParams);

		return NextResponse.json({
			success: true,
			result,
		});
	} catch (error) {
		console.error('Error executing workflow:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Failed to execute workflow',
			},
			{ status: 500 },
		);
	}
}
