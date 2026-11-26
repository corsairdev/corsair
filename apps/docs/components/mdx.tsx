import {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
} from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from './mermaid';
import { mintlifyComponents } from './mintlify';

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		CodeBlockTab,
		CodeBlockTabs,
		CodeBlockTabsList,
		CodeBlockTabsTrigger,
		Mermaid,
		...mintlifyComponents,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
