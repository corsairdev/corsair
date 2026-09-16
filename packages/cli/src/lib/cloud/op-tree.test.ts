import { buildCloudDeclaration } from './op-tree';

describe('buildCloudDeclaration', () => {
	it('renders an empty tree', () => {
		expect(buildCloudDeclaration({}, 'corsair')).toBe(
			[
				'import "corsair";',
				'declare module "corsair" {',
				'\tinterface CorsairCloudRegistry {',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});

	it('merges ops sharing a dotted prefix under one nested field', () => {
		const out = buildCloudDeclaration(
			{ notion: ['pages.searchPage', 'pages.create'] },
			'corsair',
		);
		expect(out).toBe(
			[
				'import "corsair";',
				'declare module "corsair" {',
				'\tinterface CorsairCloudRegistry {',
				'\t\tnotion: {',
				'\t\t\tpages: {',
				'\t\t\t\tsearchPage(args?: any): Promise<any>;',
				'\t\t\t\tcreate(args?: any): Promise<any>;',
				'\t\t\t};',
				'\t\t};',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});

	it('renders a single top-level op with no dot as a direct method', () => {
		const out = buildCloudDeclaration({ health: ['ping'] }, 'corsair');
		expect(out).toBe(
			[
				'import "corsair";',
				'declare module "corsair" {',
				'\tinterface CorsairCloudRegistry {',
				'\t\thealth: {',
				'\t\t\tping(args?: any): Promise<any>;',
				'\t\t};',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});

	it('renders multiple plugins', () => {
		const out = buildCloudDeclaration(
			{ slack: ['messages.post'], linear: ['issues.create'] },
			'corsair',
		);
		expect(out).toBe(
			[
				'import "corsair";',
				'declare module "corsair" {',
				'\tinterface CorsairCloudRegistry {',
				'\t\tslack: {',
				'\t\t\tmessages: {',
				'\t\t\t\tpost(args?: any): Promise<any>;',
				'\t\t\t};',
				'\t\t};',
				'\t\tlinear: {',
				'\t\t\tissues: {',
				'\t\t\t\tcreate(args?: any): Promise<any>;',
				'\t\t\t};',
				'\t\t};',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});
});
