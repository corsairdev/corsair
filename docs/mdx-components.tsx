import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { DbPanel, DbTabs } from '@/components/db-tabs';
import { FrameworkPanel, FrameworkTabs } from '@/components/framework-tabs';
import { KekGenerator } from '@/components/kek-generator';
import { PluginPromptBanner } from '@/components/plugin-prompt-banner';
import { PmTabs } from '@/components/pm-tabs';
import { SetupPromptBanner } from '@/components/setup-prompt-banner';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		Callout,
		Tabs,
		Tab,
		TypeTable,
		Steps,
		Step,
		Cards,
		Card,
		Accordions,
		Accordion,
		KekGenerator,
		FrameworkTabs,
		FrameworkPanel,
		DbTabs,
		DbPanel,
		SetupPromptBanner,
		PluginPromptBanner,
		PmTabs,
		...components,
	};
}
