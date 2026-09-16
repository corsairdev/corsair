interface OpNode {
	call: boolean;
	children: Record<string, OpNode>;
}

function makeNode(): OpNode {
	return { call: false, children: {} };
}

function insertOp(root: Record<string, OpNode>, op: string): void {
	const parts = op.split('.');
	let children = root;
	parts.forEach((part, i) => {
		const node = (children[part] ??= makeNode());
		if (i === parts.length - 1) {
			node.call = true;
		} else {
			children = node.children;
		}
	});
}

function buildOpTree(ops: string[]): Record<string, OpNode> {
	const root: Record<string, OpNode> = {};
	for (const op of ops) insertOp(root, op);
	return root;
}

function renderFields(tree: Record<string, OpNode>, indent: string): string {
	return Object.entries(tree)
		.map(([key, node]) => {
			const name = JSON.stringify(key);
			const hasChildren = Object.keys(node.children).length > 0;
			if (node.call && !hasChildren) {
				return `${indent}${name}(args?: any): Promise<any>;`;
			}
			const body = `{\n${renderFields(node.children, `${indent}\t`)}\n${indent}}`;
			if (!node.call) return `${indent}${name}: ${body};`;
			// terminal op that also has nested ops (e.g. "users" and "users.list")
			return `${indent}${name}: ((args?: any) => Promise<any>) & ${body};`;
		})
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
			return `\t\t${JSON.stringify(plugin)}: {\n${renderFields(tree, '\t\t\t')}\n\t\t};`;
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
