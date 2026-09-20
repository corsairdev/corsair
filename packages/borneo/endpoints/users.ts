import { createBorneoEndpoint } from './factory';

export const getUserProfileById = createBorneoEndpoint(
	'getUserProfileById',
	'BORNEO_GET_USER_PROFILE_BY_ID',
	'borneo.users.getUserProfileById',
);

export const listUserProfileWithFiltersAndSorting = createBorneoEndpoint(
	'listUserProfileWithFiltersAndSorting',
	'BORNEO_LIST_USER_PROFILE_WITH_FILTERS_AND_SORTING',
	'borneo.users.listUserProfileWithFiltersAndSorting',
);

export const verifyEmailWithIdAndToken = createBorneoEndpoint(
	'verifyEmailWithIdAndToken',
	'BORNEO_VERIFY_EMAIL_WITH_ID_AND_TOKEN',
	'borneo.users.verifyEmailWithIdAndToken',
);
