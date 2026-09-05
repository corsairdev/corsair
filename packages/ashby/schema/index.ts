import {
	AshbyApplicationEntity,
	AshbyCandidateEntity,
	AshbyDepartmentEntity,
	AshbyJobEntity,
	AshbyJobPostingEntity,
	AshbyLocationEntity,
	AshbyOfferEntity,
	AshbyUserEntity,
} from './database';

export const AshbySchema = {
	version: '1.0.0',
	entities: {
		candidates: AshbyCandidateEntity,
		applications: AshbyApplicationEntity,
		jobs: AshbyJobEntity,
		jobPostings: AshbyJobPostingEntity,
		offers: AshbyOfferEntity,
		departments: AshbyDepartmentEntity,
		locations: AshbyLocationEntity,
		users: AshbyUserEntity,
	},
} as const;

export * from './database';
