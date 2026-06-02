import { execSync } from 'node:child_process';

export async function refreshGoogleAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<string> {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to refresh access token: ${error}`);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

export function copyToClipboard(text: string): boolean {
	try {
		const platform = process.platform;
		if (platform === 'darwin') {
			execSync('pbcopy', { input: text });
			return true;
		} else if (platform === 'linux') {
			try {
				execSync('xclip -selection clipboard', { input: text });
				return true;
			} catch {
				try {
					execSync('xsel --clipboard --input', { input: text });
					return true;
				} catch {
					return false;
				}
			}
		} else if (platform === 'win32') {
			execSync('clip', { input: text });
			return true;
		}
		return false;
	} catch {
		return false;
	}
}
