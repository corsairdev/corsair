import { z } from 'zod';

// --- Profiles ---
export const ProfileSchema = z.object({
	id: z.string(),
	name: z.string(),
	updated_at: z.number().optional(),
});
export const ListProfilesInputSchema = z.object({});
export const ListProfilesOutputSchema = z.object({
	body: z.object({ profiles: z.array(ProfileSchema) }),
});
export const GetProfileInputSchema = z.object({ id: z.string() });
export const GetProfileOutputSchema = z.object({
	body: z.object({ profile: ProfileSchema }),
});
export const CreateProfileInputSchema = z.object({ name: z.string() });
export const CreateProfileOutputSchema = GetProfileOutputSchema;
export const UpdateProfileInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
});
export const UpdateProfileOutputSchema = GetProfileOutputSchema;
export const DeleteProfileInputSchema = z.object({ id: z.string() });
export const DeleteProfileOutputSchema = z.object({ success: z.boolean() });

// --- Devices ---
export const DeviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	profile_id: z.string().optional(),
});
export const ListDevicesInputSchema = z.object({});
export const ListDevicesOutputSchema = z.object({
	body: z.object({ devices: z.array(DeviceSchema) }),
});
export const GetDeviceInputSchema = z.object({ id: z.string() });
export const GetDeviceOutputSchema = z.object({
	body: z.object({ device: DeviceSchema }),
});
export const CreateDeviceInputSchema = z.object({
	name: z.string(),
	profile_id: z.string().optional(),
});
export const CreateDeviceOutputSchema = GetDeviceOutputSchema;
export const UpdateDeviceInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	profile_id: z.string().optional(),
});
export const UpdateDeviceOutputSchema = GetDeviceOutputSchema;
export const DeleteDeviceInputSchema = z.object({ id: z.string() });
export const DeleteDeviceOutputSchema = z.object({ success: z.boolean() });

// --- Rules ---
export const RuleSchema = z.object({
	id: z.string(),
	domain: z.string(),
	action: z.enum(['block', 'bypass', 'redirect']),
});
export const ListRulesInputSchema = z.object({ profile_id: z.string() });
export const ListRulesOutputSchema = z.object({
	body: z.object({ rules: z.array(RuleSchema) }),
});
export const CreateRuleInputSchema = z.object({
	profile_id: z.string(),
	domain: z.string(),
	action: z.enum(['block', 'bypass', 'redirect']),
});
export const CreateRuleOutputSchema = z.object({
	body: z.object({ rule: RuleSchema }),
});
export const UpdateRuleInputSchema = z.object({
	profile_id: z.string(),
	id: z.string(),
	action: z.enum(['block', 'bypass', 'redirect']).optional(),
});
export const UpdateRuleOutputSchema = CreateRuleOutputSchema;
export const DeleteRuleInputSchema = z.object({
	profile_id: z.string(),
	id: z.string(),
});
export const DeleteRuleOutputSchema = z.object({ success: z.boolean() });

export type ControlDEndpointInputs = {
	listProfiles: z.infer<typeof ListProfilesInputSchema>;
	getProfile: z.infer<typeof GetProfileInputSchema>;
	createProfile: z.infer<typeof CreateProfileInputSchema>;
	updateProfile: z.infer<typeof UpdateProfileInputSchema>;
	deleteProfile: z.infer<typeof DeleteProfileInputSchema>;
	listDevices: z.infer<typeof ListDevicesInputSchema>;
	getDevice: z.infer<typeof GetDeviceInputSchema>;
	createDevice: z.infer<typeof CreateDeviceInputSchema>;
	updateDevice: z.infer<typeof UpdateDeviceInputSchema>;
	deleteDevice: z.infer<typeof DeleteDeviceInputSchema>;
	listRules: z.infer<typeof ListRulesInputSchema>;
	createRule: z.infer<typeof CreateRuleInputSchema>;
	updateRule: z.infer<typeof UpdateRuleInputSchema>;
	deleteRule: z.infer<typeof DeleteRuleInputSchema>;
};

export type ControlDEndpointOutputs = {
	listProfiles: z.infer<typeof ListProfilesOutputSchema>;
	getProfile: z.infer<typeof GetProfileOutputSchema>;
	createProfile: z.infer<typeof CreateProfileOutputSchema>;
	updateProfile: z.infer<typeof UpdateProfileOutputSchema>;
	deleteProfile: z.infer<typeof DeleteProfileOutputSchema>;
	listDevices: z.infer<typeof ListDevicesOutputSchema>;
	getDevice: z.infer<typeof GetDeviceOutputSchema>;
	createDevice: z.infer<typeof CreateDeviceOutputSchema>;
	updateDevice: z.infer<typeof UpdateDeviceOutputSchema>;
	deleteDevice: z.infer<typeof DeleteDeviceOutputSchema>;
	listRules: z.infer<typeof ListRulesOutputSchema>;
	createRule: z.infer<typeof CreateRuleOutputSchema>;
	updateRule: z.infer<typeof UpdateRuleOutputSchema>;
	deleteRule: z.infer<typeof DeleteRuleOutputSchema>;
};

export const ControlDEndpointInputSchemas = {
	listProfiles: ListProfilesInputSchema,
	getProfile: GetProfileInputSchema,
	createProfile: CreateProfileInputSchema,
	updateProfile: UpdateProfileInputSchema,
	deleteProfile: DeleteProfileInputSchema,
	listDevices: ListDevicesInputSchema,
	getDevice: GetDeviceInputSchema,
	createDevice: CreateDeviceInputSchema,
	updateDevice: UpdateDeviceInputSchema,
	deleteDevice: DeleteDeviceInputSchema,
	listRules: ListRulesInputSchema,
	createRule: CreateRuleInputSchema,
	updateRule: UpdateRuleInputSchema,
	deleteRule: DeleteRuleInputSchema,
} as const;

export const ControlDEndpointOutputSchemas = {
	listProfiles: ListProfilesOutputSchema,
	getProfile: GetProfileOutputSchema,
	createProfile: CreateProfileOutputSchema,
	updateProfile: UpdateProfileOutputSchema,
	deleteProfile: DeleteProfileOutputSchema,
	listDevices: ListDevicesOutputSchema,
	getDevice: GetDeviceOutputSchema,
	createDevice: CreateDeviceOutputSchema,
	updateDevice: UpdateDeviceOutputSchema,
	deleteDevice: DeleteDeviceOutputSchema,
	listRules: ListRulesOutputSchema,
	createRule: CreateRuleOutputSchema,
	updateRule: UpdateRuleOutputSchema,
	deleteRule: DeleteRuleOutputSchema,
} as const;
