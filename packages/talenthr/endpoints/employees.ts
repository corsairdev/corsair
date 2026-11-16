import type { TalentHREndpoints } from '..';
import { call } from './call';
import {
	DeletedResponseSchema,
	DirectoryInputSchema,
	DirectoryResponseSchema,
	EmployeesEmploymentStatusesInputSchema,
	EmployeesEmploymentStatusesResponseSchema,
	EmployeesGetInputSchema,
	EmployeesGetResponseSchema,
	EmployeesHireInputSchema,
	EmployeesHireResponseSchema,
	EmployeesRehireInputSchema,
	EmployeesRehireResponseSchema,
	EmployeesRemoveInputSchema,
	EmployeesTerminateInputSchema,
	EmployeesTerminateResponseSchema,
	EmployeesUpdateInputSchema,
	EmployeesUpdateResponseSchema,
} from './types';

export const directory: TalentHREndpoints['employeesDirectory'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'employees.directory',
			input: DirectoryInputSchema,
			output: DirectoryResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/directory',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				filter: parsed.filter,
				custom_fields: parsed.customFields,
			},
		}),
	);
};

export const get: TalentHREndpoints['employeesGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'employees.get',
			input: EmployeesGetInputSchema,
			output: EmployeesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/employees/${parsed.employeeId}`,
		}),
	);
};

export const hire: TalentHREndpoints['employeesHire'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'employees.hire',
			input: EmployeesHireInputSchema,
			output: EmployeesHireResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/employees/hire',
			body: {
				first_name: parsed.first_name,
				last_name: parsed.last_name,
				email: parsed.email,
				hire_date: parsed.hire_date,
				employment_status: parsed.employment_status,
				reports_to_employee_id: parsed.reports_to_employee_id,
				job_record: parsed.job_record,
				compensation_record: parsed.compensation_record,
				emergency_contact: parsed.emergency_contact,
				employee_number: parsed.employee_number,
				prevent_email: parsed.prevent_email,
			},
		}),
	);
};

export const update: TalentHREndpoints['employeesUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'employees.update',
			input: EmployeesUpdateInputSchema,
			output: EmployeesUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { employeeId, ...body } = parsed;
			return {
				method: 'PUT',
				path: `/employees/${employeeId}`,
				body,
			};
		},
	);
};

export const terminate: TalentHREndpoints['employeesTerminate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'employees.terminate',
			input: EmployeesTerminateInputSchema,
			output: EmployeesTerminateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/employees/${parsed.employeeId}/terminate`,
			body: {
				effective_date: parsed.effective_date,
				termination_reason: parsed.termination_reason,
				termination_type: parsed.termination_type,
				regrettable_status: parsed.regrettable_status,
			},
		}),
	);
};

export const rehire: TalentHREndpoints['employeesRehire'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'employees.rehire',
			input: EmployeesRehireInputSchema,
			output: EmployeesRehireResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/employees/${parsed.employeeId}/rehire`,
			body: {
				hire_date: parsed.hire_date,
				reports_to_employee_id: parsed.reports_to_employee_id,
				employment_status: parsed.employment_status,
				job_record: parsed.job_record,
				prevent_email: parsed.prevent_email,
			},
		}),
	);
};

export const remove: TalentHREndpoints['employeesRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'employees.remove',
			input: EmployeesRemoveInputSchema,
			output: DeletedResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/employees/${parsed.employeeId}`,
		}),
	);
};

export const employmentStatuses: TalentHREndpoints['employeesEmploymentStatuses'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'employees.employmentStatuses',
				input: EmployeesEmploymentStatusesInputSchema,
				output: EmployeesEmploymentStatusesResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/employees/${parsed.employeeId}/employment-statuses`,
			}),
		);
	};
