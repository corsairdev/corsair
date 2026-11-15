import { CodacyEndpointOutputSchemas } from './types';

// Trimmed copies of real Codacy API v3 responses, recorded 2026-11-06 from
// api.codacy.com without a token (these reads also answer anonymously for
// public repositories and the tool catalog). Long text fields are cut.

const TOOL_LIST_RESPONSE = {
	data: [
		{
			uuid: 'f8b29663-2cb2-498d-b923-a10c6a8c05cd',
			name: 'ESLint',
			version: '8.57.0',
			shortName: 'eslint-8',
			needsCompilation: false,
			configurationFilenames: ['.eslintrc.js', '.eslintrc.json'],
			dockerImage: 'codacy/codacy-eslint:9.18.12',
			languages: ['Javascript', 'TypeScript'],
			clientSide: false,
			standalone: false,
			enabledByDefault: true,
			configurable: true,
			documentationUrl: 'https://eslint.org/docs/rules/',
			sourceCodeUrl: 'https://github.com/codacy/codacy-eslint',
			prefix: 'ESLint8_',
			description: 'ESLint is a tool for identifying and reporting on patterns',
		},
	],
	pagination: { cursor: 'MQ==', limit: 1, total: 63 },
};

const PATTERN = {
	id: 'ESLint8_accessor-pairs',
	category: 'BestPractice',
	level: 'Warning',
	severityLevel: 'Warning',
	enabled: false,
	parameters: [
		{
			name: 'enforceForClassMembers',
			default: 'true',
			description: 'enforceForClassMembers',
		},
	],
	title: 'Enforce Accessor Pairs',
	description: 'Ensure that objects and classes have matching getter and set',
	explanation: '---\ntitle: accessor-pairs\nrule_type: suggestion',
	languages: ['Javascript'],
	timeToFix: 10,
	rationale: 'Having a setter without a corresponding getter means the pro',
	solution: 'Define both getter and setter methods for each property that',
	goodExamples: [
		'var o = { set a(v) { this.val = v; }, get a() { return this.val; } };',
	],
	badExamples: ['var o = { set a(v) { this.val = v; } };'],
	tags: [],
};

const REPOSITORY_RESPONSE = {
	data: {
		provider: 'gh',
		owner: 'codacy',
		name: 'codacy-analysis-cli',
		visibility: 'Public',
		problems: [],
		languages: ['Go', 'Javascript', 'Scala'],
		standards: [{ id: 152099, name: 'AI Policy' }],
		addedState: 'Added',
		repositoryId: 285277,
		fullPath: 'codacy/codacy-analysis-cli',
		remoteIdentifier: '133814935',
		lastUpdated: '2026-10-22T15:37:28.746Z',
		permission: 'read',
		stack: {
			commitUuid: 'bd57cda74c41f518b2fc7c7577db9a2d79a1927f',
			stackTags: ['fwk:akka', 'lib:cats'],
			discoveredAt: '2026-10-22T15:37:42.453158Z',
		},
		defaultBranch: {
			id: 15195412,
			name: 'master',
			isDefault: true,
			isEnabled: true,
			branchType: 'Branch',
			lastUpdated: '2026-10-22T15:37:28.746Z',
			lastCommit: 'bd57cda74c41f518b2fc7c7577db9a2d79a1927f',
		},
		badges: {
			grade:
				'https://app.codacy.com/project/badge/Grade/2aa6927599ba4d9db6c9cfcb38e397e4',
		},
		codingStandardId: 152099,
		codingStandardName: 'AI Policy',
		gatePolicyId: 5213,
		gatePolicyName: 'BE policy',
	},
};

const ANALYSIS_TOOLS_RESPONSE = {
	data: [
		{
			uuid: '2fd7fbe0-33f9-4ab3-ab73-e9b62404e2cb',
			name: 'Trivy',
			isClientSide: false,
			settings: {
				isEnabled: true,
				followsStandard: true,
				isCustom: false,
				hasConfigurationFile: false,
				usesConfigurationFile: false,
				enabledBy: [{ id: 152099, name: 'AI Policy' }],
			},
		},
	],
};

describe('recorded Codacy responses parse with the output schemas', () => {
	it('GET /tools', () => {
		const parsed =
			CodacyEndpointOutputSchemas.toolList.parse(TOOL_LIST_RESPONSE);
		expect(parsed.data[0]?.name).toBe('ESLint');
		expect(parsed.pagination?.cursor).toBe('MQ==');
		// Fields not modeled in the schema are kept (loose parsing).
		expect(parsed.data[0]?.enabledByDefault).toBe(true);
	});

	it('GET /tools/{toolUuid}/patterns', () => {
		const parsed = CodacyEndpointOutputSchemas.patternList.parse({
			data: [PATTERN],
			pagination: { cursor: 'MQ==', limit: 1, total: 2816 },
		});
		expect(parsed.data[0]?.severityLevel).toBe('Warning');
		expect(parsed.pagination?.total).toBe(2816);
	});

	it('GET /tools/{toolUuid}/patterns/{patternId}', () => {
		const parsed = CodacyEndpointOutputSchemas.patternGet.parse({
			data: PATTERN,
		});
		expect(parsed.data.id).toBe('ESLint8_accessor-pairs');
	});

	it('GET /organizations/{provider}/{org}/repositories/{repo}', () => {
		const parsed =
			CodacyEndpointOutputSchemas.repositoryGet.parse(REPOSITORY_RESPONSE);
		expect(parsed.data.fullPath).toBe('codacy/codacy-analysis-cli');
		expect(parsed.data.defaultBranch).toMatchObject({ name: 'master' });
	});

	it('GET /analysis/organizations/{provider}/{org}/repositories/{repo}/tools', () => {
		const parsed = CodacyEndpointOutputSchemas.analysisConfigGet.parse(
			ANALYSIS_TOOLS_RESPONSE,
		);
		expect(parsed.data[0]?.settings).toMatchObject({ isEnabled: true });
	});
});
