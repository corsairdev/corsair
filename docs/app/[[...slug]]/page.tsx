import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import IntroductionDoc from "@/content/0-getting-started/0-introduction.mdx";
import InstallationDoc from "@/content/0-getting-started/1-installation.mdx";
import BasicUsageDoc from "@/content/0-getting-started/2-basic-usage.mdx";
import ApiDoc from "@/content/1-concepts/0-api.mdx";
import ClientDoc from "@/content/1-concepts/1-client.mdx";
import CliDoc from "@/content/1-concepts/2-cli.mdx";
import PluginsDoc from "@/content/1-concepts/3-plugins.mdx";
import DatabaseDoc from "@/content/1-concepts/4-database.mdx";
import TypescriptDoc from "@/content/1-concepts/5-typescript.mdx";
import NextDoc from "@/content/2-integrations/0-next.mdx";
import ViteDoc from "@/content/2-integrations/1-vite.mdx";
import HonoDoc from "@/content/2-integrations/2-hono.mdx";
import PrismaDoc from "@/content/2-integrations/3-prisma.mdx";
import DrizzleDoc from "@/content/2-integrations/4-drizzle.mdx";
import SlackDoc from "@/content/3-plugins/slack.mdx";
import { extractTOC } from "@/lib/toc";
import { useMDXComponents } from "@/mdx-components";

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

const pages = {
	index: {
		Component: IntroductionDoc,
		title: "Introduction",
		description:
			"The Vibe Coding SDK - Build type-safe full-stack TypeScript apps with natural language",
	},
	installation: {
		Component: InstallationDoc,
		title: "Installation",
		description: "Install Corsair in your Next.js + Drizzle + Postgres project",
	},
	"basic-usage": {
		Component: BasicUsageDoc,
		title: "Basic Usage",
		description: "Setting up the client, queries, mutations, and callbacks",
	},
	api: {
		Component: ApiDoc,
		title: "API Concepts",
		description: "Understanding the Corsair approach to natural language APIs",
	},
	client: {
		Component: ClientDoc,
		title: "Client Concepts",
		description: "Fully typed React hooks powered by TanStack Query",
	},
	cli: {
		Component: CliDoc,
		title: "CLI Concepts",
		description: "Agent-first development with Corsair CLI",
	},
	plugins: {
		Component: PluginsDoc,
		title: "Plugin Concepts",
		description:
			"Extend Corsair beyond the database with third-party integrations",
	},
	database: {
		Component: DatabaseDoc,
		title: "Database Concepts",
		description: "Supported databases, ORMs, and schema detection",
	},
	typescript: {
		Component: TypescriptDoc,
		title: "TypeScript Concepts",
		description: "Full end-to-end type safety from database to UI",
	},
	"integrations/next": {
		Component: NextDoc,
		title: "Next.js",
		description: "Integrate Corsair with Next.js App Router and Pages Router",
	},
	"integrations/vite": {
		Component: ViteDoc,
		title: "Vite",
		description:
			"Use Corsair with Vite for fast development and optimized builds",
	},
	"integrations/hono": {
		Component: HonoDoc,
		title: "Hono",
		description:
			"Integrate Corsair with Hono for lightweight, edge-compatible APIs",
	},
	"integrations/prisma": {
		Component: PrismaDoc,
		title: "Prisma",
		description:
			"Integrate Corsair with Prisma for type-safe database operations",
	},
	"integrations/drizzle": {
		Component: DrizzleDoc,
		title: "Drizzle",
		description:
			"Use Corsair with Drizzle ORM for type-safe database operations",
	},
	"plugins/slack": {
		Component: SlackDoc,
		title: "Slack",
		description:
			"Enable natural language queries and mutations for Slack operations",
	},
} as const;

const mdxComponents = useMDXComponents();

export default async function Page(props: PageProps) {
	const params = await props.params;
	const slugKey = (params.slug?.join("/") || "index") as keyof typeof pages;
	const page = pages[slugKey];

	if (!page) {
		notFound();
	}

	const MDX = page.Component;
	const toc = extractTOC(slugKey);

	return (
		<DocsPage
			toc={toc}
			tableOfContent={{
				enabled: true,
				style: "clerk",
				single: false,
			}}
		>
			<h1 className="text-3xl font-bold mb-2">{page.title}</h1>
			{page.description && (
				<p className="text-lg text-muted-foreground mb-8">{page.description}</p>
			)}
			<DocsBody>
				<MDX components={mdxComponents} />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return Object.keys(pages).map((slug) => ({
		slug: slug === "index" ? undefined : slug.split("/"),
	}));
}

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	const slugKey = (params.slug?.join("/") || "index") as keyof typeof pages;
	const page = pages[slugKey];

	if (!page) notFound();

	return {
		title: page.title,
		description: page.description,
	};
}
