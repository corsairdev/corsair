import { z } from 'zod';

// Contract fields are transcribed from https://docs.postalytics.com/references/postalytics-rest-api.
const safePath = z
	.string()
	.min(1)
	.refine(
		(value) =>
			value !== '.' &&
			value !== '..' &&
			!/[\/\\"'%\u0000-\u001f\u007f]/.test(value),
		'Unsafe path segment',
	);

export const getIntegrationsInputSchema = z.object({});
export const getIntegrationsOutputSchema = z.array(
	z
		.object({
			displayName: z.string().nullable().optional(),
			intergrationName: z.string().nullable().optional(),
			isConnect: z.number().int().optional(),
			pluginId: z.number().int().optional(),
			userPluginId: z.number().int().optional(),
		})
		.passthrough(),
);

export const getMyAccountInputSchema = z.object({});
export const getMyAccountOutputSchema = z.array(
	z
		.object({
			account_id: z.number().int().optional(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			api_key: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().optional(),
			email_address: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			password: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			username: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getAccountInputSchema = z.object({ id: z.number().int() });
export const getAccountOutputSchema = z.array(
	z
		.object({
			account_id: z.number().int().optional(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			api_key: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().optional(),
			email_address: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			password: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			username: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createNewAccountInputSchema = z.object({
	body: z
		.object({
			first_name: z.string(),
			last_name: z.string(),
			password: z.string(),
			username: z.string(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createNewAccountOutputSchema = z
	.object({
		account_id: z.string().nullable().optional(),
		api_key: z.string().nullable().optional(),
		created_date: z.string().optional(),
	})
	.passthrough();

export const updateAccountInputSchema = z.object({
	body: z
		.object({
			first_name: z.string(),
			last_name: z.string(),
			password: z.string(),
			username: z.string(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const updateAccountOutputSchema = z
	.object({
		account_id: z.number().int().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();

export const deleteAccountInputSchema = z.object({ id: z.number().int() });
export const deleteAccountOutputSchema = z
	.object({
		account_id: z.number().int().optional(),
		deleted_date: z.string().optional(),
	})
	.passthrough();

export const getAllCampaignsInputSchema = z.object({});
export const getAllCampaignsOutputSchema = z.array(
	z
		.object({
			audience: z.number().int().optional(),
			campaign_id: z.number().int().optional(),
			campaign_type: z.number().int().optional(),
			conversions: z.number().int().optional(),
			created_date: z.string().optional(),
			creative_type: z.number().int().optional(),
			delivered: z.number().int().optional(),
			drop_id: z.number().int().optional(),
			endpoint: z.string().nullable().optional(),
			in_local_area: z.number().int().optional(),
			in_transit: z.number().int().optional(),
			is_live_mode: z.number().int().optional(),
			name: z.string().nullable().optional(),
			pageviews: z.number().int().optional(),
			processed_for_delivery: z.number().int().optional(),
			returned: z.number().int().optional(),
			send_date: z.string().optional(),
			status: z.number().int().optional(),
			thumbnail: z.string().nullable().optional(),
			thumbnail_back: z.string().nullable().optional(),
			unique_pageviews: z.number().int().optional(),
			unique_visitors: z.number().int().optional(),
		})
		.passthrough(),
);

export const getAllDripCampaignsInputSchema = z.object({});
export const getAllDripCampaignsOutputSchema = z.array(
	z
		.object({
			endpoint_id: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getCampaignStatsInputSchema = z.object({ id: z.number().int() });
export const getCampaignStatsOutputSchema = z.array(
	z
		.object({
			audience: z.number().int().optional(),
			campaign_id: z.number().int().optional(),
			campaign_type: z.number().int().optional(),
			conversions: z.number().int().optional(),
			created_date: z.string().optional(),
			creative_type: z.number().int().optional(),
			delivered: z.number().int().optional(),
			drop_id: z.number().int().optional(),
			endpoint: z.string().nullable().optional(),
			in_local_area: z.number().int().optional(),
			in_transit: z.number().int().optional(),
			is_live_mode: z.number().int().optional(),
			name: z.string().nullable().optional(),
			pageviews: z.number().int().optional(),
			processed_for_delivery: z.number().int().optional(),
			returned: z.number().int().optional(),
			send_date: z.string().optional(),
			status: z.number().int().optional(),
			thumbnail: z.string().nullable().optional(),
			thumbnail_back: z.string().nullable().optional(),
			unique_pageviews: z.number().int().optional(),
			unique_visitors: z.number().int().optional(),
		})
		.passthrough(),
);

export const getCampaignInputSchema = z.object({ id: z.number().int() });
export const getCampaignOutputSchema = z
	.object({
		ContactListId: z.number().int().optional(),
		DirectMailDropId: z.number().int().optional(),
		DirectMailName: z.string().nullable().optional(),
		EndPointId: z.string().nullable().optional(),
		Status: z.number().int().optional(),
	})
	.passthrough();

export const getCampaignEventsInputSchema = z.object({
	id: z.number().int(),
	PageNumber: z.number().int().optional(),
	PageSize: z.number().int().optional(),
});
export const getCampaignEventsOutputSchema = z.array(
	z
		.object({
			address: z.string().nullable().optional(),
			address_2: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			dataid: z.number().int().optional(),
			event_date: z.string().optional(),
			event_name: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			metadata: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			zip: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getContactEventInputSchema = z.object({
	dataid: z.number().int(),
	id: z.number().int(),
	PageNumber: z.number().int().optional(),
	PageSize: z.number().int().optional(),
});
export const getContactEventOutputSchema = z.array(
	z
		.object({
			address: z.string().nullable().optional(),
			address_2: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			dataid: z.number().int().optional(),
			event_date: z.string().optional(),
			event_name: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			metadata: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			zip: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createNewCampaignInputSchema = z.object({
	body: z
		.object({
			CreditTypeId: z.number().int(),
			DirectMailName: z.string(),
			PostageType: z.number().int(),
			SenderAddress1: z.string(),
			SenderCity: z.string(),
			SenderName: z.string(),
			SenderState: z.string(),
			SenderZip: z.string(),
			TemplateFrontId: z.number().int(),
			SenderAddress2: z.string().nullable().optional(),
			SenderCountry: z.string().nullable().optional(),
			TemplateEnvelopeId: z.number().int().optional(),
		})
		.passthrough(),
});
export const createNewCampaignOutputSchema = z
	.object({
		created_date: z.string().optional(),
		drop_id: z.number().int().optional(),
	})
	.passthrough();

export const updateCampaignStatusInputSchema = z.object({
	id: z.number().int(),
});
export const updateCampaignStatusOutputSchema = z
	.object({ updated_date: z.string().optional() })
	.passthrough();

export const deleteCampaignInputSchema = z.object({ id: z.number().int() });
export const deleteCampaignOutputSchema = z
	.object({ deleted_date: z.string().optional() })
	.passthrough();

export const getAllContactListsInputSchema = z.object({});
export const getAllContactListsOutputSchema = z.array(
	z
		.object({
			contact_list_id: z.number().int().optional(),
			count: z.number().int().optional(),
			created_date: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getContactInputSchema = z.object({ id: z.number().int() });
export const getContactOutputSchema = z
	.object({
		Address: z.string().nullable().optional(),
		Address2: z.string().nullable().optional(),
		AddressStatusId: z.number().int().optional(),
		City: z.string().nullable().optional(),
		Company: z.string().nullable().optional(),
		ContactListId: z.number().int().optional(),
		Country: z.number().int().optional(),
		EmailId: z.string().nullable().optional(),
		FirstName: z.string().nullable().optional(),
		Id: z.number().int().optional(),
		LastName: z.string().nullable().optional(),
		Mobile: z.string().nullable().optional(),
		Occupation: z.string().nullable().optional(),
		Phone: z.string().nullable().optional(),
		Purl: z.string().nullable().optional(),
		QRCode: z.string().nullable().optional(),
		State: z.string().nullable().optional(),
		VarField1: z.string().nullable().optional(),
		VarField10: z.string().nullable().optional(),
		VarField11: z.string().nullable().optional(),
		VarField12: z.string().nullable().optional(),
		VarField13: z.string().nullable().optional(),
		VarField14: z.string().nullable().optional(),
		VarField15: z.string().nullable().optional(),
		VarField16: z.string().nullable().optional(),
		VarField17: z.string().nullable().optional(),
		VarField18: z.string().nullable().optional(),
		VarField19: z.string().nullable().optional(),
		VarField2: z.string().nullable().optional(),
		VarField20: z.string().nullable().optional(),
		VarField21: z.string().nullable().optional(),
		VarField22: z.string().nullable().optional(),
		VarField23: z.string().nullable().optional(),
		VarField24: z.string().nullable().optional(),
		VarField25: z.string().nullable().optional(),
		VarField26: z.string().nullable().optional(),
		VarField27: z.string().nullable().optional(),
		VarField28: z.string().nullable().optional(),
		VarField29: z.string().nullable().optional(),
		VarField3: z.string().nullable().optional(),
		VarField30: z.string().nullable().optional(),
		VarField31: z.string().nullable().optional(),
		VarField32: z.string().nullable().optional(),
		VarField33: z.string().nullable().optional(),
		VarField34: z.string().nullable().optional(),
		VarField35: z.string().nullable().optional(),
		VarField4: z.string().nullable().optional(),
		VarField5: z.string().nullable().optional(),
		VarField6: z.string().nullable().optional(),
		VarField7: z.string().nullable().optional(),
		VarField8: z.string().nullable().optional(),
		VarField9: z.string().nullable().optional(),
		Website: z.string().nullable().optional(),
		Zip: z.string().nullable().optional(),
	})
	.passthrough();

export const getContactsOnListInputSchema = z.object({
	id: z.number().int(),
	limit: z.number().int().optional(),
	start: z.number().int().optional(),
});
export const getContactsOnListOutputSchema = z.array(
	z
		.object({
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_street2: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			contact_id: z.number().int().optional(),
			contact_list_id: z.number().int().optional(),
			created_date: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			mobile_phone: z.string().nullable().optional(),
			occupation: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			row: z.number().int().optional(),
			var_field1: z.string().nullable().optional(),
			var_field10: z.string().nullable().optional(),
			var_field11: z.string().nullable().optional(),
			var_field12: z.string().nullable().optional(),
			var_field13: z.string().nullable().optional(),
			var_field14: z.string().nullable().optional(),
			var_field15: z.string().nullable().optional(),
			var_field16: z.string().nullable().optional(),
			var_field17: z.string().nullable().optional(),
			var_field18: z.string().nullable().optional(),
			var_field19: z.string().nullable().optional(),
			var_field2: z.string().nullable().optional(),
			var_field20: z.string().nullable().optional(),
			var_field21: z.string().nullable().optional(),
			var_field22: z.string().nullable().optional(),
			var_field23: z.string().nullable().optional(),
			var_field24: z.string().nullable().optional(),
			var_field25: z.string().nullable().optional(),
			var_field26: z.string().nullable().optional(),
			var_field27: z.string().nullable().optional(),
			var_field28: z.string().nullable().optional(),
			var_field29: z.string().nullable().optional(),
			var_field3: z.string().nullable().optional(),
			var_field30: z.string().nullable().optional(),
			var_field31: z.string().nullable().optional(),
			var_field32: z.string().nullable().optional(),
			var_field33: z.string().nullable().optional(),
			var_field34: z.string().nullable().optional(),
			var_field35: z.string().nullable().optional(),
			var_field4: z.string().nullable().optional(),
			var_field5: z.string().nullable().optional(),
			var_field6: z.string().nullable().optional(),
			var_field7: z.string().nullable().optional(),
			var_field8: z.string().nullable().optional(),
			var_field9: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createContactOnListInputSchema = z.object({
	body: z
		.object({
			contact_id: z.number().int(),
			contact_list_id: z.number().int(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_street2: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			mobile_phone: z.string().nullable().optional(),
			occupation: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			var_field_1: z.string().nullable().optional(),
			var_field_10: z.string().nullable().optional(),
			var_field_11: z.string().nullable().optional(),
			var_field_12: z.string().nullable().optional(),
			var_field_13: z.string().nullable().optional(),
			var_field_14: z.string().nullable().optional(),
			var_field_15: z.string().nullable().optional(),
			var_field_16: z.string().nullable().optional(),
			var_field_17: z.string().nullable().optional(),
			var_field_18: z.string().nullable().optional(),
			var_field_19: z.string().nullable().optional(),
			var_field_2: z.string().nullable().optional(),
			var_field_20: z.string().nullable().optional(),
			var_field_21: z.string().nullable().optional(),
			var_field_22: z.string().nullable().optional(),
			var_field_23: z.string().nullable().optional(),
			var_field_24: z.string().nullable().optional(),
			var_field_25: z.string().nullable().optional(),
			var_field_26: z.string().nullable().optional(),
			var_field_27: z.string().nullable().optional(),
			var_field_28: z.string().nullable().optional(),
			var_field_29: z.string().nullable().optional(),
			var_field_3: z.string().nullable().optional(),
			var_field_30: z.string().nullable().optional(),
			var_field_31: z.string().nullable().optional(),
			var_field_32: z.string().nullable().optional(),
			var_field_33: z.string().nullable().optional(),
			var_field_34: z.string().nullable().optional(),
			var_field_35: z.string().nullable().optional(),
			var_field_4: z.string().nullable().optional(),
			var_field_5: z.string().nullable().optional(),
			var_field_6: z.string().nullable().optional(),
			var_field_7: z.string().nullable().optional(),
			var_field_8: z.string().nullable().optional(),
			var_field_9: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createContactOnListOutputSchema = z
	.object({ created_date: z.string().optional() })
	.passthrough();

export const updateContactOnListInputSchema = z.object({
	body: z
		.object({
			contact_id: z.number().int(),
			contact_list_id: z.number().int(),
			address_city: z.string().nullable().optional(),
			address_state: z.string().nullable().optional(),
			address_street: z.string().nullable().optional(),
			address_street2: z.string().nullable().optional(),
			address_zip: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			mobile_phone: z.string().nullable().optional(),
			occupation: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			var_field_1: z.string().nullable().optional(),
			var_field_10: z.string().nullable().optional(),
			var_field_11: z.string().nullable().optional(),
			var_field_12: z.string().nullable().optional(),
			var_field_13: z.string().nullable().optional(),
			var_field_14: z.string().nullable().optional(),
			var_field_15: z.string().nullable().optional(),
			var_field_16: z.string().nullable().optional(),
			var_field_17: z.string().nullable().optional(),
			var_field_18: z.string().nullable().optional(),
			var_field_19: z.string().nullable().optional(),
			var_field_2: z.string().nullable().optional(),
			var_field_20: z.string().nullable().optional(),
			var_field_21: z.string().nullable().optional(),
			var_field_22: z.string().nullable().optional(),
			var_field_23: z.string().nullable().optional(),
			var_field_24: z.string().nullable().optional(),
			var_field_25: z.string().nullable().optional(),
			var_field_26: z.string().nullable().optional(),
			var_field_27: z.string().nullable().optional(),
			var_field_28: z.string().nullable().optional(),
			var_field_29: z.string().nullable().optional(),
			var_field_3: z.string().nullable().optional(),
			var_field_30: z.string().nullable().optional(),
			var_field_31: z.string().nullable().optional(),
			var_field_32: z.string().nullable().optional(),
			var_field_33: z.string().nullable().optional(),
			var_field_34: z.string().nullable().optional(),
			var_field_35: z.string().nullable().optional(),
			var_field_4: z.string().nullable().optional(),
			var_field_5: z.string().nullable().optional(),
			var_field_6: z.string().nullable().optional(),
			var_field_7: z.string().nullable().optional(),
			var_field_8: z.string().nullable().optional(),
			var_field_9: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const updateContactOnListOutputSchema = z
	.object({ updated_date: z.string().optional() })
	.passthrough();

export const deleteContactInputSchema = z.object({ id: z.number().int() });
export const deleteContactOutputSchema = z
	.object({ deleted_date: z.string().optional() })
	.passthrough();

export const getAllFlowsInputSchema = z.object({});
export const getAllFlowsOutputSchema = z.array(
	z
		.object({
			contactListId: z.number().int().optional(),
			createDate: z.string().optional(),
			endpointId: z.string().nullable().optional(),
			flowId: z.number().int().optional(),
			isActive: z.boolean().optional(),
			lastModifiedDate: z.string().optional(),
			name: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getFlowInputSchema = z.object({ endpointId: safePath });
export const getFlowOutputSchema = z
	.object({
		contactListId: z.number().int().optional(),
		createDate: z.string().optional(),
		endpointId: z.string().nullable().optional(),
		flowId: z.number().int().optional(),
		isActive: z.boolean().optional(),
		lastModifiedDate: z.string().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

export const enrollContactToFlowInputSchema = z.object({
	endPoint: safePath,
	body: z
		.object({
			address_city: z.string(),
			address_state: z.string(),
			address_street: z.string(),
			address_zip: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			address_street2: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			mobile_phone: z.string().nullable().optional(),
			occupation: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			var_field_1: z.string().nullable().optional(),
			var_field_10: z.string().nullable().optional(),
			var_field_11: z.string().nullable().optional(),
			var_field_12: z.string().nullable().optional(),
			var_field_13: z.string().nullable().optional(),
			var_field_14: z.string().nullable().optional(),
			var_field_15: z.string().nullable().optional(),
			var_field_16: z.string().nullable().optional(),
			var_field_17: z.string().nullable().optional(),
			var_field_18: z.string().nullable().optional(),
			var_field_19: z.string().nullable().optional(),
			var_field_2: z.string().nullable().optional(),
			var_field_20: z.string().nullable().optional(),
			var_field_21: z.string().nullable().optional(),
			var_field_22: z.string().nullable().optional(),
			var_field_23: z.string().nullable().optional(),
			var_field_24: z.string().nullable().optional(),
			var_field_25: z.string().nullable().optional(),
			var_field_26: z.string().nullable().optional(),
			var_field_27: z.string().nullable().optional(),
			var_field_28: z.string().nullable().optional(),
			var_field_29: z.string().nullable().optional(),
			var_field_3: z.string().nullable().optional(),
			var_field_30: z.string().nullable().optional(),
			var_field_31: z.string().nullable().optional(),
			var_field_32: z.string().nullable().optional(),
			var_field_33: z.string().nullable().optional(),
			var_field_34: z.string().nullable().optional(),
			var_field_35: z.string().nullable().optional(),
			var_field_4: z.string().nullable().optional(),
			var_field_5: z.string().nullable().optional(),
			var_field_6: z.string().nullable().optional(),
			var_field_7: z.string().nullable().optional(),
			var_field_8: z.string().nullable().optional(),
			var_field_9: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const enrollContactToFlowOutputSchema = z
	.object({
		contactListId: z.number().int().optional(),
		createDate: z.string().optional(),
		endpointId: z.string().nullable().optional(),
		flowId: z.number().int().optional(),
		isActive: z.boolean().optional(),
		lastModifiedDate: z.string().optional(),
		name: z.string().nullable().optional(),
		send_date: z.string().optional(),
	})
	.passthrough();

export const unenrollContactFromFlowInputSchema = z.object({
	dataId: z.number().int(),
	endPoint: safePath,
});
export const unenrollContactFromFlowOutputSchema = z
	.object({ unenrolled_date: z.string().optional() })
	.passthrough();

export const createLoginLinkInputSchema = z.object({
	body: z
		.object({
			api_key: z.string(),
			domain: z.string().nullable().optional(),
			id: z.string().nullable().optional(),
			url: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createLoginLinkOutputSchema = z
	.object({
		CreatedDate: z.string().optional(),
		LoginLink: z.string().nullable().optional(),
	})
	.passthrough();

export const sendMailInputSchema = z.object({
	endPoint: safePath,
	body: z
		.object({
			address_city: z.string(),
			address_state: z.string(),
			address_street: z.string(),
			address_zip: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			address_street2: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			email_address: z.string().nullable().optional(),
			mobile_phone: z.string().nullable().optional(),
			occupation: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			var_field_1: z.string().nullable().optional(),
			var_field_10: z.string().nullable().optional(),
			var_field_11: z.string().nullable().optional(),
			var_field_12: z.string().nullable().optional(),
			var_field_13: z.string().nullable().optional(),
			var_field_14: z.string().nullable().optional(),
			var_field_15: z.string().nullable().optional(),
			var_field_16: z.string().nullable().optional(),
			var_field_17: z.string().nullable().optional(),
			var_field_18: z.string().nullable().optional(),
			var_field_19: z.string().nullable().optional(),
			var_field_2: z.string().nullable().optional(),
			var_field_20: z.string().nullable().optional(),
			var_field_21: z.string().nullable().optional(),
			var_field_22: z.string().nullable().optional(),
			var_field_23: z.string().nullable().optional(),
			var_field_24: z.string().nullable().optional(),
			var_field_25: z.string().nullable().optional(),
			var_field_26: z.string().nullable().optional(),
			var_field_27: z.string().nullable().optional(),
			var_field_28: z.string().nullable().optional(),
			var_field_29: z.string().nullable().optional(),
			var_field_3: z.string().nullable().optional(),
			var_field_30: z.string().nullable().optional(),
			var_field_31: z.string().nullable().optional(),
			var_field_32: z.string().nullable().optional(),
			var_field_33: z.string().nullable().optional(),
			var_field_34: z.string().nullable().optional(),
			var_field_35: z.string().nullable().optional(),
			var_field_4: z.string().nullable().optional(),
			var_field_5: z.string().nullable().optional(),
			var_field_6: z.string().nullable().optional(),
			var_field_7: z.string().nullable().optional(),
			var_field_8: z.string().nullable().optional(),
			var_field_9: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const sendMailOutputSchema = z
	.object({ send_date: z.string().optional() })
	.passthrough();

export const getSuppressionListsInputSchema = z.object({
	id: z.number().int().optional(),
});
export const getSuppressionListsOutputSchema = z.array(
	z
		.object({
			Country: z.string().nullable().optional(),
			CreationDate: z.string().optional(),
			Id: z.number().int().optional(),
			Name: z.string().nullable().optional(),
			Total: z.number().int().optional(),
			Type: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getSuppressionListInputSchema = z.object({ id: z.number().int() });
export const getSuppressionListOutputSchema = z.array(
	z
		.object({
			Country: z.string().nullable().optional(),
			CreationDate: z.string().optional(),
			Id: z.number().int().optional(),
			Name: z.string().nullable().optional(),
			Total: z.number().int().optional(),
			Type: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createSuppressionListInputSchema = z.object({
	body: z
		.object({
			Country: z.string().nullable().optional(),
			Name: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createSuppressionListOutputSchema = z.array(
	z
		.object({
			Country: z.string().nullable().optional(),
			CreationDate: z.string().optional(),
			Id: z.number().int().optional(),
			Name: z.string().nullable().optional(),
			Total: z.number().int().optional(),
			Type: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const deleteSuppressionListInputSchema = z.object({
	id: z.number().int(),
});
export const deleteSuppressionListOutputSchema = z
	.object({ Message: z.string().nullable().optional() })
	.passthrough();

export const getSuppressionListContactsInputSchema = z.object({
	listId: z.number().int(),
	offset: z.number().int().optional(),
});
export const getSuppressionListContactsOutputSchema = z
	.object({
		ContactDetails: z.array(
			z
				.object({
					Address: z.string().nullable().optional(),
					Address2: z.string().nullable().optional(),
					City: z.string().nullable().optional(),
					Company: z.string().nullable().optional(),
					Country: z.string().nullable().optional(),
					CreatedDate: z.string().nullable().optional(),
					DataId: z.number().int().optional(),
					Email: z.string().nullable().optional(),
					FirstName: z.string().nullable().optional(),
					HasValidAddress: z.boolean().optional(),
					LastName: z.string().nullable().optional(),
					LastUpdateDate: z.string().nullable().optional(),
					ListId: z.number().int().optional(),
					Mobile: z.string().nullable().optional(),
					Occupation: z.string().nullable().optional(),
					Phone: z.string().nullable().optional(),
					State: z.string().nullable().optional(),
					VarField1: z.string().nullable().optional(),
					VarField10: z.string().nullable().optional(),
					VarField11: z.string().nullable().optional(),
					VarField12: z.string().nullable().optional(),
					VarField13: z.string().nullable().optional(),
					VarField14: z.string().nullable().optional(),
					VarField15: z.string().nullable().optional(),
					VarField16: z.string().nullable().optional(),
					VarField17: z.string().nullable().optional(),
					VarField18: z.string().nullable().optional(),
					VarField19: z.string().nullable().optional(),
					VarField2: z.string().nullable().optional(),
					VarField20: z.string().nullable().optional(),
					VarField21: z.string().nullable().optional(),
					VarField22: z.string().nullable().optional(),
					VarField23: z.string().nullable().optional(),
					VarField24: z.string().nullable().optional(),
					VarField25: z.string().nullable().optional(),
					VarField26: z.string().nullable().optional(),
					VarField27: z.string().nullable().optional(),
					VarField28: z.string().nullable().optional(),
					VarField29: z.string().nullable().optional(),
					VarField3: z.string().nullable().optional(),
					VarField30: z.string().nullable().optional(),
					VarField31: z.string().nullable().optional(),
					VarField32: z.string().nullable().optional(),
					VarField33: z.string().nullable().optional(),
					VarField34: z.string().nullable().optional(),
					VarField35: z.string().nullable().optional(),
					VarField4: z.string().nullable().optional(),
					VarField5: z.string().nullable().optional(),
					VarField6: z.string().nullable().optional(),
					VarField7: z.string().nullable().optional(),
					VarField8: z.string().nullable().optional(),
					VarField9: z.string().nullable().optional(),
					Website: z.string().nullable().optional(),
					Zip: z.string().nullable().optional(),
				})
				.passthrough(),
		),
		ListDetails: z
			.object({
				Country: z.string().nullable().optional(),
				CreationDate: z.string().optional(),
				Id: z.number().int().optional(),
				Name: z.string().nullable().optional(),
				Total: z.number().int().optional(),
				Type: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const getSuppressionListContactInputSchema = z.object({
	contactId: z.number().int(),
	listId: z.number().int(),
	offset: z.number().int().optional(),
});
export const getSuppressionListContactOutputSchema = z
	.object({
		ContactDetails: z.array(
			z
				.object({
					Address: z.string().nullable().optional(),
					Address2: z.string().nullable().optional(),
					City: z.string().nullable().optional(),
					Company: z.string().nullable().optional(),
					Country: z.string().nullable().optional(),
					CreatedDate: z.string().nullable().optional(),
					DataId: z.number().int().optional(),
					Email: z.string().nullable().optional(),
					FirstName: z.string().nullable().optional(),
					HasValidAddress: z.boolean().optional(),
					LastName: z.string().nullable().optional(),
					LastUpdateDate: z.string().nullable().optional(),
					ListId: z.number().int().optional(),
					Mobile: z.string().nullable().optional(),
					Occupation: z.string().nullable().optional(),
					Phone: z.string().nullable().optional(),
					State: z.string().nullable().optional(),
					VarField1: z.string().nullable().optional(),
					VarField10: z.string().nullable().optional(),
					VarField11: z.string().nullable().optional(),
					VarField12: z.string().nullable().optional(),
					VarField13: z.string().nullable().optional(),
					VarField14: z.string().nullable().optional(),
					VarField15: z.string().nullable().optional(),
					VarField16: z.string().nullable().optional(),
					VarField17: z.string().nullable().optional(),
					VarField18: z.string().nullable().optional(),
					VarField19: z.string().nullable().optional(),
					VarField2: z.string().nullable().optional(),
					VarField20: z.string().nullable().optional(),
					VarField21: z.string().nullable().optional(),
					VarField22: z.string().nullable().optional(),
					VarField23: z.string().nullable().optional(),
					VarField24: z.string().nullable().optional(),
					VarField25: z.string().nullable().optional(),
					VarField26: z.string().nullable().optional(),
					VarField27: z.string().nullable().optional(),
					VarField28: z.string().nullable().optional(),
					VarField29: z.string().nullable().optional(),
					VarField3: z.string().nullable().optional(),
					VarField30: z.string().nullable().optional(),
					VarField31: z.string().nullable().optional(),
					VarField32: z.string().nullable().optional(),
					VarField33: z.string().nullable().optional(),
					VarField34: z.string().nullable().optional(),
					VarField35: z.string().nullable().optional(),
					VarField4: z.string().nullable().optional(),
					VarField5: z.string().nullable().optional(),
					VarField6: z.string().nullable().optional(),
					VarField7: z.string().nullable().optional(),
					VarField8: z.string().nullable().optional(),
					VarField9: z.string().nullable().optional(),
					Website: z.string().nullable().optional(),
					Zip: z.string().nullable().optional(),
				})
				.passthrough(),
		),
		ListDetails: z
			.object({
				Country: z.string().nullable().optional(),
				CreationDate: z.string().optional(),
				Id: z.number().int().optional(),
				Name: z.string().nullable().optional(),
				Total: z.number().int().optional(),
				Type: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const createSuppressionListContactInputSchema = z.object({
	listId: z.number().int(),
	body: z
		.object({
			Address: z.string().nullable().optional(),
			Address2: z.string().nullable().optional(),
			City: z.string().nullable().optional(),
			Company: z.string().nullable().optional(),
			Country: z.string().nullable().optional(),
			Email: z.string().nullable().optional(),
			FirstName: z.string().nullable().optional(),
			LastName: z.string().nullable().optional(),
			Mobile: z.string().nullable().optional(),
			Occupation: z.string().nullable().optional(),
			Phone: z.string().nullable().optional(),
			State: z.string().nullable().optional(),
			VarField1: z.string().nullable().optional(),
			VarField10: z.string().nullable().optional(),
			VarField11: z.string().nullable().optional(),
			VarField12: z.string().nullable().optional(),
			VarField13: z.string().nullable().optional(),
			VarField14: z.string().nullable().optional(),
			VarField15: z.string().nullable().optional(),
			VarField16: z.string().nullable().optional(),
			VarField17: z.string().nullable().optional(),
			VarField18: z.string().nullable().optional(),
			VarField19: z.string().nullable().optional(),
			VarField2: z.string().nullable().optional(),
			VarField20: z.string().nullable().optional(),
			VarField21: z.string().nullable().optional(),
			VarField22: z.string().nullable().optional(),
			VarField23: z.string().nullable().optional(),
			VarField24: z.string().nullable().optional(),
			VarField25: z.string().nullable().optional(),
			VarField26: z.string().nullable().optional(),
			VarField27: z.string().nullable().optional(),
			VarField28: z.string().nullable().optional(),
			VarField29: z.string().nullable().optional(),
			VarField3: z.string().nullable().optional(),
			VarField30: z.string().nullable().optional(),
			VarField31: z.string().nullable().optional(),
			VarField32: z.string().nullable().optional(),
			VarField33: z.string().nullable().optional(),
			VarField34: z.string().nullable().optional(),
			VarField35: z.string().nullable().optional(),
			VarField4: z.string().nullable().optional(),
			VarField5: z.string().nullable().optional(),
			VarField6: z.string().nullable().optional(),
			VarField7: z.string().nullable().optional(),
			VarField8: z.string().nullable().optional(),
			VarField9: z.string().nullable().optional(),
			Website: z.string().nullable().optional(),
			Zip: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createSuppressionListContactOutputSchema = z
	.object({
		ContactDetails: z.array(
			z
				.object({
					Address: z.string().nullable().optional(),
					Address2: z.string().nullable().optional(),
					City: z.string().nullable().optional(),
					Company: z.string().nullable().optional(),
					Country: z.string().nullable().optional(),
					CreatedDate: z.string().nullable().optional(),
					DataId: z.number().int().optional(),
					Email: z.string().nullable().optional(),
					FirstName: z.string().nullable().optional(),
					HasValidAddress: z.boolean().optional(),
					LastName: z.string().nullable().optional(),
					LastUpdateDate: z.string().nullable().optional(),
					ListId: z.number().int().optional(),
					Mobile: z.string().nullable().optional(),
					Occupation: z.string().nullable().optional(),
					Phone: z.string().nullable().optional(),
					State: z.string().nullable().optional(),
					VarField1: z.string().nullable().optional(),
					VarField10: z.string().nullable().optional(),
					VarField11: z.string().nullable().optional(),
					VarField12: z.string().nullable().optional(),
					VarField13: z.string().nullable().optional(),
					VarField14: z.string().nullable().optional(),
					VarField15: z.string().nullable().optional(),
					VarField16: z.string().nullable().optional(),
					VarField17: z.string().nullable().optional(),
					VarField18: z.string().nullable().optional(),
					VarField19: z.string().nullable().optional(),
					VarField2: z.string().nullable().optional(),
					VarField20: z.string().nullable().optional(),
					VarField21: z.string().nullable().optional(),
					VarField22: z.string().nullable().optional(),
					VarField23: z.string().nullable().optional(),
					VarField24: z.string().nullable().optional(),
					VarField25: z.string().nullable().optional(),
					VarField26: z.string().nullable().optional(),
					VarField27: z.string().nullable().optional(),
					VarField28: z.string().nullable().optional(),
					VarField29: z.string().nullable().optional(),
					VarField3: z.string().nullable().optional(),
					VarField30: z.string().nullable().optional(),
					VarField31: z.string().nullable().optional(),
					VarField32: z.string().nullable().optional(),
					VarField33: z.string().nullable().optional(),
					VarField34: z.string().nullable().optional(),
					VarField35: z.string().nullable().optional(),
					VarField4: z.string().nullable().optional(),
					VarField5: z.string().nullable().optional(),
					VarField6: z.string().nullable().optional(),
					VarField7: z.string().nullable().optional(),
					VarField8: z.string().nullable().optional(),
					VarField9: z.string().nullable().optional(),
					Website: z.string().nullable().optional(),
					Zip: z.string().nullable().optional(),
				})
				.passthrough(),
		),
		ListDetails: z
			.object({
				Country: z.string().nullable().optional(),
				CreationDate: z.string().optional(),
				Id: z.number().int().optional(),
				Name: z.string().nullable().optional(),
				Total: z.number().int().optional(),
				Type: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const updateSuppressionListContactInputSchema = z.object({
	contactId: z.number().int(),
	listId: z.number().int(),
	body: z
		.object({
			Address: z.string().nullable().optional(),
			Address2: z.string().nullable().optional(),
			City: z.string().nullable().optional(),
			Company: z.string().nullable().optional(),
			Country: z.string().nullable().optional(),
			Email: z.string().nullable().optional(),
			FirstName: z.string().nullable().optional(),
			LastName: z.string().nullable().optional(),
			Mobile: z.string().nullable().optional(),
			Occupation: z.string().nullable().optional(),
			Phone: z.string().nullable().optional(),
			State: z.string().nullable().optional(),
			VarField1: z.string().nullable().optional(),
			VarField10: z.string().nullable().optional(),
			VarField11: z.string().nullable().optional(),
			VarField12: z.string().nullable().optional(),
			VarField13: z.string().nullable().optional(),
			VarField14: z.string().nullable().optional(),
			VarField15: z.string().nullable().optional(),
			VarField16: z.string().nullable().optional(),
			VarField17: z.string().nullable().optional(),
			VarField18: z.string().nullable().optional(),
			VarField19: z.string().nullable().optional(),
			VarField2: z.string().nullable().optional(),
			VarField20: z.string().nullable().optional(),
			VarField21: z.string().nullable().optional(),
			VarField22: z.string().nullable().optional(),
			VarField23: z.string().nullable().optional(),
			VarField24: z.string().nullable().optional(),
			VarField25: z.string().nullable().optional(),
			VarField26: z.string().nullable().optional(),
			VarField27: z.string().nullable().optional(),
			VarField28: z.string().nullable().optional(),
			VarField29: z.string().nullable().optional(),
			VarField3: z.string().nullable().optional(),
			VarField30: z.string().nullable().optional(),
			VarField31: z.string().nullable().optional(),
			VarField32: z.string().nullable().optional(),
			VarField33: z.string().nullable().optional(),
			VarField34: z.string().nullable().optional(),
			VarField35: z.string().nullable().optional(),
			VarField4: z.string().nullable().optional(),
			VarField5: z.string().nullable().optional(),
			VarField6: z.string().nullable().optional(),
			VarField7: z.string().nullable().optional(),
			VarField8: z.string().nullable().optional(),
			VarField9: z.string().nullable().optional(),
			Website: z.string().nullable().optional(),
			Zip: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const updateSuppressionListContactOutputSchema = z
	.object({
		ContactDetails: z.array(
			z
				.object({
					Address: z.string().nullable().optional(),
					Address2: z.string().nullable().optional(),
					City: z.string().nullable().optional(),
					Company: z.string().nullable().optional(),
					Country: z.string().nullable().optional(),
					CreatedDate: z.string().nullable().optional(),
					DataId: z.number().int().optional(),
					Email: z.string().nullable().optional(),
					FirstName: z.string().nullable().optional(),
					HasValidAddress: z.boolean().optional(),
					LastName: z.string().nullable().optional(),
					LastUpdateDate: z.string().nullable().optional(),
					ListId: z.number().int().optional(),
					Mobile: z.string().nullable().optional(),
					Occupation: z.string().nullable().optional(),
					Phone: z.string().nullable().optional(),
					State: z.string().nullable().optional(),
					VarField1: z.string().nullable().optional(),
					VarField10: z.string().nullable().optional(),
					VarField11: z.string().nullable().optional(),
					VarField12: z.string().nullable().optional(),
					VarField13: z.string().nullable().optional(),
					VarField14: z.string().nullable().optional(),
					VarField15: z.string().nullable().optional(),
					VarField16: z.string().nullable().optional(),
					VarField17: z.string().nullable().optional(),
					VarField18: z.string().nullable().optional(),
					VarField19: z.string().nullable().optional(),
					VarField2: z.string().nullable().optional(),
					VarField20: z.string().nullable().optional(),
					VarField21: z.string().nullable().optional(),
					VarField22: z.string().nullable().optional(),
					VarField23: z.string().nullable().optional(),
					VarField24: z.string().nullable().optional(),
					VarField25: z.string().nullable().optional(),
					VarField26: z.string().nullable().optional(),
					VarField27: z.string().nullable().optional(),
					VarField28: z.string().nullable().optional(),
					VarField29: z.string().nullable().optional(),
					VarField3: z.string().nullable().optional(),
					VarField30: z.string().nullable().optional(),
					VarField31: z.string().nullable().optional(),
					VarField32: z.string().nullable().optional(),
					VarField33: z.string().nullable().optional(),
					VarField34: z.string().nullable().optional(),
					VarField35: z.string().nullable().optional(),
					VarField4: z.string().nullable().optional(),
					VarField5: z.string().nullable().optional(),
					VarField6: z.string().nullable().optional(),
					VarField7: z.string().nullable().optional(),
					VarField8: z.string().nullable().optional(),
					VarField9: z.string().nullable().optional(),
					Website: z.string().nullable().optional(),
					Zip: z.string().nullable().optional(),
				})
				.passthrough(),
		),
		ListDetails: z
			.object({
				Country: z.string().nullable().optional(),
				CreationDate: z.string().optional(),
				Id: z.number().int().optional(),
				Name: z.string().nullable().optional(),
				Total: z.number().int().optional(),
				Type: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const deleteSuppressionListContactInputSchema = z.object({
	contactId: z.number().int(),
	listId: z.number().int(),
});
export const deleteSuppressionListContactOutputSchema = z
	.object({ Message: z.string().nullable().optional() })
	.passthrough();

export const getAllTemplatesInputSchema = z.object({});
export const getAllTemplatesOutputSchema = z.array(
	z
		.object({
			is_full_html: z.boolean(),
			is_proofed: z.boolean(),
			name: z.string(),
			size: z.string(),
			back: z.string().nullable().optional(),
			count: z.number().int().optional(),
			created_date: z.string().nullable().optional(),
			font_family: z.string().nullable().optional(),
			front: z.string().nullable().optional(),
			html: z.string().nullable().optional(),
			is_double_sided: z.boolean().optional(),
			template_id: z.number().int().optional(),
			thumbnail: z.string().nullable().optional(),
			thumbnail_back: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getTemplateInputSchema = z.object({ id: z.number().int() });
export const getTemplateOutputSchema = z.array(
	z
		.object({
			is_full_html: z.boolean(),
			is_proofed: z.boolean(),
			name: z.string(),
			size: z.string(),
			back: z.string().nullable().optional(),
			count: z.number().int().optional(),
			created_date: z.string().nullable().optional(),
			font_family: z.string().nullable().optional(),
			front: z.string().nullable().optional(),
			html: z.string().nullable().optional(),
			is_double_sided: z.boolean().optional(),
			template_id: z.number().int().optional(),
			thumbnail: z.string().nullable().optional(),
			thumbnail_back: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createTemplateInputSchema = z.object({
	body: z
		.object({
			is_full_html: z.boolean(),
			is_proofed: z.boolean(),
			name: z.string(),
			size: z.string(),
			back: z.string().nullable().optional(),
			count: z.number().int().optional(),
			created_date: z.string().nullable().optional(),
			font_family: z.string().nullable().optional(),
			front: z.string().nullable().optional(),
			html: z.string().nullable().optional(),
			is_double_sided: z.boolean().optional(),
			template_id: z.number().int().optional(),
			thumbnail: z.string().nullable().optional(),
			thumbnail_back: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createTemplateOutputSchema = z
	.object({
		CreatedDate: z.string().optional(),
		TemplateId: z.number().int().optional(),
	})
	.passthrough();

export const deleteTemplateInputSchema = z.object({ id: z.number().int() });
export const deleteTemplateOutputSchema = z
	.object({ DeletedDate: z.string().optional() })
	.passthrough();

export const getAllWebhooksInputSchema = z.object({});
export const getAllWebhooksOutputSchema = z.array(
	z
		.object({
			campaign_id: z.number().int().optional(),
			campaign_name: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			endpoint_id: z.string().nullable().optional(),
			is_subscribed: z.number().int().optional(),
			url: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const getWebhookInputSchema = z.object({ id: z.number().int() });
export const getWebhookOutputSchema = z.array(
	z
		.object({
			campaign_id: z.number().int().optional(),
			campaign_name: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			endpoint_id: z.string().nullable().optional(),
			is_subscribed: z.number().int().optional(),
			url: z.string().nullable().optional(),
		})
		.passthrough(),
);

export const createWebhookInputSchema = z.object({
	body: z
		.object({
			campaign_id: z.number().int().optional(),
			campaign_name: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			endpoint_id: z.string().nullable().optional(),
			is_subscribed: z.number().int().optional(),
			url: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const createWebhookOutputSchema = z
	.object({ created_date: z.string().optional() })
	.passthrough();

export const updateWebhookInputSchema = z.object({
	body: z
		.object({
			campaign_id: z.number().int().optional(),
			campaign_name: z.string().nullable().optional(),
			created_date: z.string().nullable().optional(),
			endpoint_id: z.string().nullable().optional(),
			is_subscribed: z.number().int().optional(),
			url: z.string().nullable().optional(),
		})
		.passthrough(),
});
export const updateWebhookOutputSchema = z
	.object({ updated_date: z.string().optional() })
	.passthrough();

export const deleteWebhookInputSchema = z.object({ id: z.number().int() });
export const deleteWebhookOutputSchema = z
	.object({ deleted_date: z.string().optional() })
	.passthrough();

export const PostalyticsEndpointInputSchemas = {
	getIntegrations: getIntegrationsInputSchema,
	getMyAccount: getMyAccountInputSchema,
	getAccount: getAccountInputSchema,
	createNewAccount: createNewAccountInputSchema,
	updateAccount: updateAccountInputSchema,
	deleteAccount: deleteAccountInputSchema,
	getAllCampaigns: getAllCampaignsInputSchema,
	getAllDripCampaigns: getAllDripCampaignsInputSchema,
	getCampaignStats: getCampaignStatsInputSchema,
	getCampaign: getCampaignInputSchema,
	getCampaignEvents: getCampaignEventsInputSchema,
	getContactEvent: getContactEventInputSchema,
	createNewCampaign: createNewCampaignInputSchema,
	updateCampaignStatus: updateCampaignStatusInputSchema,
	deleteCampaign: deleteCampaignInputSchema,
	getAllContactLists: getAllContactListsInputSchema,
	getContact: getContactInputSchema,
	getContactsOnList: getContactsOnListInputSchema,
	createContactOnList: createContactOnListInputSchema,
	updateContactOnList: updateContactOnListInputSchema,
	deleteContact: deleteContactInputSchema,
	getAllFlows: getAllFlowsInputSchema,
	getFlow: getFlowInputSchema,
	enrollContactToFlow: enrollContactToFlowInputSchema,
	unenrollContactFromFlow: unenrollContactFromFlowInputSchema,
	createLoginLink: createLoginLinkInputSchema,
	sendMail: sendMailInputSchema,
	getSuppressionLists: getSuppressionListsInputSchema,
	getSuppressionList: getSuppressionListInputSchema,
	createSuppressionList: createSuppressionListInputSchema,
	deleteSuppressionList: deleteSuppressionListInputSchema,
	getSuppressionListContacts: getSuppressionListContactsInputSchema,
	getSuppressionListContact: getSuppressionListContactInputSchema,
	createSuppressionListContact: createSuppressionListContactInputSchema,
	updateSuppressionListContact: updateSuppressionListContactInputSchema,
	deleteSuppressionListContact: deleteSuppressionListContactInputSchema,
	getAllTemplates: getAllTemplatesInputSchema,
	getTemplate: getTemplateInputSchema,
	createTemplate: createTemplateInputSchema,
	deleteTemplate: deleteTemplateInputSchema,
	getAllWebhooks: getAllWebhooksInputSchema,
	getWebhook: getWebhookInputSchema,
	createWebhook: createWebhookInputSchema,
	updateWebhook: updateWebhookInputSchema,
	deleteWebhook: deleteWebhookInputSchema,
} as const;
export const PostalyticsEndpointOutputSchemas = {
	getIntegrations: getIntegrationsOutputSchema,
	getMyAccount: getMyAccountOutputSchema,
	getAccount: getAccountOutputSchema,
	createNewAccount: createNewAccountOutputSchema,
	updateAccount: updateAccountOutputSchema,
	deleteAccount: deleteAccountOutputSchema,
	getAllCampaigns: getAllCampaignsOutputSchema,
	getAllDripCampaigns: getAllDripCampaignsOutputSchema,
	getCampaignStats: getCampaignStatsOutputSchema,
	getCampaign: getCampaignOutputSchema,
	getCampaignEvents: getCampaignEventsOutputSchema,
	getContactEvent: getContactEventOutputSchema,
	createNewCampaign: createNewCampaignOutputSchema,
	updateCampaignStatus: updateCampaignStatusOutputSchema,
	deleteCampaign: deleteCampaignOutputSchema,
	getAllContactLists: getAllContactListsOutputSchema,
	getContact: getContactOutputSchema,
	getContactsOnList: getContactsOnListOutputSchema,
	createContactOnList: createContactOnListOutputSchema,
	updateContactOnList: updateContactOnListOutputSchema,
	deleteContact: deleteContactOutputSchema,
	getAllFlows: getAllFlowsOutputSchema,
	getFlow: getFlowOutputSchema,
	enrollContactToFlow: enrollContactToFlowOutputSchema,
	unenrollContactFromFlow: unenrollContactFromFlowOutputSchema,
	createLoginLink: createLoginLinkOutputSchema,
	sendMail: sendMailOutputSchema,
	getSuppressionLists: getSuppressionListsOutputSchema,
	getSuppressionList: getSuppressionListOutputSchema,
	createSuppressionList: createSuppressionListOutputSchema,
	deleteSuppressionList: deleteSuppressionListOutputSchema,
	getSuppressionListContacts: getSuppressionListContactsOutputSchema,
	getSuppressionListContact: getSuppressionListContactOutputSchema,
	createSuppressionListContact: createSuppressionListContactOutputSchema,
	updateSuppressionListContact: updateSuppressionListContactOutputSchema,
	deleteSuppressionListContact: deleteSuppressionListContactOutputSchema,
	getAllTemplates: getAllTemplatesOutputSchema,
	getTemplate: getTemplateOutputSchema,
	createTemplate: createTemplateOutputSchema,
	deleteTemplate: deleteTemplateOutputSchema,
	getAllWebhooks: getAllWebhooksOutputSchema,
	getWebhook: getWebhookOutputSchema,
	createWebhook: createWebhookOutputSchema,
	updateWebhook: updateWebhookOutputSchema,
	deleteWebhook: deleteWebhookOutputSchema,
} as const;
export type PostalyticsEndpointInputs = {
	[K in keyof typeof PostalyticsEndpointInputSchemas]: z.infer<
		(typeof PostalyticsEndpointInputSchemas)[K]
	>;
};
export type PostalyticsEndpointOutputs = {
	[K in keyof typeof PostalyticsEndpointOutputSchemas]: z.infer<
		(typeof PostalyticsEndpointOutputSchemas)[K]
	>;
};
