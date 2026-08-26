import {
	BlazemeterAccountEntity,
	BlazemeterAssetEntity,
	BlazemeterPackageEntity,
	BlazemeterProjectEntity,
	BlazemeterTestEntity,
	BlazemeterUserEntity,
	BlazemeterWorkspaceEntity,
	BlazemeterWorkspaceUserEntity,
} from './database';

export const BlazemeterSchema = {
	version: '1.0.0',
	entities: {
		accounts: BlazemeterAccountEntity,
		workspaces: BlazemeterWorkspaceEntity,
		projects: BlazemeterProjectEntity,
		tests: BlazemeterTestEntity,
		users: BlazemeterUserEntity,
		workspaceUsers: BlazemeterWorkspaceUserEntity,
		assets: BlazemeterAssetEntity,
		packages: BlazemeterPackageEntity,
	},
} as const;

export * from './database';
export * from './primitives';
