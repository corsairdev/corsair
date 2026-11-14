import { AccountingContact } from './accounting-contact';
import { Basics } from './basics';
import { CheckAccount } from './check-account';
import { CheckAccountTransaction } from './check-account-transaction';
import { CommunicationWay } from './communication-way';
import { Contact } from './contact';
import { ContactAddress } from './contact-address';
import { ContactField } from './contact-field';
import { CreditNote } from './credit-note';
import { CreditNotePos } from './credit-note-pos';
import { Export } from './export';
import { Invoice } from './invoice';
import { InvoicePos } from './invoice-pos';
import { Layout } from './layout';
import { Order } from './order';
import { OrderPos } from './order-pos';
import { Part } from './part';
import { PrivateTransactionRule } from './private-transaction-rule';
import { Report } from './report';
import { Tag } from './tag';
import { Voucher } from './voucher';
import { VoucherPos } from './voucher-pos';

export const sevdeskEndpointsNested = {
	basics: Basics,
	checkAccount: CheckAccount,
	checkAccountTransaction: CheckAccountTransaction,
	privateTransactionRule: PrivateTransactionRule,
	contact: Contact,
	contactAddress: ContactAddress,
	communicationWay: CommunicationWay,
	accountingContact: AccountingContact,
	contactField: ContactField,
	creditNote: CreditNote,
	creditNotePos: CreditNotePos,
	export: Export,
	part: Part,
	invoice: Invoice,
	invoicePos: InvoicePos,
	layout: Layout,
	order: Order,
	orderPos: OrderPos,
	voucher: Voucher,
	voucherPos: VoucherPos,
	report: Report,
	tag: Tag,
} as const;
