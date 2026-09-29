# @corsair-dev/breathehr

Breathe HR plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/breathehr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `absences.list` | `breathehr.api.absences.list` | `read` | List absences |
| `account.get` | `breathehr.api.account.get` | `read` | Retrieve Breathe HR account details |
| `benefits.list` | `breathehr.api.benefits.list` | `read` | List employee benefits |
| `bonuses.list` | `breathehr.api.bonuses.list` | `read` | List employee bonuses |
| `changeRequests.list` | `breathehr.api.changeRequests.list` | `read` | List change requests |
| `companyDocuments.list` | `breathehr.api.companyDocuments.list` | `read` | List company documents |
| `companyProjects.list` | `breathehr.api.companyProjects.list` | `read` | List company projects |
| `companyTrainingTypes.list` | `breathehr.api.companyTrainingTypes.list` | `read` | List company training types |
| `departments.list` | `breathehr.api.departments.list` | `read` | List departments |
| `departments.listAbsences` | `breathehr.api.departments.listAbsences` | `read` | List absences for a department |
| `departments.listBenefits` | `breathehr.api.departments.listBenefits` | `read` | List benefits for a department |
| `departments.listBonuses` | `breathehr.api.departments.listBonuses` | `read` | List bonuses for a department |
| `departments.listLeaveRequests` | `breathehr.api.departments.listLeaveRequests` | `read` | List leave requests for a department |
| `departments.listSalaries` | `breathehr.api.departments.listSalaries` | `read` | List salaries for a department |
| `divisions.list` | `breathehr.api.divisions.list` | `read` | List divisions |
| `employeeExpenseClaims.list` | `breathehr.api.employeeExpenseClaims.list` | `read` | List employee expense claims |
| `employeeExpenseClaims.update` | `breathehr.api.employeeExpenseClaims.update` | `write` | Approve or reject an expense claim |
| `employeeExpenses.delete` | `breathehr.api.employeeExpenses.delete` | `destructive` | Delete an employee expense [DESTRUCTIVE] |
| `employeeExpenses.get` | `breathehr.api.employeeExpenses.get` | `read` | Get an employee expense by ID |
| `employeeExpenses.list` | `breathehr.api.employeeExpenses.list` | `read` | List employee expenses |
| `employeeJobs.list` | `breathehr.api.employeeJobs.list` | `read` | List employee jobs |
| `employees.create` | `breathehr.api.employees.create` | `write` | Create an employee |
| `employees.createChangeRequest` | `breathehr.api.employees.createChangeRequest` | `write` | Create an employee change request |
| `employees.createExpense` | `breathehr.api.employees.createExpense` | `write` | Create an employee expense |
| `employees.createExpenseClaim` | `breathehr.api.employees.createExpenseClaim` | `write` | Create an employee expense claim |
| `employees.createSickness` | `breathehr.api.employees.createSickness` | `write` | Create an employee sickness record |
| `employees.get` | `breathehr.api.employees.get` | `read` | Get an employee by ID |
| `employees.list` | `breathehr.api.employees.list` | `read` | List employees with pagination |
| `employees.listAbsences` | `breathehr.api.employees.listAbsences` | `read` | List absences for an employee |
| `employees.listBenefits` | `breathehr.api.employees.listBenefits` | `read` | List benefits for an employee |
| `employees.listBonuses` | `breathehr.api.employees.listBonuses` | `read` | List bonuses for an employee |
| `employees.listChangeRequests` | `breathehr.api.employees.listChangeRequests` | `read` | List change requests for an employee |
| `employees.listHolidayYears` | `breathehr.api.employees.listHolidayYears` | `read` | List holiday years for an employee |
| `employees.listLeaveRequests` | `breathehr.api.employees.listLeaveRequests` | `read` | List leave requests for an employee |
| `employees.listSalaries` | `breathehr.api.employees.listSalaries` | `read` | List salaries for an employee |
| `employeeTrainingCourses.delete` | `breathehr.api.employeeTrainingCourses.delete` | `destructive` | Delete an employee training course [DESTRUCTIVE] |
| `employeeTrainingCourses.list` | `breathehr.api.employeeTrainingCourses.list` | `read` | List employee training courses |
| `employeeTrainingCourses.update` | `breathehr.api.employeeTrainingCourses.update` | `write` | Update an employee training course |
| `holidayAllowances.list` | `breathehr.api.holidayAllowances.list` | `read` | List holiday allowances |
| `leaveRequests.approve` | `breathehr.api.leaveRequests.approve` | `write` | Approve a leave request |
| `leaveRequests.get` | `breathehr.api.leaveRequests.get` | `read` | Get a leave request by ID |
| `leaveRequests.getCancelling` | `breathehr.api.leaveRequests.getCancelling` | `read` | Get the leave request being cancelled |
| `leaveRequests.list` | `breathehr.api.leaveRequests.list` | `read` | List leave requests |
| `leaveRequests.reject` | `breathehr.api.leaveRequests.reject` | `write` | Reject a leave request |
| `locations.list` | `breathehr.api.locations.list` | `read` | List locations |
| `otherLeaveReasons.list` | `breathehr.api.otherLeaveReasons.list` | `read` | List other leave reasons |
| `salaries.list` | `breathehr.api.salaries.list` | `read` | List salaries |
| `sicknesses.list` | `breathehr.api.sicknesses.list` | `read` | List sickness records |
| `sicknesses.update` | `breathehr.api.sicknesses.update` | `write` | Update a sickness record |
| `workingPatterns.list` | `breathehr.api.workingPatterns.list` | `read` | List working patterns |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/breathehr

## License

Apache-2.0
