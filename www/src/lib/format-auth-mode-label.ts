const AUTH_MODE_LABELS: Record<string, string> = {
	API_KEY: 'API Key',
	OAUTH2: 'OAuth 2.0',
	OAUTH1: 'OAuth 1.0',
	BASIC: 'Basic Auth',
	BASIC_WITH_JWT: 'Basic Auth with JWT',
	BEARER_TOKEN: 'Bearer Token',
	DCR_OAUTH: 'OAuth (Dynamic Client Registration)',
	GOOGLE_SERVICE_ACCOUNT: 'Google Service Account',
	NO_AUTH: 'No Auth',
	S2S_OAUTH2: 'Server-to-Server OAuth 2.0',
	SAML: 'SAML',
};

function includesToken(value: string, tokens: string[]) {
	const normalized = value.toLowerCase();
	return tokens.some((token) => normalized.includes(token));
}

export function formatAuthModeLabel(mode: string, name?: string) {
	if (AUTH_MODE_LABELS[mode]) {
		return AUTH_MODE_LABELS[mode];
	}

	const haystack = `${mode} ${name ?? ''}`;

	if (includesToken(haystack, ['api_key', 'api key'])) {
		return 'API Key';
	}

	if (includesToken(haystack, ['s2s_oauth', 's2s oauth'])) {
		return 'Server-to-Server OAuth 2.0';
	}

	if (includesToken(haystack, ['oauth2', 'oauth 2'])) {
		return 'OAuth 2.0';
	}

	if (includesToken(haystack, ['oauth1', 'oauth 1', 'oauth'])) {
		return 'OAuth';
	}

	if (includesToken(haystack, ['bearer'])) {
		return 'Bearer Token';
	}

	if (includesToken(haystack, ['basic'])) {
		return 'Basic Auth';
	}

	if (includesToken(haystack, ['saml'])) {
		return 'SAML';
	}

	if (includesToken(haystack, ['no_auth', 'no auth'])) {
		return 'No Auth';
	}

	if (includesToken(haystack, ['google_service_account', 'service account'])) {
		return 'Google Service Account';
	}

	return mode
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
