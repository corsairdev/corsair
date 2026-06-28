import 'dotenv/config';
import { AgentQLEndpointOutputSchemas } from './endpoints/types';

describe('AgentQL API Type Tests', () => {
	describe('Schema validation', () => {
		it('should validate createRemoteBrowserSession schema', () => {
			const mockResponse = {
				sessionId: 'test-session-id',
				sessionUrl: 'https://example.com/session',
				expiresAt: '2026-12-31T23:59:59Z',
			};

			const result =
				AgentQLEndpointOutputSchemas.createRemoteBrowserSession.safeParse(
					mockResponse,
				);
			expect(result.success).toBe(true);
		});

		it('should validate queryData schema', () => {
			const mockResponse = {
				data: {
					items: [
						{
							title: 'Test Item',
							price: '$10.99',
						},
					],
				},
			};

			const result =
				AgentQLEndpointOutputSchemas.queryData.safeParse(mockResponse);
			expect(result.success).toBe(true);
		});

		it('should validate queryDocument schema', () => {
			const mockResponse = {
				data: {
					extractedText: 'Sample document text',
					metadata: {
						pages: 1,
					},
				},
			};

			const result =
				AgentQLEndpointOutputSchemas.queryDocument.safeParse(mockResponse);
			expect(result.success).toBe(true);
		});

		it('should validate getUsage schema', () => {
			const mockResponse = {
				usage: {
					current: 100,
					limit: 1000,
					period: 'monthly',
				},
			};

			const result =
				AgentQLEndpointOutputSchemas.getUsage.safeParse(mockResponse);
			expect(result.success).toBe(true);
		});
	});

	describe('Plugin initialization', () => {
		it('should export AgentQL plugin factory', async () => {
			const { agentql } = await import('./index');
			expect(agentql).toBeDefined();
			expect(typeof agentql).toBe('function');
		});

		it('should create plugin with default options', async () => {
			const { agentql } = await import('./index');
			const plugin = agentql();
			expect(plugin).toBeDefined();
			expect(plugin.id).toBe('agentql');
		});

		it('should create plugin with custom options', async () => {
			const { agentql } = await import('./index');
			const plugin = agentql({ key: 'test-key' });
			expect(plugin).toBeDefined();
			expect(plugin.id).toBe('agentql');
		});
	});
});
