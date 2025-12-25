/**
 * Minimal HTTP client for GitHub API
 * Uses native fetch - no external dependencies
 */

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPIError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = 'GitHubAPIError';
	}
}

async function makeRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: string;
		body?: unknown;
		params?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, params } = options;

	let url = `${GITHUB_API_BASE}${endpoint}`;
	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'Corsair-GitHub-Plugin',
	};

	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new GitHubAPIError(
			errorData.message || `HTTP error! status: ${response.status}`,
			errorData.code || `http_${response.status}`,
		);
	}

	return response.json() as Promise<T>;
}

export interface GitHubClient {
	listIssues(params: {
		owner: string;
		repo: string;
		state?: 'open' | 'closed' | 'all';
		page?: number;
		perPage?: number;
	}): Promise<Array<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		user: { login: string };
		created_at: string;
		updated_at: string;
		closed_at: string | null;
	}>>;

	getIssue(params: {
		owner: string;
		repo: string;
		issueNumber: number;
	}): Promise<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		user: { login: string };
		created_at: string;
		updated_at: string;
		closed_at: string | null;
	}>;

	createIssue(params: {
		owner: string;
		repo: string;
		title: string;
		body?: string;
		labels?: string[];
		assignees?: string[];
	}): Promise<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		user: { login: string };
		created_at: string;
		updated_at: string;
		closed_at: string | null;
	}>;

	listPullRequests(params: {
		owner: string;
		repo: string;
		state?: 'open' | 'closed' | 'all';
		page?: number;
		perPage?: number;
	}): Promise<Array<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		user: { login: string };
		head: { ref: string };
		base: { ref: string };
		created_at: string;
		updated_at: string;
		merged_at: string | null;
	}>>;

	listRepositories(params?: {
		type?: 'all' | 'owner' | 'member';
		sort?: 'created' | 'updated' | 'pushed' | 'full_name';
		direction?: 'asc' | 'desc';
		page?: number;
		perPage?: number;
	}): Promise<Array<{
		id: number;
		name: string;
		full_name: string;
		description: string;
		private: boolean;
		owner: { login: string };
		html_url: string;
		created_at: string;
		updated_at: string;
	}>>;
}

export function createGitHubClient(token: string): GitHubClient {
	return {
		async listIssues(params) {
			const queryParams: Record<string, string> = {};
			if (params.state) queryParams.state = params.state;
			if (params.page) queryParams.page = params.page.toString();
			if (params.perPage) queryParams.per_page = params.perPage.toString();

			return makeRequest<ReturnType<GitHubClient['listIssues']>>(
				`/repos/${params.owner}/${params.repo}/issues`,
				token,
				{ params: queryParams },
			);
		},

		async getIssue(params) {
			return makeRequest<ReturnType<GitHubClient['getIssue']>>(
				`/repos/${params.owner}/${params.repo}/issues/${params.issueNumber}`,
				token,
			);
		},

		async createIssue(params) {
			const body: Record<string, unknown> = {
				title: params.title,
			};
			if (params.body) body.body = params.body;
			if (params.labels) body.labels = params.labels;
			if (params.assignees) body.assignees = params.assignees;

			return makeRequest<ReturnType<GitHubClient['createIssue']>>(
				`/repos/${params.owner}/${params.repo}/issues`,
				token,
				{
					method: 'POST',
					body,
				},
			);
		},

		async listPullRequests(params) {
			const queryParams: Record<string, string> = {};
			if (params.state) queryParams.state = params.state;
			if (params.page) queryParams.page = params.page.toString();
			if (params.perPage) queryParams.per_page = params.perPage.toString();

			return makeRequest<ReturnType<GitHubClient['listPullRequests']>>(
				`/repos/${params.owner}/${params.repo}/pulls`,
				token,
				{ params: queryParams },
			);
		},

		async listRepositories(params) {
			const queryParams: Record<string, string> = {};
			if (params?.type) queryParams.type = params.type;
			if (params?.sort) queryParams.sort = params.sort;
			if (params?.direction) queryParams.direction = params.direction;
			if (params?.page) queryParams.page = params.page.toString();
			if (params?.perPage) queryParams.per_page = params.perPage.toString();

			return makeRequest<ReturnType<GitHubClient['listRepositories']>>(
				'/user/repos',
				token,
				{ params: queryParams },
			);
		},
	};
}

export { GitHubAPIError };

