import { z } from 'zod';

/**
 * SAP SuccessFactors OData entity shapes for Corsair DB cache (`ctx.db.*`).
 * Field names follow the labeled properties in the OData API Data Dictionary
 * (Admin Center → API Center → OData API Data Dictionary) and the HCM OData
 * API Reference: User, PerPerson, PerPersonal, EmpEmployment, JobRequisition,
 * Candidate, JobApplication, Position, FO*.
 *
 * Loose + catchall — tenants add custom fields; OData also returns `__metadata`.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const Deferred = z
	.object({ __deferred: z.object({ uri: z.string().optional() }).optional() })
	.catchall(z.unknown())
	.optional();

const ODataMeta = z
	.object({
		uri: z.string().optional(),
		type: z.string().optional(),
	})
	.catchall(z.unknown())
	.optional();

/** User — business key `userId`. OData: GET /odata/v2/User */
export const SapsuccessfactorsUserEntity = z
	.object({
		__metadata: ODataMeta,
		userId: z.string(),
		username: S,
		defaultFullName: S,
		firstName: S,
		mi: S,
		lastName: S,
		email: S,
		status: S,
		department: S,
		division: S,
		location: S,
		title: S,
		managerId: S,
		hrId: S,
		hireDate: S,
		lastModifiedDateTime: S,
		lastModified: S,
		timeZone: S,
		country: S,
		state: S,
		city: S,
		zipCode: S,
		addressLine1: S,
		businessPhone: S,
		cellPhone: S,
		empId: S,
		totalTeamSize: N,
		directReports: Deferred,
		manager: Deferred,
		hr: Deferred,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsUserEntity = z.infer<
	typeof SapsuccessfactorsUserEntity
>;

/** PerPerson — Employee Central person; business key `personIdExternal`. */
export const SapsuccessfactorsPersonEntity = z
	.object({
		__metadata: ODataMeta,
		personIdExternal: z.string(),
		personId: S,
		dateOfBirth: S,
		countryOfBirth: S,
		regionOfBirth: S,
		placeOfBirth: S,
		perPersonUuid: S,
		lastModifiedDateTime: S,
		personalInfoNav: Deferred,
		employmentNav: Deferred,
		emailNav: Deferred,
		phoneNav: Deferred,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsPersonEntity = z.infer<
	typeof SapsuccessfactorsPersonEntity
>;

/** PerPersonal — effective-dated biographical info. */
export const SapsuccessfactorsPersonalEntity = z
	.object({
		__metadata: ODataMeta,
		personIdExternal: z.string(),
		startDate: S,
		endDate: S,
		firstName: S,
		lastName: S,
		middleName: S,
		formalName: S,
		birthName: S,
		gender: S,
		maritalStatus: S,
		nationality: S,
		preferredName: S,
		salutation: S,
		lastModifiedDateTime: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsPersonalEntity = z.infer<
	typeof SapsuccessfactorsPersonalEntity
>;

/** EmpEmployment — employment assignment. */
export const SapsuccessfactorsEmploymentEntity = z
	.object({
		__metadata: ODataMeta,
		userId: z.string(),
		personIdExternal: S,
		startDate: S,
		endDate: S,
		originalStartDate: S,
		seniorityDate: S,
		assignmentClass: S,
		employmentType: S,
		isContingentWorker: B,
		lastModifiedDateTime: S,
		jobInfoNav: Deferred,
		compInfoNav: Deferred,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsEmploymentEntity = z.infer<
	typeof SapsuccessfactorsEmploymentEntity
>;

/** CalibrationSession — CalSession.svc OData V4. */
export const SapsuccessfactorsCalibrationSessionEntity = z
	.object({
		sessionId: z.string().optional(),
		sessionName: S,
		sessionOwnerId: S,
		sessionType: S,
		status: S,
		startDate: S,
		endDate: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsCalibrationSessionEntity = z.infer<
	typeof SapsuccessfactorsCalibrationSessionEntity
>;

/** GoalPlanTemplate */
export const SapsuccessfactorsGoalPlanEntity = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: S,
		type: S,
		dueDate: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsGoalPlanEntity = z.infer<
	typeof SapsuccessfactorsGoalPlanEntity
>;

/** Goal_<planId> */
export const SapsuccessfactorsGoalEntity = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		userId: S,
		name: S,
		flag: S,
		state: S,
		type: S,
		metric: S,
		done: N,
		start: S,
		due: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsGoalEntity = z.infer<
	typeof SapsuccessfactorsGoalEntity
>;

/** JobRequisition — business key `jobReqId`. */
export const SapsuccessfactorsJobRequisitionEntity = z
	.object({
		__metadata: ODataMeta,
		jobReqId: z.union([z.string(), z.number()]),
		internalStatus: S,
		jobTitle: S,
		jobCode: S,
		department: S,
		division: S,
		location: S,
		country: S,
		statusSetId: S,
		appStatusSetId: S,
		lastModifiedDateTime: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsJobRequisitionEntity = z.infer<
	typeof SapsuccessfactorsJobRequisitionEntity
>;

/** Candidate */
export const SapsuccessfactorsCandidateEntity = z
	.object({
		__metadata: ODataMeta,
		candidateId: z.union([z.string(), z.number()]),
		firstName: S,
		lastName: S,
		primaryEmail: S,
		contactEmail: S,
		cellPhone: S,
		city: S,
		country: S,
		currentTitle: S,
		lastModifiedDateTime: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsCandidateEntity = z.infer<
	typeof SapsuccessfactorsCandidateEntity
>;

/** JobApplication */
export const SapsuccessfactorsJobApplicationEntity = z
	.object({
		__metadata: ODataMeta,
		applicationId: z.union([z.string(), z.number()]),
		jobReqId: z.union([z.string(), z.number()]).nullable().optional(),
		candidateId: z.union([z.string(), z.number()]).nullable().optional(),
		status: S,
		appStatusSetId: S,
		applicationDate: S,
		lastModifiedDateTime: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsJobApplicationEntity = z.infer<
	typeof SapsuccessfactorsJobApplicationEntity
>;

/** Position — Employee Central Position Management. */
export const SapsuccessfactorsPositionEntity = z
	.object({
		__metadata: ODataMeta,
		code: z.string(),
		effectiveStartDate: S,
		effectiveEndDate: S,
		effectiveStatus: S,
		externalName_defaultValue: S,
		jobCode: S,
		department: S,
		division: S,
		company: S,
		location: S,
		payGrade: S,
		lastModifiedDateTime: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsPositionEntity = z.infer<
	typeof SapsuccessfactorsPositionEntity
>;

/** FOCompany — foundation object. */
export const SapsuccessfactorsCompanyEntity = z
	.object({
		externalCode: z.string().optional(),
		startDate: S,
		name_defaultValue: S,
		status: S,
		country: S,
		currency: S,
		entityOID: S,
	})
	.catchall(z.unknown());
export type SapsuccessfactorsCompanyEntity = z.infer<
	typeof SapsuccessfactorsCompanyEntity
>;
