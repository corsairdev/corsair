/**
 * Minimal HTTP client for Linear API
 * Uses native fetch - no external dependencies
 */

const LINEAR_API_BASE = 'https://api.linear.app/graphql';

class LinearAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LinearAPIError';
	}
}

async function makeRequest<T>(
	query: string,
	apiKey: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const response = await fetch(LINEAR_API_BASE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
		body: JSON.stringify({
			query,
			variables: variables || {},
		}),
	});

	if (!response.ok) {
		throw new LinearAPIError(
			`HTTP error! status: ${response.status}`,
			`http_${response.status}`,
		);
	}

	const result = await response.json();

	if (result.errors && result.errors.length > 0) {
		throw new LinearAPIError(
			result.errors[0].message || 'GraphQL error',
			result.errors[0].extensions?.code,
		);
	}

	return result.data as T;
}

export interface LinearClient {
	listIssues(params?: {
		teamId?: string;
		first?: number;
		after?: string;
	}): Promise<{
		issues: {
			nodes: Array<{
				id: string;
				title: string;
				description?: string;
				priority: number;
				number: number;
				url: string;
				state: { id: string; name: string; type: string };
				team: { id: string; name: string; key: string };
				assignee?: { id: string; name: string; email: string };
				creator: { id: string; name: string; email: string };
				createdAt: string;
				updatedAt: string;
			}>;
			pageInfo: {
				hasNextPage: boolean;
				hasPreviousPage: boolean;
				startCursor?: string;
				endCursor?: string;
			};
		};
	}>;

	getIssue(id: string): Promise<{
		issue: {
			id: string;
			title: string;
			description?: string;
			priority: number;
			number: number;
			url: string;
			state: { id: string; name: string; type: string };
			team: { id: string; name: string; key: string };
			assignee?: { id: string; name: string; email: string };
			creator: { id: string; name: string; email: string };
			createdAt: string;
			updatedAt: string;
		};
	}>;

	createIssue(params: {
		title: string;
		description?: string;
		teamId: string;
		priority?: number;
		stateId?: string;
		assigneeId?: string;
	}): Promise<{
		issueCreate: {
			issue: {
				id: string;
				title: string;
				description?: string;
				priority: number;
				number: number;
				url: string;
				state: { id: string; name: string };
				team: { id: string; name: string };
				createdAt: string;
			};
		};
	}>;

	updateIssue(params: {
		id: string;
		title?: string;
		description?: string;
		priority?: number;
		stateId?: string;
		assigneeId?: string;
	}): Promise<{
		issueUpdate: {
			issue: {
				id: string;
				title: string;
				description?: string;
				priority: number;
				updatedAt: string;
			};
		};
	}>;

	listTeams(): Promise<{
		teams: {
			nodes: Array<{
				id: string;
				name: string;
				key: string;
			}>;
		};
	}>;
}

export function createLinearClient(apiKey: string): LinearClient {
	return {
		async listIssues(params) {
			const teamFilter = params?.teamId
				? `filter: { team: { id: { eq: "${params.teamId}" } } }`
				: '';
			const first = params?.first || 50;
			const after = params?.after ? `after: "${params.after}"` : '';

			const query = `
				query Issues($first: Int!, $after: String) {
					issues(${teamFilter}, first: $first, after: $after) {
						nodes {
							id
							title
							description
							priority
							number
							url
							state {
								id
								name
								type
							}
							team {
								id
								name
								key
							}
							assignee {
								id
								name
								email
							}
							creator {
								id
								name
								email
							}
							createdAt
							updatedAt
						}
						pageInfo {
							hasNextPage
							hasPreviousPage
							startCursor
							endCursor
						}
					}
				}
			`;

			return makeRequest<ReturnType<LinearClient['listIssues']>>(
				query,
				apiKey,
				{
					first,
					after: params?.after,
				},
			);
		},

		async getIssue(id) {
			const query = `
				query Issue($id: String!) {
					issue(id: $id) {
						id
						title
						description
						priority
						number
						url
						state {
							id
							name
							type
						}
						team {
							id
							name
							key
						}
						assignee {
							id
							name
							email
						}
						creator {
							id
							name
							email
						}
						createdAt
						updatedAt
					}
				}
			`;

			return makeRequest<ReturnType<LinearClient['getIssue']>>(query, apiKey, {
				id,
			});
		},

		async createIssue(params) {
			const query = `
				mutation IssueCreate($input: IssueCreateInput!) {
					issueCreate(input: $input) {
						issue {
							id
							title
							description
							priority
							number
							url
							state {
								id
								name
							}
							team {
								id
								name
							}
							createdAt
						}
					}
				}
			`;

			const input: Record<string, unknown> = {
				title: params.title,
				teamId: params.teamId,
			};

			if (params.description) input.description = params.description;
			if (params.priority !== undefined) input.priority = params.priority;
			if (params.stateId) input.stateId = params.stateId;
			if (params.assigneeId) input.assigneeId = params.assigneeId;

			return makeRequest<ReturnType<LinearClient['createIssue']>>(
				query,
				apiKey,
				{
					input,
				},
			);
		},

		async updateIssue(params) {
			const query = `
				mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
					issueUpdate(id: $id, input: $input) {
						issue {
							id
							title
							description
							priority
							updatedAt
						}
					}
				}
			`;

			const input: Record<string, unknown> = {};
			if (params.title) input.title = params.title;
			if (params.description !== undefined)
				input.description = params.description;
			if (params.priority !== undefined) input.priority = params.priority;
			if (params.stateId) input.stateId = params.stateId;
			if (params.assigneeId) input.assigneeId = params.assigneeId;

			return makeRequest<ReturnType<LinearClient['updateIssue']>>(
				query,
				apiKey,
				{
					id: params.id,
					input,
				},
			);
		},

		async listTeams() {
			const query = `
				query Teams {
					teams {
						nodes {
							id
							name
							key
						}
					}
				}
			`;

			return makeRequest<ReturnType<LinearClient['listTeams']>>(query, apiKey);
		},
	};
}

export { LinearAPIError };
