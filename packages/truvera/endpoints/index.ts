import * as Credentials from './credentials';
import * as Dids from './dids';
import * as Profiles from './profiles';
import * as Registries from './registries';
import * as Schemas from './schemas';
import * as Verification from './verification';

export const DidsEndpoints = {
	list: Dids.list,
	create: Dids.create,
	get: Dids.get,
	getMetadata: Dids.getMetadata,
	delete: Dids.remove,
};

export const ProfilesEndpoints = {
	list: Profiles.list,
	create: Profiles.create,
	get: Profiles.get,
	update: Profiles.update,
	delete: Profiles.remove,
};

export const CredentialsEndpoints = {
	issue: Credentials.issue,
	list: Credentials.list,
	get: Credentials.get,
	delete: Credentials.remove,
	revoke: Credentials.revoke,
	unrevoke: Credentials.unrevoke,
};

export const SchemasEndpoints = {
	create: Schemas.create,
	list: Schemas.list,
	get: Schemas.get,
	delete: Schemas.remove,
};

export const RegistriesEndpoints = {
	create: Registries.create,
	list: Registries.list,
	get: Registries.get,
	delete: Registries.remove,
	revoke: Registries.revokeInRegistry,
	revocationStatus: Registries.revocationStatus,
};

export const VerifyEndpoints = {
	verify: Verification.verify,
};

export const JobsEndpoints = {
	get: Verification.getJob,
};

export * from './types';
