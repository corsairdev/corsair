import type { AppVeyorEndpoints } from '../index';
import { AppVeyorClient } from '../index';
import { EndpointOutputSchemas } from './types';

export const getLast: AppVeyorEndpoints['buildsGetLast'] = async (
	ctx,
	input,
) => {
	const client = new AppVeyorClient({
		apiKey: ctx.key,
	});

	const result = await client.getLastBuild(
		input.accountName,
		input.projectSlug,
	);

	return EndpointOutputSchemas.buildsGetLast.parse(result);
};
