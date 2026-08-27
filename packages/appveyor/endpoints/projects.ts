import type { AppVeyorEndpoints } from '../index';
import { AppVeyorClient } from '../index';
import { EndpointOutputSchemas } from './types';

export const list: AppVeyorEndpoints['projectsList'] = async (ctx) => {
	const client = new AppVeyorClient({
		apiKey: ctx.key,
	});

	const result = await client.getProjects();

	return EndpointOutputSchemas.projectsList.parse(result);
};
