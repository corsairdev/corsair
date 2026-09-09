/** Base URL of the running Fade Python backend */
let _baseUrl = 'http://localhost:8000';

export function setFadePort(port: number): void {
	_baseUrl = `http://localhost:${port}`;
}

async function request<T>(
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	const res = await fetch(`${_baseUrl}${path}`, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => res.statusText);
		throw new Error(`Fade API ${method} ${path} → ${res.status}: ${text}`);
	}
	return res.json() as Promise<T>;
}

export const fadeGet = <T>(path: string) => request<T>('GET', path);
export const fadePost = <T>(path: string, body: unknown) =>
	request<T>('POST', path, body);
export const fadePatch = <T>(path: string, body: unknown) =>
	request<T>('PATCH', path, body);
export const fadeDelete = <T>(path: string) => request<T>('DELETE', path);
