import { z } from 'zod';

const IdSchema = z.coerce.number().int().positive();
const UserSchema = z.object({ id: IdSchema.optional(), name: z.string().optional(), tel: z.string().optional(), email: z.string().optional(), role: z.string().optional() }).loose();
const WidgetSchema = z.object({ id: IdSchema.optional(), url: z.string().optional(), description: z.string().optional(), locale_code: z.string().optional(), enabled: z.boolean().optional(), settings: z.unknown().optional() }).loose();

const Empty = z.object({}).passthrough();
const AnyResponse = z.unknown();

export const CallPageEndpointInputSchemas = {
  callsGet: z.object({ callId: IdSchema }),
  callsHistory: z.object({
    display_hidden: z.number().int().optional(), call_id: z.array(IdSchema).optional(), phone_number: z.string().optional(),
    user_ids: z.array(IdSchema).optional(), statuses: z.array(z.string()).optional(), tag_ids: z.array(IdSchema).optional(),
    date_from: z.number().int().optional(), date_to: z.number().int().optional(), widget_ids: z.array(IdSchema).optional(),
    limit: z.number().int().positive().max(1000).optional(), offset: z.number().int().nonnegative().optional(), url: z.string().optional(),
    incoming_number_ids: z.array(IdSchema).optional(), tel: z.string().optional(), widget_id: IdSchema.optional(),
  }),
  usersList: z.object({ offset: z.number().int().nonnegative().optional(), limit: z.number().int().positive().max(1000).optional() }),
  usersGet: z.object({ id: IdSchema }),
  usersCreate: z.object({ name: z.string().min(1), tel: z.string().min(1), email: z.string().email().optional(), role: z.enum(['admin', 'manager']).optional() }),
  usersUpdate: z.object({ id: IdSchema, name: z.string().min(1), tel: z.string().min(1), email: z.string().email().optional(), role: z.enum(['admin', 'manager']).optional() }),
  usersDelete: z.object({ id: IdSchema }),
  widgetsGet: z.object({ id: IdSchema.optional(), widget_id: IdSchema.optional(), encrypted_id: z.string().optional() }).refine(v => v.id !== undefined || v.widget_id !== undefined || v.encrypted_id !== undefined),
  widgetsCreate: z.object({ url: z.string().url(), description: z.string().optional(), settings: z.unknown().optional(), locale_code: z.string().optional(), enabled: z.boolean().optional() }),
  widgetsUpdate: z.object({ id: IdSchema, url: z.string().url(), description: z.string().optional(), settings: z.unknown().optional(), locale_code: z.string().optional(), enabled: z.boolean().optional() }),
  widgetsDelete: z.object({ id: IdSchema }),
  widgetsCall: z.object({ id: IdSchema, tel: z.string().min(1), department_id: IdSchema.optional(), manager_id: IdSchema.optional() }).refine(v => !(v.department_id !== undefined && v.manager_id !== undefined)),
  widgetsCallOrSchedule: z.object({ id: IdSchema, tel: z.string().min(1), department_id: IdSchema.optional() }),
} as const;

export const CallPageEndpointOutputSchemas = {
  callsGet: AnyResponse,
  callsHistory: AnyResponse,
  usersList: z.array(UserSchema).or(z.object({ items: z.array(UserSchema) }).loose()),
  usersGet: UserSchema.or(AnyResponse),
  usersCreate: AnyResponse,
  usersUpdate: AnyResponse,
  usersDelete: AnyResponse,
  widgetsGet: WidgetSchema.or(AnyResponse),
  widgetsCreate: AnyResponse,
  widgetsUpdate: AnyResponse,
  widgetsDelete: AnyResponse,
  widgetsCall: AnyResponse,
  widgetsCallOrSchedule: AnyResponse,
} as const;

export type CallPageEndpointInputs = { [K in keyof typeof CallPageEndpointInputSchemas]: z.infer<(typeof CallPageEndpointInputSchemas)[K]> };
export type CallPageEndpointOutputs = { [K in keyof typeof CallPageEndpointOutputSchemas]: z.infer<(typeof CallPageEndpointOutputSchemas)[K]> };
