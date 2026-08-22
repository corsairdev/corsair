import {
	CrowterminalEndpointInputSchemas,
	CrowterminalEndpointOutputSchemas,
} from './types';

describe('CrowTerminal endpoint schemas', () => {
	it('validates documented memory read input and output', () => {
		expect(
			CrowterminalEndpointInputSchemas.memoryGet.parse({
				clientId: 'client_123',
			}),
		).toEqual({ clientId: 'client_123' });
		expect(
			CrowterminalEndpointOutputSchemas.memoryGet.parse({
				success: true,
				version: 47,
				skill: {
					primaryNiche: 'fitness',
					hookPatterns: ['confession'],
					avgEngagement: 4.2,
					bestPostingTimes: [{ day: 2, hour: 7, score: 0.89 }],
				},
			}),
		).toMatchObject({ success: true, version: 47 });
	});

	it('validates documented engagement-analysis input and output', () => {
		expect(
			CrowterminalEndpointInputSchemas.memoryEngagementAnalysis.parse({
				clientId: 'client_123',
				agentMd: { hookPatterns: ['confession'], contentStyle: 'casual' },
			}),
		).toMatchObject({ clientId: 'client_123' });
		expect(
			CrowterminalEndpointOutputSchemas.memoryEngagementAnalysis.parse({
				success: true,
				versionsAnalyzed: 47,
				overallStats: {
					peakEngagement: 6.2,
					peakVersion: 28,
					yourSimilarityToTop: '65%',
					yourSimilarityToBottom: '20%',
				},
				fieldAnalysis: [
					{
						field: 'hookPatterns',
						yourValue: ['confession'],
						bestValue: ['POV', 'confession'],
						bestEngagement: 6.2,
						yourPredictedEngagement: 4.1,
						improvement: '+51% potential improvement',
						confidence: 'high',
					},
				],
				recommendations: ['Change hookPatterns'],
			}),
		).toMatchObject({ success: true, versionsAnalyzed: 47 });
	});

	it('validates documented data ingestion input and output', () => {
		expect(
			CrowterminalEndpointInputSchemas.dataIngest.parse({
				clientId: 'client_123',
				platform: 'TIKTOK',
				dataType: 'retention',
				videoId: 'video_456',
				data: { retentionCurve: [100, 95], completionRate: 0.3 },
				confidence: 0.9,
			}),
		).toMatchObject({ platform: 'TIKTOK', dataType: 'retention' });
		expect(
			CrowterminalEndpointOutputSchemas.dataIngest.parse({
				success: true,
				message: 'Data ingested successfully',
				id: 'abc123',
				clientId: 'client_123',
				platform: 'TIKTOK',
				dataType: 'retention',
				_tip: 'Use engagement_analysis endpoint',
			}),
		).toMatchObject({ success: true, id: 'abc123' });
	});

	it('validates the no-argument status operation', () => {
		expect(CrowterminalEndpointInputSchemas.statusGet.parse({})).toEqual({});
		expect(
			CrowterminalEndpointOutputSchemas.statusGet.parse({
				currentStatus: 'operational',
			}),
		).toEqual({ currentStatus: 'operational' });
	});

	it('validates webhook creation input and its documented response', () => {
		expect(
			CrowterminalEndpointInputSchemas.webhooksCreate.parse({
				url: 'https://example.com/crowterminal',
				events: ['skill.updated', 'data.ingested'],
				secret: 'webhook-secret',
			}),
		).toMatchObject({ events: ['skill.updated', 'data.ingested'] });
		expect(
			CrowterminalEndpointOutputSchemas.webhooksCreate.parse({
				id: 'wh_123',
				secret: 'webhook-secret',
			}),
		).toEqual({ id: 'wh_123', secret: 'webhook-secret' });
	});

	it('validates webhook listing input', () => {
		expect(CrowterminalEndpointInputSchemas.webhooksList.parse({})).toEqual({});
		expect(
			CrowterminalEndpointOutputSchemas.webhooksList.parse({ data: [] }),
		).toEqual({ data: [] });
	});

	it('validates webhook update input', () => {
		expect(
			CrowterminalEndpointInputSchemas.webhooksUpdate.parse({
				webhookId: 'wh_123',
				isActive: false,
			}),
		).toEqual({ webhookId: 'wh_123', isActive: false });
		expect(
			CrowterminalEndpointOutputSchemas.webhooksUpdate.parse({ id: 'wh_123' }),
		).toEqual({ id: 'wh_123' });
	});

	it('validates webhook deletion input', () => {
		expect(
			CrowterminalEndpointInputSchemas.webhooksDelete.parse({
				webhookId: 'wh_123',
			}),
		).toEqual({ webhookId: 'wh_123' });
		expect(
			CrowterminalEndpointOutputSchemas.webhooksDelete.parse({ success: true }),
		).toEqual({ success: true });
	});

	it('validates webhook test input', () => {
		expect(
			CrowterminalEndpointInputSchemas.webhooksTest.parse({
				url: 'https://example.com/crowterminal',
			}),
		).toEqual({ url: 'https://example.com/crowterminal' });
		expect(
			CrowterminalEndpointOutputSchemas.webhooksTest.parse({ delivered: true }),
		).toEqual({ delivered: true });
	});
});
