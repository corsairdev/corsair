/**
 * This is the main entry point for the Stitch plugin.
 * It defines the plugin structure, endpoints, and configuration options.
 *
 * Note on Webhooks:
 * Currently, the Stitch API does not support webhooks. The `pluginWebhookMatcher`
 * returns `false` to indicate that no incoming requests should be treated as webhooks
 * for this plugin. This can be revisited if the Stitch API adds webhook support in the future.
 */

import type {
  CorsairEndpoint,
  CorsairPlugin,
  CorsairPluginContext,
  KeyBuilderContext,
  RequiredPluginEndpointMeta,
  RawWebhookRequest,
} from 'corsair/core';
import type { AuthTypes, PickAuth } from 'corsair/core';
import { Projects, Screens, DesignSystems } from './endpoints';
import type { StitchEndpointInputs, StitchEndpointOutputs } from './endpoints/types';
import { StitchSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type StitchPluginOptions = {
  authType?: PickAuth<'api_key'>;
  key?: string;
};

export type StitchContext = CorsairPluginContext<
  typeof StitchSchema,
  StitchPluginOptions
>;

export type StitchKeyBuilderContext = KeyBuilderContext<StitchPluginOptions>;

type StitchEndpoint<K extends keyof StitchEndpointOutputs> = CorsairEndpoint<
  StitchContext,
  StitchEndpointInputs[K],
  StitchEndpointOutputs[K]
>;

export type StitchEndpoints = {
  projectsList: StitchEndpoint<'projectsList'>;
  projectsGet: StitchEndpoint<'projectsGet'>;
  projectsCreate: StitchEndpoint<'projectsCreate'>;
  projectsGenerateScreen: StitchEndpoint<'projectsGenerateScreen'>;
  screensList: StitchEndpoint<'screensList'>;
  screensGet: StitchEndpoint<'screensGet'>;
  screensEdit: StitchEndpoint<'screensEdit'>;
  screensGenerateVariants: StitchEndpoint<'screensGenerateVariants'>;
  designSystemsCreate: StitchEndpoint<'designSystemsCreate'>;
  designSystemsUpdate: StitchEndpoint<'designSystemsUpdate'>;
  designSystemsApply: StitchEndpoint<'designSystemsApply'>;
};

const stitchEndpointsNested = {
  projects: {
    list: Projects.list,
    get: Projects.get,
    create: Projects.create,
    generateScreen: Projects.generateScreen,
  },
  screens: {
    list: Screens.list,
    get: Screens.get,
    edit: Screens.edit,
    generateVariants: Screens.generateVariants,
  },
  designSystems: {
    create: DesignSystems.create,
    update: DesignSystems.update,
    apply: DesignSystems.apply,
  },
} as const;

const stitchEndpointMeta = {
  'projects.list': { riskLevel: 'read', description: 'List all Stitch projects' },
  'projects.get': { riskLevel: 'read', description: 'Get details for a specific project' },
  'projects.create': { riskLevel: 'write', description: 'Create a new Stitch project' },
  'projects.generateScreen': { riskLevel: 'write', description: 'Generate a new screen from a text prompt' },
  'screens.list': { riskLevel: 'read', description: 'List all screens in a project' },
  'screens.get': { riskLevel: 'read', description: 'Get details for a specific screen' },
  'screens.edit': { riskLevel: 'write', description: 'Modify existing screens using a text prompt' },
  'screens.generateVariants': { riskLevel: 'write', description: 'Generate variations of existing screens' },
  'designSystems.create': { riskLevel: 'write', description: 'Create a new design system' },
  'designSystems.update': { riskLevel: 'write', description: 'Update an existing design system' },
  'designSystems.apply': { riskLevel: 'write', description: 'Apply a design system to project screens' },
} satisfies RequiredPluginEndpointMeta<typeof stitchEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export type BaseStitchPlugin<T extends StitchPluginOptions> = CorsairPlugin<
  'stitch',
  typeof StitchSchema,
  typeof stitchEndpointsNested,
  {},
  T,
  typeof defaultAuthType
>;

export type InternalStitchPlugin = BaseStitchPlugin<StitchPluginOptions>;
export type ExternalStitchPlugin<T extends StitchPluginOptions> = BaseStitchPlugin<T>;

export function stitch<const T extends StitchPluginOptions>(
  incomingOptions: StitchPluginOptions & T = {} as StitchPluginOptions & T,
): ExternalStitchPlugin<T> {
  const options = {
    ...incomingOptions,
    authType: incomingOptions.authType ?? defaultAuthType,
  };

  return {
    id: 'stitch',
    schema: StitchSchema,
    options: options,
    endpoints: stitchEndpointsNested,
    webhooks: {},
    endpointMeta: stitchEndpointMeta,
    errorHandlers: errorHandlers,
    pluginWebhookMatcher: (_request: RawWebhookRequest) => {
      return false;
    },
    keyBuilder: async (ctx: StitchKeyBuilderContext) => {
      if (options.key) return options.key;
      const res = await ctx.keys.get_api_key();
      if (!res) throw new Error('Stitch API key not found');
      return res;
    },
  } satisfies InternalStitchPlugin;
}

export * from './schema';
export * from './endpoints';
export * from './client';
