import { z } from 'zod';

export const EmployeeSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  status: z.string().optional(),
  start_date: z.string().optional(),
  dob: z.string().nullable().optional(),
});

export const LeaveSchema = z.object({
  id: z.number(),
  employee_id: z.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  type: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
});

export const EmployeesListInputSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  per_page: z.number().int().positive().max(100).optional().default(50),
  status: z.string().optional(),
});

export const EmployeesListResponseSchema = z.object({
  employees: z.array(EmployeeSchema).optional().default([]),
});

export const EmployeesGetInputSchema = z.object({
  id: z.number().int().positive(),
});

export const EmployeesGetResponseSchema = z.object({
  employees: z.array(EmployeeSchema),
});

export const EmployeesCreateInputSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  job_title: z.string().optional(),
  start_date: z.string().optional(),
});

export const EmployeesCreateResponseSchema = z.object({
  employees: z.array(EmployeeSchema),
});

export const LeavesListInputSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  employee_id: z.number().optional(),
  page: z.number().optional().default(1),
});

export const LeavesListResponseSchema = z.object({
  leaves: z.array(LeaveSchema).optional().default([]),
});

export const LeavesGetInputSchema = z.object({
  id: z.number().int().positive(),
});

export const LeavesGetResponseSchema = z.object({
  leaves: z.array(LeaveSchema),
});

export const BreatheHrEndpointInputSchemas = {
  employeesList: EmployeesListInputSchema,
  employeesGet: EmployeesGetInputSchema,
  employeesCreate: EmployeesCreateInputSchema,
  leavesList: LeavesListInputSchema,
  leavesGet: LeavesGetInputSchema,
} as const;

export const BreatheHrEndpointOutputSchemas = {
  employeesList: EmployeesListResponseSchema,
  employeesGet: EmployeesGetResponseSchema,
  employeesCreate: EmployeesCreateResponseSchema,
  leavesList: LeavesListResponseSchema,
  leavesGet: LeavesGetResponseSchema,
} as const;

export type EmployeesListInput = z.infer<typeof EmployeesListInputSchema>;
export type EmployeesListResponse = z.infer<typeof EmployeesListResponseSchema>;
export type EmployeesGetInput = z.infer<typeof EmployeesGetInputSchema>;
export type EmployeesGetResponse = z.infer<typeof EmployeesGetResponseSchema>;
export type EmployeesCreateInput = z.infer<typeof EmployeesCreateInputSchema>;
export type EmployeesCreateResponse = z.infer<typeof EmployeesCreateResponseSchema>;
export type LeavesListInput = z.infer<typeof LeavesListInputSchema>;
export type LeavesListResponse = z.infer<typeof LeavesListResponseSchema>;
export type LeavesGetInput = z.infer<typeof LeavesGetInputSchema>;
export type LeavesGetResponse = z.infer<typeof LeavesGetResponseSchema>;

export type BreatheHrEndpointInputs = {
  employeesList: EmployeesListInput;
  employeesGet: EmployeesGetInput;
  employeesCreate: EmployeesCreateInput;
  leavesList: LeavesListInput;
  leavesGet: LeavesGetInput;
};

export type BreatheHrEndpointOutputs = {
  employeesList: EmployeesListResponse;
  employeesGet: EmployeesGetResponse;
  employeesCreate: EmployeesCreateResponse;
  leavesList: LeavesListResponse;
  leavesGet: LeavesGetResponse;
};