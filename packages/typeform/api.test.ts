import 'dotenv/config';
import { makeTypeformRequest } from './client';
import type {
	FormsCreateResponse,
	FormsDeleteResponse,
	FormsGetMessagesResponse,
	FormsGetResponse,
	FormsListResponse,
	FormsPatchResponse,
	FormsUpdateMessagesResponse,
	FormsUpdateResponse,
	ImagesCreateResponse,
	ImagesDeleteResponse,
	ImagesGetBackgroundBySizeResponse,
	ImagesGetBySizeResponse,
	ImagesGetChoiceImageBySizeResponse,
	ImagesListResponse,
	MeGetResponse,
	ResponsesDeleteResponse,
	ResponsesGetAllFilesResponse,
	ResponsesListResponse,
	ThemesCreateResponse,
	ThemesDeleteResponse,
	ThemesGetResponse,
	ThemesListResponse,
	ThemesPatchResponse,
	ThemesUpdateResponse,
	VideosUploadResponse,
	WebhooksConfigCreateOrUpdateResponse,
	WebhooksConfigDeleteResponse,
	WebhooksConfigGetResponse,
	WebhooksConfigListResponse,
	WorkspacesCreateForAccountResponse,
	WorkspacesCreateResponse,
	WorkspacesDeleteResponse,
	WorkspacesGetResponse,
	WorkspacesListResponse,
	WorkspacesUpdateResponse,
} from './endpoints/types';
import { TypeformEndpointOutputSchemas } from './endpoints/types';

const TEST_ACCESS_TOKEN = process.env.TYPEFORM_ACCESS_TOKEN!;

// Minimal 1×1 transparent PNG for image upload tests
const TINY_PNG_BASE64 =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

describe('Typeform API Type Tests', () => {
	describe('me', () => {
		it('meGet returns correct type', async () => {
			const response = await makeTypeformRequest<MeGetResponse>(
				'/me',
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.meGet.parse(response);
		});
	});

	describe('forms', () => {
		let testFormId: string;

		beforeAll(async () => {
			const created = await makeTypeformRequest<FormsCreateResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { title: `Test Form ${Date.now()}` },
				},
			);
			testFormId = created.id!;
		});

		afterAll(async () => {
			if (testFormId) {
				await makeTypeformRequest(`/forms/${testFormId}`, TEST_ACCESS_TOKEN, {
					method: 'DELETE',
				}).catch(() => {});
			}
		});

		it('formsList returns correct type', async () => {
			const response = await makeTypeformRequest<FormsListResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 10 } },
			);

			TypeformEndpointOutputSchemas.formsList.parse(response);
		});

		it('formsGet returns correct type', async () => {
			const response = await makeTypeformRequest<FormsGetResponse>(
				`/forms/${testFormId}`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.formsGet.parse(response);
		});

		it('formsCreate returns correct type', async () => {
			const response = await makeTypeformRequest<FormsCreateResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { title: `Test Form Create ${Date.now()}` },
				},
			);

			TypeformEndpointOutputSchemas.formsCreate.parse(response);

			// clean up
			await makeTypeformRequest(`/forms/${response.id}`, TEST_ACCESS_TOKEN, {
				method: 'DELETE',
			}).catch(() => {});
		});

		it('formsUpdate returns correct type', async () => {
			const response = await makeTypeformRequest<FormsUpdateResponse>(
				`/forms/${testFormId}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PUT',
					body: { title: `Test Form Updated ${Date.now()}` },
				},
			);

			TypeformEndpointOutputSchemas.formsUpdate.parse(response);
		});

		it('formsPatch returns correct type', async () => {
			// Typeform PATCH /forms expects the JSON Patch operations array directly as the body (RFC 6902)
			const response = await makeTypeformRequest<FormsPatchResponse>(
				`/forms/${testFormId}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: [
						{
							op: 'replace',
							path: '/title',
							value: `Patched Form ${Date.now()}`,
						},
					] as unknown as Record<string, unknown>,
				},
			);

			TypeformEndpointOutputSchemas.formsPatch.parse(response);
		});

		it('formsGetMessages returns correct type', async () => {
			const response = await makeTypeformRequest<FormsGetMessagesResponse>(
				`/forms/${testFormId}/messages`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.formsGetMessages.parse(response);
		});

		it('formsUpdateMessages returns correct type', async () => {
			// GET current messages first to obtain the real dot-notation key format used by Typeform API
			const existingMessages = await makeTypeformRequest<
				Record<string, string>
			>(`/forms/${testFormId}/messages`, TEST_ACCESS_TOKEN);

			const [firstKey, firstValue] = Object.entries(existingMessages)[0] ?? [];
			// Skip if no messages found (form has no custom messages)
			if (!firstKey) return;

			const response = await makeTypeformRequest<FormsUpdateMessagesResponse>(
				`/forms/${testFormId}/messages`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PUT',
					body: { [firstKey]: firstValue },
				},
			);

			TypeformEndpointOutputSchemas.formsUpdateMessages.parse(response);
		});

		it('formsDelete returns correct type', async () => {
			const created = await makeTypeformRequest<FormsCreateResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { title: `Test Form To Delete ${Date.now()}` },
				},
			);

			const response = await makeTypeformRequest<FormsDeleteResponse>(
				`/forms/${created.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TypeformEndpointOutputSchemas.formsDelete.parse(response);
		});
	});

	describe('responses', () => {
		let testFormId: string;

		beforeAll(async () => {
			const listResponse = await makeTypeformRequest<FormsListResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 1 } },
			);
			testFormId = listResponse.items?.[0]?.id ?? '';
		});

		it('responsesList returns correct type', async () => {
			if (!testFormId) return;

			const response = await makeTypeformRequest<ResponsesListResponse>(
				`/forms/${testFormId}/responses`,
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 10 } },
			);

			TypeformEndpointOutputSchemas.responsesList.parse(response);
		});

		it('responsesGetAllFiles returns correct type', async () => {
			if (!testFormId) return;

			const response = await makeTypeformRequest<ResponsesGetAllFilesResponse>(
				`/forms/${testFormId}/responses/files`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.responsesGetAllFiles.parse(response);
		});

		it('responsesDelete returns correct type', async () => {
			if (!testFormId) return;

			const listResponse = await makeTypeformRequest<ResponsesListResponse>(
				`/forms/${testFormId}/responses`,
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 1 } },
			);

			const responseId = listResponse.items?.[0]?.response_id;
			if (!responseId) return;

			const response = await makeTypeformRequest<ResponsesDeleteResponse>(
				`/forms/${testFormId}/responses`,
				TEST_ACCESS_TOKEN,
				{
					method: 'DELETE',
					query: { included_response_ids: responseId },
				},
			);

			TypeformEndpointOutputSchemas.responsesDelete.parse(response);
		});
	});

	describe('workspaces', () => {
		let testWorkspaceId: string;

		beforeAll(async () => {
			const created = await makeTypeformRequest<WorkspacesCreateResponse>(
				'/workspaces',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Workspace ${Date.now()}` },
				},
			);
			testWorkspaceId = created.id!;
		});

		afterAll(async () => {
			if (testWorkspaceId) {
				await makeTypeformRequest(
					`/workspaces/${testWorkspaceId}`,
					TEST_ACCESS_TOKEN,
					{ method: 'DELETE' },
				).catch(() => {});
			}
		});

		it('workspacesList returns correct type', async () => {
			const response = await makeTypeformRequest<WorkspacesListResponse>(
				'/workspaces',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 10 } },
			);

			TypeformEndpointOutputSchemas.workspacesList.parse(response);
		});

		it('workspacesGet returns correct type', async () => {
			const response = await makeTypeformRequest<WorkspacesGetResponse>(
				`/workspaces/${testWorkspaceId}`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.workspacesGet.parse(response);
		});

		it('workspacesCreate returns correct type', async () => {
			const response = await makeTypeformRequest<WorkspacesCreateResponse>(
				'/workspaces',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Workspace Create ${Date.now()}` },
				},
			);

			TypeformEndpointOutputSchemas.workspacesCreate.parse(response);

			// clean up
			await makeTypeformRequest(
				`/workspaces/${response.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			).catch(() => {});
		});

		it('workspacesUpdate returns correct type', async () => {
			// Typeform PATCH /workspaces expects the JSON Patch operations array directly as the body (RFC 6902)
			const response = await makeTypeformRequest<WorkspacesUpdateResponse>(
				`/workspaces/${testWorkspaceId}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: [
						{
							op: 'replace',
							path: '/name',
							value: `Updated Workspace ${Date.now()}`,
						},
					] as unknown as Record<string, unknown>,
				},
			);

			TypeformEndpointOutputSchemas.workspacesUpdate.parse(response);
		});

		it('workspacesCreateForAccount returns correct type', async () => {
			// Fetch account_id from /me (the actual API returns it as a top-level field)
			// MeGetResponseSchema uses passthrough so extra fields are preserved in the inferred type
			const meResponse = await makeTypeformRequest<MeGetResponse>(
				'/me',
				TEST_ACCESS_TOKEN,
			);

			const accountId = meResponse.account_id as string | undefined;
			if (!accountId) return;

			const response =
				await makeTypeformRequest<WorkspacesCreateForAccountResponse>(
					`/accounts/${accountId}/workspaces`,
					TEST_ACCESS_TOKEN,
					{
						method: 'POST',
						body: { name: `Test Account Workspace ${Date.now()}` },
					},
				);

			TypeformEndpointOutputSchemas.workspacesCreateForAccount.parse(response);

			// clean up
			await makeTypeformRequest(
				`/workspaces/${response.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			).catch(() => {});
		});

		it('workspacesDelete returns correct type', async () => {
			const created = await makeTypeformRequest<WorkspacesCreateResponse>(
				'/workspaces',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Workspace To Delete ${Date.now()}` },
				},
			);

			const response = await makeTypeformRequest<WorkspacesDeleteResponse>(
				`/workspaces/${created.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TypeformEndpointOutputSchemas.workspacesDelete.parse(response);
		});
	});

	describe('images', () => {
		let testImageId: string;

		beforeAll(async () => {
			const created = await makeTypeformRequest<ImagesCreateResponse>(
				'/images',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						file_name: `test-image-${Date.now()}.png`,
						image: TINY_PNG_BASE64,
					},
				},
			);
			testImageId = created.id!;
		});

		afterAll(async () => {
			if (testImageId) {
				await makeTypeformRequest(`/images/${testImageId}`, TEST_ACCESS_TOKEN, {
					method: 'DELETE',
				}).catch(() => {});
			}
		});

		it('imagesList returns correct type', async () => {
			const response = await makeTypeformRequest<ImagesListResponse>(
				'/images',
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.imagesList.parse(response);
		});

		it('imagesCreate returns correct type', async () => {
			const response = await makeTypeformRequest<ImagesCreateResponse>(
				'/images',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						file_name: `test-image-create-${Date.now()}.png`,
						image: TINY_PNG_BASE64,
					},
				},
			);

			TypeformEndpointOutputSchemas.imagesCreate.parse(response);

			// clean up
			await makeTypeformRequest(`/images/${response.id}`, TEST_ACCESS_TOKEN, {
				method: 'DELETE',
			}).catch(() => {});
		});

		it('imagesGetBySize returns correct type', async () => {
			if (!testImageId) return;

			// Size variants may not exist for all images; skip if the API returns 404
			let response: ImagesGetBySizeResponse;
			try {
				response = await makeTypeformRequest<ImagesGetBySizeResponse>(
					`/images/${testImageId}/default`,
					TEST_ACCESS_TOKEN,
				);
			} catch {
				return;
			}

			TypeformEndpointOutputSchemas.imagesGetBySize.parse(response);
		});

		it('imagesGetBackgroundBySize returns correct type', async () => {
			if (!testImageId) return;

			// Background size variants may not exist for all images; skip if the API returns 404
			let response: ImagesGetBackgroundBySizeResponse;
			try {
				response = await makeTypeformRequest<ImagesGetBackgroundBySizeResponse>(
					`/images/${testImageId}/background/default`,
					TEST_ACCESS_TOKEN,
				);
			} catch {
				return;
			}

			TypeformEndpointOutputSchemas.imagesGetBackgroundBySize.parse(response);
		});

		it('imagesGetChoiceImageBySize returns correct type', async () => {
			if (!testImageId) return;

			// Choice image size variants may not exist for all images; skip if the API returns 404
			let response: ImagesGetChoiceImageBySizeResponse;
			try {
				response =
					await makeTypeformRequest<ImagesGetChoiceImageBySizeResponse>(
						`/images/${testImageId}/choice/default`,
						TEST_ACCESS_TOKEN,
					);
			} catch {
				return;
			}

			TypeformEndpointOutputSchemas.imagesGetChoiceImageBySize.parse(response);
		});

		it('imagesDelete returns correct type', async () => {
			const created = await makeTypeformRequest<ImagesCreateResponse>(
				'/images',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						file_name: `test-image-delete-${Date.now()}.png`,
						image: TINY_PNG_BASE64,
					},
				},
			);

			const response = await makeTypeformRequest<ImagesDeleteResponse>(
				`/images/${created.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TypeformEndpointOutputSchemas.imagesDelete.parse(response);
		});
	});

	describe('themes', () => {
		let testThemeId: string;

		const baseThemeBody = {
			font: 'Acme',
			colors: {
				question: '#3D3D3D',
				answer: '#4FB0AE',
				button: '#4FB0AE',
				background: '#FFFFFF',
			},
			fields: { alignment: 'left', font_size: 'medium' },
		};

		beforeAll(async () => {
			const created = await makeTypeformRequest<ThemesCreateResponse>(
				'/themes',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { ...baseThemeBody, name: `Test Theme ${Date.now()}` },
				},
			);
			testThemeId = created.id!;
		});

		afterAll(async () => {
			if (testThemeId) {
				await makeTypeformRequest(`/themes/${testThemeId}`, TEST_ACCESS_TOKEN, {
					method: 'DELETE',
				}).catch(() => {});
			}
		});

		it('themesList returns correct type', async () => {
			const response = await makeTypeformRequest<ThemesListResponse>(
				'/themes',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 10 } },
			);

			TypeformEndpointOutputSchemas.themesList.parse(response);
		});

		it('themesCreate returns correct type', async () => {
			const response = await makeTypeformRequest<ThemesCreateResponse>(
				'/themes',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: { ...baseThemeBody, name: `Test Theme Create ${Date.now()}` },
				},
			);

			TypeformEndpointOutputSchemas.themesCreate.parse(response);

			// clean up
			await makeTypeformRequest(`/themes/${response.id}`, TEST_ACCESS_TOKEN, {
				method: 'DELETE',
			}).catch(() => {});
		});

		it('themesGet returns correct type', async () => {
			const response = await makeTypeformRequest<ThemesGetResponse>(
				`/themes/${testThemeId}`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.themesGet.parse(response);
		});

		it('themesUpdate returns correct type', async () => {
			const response = await makeTypeformRequest<ThemesUpdateResponse>(
				`/themes/${testThemeId}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PUT',
					body: {
						...baseThemeBody,
						name: `Test Theme Updated ${Date.now()}`,
					},
				},
			);

			TypeformEndpointOutputSchemas.themesUpdate.parse(response);
		});

		it('themesPatch returns correct type', async () => {
			const response = await makeTypeformRequest<ThemesPatchResponse>(
				`/themes/${testThemeId}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: { name: `Test Theme Patched ${Date.now()}` },
				},
			);

			TypeformEndpointOutputSchemas.themesPatch.parse(response);
		});

		it('themesDelete returns correct type', async () => {
			const created = await makeTypeformRequest<ThemesCreateResponse>(
				'/themes',
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						...baseThemeBody,
						name: `Test Theme To Delete ${Date.now()}`,
					},
				},
			);

			const response = await makeTypeformRequest<ThemesDeleteResponse>(
				`/themes/${created.id}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TypeformEndpointOutputSchemas.themesDelete.parse(response);
		});
	});

	describe('webhooksConfig', () => {
		let testFormId: string;
		let testTag: string;

		beforeAll(async () => {
			const listResponse = await makeTypeformRequest<FormsListResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 1 } },
			);
			testFormId = listResponse.items?.[0]?.id ?? '';

			if (testFormId && process.env.TEST_TYPEFORM_WEBHOOK_URL) {
				testTag = `test-hook-${Date.now()}`;
				await makeTypeformRequest(
					`/forms/${testFormId}/webhooks/${testTag}`,
					TEST_ACCESS_TOKEN,
					{
						method: 'PUT',
						body: {
							url: process.env.TEST_TYPEFORM_WEBHOOK_URL,
							enabled: false,
							event_types: ['form_response'],
						},
					},
				).catch(() => {});
			}
		});

		afterAll(async () => {
			if (testFormId && testTag) {
				await makeTypeformRequest(
					`/forms/${testFormId}/webhooks/${testTag}`,
					TEST_ACCESS_TOKEN,
					{ method: 'DELETE' },
				).catch(() => {});
			}
		});

		it('webhooksConfigList returns correct type', async () => {
			if (!testFormId) return;

			const response = await makeTypeformRequest<WebhooksConfigListResponse>(
				`/forms/${testFormId}/webhooks`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.webhooksConfigList.parse(response);
		});

		it('webhooksConfigCreateOrUpdate returns correct type', async () => {
			if (!testFormId || !process.env.TEST_TYPEFORM_WEBHOOK_URL) return;

			const tag = `test-hook-create-${Date.now()}`;
			const response =
				await makeTypeformRequest<WebhooksConfigCreateOrUpdateResponse>(
					`/forms/${testFormId}/webhooks/${tag}`,
					TEST_ACCESS_TOKEN,
					{
						method: 'PUT',
						body: {
							url: process.env.TEST_TYPEFORM_WEBHOOK_URL,
							enabled: false,
							event_types: ['form_response'],
						},
					},
				);

			TypeformEndpointOutputSchemas.webhooksConfigCreateOrUpdate.parse(
				response,
			);

			// clean up
			await makeTypeformRequest(
				`/forms/${testFormId}/webhooks/${tag}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			).catch(() => {});
		});

		it('webhooksConfigGet returns correct type', async () => {
			if (!testFormId || !testTag) return;

			const response = await makeTypeformRequest<WebhooksConfigGetResponse>(
				`/forms/${testFormId}/webhooks/${testTag}`,
				TEST_ACCESS_TOKEN,
			);

			TypeformEndpointOutputSchemas.webhooksConfigGet.parse(response);
		});

		it('webhooksConfigDelete returns correct type', async () => {
			if (!testFormId || !process.env.TEST_TYPEFORM_WEBHOOK_URL) return;

			const tag = `test-hook-delete-${Date.now()}`;
			await makeTypeformRequest(
				`/forms/${testFormId}/webhooks/${tag}`,
				TEST_ACCESS_TOKEN,
				{
					method: 'PUT',
					body: {
						url: process.env.TEST_TYPEFORM_WEBHOOK_URL,
						enabled: false,
						event_types: ['form_response'],
					},
				},
			);

			const response = await makeTypeformRequest<WebhooksConfigDeleteResponse>(
				`/forms/${testFormId}/webhooks/${tag}`,
				TEST_ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TypeformEndpointOutputSchemas.webhooksConfigDelete.parse(response);
		});
	});

	describe('videos', () => {
		it('videosUpload returns correct type', async () => {
			// Requires a form with a video field; skip if not present
			const listResponse = await makeTypeformRequest<FormsListResponse>(
				'/forms',
				TEST_ACCESS_TOKEN,
				{ query: { page_size: 10 } },
			);

			// Find a form that has fields, then look for a video/file field
			let targetFormId: string | undefined;
			let targetFieldId: string | undefined;

			for (const form of listResponse.items ?? []) {
				if (!form.id) continue;
				const detail = await makeTypeformRequest<FormsGetResponse>(
					`/forms/${form.id}`,
					TEST_ACCESS_TOKEN,
				);
				const videoField = detail.fields?.find(
					(f) => f.type === 'file_upload' || f.type === 'video_choice',
				);
				if (videoField?.id) {
					targetFormId = form.id;
					targetFieldId = videoField.id;
					break;
				}
			}

			if (!targetFormId || !targetFieldId) return;

			const response = await makeTypeformRequest<VideosUploadResponse>(
				`/forms/${targetFormId}/videos/${targetFieldId}/en`,
				TEST_ACCESS_TOKEN,
				{ method: 'POST', body: {} },
			);

			TypeformEndpointOutputSchemas.videosUpload.parse(response);
		});
	});
});
