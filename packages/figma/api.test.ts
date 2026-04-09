import 'dotenv/config';
import { makeFigmaRequest } from './client';
import type {
	ActivityLogsListResponse,
	CommentsAddResponse,
	CommentsGetReactionsResponse,
	CommentsListResponse,
	ComponentSetsGetForFileResponse,
	ComponentSetsGetForTeamResponse,
	ComponentSetsGetResponse,
	ComponentsGetForFileResponse,
	ComponentsGetForTeamResponse,
	ComponentsGetResponse,
	DevResourcesGetResponse,
	FilesGetImageFillsResponse,
	FilesGetJSONResponse,
	FilesGetMetadataResponse,
	FilesGetNodesResponse,
	FilesGetProjectFilesResponse,
	FilesGetStylesResponse,
	FilesGetVersionsResponse,
	FilesRenderImagesResponse,
	LibraryAnalyticsComponentActionsResponse,
	LibraryAnalyticsComponentUsagesResponse,
	LibraryAnalyticsStyleActionsResponse,
	LibraryAnalyticsStyleUsagesResponse,
	ProjectsGetTeamProjectsResponse,
	StylesGetForTeamResponse,
	UsersGetCurrentResponse,
	VariablesGetLocalResponse,
} from './endpoints/types';
import { FigmaEndpointOutputSchemas } from './endpoints/types';

const _FIGMA_API_KEY = process.env.FIGMA_API_KEY;
if (!_FIGMA_API_KEY) {
	throw new Error(
		'FIGMA_API_KEY environment variable is required to run Figma API tests',
	);
}
const TEST_API_KEY: string = _FIGMA_API_KEY;
const TEST_FILE_KEY = process.env.TEST_FIGMA_FILE_KEY;
const TEST_TEAM_ID = process.env.TEST_FIGMA_TEAM_ID;
const TEST_PROJECT_ID = process.env.TEST_FIGMA_PROJECT_ID;

describe('Figma API Type Tests', () => {
	describe('users', () => {
		it('usersGetCurrent returns correct type', async () => {
			const result = await makeFigmaRequest<UsersGetCurrentResponse>(
				'v1/me',
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.usersGetCurrent.parse(result);
		});
	});

	describe('files', () => {
		// Cache the file JSON response to avoid repeated calls to the same slow endpoint
		let cachedFileData: FilesGetJSONResponse | undefined;

		beforeAll(async () => {
			if (!TEST_FILE_KEY) return;
			cachedFileData = await makeFigmaRequest<FilesGetJSONResponse>(
				`v1/files/${TEST_FILE_KEY}`,
				TEST_API_KEY,
				{ query: { depth: 1 } },
			);
		}, 90000);

		it('filesGetMetadata returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			// filesGetMetadata shares the same Figma endpoint as filesGetJSON; use cached data
			// type assertion: FilesGetJSONResponse has compatible shape with FilesGetMetadataResponse
			const result = cachedFileData as FilesGetMetadataResponse;
			FigmaEndpointOutputSchemas.filesGetMetadata.parse(result);
		});

		it('filesGetVersions returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			const result = await makeFigmaRequest<FilesGetVersionsResponse>(
				`v1/files/${TEST_FILE_KEY}/versions`,
				TEST_API_KEY,
				{ query: { page_size: 5 } },
			);

			FigmaEndpointOutputSchemas.filesGetVersions.parse(result);
		});

		it('filesGetStyles returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			const result = await makeFigmaRequest<FilesGetStylesResponse>(
				`v1/files/${TEST_FILE_KEY}/styles`,
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.filesGetStyles.parse(result);
		});

		it('filesGetJSON returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			// Use cached file data to avoid a redundant slow API call
			// type assertion: reusing the already-fetched FilesGetJSONResponse for schema validation
			const result = cachedFileData as FilesGetJSONResponse;
			FigmaEndpointOutputSchemas.filesGetJSON.parse(result);
		});

		it('filesGetImageFills returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			const result = await makeFigmaRequest<FilesGetImageFillsResponse>(
				`v1/files/${TEST_FILE_KEY}/images`,
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.filesGetImageFills.parse(result);
		});

		it('filesGetNodes returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			// any: document is typed as unknown due to recursive Figma node tree structure
			const doc = cachedFileData?.document as
				| Record<string, unknown>
				| undefined;
			// type assertion: id property on Figma document nodes is always a string
			const nodeId = doc?.id as string | undefined;
			if (!nodeId) {
				console.warn('No document node ID found - skipping filesGetNodes test');
				return;
			}

			const result = await makeFigmaRequest<FilesGetNodesResponse>(
				`v1/files/${TEST_FILE_KEY}/nodes`,
				TEST_API_KEY,
				{ query: { ids: nodeId } },
			);

			FigmaEndpointOutputSchemas.filesGetNodes.parse(result);
		});

		it('filesRenderImages returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			// any: document is typed as unknown due to recursive Figma node tree structure
			const doc = cachedFileData?.document as
				| Record<string, unknown>
				| undefined;
			// type assertion: children on Figma document nodes are an array with id properties
			const children = doc?.children as Array<{ id?: string }> | undefined;
			// type assertion: fallback to doc.id which is a string on Figma document nodes
			const nodeId = children?.[0]?.id ?? (doc?.id as string | undefined);
			if (!nodeId) {
				console.warn('No node ID found - skipping filesRenderImages test');
				return;
			}

			try {
				const result = await makeFigmaRequest<FilesRenderImagesResponse>(
					`v1/images/${TEST_FILE_KEY}`,
					TEST_API_KEY,
					{ query: { ids: nodeId, format: 'png', scale: 1 } },
				);

				FigmaEndpointOutputSchemas.filesRenderImages.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('400') ||
						error.message.includes('Bad Request') ||
						error.message.includes('invalid_ids'))
				) {
					console.warn('filesRenderImages: node IDs not renderable - skipping');
					return;
				}
				throw error;
			}
		});

		it('filesGetProjectFiles returns correct type', async () => {
			if (!TEST_PROJECT_ID) {
				console.warn('TEST_FIGMA_PROJECT_ID env var not set - skipping');
				return;
			}

			const result = await makeFigmaRequest<FilesGetProjectFilesResponse>(
				`v1/projects/${TEST_PROJECT_ID}/files`,
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.filesGetProjectFiles.parse(result);
		});
	});

	describe('comments', () => {
		let testCommentId: string | undefined;

		afterAll(async () => {
			if (testCommentId && TEST_FILE_KEY) {
				try {
					await makeFigmaRequest(
						`v1/files/${TEST_FILE_KEY}/comments/${testCommentId}`,
						TEST_API_KEY,
						{ method: 'DELETE' },
					);
				} catch (error) {
					console.warn('Failed to clean up test comment:', error);
				}
			}
		});

		it('commentsAdd returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			const result = await makeFigmaRequest<CommentsAddResponse>(
				`v1/files/${TEST_FILE_KEY}/comments`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: { message: 'Test comment from API test' },
				},
			);

			if (result.id) {
				testCommentId = result.id;
			}

			FigmaEndpointOutputSchemas.commentsAdd.parse(result);
		});

		it('commentsList returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			const result = await makeFigmaRequest<CommentsListResponse>(
				`v1/files/${TEST_FILE_KEY}/comments`,
				TEST_API_KEY,
			);

			if (!testCommentId && result.comments?.[0]?.id) {
				testCommentId = result.comments[0].id;
			}

			FigmaEndpointOutputSchemas.commentsList.parse(result);
		});

		it('commentsGetReactions returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			if (!testCommentId) {
				const listResult = await makeFigmaRequest<CommentsListResponse>(
					`v1/files/${TEST_FILE_KEY}/comments`,
					TEST_API_KEY,
				);
				const commentId = listResult.comments?.[0]?.id;
				if (!commentId) {
					throw new Error('No comments found to test reactions');
				}
				testCommentId = commentId;
			}

			const result = await makeFigmaRequest<CommentsGetReactionsResponse>(
				`v1/files/${TEST_FILE_KEY}/comments/${testCommentId}/reactions`,
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.commentsGetReactions.parse(result);
		});
	});

	// describe('webhooks', () => {
	// 	let testWebhookId: string | undefined;

	// 	it('webhooksCreate returns correct type', async () => {
	// 		if (!TEST_FILE_KEY) {
	// 			throw new Error('TEST_FIGMA_FILE_KEY env var is required');
	// 		}

	// 		const result = await makeFigmaRequest<WebhooksCreateResponse>(
	// 			'v2/webhooks',
	// 			TEST_API_KEY,
	// 			{
	// 				method: 'POST',
	// 				body: {
	// 					event_type: 'FILE_UPDATE',
	// 					context: 'file',
	// 					context_id: TEST_FILE_KEY,
	// 					endpoint: 'https://example.com/figma-webhook-test',
	// 					passcode: 'test-passcode',
	// 					status: 'PAUSED',
	// 					description: 'Test webhook from API test',
	// 				},
	// 			},
	// 		);

	// 		if (result.id) {
	// 			testWebhookId = result.id;
	// 		}

	// 		FigmaEndpointOutputSchemas.webhooksCreate.parse(result);
	// 	});

	// 	it('webhooksGet returns correct type', async () => {
	// 		if (!testWebhookId) {
	// 			throw new Error('No webhook ID available - webhooksCreate must succeed first');
	// 		}

	// 		const result = await makeFigmaRequest<WebhooksGetResponse>(
	// 			`v2/webhooks/${testWebhookId}`,
	// 			TEST_API_KEY,
	// 		);

	// 		FigmaEndpointOutputSchemas.webhooksGet.parse(result);
	// 	});

	// 	it('webhooksList returns correct type', async () => {
	// 		if (!TEST_FILE_KEY) {
	// 			throw new Error('TEST_FIGMA_FILE_KEY env var is required');
	// 		}

	// 		const result = await makeFigmaRequest<WebhooksListResponse>(
	// 			'v2/webhooks',
	// 			TEST_API_KEY,
	// 			{ query: { context: 'file', context_id: TEST_FILE_KEY } },
	// 		);

	// 		FigmaEndpointOutputSchemas.webhooksList.parse(result);
	// 	});

	// 	it('webhooksUpdate returns correct type', async () => {
	// 		if (!testWebhookId) {
	// 			throw new Error('No webhook ID available - webhooksCreate must succeed first');
	// 		}

	// 		const result = await makeFigmaRequest<WebhooksUpdateResponse>(
	// 			`v2/webhooks/${testWebhookId}`,
	// 			TEST_API_KEY,
	// 			{
	// 				method: 'PUT',
	// 				body: {
	// 					status: 'PAUSED',
	// 					description: 'Updated webhook description from API test',
	// 				},
	// 			},
	// 		);

	// 		FigmaEndpointOutputSchemas.webhooksUpdate.parse(result);
	// 	});

	// 	it('webhooksDelete returns correct type', async () => {
	// 		if (!testWebhookId) {
	// 			throw new Error('No webhook ID available - webhooksCreate must succeed first');
	// 		}

	// 		const result = await makeFigmaRequest<WebhooksGetResponse>(
	// 			`v2/webhooks/${testWebhookId}`,
	// 			TEST_API_KEY,
	// 			{ method: 'DELETE' },
	// 		);

	// 		FigmaEndpointOutputSchemas.webhooksDelete.parse(result);
	// 	});
	// });

	describe('devResources', () => {
		it('devResourcesGet returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result = await makeFigmaRequest<DevResourcesGetResponse>(
					`v1/files/${TEST_FILE_KEY}/dev_resources`,
					TEST_API_KEY,
				);

				FigmaEndpointOutputSchemas.devResourcesGet.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('Not Found') ||
						error.message.includes('Forbidden') ||
						error.message.includes('403') ||
						error.message.includes('404'))
				) {
					console.warn(
						'Dev resources not available for this file (requires Dev Mode access) - skipping',
					);
					return;
				}
				throw error;
			}
		});
	});

	describe('variables', () => {
		it('variablesGetLocal returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result = await makeFigmaRequest<VariablesGetLocalResponse>(
					`v1/files/${TEST_FILE_KEY}/variables/local`,
					TEST_API_KEY,
				);

				FigmaEndpointOutputSchemas.variablesGetLocal.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('Forbidden') ||
						error.message.includes('403') ||
						error.message.includes('payment'))
				) {
					console.warn(
						'Variables API requires Figma Professional/Enterprise plan - skipping',
					);
					return;
				}
				throw error;
			}
		});
	});

	describe('projects', () => {
		it('projectsGetTeamProjects returns correct type', async () => {
			if (!TEST_TEAM_ID) {
				throw new Error('TEST_FIGMA_TEAM_ID env var is required');
			}

			const result = await makeFigmaRequest<ProjectsGetTeamProjectsResponse>(
				`v1/teams/${TEST_TEAM_ID}/projects`,
				TEST_API_KEY,
			);

			FigmaEndpointOutputSchemas.projectsGetTeamProjects.parse(result);
		});
	});

	describe('components', () => {
		let testComponentKey: string | undefined;
		let testComponentSetKey: string | undefined;

		it('componentsGetForFile returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result = await makeFigmaRequest<ComponentsGetForFileResponse>(
					`v1/files/${TEST_FILE_KEY}/components`,
					TEST_API_KEY,
				);

				testComponentKey = result.meta?.components?.[0]?.key;
				FigmaEndpointOutputSchemas.componentsGetForFile.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn(
						'componentsGetForFile: access denied or no components - skipping',
					);
					return;
				}
				throw error;
			}
		});

		it('componentSetsGetForFile returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result = await makeFigmaRequest<ComponentSetsGetForFileResponse>(
					`v1/files/${TEST_FILE_KEY}/component_sets`,
					TEST_API_KEY,
				);

				testComponentSetKey = result.meta?.component_sets?.[0]?.key;
				FigmaEndpointOutputSchemas.componentSetsGetForFile.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn(
						'componentSetsGetForFile: access denied or no component sets - skipping',
					);
					return;
				}
				throw error;
			}
		});

		it('componentsGetForTeam returns correct type', async () => {
			if (!TEST_TEAM_ID) {
				throw new Error('TEST_FIGMA_TEAM_ID env var is required');
			}

			try {
				const result = await makeFigmaRequest<ComponentsGetForTeamResponse>(
					`v1/teams/${TEST_TEAM_ID}/components`,
					TEST_API_KEY,
					{ query: { page_size: 10 } },
				);

				FigmaEndpointOutputSchemas.componentsGetForTeam.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn('componentsGetForTeam: access denied - skipping');
					return;
				}
				throw error;
			}
		});

		it('componentSetsGetForTeam returns correct type', async () => {
			if (!TEST_TEAM_ID) {
				throw new Error('TEST_FIGMA_TEAM_ID env var is required');
			}

			try {
				const result = await makeFigmaRequest<ComponentSetsGetForTeamResponse>(
					`v1/teams/${TEST_TEAM_ID}/component_sets`,
					TEST_API_KEY,
					{ query: { page_size: 10 } },
				);

				FigmaEndpointOutputSchemas.componentSetsGetForTeam.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn('componentSetsGetForTeam: access denied - skipping');
					return;
				}
				throw error;
			}
		});
		it('componentsGet returns correct type', async () => {
			if (!testComponentKey) {
				console.warn(
					'No component key available from componentsGetForFile - skipping',
				);
				return;
			}

			try {
				const result = await makeFigmaRequest<ComponentsGetResponse>(
					`v1/components/${testComponentKey}`,
					TEST_API_KEY,
				);

				FigmaEndpointOutputSchemas.componentsGet.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn('componentsGet: access denied - skipping');
					return;
				}
				throw error;
			}
		});

		it('componentSetsGet returns correct type', async () => {
			if (!testComponentSetKey) {
				console.warn(
					'No component set key available from componentSetsGetForFile - skipping',
				);
				return;
			}

			try {
				const result = await makeFigmaRequest<ComponentSetsGetResponse>(
					`v1/component_sets/${testComponentSetKey}`,
					TEST_API_KEY,
				);

				FigmaEndpointOutputSchemas.componentSetsGet.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn('componentSetsGet: access denied - skipping');
					return;
				}
				throw error;
			}
		});
	});

	describe('styles', () => {
		it('stylesGetForTeam returns correct type', async () => {
			if (!TEST_TEAM_ID) {
				throw new Error('TEST_FIGMA_TEAM_ID env var is required');
			}

			try {
				const result = await makeFigmaRequest<StylesGetForTeamResponse>(
					`v1/teams/${TEST_TEAM_ID}/styles`,
					TEST_API_KEY,
					{ query: { page_size: 10 } },
				);

				FigmaEndpointOutputSchemas.stylesGetForTeam.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found'))
				) {
					console.warn('stylesGetForTeam: access denied - skipping');
					return;
				}
				throw error;
			}
		});
	});

	describe('activityLogs', () => {
		it('activityLogsList returns correct type', async () => {
			try {
				const result = await makeFigmaRequest<ActivityLogsListResponse>(
					'v1/activity_logs',
					TEST_API_KEY,
					{ query: { limit: 5 } },
				);

				FigmaEndpointOutputSchemas.activityLogsList.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('401') ||
						error.message.includes('Unauthorized') ||
						error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('payment') ||
						error.message.includes('Enterprise') ||
						error.message.includes('404'))
				) {
					console.warn(
						'activityLogsList: requires Figma Enterprise plan - skipping',
					);
					return;
				}
				throw error;
			}
		});
	});

	describe('libraryAnalytics', () => {
		it('libraryAnalyticsComponentActions returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result =
					await makeFigmaRequest<LibraryAnalyticsComponentActionsResponse>(
						`v1/analytics/libraries/${TEST_FILE_KEY}/component/actions`,
						TEST_API_KEY,
						{ query: { group_by: 'component' } },
					);

				FigmaEndpointOutputSchemas.libraryAnalyticsComponentActions.parse(
					result,
				);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found') ||
						error.message.includes('payment') ||
						error.message.includes('Enterprise'))
				) {
					console.warn(
						'libraryAnalyticsComponentActions: requires Figma Organization/Enterprise - skipping',
					);
					return;
				}
				throw error;
			}
		});

		it('libraryAnalyticsComponentUsages returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result =
					await makeFigmaRequest<LibraryAnalyticsComponentUsagesResponse>(
						`v1/analytics/libraries/${TEST_FILE_KEY}/component/usages`,
						TEST_API_KEY,
					);

				FigmaEndpointOutputSchemas.libraryAnalyticsComponentUsages.parse(
					result,
				);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found') ||
						error.message.includes('payment') ||
						error.message.includes('Enterprise'))
				) {
					console.warn(
						'libraryAnalyticsComponentUsages: requires Figma Organization/Enterprise - skipping',
					);
					return;
				}
				throw error;
			}
		});

		it('libraryAnalyticsStyleActions returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result =
					await makeFigmaRequest<LibraryAnalyticsStyleActionsResponse>(
						`v1/analytics/libraries/${TEST_FILE_KEY}/style/actions`,
						TEST_API_KEY,
						{ query: { group_by: 'style' } },
					);

				FigmaEndpointOutputSchemas.libraryAnalyticsStyleActions.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found') ||
						error.message.includes('payment') ||
						error.message.includes('Enterprise'))
				) {
					console.warn(
						'libraryAnalyticsStyleActions: requires Figma Organization/Enterprise - skipping',
					);
					return;
				}
				throw error;
			}
		});

		it('libraryAnalyticsStyleUsages returns correct type', async () => {
			if (!TEST_FILE_KEY) {
				throw new Error('TEST_FIGMA_FILE_KEY env var is required');
			}

			try {
				const result =
					await makeFigmaRequest<LibraryAnalyticsStyleUsagesResponse>(
						`v1/analytics/libraries/${TEST_FILE_KEY}/style/usages`,
						TEST_API_KEY,
					);

				FigmaEndpointOutputSchemas.libraryAnalyticsStyleUsages.parse(result);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes('403') ||
						error.message.includes('Forbidden') ||
						error.message.includes('404') ||
						error.message.includes('Not Found') ||
						error.message.includes('payment') ||
						error.message.includes('Enterprise'))
				) {
					console.warn(
						'libraryAnalyticsStyleUsages: requires Figma Organization/Enterprise - skipping',
					);
					return;
				}
				throw error;
			}
		});
	});
});
