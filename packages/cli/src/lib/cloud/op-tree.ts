interface OpTree {
	[key: string]: OpTree | true;
}
type OpNode = OpTree | true;

function insertOp(root: OpTree, op: string): void {
	const parts = op.split('.');
	let node = root;
	parts.forEach((part, i) => {
		if (i === parts.length - 1) {
			node[part] = true;
			return;
		}
		const existing = node[part];
		const child: OpTree = existing && existing !== true ? existing : {};
		node[part] = child;
		node = child;
	});
}

function buildOpTree(ops: string[]): OpTree {
	const root: OpTree = {};
	for (const op of ops) insertOp(root, op);
	return root;
}

function renderFields(tree: OpTree, indent: string): string {
	return Object.entries(tree)
		.map(([key, node]) =>
			node === true
				? `${indent}${key}(args?: any): Promise<any>;`
				: `${indent}${key}: {\n${renderFields(node, `${indent}\t`)}\n${indent}};`,
		)
		.join('\n');
}

/** Op-tree → a human-readable listing: plugin, then its ops indented. */
export function formatOpTree(pluginsOps: Record<string, string[]>): string {
	return Object.entries(pluginsOps)
		.map(
			([plugin, ops]) => `${plugin}\n${ops.map((op) => `  ${op}`).join('\n')}`,
		)
		.join('\n');
}

/** Op-tree → `.d.ts` text merging CorsairCloudRegistry via declaration merging. */
export function buildCloudDeclaration(
	pluginsOps: Record<string, string[]>,
	moduleSpecifier: string,
): string {
	const pluginFields = Object.entries(pluginsOps)
		.map(([plugin, ops]) => {
			const tree = buildOpTree(ops);
			return `\t\t${plugin}: {\n${renderFields(tree, '\t\t\t')}\n\t\t};`;
		})
		.join('\n');
	return [
		`import "${moduleSpecifier}";`,
		`declare module "${moduleSpecifier}" {`,
		'\tinterface CorsairCloudRegistry {',
		...(pluginFields ? [pluginFields] : []),
		'\t}',
		'}',
		'',
	].join('\n');
}
