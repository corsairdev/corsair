import * as crypto from 'crypto';
import {
	BaseWebhookHandler,
	type BaseWebhookHeaders,
	type HandleWebhookResult,
} from '../core/webhook-base';
import type {
	CommitCommentEvent,
	DeploymentEvent,
	PullRequestEvent,
	PushEvent,
	StarEvent,
	TeamAddEvent,
	WatchEvent,
} from './github-types';

export type WebhookEventName =
	| 'commit_comment'
	| 'deployment'
	| 'pull_request'
	| 'push'
	| 'star'
	| 'team_add'
	| 'watch';

export interface WebhookEventMap {
	commit_comment: CommitCommentEvent;
	deployment: DeploymentEvent;
	pull_request: PullRequestEvent;
	push: PushEvent;
	star: StarEvent;
	team_add: TeamAddEvent;
	watch: WatchEvent;
}

export type WebhookEventHandler<T extends WebhookEventName> = (
	event: WebhookEventMap[T],
) => void | Promise<void>;

export interface WebhookHeaders extends BaseWebhookHeaders {
	'x-github-event'?: string;
	'x-hub-signature-256'?: string;
	'x-github-delivery'?: string;
}

export interface GithubWebhookHandlerOptions {
	secret?: string;
}

export class GithubWebhookHandler extends BaseWebhookHandler<
	WebhookEventName,
	WebhookEventMap[WebhookEventName],
	WebhookHeaders
> {
	constructor(options: GithubWebhookHandlerOptions = {}) {
		super(options);
	}

	protected extractEventName(
		headers: WebhookHeaders,
		payload: string | unknown,
	): WebhookEventName | undefined {
		return headers['x-github-event'] as WebhookEventName | undefined;
	}

	protected parsePayload(payload: string | unknown): WebhookEventMap[WebhookEventName] {
		return typeof payload === 'string' ? JSON.parse(payload) : payload;
	}

	protected getSignatureFromHeaders(headers: WebhookHeaders): string | undefined {
		return headers['x-hub-signature-256'];
	}

	protected computeSignature(payload: Buffer): string {
		if (!this.secret) {
			return '';
		}
		return 'sha256=' + crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
	}

	protected normalizeSignature(signature: string): string {
		return signature;
	}

	on<T extends WebhookEventName>(
		eventName: T,
		handler: WebhookEventHandler<T>,
	): this {
		return super.on(eventName, handler as any);
	}

	off<T extends WebhookEventName>(
		eventName: T,
		handler: WebhookEventHandler<T>,
	): this {
		return super.off(eventName, handler as any);
	}

	async handleWebhook(
		headers: WebhookHeaders,
		payload: string | object,
	): Promise<HandleWebhookResult> {
		const eventName = headers['x-github-event'] as WebhookEventName | undefined;

		if (!eventName) {
			return {
				success: false,
				error: 'Missing x-github-event header',
			};
		}

		return super.handleWebhook(headers, payload);
	}
}

export function createWebhookHandler(
	options?: GithubWebhookHandlerOptions,
): GithubWebhookHandler {
	return new GithubWebhookHandler(options);
}

