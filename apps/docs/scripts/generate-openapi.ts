import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '../lib/openapi';

await generateFiles({
	input: openapi,
	output: './content/docs/(api)/v1',
	per: 'operation',
	groupBy: 'tag',
	meta: true,
});
