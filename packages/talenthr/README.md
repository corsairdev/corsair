# @corsair-dev/talenthr

TalentHR plugin for Corsair: manage employees, hiring, termination and rehiring, time off requests and budgets, and the divisions, departments, locations and job titles they reference.

## Install

```bash
pnpm add @corsair-dev/talenthr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `departments.create` | `talenthr.api.departments.create` | `write` | Create a department with a name that is unique in the company |
| `departments.delete` | `talenthr.api.departments.delete` | `destructive` | Delete a department; TalentHR refuses while an active job position uses it |
| `departments.list` | `talenthr.api.departments.list` | `read` | List the departments of the company |
| `divisions.create` | `talenthr.api.divisions.create` | `write` | Create a division with a name that is unique in the company |
| `divisions.delete` | `talenthr.api.divisions.delete` | `destructive` | Delete a division; TalentHR refuses while an active job position uses it, and clears it from other records |
| `divisions.get` | `talenthr.api.divisions.get` | `read` | Read one division by ID |
| `divisions.list` | `talenthr.api.divisions.list` | `read` | List the divisions of the company |
| `divisions.update` | `talenthr.api.divisions.update` | `write` | Rename a division |
| `employees.delete` | `talenthr.api.employees.delete` | `destructive` | Permanently delete an employee; use terminate when the employment history must be kept |
| `employees.directory` | `talenthr.api.employees.directory` | `read` | List employees with their job, contact and org details, filtered and paged; the response carries the total match count |
| `employees.employmentStatuses` | `talenthr.api.employees.employmentStatuses` | `read` | List an employee’s employment status records, each with its effective date and status name |
| `employees.get` | `talenthr.api.employees.get` | `read` | Read one employee, including their user role, seniority, custom fields and manager |
| `employees.hire` | `talenthr.api.employees.hire` | `write` | Create an employee with a hire date, employment status and optional job, pay and emergency contact records; TalentHR emails the new employee unless prevent_email is set |
| `employees.rehire` | `talenthr.api.employees.rehire` | `write` | Return a terminated employee to active status from a new hire date, with a manager and employment status |
| `employees.terminate` | `talenthr.api.employees.terminate` | `write` | Terminate an employee from a given date, recording the reason and whether the departure was regrettable |
| `employees.update` | `talenthr.api.employees.update` | `write` | Change an employee’s name, contact, address, SSN, birth date, manager or emergency contact |
| `jobTitles.list` | `talenthr.api.jobTitles.list` | `read` | List the job titles of the company |
| `locations.list` | `talenthr.api.locations.list` | `read` | List the work locations with their address and whether they are remote |
| `referenceData.employmentStatuses` | `talenthr.api.referenceData.employmentStatuses` | `read` | List the employment statuses, whose IDs employees.hire and employees.rehire take |
| `timeOff.budgets` | `talenthr.api.timeOff.budgets` | `read` | Read one employee’s time off budgets per type, including used and carried-over amounts |
| `timeOff.create` | `talenthr.api.timeOff.create` | `write` | Book time off for an employee, either preapproved or sent to their manager for approval |
| `timeOff.delete` | `talenthr.api.timeOff.delete` | `destructive` | Cancel a time off request, which frees its budget back to the employee |
| `timeOff.list` | `talenthr.api.timeOff.list` | `read` | List one employee’s time off requests with their type, dates, budget and approval state |
| `timeOff.reply` | `talenthr.api.timeOff.reply` | `write` | Approve or reject a time off request on behalf of the manager |
| `timeOff.types` | `talenthr.api.timeOff.types` | `read` | List the time off types with their budgets, whether they are paid and whether they need approval |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/talenthr

## License

Apache-2.0
