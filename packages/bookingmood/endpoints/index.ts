import {
	createHandler,
	deleteHandler,
	inviteMember,
	listHandler,
	queryAvailability,
	searchAvailability,
	updateHandler,
} from './handlers';
import { RESOURCES } from './resources';

function buildResourceEndpoints() {
	const nested: Record<string, Record<string, unknown>> = {};
	for (const resource of RESOURCES) {
		const group: Record<string, unknown> = {};
		if (resource.list) group.list = listHandler(resource);
		if (resource.create === true) group.create = createHandler(resource);
		if (resource.update === true) group.update = updateHandler(resource);
		if (resource.delete === true) group.delete = deleteHandler(resource);
		nested[resource.group] = group;
	}
	nested.members!.invite = inviteMember;
	nested.availability = { query: queryAvailability };
	nested.search = { availability: searchAvailability };
	return nested;
}

export const resourceEndpoints = buildResourceEndpoints();

export { RESOURCES };
