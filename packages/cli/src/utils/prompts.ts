import * as crypto from 'node:crypto';
import * as p from '@clack/prompts';

export async function promptTenantId(): Promise<string> {
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

export async function promptWebhookUrl(): Promise<string> {
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

export async function promptClientState(): Promise<string> {
	const autoSecret = crypto.randomBytes(16).toString('hex');
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
