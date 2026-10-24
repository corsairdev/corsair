// Corsair staff and interns, read from GitHub's author_association on the pull request:
// OWNER and MEMBER are corsairdev org members, COLLABORATOR has direct repo access, which
// only staff and interns get. Bounty contributors arrive as CONTRIBUTOR or
// FIRST_TIME_CONTRIBUTOR. Team merges are posted as "Corsair team" in #shipped, without points.
const TEAM_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

export function isOssTeamAssociation(
	association: string | null | undefined,
): boolean {
	return association != null && TEAM_ASSOCIATIONS.has(association);
}
