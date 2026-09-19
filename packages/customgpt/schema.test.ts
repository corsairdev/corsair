import {
	CustomGPTEndpointInputSchemas,
	CustomGPTEndpointOutputSchemas,
} from './endpoints/types';
import { customGPTAuthConfig, customGPTEndpointSchemas } from './index';
import { CustomGPTSchema } from './schema';

describe('CustomGPT schema', () => {
	it('declares a semver version', () => {
		expect(CustomGPTSchema.version).toBeDefined();
		expect(CustomGPTSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all 7 official entities', () => {
		expect(typeof CustomGPTSchema.entities).toBe('object');
		expect(CustomGPTSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(CustomGPTSchema.entities);
		expect(entityKeys).toHaveLength(7);
		expect(entityKeys).toContain('projects');
		expect(entityKeys).toContain('pages');
		expect(entityKeys).toContain('sources');
		expect(entityKeys).toContain('conversations');
		expect(entityKeys).toContain('messages');
		expect(entityKeys).toContain('licenses');
		expect(entityKeys).toContain('leads');

		for (const entity of Object.values(CustomGPTSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('defines authConfig with api_key support', () => {
		expect(customGPTAuthConfig.api_key).toBeDefined();
	});

	it('declares all 40 endpoint schemas', () => {
		expect(Object.keys(customGPTEndpointSchemas)).toHaveLength(40);
	});
});

describe('CustomGPT Endpoint Input & Output Schemas', () => {
	// Projects (8)
	describe('Projects schemas', () => {
		it('validates listProjects input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listProjects;
			const outSchema = CustomGPTEndpointOutputSchemas.listProjects;
			expect(inSchema.safeParse({}).success).toBe(true);
			expect(inSchema.safeParse({ page: 2, order: 'asc' }).success).toBe(true);
			expect(inSchema.safeParse({ page: 'invalid' }).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { current_page: 1, data: [{ id: 1, project_name: 'Test' }] },
				}).success,
			).toBe(true);
		});

		it('validates getProject input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getProject;
			const outSchema = CustomGPTEndpointOutputSchemas.getProject;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				inSchema.safeParse({ projectId: 10, width: '300', height: '200' })
					.success,
			).toBe(true);
			expect(inSchema.safeParse({}).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 10, project_name: 'Agent' },
				}).success,
			).toBe(true);
		});

		it('validates createProject input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.createProject;
			const outSchema = CustomGPTEndpointOutputSchemas.createProject;
			expect(inSchema.safeParse({ project_name: 'New Agent' }).success).toBe(
				false,
			);
			expect(
				inSchema.safeParse({
					project_name: 'New Agent',
					sitemap_path: 'https://example.com/sitemap.xml',
				}).success,
			).toBe(true);
			expect(inSchema.safeParse({}).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 12, project_name: 'New Agent' },
				}).success,
			).toBe(true);
		});

		it('validates updateProject input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updateProject;
			const outSchema = CustomGPTEndpointOutputSchemas.updateProject;
			expect(
				inSchema.safeParse({ projectId: 10, project_name: 'Updated' }).success,
			).toBe(true);
			expect(inSchema.safeParse({ project_name: 'Updated' }).success).toBe(
				false,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 10, project_name: 'Updated' },
				}).success,
			).toBe(true);
		});

		it('validates deleteProject input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.deleteProject;
			const outSchema = CustomGPTEndpointOutputSchemas.deleteProject;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(inSchema.safeParse({}).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Project deleted' },
				}).success,
			).toBe(true);
		});

		it('validates cloneProject input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.cloneProject;
			const outSchema = CustomGPTEndpointOutputSchemas.cloneProject;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(inSchema.safeParse({}).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 20, project_name: 'Agent Copy' },
				}).success,
			).toBe(true);
		});

		it('validates getStats input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getStats;
			const outSchema = CustomGPTEndpointOutputSchemas.getStats;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { total_conversations: 5, total_queries: 25 },
				}).success,
			).toBe(true);
		});

		it('validates getPlugins input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getPlugins;
			const outSchema = CustomGPTEndpointOutputSchemas.getPlugins;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { plugins: [] },
				}).success,
			).toBe(true);
		});
	});

	// Pages (5)
	describe('Pages schemas', () => {
		it('validates listPages input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listPages;
			const outSchema = CustomGPTEndpointOutputSchemas.listPages;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				inSchema.safeParse({ projectId: 10, crawl_status: 'ok', page: 1 })
					.success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: {
						pages: {
							current_page: 1,
							data: [{ id: 101, page_url: 'https://example.com' }],
						},
					},
				}).success,
			).toBe(true);
		});

		it('validates deletePage input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.deletePage;
			const outSchema = CustomGPTEndpointOutputSchemas.deletePage;
			expect(inSchema.safeParse({ projectId: 10, pageId: 101 }).success).toBe(
				true,
			);
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(false);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Page deleted' },
				}).success,
			).toBe(true);
		});

		it('validates reindexPage input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.reindexPage;
			const outSchema = CustomGPTEndpointOutputSchemas.reindexPage;
			expect(inSchema.safeParse({ projectId: 10, pageId: 101 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Reindexing queued' },
				}).success,
			).toBe(true);
		});

		it('validates getPageMetadata input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getPageMetadata;
			const outSchema = CustomGPTEndpointOutputSchemas.getPageMetadata;
			expect(inSchema.safeParse({ projectId: 10, pageId: 101 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { title: 'Doc Title', description: 'Doc description' },
				}).success,
			).toBe(true);
		});

		it('validates updatePageMetadata input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updatePageMetadata;
			const outSchema = CustomGPTEndpointOutputSchemas.updatePageMetadata;
			expect(
				inSchema.safeParse({
					projectId: 10,
					pageId: 101,
					title: 'New Title',
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { title: 'New Title' },
				}).success,
			).toBe(true);
		});
	});

	// Sources (4)
	describe('Sources schemas', () => {
		it('validates listSources input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listSources;
			const outSchema = CustomGPTEndpointOutputSchemas.listSources;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { sitemaps: [{ id: 1, type: 'sitemap' }] },
				}).success,
			).toBe(true);
		});

		it('validates addSource input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.addSource;
			const outSchema = CustomGPTEndpointOutputSchemas.addSource;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sitemap_path: 'https://example.com/sitemap.xml',
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 2, type: 'sitemap' },
				}).success,
			).toBe(true);
		});

		it('validates updateSource input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updateSource;
			const outSchema = CustomGPTEndpointOutputSchemas.updateSource;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sourceId: 2,
					data_refresh_frequency: 'daily',
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 2, settings: { data_refresh_frequency: 'daily' } },
				}).success,
			).toBe(true);
		});

		it('validates deleteSource input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.deleteSource;
			const outSchema = CustomGPTEndpointOutputSchemas.deleteSource;
			expect(inSchema.safeParse({ projectId: 10, sourceId: 2 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Source removed' },
				}).success,
			).toBe(true);
		});
	});

	// Licenses (4)
	describe('Licenses schemas', () => {
		it('validates listProjectLicenses input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listProjectLicenses;
			const outSchema = CustomGPTEndpointOutputSchemas.listProjectLicenses;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: [{ key: 'lic_abc123', name: 'Standard' }],
				}).success,
			).toBe(true);
		});

		it('validates getProjectLicense input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getProjectLicense;
			const outSchema = CustomGPTEndpointOutputSchemas.getProjectLicense;
			expect(inSchema.safeParse({ projectId: 10, licenseId: 1 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					license: { key: 'lic_1', name: 'License 1' },
				}).success,
			).toBe(true);
		});

		it('validates updateProjectLicense input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updateProjectLicense;
			const outSchema = CustomGPTEndpointOutputSchemas.updateProjectLicense;
			expect(
				inSchema.safeParse({ projectId: 10, licenseId: 1, name: 'Pro' })
					.success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					license: { key: 'lic_1', name: 'Pro' },
				}).success,
			).toBe(true);
		});

		it('validates deleteProjectLicense input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.deleteProjectLicense;
			const outSchema = CustomGPTEndpointOutputSchemas.deleteProjectLicense;
			expect(inSchema.safeParse({ projectId: 10, licenseId: 1 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'License deleted' },
				}).success,
			).toBe(true);
		});
	});

	// Settings & Personas (4)
	describe('Settings & Personas schemas', () => {
		it('validates getProjectSettings input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getProjectSettings;
			const outSchema = CustomGPTEndpointOutputSchemas.getProjectSettings;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { default_prompt: 'You are an assistant' },
				}).success,
			).toBe(true);
		});

		it('validates updateProjectSettings input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updateProjectSettings;
			const outSchema = CustomGPTEndpointOutputSchemas.updateProjectSettings;
			expect(
				inSchema.safeParse({ projectId: 10, default_prompt: 'New prompt' })
					.success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { default_prompt: 'New prompt' },
				}).success,
			).toBe(true);
		});

		it('validates listPersonas input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listPersonas;
			const outSchema = CustomGPTEndpointOutputSchemas.listPersonas;
			expect(inSchema.safeParse({ projectId: 10, page: 1 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { current_page: 1, data: [{ id: 1, version: 1 }] },
				}).success,
			).toBe(true);
		});

		it('validates activatePersonaVersion input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.activatePersonaVersion;
			const outSchema = CustomGPTEndpointOutputSchemas.activatePersonaVersion;
			expect(inSchema.safeParse({ projectId: 10, version: 2 }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Persona activated' },
				}).success,
			).toBe(true);
		});
	});

	// Conversations & Messages (6)
	describe('Conversations & Messages schemas', () => {
		it('validates createConversation input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.createConversation;
			const outSchema = CustomGPTEndpointOutputSchemas.createConversation;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				inSchema.safeParse({ projectId: 10, name: 'Chat 1' }).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { session_id: 'sess_100', name: 'Chat 1' },
				}).success,
			).toBe(true);
		});

		it('validates listConversationMessages input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.listConversationMessages;
			const outSchema = CustomGPTEndpointOutputSchemas.listConversationMessages;
			expect(
				inSchema.safeParse({ projectId: 10, sessionId: 'sess_100' }).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: {
						conversation: { session_id: 'sess_100' },
						messages: {
							current_page: 1,
							data: [{ id: 1, user_query: 'Hello' }],
						},
					},
				}).success,
			).toBe(true);
		});

		it('validates getMessage input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getMessage;
			const outSchema = CustomGPTEndpointOutputSchemas.getMessage;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sessionId: 'sess_100',
					promptId: 1,
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 1, user_query: 'Hello', openai_response: 'Hi there' },
				}).success,
			).toBe(true);
		});

		it('validates getMessageTrustScore input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getMessageTrustScore;
			const outSchema = CustomGPTEndpointOutputSchemas.getMessageTrustScore;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sessionId: 'sess_100',
					promptId: 1,
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { trust_score: 95 },
				}).success,
			).toBe(true);
		});

		it('validates verifyMessage input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.verifyMessage;
			const outSchema = CustomGPTEndpointOutputSchemas.verifyMessage;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sessionId: 'sess_100',
					promptId: 1,
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { message: 'Verification completed', claims: [] },
				}).success,
			).toBe(true);
		});

		it('validates submitMessageFeedback input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.submitMessageFeedback;
			const outSchema = CustomGPTEndpointOutputSchemas.submitMessageFeedback;
			expect(
				inSchema.safeParse({
					projectId: 10,
					sessionId: 'sess_100',
					promptId: 1,
					reaction: 'liked',
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 1, response_feedback: { reaction: 'liked' } },
				}).success,
			).toBe(true);
		});
	});

	// Reports (5)
	describe('Reports schemas', () => {
		it('validates getReportAnalysis input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getReportAnalysis;
			const outSchema = CustomGPTEndpointOutputSchemas.getReportAnalysis;
			expect(
				inSchema.safeParse({
					projectId: 10,
					filters: ['queries'],
					interval: 'daily',
				}).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { chart: [] },
				}).success,
			).toBe(true);
		});

		it('validates getReportConversations input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getReportConversations;
			const outSchema = CustomGPTEndpointOutputSchemas.getReportConversations;
			expect(
				inSchema.safeParse({ projectId: 10, filters: ['total'] }).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { total_conversations: 50 },
				}).success,
			).toBe(true);
		});

		it('validates getReportTraffic input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getReportTraffic;
			const outSchema = CustomGPTEndpointOutputSchemas.getReportTraffic;
			expect(
				inSchema.safeParse({ projectId: 10, filters: ['sources'] }).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { unique_visitors: 120 },
				}).success,
			).toBe(true);
		});

		it('validates getReportIntelligence input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getReportIntelligence;
			const outSchema = CustomGPTEndpointOutputSchemas.getReportIntelligence;
			expect(
				inSchema.safeParse({ projectId: 10, page: 1, limit: 10 }).success,
			).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { current_page: 1, data: [{ prompt_id: 1 }] },
				}).success,
			).toBe(true);
		});

		it('validates exportLeads input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.exportLeads;
			const outSchema = CustomGPTEndpointOutputSchemas.exportLeads;
			expect(inSchema.safeParse({ projectId: 10 }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: {
						data: [
							{ session_id: 'sess_1', query_id: 1, email: 'user@example.com' },
						],
					},
				}).success,
			).toBe(true);
		});
	});

	// Limits & User (4)
	describe('Limits & User schemas', () => {
		it('validates getUsageLimits input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getUsageLimits;
			const outSchema = CustomGPTEndpointOutputSchemas.getUsageLimits;
			expect(inSchema.safeParse({}).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { projects: { current: 2, max: 10 } },
				}).success,
			).toBe(true);
		});

		it('validates getUserProfile input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.getUserProfile;
			const outSchema = CustomGPTEndpointOutputSchemas.getUserProfile;
			expect(inSchema.safeParse({}).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 1, name: 'Alice', email: 'alice@example.com' },
				}).success,
			).toBe(true);
		});

		it('validates updateUserProfile input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.updateUserProfile;
			const outSchema = CustomGPTEndpointOutputSchemas.updateUserProfile;
			expect(inSchema.safeParse({ name: 'Bob' }).success).toBe(true);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 1, name: 'Bob', email: 'bob@example.com' },
				}).success,
			).toBe(true);
		});

		it('validates searchTeamMembers input & output', () => {
			const inSchema = CustomGPTEndpointInputSchemas.searchTeamMembers;
			const outSchema = CustomGPTEndpointOutputSchemas.searchTeamMembers;
			expect(inSchema.safeParse({ email: 'bob@example.com' }).success).toBe(
				true,
			);
			expect(
				outSchema.safeParse({
					status: 'success',
					data: { id: 2, name: 'Bob', email: 'bob@example.com' },
				}).success,
			).toBe(true);
		});
	});
});
