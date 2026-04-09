import * as p from '@clack/prompts';
import type { CorsairInternalConfig } from 'corsair/core';
import { extractInternalConfig } from './corsair';

export async function loadInternalConfig(
	cwd: string,
	title: string,
	pluginId: string,
	pluginLabel: string,
): Promise<{ internal: CorsairInternalConfig; plugin: unknown }> {
	p.intro(title);
	const spin = p.spinner();
	spin.start('Loading corsair instance...');

	let internal: CorsairInternalConfig;
	try {
		internal = await extractInternalConfig(cwd);
	} catch (error) {
		spin.stop('Failed to load.');
		p.log.error(error instanceof Error ? error.message : String(error));
		p.outro('');
		process.exit(1);
	}

	const { plugins, database } = internal;

	if (!database) {
		spin.stop('Failed.');
		p.log.error('No database adapter configured.');
		p.outro('');
		process.exit(1);
	}

	const plugin = plugins.find((pl) => pl.id === pluginId);
	if (!plugin) {
		spin.stop(`${pluginLabel} plugin not found.`);
		p.log.error(`Add the ${pluginId} plugin to your corsair instance first.`);
		p.outro('');
		process.exit(1);
	}

	spin.stop('Loaded.');
	return { internal, plugin };
}
