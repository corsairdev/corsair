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
				'\t\t"notion": {',
				'\t\t\t"pages": {',
				'\t\t\t\t"searchPage"(args?: any): Promise<any>;',
				'\t\t\t\t"create"(args?: any): Promise<any>;',
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
				'\t\t"health": {',
				'\t\t\t"ping"(args?: any): Promise<any>;',
				'\t\t};',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});

	it('handles op segments that collide with Object.prototype keys', () => {
		// "toString" would resolve an inherited function on a plain-object map,
		// so a naive `children[part] ??= makeNode()` never assigns and crashes.
		const out = buildCloudDeclaration(
			{ meta: ['toString.create', 'constructor.get'] },
			'corsair',
		);
		expect(out).toContain('"toString": {');
		expect(out).toContain('"create"(args?: any): Promise<any>;');
		expect(out).toContain('"constructor": {');
		expect(out).toContain('"get"(args?: any): Promise<any>;');
	});

	it('keeps a terminal op alongside its nested ops regardless of order', () => {
		const forward = buildCloudDeclaration(
			{ users: ['users', 'users.list'] },
			'corsair',
		);
		const backward = buildCloudDeclaration(
			{ users: ['users.list', 'users'] },
			'corsair',
		);
		const expected = [
			'import "corsair";',
			'declare module "corsair" {',
			'\tinterface CorsairCloudRegistry {',
			'\t\t"users": {',
			'\t\t\t"users": ((args?: any) => Promise<any>) & {\n\t\t\t\t"list"(args?: any): Promise<any>;\n\t\t\t};',
			'\t\t};',
			'\t}',
			'}',
			'',
		].join('\n');
		expect(forward).toBe(expected);
		expect(backward).toBe(expected);
	});

	it('quotes generated keys that are not valid identifiers', () => {
		const out = buildCloudDeclaration(
			{ 'my-plugin': ['send-email'] },
			'corsair',
		);
		expect(out).toContain('"my-plugin": {');
		expect(out).toContain('"send-email"(args?: any): Promise<any>;');
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
				'\t\t"slack": {',
				'\t\t\t"messages": {',
				'\t\t\t\t"post"(args?: any): Promise<any>;',
				'\t\t\t};',
				'\t\t};',
				'\t\t"linear": {',
				'\t\t\t"issues": {',
				'\t\t\t\t"create"(args?: any): Promise<any>;',
				'\t\t\t};',
				'\t\t};',
				'\t}',
				'}',
				'',
			].join('\n'),
		);
	});
});
