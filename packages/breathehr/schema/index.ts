import { BreatheHrEmployee, BreatheHrLeave } from './database';

export const BreatheHrSchema = {
  version: '1.0.0',
  entities: {
    employees: BreatheHrEmployee,
    leaves: BreatheHrLeave,
  },
} as const;
