import {
	Accordion as FdAccordion,
	Accordions,
} from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { GenerateKEK } from './generate-kek';
import { WindowsEnvVarsNote, WindowsMigrationNote } from './windows-shell';

/** Fumadocs Accordion is an item — wrap lone usage so ported Mintlify pages don't 500. */
function Accordion(props: ComponentProps<typeof FdAccordion>) {
	return (
		<Accordions type="single" collapsible>
			<FdAccordion {...props} />
		</Accordions>
	);
}

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		Accordion,
		Accordions,
		Callout,
		Card,
		Cards,
		GenerateKEK,
		Step,
		Steps,
		Tab,
		Tabs,
		WindowsEnvVarsNote,
		WindowsMigrationNote,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
