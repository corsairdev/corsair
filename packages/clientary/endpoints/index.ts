import {
	create as clientsCreate,
	remove as clientsDelete,
	get as clientsGet,
	list as clientsList,
	update as clientsUpdate,
} from './clients';
import {
	create as contactsCreate,
	remove as contactsDelete,
	get as contactsGet,
	list as contactsList,
	listForClient as contactsListForClient,
	update as contactsUpdate,
} from './contacts';
import {
	create as estimatesCreate,
	remove as estimatesDelete,
	get as estimatesGet,
	list as estimatesList,
	listForClient as estimatesListForClient,
	listForProject as estimatesListForProject,
	send as estimatesSend,
	update as estimatesUpdate,
} from './estimates';
import {
	create as expensesCreate,
	remove as expensesDelete,
	get as expensesGet,
	list as expensesList,
	listForClient as expensesListForClient,
	listForProject as expensesListForProject,
	update as expensesUpdate,
} from './expenses';
import {
	create as hoursCreate,
	remove as hoursDelete,
	get as hoursGet,
	listForProject as hoursListForProject,
	update as hoursUpdate,
} from './hours';
import {
	create as invoicesCreate,
	remove as invoicesDelete,
	get as invoicesGet,
	list as invoicesList,
	listForClient as invoicesListForClient,
	listForProject as invoicesListForProject,
	listForRecurring as invoicesListForRecurring,
	send as invoicesSend,
	update as invoicesUpdate,
} from './invoices';
import {
	create as leadsCreate,
	remove as leadsDelete,
	get as leadsGet,
	list as leadsList,
	update as leadsUpdate,
} from './leads';
import {
	create as paymentProfilesCreate,
	remove as paymentProfilesDelete,
	listForClient as paymentProfilesListForClient,
} from './payment-profiles';
import {
	create as paymentsCreate,
	remove as paymentsDelete,
	list as paymentsList,
} from './payments';
import {
	create as projectsCreate,
	remove as projectsDelete,
	get as projectsGet,
	list as projectsList,
	listForClient as projectsListForClient,
	update as projectsUpdate,
} from './projects';
import {
	create as recurringCreate,
	remove as recurringDelete,
	get as recurringGet,
	list as recurringList,
	update as recurringUpdate,
} from './recurring';
import { get as staffGet, list as staffList } from './staff';
import {
	create as tasksCreate,
	remove as tasksDelete,
	get as tasksGet,
	list as tasksList,
	listForProject as tasksListForProject,
	update as tasksUpdate,
} from './tasks';

export const Clients = {
	list: clientsList,
	get: clientsGet,
	create: clientsCreate,
	update: clientsUpdate,
	delete: clientsDelete,
};

export const Contacts = {
	list: contactsList,
	listForClient: contactsListForClient,
	get: contactsGet,
	create: contactsCreate,
	update: contactsUpdate,
	delete: contactsDelete,
};

export const Estimates = {
	list: estimatesList,
	listForClient: estimatesListForClient,
	listForProject: estimatesListForProject,
	get: estimatesGet,
	create: estimatesCreate,
	update: estimatesUpdate,
	delete: estimatesDelete,
	send: estimatesSend,
};

export const Expenses = {
	list: expensesList,
	listForClient: expensesListForClient,
	listForProject: expensesListForProject,
	get: expensesGet,
	create: expensesCreate,
	update: expensesUpdate,
	delete: expensesDelete,
};

export const Hours = {
	listForProject: hoursListForProject,
	get: hoursGet,
	create: hoursCreate,
	update: hoursUpdate,
	delete: hoursDelete,
};

export const Invoices = {
	list: invoicesList,
	listForClient: invoicesListForClient,
	listForProject: invoicesListForProject,
	listForRecurring: invoicesListForRecurring,
	get: invoicesGet,
	create: invoicesCreate,
	update: invoicesUpdate,
	delete: invoicesDelete,
	send: invoicesSend,
};

export const Leads = {
	list: leadsList,
	get: leadsGet,
	create: leadsCreate,
	update: leadsUpdate,
	delete: leadsDelete,
};

export const Payments = {
	list: paymentsList,
	create: paymentsCreate,
	delete: paymentsDelete,
};

export const PaymentProfiles = {
	listForClient: paymentProfilesListForClient,
	create: paymentProfilesCreate,
	delete: paymentProfilesDelete,
};

export const Projects = {
	list: projectsList,
	listForClient: projectsListForClient,
	get: projectsGet,
	create: projectsCreate,
	update: projectsUpdate,
	delete: projectsDelete,
};

export const Recurring = {
	list: recurringList,
	get: recurringGet,
	create: recurringCreate,
	update: recurringUpdate,
	delete: recurringDelete,
};

export const Staff = {
	list: staffList,
	get: staffGet,
};

export const Tasks = {
	list: tasksList,
	listForProject: tasksListForProject,
	get: tasksGet,
	create: tasksCreate,
	update: tasksUpdate,
	delete: tasksDelete,
};

export * from './types';
