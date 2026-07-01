/**
 * Calculates the Shannon entropy of a string.
 * High entropy indicates a random-looking string (e.g., api key or token).
 */
export function getShannonEntropy(str: string): number {
	const len = str.length;
	if (len === 0) return 0;

	const frequencies: Record<string, number> = {};
	for (let i = 0; i < len; i++) {
		const c = str[i];
		frequencies[c] = (frequencies[c] || 0) + 1;
	}

	let entropy = 0;
	for (const count of Object.values(frequencies)) {
		const p = count / len;
		entropy -= p * Math.log2(p);
	}
	return entropy;
}

/**
 * Checks if a string value matches known secret prefixes or has high entropy,
 * indicating it is likely an API key, credential, or token.
 */
export function isPotentialSecretValue(value: string): boolean {
	const lower = value.toLowerCase();

	// 1. Check known prefixes
	if (
		value.startsWith('sk-') || // OpenAI / Stripe
		lower.startsWith('bearer ') || // OAuth Bearer header/token
		lower.startsWith('basic ') || // Basic Auth header
		value.startsWith('ghp_') || // GitHub Personal Access Token (PAT)
		value.startsWith('gho_') || // GitHub OAuth token
		value.startsWith('ghu_') || // GitHub User token
		value.startsWith('ghs_') || // GitHub Server/Installation token
		value.startsWith('ghr_') || // GitHub Runner token
		value.startsWith('xoxb-') || // Slack Bot token
		value.startsWith('xoxp-') || // Slack User token
		value.startsWith('xapp-') || // Slack App-level token
		value.startsWith('xoxs-') || // Slack Workspace token
		value.startsWith('key-') || // Mailgun key
		value.startsWith('amzn.mws.') // Amazon MWS key
	) {
		return true;
	}

	// 2. High-entropy heuristic for raw keys
	// Secrets are typically long, lack spaces, aren't URLs, emails, or date ISO strings.
	if (value.length < 16) return false;
	if (value.includes(' ')) return false;
	if (value.startsWith('http://') || value.startsWith('https://')) return false;
	if (value.includes('@') && value.includes('.')) return false;
	if (/^\d{4}-\d{2}-\d{2}/.test(value)) return false;
	// Cryptographic keys/tokens/hashes almost always contain digits.
	// Strings without digits (like long kebab-case slugs) are typically not secrets.
	if (!/\d/.test(value)) return false;

	const entropy = getShannonEntropy(value);
	// Random keys/hashes have high character diversity (typically > 3.0 entropy for base64/hex of length 16+)
	return entropy > 3.0;
}

/**
 * Check if a field name suggests it contains sensitive data.
 */
export function shouldObfuscateField(fieldName: string): boolean {
	const sensitivePatterns = [
		'key',
		'token',
		'secret',
		'password',
		'credential',
		'auth',
		'api_key',
		'access_token',
		'refresh_token',
	];
	const lowerName = fieldName.toLowerCase();
	return sensitivePatterns.some((pattern) => lowerName.includes(pattern));
}

/**
 * Obfuscate a single primitive value.
 */
export function obfuscateValue(value: unknown): string {
	if (value === null || value === undefined) return '***';
	if (typeof value === 'string') {
		if (value.length === 0) return '***';
		if (value.length <= 8) return '***';
		return `${value.slice(0, 4)}…${value.slice(-3)} (${value.length} chars)`;
	}
	return '***';
}

/**
 * Recursively masks sensitive fields and high-entropy secret values in objects and arrays.
 */
export function maskSensitiveData(
	val: unknown,
	fieldName?: string,
	visited = new Set<unknown>(),
): unknown {
	if (val === null || val === undefined) return val;

	// Prevent infinite loops on circular references
	if (typeof val === 'object' && val !== null) {
		if (visited.has(val)) {
			return '[Circular]';
		}
		visited.add(val);
	}

	// 1. Array traversal
	if (Array.isArray(val)) {
		const result = val.map((item) =>
			maskSensitiveData(item, fieldName, visited),
		);
		visited.delete(val);
		return result;
	}

	// 2. Object traversal
	if (typeof val === 'object' && val !== null) {
		const obj = val as Record<string, unknown>;
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			result[k] = maskSensitiveData(v, k, visited);
		}
		visited.delete(val);
		return result;
	}

	// 3. Primitive value check
	const isSensitiveKey = fieldName ? shouldObfuscateField(fieldName) : false;
	const isSensitiveValue =
		typeof val === 'string' && isPotentialSecretValue(val);

	if (isSensitiveKey || isSensitiveValue) {
		return obfuscateValue(val);
	}

	return val;
}

/**
 * Utility to obfuscate both input and output fields in a database execution record.
 */
export function obfuscateExecutionRecord(
	row: Record<string, unknown>,
): Record<string, unknown> {
	const copy = { ...row };

	if (copy.input !== undefined && copy.input !== null) {
		copy.input = maskSensitiveData(copy.input);
	}

	if (copy.output !== undefined && copy.output !== null) {
		copy.output = maskSensitiveData(copy.output);
	}

	return copy;
}
