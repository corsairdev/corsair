import * as crypto from 'crypto';
import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
} from '../types';

export type GitHubWebhookEventName =
	| 'commit_comment'
	| 'deployment'
	| 'pull_request'
	| 'push'
	| 'star'
	| 'team_add'
	| 'watch';

export interface GitHubWebhookHeaders {
	'x-github-event'?: string;
	'x-hub-signature-256'?: string;
	'x-github-delivery'?: string;
	[key: string]: string | undefined;
}

export interface HandleGitHubWebhookParams extends BaseOperationParams<GitHubPlugin, GitHubClient, GitHubPluginContext> {
	headers: GitHubWebhookHeaders;
	payload: string | object;
	secret?: string;
}

export interface HandleGitHubWebhookResult {
	success: boolean;
	eventType?: GitHubWebhookEventName;
	error?: string;
}

function verifySignature(
	payload: string | Buffer,
	signature: string,
	secret: string,
): boolean {
	if (!signature) {
		return false;
	}

	const expectedSignature =
		'sha256=' +
		crypto.createHmac('sha256', secret).update(payload).digest('hex');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

export async function handleGitHubWebhook(
	params: HandleGitHubWebhookParams,
): Promise<HandleGitHubWebhookResult> {
	const { headers, payload, secret } = params;
	const eventName = headers['x-github-event'] as GitHubWebhookEventName | undefined;
	const signature = headers['x-hub-signature-256'];

	if (!eventName) {
		return createErrorResponse(
			new Error('Missing x-github-event header'),
			'Missing x-github-event header',
		) as HandleGitHubWebhookResult;
	}

	const payloadString =
		typeof payload === 'string' ? payload : JSON.stringify(payload);

	if (secret && signature) {
		const isValid = verifySignature(payloadString, signature, secret);
		if (!isValid) {
			return createErrorResponse(
				new Error('Invalid signature'),
				'Invalid signature',
			) as HandleGitHubWebhookResult;
		}
	} else if (secret && !signature) {
		return createErrorResponse(
			new Error('Missing signature header'),
			'Missing signature header',
		) as HandleGitHubWebhookResult;
	}

	const parsedPayload =
		typeof payload === 'string' ? JSON.parse(payload) : payload;

	return createSuccessResponse({
		eventType: eventName,
		payload: parsedPayload,
	}) as HandleGitHubWebhookResult;
}

