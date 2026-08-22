import { AsticaAiAPIError } from '../client';

/**
 * Astica reports failures with HTTP 200 and `{status:'error', error:'…'}`, so a
 * bad key or exhausted quota never reaches the transport's error path. Raising
 * here is what lets the AUTH_ERROR and RATE_LIMIT_ERROR handlers see them.
 */
export function assertAsticaOk(response: {
	status?: string;
	error?: string;
}): void {
	if (response.status?.toLowerCase() === 'error') {
		throw new AsticaAiAPIError(
			response.error ?? 'Astica API returned an error',
		);
	}
}

/** Entity id for a call keyed on its input, which may be a large base64 blob. */
export function inputEntityId(input: string): string {
	return encodeURIComponent(
		input.length <= 200 ? input : `${input.slice(0, 64)}#${input.length}`,
	);
}

/** Event payloads must never carry the base64 image or audio itself. */
export function describeInput(input: string): {
	inputKind: 'url' | 'inline';
	inputLength: number;
} {
	return {
		inputKind: /^https?:\/\//i.test(input) ? 'url' : 'inline',
		inputLength: input.length,
	};
}
