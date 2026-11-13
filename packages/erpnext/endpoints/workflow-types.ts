import { z } from 'zod';

// ── Schemas for the `workflow` family ─────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources: frappe/model/
// workflow.py (the frappe.model.workflow whitelist: apply_workflow,
// get_transitions) and frappe/handler.py (every /api/method answer wraps its
// result in a `message` key). A Frappe document — and each Workflow Transition
// child row — is an open field bag, so payloads validate as open records and
// only the wire envelope (message) is checked. Input objects are .strict() so
// typos fail at the boundary, and get_transitions' JSON-string `doc` query is
// passed verbatim exactly as Frappe documents it (the provider parses it with
// frappe.parse_json), with the field names staying provider-verbatim (doc,
// action, workflow).

// unknown: a Frappe document is an open record of provider-defined field
// values; no static schema can enumerate them across DocTypes, so the payload
// stays a string-keyed bag of JSON values.
const ErpnextWorkflowDocumentSchema = z.record(z.string(), z.unknown());

// frappe.model.workflow.apply_workflow resolves the target with
// frappe.get_doc(frappe.parse_json(doc)) and then doc.load_from_db(), which
// requires the doctype field (frappe/model/workflow.py: apply_workflow), so
// the open record is refined to require it.
const WorkflowDocumentWithDoctypeSchema = ErpnextWorkflowDocumentSchema.refine(
	(doc) => typeof doc.doctype === 'string' && doc.doctype.length > 0,
	{ message: 'the document object must carry its doctype field' },
);

// POST /api/method/frappe.model.workflow.apply_workflow — doc identifies the
// document to act on and action names the workflow transition to apply
// (frappe/model/workflow.py: def apply_workflow(doc, action)).
const WorkflowApplyInputSchema = z
	.object({
		body: z
			.object({
				doc: WorkflowDocumentWithDoctypeSchema,
				action: z.string().min(1),
			})
			.strict(),
	})
	.strict();

// GET /api/method/frappe.model.workflow.get_transitions — doc travels as a
// query parameter and stays a JSON object string of {doctype, name} exactly as
// Frappe documents it: the provider parses it server-side with
// frappe.parse_json (workflow.py: get_transitions). workflow optionally names
// the Workflow to consult instead of the doctype's active one.
const WorkflowGetTransitionsInputSchema = z
	.object({
		doc: z
			.string()
			.min(1)
			.describe(
				'JSON object string identifying the document, for example {"doctype":"Sales Invoice","name":"ACC-SINV-2026-00001"}, passed verbatim to Frappe',
			),
		workflow: z
			.string()
			.optional()
			.describe(
				'Name of the Workflow to consult; defaults to the active workflow on the document type',
			),
	})
	.strict();

// ── Output envelopes ──────────────────────────────────────────────────────────

// apply_workflow answers the updated document after the transition
// (workflow.py returns doc) and the /api/method wrapper nests it under
// `message`.
// unknown: the answered document is an open record of provider-defined field
// values that vary by DocType and workflow state, so only the message key
// holding a document-shaped open record is enforced.
const WorkflowApplyOutputSchema = z
	.object({
		message: ErpnextWorkflowDocumentSchema,
	})
	.loose();

// get_transitions answers the transitions the calling user can apply in the
// document's current state (workflow.py appends one transition.as_dict() row
// per allowed transition) nested under `message`.
// unknown: rows are Workflow Transition child records — action, state,
// next_state, allowed, and condition fields vary per workflow configuration —
// so rows validate as string-keyed records of JSON values.
const ErpnextWorkflowTransitionSchema = z.record(z.string(), z.unknown());

const WorkflowGetTransitionsOutputSchema = z
	.object({
		message: z.array(ErpnextWorkflowTransitionSchema),
	})
	.loose();

// ── Registry ──────────────────────────────────────────────────────────────────

export const WorkflowInputSchemas = {
	'workflow.apply': WorkflowApplyInputSchema,
	'workflow.getTransitions': WorkflowGetTransitionsInputSchema,
} as const;

export const WorkflowOutputSchemas = {
	'workflow.apply': WorkflowApplyOutputSchema,
	'workflow.getTransitions': WorkflowGetTransitionsOutputSchema,
} as const;
