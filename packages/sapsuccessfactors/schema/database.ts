import { z } from 'zod';

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * SAP SuccessFactors User Entity
 */
export const SapsuccessfactorsUserEntity = z
	.object({
		userId: z.string(),
		username: S,
		firstName: S,
		lastName: S,
		email: S,
		title: S,
		department: S,
		division: S,
		location: S,
		status: S,
		hireDate: S,
		lastModifiedDateTime: S,
	})
	.passthrough();
export type SapsuccessfactorsUserEntity = z.infer<
	typeof SapsuccessfactorsUserEntity
>;

/**
 * SAP SuccessFactors PerPerson Entity
 */
export const SapsuccessfactorsPersonEntity = z
	.object({
		personIdExternal: z.string(),
		dateOfBirth: S,
		countryOfBirth: S,
		placeOfBirth: S,
		userId: S,
	})
	.passthrough();
export type SapsuccessfactorsPersonEntity = z.infer<
	typeof SapsuccessfactorsPersonEntity
>;

/**
 * SAP SuccessFactors PerPersonal Entity
 */
export const SapsuccessfactorsPersonalEntity = z
	.object({
		personIdExternal: z.string(),
		startDate: S,
		endDate: S,
		firstName: S,
		lastName: S,
		gender: S,
		maritalStatus: S,
		nationality: S,
	})
	.passthrough();
export type SapsuccessfactorsPersonalEntity = z.infer<
	typeof SapsuccessfactorsPersonalEntity
>;

/**
 * SAP SuccessFactors EmpEmployment Entity
 */
export const SapsuccessfactorsEmploymentEntity = z
	.object({
		userId: z.string(),
		personIdExternal: S,
		startDate: S,
		endDate: S,
		employmentStatus: S,
	})
	.passthrough();
export type SapsuccessfactorsEmploymentEntity = z.infer<
	typeof SapsuccessfactorsEmploymentEntity
>;

/**
 * SAP SuccessFactors CalibrationSession Entity
 */
export const SapsuccessfactorsCalibrationSessionEntity = z
	.object({
		sessionId: z.string(),
		sessionName: S,
		sessionType: S,
		status: S,
		startDate: S,
		endDate: S,
	})
	.passthrough();
export type SapsuccessfactorsCalibrationSessionEntity = z.infer<
	typeof SapsuccessfactorsCalibrationSessionEntity
>;

/**
 * SAP SuccessFactors GoalPlanTemplate Entity
 */
export const SapsuccessfactorsGoalPlanEntity = z
	.object({
		id: z.string(),
		name: S,
		planType: S,
		dueDate: S,
	})
	.passthrough();
export type SapsuccessfactorsGoalPlanEntity = z.infer<
	typeof SapsuccessfactorsGoalPlanEntity
>;

/**
 * SAP SuccessFactors Goal Entity
 */
export const SapsuccessfactorsGoalEntity = z
	.object({
		id: z.string(),
		userId: S,
		name: S,
		state: S,
		metric: S,
		done: N,
		start: S,
		due: S,
	})
	.passthrough();
export type SapsuccessfactorsGoalEntity = z.infer<
	typeof SapsuccessfactorsGoalEntity
>;

/**
 * SAP SuccessFactors JobRequisition Entity
 */
export const SapsuccessfactorsJobRequisitionEntity = z
	.object({
		jobReqId: z.string(),
		jobTitle: S,
		department: S,
		division: S,
		location: S,
		status: S,
	})
	.passthrough();
export type SapsuccessfactorsJobRequisitionEntity = z.infer<
	typeof SapsuccessfactorsJobRequisitionEntity
>;

/**
 * SAP SuccessFactors Candidate Entity
 */
export const SapsuccessfactorsCandidateEntity = z
	.object({
		candidateId: z.string(),
		firstName: S,
		lastName: S,
		primaryEmail: S,
		cellPhone: S,
		city: S,
		country: S,
	})
	.passthrough();
export type SapsuccessfactorsCandidateEntity = z.infer<
	typeof SapsuccessfactorsCandidateEntity
>;

/**
 * SAP SuccessFactors JobApplication Entity
 */
export const SapsuccessfactorsJobApplicationEntity = z
	.object({
		applicationId: z.string(),
		jobReqId: S,
		candidateId: S,
		appStatusId: S,
		applicationDate: S,
	})
	.passthrough();
export type SapsuccessfactorsJobApplicationEntity = z.infer<
	typeof SapsuccessfactorsJobApplicationEntity
>;

/**
 * SAP SuccessFactors Position Entity
 */
export const SapsuccessfactorsPositionEntity = z
	.object({
		code: z.string(),
		externalName: S,
		effectiveStartDate: S,
		effectiveStatus: S,
		jobCode: S,
		department: S,
		company: S,
	})
	.passthrough();
export type SapsuccessfactorsPositionEntity = z.infer<
	typeof SapsuccessfactorsPositionEntity
>;
