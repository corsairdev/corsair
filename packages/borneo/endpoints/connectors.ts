import { createBorneoEndpoint } from './factory';

export const postConnectorWithFilteringOptions = createBorneoEndpoint(
	'postConnectorWithFilteringOptions',
	'BORNEO_POST_CONNECTOR_WITH_FILTERING_OPTIONS',
	'borneo.connectors.postConnectorWithFilteringOptions',
);

export const retrieveConnectorById = createBorneoEndpoint(
	'retrieveConnectorById',
	'BORNEO_RETRIEVE_CONNECTOR_BY_ID',
	'borneo.connectors.retrieveConnectorById',
);
