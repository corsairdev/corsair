import { defineOp } from './factory';

export const get = defineOp('getMember');
export const getPrivacySettings = defineOp('getMemberPrivacySettings');
export const getMembersCustomFieldApplications = defineOp(
	'getMembersCustomFieldApplications',
);
export const getRolesCustomFieldApplications = defineOp(
	'getRolesCustomFieldApplications',
);
export const getRolesInfo = defineOp('getRolesInfo');
export const listCustomFields = defineOp('listMembersCustomFields');
export const listFollowing = defineOp('listMemberFollowing');
export const listMyFollowers = defineOp('listMyMemberFollowers');
export const register = defineOp('registerMemberV2');
export const logout = defineOp('logoutMember');
export const sendRecoveryEmail = defineOp('sendMemberRecoveryEmail');

export const MembersEndpoints = {
	get,
	getPrivacySettings,
	getMembersCustomFieldApplications,
	getRolesCustomFieldApplications,
	getRolesInfo,
	listCustomFields,
	listFollowing,
	listMyFollowers,
	register,
	logout,
	sendRecoveryEmail,
} as const;
