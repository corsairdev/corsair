import type { WebhookRequest } from '../core';
import * as linearCommentsWebhooks from '../plugins/linear/webhooks/comments';
import * as linearIssuesWebhooks from '../plugins/linear/webhooks/issues';
import * as linearProjectsWebhooks from '../plugins/linear/webhooks/projects';
import type { LinearWebhookEvent } from '../plugins/linear/webhooks/types';
import * as slackChannelsWebhooks from '../plugins/slack/webhooks/channels';
import * as slackFilesWebhooks from '../plugins/slack/webhooks/files';
import * as slackMessagesWebhooks from '../plugins/slack/webhooks/messages';
import * as slackReactionsWebhooks from '../plugins/slack/webhooks/reactions';
import type { SlackWebhookPayload } from '../plugins/slack/webhooks/types';
import * as slackUsersWebhooks from '../plugins/slack/webhooks/users';

export interface WebhookFilterHeaders {
	[key: string]: string | string[] | undefined;
}

export interface WebhookFilterBody {
	[key: string]: unknown;
}

export type WebhookFilterResult =
	| {
			resource: 'slack';
			action: string | null;
			body: SlackWebhookPayload;
	  }
	| {
			resource: 'linear';
			action: string | null;
			body: LinearWebhookEvent;
	  }
	| {
			resource: null;
			action: null;
			body: unknown;
	  };

const slackHandlerMap: Record<
	string,
	(ctx: any, request: WebhookRequest<any>) => Promise<any>
> = {
	reaction_added: slackReactionsWebhooks.added,
	message: slackMessagesWebhooks.message,
	channel_created: slackChannelsWebhooks.created,
	team_join: slackUsersWebhooks.teamJoin,
	user_change: slackUsersWebhooks.userChange,
	file_created: slackFilesWebhooks.created,
	file_public: slackFilesWebhooks.publicFile,
	file_shared: slackFilesWebhooks.shared,
};

const linearHandlerMap: Record<
	string,
	(ctx: any, request: WebhookRequest<any>) => Promise<any>
> = {
	IssueCreate: linearIssuesWebhooks.issueCreate,
	IssueUpdate: linearIssuesWebhooks.issueUpdate,
	IssueRemove: linearIssuesWebhooks.issueRemove,
	CommentCreate: linearCommentsWebhooks.commentCreate,
	CommentUpdate: linearCommentsWebhooks.commentUpdate,
	CommentRemove: linearCommentsWebhooks.commentRemove,
	ProjectCreate: linearProjectsWebhooks.projectCreate,
	ProjectUpdate: linearProjectsWebhooks.projectUpdate,
	ProjectRemove: linearProjectsWebhooks.projectRemove,
};

export async function filterWebhook(
	headers: WebhookFilterHeaders,
	body: WebhookFilterBody | string,
): Promise<WebhookFilterResult> {
	const normalizedHeaders: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(headers)) {
		normalizedHeaders[key.toLowerCase()] = Array.isArray(value)
			? value[0]
			: value;
	}

	const parsedBody: WebhookFilterBody =
		typeof body === 'string' ? JSON.parse(body) : body;

	if (
		normalizedHeaders['x-slack-signature'] ||
		normalizedHeaders['x-slack-request-timestamp']
	) {
		const eventType =
			parsedBody.type === 'event_callback' &&
			typeof parsedBody.event === 'object' &&
			parsedBody.event !== null &&
			'type' in parsedBody.event
				? (parsedBody.event.type as string)
				: parsedBody.type === 'url_verification'
					? 'url_verification'
					: null;

		const result: WebhookFilterResult = {
			resource: 'slack',
			action: eventType,
			body: parsedBody as SlackWebhookPayload,
		};

		if (
			eventType &&
			eventType !== 'url_verification' &&
			slackHandlerMap[eventType]
		) {
			const handler = slackHandlerMap[eventType];
		}

		return result;
	}

	if (
		normalizedHeaders['linear-signature'] ||
		normalizedHeaders['linear-delivery']
	) {
		const eventType =
			typeof parsedBody.type === 'string' ? parsedBody.type : null;
		const action =
			typeof parsedBody.action === 'string' ? parsedBody.action : null;

		const combinedAction =
			eventType && action
				? `${eventType}${action.charAt(0).toUpperCase() + action.slice(1)}`
				: eventType || action || null;

		const result: WebhookFilterResult = {
			resource: 'linear',
			action: combinedAction,
			body: parsedBody as unknown as LinearWebhookEvent,
		};

		if (combinedAction && linearHandlerMap[combinedAction]) {
			const handler = linearHandlerMap[combinedAction];
		}

		return result;
	}

	return {
		resource: null,
		action: null,
		body: parsedBody,
	};
}
