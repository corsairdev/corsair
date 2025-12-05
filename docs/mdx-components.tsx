import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		Callout,
		Tabs,
		Tab,
		TypeTable,
		...components,
	};
}
