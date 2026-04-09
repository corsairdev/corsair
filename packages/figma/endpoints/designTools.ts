import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const discoverResources: FigmaEndpoints['designToolsDiscoverResources'] =
	async (ctx, input) => {
		// any: discovered resource structure depends on resource type
		const files: unknown[] = [];
		// any: discovered resource structure depends on resource type
		const projects: unknown[] = [];
		// any: discovered resource structure depends on resource type
		const teams: unknown[] = [];

		if (input.file_key) {
			try {
				const fileResult = await makeFigmaRequest<{
					name?: string;
					role?: string;
				}>(`v1/files/${input.file_key}`, ctx.key, {
					method: 'GET',
					query: { depth: input.max_depth },
				});
				files.push({ key: input.file_key, ...fileResult });
			} catch (error) {
				console.warn('Failed to fetch file during discoverResources:', error);
			}
		}

		if (input.project_id) {
			try {
				const projectResult = await makeFigmaRequest<{
					name?: string;
					// unknown: project file list items have dynamic structure per Figma API response
					files?: unknown[];
				}>(`v1/projects/${input.project_id}/files`, ctx.key, { method: 'GET' });
				projects.push({ id: input.project_id, ...projectResult });
				if (projectResult.files) {
					files.push(...projectResult.files);
				}
			} catch (error) {
				console.warn(
					'Failed to fetch project during discoverResources:',
					error,
				);
			}
		}

		if (input.team_id) {
			try {
				const teamResult = await makeFigmaRequest<{
					name?: string;
					// unknown: team project list items have dynamic structure per Figma API response
					projects?: unknown[];
				}>(`v1/teams/${input.team_id}/projects`, ctx.key, { method: 'GET' });
				teams.push({ id: input.team_id, ...teamResult });
				if (teamResult.projects) {
					projects.push(...teamResult.projects);
				}
			} catch (error) {
				console.warn('Failed to fetch team during discoverResources:', error);
			}
		}

		const result: FigmaEndpointOutputs['designToolsDiscoverResources'] = {
			files,
			projects,
			teams,
		};

		await logEventFromContext(
			ctx,
			'figma.designTools.discoverResources',
			{ ...input },
			'completed',
		);
		return result;
	};

export const extractDesignTokens: FigmaEndpoints['designToolsExtractDesignTokens'] =
	async (ctx, input) => {
		// any: design token structure varies by token type (color, typography, spacing, etc.)
		const tokens: Record<string, unknown> = {};

		if (input.include_variables) {
			try {
				const variablesResult = await makeFigmaRequest<{
					meta?: {
						variables?: Record<string, unknown>;
						variableCollections?: Record<string, unknown>;
					};
				}>(`v1/files/${input.file_key}/variables/local`, ctx.key, {
					method: 'GET',
				});
				if (variablesResult.meta?.variables) {
					tokens['variables'] = variablesResult.meta.variables;
				}
				if (variablesResult.meta?.variableCollections) {
					tokens['variableCollections'] =
						variablesResult.meta.variableCollections;
				}
			} catch (error) {
				console.warn(
					'Failed to fetch variables during extractDesignTokens:',
					error,
				);
			}
		}

		if (input.include_local_styles) {
			try {
				const stylesResult = await makeFigmaRequest<{
					// unknown: style items within meta have dynamic properties not fully typed by Figma API
					meta?: { styles?: unknown[] };
				}>(`v1/files/${input.file_key}/styles`, ctx.key, { method: 'GET' });
				if (stylesResult.meta?.styles) {
					tokens['styles'] = stylesResult.meta.styles;
				}
			} catch (error) {
				console.warn(
					'Failed to fetch styles during extractDesignTokens:',
					error,
				);
			}
		}

		if (input.extract_from_nodes) {
			try {
				const nodesResult = await makeFigmaRequest<{
					nodes?: Record<string, unknown>;
				}>(`v1/files/${input.file_key}/nodes`, ctx.key, {
					method: 'GET',
					query: { ids: input.extract_from_nodes },
				});
				if (nodesResult.nodes) {
					tokens['nodes'] = nodesResult.nodes;
				}
			} catch (error) {
				console.warn(
					'Failed to fetch nodes during extractDesignTokens:',
					error,
				);
			}
		}

		const result: FigmaEndpointOutputs['designToolsExtractDesignTokens'] = {
			tokens,
		};

		await logEventFromContext(
			ctx,
			'figma.designTools.extractDesignTokens',
			{ ...input },
			'completed',
		);
		return result;
	};

export const extractPrototypeInteractions: FigmaEndpoints['designToolsExtractPrototypeInteractions'] =
	async (ctx, input) => {
		// any: prototype interaction and flow structure varies by interaction type
		const interactions: unknown[] = [];
		// any: prototype interaction and flow structure varies by interaction type
		const flows: unknown[] = [];

		try {
			const fileResult = await makeFigmaRequest<{
				// any: Figma document tree has recursive node structure
				document?: unknown;
				// any: prototype flow data is deeply nested within document nodes
				prototype_start_node_id?: string;
				// unknown: flow items have dynamic nested structure with prototype interaction data
				flows?: unknown[];
			}>(`v1/files/${input.file_key}`, ctx.key, {
				method: 'GET',
				query: {
					geometry: 'paths',
				},
			});

			if (fileResult.flows) {
				flows.push(...fileResult.flows);
			}

			if (fileResult.document) {
				interactions.push({
					source: 'document',
					// any: document tree contains nested prototype interaction triggers
					data: fileResult.document,
				});
			}
		} catch (error) {
			console.warn(
				'Failed to fetch file document during extractPrototypeInteractions:',
				error,
			);
		}

		const result: FigmaEndpointOutputs['designToolsExtractPrototypeInteractions'] =
			{
				interactions,
				flows,
			};

		await logEventFromContext(
			ctx,
			'figma.designTools.extractPrototypeInteractions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const downloadImages: FigmaEndpoints['designToolsDownloadImages'] =
	async (ctx, input) => {
		const nodeIds = input.images.map((img) => img.node_id).join(',');

		const renderResult = await makeFigmaRequest<{
			images?: Record<string, string | null>;
		}>(`v1/images/${input.file_key}`, ctx.key, {
			method: 'GET',
			query: {
				ids: nodeIds,
				scale: input.scale,
				svg_include_id: input.svg_include_id,
				svg_outline_text: input.svg_outline_text,
				svg_simplify_stroke: input.svg_simplify_stroke,
			},
		});

		const result: FigmaEndpointOutputs['designToolsDownloadImages'] = {
			images: renderResult.images,
		};

		await logEventFromContext(
			ctx,
			'figma.designTools.downloadImages',
			{ ...input },
			'completed',
		);
		return result;
	};

export const designTokensToTailwind: FigmaEndpoints['designToolsDesignTokensToTailwind'] =
	async (ctx, input) => {
		// any: token input map has dynamic keys and values
		const tokenEntries = Object.entries(input.tokens);
		const prefix = input.prefix ?? '';

		const colorTokens: Record<string, string> = {};
		const spacingTokens: Record<string, string> = {};
		const fontSizeTokens: Record<string, string> = {};
		const fontFamilyTokens: Record<string, string> = {};
		const borderRadiusTokens: Record<string, string> = {};

		for (const [key, value] of tokenEntries) {
			const tokenKey = prefix ? `${prefix}-${key}` : key;
			if (typeof value === 'object' && value !== null && 'type' in value) {
				// any: token value can have type field with string or other shape
				const tokenValue = value as Record<string, unknown>;
				const tokenType = tokenValue['type'];
				const tokenVal = tokenValue['value'];
				if (tokenType === 'color' && typeof tokenVal === 'string') {
					colorTokens[tokenKey] = tokenVal;
				} else if (tokenType === 'spacing' && typeof tokenVal === 'string') {
					spacingTokens[tokenKey] = tokenVal;
				} else if (tokenType === 'fontSize' && typeof tokenVal === 'string') {
					fontSizeTokens[tokenKey] = tokenVal;
				} else if (tokenType === 'fontFamily' && typeof tokenVal === 'string') {
					fontFamilyTokens[tokenKey] = tokenVal;
				} else if (
					tokenType === 'borderRadius' &&
					typeof tokenVal === 'string'
				) {
					borderRadiusTokens[tokenKey] = tokenVal;
				}
			}
		}

		const configFormat = input.config_format ?? 'cjs';
		const themeExtend = {
			colors: colorTokens,
			spacing: spacingTokens,
			fontSize: fontSizeTokens,
			fontFamily: fontFamilyTokens,
			borderRadius: borderRadiusTokens,
		};

		const themeJson = JSON.stringify(themeExtend, null, 2);
		let config: string;
		if (configFormat === 'esm') {
			config = `export default {\n  theme: {\n    extend: ${themeJson}\n  }\n};\n`;
		} else {
			config = `module.exports = {\n  theme: {\n    extend: ${themeJson}\n  }\n};\n`;
		}

		const cssLines: string[] = [':root {'];
		for (const [key, value] of Object.entries(colorTokens)) {
			cssLines.push(`  --color-${key}: ${value};`);
		}
		for (const [key, value] of Object.entries(spacingTokens)) {
			cssLines.push(`  --spacing-${key}: ${value};`);
		}
		cssLines.push('}');
		const css = cssLines.join('\n') + '\n';

		const result: FigmaEndpointOutputs['designToolsDesignTokensToTailwind'] = {
			config,
			css,
		};

		await logEventFromContext(
			ctx,
			'figma.designTools.designTokensToTailwind',
			{ file_key: 'transform' },
			'completed',
		);
		return result;
	};
