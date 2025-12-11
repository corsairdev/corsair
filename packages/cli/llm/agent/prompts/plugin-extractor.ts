import { Project, SyntaxKind, type FunctionDeclaration } from 'ts-morph';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Config } from '../../../commands/config.js';

type PluginMethod = {
	name: string;
	input: string;
	output: string;
	description?: string;
};

type PluginInfo = {
	name: string;
	configured: boolean;
	configDetails?: {
		hasToken?: boolean;
		channels?: string[];
		members?: string[];
	};
	methods: PluginMethod[];
	configInstructions?: string;
};

function getPluginsPath(): string {
	try {
		const cwd = process.cwd();
		const nodeModulesPath = join(cwd, 'node_modules', 'corsair', 'plugins');
		if (existsSync(nodeModulesPath)) {
			return nodeModulesPath;
		}

		const packagePath = join(cwd, 'packages', 'corsair', 'plugins');
		if (existsSync(packagePath)) {
			return packagePath;
		}

		const currentFileDir = dirname(fileURLToPath(import.meta.url));
		const relativePluginsPath = join(
			currentFileDir,
			'../../../../corsair/plugins',
		);
		if (existsSync(relativePluginsPath)) {
			return relativePluginsPath;
		}

		throw new Error('Could not find corsair plugins directory');
	} catch (error) {
		throw new Error(`Failed to locate plugins: ${error}`);
	}
}

function extractMethodSignature(
	funcDecl: FunctionDeclaration,
): { input: string; output: string } | null {
	try {
		const params = funcDecl.getParameters();
		if (params.length === 0) {
			return { input: '{}', output: 'void' };
		}

		const firstParam = params[0];
		if (!firstParam) {
			return null;
		}

		const paramType = firstParam.getType();
		const typeText = paramType.getText();

		const objectMatch = typeText.match(/\{\s*config[^}]*;\s*([^}]+)\s*\}/s);
		if (objectMatch && objectMatch[1]) {
			const paramsWithoutConfig = objectMatch[1]
				.trim()
				.split(';')
				.map((p) => p.trim())
				.filter((p) => p.length > 0)
				.join('; ');
			const input = `{ ${paramsWithoutConfig} }`;

			const returnType = funcDecl.getReturnType();
			const output = returnType.getText();

			return { input, output };
		}

		return null;
	} catch (error) {
		return null;
	}
}

function extractSlackMethods(): PluginMethod[] {
	try {
		const pluginsPath = getPluginsPath();
		const slackOpsPath = join(pluginsPath, 'slack', 'operations');

		if (!existsSync(slackOpsPath)) {
			return [];
		}

		const project = new Project({
			skipAddingFilesFromTsConfig: true,
		});

		const methods: PluginMethod[] = [];
		const operationFiles = [
			'send-message.ts',
			'reply-to-thread.ts',
			'get-messages.ts',
			'update-message.ts',
			'add-reaction.ts',
			'get-channels.ts',
		];

		for (const fileName of operationFiles) {
			const filePath = join(slackOpsPath, fileName);
			if (!existsSync(filePath)) continue;

			try {
				const sourceFile = project.addSourceFileAtPath(filePath);
				const exportedFunctions = sourceFile.getFunctions();

				for (const func of exportedFunctions) {
					if (!func.isExported()) continue;

					const methodName = func.getName();
					if (!methodName) continue;

					const signature = extractMethodSignature(func);
					if (!signature) continue;

					const comments = func
						.getLeadingCommentRanges()
						.map((c) => c.getText())
						.join(' ');
					const description = comments
						? comments.replace(/\/\*|\*\/|\/\//g, '').trim()
						: undefined;

					methods.push({
						name: methodName,
						input: signature.input,
						output: signature.output,
						description: description || undefined,
					});
				}
			} catch (error) {
				continue;
			}
		}

		return methods;
	} catch (error) {
		return [];
	}
}

function extractPluginMethodsFromIndex(pluginName: string): PluginMethod[] {
	try {
		const pluginsPath = getPluginsPath();
		const indexPath = join(pluginsPath, 'index.ts');

		if (!existsSync(indexPath)) {
			return [];
		}

		const project = new Project({
			skipAddingFilesFromTsConfig: true,
		});

		const sourceFile = project.addSourceFileAtPath(indexPath);
		const createPluginsFunc = sourceFile.getFunction('createPlugins');

		if (!createPluginsFunc) {
			return [];
		}

		const returnStatement = createPluginsFunc.getStatementByKind(
			SyntaxKind.ReturnStatement,
		);
		if (!returnStatement) {
			return [];
		}

		const returnExpr = returnStatement.getExpression();
		if (!returnExpr) {
			return [];
		}

		const objectLiteral = returnExpr.asKind(SyntaxKind.ObjectLiteralExpression);
		if (!objectLiteral) {
			return [];
		}

		const pluginProp = objectLiteral
			.getProperties()
			.find(
				(p) =>
					p.isKind(SyntaxKind.PropertyAssignment) &&
					p.getName() === pluginName,
			);

		if (!pluginProp || !pluginProp.isKind(SyntaxKind.PropertyAssignment)) {
			return [];
		}

		const pluginObject = pluginProp
			.getInitializer()
			?.asKind(SyntaxKind.ObjectLiteralExpression);
		if (!pluginObject) {
			return [];
		}

		const methods: PluginMethod[] = [];

		for (const method of pluginObject.getProperties()) {
			if (!method.isKind(SyntaxKind.PropertyAssignment)) continue;

			const methodName = method.getName();
			const methodValue = method
				.getInitializer()
				?.asKind(SyntaxKind.ArrowFunction);

			if (!methodValue) continue;

			const params = methodValue.getParameters();
			let input = '{}';
			if (params.length > 0 && params[0]) {
				const paramType = params[0].getType();
				input = paramType.getText().replace(/\s+/g, ' ');
			}

			const returnType = methodValue.getReturnType();
			const output = returnType.getText().replace(/\s+/g, ' ');

			methods.push({
				name: methodName,
				input,
				output,
			});
		}

		return methods;
	} catch (error) {
		return [];
	}
}

export function extractPluginInfo(config: Config): PluginInfo[] {
	const plugins: PluginInfo[] = [];

	const slackMethods = extractSlackMethods();
	if (slackMethods.length === 0) {
		slackMethods.push(
			...extractPluginMethodsFromIndex('slack').filter((m) => m.name !== 'test'),
		);
	}

	if (config.plugins?.slack) {
		const slackConfig = config.plugins.slack;
		const channels = slackConfig.channels
			? Object.keys(slackConfig.channels)
			: [];
		const members = slackConfig.members ? Object.keys(slackConfig.members) : [];

		plugins.push({
			name: 'slack',
			configured: true,
			configDetails: {
				hasToken: !!slackConfig.token,
				channels,
				members,
			},
			methods: slackMethods.length > 0 ? slackMethods : [],
		});
	} else {
		plugins.push({
			name: 'slack',
			configured: false,
			methods: slackMethods.length > 0 ? slackMethods : [],
			configInstructions: `To use Slack, add to corsair.config.ts:
  plugins: {
    slack: {
      token: process.env.SLACK_BOT_TOKEN,
      channels: {
        'channel-name': 'CHANNEL_ID'
      }
    }
  }`,
		});
	}

	const discordMethods = extractPluginMethodsFromIndex('discord');
	const hasDiscordConfig = config.plugins && 'discord' in config.plugins;
	if (hasDiscordConfig) {
		plugins.push({
			name: 'discord',
			configured: true,
			methods: discordMethods,
		});
	} else if (discordMethods.length > 0) {
		plugins.push({
			name: 'discord',
			configured: false,
			methods: discordMethods,
			configInstructions: `Discord plugin is not yet fully implemented. Configuration will be available in future versions.`,
		});
	}

	const resendMethods = extractPluginMethodsFromIndex('resend');
	const hasResendConfig = config.plugins && 'resend' in config.plugins;
	if (hasResendConfig) {
		plugins.push({
			name: 'resend',
			configured: true,
			methods: resendMethods,
		});
	} else if (resendMethods.length > 0) {
		plugins.push({
			name: 'resend',
			configured: false,
			methods: resendMethods,
			configInstructions: `Resend plugin is not yet fully implemented. Configuration will be available in future versions.`,
		});
	}

	return plugins;
}

export function formatPluginDocs(pluginInfo: PluginInfo[]): string {
	let docs = '\nAVAILABLE PLUGINS:\n\n';
	docs +=
		'You have access to the following plugins via ctx.plugins. Use them to enhance your queries and mutations with external service integrations.\n\n';

	for (const plugin of pluginInfo) {
		const pluginNameUpper = plugin.name.toUpperCase();

		if (plugin.configured) {
			docs += `${pluginNameUpper} PLUGIN:\n`;
			docs += '✓ Configured and ready to use\n';

			if (plugin.configDetails) {
				if (plugin.configDetails.hasToken === false) {
					docs += '⚠️  Warning: Token is missing or empty\n';
				}
				if (
					plugin.configDetails.channels &&
					plugin.configDetails.channels.length > 0
				) {
					const channelList = plugin.configDetails.channels
						.map((c) => `'${c}'`)
						.join(' | ');
					docs += `  Available channels: ${plugin.configDetails.channels.join(', ')}\n`;
					docs += `  Channel type: ${channelList}\n`;
				}
				if (
					plugin.configDetails.members &&
					plugin.configDetails.members.length > 0
				) {
					docs += `  Available members: ${plugin.configDetails.members.join(', ')}\n`;
				}
			}

			docs += '\n';

			if (plugin.methods.length > 0) {
				for (const method of plugin.methods) {
					docs += `ctx.plugins.${plugin.name}.${method.name}(params)\n`;
					if (method.description) {
						docs += `  Description: ${method.description}\n`;
					}
					docs += `  INPUT: ${method.input}\n`;
					docs += `  OUTPUT: ${method.output}\n`;
					docs += '\n';
				}
			} else {
				docs += `  No methods available for this plugin\n\n`;
			}
		} else {
			docs += `${pluginNameUpper} PLUGIN:\n`;
			docs += '✗ Not configured\n';
			if (plugin.configInstructions) {
				docs += `\n${plugin.configInstructions}\n`;
			}
			docs += '\n';
		}
	}

	return docs;
}

export function validatePluginConfig(config: Config): {
	valid: boolean;
	warnings: string[];
} {
	const warnings: string[] = [];

	if (config.plugins?.slack) {
		if (!config.plugins.slack.token) {
			warnings.push(
				'Slack plugin is configured but token is missing. Set plugins.slack.token in corsair.config.ts',
			);
		}
		if (
			!config.plugins.slack.channels ||
			Object.keys(config.plugins.slack.channels).length === 0
		) {
			warnings.push(
				'Slack plugin is configured but no channels are defined. Add channels to plugins.slack.channels in corsair.config.ts',
			);
		}
	}

	return {
		valid: warnings.length === 0,
		warnings,
	};
}
