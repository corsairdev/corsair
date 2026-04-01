import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { KekGenerator } from '@/components/kek-generator';
import { FrameworkTabs, FrameworkPanel } from '@/components/framework-tabs';
import { DbTabs, DbPanel } from '@/components/db-tabs';
import { SetupPromptBanner } from '@/components/setup-prompt-banner';
import { PmTabs } from '@/components/pm-tabs';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		// @ts-expect-error react version mismatch causing errors
		Callout,
		Tabs,
		Tab,
		TypeTable,
		Steps,
		Step,
		Cards,
		Card,
		// @ts-expect-error react version mismatch causing errors
		Accordions,
		// @ts-expect-error react version mismatch causing errors
		Accordion,
		KekGenerator,
		FrameworkTabs,
		FrameworkPanel,
		DbTabs,
		DbPanel,
		SetupPromptBanner,
		PmTabs,
		...components,
	};
}
