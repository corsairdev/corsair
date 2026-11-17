import { InsightsGetResponseSchema } from './endpoints/types';

// Trimmed from a live call on 11-17 (numOfDays=1, no dimensions) against a new
// project with no traffic: counts arrive as numbers, missing averages as null,
// and the keys differ from the sample in Microsoft's docs.
const liveResponse = [
	{
		metricName: 'DeadClickCount',
		information: [
			{
				sessionsCount: 0,
				sessionsWithMetricPercentage: 0,
				sessionsWithoutMetricPercentage: 100,
				pagesViews: 0,
				subTotal: 0,
			},
		],
	},
	{ metricName: 'ScrollDepth', information: [{ averageScrollDepth: null }] },
	{
		metricName: 'Traffic',
		information: [
			{
				totalSessionCount: 0,
				totalBotSessionCount: 0,
				distinctUserCount: 0,
				pagesPerSessionPercentage: null,
			},
		],
	},
	{
		metricName: 'EngagementTime',
		information: [{ totalTime: null, activeTime: null }],
	},
	{ metricName: 'Country', information: [] },
];

// The documented sample, with counts as strings.
const docsSample = [
	{
		metricName: 'Traffic',
		information: [
			{
				totalSessionCount: '9554',
				totalBotSessionCount: '8369',
				distantUserCount: '189733',
				PagesPerSessionPercentage: 1.0931,
				OS: 'Other',
			},
		],
	},
];

describe('Microsoft Clarity response shape', () => {
	it('accepts the live response with numeric counts and nulls', () => {
		expect(InsightsGetResponseSchema.parse(liveResponse)).toEqual(liveResponse);
	});

	it('still accepts the documented sample with string counts', () => {
		expect(InsightsGetResponseSchema.parse(docsSample)).toEqual(docsSample);
	});
});
