export const BreatheHrEmployee = {
  name: 'breathehr_employees',
  primaryKey: 'id',
  fields: {
    id: { type: 'number', required: true },
    first_name: { type: 'string', required: true },
    last_name: { type: 'string', required: true },
    email: { type: 'string', required: false },
    job_title: { type: 'string', required: false },
    status: { type: 'string', required: false },
    start_date: { type: 'string', required: false },
  },
} as const;

export const BreatheHrLeave = {
  name: 'breathehr_leaves',
  primaryKey: 'id',
  fields: {
    id: { type: 'number', required: true },
    employee_id: { type: 'number', required: true },
    type: { type: 'string', required: false },
    start_date: { type: 'string', required: true },
    end_date: { type: 'string', required: true },
    status: { type: 'string', required: false },
  },
} as const;
