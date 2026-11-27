import {
	Accordion as FdAccordion,
	Accordions as FdAccordions,
} from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card as FdCard, Cards as FdCards } from 'fumadocs-ui/components/card';
import { Step as FdStep, Steps as FdSteps } from 'fumadocs-ui/components/steps';
import { Tab as FdTab, Tabs as FdTabs } from 'fumadocs-ui/components/tabs';
import type { LucideIcon } from 'lucide-react';
import {
	ArrowRight,
	Atom,
	Bolt,
	BookOpen,
	Bot,
	Code,
	CornerDownRight,
	Grip,
	Layers,
	Link as LinkIcon,
	Play,
	Rocket,
	Search,
	Server,
	Sparkles,
	Table2,
	Users,
	Workflow,
} from 'lucide-react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

/**
 * Mintlify's MDX components, rendered with Fumadocs UI, so docs/ reads the
 * same on both sites. Only the props docs/ uses are supported; see
 * lib/remark-mintlify.ts for the parts handled at compile time.
 */

// Font Awesome names Mintlify takes, mapped to the closest Lucide icon.
const ICONS: Record<string, LucideIcon> = {
	'arrows-turn-right': CornerDownRight,
	bolt: Bolt,
	book: BookOpen,
	code: Code,
	'diagram-project': Workflow,
	grip: Grip,
	'layer-group': Layers,
	link: LinkIcon,
	'magnifying-glass': Search,
	play: Play,
	react: Atom,
	robot: Bot,
	rocket: Rocket,
	server: Server,
	sparkles: Sparkles,
	'table-columns': Table2,
	users: Users,
};

function icon(name: string | undefined): ReactNode {
	if (!name) return undefined;
	if (name.startsWith('/') || name.startsWith('http'))
		return <img src={name} alt="" className="size-4" />;
	const Icon = ICONS[name] ?? ArrowRight;
	return <Icon />;
}

export function Card({
	title,
	icon: iconName,
	href,
	children,
}: {
	title: string;
	icon?: string;
	href?: string;
	children?: ReactNode;
}) {
	return (
		<FdCard title={title} icon={icon(iconName)} href={href}>
			{children}
		</FdCard>
	);
}

export function CardGroup({
	cols = 2,
	children,
}: {
	cols?: number;
	children?: ReactNode;
}) {
	return (
		<FdCards
			className="mint-cards"
			style={{ '--mint-cols': cols } as CSSProperties}
		>
			{children}
		</FdCards>
	);
}

type TitledElement = ReactElement<{ title?: string }>;

export function Tabs({ children }: { children?: ReactNode }) {
	const tabs = Children.toArray(children).filter(
		isValidElement,
	) as TitledElement[];
	const items = tabs.map((t, i) => t.props.title ?? `Tab ${i + 1}`);
	return <FdTabs items={items}>{children}</FdTabs>;
}

export function Tab({
	title,
	children,
}: {
	title?: string;
	children?: ReactNode;
}) {
	return <FdTab value={title}>{children}</FdTab>;
}

export function Steps({ children }: { children?: ReactNode }) {
	return <FdSteps>{children}</FdSteps>;
}

export function Step({
	title,
	children,
}: {
	title?: string;
	children?: ReactNode;
}) {
	return (
		<FdStep>
			{title ? <p className="mint-step-title">{title}</p> : null}
			{children}
		</FdStep>
	);
}

export function AccordionGroup({ children }: { children?: ReactNode }) {
	return (
		<FdAccordions type="multiple" className="mint-accordions">
			{children}
		</FdAccordions>
	);
}

export function Accordion({
	title,
	defaultOpen: _defaultOpen,
	children,
}: {
	title: string;
	defaultOpen?: boolean;
	children?: ReactNode;
}) {
	return <FdAccordion title={title}>{children}</FdAccordion>;
}

/** remark-mintlify turns its code blocks into tabs; this only groups them. */
export function CodeGroup({ children }: { children?: ReactNode }) {
	return <>{children}</>;
}

export const Note = (p: { children?: ReactNode }) => (
	<Callout type="info" {...p} />
);
export const Info = (p: { children?: ReactNode }) => (
	<Callout type="info" {...p} />
);
export const Tip = (p: { children?: ReactNode }) => (
	<Callout type="idea" {...p} />
);
export const Warning = (p: { children?: ReactNode }) => (
	<Callout type="warning" {...p} />
);
export const Danger = (p: { children?: ReactNode }) => (
	<Callout type="error" {...p} />
);
export const Check = (p: { children?: ReactNode }) => (
	<Callout type="success" {...p} />
);

function Field({
	name,
	type,
	required,
	defaultValue,
	children,
}: {
	name?: string;
	type?: string;
	required?: boolean;
	defaultValue?: string;
	children?: ReactNode;
}) {
	return (
		<div className="mint-field">
			<div className="mint-field-head">
				{name ? <code className="mint-field-name">{name}</code> : null}
				{type ? <span className="mint-field-type">{type}</span> : null}
				{required ? (
					<span className="mint-field-required">required</span>
				) : null}
				{defaultValue !== undefined ? (
					<span className="mint-field-type">
						default: {String(defaultValue)}
					</span>
				) : null}
			</div>
			{children ? <div className="mint-field-body">{children}</div> : null}
		</div>
	);
}

export function ParamField(props: {
	path?: string;
	body?: string;
	query?: string;
	header?: string;
	type?: string;
	required?: boolean;
	default?: string;
	children?: ReactNode;
}) {
	return (
		<Field
			name={props.path ?? props.body ?? props.query ?? props.header}
			type={props.type}
			required={props.required}
			defaultValue={props.default}
		>
			{props.children}
		</Field>
	);
}

export function ResponseField(props: {
	name?: string;
	type?: string;
	required?: boolean;
	default?: string;
	children?: ReactNode;
}) {
	return (
		<Field
			name={props.name}
			type={props.type}
			required={props.required}
			defaultValue={props.default}
		>
			{props.children}
		</Field>
	);
}

export function Frame({
	children,
	caption,
}: {
	children?: ReactNode;
	caption?: string;
}) {
	return (
		<figure className="mint-frame">
			{children}
			{caption ? <figcaption>{caption}</figcaption> : null}
		</figure>
	);
}

export const mintlifyComponents = {
	Accordion,
	AccordionGroup,
	Card,
	CardGroup,
	Check,
	CodeGroup,
	Danger,
	Frame,
	Info,
	Note,
	ParamField,
	ResponseField,
	Step,
	Steps,
	Tab,
	Tabs,
	Tip,
	Warning,
};
