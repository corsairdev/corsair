import type { TOCItemType } from 'fumadocs-core/toc';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import apiExamples from '@/lib/plugin-api-examples.json';
import type { ApiOperation, SchemaShape } from '@/lib/plugin-catalog';
import {
	anchor,
	getPlugin,
	groupOperations,
	methodKey,
} from '@/lib/plugin-catalog';
import {
	isObjectLikeType,
	prettifyTypeBlock,
	resourceTitle,
	tableTypeDisplay,
} from '@/lib/plugin-type-format';

interface PageProps {
	params: Promise<{ plugin: string }>;
}

// Matches the MDX plugin pages these replaced: on-demand, cached an hour.
export const revalidate = 3600;

function SchemaTable({
	shape,
	kind,
}: {
	shape: SchemaShape;
	kind: 'Input' | 'Output';
}) {
	if (shape.kind === 'inline') {
		const display = tableTypeDisplay(shape.type);
		return (
			<>
				<p>
					<strong>{kind}:</strong> <code>{display}</code>
				</p>
				{isObjectLikeType(shape.type) ? (
					<Accordions type="multiple">
						<Accordion title={`${kind} full type`}>
							<DynamicCodeBlock
								lang="ts"
								code={prettifyTypeBlock(shape.type)}
							/>
						</Accordion>
					</Accordions>
				) : null}
			</>
		);
	}

	if (shape.fields.length === 0) {
		return (
			<p>
				<strong>{kind}:</strong> <em>empty object</em>
			</p>
		);
	}

	const nested = shape.fields.filter((f) => isObjectLikeType(f.type));

	return (
		<>
			<p>
				<strong>{kind}</strong>
			</p>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Required</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{shape.fields.map((f) => (
						<tr key={f.key}>
							<td>
								<code>{f.key}</code>
							</td>
							<td>
								<code>{tableTypeDisplay(f.type)}</code>
							</td>
							<td>{f.optional ? 'No' : 'Yes'}</td>
							<td>{f.description || '—'}</td>
						</tr>
					))}
				</tbody>
			</table>
			{nested.length > 0 ? (
				<Accordions type="multiple">
					{nested.map((f) => (
						<Accordion key={f.key} title={`${f.key} full type`}>
							<DynamicCodeBlock lang="ts" code={prettifyTypeBlock(f.type)} />
						</Accordion>
					))}
				</Accordions>
			) : null}
		</>
	);
}

function Operation({
	op,
	pluginId,
	examples,
}: {
	op: ApiOperation;
	pluginId: string;
	examples: Record<string, string>;
}) {
	const [, ...pathParts] = op.path.split('.');
	const args = examples[op.shortPath] ?? '{}';
	const call = `await corsair.${pluginId}.${pathParts.join('.')}(${args});`;

	return (
		<section>
			<h3 id={anchor(op.shortPath)}>{methodKey(op.shortPath)}</h3>
			<p>
				<code>{op.shortPath}</code>
			</p>
			{op.description ? <p>{op.description}</p> : null}
			{op.riskLevel ? (
				<p>
					<strong>Risk:</strong> <code>{op.riskLevel}</code>
					{op.irreversible ? (
						<>
							{' · '}
							<strong>Irreversible</strong>
						</>
					) : null}
				</p>
			) : null}
			<DynamicCodeBlock lang="ts" code={call} />
			<SchemaTable shape={op.input} kind="Input" />
			<SchemaTable shape={op.output} kind="Output" />
			<hr />
		</section>
	);
}

export default async function Page(props: PageProps) {
	const { plugin } = await props.params;
	const entry = getPlugin(plugin);
	if (!entry) notFound();

	const groups = groupOperations(entry.api);
	const examples: Record<string, string> =
		(apiExamples as Record<string, Record<string, string>>)[entry.id] ?? {};
	const toc: TOCItemType[] = groups.flatMap((g) => [
		{
			title: resourceTitle(g.group),
			url: `#${anchor(g.group)}`,
			depth: 2,
		},
		...g.operations.map((op) => ({
			title: methodKey(op.shortPath),
			url: `#${anchor(op.shortPath)}`,
			depth: 3,
		})),
	]);

	return (
		<DocsPage
			toc={toc}
			breadcrumb={{ enabled: false }}
			tableOfContent={{ style: 'block' }}
			tableOfContentPopover={{ style: 'block' }}
		>
			<DocsTitle>API</DocsTitle>
			<DocsDescription>
				{`API reference for ${entry.displayName}: every \`${entry.id}.api.*\` operation with input and output types.`}
			</DocsDescription>
			<DocsBody>
				<p>
					Every <code>{`${entry.id}.api.*`}</code> operation is listed below
					with parameter shapes and return types from the plugin Zod schemas.
				</p>
				<Callout type="info">
					<strong>New to Corsair?</strong> See{' '}
					<a href="/concepts/api">API access</a>,{' '}
					<a href="/concepts/auth">authentication</a>, and{' '}
					<a href="/concepts/error-handling">error handling</a>.
				</Callout>
				{groups.map((g) => (
					<section key={g.group}>
						<h2 id={anchor(g.group)}>{resourceTitle(g.group)}</h2>
						{g.operations.map((op) => (
							<Operation
								key={op.shortPath}
								op={op}
								pluginId={entry.id}
								examples={examples}
							/>
						))}
					</section>
				))}
			</DocsBody>
		</DocsPage>
	);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { plugin } = await props.params;
	const entry = getPlugin(plugin);
	if (!entry) notFound();

	return {
		title: `${entry.displayName} API`,
		description: `Every ${entry.id}.api.* operation with input and output types.`,
		alternates: { canonical: `/plugins/${entry.id}/api` },
	};
}
