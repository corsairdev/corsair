import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { OpenAPIPage } from './openapi-page';

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		OpenAPIPage,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
