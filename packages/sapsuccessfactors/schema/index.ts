import {
	SapsuccessfactorsCalibrationSessionEntity,
	SapsuccessfactorsCandidateEntity,
	SapsuccessfactorsCompanyEntity,
	SapsuccessfactorsEmploymentEntity,
	SapsuccessfactorsGoalEntity,
	SapsuccessfactorsGoalPlanEntity,
	SapsuccessfactorsJobApplicationEntity,
	SapsuccessfactorsJobRequisitionEntity,
	SapsuccessfactorsPersonalEntity,
	SapsuccessfactorsPersonEntity,
	SapsuccessfactorsPositionEntity,
	SapsuccessfactorsUserEntity,
} from './database';

export const SapsuccessfactorsSchema = {
	version: '1.0.0',
	entities: {
		user: SapsuccessfactorsUserEntity,
		person: SapsuccessfactorsPersonEntity,
		personal: SapsuccessfactorsPersonalEntity,
		employment: SapsuccessfactorsEmploymentEntity,
		calibrationSession: SapsuccessfactorsCalibrationSessionEntity,
		goalPlan: SapsuccessfactorsGoalPlanEntity,
		goal: SapsuccessfactorsGoalEntity,
		jobRequisition: SapsuccessfactorsJobRequisitionEntity,
		candidate: SapsuccessfactorsCandidateEntity,
		jobApplication: SapsuccessfactorsJobApplicationEntity,
		position: SapsuccessfactorsPositionEntity,
		company: SapsuccessfactorsCompanyEntity,
	},
} as const;

export * from './database';
