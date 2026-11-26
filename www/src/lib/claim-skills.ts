import type { GatewaySkill } from './gateway-content';

/** What /start needs of a starter skill. The page reads Hub's list and passes this much down. */
export type StartSkill = Pick<
	GatewaySkill,
	'slug' | 'name' | 'required' | 'optional'
>;

export function toStartSkills(skills: readonly GatewaySkill[]): StartSkill[] {
	return skills.map(({ slug, name, required, optional }) => ({
		slug,
		name,
		required,
		optional,
	}));
}
