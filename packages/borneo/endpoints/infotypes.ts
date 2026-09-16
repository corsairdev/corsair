import { createBorneoEndpoint } from './factory';

export const listDiscoveredInfotypes = createBorneoEndpoint(
	'listDiscoveredInfotypes',
	'BORNEO_LIST_DISCOVERED_INFOTYPES',
	'borneo.infotypes.listDiscoveredInfotypes',
);

export const retrieveDiscoveredInfotypeById = createBorneoEndpoint(
	'retrieveDiscoveredInfotypeById',
	'BORNEO_RETRIEVE_DISCOVERED_INFOTYPE_BY_ID',
	'borneo.infotypes.retrieveDiscoveredInfotypeById',
);

export const updateDiscoveredInfotypeStatus = createBorneoEndpoint(
	'updateDiscoveredInfotypeStatus',
	'BORNEO_UPDATE_DISCOVERED_INFOTYPE_STATUS',
	'borneo.infotypes.updateDiscoveredInfotypeStatus',
);
