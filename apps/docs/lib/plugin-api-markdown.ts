import apiExamples from './plugin-api-examples.json';
import type { PluginCatalogEntry, SchemaShape } from './plugin-catalog';
import { groupOperations, methodKey } from './plugin-catalog';
import {
	isObjectLikeType,
	prettifyTypeBlock,
	resourceTitle,
	tableTypeDisplay,
} from './plugin-type-format';

function escapeCell(s: string | undefined): string {
	if (!s) return '';
	return s
		.replace(/\\/g, '\\\\')
		.replace(/\|/g, '\\|')
		.replace(/\r?\n/g, '<br />');
}

function schemaSection(shape: SchemaShape, kind: 'Input' | 'Output'): string {
	if (shape.kind === 'inline') {
		const display = escapeCell(tableTypeDisplay(shape.type));
		const full = isObjectLikeType(shape.type)
			? `\n\`\`\`ts\n${prettifyTypeBlock(shape.type)}\n\`\`\`\n`
			: '';
		return `**${kind}:** \`${display}\`\n${full}`;
	}
	if (shape.fields.length === 0) return `**${kind}:** _empty object_\n`;

	const rows = shape.fields
		.map(
			(f) =>
				`| \`${escapeCell(f.key)}\` | \`${escapeCell(tableTypeDisplay(f.type))}\` | ${f.optional ? 'No' : 'Yes'} | ${escapeCell(f.description) || '—'} |`,
		)
		.join('\n');
	const full = shape.fields
		.filter((f) => isObjectLikeType(f.type))
		.map(
			(f) =>
				`\n${f.key} full type:\n\n\`\`\`ts\n${prettifyTypeBlock(f.type)}\n\`\`\`\n`,
		)
		.join('');

	return `**${kind}**\n\n| Name | Type | Required | Description |\n|------|------|----------|-------------|\n${rows}\n${full}`;
}

/** The `.md` twin of the plugin API route, which has no file to read. */
export function renderApiMarkdown(entry: PluginCatalogEntry): string {
	const examples: Record<string, string> =
		(apiExamples as Record<string, Record<string, string>>)[entry.id] ?? {};

	const body = groupOperations(entry.api)
		.map(({ group, operations }) => {
			const ops = operations
				.map((op) => {
					const [, ...pathParts] = op.path.split('.');
					const args = examples[op.shortPath] ?? '{}';
					const risk = op.riskLevel
						? `\n\n**Risk:** \`${op.riskLevel}\`${op.irreversible ? ' · **Irreversible**' : ''}`
						: '';
					const desc = op.description ? `\n\n${op.description}` : '';
					return [
						`### ${methodKey(op.shortPath)}`,
						'',
						`\`${op.shortPath}\`${desc}${risk}`,
						'',
						'```ts',
						`await corsair.${entry.id}.${pathParts.join('.')}(${args});`,
						'```',
						'',
						schemaSection(op.input, 'Input'),
						schemaSection(op.output, 'Output'),
						'---',
						'',
					].join('\n');
				})
				.join('\n');
			return `## ${resourceTitle(group)}\n\n${ops}`;
		})
		.join('\n');

	return `# API\n\nAPI reference for ${entry.displayName}: every \`${entry.id}.api.*\` operation with input and output types.\n\n${body}`;
}
