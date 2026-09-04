import type { StartAutomationInput } from './types';

export interface TriggerAutomationOptions {
	uuid: string;
	input: StartAutomationInput;
}

export async function triggerAutomation(
	options: TriggerAutomationOptions,
): Promise<void> {
	const response = await fetch(
		`https://api.spoki.com/wh/ap/${encodeURIComponent(options.uuid)}/`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(options.input),
		},
	);

	if (!response.ok) {
		const body = await response.text();

		throw new Error(
			`Spoki automation failed with status ${response.status}: ${body}`,
		);
	}
}
