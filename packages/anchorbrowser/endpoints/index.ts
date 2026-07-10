import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AgentEndpoints } from './agent';
import { BatchSessionsEndpoints } from './batch-sessions';
import { DownloadsEndpoints } from './downloads';
import { EventsEndpoints } from './events';
import { ExtensionsEndpoints } from './extensions';
import { IntegrationsEndpoints } from './integrations';
import { OsLevelEndpoints } from './os-level';
import { PagesEndpoints } from './pages';
import { ProfilesEndpoints } from './profiles';
import { RecordingsEndpoints } from './recordings';
import { anchorBrowserRoutes } from './routes';
import { ScreenshotsEndpoints } from './screenshots';
import { SessionsEndpoints } from './sessions';
import { TasksEndpoints } from './tasks';
import { ToolsEndpoints } from './tools';
import {
	AnchorBrowserEndpointInputSchemas,
	AnchorBrowserEndpointOutputSchemas,
} from './types';
import { UploadsEndpoints } from './uploads';

export const anchorBrowserEndpointsNested = {
	agent: AgentEndpoints,
	batchSessions: BatchSessionsEndpoints,
	downloads: DownloadsEndpoints,
	events: EventsEndpoints,
	extensions: ExtensionsEndpoints,
	integrations: IntegrationsEndpoints,
	osLevel: OsLevelEndpoints,
	pages: PagesEndpoints,
	profiles: ProfilesEndpoints,
	recordings: RecordingsEndpoints,
	screenshots: ScreenshotsEndpoints,
	sessions: SessionsEndpoints,
	tasks: TasksEndpoints,
	tools: ToolsEndpoints,
	uploads: UploadsEndpoints,
} as const;

export const anchorBrowserEndpointMeta = Object.fromEntries(
	anchorBrowserRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
	// Object.fromEntries loses the literal endpoint-meta shape; cast satisfies RequiredPluginEndpointMeta.
) as RequiredPluginEndpointMeta<typeof anchorBrowserEndpointsNested>;

export const anchorBrowserEndpointSchemas = Object.fromEntries(
	anchorBrowserRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: AnchorBrowserEndpointInputSchemas[route.key],
			output: AnchorBrowserEndpointOutputSchemas[route.key],
		},
	]),
);

export {
	AnchorBrowserEndpointInputSchemas,
	AnchorBrowserEndpointOutputSchemas,
};
export * from './routes';
export * from './types';
