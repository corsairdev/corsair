import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';

/**
 * In non-interactive mode (no TTY), print all missing required flags and exit.
 * Collects everything at once so the agent sees the full picture in one shot.
 */
export function requireNonInteractive(missing: { flag: string; description: string }[]): void {
	if (missing.length === 0) return;
	console.error('[#corsair]: Non-interactive mode — provide the following required flags:');
	for (const { flag, description } of missing) {
		console.error(`  ${flag}  — ${description}`);
	}
	process.exit(1);
}

export async function promptTenantId(preset?: string): Promise<string> {
	if (preset !== undefined) return preset;
	// No TTY: silently fall back to the same default the prompt would use
	if (!process.stdin.isTTY) return 'default';
	const tenantId = await p.text({
		message: 'Enter tenant ID:',
		defaultValue: 'default',
		placeholder: 'default',
	});
	if (p.isCancel(tenantId)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return tenantId as string;
}

export async function promptWebhookUrl(preset?: string): Promise<string> {
	if (preset !== undefined) return preset;
	// Callers do the non-interactive check before reaching this; safety net only
	if (!process.stdin.isTTY) {
		console.error('[#corsair]: --webhook-url=<url> is required in non-interactive mode.');
		process.exit(1);
	}
	const webhookUrl = await p.text({
		message: 'Enter your public webhook URL (ngrok or production):',
		placeholder: 'https://abc123.ngrok-free.app/api/webhook',
		validate: (v) => {
			if (!v || v.trim().length === 0) return 'Webhook URL is required';
			if (!v.startsWith('https://'))
				return 'URL must start with https:// (Microsoft Graph requires HTTPS)';
		},
	});
	if (p.isCancel(webhookUrl)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return webhookUrl as string;
}

export async function promptClientState(preset?: string): Promise<string> {
	if (preset !== undefined) return preset;
	const autoSecret = crypto.randomBytes(16).toString('hex');
	// No TTY: auto-generate silently (same as pressing Enter on the prompt)
	if (!process.stdin.isTTY) return autoSecret;
	const clientState = await p.text({
		message: 'Enter a clientState secret (used to verify webhook payloads):',
		defaultValue: autoSecret,
		placeholder: autoSecret,
	});
	if (p.isCancel(clientState)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return clientState as string;
}
