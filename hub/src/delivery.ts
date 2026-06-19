import { createHmac, randomUUID } from 'crypto';
import type {
	Project,
	TargetEnvironment,
	TunnelAck,
	TunnelEnvelope,
	TunnelType,
} from './types';

export interface DeliveryResult {
	ack: TunnelAck;
	environment: TargetEnvironment;
	statusCode: number;
	targetUrl: string;
}

const targetPreference: TargetEnvironment[] = ['dev', 'staging', 'production'];

export function selectTarget(
	project: Project,
): { environment: TargetEnvironment; url: string } | undefined {
	const preferredUrl = project.targets[project.preferredEnvironment];
	if (preferredUrl) {
		return { environment: project.preferredEnvironment, url: preferredUrl };
	}

	for (const environment of targetPreference) {
		const url = project.targets[environment];
		if (url) return { environment, url };
	}

	return undefined;
}

export async function deliverToProject<TPayload>(
	project: Project,
	type: TunnelType,
	payload: TPayload,
): Promise<DeliveryResult> {
	const target = selectTarget(project);
	if (!target) {
		return {
			ack: {
				status: 'failed',
				retryable: false,
				error: 'No target URL is configured for this project.',
			},
			environment: project.preferredEnvironment,
			statusCode: 0,
			targetUrl: '',
		};
	}

	const envelope: TunnelEnvelope<TPayload> = { type, payload };
	const body = JSON.stringify(envelope);
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const signature = createHmac('sha256', project.signingSecret)
		.update(body)
		.digest('hex');

	try {
		const response = await fetch(target.url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-corsair-nonce': randomUUID(),
				'x-corsair-project': project.id,
				'x-corsair-signature': `sha256=${signature}`,
				'x-corsair-timestamp': timestamp,
			},
			body,
		});

		const ack = await readAck(response);
		return {
			ack,
			environment: target.environment,
			statusCode: response.status,
			targetUrl: target.url,
		};
	} catch (error) {
		return {
			ack: {
				status: 'failed',
				retryable: true,
				error: error instanceof Error ? error.message : 'Delivery failed',
			},
			environment: target.environment,
			statusCode: 0,
			targetUrl: target.url,
		};
	}
}

async function readAck(response: Response): Promise<TunnelAck> {
	const text = await response.text();
	let parsed: unknown;

	try {
		parsed = text ? JSON.parse(text) : undefined;
	} catch {
		parsed = undefined;
	}

	if (isTunnelAck(parsed)) return parsed;
	if (response.ok) return { status: 'ok' };

	return {
		status: 'failed',
		retryable: response.status >= 500,
		error: text || `Target returned HTTP ${response.status}`,
	};
}

function isTunnelAck(value: unknown): value is TunnelAck {
	if (!value || typeof value !== 'object') return false;
	const status = (value as { status?: unknown }).status;
	return status === 'ok' || status === 'failed';
}
