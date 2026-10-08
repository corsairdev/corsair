import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CommandActionData, CommandOption } from '../../index.types';
import { fetchCloudOpTree, resolveCloudConfig } from '../../lib/cloud/client';
import { buildCloudDeclaration } from '../../lib/cloud/op-tree';
import BaseCommand from '../base.command';

const REGISTRY_MODULE_SPECIFIER = 'corsair';

export default class CloudPullCommand extends BaseCommand {
	getName(): string {
		return 'pull';
	}

	getDescription(): string {
		return 'Generate corsair-env.d.ts typing CorsairCloudRegistry from a Corsair Cloud project';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-u',
				long: '--url <url>',
				description: 'Corsair Cloud base URL',
			},
			{
				short: '-k',
				long: '--key <key>',
				description: 'Corsair Cloud project key',
			},
			{
				short: '-o',
				long: '--out <path>',
				description: 'Output path',
				defaultValue: 'corsair-env.d.ts',
			},
		];
	}

	async action({ options }: CommandActionData) {
		const config = resolveCloudConfig(options);
		const tree = await fetchCloudOpTree(config);
		const declaration = buildCloudDeclaration(tree, REGISTRY_MODULE_SPECIFIER);

		const outPath = resolve(process.cwd(), options.out ?? 'corsair-env.d.ts');
		writeFileSync(outPath, declaration);

		const pluginCount = Object.keys(tree).length;
		const opCount = Object.values(tree).reduce(
			(sum, ops) => sum + ops.length,
			0,
		);
		console.log(
			`[#corsair]: Wrote ${outPath} (${pluginCount} plugins, ${opCount} ops).`,
		);
	}
}
