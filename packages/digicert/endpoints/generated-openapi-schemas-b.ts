import { z } from 'zod';

// `unknown`: DigiCert's OpenAPI spec omits these provider-defined value shapes,
// so narrower validation would require inventing undocumented constraints.
const unspecifiedProviderValue = () => z.unknown();

const r_652f18b2b4b6Output = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		account_id: z.string().optional(),
		blob: z.array(z.number().int()).optional(),
		cert_type: z.string().optional(),
		chain: z
			.array(
				z
					.object({
						blob: z.string().optional(),
						cert_type: z.string().optional(),
						subject: z
							.object({
								common_name: z.string().optional(),
								country: z.string().optional(),
								custom_attributes: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												type: z.string().optional(),
												values: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								description: z.array(z.string()).optional(),
								dn_qualifier: z.string().optional(),
								domain_component: z.array(z.string()).optional(),
								email: z.string().optional(),
								given_name: z.array(z.string()).optional(),
								locality: z.string().optional(),
								organization_identifier: z.string().optional(),
								organization_name: z.string().optional(),
								organization_units: z.array(z.string()).optional(),
								postal_code: z.string().optional(),
								product_identifier: z.string().optional(),
								pseudonym: z.string().optional(),
								serial_number: z.string().optional(),
								state: z.string().optional(),
								street_address: z.array(z.string()).optional(),
								subject_order: z.array(z.string()).optional(),
								surname: z.array(z.string()).optional(),
								title: z.array(z.string()).optional(),
								unique_identifier: z.string().optional(),
								unstructured_address: z.array(z.string()).optional(),
								unstructured_name: z.array(z.string()).optional(),
								user_identifier: z.string().optional(),
								vendor_identifier: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		csr: z.string().optional(),
		csr_type: z.string().optional(),
		custom_values: z.object({}).passthrough().optional(),
		escrow_private_key: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z.string().optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				trust_type: z.string().optional(),
			})
			.passthrough()
			.optional(),
		issuer_subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		kind: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		ocsp_key_hash_alg: z.string().optional(),
		options: z
			.object({ chain_name: z.string().optional() })
			.passthrough()
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_0c3e91de6873Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z
			.object({
				include_chain: z.enum(['none', 'ica_only', 'full']).optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_0c3e91de6873Output = z
	.object({
		password: z.string().optional(),
		pkcs12: z.array(z.number().int()).optional(),
		pre_installed: z.boolean().optional(),
	})
	.passthrough();
const r_80834d3f81b9Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_80834d3f81b9Output = z.undefined();
const r_a2ed911770eaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				certType: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a2ed911770eaOutput = z.array(
	z
		.object({
			commonName: z.string().optional(),
			id: z.string().optional(),
			issuerName: z.string().optional(),
			organizationName: z.string().optional(),
			revocationReason: z.string().optional(),
			revokedAt: z.string().optional(),
			serialNumber: z.string().optional(),
			status: z.string().optional(),
			validFrom: z.string().optional(),
			validTo: z.string().optional(),
		})
		.passthrough(),
);
const r_1343adaa2bdbInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				blob: z.string().optional(),
				revocation: z
					.object({
						comments: z.string().optional(),
						reason: z.string().optional(),
						revoke_date: z.string().optional(),
						revoked: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_1343adaa2bdbOutput = z
	.object({
		account_assignments: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		account_id: z.string().optional(),
		blob: z.array(z.number().int()).optional(),
		cert_type: z.string().optional(),
		chain: z
			.array(
				z
					.object({
						blob: z.string().optional(),
						cert_type: z.string().optional(),
						subject: z
							.object({
								common_name: z.string().optional(),
								country: z.string().optional(),
								custom_attributes: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												type: z.string().optional(),
												values: z.array(z.string()).optional(),
											})
											.passthrough(),
									)
									.optional(),
								description: z.array(z.string()).optional(),
								dn_qualifier: z.string().optional(),
								domain_component: z.array(z.string()).optional(),
								email: z.string().optional(),
								given_name: z.array(z.string()).optional(),
								locality: z.string().optional(),
								organization_identifier: z.string().optional(),
								organization_name: z.string().optional(),
								organization_units: z.array(z.string()).optional(),
								postal_code: z.string().optional(),
								product_identifier: z.string().optional(),
								pseudonym: z.string().optional(),
								serial_number: z.string().optional(),
								state: z.string().optional(),
								street_address: z.array(z.string()).optional(),
								subject_order: z.array(z.string()).optional(),
								surname: z.array(z.string()).optional(),
								title: z.array(z.string()).optional(),
								unique_identifier: z.string().optional(),
								unstructured_address: z.array(z.string()).optional(),
								unstructured_name: z.array(z.string()).optional(),
								user_identifier: z.string().optional(),
								vendor_identifier: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		csr: z.string().optional(),
		csr_type: z.string().optional(),
		custom_values: z.object({}).passthrough().optional(),
		escrow_private_key: z.boolean().optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hosted_type: z.string().optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				trust_type: z.string().optional(),
			})
			.passthrough()
			.optional(),
		issuer_subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		kind: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		ocsp_key_hash_alg: z.string().optional(),
		options: z
			.object({ chain_name: z.string().optional() })
			.passthrough()
			.optional(),
		revocation: z
			.object({
				comments: z.string().optional(),
				reason: z.string().optional(),
				revoke_date: z.string().optional(),
				revoked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		subject: z
			.object({
				common_name: z.string().optional(),
				country: z.string().optional(),
				custom_attributes: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								type: z.string().optional(),
								values: z.array(z.string()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				description: z.array(z.string()).optional(),
				dn_qualifier: z.string().optional(),
				domain_component: z.array(z.string()).optional(),
				email: z.string().optional(),
				given_name: z.array(z.string()).optional(),
				locality: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_name: z.string().optional(),
				organization_units: z.array(z.string()).optional(),
				postal_code: z.string().optional(),
				product_identifier: z.string().optional(),
				pseudonym: z.string().optional(),
				serial_number: z.string().optional(),
				state: z.string().optional(),
				street_address: z.array(z.string()).optional(),
				subject_order: z.array(z.string()).optional(),
				surname: z.array(z.string()).optional(),
				title: z.array(z.string()).optional(),
				unique_identifier: z.string().optional(),
				unstructured_address: z.array(z.string()).optional(),
				unstructured_name: z.array(z.string()).optional(),
				user_identifier: z.string().optional(),
				vendor_identifier: z.string().optional(),
			})
			.passthrough()
			.optional(),
		template: z.string().optional(),
		template_id: z.string().optional(),
		thumbprint_sha256: z.string().optional(),
		trust_type: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_f55c3dc3abceInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f55c3dc3abceOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							active: z.boolean().optional(),
							ca: z
								.object({
									id: z.string().optional(),
									name: z.string().optional(),
								})
								.passthrough()
								.optional(),
							configuration: z
								.object({
									auto_partition: z
										.object({
											limit: z.number().int().optional(),
											on_size: z.boolean().optional(),
											size: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									auto_partition_generation_enabled: z.boolean().optional(),
									crl_scope: z.string().optional(),
									generation: z
										.object({
											crl_frequency_hours:
												unspecifiedProviderValue().optional(),
											crl_validity_hours: unspecifiedProviderValue().optional(),
											override_global: unspecifiedProviderValue().optional(),
										})
										.passthrough()
										.optional(),
									generation_enabled: z.boolean().optional(),
									include_idp: z.boolean().optional(),
									master_crl_enabled: z.boolean().optional(),
									publish_enabled: z.boolean().optional(),
									selected_domains: z.array(z.string()).optional(),
									signature_algorithm: z.string().optional(),
								})
								.passthrough()
								.optional(),
							file_name: z.string().optional(),
							file_path: z.string().optional(),
							id: z.string().optional(),
							is_finalized: z.boolean().optional(),
							last_crl_number: z.number().int().optional(),
							last_generated_date: z.string().optional(),
							next_generate_date: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_b4cfb481a98cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				active: z.boolean().optional(),
				ca: z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough()
					.optional(),
				configuration: z
					.object({
						auto_partition: z
							.object({
								limit: z.number().int().optional(),
								on_size: z.boolean().optional(),
								size: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						auto_partition_generation_enabled: z.boolean().optional(),
						crl_scope: z.string().optional(),
						generation: z
							.object({
								crl_frequency_hours: unspecifiedProviderValue().optional(),
								crl_validity_hours: unspecifiedProviderValue().optional(),
								override_global: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						generation_enabled: z.boolean().optional(),
						include_idp: z.boolean().optional(),
						master_crl_enabled: z.boolean().optional(),
						publish_enabled: z.boolean().optional(),
						selected_domains: z.array(z.string()).optional(),
						signature_algorithm: z.string().optional(),
					})
					.passthrough()
					.optional(),
				file_name: z.string().optional(),
				file_path: z.string().optional(),
				id: z.string().optional(),
				is_finalized: z.boolean().optional(),
				last_crl_number: z.number().int().optional(),
				last_generated_date: z.string().optional(),
				next_generate_date: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_b4cfb481a98cOutput = z
	.object({ id: z.string().optional() })
	.passthrough();
const r_865bfb3a91f3Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_865bfb3a91f3Output = z
	.object({
		active: z.boolean().optional(),
		ca: z
			.object({ id: z.string().optional(), name: z.string().optional() })
			.passthrough()
			.optional(),
		configuration: z
			.object({
				auto_partition: z
					.object({
						limit: z.number().int().optional(),
						on_size: z.boolean().optional(),
						size: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				auto_partition_generation_enabled: z.boolean().optional(),
				crl_scope: z.string().optional(),
				generation: z
					.object({
						crl_frequency_hours: unspecifiedProviderValue().optional(),
						crl_validity_hours: unspecifiedProviderValue().optional(),
						override_global: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				generation_enabled: z.boolean().optional(),
				include_idp: z.boolean().optional(),
				master_crl_enabled: z.boolean().optional(),
				publish_enabled: z.boolean().optional(),
				selected_domains: z.array(z.string()).optional(),
				signature_algorithm: z.string().optional(),
			})
			.passthrough()
			.optional(),
		file_name: z.string().optional(),
		file_path: z.string().optional(),
		id: z.string().optional(),
		is_finalized: z.boolean().optional(),
		last_crl_number: z.number().int().optional(),
		last_generated_date: z.string().optional(),
		next_generate_date: z.string().optional(),
	})
	.passthrough();
const r_4538e37bbe0dInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4538e37bbe0dOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							blob: z.array(z.number().int()).optional(),
							crl_id: z.string().optional(),
							crl_number: z.number().int().optional(),
							generated_date: z.string().optional(),
							next_update: z.string().optional(),
							this_update: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_90bc1797ca46Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ blob: z.array(z.number().int()).optional() })
			.passthrough(),
	})
	.strict();
const r_90bc1797ca46Output = z
	.object({
		blob: z.array(z.number().int()).optional(),
		crl_id: z.string().optional(),
		crl_number: z.number().int().optional(),
		generated_date: z.string().optional(),
		next_update: z.string().optional(),
		this_update: z.string().optional(),
	})
	.passthrough();
const r_bd131d63be89Input = z
	.object({
		path: z.object({ id: z.string(), crl_number: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_bd131d63be89Output = z
	.object({
		blob: z.array(z.number().int()).optional(),
		crl_id: z.string().optional(),
		crl_number: z.number().int().optional(),
		generated_date: z.string().optional(),
		next_update: z.string().optional(),
		this_update: z.string().optional(),
	})
	.passthrough();
const r_611f78545acbInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_611f78545acbOutput = z
	.object({
		auto_partition: z
			.object({
				limit: z.number().int().optional(),
				on_size: z.boolean().optional(),
				size: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
		auto_partition_generation_enabled: z.boolean().optional(),
		crl_scope: z.string().optional(),
		generation: z
			.object({
				crl_frequency_hours: unspecifiedProviderValue().optional(),
				crl_validity_hours: unspecifiedProviderValue().optional(),
				override_global: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		generation_enabled: z.boolean().optional(),
		include_idp: z.boolean().optional(),
		master_crl_enabled: z.boolean().optional(),
		publish_enabled: z.boolean().optional(),
		selected_domains: z.array(z.string()).optional(),
		signature_algorithm: z.string().optional(),
	})
	.passthrough();
const r_f35b7c3e0b8aInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				auto_partition: z
					.object({
						limit: z.number().int().optional(),
						on_size: z.boolean().optional(),
						size: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				auto_partition_generation_enabled: z.boolean().optional(),
				crl_scope: z.string().optional(),
				generation: z
					.object({
						crl_frequency_hours: unspecifiedProviderValue().optional(),
						crl_validity_hours: unspecifiedProviderValue().optional(),
						override_global: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				generation_enabled: z.boolean().optional(),
				include_idp: z.boolean().optional(),
				master_crl_enabled: z.boolean().optional(),
				publish_enabled: z.boolean().optional(),
				selected_domains: z.array(z.string()).optional(),
				signature_algorithm: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_f35b7c3e0b8aOutput = z.undefined();
const r_7dc5f63f47d9Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_7dc5f63f47d9Output = z.undefined();
const r_471f260d6e40Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.string().optional(),
				allowed_uses: z.array(z.string()).optional(),
				app_reference_id: z.string(),
				ec_point: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				expiration_date: z.string().optional(),
				key_alg: z.string().optional(),
				key_label: z.string().optional(),
				key_size: z.number().int().optional(),
				modulus: z.string().optional(),
				partition_id: z.string(),
				provider: z.string(),
				rsa_public_exponent: z.number().int().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_471f260d6e40Output = z
	.object({
		app_reference_id: z.string().optional(),
		id: z.string().optional(),
		subject_public_key_info: z.array(z.number().int()).optional(),
	})
	.passthrough();
const r_514ed64de87dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_514ed64de87dOutput = z
	.object({
		datetime: z.string().optional(),
		evidence: z
			.object({
				change_management: z
					.object({
						metadata: z
							.object({
								control_ids: z.array(z.string()).optional(),
								datetime: z.string().optional(),
								id: z.string().optional(),
								next_refresh_at: z.string().optional(),
								title: z.string().optional(),
								ttl_seconds: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						result: z
							.object({
								audit_logging_enabled: z.boolean().optional(),
								mechanism: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				data_encryption: z
					.object({
						metadata: z
							.object({
								control_ids: z.array(z.string()).optional(),
								datetime: z.string().optional(),
								id: z.string().optional(),
								next_refresh_at: z.string().optional(),
								title: z.string().optional(),
								ttl_seconds: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						result: z
							.object({
								field_level_encryption_enabled: z.boolean().optional(),
								master_secret_configured: z.boolean().optional(),
								mechanism: z.string().optional(),
								module_id: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				fips_cmvp: z
					.object({
						metadata: z
							.object({
								control_ids: z.array(z.string()).optional(),
								datetime: z.string().optional(),
								id: z.string().optional(),
								next_refresh_at: z.string().optional(),
								title: z.string().optional(),
								ttl_seconds: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						result: z
							.object({
								active_module: z
									.object({
										cavp_certificate: z.string().optional(),
										certificate_number: z.string().optional(),
										fips_140_3_validated: z.boolean().optional(),
										id: z.string().optional(),
										name: z.string().optional(),
										purpose: z.string().optional(),
										status: z.string().optional(),
										version: z.string().optional(),
									})
									.passthrough()
									.optional(),
								allowed_aes_key_sizes: z.array(z.number().int()).optional(),
								allowed_ecdsa_curves: z.array(z.string()).optional(),
								allowed_key_algorithms: z.array(z.string()).optional(),
								allowed_rsa_key_sizes: z.array(z.number().int()).optional(),
								allowed_signature_algorithms: z.array(z.string()).optional(),
								checked_at: z.string().optional(),
								fips_mode_enabled: z.boolean().optional(),
								fips_module_enabled: z.boolean().optional(),
								fips_standard: z.string().optional(),
								providers: z
									.array(
										z
											.object({
												active: z.boolean().optional(),
												allowed_in_fips_mode: z.boolean().optional(),
												configured: z.boolean().optional(),
												fips_140_3_validated: z.boolean().optional(),
												name: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		product: z.string().optional(),
		schema_version: z.string().optional(),
		source: z.string().optional(),
	})
	.passthrough();
const r_860e43c6a58aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				account_ids: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_860e43c6a58aOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							access_to_all: z.boolean().optional(),
							account_assignments: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							active_escrow_master_key: z
								.object({
									active: z.boolean().optional(),
									id: z.string().optional(),
								})
								.passthrough()
								.optional(),
							allowed_uses: z.array(z.string()).optional(),
							created_date: z.string().optional(),
							default: z.boolean().optional(),
							display_name: z.string().optional(),
							enabled: z.boolean().optional(),
							escrow_default: z.boolean().optional(),
							hsm_provider: z
								.object({
									enabled: unspecifiedProviderValue().optional(),
									max_concurrent_ops: z.number().int().optional(),
									name: z.string().optional(),
								})
								.passthrough()
								.optional(),
							id: z.string().optional(),
							name: z.string().optional(),
							partition_name: z.string().optional(),
							provider_partition_id: z.string().optional(),
							security_level: z
								.enum(['level_1', 'level_2', 'level_3', 'level_4'])
								.optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_07af58d0eb37Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				blob: z.string().optional(),
				created_date: z.string().optional(),
				csr: z.array(z.number().int()).optional(),
				csr_blob: z.string().optional(),
				delegated_scope: z
					.object({
						ica_rules: z
							.object({})
							.catchall(
								z
									.object({
										allow_ee: z.boolean().optional(),
										allow_intermediate: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hsm_provider: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_name: z.string().optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				responder_type: z.string().optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.string().optional(),
				updated_date: z.string().optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				validity_truncate: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_07af58d0eb37Output = z
	.object({
		blob: z.string().optional(),
		created_date: z.string().optional(),
		csr: z.array(z.number().int()).optional(),
		csr_blob: z.string().optional(),
		delegated_scope: z
			.object({
				ica_rules: z
					.object({})
					.catchall(
						z
							.object({
								allow_ee: z.boolean().optional(),
								allow_intermediate: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hsm_provider: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_name: z.string().optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		responder_type: z.string().optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z.string().optional(),
		updated_date: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validity_truncate: z.boolean().optional(),
	})
	.passthrough();
const r_aaa0dcb230feInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_aaa0dcb230feOutput = z
	.object({
		blob: z.string().optional(),
		created_date: z.string().optional(),
		csr: z.array(z.number().int()).optional(),
		csr_blob: z.string().optional(),
		delegated_scope: z
			.object({
				ica_rules: z
					.object({})
					.catchall(
						z
							.object({
								allow_ee: z.boolean().optional(),
								allow_intermediate: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hsm_provider: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_name: z.string().optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		responder_type: z.string().optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z.string().optional(),
		updated_date: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validity_truncate: z.boolean().optional(),
	})
	.passthrough();
const r_aee3d7f5a977Input = z
	.object({
		path: z.object({ id: z.string(), action: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_aee3d7f5a977Output = z.undefined();
const r_6ea9c4afe524Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ blob: z.string().optional() }).passthrough(),
	})
	.strict();
const r_6ea9c4afe524Output = z.undefined();
const r_c70a8bd812d1Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c70a8bd812d1Output = z
	.object({ csr: z.string().optional() })
	.passthrough();
const r_8c26364ba4e1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				blob: z.string().optional(),
				created_date: z.string().optional(),
				csr: z.array(z.number().int()).optional(),
				csr_blob: z.string().optional(),
				delegated_scope: z
					.object({
						ica_rules: z
							.object({})
							.catchall(
								z
									.object({
										allow_ee: z.boolean().optional(),
										allow_intermediate: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hsm_provider: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_name: z.string().optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				responder_type: z.string().optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.string().optional(),
				updated_date: z.string().optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				validity_truncate: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_8c26364ba4e1Output = z
	.object({
		blob: z.string().optional(),
		created_date: z.string().optional(),
		csr: z.array(z.number().int()).optional(),
		csr_blob: z.string().optional(),
		delegated_scope: z
			.object({
				ica_rules: z
					.object({})
					.catchall(
						z
							.object({
								allow_ee: z.boolean().optional(),
								allow_intermediate: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hsm_provider: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_name: z.string().optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		responder_type: z.string().optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z.string().optional(),
		updated_date: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validity_truncate: z.boolean().optional(),
	})
	.passthrough();
const r_8fc8acf59dceInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				blob: z.string().optional(),
				created_date: z.string().optional(),
				csr: z.array(z.number().int()).optional(),
				csr_blob: z.string().optional(),
				delegated_scope: z
					.object({
						ica_rules: z
							.object({})
							.catchall(
								z
									.object({
										allow_ee: z.boolean().optional(),
										allow_intermediate: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						adobe_archive_rev_info: z
							.object({ version: z.number().int().optional() })
							.passthrough()
							.optional(),
						adobe_timestamp: z
							.object({
								location: z.string().optional(),
								requires_auth: z.boolean().optional(),
								version: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						aia: z
							.object({ issuer_urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						aki: z
							.object({
								authority_name_serial_number: z.boolean().optional(),
								include: z.string().optional(),
								key_identifier: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						basic_constraints: z
							.object({
								ca: z.boolean().optional(),
								critical: z.boolean().optional(),
								path_length: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						cabf_organization_identifier: z
							.object({
								country: z.string().optional(),
								reference: z.string().optional(),
								scheme: z.string().optional(),
								state: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cdp: z
							.object({ urls: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						certificate_policies: z
							.array(
								z
									.object({
										cps_uri: z.string().optional(),
										oid: z.string().optional(),
										user_notice: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						extended_key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						extensions_order: z.array(z.string()).optional(),
						issuer_alt_name: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						key_usage: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
								skip_validation: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						lei: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						lei_role: z
							.object({ value: z.string().optional() })
							.passthrough()
							.optional(),
						microsoft_application_certificate_policies: z
							.object({
								additional_values: z.array(z.string()).optional(),
								critical: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						microsoft_certificate_template_name: z.string().optional(),
						microsoft_certificate_template_v2: z
							.object({
								major_version: z.number().int().optional(),
								minor_version: z.number().int().optional(),
								oid: z.string().optional(),
							})
							.passthrough()
							.optional(),
						private_key_usage_period: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								not_after: z.string().optional(),
								not_before: z.string().optional(),
							})
							.passthrough()
							.optional(),
						qc_statements: z
							.object({
								critical: z.boolean().optional(),
								'etsi-psd2-qcStatement': z.array(z.string()).optional(),
								'id-etsi-qcs-QcPDS': z
									.array(
										z
											.object({
												language: z.string().optional(),
												uri: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
								'id-etsi-qcs-QcType': z.array(z.string()).optional(),
								'id-qcs-pkixQCSyntax-v2': z
									.object({ semantics_id: z.string().optional() })
									.passthrough()
									.optional(),
								oids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						san: z
							.object({
								directory_names: z
									.array(
										z
											.object({
												common_name: z.string().optional(),
												country: z.string().optional(),
												custom_attributes: z
													.array(
														z
															.object({
																oid: z.string().optional(),
																type: z.string().optional(),
																values: z.array(z.string()).optional(),
															})
															.passthrough(),
													)
													.optional(),
												description: z.array(z.string()).optional(),
												dn_qualifier: z.string().optional(),
												domain_component: z.array(z.string()).optional(),
												email: z.string().optional(),
												given_name: z.array(z.string()).optional(),
												locality: z.string().optional(),
												organization_identifier: z.string().optional(),
												organization_name: z.string().optional(),
												organization_units: z.array(z.string()).optional(),
												postal_code: z.string().optional(),
												product_identifier: z.string().optional(),
												pseudonym: z.string().optional(),
												serial_number: z.string().optional(),
												state: z.string().optional(),
												street_address: z.array(z.string()).optional(),
												subject_order: z.array(z.string()).optional(),
												surname: z.array(z.string()).optional(),
												title: z.array(z.string()).optional(),
												unique_identifier: z.string().optional(),
												unstructured_address: z.array(z.string()).optional(),
												unstructured_name: z.array(z.string()).optional(),
												user_identifier: z.string().optional(),
												vendor_identifier: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								dns_names: z.array(z.string()).optional(),
								emails: z.array(z.string()).optional(),
								ip_addresses: z.array(z.string()).optional(),
								other_names: z
									.object({
										domain_controller_id: z.array(z.string()).optional(),
										guid: z.array(z.string()).optional(),
										hardware_module_name: z
											.array(
												z
													.object({
														serial_num: z.array(z.number().int()).optional(),
														type: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										raw_other_names: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														value: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								uris: z.array(z.string()).optional(),
								user_principal_names: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.array(
								z
									.object({
										oid: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						ski: z
							.object({
								include: z.string().optional(),
								method: z.string().optional(),
							})
							.passthrough()
							.optional(),
						ski_extension: z.string().optional(),
						smime_capabilities: z
							.object({ values: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						subject_directory_attributes: z
							.object({ encoded_value: z.array(z.number().int()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				hsm_provider: z
					.object({
						display_name: z.string().optional(),
						id: z.string().optional(),
						partition_name: z.string().optional(),
						provider_name: z.string().optional(),
						security_level: z
							.enum(['level_1', 'level_2', 'level_3', 'level_4'])
							.optional(),
					})
					.passthrough()
					.optional(),
				id: z.string().optional(),
				issuer: z
					.object({
						hosted_type: z
							.enum(['online', 'offline', 'third_party'])
							.optional(),
						id: z.string().optional(),
						name: z.string().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_generation: z
					.object({
						dilithium_key_size: z.string().optional(),
						ecc_curve: z.string().optional(),
						ecdsa_curve: z.string().optional(),
						falcon_key_size: z.string().optional(),
						key_type: z.string().optional(),
						rsa_key_bits: z.number().int().optional(),
						sphincs_key_size: z.string().optional(),
					})
					.passthrough()
					.optional(),
				key_name: z.string().optional(),
				name: z.string().optional(),
				notification: z
					.object({
						enabled: z.boolean().optional(),
						frequency: z.array(z.number().int()).optional(),
						recipients: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				private_key: z
					.object({
						password: z.string().optional(),
						pkcs12: z.array(z.number().int()).optional(),
						pre_installed: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				responder_type: z.string().optional(),
				serial_number: z.string().optional(),
				signature_algorithm: z.string().optional(),
				status: z.string().optional(),
				updated_date: z.string().optional(),
				validity: z
					.object({
						duration_unit: z.string().optional(),
						duration_value: z.number().int().optional(),
						valid_from: z.string().optional(),
						valid_to: z.string().optional(),
					})
					.passthrough()
					.optional(),
				validity_truncate: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_8fc8acf59dceOutput = z
	.object({
		blob: z.string().optional(),
		created_date: z.string().optional(),
		csr: z.array(z.number().int()).optional(),
		csr_blob: z.string().optional(),
		delegated_scope: z
			.object({
				ica_rules: z
					.object({})
					.catchall(
						z
							.object({
								allow_ee: z.boolean().optional(),
								allow_intermediate: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		extensions: z
			.object({
				adobe_archive_rev_info: z
					.object({ version: z.number().int().optional() })
					.passthrough()
					.optional(),
				adobe_timestamp: z
					.object({
						location: z.string().optional(),
						requires_auth: z.boolean().optional(),
						version: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				aia: z
					.object({ issuer_urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				aki: z
					.object({
						authority_name_serial_number: z.boolean().optional(),
						include: z.string().optional(),
						key_identifier: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				basic_constraints: z
					.object({
						ca: z.boolean().optional(),
						critical: z.boolean().optional(),
						path_length: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				cabf_organization_identifier: z
					.object({
						country: z.string().optional(),
						reference: z.string().optional(),
						scheme: z.string().optional(),
						state: z.string().optional(),
					})
					.passthrough()
					.optional(),
				cdp: z
					.object({ urls: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				certificate_policies: z
					.array(
						z
							.object({
								cps_uri: z.string().optional(),
								oid: z.string().optional(),
								user_notice: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				extended_key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				extensions_order: z.array(z.string()).optional(),
				issuer_alt_name: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				key_usage: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
						skip_validation: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				lei: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				lei_role: z
					.object({ value: z.string().optional() })
					.passthrough()
					.optional(),
				microsoft_application_certificate_policies: z
					.object({
						additional_values: z.array(z.string()).optional(),
						critical: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				microsoft_certificate_template_name: z.string().optional(),
				microsoft_certificate_template_v2: z
					.object({
						major_version: z.number().int().optional(),
						minor_version: z.number().int().optional(),
						oid: z.string().optional(),
					})
					.passthrough()
					.optional(),
				private_key_usage_period: z
					.object({
						critical: unspecifiedProviderValue().optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
					})
					.passthrough()
					.optional(),
				qc_statements: z
					.object({
						critical: z.boolean().optional(),
						'etsi-psd2-qcStatement': z.array(z.string()).optional(),
						'id-etsi-qcs-QcPDS': z
							.array(
								z
									.object({
										language: z.string().optional(),
										uri: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						'id-etsi-qcs-QcRetentionPeriod': z.number().int().optional(),
						'id-etsi-qcs-QcType': z.array(z.string()).optional(),
						'id-qcs-pkixQCSyntax-v2': z
							.object({ semantics_id: z.string().optional() })
							.passthrough()
							.optional(),
						oids: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				san: z
					.object({
						directory_names: z
							.array(
								z
									.object({
										common_name: z.string().optional(),
										country: z.string().optional(),
										custom_attributes: z
											.array(
												z
													.object({
														oid: z.string().optional(),
														type: z.string().optional(),
														values: z.array(z.string()).optional(),
													})
													.passthrough(),
											)
											.optional(),
										description: z.array(z.string()).optional(),
										dn_qualifier: z.string().optional(),
										domain_component: z.array(z.string()).optional(),
										email: z.string().optional(),
										given_name: z.array(z.string()).optional(),
										locality: z.string().optional(),
										organization_identifier: z.string().optional(),
										organization_name: z.string().optional(),
										organization_units: z.array(z.string()).optional(),
										postal_code: z.string().optional(),
										product_identifier: z.string().optional(),
										pseudonym: z.string().optional(),
										serial_number: z.string().optional(),
										state: z.string().optional(),
										street_address: z.array(z.string()).optional(),
										subject_order: z.array(z.string()).optional(),
										surname: z.array(z.string()).optional(),
										title: z.array(z.string()).optional(),
										unique_identifier: z.string().optional(),
										unstructured_address: z.array(z.string()).optional(),
										unstructured_name: z.array(z.string()).optional(),
										user_identifier: z.string().optional(),
										vendor_identifier: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						dns_names: z.array(z.string()).optional(),
						emails: z.array(z.string()).optional(),
						ip_addresses: z.array(z.string()).optional(),
						other_names: z
							.object({
								domain_controller_id: z.array(z.string()).optional(),
								guid: z.array(z.string()).optional(),
								hardware_module_name: z
									.array(
										z
											.object({
												serial_num: z.array(z.number().int()).optional(),
												type: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								raw_other_names: z
									.array(
										z
											.object({
												oid: z.string().optional(),
												value: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						uris: z.array(z.string()).optional(),
						user_principal_names: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				security_identifier: z
					.array(
						z
							.object({
								oid: z.string().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				ski: z
					.object({
						include: z.string().optional(),
						method: z.string().optional(),
					})
					.passthrough()
					.optional(),
				ski_extension: z.string().optional(),
				smime_capabilities: z
					.object({ values: z.array(z.string()).optional() })
					.passthrough()
					.optional(),
				subject_directory_attributes: z
					.object({ encoded_value: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		hsm_provider: z
			.object({
				display_name: z.string().optional(),
				id: z.string().optional(),
				partition_name: z.string().optional(),
				provider_name: z.string().optional(),
				security_level: z
					.enum(['level_1', 'level_2', 'level_3', 'level_4'])
					.optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		issuer: z
			.object({
				hosted_type: z
					.enum(['online', 'offline', 'third_party'])
					.or(z.string())
					.optional(),
				id: z.string().optional(),
				name: z.string().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_generation: z
			.object({
				dilithium_key_size: z.string().optional(),
				ecc_curve: z.string().optional(),
				ecdsa_curve: z.string().optional(),
				falcon_key_size: z.string().optional(),
				key_type: z.string().optional(),
				rsa_key_bits: z.number().int().optional(),
				sphincs_key_size: z.string().optional(),
			})
			.passthrough()
			.optional(),
		key_name: z.string().optional(),
		name: z.string().optional(),
		notification: z
			.object({
				enabled: z.boolean().optional(),
				frequency: z.array(z.number().int()).optional(),
				recipients: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		private_key: z
			.object({
				password: z.string().optional(),
				pkcs12: z.array(z.number().int()).optional(),
				pre_installed: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		responder_type: z.string().optional(),
		serial_number: z.string().optional(),
		signature_algorithm: z.string().optional(),
		status: z.string().optional(),
		updated_date: z.string().optional(),
		validity: z
			.object({
				duration_unit: z.string().optional(),
				duration_value: z.number().int().optional(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validity_truncate: z.boolean().optional(),
	})
	.passthrough();
const r_e6f593872eaaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e6f593872eaaOutput = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							blob: z.string().optional(),
							created_date: z.string().optional(),
							csr: z.array(z.number().int()).optional(),
							csr_blob: z.string().optional(),
							delegated_scope: z
								.object({
									ica_rules: z
										.object({})
										.catchall(
											z
												.object({
													allow_ee: z.boolean().optional(),
													allow_intermediate: z.boolean().optional(),
												})
												.passthrough(),
										)
										.optional(),
								})
								.passthrough()
								.optional(),
							extensions: z
								.object({
									adobe_archive_rev_info: z
										.object({ version: z.number().int().optional() })
										.passthrough()
										.optional(),
									adobe_timestamp: z
										.object({
											location: z.string().optional(),
											requires_auth: z.boolean().optional(),
											version: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									aia: z
										.object({ issuer_urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									aki: z
										.object({
											authority_name_serial_number: z.boolean().optional(),
											include: z.string().optional(),
											key_identifier: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									basic_constraints: z
										.object({
											ca: z.boolean().optional(),
											critical: z.boolean().optional(),
											path_length: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
									cabf_organization_identifier: z
										.object({
											country: z.string().optional(),
											reference: z.string().optional(),
											scheme: z.string().optional(),
											state: z.string().optional(),
										})
										.passthrough()
										.optional(),
									cdp: z
										.object({ urls: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									certificate_policies: z
										.array(
											z
												.object({
													cps_uri: z.string().optional(),
													oid: z.string().optional(),
													user_notice: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									extended_key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									extensions_order: z.array(z.string()).optional(),
									issuer_alt_name: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									key_usage: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
											skip_validation: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									lei: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									lei_role: z
										.object({ value: z.string().optional() })
										.passthrough()
										.optional(),
									microsoft_application_certificate_policies: z
										.object({
											additional_values: z.array(z.string()).optional(),
											critical: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
									microsoft_certificate_template_name: z.string().optional(),
									microsoft_certificate_template_v2: z
										.object({
											major_version: z.number().int().optional(),
											minor_version: z.number().int().optional(),
											oid: z.string().optional(),
										})
										.passthrough()
										.optional(),
									private_key_usage_period: z
										.object({
											critical: unspecifiedProviderValue().optional(),
											not_after: z.string().optional(),
											not_before: z.string().optional(),
										})
										.passthrough()
										.optional(),
									qc_statements: z
										.object({
											critical: z.boolean().optional(),
											'etsi-psd2-qcStatement': z.array(z.string()).optional(),
											'id-etsi-qcs-QcPDS': z
												.array(
													z
														.object({
															language: z.string().optional(),
															uri: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											'id-etsi-qcs-QcRetentionPeriod': z
												.number()
												.int()
												.optional(),
											'id-etsi-qcs-QcType': z.array(z.string()).optional(),
											'id-qcs-pkixQCSyntax-v2': z
												.object({ semantics_id: z.string().optional() })
												.passthrough()
												.optional(),
											oids: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									san: z
										.object({
											directory_names: z
												.array(
													z
														.object({
															common_name: z.string().optional(),
															country: z.string().optional(),
															custom_attributes: z
																.array(
																	z
																		.object({
																			oid: z.string().optional(),
																			type: z.string().optional(),
																			values: z.array(z.string()).optional(),
																		})
																		.passthrough(),
																)
																.optional(),
															description: z.array(z.string()).optional(),
															dn_qualifier: z.string().optional(),
															domain_component: z.array(z.string()).optional(),
															email: z.string().optional(),
															given_name: z.array(z.string()).optional(),
															locality: z.string().optional(),
															organization_identifier: z.string().optional(),
															organization_name: z.string().optional(),
															organization_units: z
																.array(z.string())
																.optional(),
															postal_code: z.string().optional(),
															product_identifier: z.string().optional(),
															pseudonym: z.string().optional(),
															serial_number: z.string().optional(),
															state: z.string().optional(),
															street_address: z.array(z.string()).optional(),
															subject_order: z.array(z.string()).optional(),
															surname: z.array(z.string()).optional(),
															title: z.array(z.string()).optional(),
															unique_identifier: z.string().optional(),
															unstructured_address: z
																.array(z.string())
																.optional(),
															unstructured_name: z.array(z.string()).optional(),
															user_identifier: z.string().optional(),
															vendor_identifier: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											dns_names: z.array(z.string()).optional(),
											emails: z.array(z.string()).optional(),
											ip_addresses: z.array(z.string()).optional(),
											other_names: z
												.object({
													domain_controller_id: z.array(z.string()).optional(),
													guid: z.array(z.string()).optional(),
													hardware_module_name: z
														.array(
															z
																.object({
																	serial_num: z
																		.array(z.number().int())
																		.optional(),
																	type: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
													raw_other_names: z
														.array(
															z
																.object({
																	oid: z.string().optional(),
																	value: z.string().optional(),
																})
																.passthrough(),
														)
														.optional(),
												})
												.passthrough()
												.optional(),
											uris: z.array(z.string()).optional(),
											user_principal_names: z.array(z.string()).optional(),
										})
										.passthrough()
										.optional(),
									security_identifier: z
										.array(
											z
												.object({
													oid: z.string().optional(),
													value: z.string().optional(),
												})
												.passthrough(),
										)
										.optional(),
									ski: z
										.object({
											include: z.string().optional(),
											method: z.string().optional(),
										})
										.passthrough()
										.optional(),
									ski_extension: z.string().optional(),
									smime_capabilities: z
										.object({ values: z.array(z.string()).optional() })
										.passthrough()
										.optional(),
									subject_directory_attributes: z
										.object({
											encoded_value: z.array(z.number().int()).optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough()
								.optional(),
							hsm_provider: z
								.object({
									display_name: z.string().optional(),
									id: z.string().optional(),
									partition_name: z.string().optional(),
									provider_name: z.string().optional(),
									security_level: z
										.enum(['level_1', 'level_2', 'level_3', 'level_4'])
										.optional(),
								})
								.passthrough()
								.optional(),
							id: z.string().optional(),
							issuer: z
								.object({
									hosted_type: z
										.enum(['online', 'offline', 'third_party'])
										.optional(),
									id: z.string().optional(),
									name: z.string().optional(),
									valid_from: z.string().optional(),
									valid_to: z.string().optional(),
								})
								.passthrough()
								.optional(),
							key_generation: z
								.object({
									dilithium_key_size: z.string().optional(),
									ecc_curve: z.string().optional(),
									ecdsa_curve: z.string().optional(),
									falcon_key_size: z.string().optional(),
									key_type: z.string().optional(),
									rsa_key_bits: z.number().int().optional(),
									sphincs_key_size: z.string().optional(),
								})
								.passthrough()
								.optional(),
							key_name: z.string().optional(),
							name: z.string().optional(),
							notification: z
								.object({
									enabled: z.boolean().optional(),
									frequency: z.array(z.number().int()).optional(),
									recipients: z.array(z.string()).optional(),
								})
								.passthrough()
								.optional(),
							private_key: z
								.object({
									password: z.string().optional(),
									pkcs12: z.array(z.number().int()).optional(),
									pre_installed: z.boolean().optional(),
								})
								.passthrough()
								.optional(),
							responder_type: z.string().optional(),
							serial_number: z.string().optional(),
							signature_algorithm: z.string().optional(),
							status: z.string().optional(),
							updated_date: z.string().optional(),
							validity: z
								.object({
									duration_unit: z.string().optional(),
									duration_value: z.number().int().optional(),
									valid_from: z.string().optional(),
									valid_to: z.string().optional(),
								})
								.passthrough()
								.optional(),
							validity_truncate: z.boolean().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_8368e7d73f61Input = z
	.object({
		path: z.object({ profileID: z.string() }).strict(),
		query: z
			.object({
				operation: z.enum(['GetCACert', 'GetCACaps', 'PKIOperation']),
				message: z.string().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_8368e7d73f61Output = z.string();
const r_61fda20c9ab6Input = z
	.object({
		path: z.object({ profileID: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.array(z.number().int()),
	})
	.strict();
const r_61fda20c9ab6Output = z.array(z.number().int());
const r_39c28941d620Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.number().int().optional(),
				limit: z.number().int().optional(),
				name: z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_39c28941d620Output = z.intersection(
	z
		.object({
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			items: z
				.array(
					z
						.object({
							access: z.string().optional(),
							accounts: z
								.array(
									z
										.object({
											id: z.string().optional(),
											name: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							active: z.boolean().optional(),
							category: z.string().optional(),
							cert_type: z
								.enum(['root', 'intermediate', 'end_entity'])
								.optional(),
							created_date: z.string().optional(),
							id: z.string().optional(),
							install_type: z.string().optional(),
							issue_types: z.array(z.string()).optional(),
							kind: z.string().optional(),
							name: z.string().optional(),
							template_json: z.string().optional(),
							trust_type: z.string().optional(),
							updated_date: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
);
const r_14f3953c0d38Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				access: z.string().optional(),
				accounts: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active: z.boolean().optional(),
				category: z.string().optional(),
				cert_type: z.enum(['root', 'intermediate', 'end_entity']).optional(),
				created_date: z.string().optional(),
				id: z.string().optional(),
				install_type: z.string().optional(),
				issue_types: z.array(z.string()).optional(),
				kind: z.string().optional(),
				name: z.string().optional(),
				template_json: z.string().optional(),
				trust_type: z.string().optional(),
				updated_date: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_14f3953c0d38Output = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_2a9e994a5917Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2a9e994a5917Output = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_e631ae341675Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				access: z.string().optional(),
				accounts: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				active: z.boolean().optional(),
				category: z.string().optional(),
				cert_type: z.enum(['root', 'intermediate', 'end_entity']).optional(),
				created_date: z.string().optional(),
				id: z.string().optional(),
				install_type: z.string().optional(),
				issue_types: z.array(z.string()).optional(),
				kind: z.string().optional(),
				name: z.string().optional(),
				template_json: z.string().optional(),
				trust_type: z.string().optional(),
				updated_date: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_e631ae341675Output = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_f46d472400ecInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f46d472400ecOutput = z
	.object({ id: z.string().optional(), name: z.string().optional() })
	.passthrough();
const r_198e7a38a10cInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_198e7a38a10cOutput = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_3de0b5e30515Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_3de0b5e30515Output = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_7784c95351dfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				critical: z.boolean().optional(),
				custom_values: z.object({}).passthrough().optional(),
				oid: z.string().optional(),
				template: z.object({}).passthrough().optional(),
				values_name: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_7784c95351dfOutput = z
	.object({ value: z.array(z.number().int()).optional() })
	.passthrough();
const r_908be7c77f53Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ type: z.string().optional(), category: z.string().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_908be7c77f53Output = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_5ba49344c30fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_5ba49344c30fOutput = z
	.object({
		access: z.string().optional(),
		accounts: z
			.array(
				z
					.object({ id: z.string().optional(), name: z.string().optional() })
					.passthrough(),
			)
			.optional(),
		active: z.boolean().optional(),
		category: z.string().optional(),
		cert_type: z
			.enum(['root', 'intermediate', 'end_entity'])
			.or(z.string())
			.optional(),
		created_date: z.string().optional(),
		id: z.string().optional(),
		install_type: z.string().optional(),
		issue_types: z.array(z.string()).optional(),
		kind: z.string().optional(),
		name: z.string().optional(),
		template_json: z.string().optional(),
		trust_type: z.string().optional(),
		updated_date: z.string().optional(),
	})
	.passthrough();
const r_2eeb27b0266eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profileId: unspecifiedProviderValue().optional(),
				expiry_at: unspecifiedProviderValue().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2eeb27b0266eOutput = z
	.object({
		eab_kid: unspecifiedProviderValue().optional(),
		eab_hmac: unspecifiedProviderValue().optional(),
		directory_url: unspecifiedProviderValue().optional(),
		expiry_date: unspecifiedProviderValue().nullable().optional(),
	})
	.passthrough();
const r_145c99f05651Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				targets: z
					.object({
						agents: unspecifiedProviderValue().optional(),
						groups: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				options: z
					.object({
						os_certificate_store_scan: unspecifiedProviderValue().optional(),
						file_system_scan: unspecifiedProviderValue().optional(),
						file_system_scan_types: unspecifiedProviderValue().optional(),
						keystore_credentials: unspecifiedProviderValue().optional(),
						os_cert_store_scan_options: z
							.object({
								local_machine_stores: unspecifiedProviderValue().optional(),
								current_user_stores: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						data_business_unit_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				schedule: z
					.object({
						frequency: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY']),
						start_time: unspecifiedProviderValue(),
						timezone: unspecifiedProviderValue().optional(),
						days_to_run: unspecifiedProviderValue().optional(),
						day_of_month: unspecifiedProviderValue().optional(),
						week_of_month: z
							.union([
								z.literal('FIRST'),
								z.literal('SECOND'),
								z.literal('THIRD'),
								z.literal('FOURTH'),
								z.literal('LAST'),
								z.literal(null),
							])
							.optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_145c99f05651Output = z.undefined();
const r_99ffa6002270Input = z
	.object({
		path: z.object({ agentId: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_99ffa6002270Output = z.undefined();
const r_ed3ac2b880e3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ agents: unspecifiedProviderValue().optional() })
			.passthrough(),
	})
	.strict();
const r_ed3ac2b880e3Output = z.undefined();
const r_214735411dd4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ agents: unspecifiedProviderValue().optional() })
			.passthrough(),
	})
	.strict();
const r_214735411dd4Output = z.undefined();
const r_98ae93786afeInput = z
	.object({
		path: z
			.object({
				agentId: unspecifiedProviderValue(),
				time: unspecifiedProviderValue(),
			})
			.strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_98ae93786afeOutput = z.undefined();
const r_b907984f070bInput = z
	.object({
		path: z
			.object({
				agentId: unspecifiedProviderValue(),
				time: unspecifiedProviderValue(),
			})
			.strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b907984f070bOutput = z.undefined();
const r_1e4c8b4f1269Input = z
	.object({
		path: z
			.object({
				agentId: unspecifiedProviderValue(),
				scanId: unspecifiedProviderValue(),
			})
			.strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_1e4c8b4f1269Output = z.undefined();
const r_73d4daf6bd17Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				limit: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				searchParams: z
					.object({ skipped: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
				account_id: unspecifiedProviderValue(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_73d4daf6bd17Output = z.undefined();
const r_a4a835e15a4fInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				category: z.enum(['CURRENT', 'PAST']).optional(),
				limit: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				status: z
					.enum(['COMPLETED', 'DELETED', 'FAILED', 'PARTIAL', 'SKIPPED'])
					.optional(),
				account_id: unspecifiedProviderValue(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a4a835e15a4fOutput = z.undefined();
const r_b1de500e018cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				limit: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue(),
				search_query: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b1de500e018cOutput = z.undefined();
const r_b5bd22f27e1dInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b5bd22f27e1dOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		status: unspecifiedProviderValue().optional(),
		status_details: unspecifiedProviderValue().optional(),
		version: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		business_unit: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		app_info: z
			.object({
				name: unspecifiedProviderValue().optional(),
				version: unspecifiedProviderValue().optional(),
				arch: unspecifiedProviderValue().optional(),
				flavor: unspecifiedProviderValue().optional(),
				automation_order: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		management_key: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		updated_at: unspecifiedProviderValue().optional(),
		inventories: unspecifiedProviderValue().optional(),
		os_name: unspecifiedProviderValue().optional(),
		os_version: unspecifiedProviderValue().optional(),
		agent_group: unspecifiedProviderValue().optional(),
		host_name: unspecifiedProviderValue().optional(),
		sni: z
			.object({
				is_enabled: unspecifiedProviderValue().optional(),
				items: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		error_message: unspecifiedProviderValue().optional(),
		auto_update_enabled: unspecifiedProviderValue().optional(),
		deployed_at: unspecifiedProviderValue().optional(),
		os_info: unspecifiedProviderValue().optional(),
		hb_interval: unspecifiedProviderValue().optional(),
		recipients: unspecifiedProviderValue().optional(),
		upgradable: unspecifiedProviderValue().optional(),
		post_install_service_restart: unspecifiedProviderValue().optional(),
		proxy_host: unspecifiedProviderValue().optional(),
		license_key: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_308eb2d1df1cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				ids: unspecifiedProviderValue().optional(),
				location_preference: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_308eb2d1df1cOutput = z.undefined();
const r_920a440ee1dfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ ids: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_920a440ee1dfOutput = z.undefined();
const r_0b702b08d456Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ ids: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_0b702b08d456Output = z.undefined();
const r_5e7f03054b55Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				agent_group: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				hb_interval: unspecifiedProviderValue().optional(),
				id: unspecifiedProviderValue().optional(),
				inventories: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				recipients: unspecifiedProviderValue().optional(),
				sni: z
					.object({
						is_enabled: unspecifiedProviderValue().optional(),
						items: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				version: unspecifiedProviderValue().optional(),
				script_settings: unspecifiedProviderValue().optional(),
				post_install_service_restart: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5e7f03054b55Output = z.undefined();
const r_5c203004de20Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: unspecifiedProviderValue().optional(),
				inventory: z
					.object({
						acme_client_id: unspecifiedProviderValue().optional(),
						app_name: unspecifiedProviderValue().optional(),
						app_version: unspecifiedProviderValue().optional(),
						automation_status: z
							.enum([
								'ACME_ACCOUNT_CREATED',
								'ACME_ACCOUNT_CREATION_FAILED',
								'ACME_ACCOUNT_CREATION_IN_PROGRESS',
								'ACME_CERT_ISSUANCE_FAILED',
								'ACME_CERT_ISSUANCE_IN_PROGRESS',
								'ACME_CERT_ISSUED',
								'ACME_CHALLENGE_VALIDATED',
								'ACME_CHALLENGE_VALIDATION_FAILED',
								'ACME_CHALLENGE_VALIDATION_IN_PROGRESS',
								'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
								'ACTION_REQUIRED',
								'AGENT_ERROR',
								'AUTOMATED_BY_AGENT',
								'AUTOMATED_BY_AGENTLESS',
								'AUTOMATION_AT_RISK',
								'AUTOMATION_FAILED',
								'AUTOMATION_PROFILE_BLOCKED',
								'AUTOMATION_REQUESTED',
								'AUTOMATION_SCHEDULED',
								'AUTOMATION_SUCCESSFUL',
								'AUTO_RENEW_SCHEDULED',
								'CERT_PENDING_APPROVAL',
								'CERT_READY_TO_INSTALL',
								'CERT_REQ_DENIED_BY_CIS',
								'CONFIGURATION_ERROR',
								'CONFIGURATION_IN_PROGRESS',
								'CONFIGURED',
								'CONFLICTED',
								'CSR_GENERATION_FAILED',
								'CSR_GENERATION_IN_PROGRESS',
								'CSR_GENERATION_SUCCEEDED',
								'DELETED',
								'DISABLED_FOR_AUTOMATION',
								'DNS_INTEGRATION_FAILED',
								'IGNORED',
								'INSTALL_FAILED',
								'INSTALL_IN_PROGRESS',
								'INSTALL_SUCCEEDED',
								'INSTALL_VALIDATED',
								'INSTALL_VALIDATION_FAILED',
								'INSTALL_VALIDATION_IN_PROGRESS',
								'INTEGRATION_ERROR',
								'IS_UPGRADE',
								'NOT_CONFIGURED',
								'NOT_SCANNED',
								'POST_CSR_FAILED',
								'REMOVED',
								'SCAN_IN_PROGRESS',
							])
							.optional(),
						id: unspecifiedProviderValue().optional(),
						ip: unspecifiedProviderValue().optional(),
						port: z
							.object({ port: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
						script_args: unspecifiedProviderValue().optional(),
						script_path: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5c203004de20Output = z.undefined();
const r_97fb243f7243Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				field: unspecifiedProviderValue().optional(),
				searchQuery: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_97fb243f7243Output = z.undefined();
const r_1664e1d5afc5Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				operation_system: unspecifiedProviderValue().optional(),
				type: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_1664e1d5afc5Output = z.undefined();
const r_99797a8dc240Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				os: unspecifiedProviderValue().optional(),
				type: unspecifiedProviderValue().optional(),
				path: unspecifiedProviderValue().optional(),
				executionCommand: unspecifiedProviderValue().optional(),
				description: unspecifiedProviderValue().optional(),
				automationId: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_99797a8dc240Output = z.undefined();
const r_b4f767ee3a21Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b4f767ee3a21Output = z.undefined();
const r_92967c73d90eInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				os: unspecifiedProviderValue().optional(),
				type: unspecifiedProviderValue().optional(),
				path: unspecifiedProviderValue().optional(),
				executionCommand: unspecifiedProviderValue().optional(),
				description: unspecifiedProviderValue().optional(),
				automationId: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_92967c73d90eOutput = z.undefined();
const r_28403eaf35f7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue().optional(),
	})
	.strict();
const r_28403eaf35f7Output = z.undefined();
const r_692763a58cdaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ ids: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_692763a58cdaOutput = z.undefined();
const r_14cebde31ad8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				comment: unspecifiedProviderValue().optional(),
				ids: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_14cebde31ad8Output = z.undefined();
const r_6873b02914f1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ ids: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_6873b02914f1Output = z.undefined();
const r_cd67d7ceb107Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				default: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd67d7ceb107Output = z.undefined();
const r_2b409ddd1947Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				linux_restricted_ports: unspecifiedProviderValue().optional(),
				manual_approval: unspecifiedProviderValue().optional(),
				scan_block_list: unspecifiedProviderValue().optional(),
				windows_restricted_ports: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2b409ddd1947Output = z.undefined();
const r_f8e988a67b87Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				linux_restricted_ports: unspecifiedProviderValue().optional(),
				manual_approval: unspecifiedProviderValue().optional(),
				scan_block_list: unspecifiedProviderValue().optional(),
				windows_restricted_ports: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_f8e988a67b87Output = z.undefined();
const r_90ec560047bdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				automation_id: unspecifiedProviderValue(),
				account_id: unspecifiedProviderValue(),
				action_type: z.enum([
					'ENROLL',
					'GET_NEXT_CERT',
					'REISSUE',
					'RENEW',
					'TRANSFER',
				]),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: unspecifiedProviderValue(),
						auto_renew_time: z
							.object({
								days: unspecifiedProviderValue().optional(),
								hours: unspecifiedProviderValue().optional(),
								minutes: unspecifiedProviderValue().optional(),
								time_format: unspecifiedProviderValue(),
								zone: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						before_expiration: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				cn: unspecifiedProviderValue(),
				custom_fields: unspecifiedProviderValue().optional(),
				dns_integration_id: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue(),
				redirect_port: unspecifiedProviderValue().optional(),
				run_now: unspecifiedProviderValue().optional(),
				sans: unspecifiedProviderValue().optional(),
				schedule_settings: z
					.object({
						hours: unspecifiedProviderValue().optional(),
						minutes: unspecifiedProviderValue().optional(),
						start_date: unspecifiedProviderValue(),
						time_format: unspecifiedProviderValue(),
						zone: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				match_wildcard_subdomain: unspecifiedProviderValue().optional(),
				custom_attributes_field: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_90ec560047bdOutput = z.undefined();
const r_e3b44e3e638bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile_id: unspecifiedProviderValue().optional(),
				cn: unspecifiedProviderValue().optional(),
				sans: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: unspecifiedProviderValue(),
						auto_renew_time: z
							.object({
								days: unspecifiedProviderValue().optional(),
								hours: unspecifiedProviderValue().optional(),
								minutes: unspecifiedProviderValue().optional(),
								time_format: unspecifiedProviderValue(),
								zone: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						before_expiration: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				additional_order_options: z
					.object({
						comments_to_administrator: unspecifiedProviderValue().optional(),
						order_specific_renewal_message:
							unspecifiedProviderValue().optional(),
						additional_emails: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				cert_delivery_settings: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				inventory_id: unspecifiedProviderValue().optional(),
				source_certificate_id: unspecifiedProviderValue().optional(),
				custom_attributes_field: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_e3b44e3e638bOutput = z.undefined();
const r_4470d3e39ef2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				record_ids: unspecifiedProviderValue().optional(),
				awr_profile_id: unspecifiedProviderValue().optional(),
				sensor_profile_id: unspecifiedProviderValue().optional(),
				agent_profile_id: unspecifiedProviderValue().optional(),
				ca_name: unspecifiedProviderValue().optional(),
				bulk_action_type: z
					.object({
						primaryAction: z
							.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
							.optional(),
						renewalStartDate: unspecifiedProviderValue().optional(),
						secondaryActions: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_4470d3e39ef2Output = z.undefined();
const r_c0eb04e32216Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				automation_ids: unspecifiedProviderValue(),
				account_id: unspecifiedProviderValue(),
				custom_fields: unspecifiedProviderValue().optional(),
				dns_integration_id: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				run_now: unspecifiedProviderValue().optional(),
				schedule_settings: z
					.object({
						hours: unspecifiedProviderValue().optional(),
						minutes: unspecifiedProviderValue().optional(),
						start_date: unspecifiedProviderValue(),
						time_format: unspecifiedProviderValue(),
						zone: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				awr_profile_id: unspecifiedProviderValue().optional(),
				sensor_profile_id: unspecifiedProviderValue().optional(),
				agent_profile_id: unspecifiedProviderValue().optional(),
				bulk_action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				bulk_automation_batch_name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c0eb04e32216Output = z.undefined();
const r_710554dcec90Input = z
	.object({
		path: z.object({ automation_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_710554dcec90Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		automation_flow_details: z
			.object({
				auto_renew_enabled: unspecifiedProviderValue().optional(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: unspecifiedProviderValue(),
						auto_renew_time: z
							.object({
								days: unspecifiedProviderValue().optional(),
								hours: unspecifiedProviderValue().optional(),
								minutes: unspecifiedProviderValue().optional(),
								time_format: unspecifiedProviderValue(),
								zone: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						before_expiration: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				automation_error: z
					.object({
						error_code: unspecifiedProviderValue().optional(),
						error_message: unspecifiedProviderValue().optional(),
						solution: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				is_retry_applicable: unspecifiedProviderValue().optional(),
				last_initiated_time: unspecifiedProviderValue().optional(),
				last_run_time: unspecifiedProviderValue().optional(),
				next_run_time: unspecifiedProviderValue().optional(),
				organization: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				dns_integration: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				profile: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				schedule_settings: z
					.object({
						hours: unspecifiedProviderValue().optional(),
						minutes: unspecifiedProviderValue().optional(),
						start_date: unspecifiedProviderValue(),
						time_format: unspecifiedProviderValue(),
						zone: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				template: z
					.object({
						id: unspecifiedProviderValue().optional(),
						name: unspecifiedProviderValue().optional(),
						trust_type: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		automation_status: z
			.intersection(
				z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.or(z.string()),
				unspecifiedProviderValue(),
			)
			.optional(),
		certificate_details: z
			.object({
				cert_validity: unspecifiedProviderValue().optional(),
				common_name: unspecifiedProviderValue().optional(),
				ip: unspecifiedProviderValue().optional(),
				key_algorithm: unspecifiedProviderValue().optional(),
				key_size: unspecifiedProviderValue().optional(),
				order_id: unspecifiedProviderValue().optional(),
				order_valid_till: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				previous_action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				product_name: unspecifiedProviderValue().optional(),
				product_type: unspecifiedProviderValue().optional(),
				redirect_port: unspecifiedProviderValue().optional(),
				sans: unspecifiedProviderValue().optional(),
				serial_number: unspecifiedProviderValue().optional(),
				signature_hash: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_bcabad219d28Input = z
	.object({
		path: z.object({ automation_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: unspecifiedProviderValue(),
						auto_renew_time: z
							.object({
								days: unspecifiedProviderValue().optional(),
								hours: unspecifiedProviderValue().optional(),
								minutes: unspecifiedProviderValue().optional(),
								time_format: unspecifiedProviderValue(),
								zone: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						before_expiration: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				profile_id: unspecifiedProviderValue(),
				run_now: unspecifiedProviderValue().optional(),
				schedule_settings: z
					.object({
						hours: unspecifiedProviderValue().optional(),
						minutes: unspecifiedProviderValue().optional(),
						start_date: unspecifiedProviderValue(),
						time_format: unspecifiedProviderValue(),
						zone: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_bcabad219d28Output = z.undefined();
const r_fdcddee44a8eInput = z
	.object({
		path: z.object({ automation_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fdcddee44a8eOutput = z.undefined();
const r_f993fc71dd6cInput = z
	.object({
		path: z.object({ automation_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f993fc71dd6cOutput = z.undefined();
const r_948c3283fb77Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				application: z
					.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
					.optional(),
				automation_status: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
				device: unspecifiedProviderValue().optional(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				source: unspecifiedProviderValue().optional(),
				system_name: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_948c3283fb77Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_ef7eddd600a0Input = z
	.object({
		path: z.object({ automation_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ef7eddd600a0Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		automation: z
			.intersection(
				z.intersection(
					unspecifiedProviderValue(),
					z
						.object({
							id: unspecifiedProviderValue().optional(),
							ip: unspecifiedProviderValue().optional(),
							port: unspecifiedProviderValue().optional(),
							system_name: unspecifiedProviderValue().optional(),
							application: unspecifiedProviderValue().optional(),
							device: unspecifiedProviderValue().optional(),
							profile: z
								.object({
									id: unspecifiedProviderValue().optional(),
									name: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
							is_auto_renew: unspecifiedProviderValue().optional(),
							automation_status: z
								.enum([
									'ACME_ACCOUNT_CREATED',
									'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
									'ACTION_REQUIRED',
									'AGENT_ERROR',
									'AUTOMATED_BY_AGENT',
									'AUTOMATED_BY_AGENTLESS',
									'AUTOMATION_AT_RISK',
									'AUTOMATION_FAILED',
									'AUTOMATION_PROFILE_BLOCKED',
									'AUTOMATION_REQUESTED',
									'AUTOMATION_SCHEDULED',
									'AUTOMATION_SUCCESSFUL',
									'AUTO_RENEW_SCHEDULED',
									'CERT_PENDING_APPROVAL',
									'CERT_READY_TO_INSTALL',
									'CERT_REQ_DENIED_BY_CIS',
									'CONFIGURATION_ERROR',
									'CONFIGURATION_IN_PROGRESS',
									'CONFIGURED',
									'CONFLICTED',
									'CSR_GENERATION_FAILED',
									'CSR_GENERATION_IN_PROGRESS',
									'CSR_GENERATION_SUCCEEDED',
									'DELETED',
									'DISABLED_FOR_AUTOMATION',
									'DNS_INTEGRATION_FAILED',
									'IGNORED',
									'INSTALL_FAILED',
									'INSTALL_IN_PROGRESS',
									'INSTALL_SUCCEEDED',
									'INSTALL_VALIDATED',
									'INSTALL_VALIDATION_FAILED',
									'INSTALL_VALIDATION_IN_PROGRESS',
									'IS_UPGRADE',
									'NOT_CONFIGURED',
									'NOT_SCANNED',
									'POST_CSR_FAILED',
									'REMOVED',
									'SCAN_IN_PROGRESS',
								])
								.optional(),
							automation_action: z
								.object({
									primaryAction: z
										.enum([
											'ENROLL',
											'GET_NEXT_CERT',
											'REISSUE',
											'RENEW',
											'TRANSFER',
										])
										.optional(),
									renewalStartDate: unspecifiedProviderValue().optional(),
									secondaryActions: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough(),
				),
				z
					.object({
						os_name: unspecifiedProviderValue().optional(),
						os_version: unspecifiedProviderValue().optional(),
						app_info: z
							.object({
								name: unspecifiedProviderValue().optional(),
								version: unspecifiedProviderValue().optional(),
								arch: unspecifiedProviderValue().optional(),
								flavor: unspecifiedProviderValue().optional(),
								automation_order: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						category: z
							.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
							.optional(),
						first_discovered: unspecifiedProviderValue().optional(),
						last_discovered: unspecifiedProviderValue().optional(),
						last_initiated_time: unspecifiedProviderValue().optional(),
						last_run: unspecifiedProviderValue().optional(),
						next_run: unspecifiedProviderValue().optional(),
						common_name: unspecifiedProviderValue().optional(),
						domain_name: unspecifiedProviderValue().optional(),
						source: unspecifiedProviderValue().optional(),
						custom_fields: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			)
			.optional(),
		certificate: z
			.intersection(
				unspecifiedProviderValue(),
				z
					.object({
						id: unspecifiedProviderValue().optional(),
						inventory_id: unspecifiedProviderValue().optional(),
						ip: unspecifiedProviderValue().optional(),
						port: unspecifiedProviderValue().optional(),
						application: unspecifiedProviderValue().optional(),
						system_name: unspecifiedProviderValue().optional(),
						attributes: unspecifiedProviderValue().optional(),
						auto_renew_status: unspecifiedProviderValue().optional(),
						automation_action: z
							.object({
								primaryAction: z
									.enum([
										'ENROLL',
										'GET_NEXT_CERT',
										'REISSUE',
										'RENEW',
										'TRANSFER',
									])
									.optional(),
								renewalStartDate: unspecifiedProviderValue().optional(),
								secondaryActions: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						automation_status: z
							.intersection(
								z
									.enum([
										'ACME_ACCOUNT_CREATED',
										'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
										'ACTION_REQUIRED',
										'AGENT_ERROR',
										'AUTOMATED_BY_AGENT',
										'AUTOMATED_BY_AGENTLESS',
										'AUTOMATION_AT_RISK',
										'AUTOMATION_FAILED',
										'AUTOMATION_PROFILE_BLOCKED',
										'AUTOMATION_REQUESTED',
										'AUTOMATION_SCHEDULED',
										'AUTOMATION_SUCCESSFUL',
										'AUTO_RENEW_SCHEDULED',
										'CERT_PENDING_APPROVAL',
										'CERT_READY_TO_INSTALL',
										'CERT_REQ_DENIED_BY_CIS',
										'CONFIGURATION_ERROR',
										'CONFIGURATION_IN_PROGRESS',
										'CONFIGURED',
										'CONFLICTED',
										'CSR_GENERATION_FAILED',
										'CSR_GENERATION_IN_PROGRESS',
										'CSR_GENERATION_SUCCEEDED',
										'DELETED',
										'DISABLED_FOR_AUTOMATION',
										'DNS_INTEGRATION_FAILED',
										'IGNORED',
										'INSTALL_FAILED',
										'INSTALL_IN_PROGRESS',
										'INSTALL_SUCCEEDED',
										'INSTALL_VALIDATED',
										'INSTALL_VALIDATION_FAILED',
										'INSTALL_VALIDATION_IN_PROGRESS',
										'IS_UPGRADE',
										'NOT_CONFIGURED',
										'NOT_SCANNED',
										'POST_CSR_FAILED',
										'REMOVED',
										'SCAN_IN_PROGRESS',
									])
									.or(z.string()),
								unspecifiedProviderValue(),
							)
							.optional(),
						business_unit: z
							.object({
								id: unspecifiedProviderValue(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						ca_cert_id: unspecifiedProviderValue().optional(),
						cc_settings: z
							.object({
								auto_renew_settings: z
									.object({
										auto_renew_certificate_and_order:
											unspecifiedProviderValue(),
										auto_renew_time: z
											.object({
												days: unspecifiedProviderValue().optional(),
												hours: unspecifiedProviderValue().optional(),
												minutes: unspecifiedProviderValue().optional(),
												time_format: unspecifiedProviderValue(),
												zone: unspecifiedProviderValue(),
											})
											.passthrough()
											.optional(),
										before_expiration: unspecifiedProviderValue(),
									})
									.passthrough()
									.optional(),
								contacts: unspecifiedProviderValue().optional(),
								http_signed_exchange: unspecifiedProviderValue().optional(),
								key_sizes: unspecifiedProviderValue().optional(),
								account_id: unspecifiedProviderValue().optional(),
								is_custom_validity: unspecifiedProviderValue().optional(),
								duplicate_minimum_validity_days: unspecifiedProviderValue()
									.nullable()
									.optional(),
								key_type: unspecifiedProviderValue().optional(),
								order_coverage_length: unspecifiedProviderValue().optional(),
								override_validity: unspecifiedProviderValue().optional(),
								organization: z
									.object({
										id: unspecifiedProviderValue().optional(),
										name: unspecifiedProviderValue().optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								organization_contact: z
									.object({
										id: unspecifiedProviderValue(),
										name: unspecifiedProviderValue(),
										contact_type: z
											.enum([
												'organization_contact',
												'technical_contact',
												'verified_contact',
											])
											.or(z.string()),
									})
									.passthrough()
									.optional(),
								product_type: z
									.enum([
										'cloud_dv_geotrust',
										'code_signing',
										'code_signing_ev',
										'private_ssl_flex',
										'private_ssl_multi_domain',
										'private_ssl_plus',
										'private_ssl_wildcard',
										'ssl_basic',
										'ssl_cloud_wildcard',
										'ssl_dv_geotrust',
										'ssl_dv_geotrust_flex',
										'ssl_dv_rapidssl',
										'ssl_dv_thawte',
										'ssl_ev_basic',
										'ssl_ev_geotrust_truebizid',
										'ssl_ev_multi_domain',
										'ssl_ev_plus',
										'ssl_ev_securesite',
										'ssl_ev_securesite_flex',
										'ssl_ev_securesite_multi_domain',
										'ssl_ev_securesite_pro',
										'ssl_ev_thawte_webserver',
										'ssl_geotrust_truebizid',
										'ssl_multi_domain',
										'ssl_plus',
										'ssl_securesite',
										'ssl_securesite_flex',
										'ssl_securesite_multi_domain',
										'ssl_securesite_pro',
										'ssl_securesite_wildcard',
										'ssl_thawte_webserver',
										'ssl_wildcard',
										'wildcard_dv_geotrust',
										'wildcard_dv_rapidssl',
									])
									.or(z.string()),
								signature_algorithm: z
									.object({
										id: unspecifiedProviderValue().optional(),
										name: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								container: z
									.object({
										id: unspecifiedProviderValue().optional(),
										name: unspecifiedProviderValue().optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								region: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						common_name: unspecifiedProviderValue().optional(),
						dual_approval_status: z
							.object({
								admins_approved: unspecifiedProviderValue().optional(),
								dual_approve_enabled: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						enrollment: unspecifiedProviderValue().optional(),
						escrow: unspecifiedProviderValue().optional(),
						external_ca_name: unspecifiedProviderValue().optional(),
						ica: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						key_length: unspecifiedProviderValue().optional(),
						key_type: unspecifiedProviderValue().optional(),
						managing_integration: unspecifiedProviderValue().optional(),
						notes: unspecifiedProviderValue().optional(),
						order_id: unspecifiedProviderValue().optional(),
						organization_name: unspecifiedProviderValue().optional(),
						organization_unit: unspecifiedProviderValue().optional(),
						organization_identifier: unspecifiedProviderValue().optional(),
						profile: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						revocation_reason: z
							.enum([
								'aa_compromise',
								'affiliation_changed',
								'ca_compromise',
								'certificate_hold',
								'cessation_of_operation',
								'key_compromise',
								'privilege_withdrawn',
								'remove_from_crl',
								'superseded',
								'unspecified',
							])
							.optional(),
						seat: z
							.object({
								id: unspecifiedProviderValue().optional(),
								active: unspecifiedProviderValue().optional(),
								business_unit: z
									.object({
										id: unspecifiedProviderValue(),
										name: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								created_at: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
								number_of_pending: unspecifiedProviderValue().optional(),
								phone: unspecifiedProviderValue().optional(),
								seat_allowed_for_enrollment:
									unspecifiedProviderValue().optional(),
								seat_id: unspecifiedProviderValue().optional(),
								seat_name: unspecifiedProviderValue().optional(),
								seat_type: z
									.object({
										id: unspecifiedProviderValue().optional(),
										name: z
											.intersection(
												z.intersection(
													z
														.enum([
															'USER_SEAT',
															'DISCOVERY_SEAT',
															'SERVER_SEAT',
															'DEVICE_SEAT',
															'IMPORTED_SEAT',
															'ORGANIZATION_SEAT',
															'CERTIFICATE_MANAGEMENT_SEAT',
														])
														.or(z.string()),
													unspecifiedProviderValue(),
												),
												unspecifiedProviderValue(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						serial_number: unspecifiedProviderValue().optional(),
						status: z
							.enum(['deleted', 'expired', 'issued', 'revoked', 'suspended'])
							.optional(),
						subject_email: unspecifiedProviderValue().optional(),
						valid_from: unspecifiedProviderValue().optional(),
						valid_to: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_382f226cdcf4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				created_at_from: unspecifiedProviderValue().optional(),
				created_at_to: unspecifiedProviderValue().optional(),
				active: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_382f226cdcf4Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_5bec67c21dcfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: unspecifiedProviderValue(),
				account: z.object({ id: unspecifiedProviderValue() }).passthrough(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5bec67c21dcfOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		active: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		account: z
			.object({ id: unspecifiedProviderValue() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_162c051d7b24Input = z
	.object({
		path: z.object({ bu_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_162c051d7b24Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		active: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		account: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		admins: unspecifiedProviderValue().optional(),
		available_seats_stats: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_38929d3c5c45Input = z
	.object({
		path: z.object({ bu_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38929d3c5c45Output = z.undefined();
const r_e130670d7f5aInput = z
	.object({
		path: z.object({ bu_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue().optional(),
	})
	.strict();
const r_e130670d7f5aOutput = unspecifiedProviderValue();
const r_59f4fecff54aInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ id: unspecifiedProviderValue() }).passthrough(),
	})
	.strict();
const r_59f4fecff54aOutput = unspecifiedProviderValue();
const r_78c077df3817Input = z
	.object({
		path: z
			.object({
				id: unspecifiedProviderValue(),
				adminId: unspecifiedProviderValue(),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_78c077df3817Output = z.undefined();
const r_23c269effbe6Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue(),
				first_name: unspecifiedProviderValue().optional(),
				last_name: unspecifiedProviderValue().optional(),
				email: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_23c269effbe6Output = z
	.object({
		total: unspecifiedProviderValue().optional(),
		items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_e254ce295d12Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				certificate_owner: z
					.object({
						first_name: unspecifiedProviderValue().optional(),
						last_name: unspecifiedProviderValue().optional(),
						email: unspecifiedProviderValue(),
						custom_identifier: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_e254ce295d12Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		first_name: unspecifiedProviderValue().optional(),
		last_name: unspecifiedProviderValue().optional(),
		email: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		custom_identifier: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_589d79d3192eInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_589d79d3192eOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		first_name: unspecifiedProviderValue().optional(),
		last_name: unspecifiedProviderValue().optional(),
		email: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		custom_identifier: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_c0711fd42515Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				certificate_owner: z
					.object({
						first_name: unspecifiedProviderValue().optional(),
						last_name: unspecifiedProviderValue().optional(),
						email: unspecifiedProviderValue(),
						custom_identifier: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_c0711fd42515Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		first_name: unspecifiedProviderValue().optional(),
		last_name: unspecifiedProviderValue().optional(),
		email: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		custom_identifier: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_9f6fcd99fd97Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9f6fcd99fd97Output = z
	.object({
		status: unspecifiedProviderValue().optional(),
		affected_profiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_08c5118e8629Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				certificate_owner_ids: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_08c5118e8629Output = z.undefined();
const r_a4a3093d5297Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				certificate_owner_ids: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_a4a3093d5297Output = z.undefined();
const r_4ea70ee9ce09Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.union([
				z
					.object({
						profile: z
							.object({ id: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
						seat: z
							.object({
								seat_id: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						csr: unspecifiedProviderValue().optional(),
						validity: z
							.object({
								unit: z
									.enum(['years', 'months', 'days', 'hours', 'minutes'])
									.optional(),
								duration: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						delivery_format: z
							.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
							.optional(),
						include_ca_chain: unspecifiedProviderValue().optional(),
						attributes: z
							.object({
								subject: z
									.object({
										common_name: unspecifiedProviderValue().optional(),
										organization_name: unspecifiedProviderValue().optional(),
										organization_units: unspecifiedProviderValue().optional(),
										description: unspecifiedProviderValue().optional(),
										serial_number: unspecifiedProviderValue().optional(),
										pseudonym: unspecifiedProviderValue().optional(),
										unique_identifier: unspecifiedProviderValue().optional(),
										user_identifier: unspecifiedProviderValue().optional(),
										domain_component: unspecifiedProviderValue().optional(),
										dn_qualifier: unspecifiedProviderValue().optional(),
										unstructured_name: unspecifiedProviderValue().optional(),
										unstructured_address: unspecifiedProviderValue().optional(),
										street_address: unspecifiedProviderValue().optional(),
										locality: unspecifiedProviderValue().optional(),
										state: unspecifiedProviderValue().optional(),
										postal_code: unspecifiedProviderValue().optional(),
										country: unspecifiedProviderValue().optional(),
										email: unspecifiedProviderValue().optional(),
										title: unspecifiedProviderValue().optional(),
										given_name: unspecifiedProviderValue().optional(),
										surname: unspecifiedProviderValue().optional(),
										organization_identifier:
											unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								extensions: z
									.object({
										san: z
											.object({
												dns_names: unspecifiedProviderValue().optional(),
												emails: unspecifiedProviderValue().optional(),
												ip_addresses: unspecifiedProviderValue().optional(),
												other_names: z
													.object({
														guid: unspecifiedProviderValue().optional(),
														raw_other_names:
															unspecifiedProviderValue().optional(),
													})
													.passthrough()
													.optional(),
												registered_ids: unspecifiedProviderValue().optional(),
												directory_name: unspecifiedProviderValue().optional(),
												uris: unspecifiedProviderValue().optional(),
												user_principal_names:
													unspecifiedProviderValue().optional(),
											})
											.passthrough()
											.optional(),
										issuer_alt_name: z
											.object({
												directory_name: z
													.object({
														value: unspecifiedProviderValue().optional(),
														critical: unspecifiedProviderValue().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										security_identifier: z
											.object({
												additional_values:
													unspecifiedProviderValue().optional(),
											})
											.passthrough()
											.optional(),
										lei: z
											.object({
												value: unspecifiedProviderValue().optional(),
												critical: unspecifiedProviderValue().optional(),
											})
											.passthrough()
											.optional(),
										lei_role: z
											.object({
												value: unspecifiedProviderValue().optional(),
												critical: unspecifiedProviderValue().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								custom_values: unspecifiedProviderValue().optional(),
								tnc_accepted: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						tags: unspecifiedProviderValue().optional(),
						cert_owner_ids: unspecifiedProviderValue().optional(),
						ca_attributes: z
							.object({
								schema: z
									.object({
										ct_log_option: unspecifiedProviderValue().optional(),
										dcv_method: z
											.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
											.optional(),
										renewal_of_order_id: unspecifiedProviderValue().optional(),
										skip_domain_validation:
											unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						custom_attributes: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				z
					.object({
						profile: z
							.object({ id: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
						seat: z
							.object({
								seat_id: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						csr: unspecifiedProviderValue().optional(),
						validity: z
							.object({
								unit: z
									.enum(['years', 'months', 'days', 'hours', 'minutes'])
									.optional(),
								duration: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						delivery_format: z
							.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
							.optional(),
						include_ca_chain: unspecifiedProviderValue().optional(),
						attributes: z
							.object({
								subject: z
									.object({
										pseudonym: unspecifiedProviderValue().optional(),
										title: unspecifiedProviderValue().optional(),
										given_name: unspecifiedProviderValue().optional(),
										surname: unspecifiedProviderValue().optional(),
										UserPrincipalName: unspecifiedProviderValue().optional(),
										email: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								extensions: z
									.object({
										san: z
											.object({ emails: unspecifiedProviderValue().optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								custom_values: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						tags: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			])
			.optional(),
	})
	.strict();
const r_4ea70ee9ce09Output = z
	.object({
		serial_number: unspecifiedProviderValue().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: unspecifiedProviderValue().optional(),
		pkcs12_password: unspecifiedProviderValue().optional(),
		request_id: unspecifiedProviderValue().optional(),
		dv_details: z
			.object({
				schema: z
					.object({
						dcv_method: z
							.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
							.optional(),
						dcv_random_value: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_aba4f70417deInput = z
	.object({
		path: z.object({ request_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: z
					.object({ id: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_aba4f70417deOutput = z
	.object({
		serial_number: unspecifiedProviderValue().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: unspecifiedProviderValue().optional(),
		status: z.enum(['ISSUED', 'PENDING', 'REJECTED']).or(z.string()).optional(),
	})
	.passthrough();
const r_ef37eb3829e2Input = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z
			.object({ thumbprint_sha256: unspecifiedProviderValue().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ef37eb3829e2Output = z.undefined();
const r_b8f4fd999e91Input = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				thumbprint_sha256: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				csr: unspecifiedProviderValue().optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				delivery_format: z
					.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
					.optional(),
				include_ca_chain: unspecifiedProviderValue().optional(),
				renewal_comment: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_b8f4fd999e91Output = z
	.object({
		agent_id: unspecifiedProviderValue().optional(),
		application: unspecifiedProviderValue().optional(),
		attributes: unspecifiedProviderValue().optional(),
		auth_fields: unspecifiedProviderValue().optional(),
		auto_renew_status: unspecifiedProviderValue().optional(),
		automation_action: z
			.object({
				primaryAction: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				renewalStartDate: unspecifiedProviderValue().optional(),
				secondaryActions: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		automation_status: unspecifiedProviderValue().optional(),
		business_unit: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		ca_cert_id: unspecifiedProviderValue().optional(),
		cc_settings: z
			.object({
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: unspecifiedProviderValue(),
						auto_renew_time: z
							.object({
								days: unspecifiedProviderValue().optional(),
								hours: unspecifiedProviderValue().optional(),
								minutes: unspecifiedProviderValue().optional(),
								time_format: unspecifiedProviderValue(),
								zone: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						before_expiration: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				contacts: unspecifiedProviderValue().optional(),
				ct_log_option: unspecifiedProviderValue().optional(),
				ct_log_value: unspecifiedProviderValue().optional(),
				http_signed_exchange: unspecifiedProviderValue().optional(),
				key_size: unspecifiedProviderValue().optional(),
				key_type: unspecifiedProviderValue().optional(),
				order_coverage_length: z
					.object({
						chronology: z
							.object({
								calendarType: unspecifiedProviderValue().optional(),
								id: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						days: unspecifiedProviderValue().optional(),
						months: unspecifiedProviderValue().optional(),
						negative: unspecifiedProviderValue().optional(),
						units: unspecifiedProviderValue().optional(),
						years: unspecifiedProviderValue().optional(),
						zero: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				override_validity: unspecifiedProviderValue().optional(),
				organization: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				product_type: z
					.enum([
						'cloud_dv_geotrust',
						'code_signing',
						'code_signing_ev',
						'private_ssl_flex',
						'private_ssl_multi_domain',
						'private_ssl_plus',
						'private_ssl_wildcard',
						'ssl_basic',
						'ssl_cloud_wildcard',
						'ssl_dv_geotrust',
						'ssl_dv_geotrust_flex',
						'ssl_dv_rapidssl',
						'ssl_dv_thawte',
						'ssl_ev_basic',
						'ssl_ev_geotrust_truebizid',
						'ssl_ev_multi_domain',
						'ssl_ev_plus',
						'ssl_ev_securesite',
						'ssl_ev_securesite_flex',
						'ssl_ev_securesite_multi_domain',
						'ssl_ev_securesite_pro',
						'ssl_ev_thawte_webserver',
						'ssl_geotrust_truebizid',
						'ssl_multi_domain',
						'ssl_plus',
						'ssl_securesite',
						'ssl_securesite_flex',
						'ssl_securesite_multi_domain',
						'ssl_securesite_pro',
						'ssl_securesite_wildcard',
						'ssl_thawte_webserver',
						'ssl_wildcard',
						'wildcard_dv_geotrust',
						'wildcard_dv_rapidssl',
					])
					.or(z.string()),
				signature_algorithm: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		common_name: unspecifiedProviderValue().optional(),
		days_till_renewal: unspecifiedProviderValue().optional(),
		dual_approval_status: z
			.object({
				admins_approved: unspecifiedProviderValue().optional(),
				dual_approve_enabled: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		enrollment: z
			.object({ id: unspecifiedProviderValue() })
			.passthrough()
			.optional(),
		escrow: unspecifiedProviderValue().optional(),
		external_ca_name: unspecifiedProviderValue().optional(),
		ica: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		id: unspecifiedProviderValue(),
		inventory_id: unspecifiedProviderValue().optional(),
		ip: unspecifiedProviderValue().optional(),
		key_length: unspecifiedProviderValue().optional(),
		key_type: unspecifiedProviderValue().optional(),
		key_usage: unspecifiedProviderValue().optional(),
		managing_integration: unspecifiedProviderValue().optional(),
		notes: unspecifiedProviderValue().optional(),
		order_id: unspecifiedProviderValue().optional(),
		organization_name: unspecifiedProviderValue().optional(),
		organization_unit: unspecifiedProviderValue().optional(),
		port: unspecifiedProviderValue().optional(),
		private_key_algorithm: unspecifiedProviderValue().optional(),
		product_type: unspecifiedProviderValue().optional(),
		profile: z
			.object({
				authentication_method: unspecifiedProviderValue().optional(),
				enrollment_method: unspecifiedProviderValue().optional(),
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
				status: z
					.enum(['action_needed', 'active', 'suspended'])
					.or(z.string())
					.optional(),
				trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		revocation_reason: z
			.enum([
				'aa_compromise',
				'affiliation_changed',
				'ca_compromise',
				'certificate_hold',
				'cessation_of_operation',
				'key_compromise',
				'privilege_withdrawn',
				'remove_from_crl',
				'superseded',
				'unspecified',
			])
			.optional(),
		root_ca_name: unspecifiedProviderValue().optional(),
		seat: z
			.object({
				active: unspecifiedProviderValue().optional(),
				business_unit: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				created_at: unspecifiedProviderValue().optional(),
				email: unspecifiedProviderValue().optional(),
				id: unspecifiedProviderValue().optional(),
				number_of_pending: unspecifiedProviderValue().optional(),
				phone: unspecifiedProviderValue().optional(),
				seat_allowed_for_enrollment: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				seat_name: unspecifiedProviderValue().optional(),
				seat_type: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				seat_creation_date: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: unspecifiedProviderValue().optional(),
		signing_algorithm: unspecifiedProviderValue().optional(),
		source: unspecifiedProviderValue().optional(),
		status: z
			.enum([
				'deleted',
				'expired',
				'issued',
				'replaced',
				'replaced_external',
				'revoked',
				'suspended',
			])
			.optional(),
		subject: z
			.object({
				common_name: unspecifiedProviderValue().optional(),
				country: unspecifiedProviderValue().optional(),
				locality: unspecifiedProviderValue().optional(),
				organization_name: unspecifiedProviderValue().optional(),
				organization_units: unspecifiedProviderValue().optional(),
				postal_code: unspecifiedProviderValue().optional(),
				state: unspecifiedProviderValue().optional(),
				street_address: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		subject_email: unspecifiedProviderValue().optional(),
		system_name: unspecifiedProviderValue().optional(),
		tags: unspecifiedProviderValue().optional(),
		thumbprint: unspecifiedProviderValue().optional(),
		valid_from: unspecifiedProviderValue().optional(),
		valid_to: unspecifiedProviderValue().optional(),
		automation_instance_count: unspecifiedProviderValue().optional(),
		discovery_instance_count: unspecifiedProviderValue().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: unspecifiedProviderValue().optional(),
		pkcs12_password: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		revocation_date: unspecifiedProviderValue().optional(),
		san_email: unspecifiedProviderValue().optional(),
		thumbprint_sha1: unspecifiedProviderValue().optional(),
		cert_arn: unspecifiedProviderValue().optional(),
		azure_cert_id: unspecifiedProviderValue().optional(),
		gcp_metadata: unspecifiedProviderValue().optional(),
		recovery_comment: unspecifiedProviderValue().optional(),
		cert_issues: unspecifiedProviderValue().optional(),
		cert_security_rating: unspecifiedProviderValue().optional(),
		security_rating_info: z
			.object({
				security_rating: unspecifiedProviderValue().optional(),
				handshake_protocols: z
					.object({
						cipher_algorithm: unspecifiedProviderValue().optional(),
						key_size: unspecifiedProviderValue().optional(),
						protocol: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				security_headers: unspecifiedProviderValue().optional(),
				http_response_headers: unspecifiedProviderValue().optional(),
				certificate_chain: z
					.object({
						cert_chain_details: unspecifiedProviderValue().optional(),
						no_of_cert_chain_found: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				security_rating_score: unspecifiedProviderValue().optional(),
				certificate_chain_score: unspecifiedProviderValue().optional(),
				handshake_protocols_score: unspecifiedProviderValue().optional(),
				security_headers_score: unspecifiedProviderValue().optional(),
				http_response_headers_score: unspecifiedProviderValue().optional(),
				protocol_ciphers: unspecifiedProviderValue().optional(),
				protocol_ciphers_score: z
					.object({
						protocols: unspecifiedProviderValue().optional(),
						score: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		server_id: unspecifiedProviderValue().optional(),
		server_id_type: unspecifiedProviderValue().optional(),
		first_discovered_date: unspecifiedProviderValue().optional(),
		last_discovered_date: unspecifiedProviderValue().optional(),
		application_version: unspecifiedProviderValue().optional(),
		os_name: unspecifiedProviderValue().optional(),
		os_version: unspecifiedProviderValue().optional(),
		ca_vendor: unspecifiedProviderValue().optional(),
		renewed_cert_id: unspecifiedProviderValue().optional(),
		expires_in_days: unspecifiedProviderValue().optional(),
		connector_tags: unspecifiedProviderValue().optional(),
		parent_id: unspecifiedProviderValue().optional(),
		has_warning: unspecifiedProviderValue().optional(),
		quantum_safe: unspecifiedProviderValue().optional(),
		related_connector: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		vault_connector: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		vault_uri: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		managing_ca: unspecifiedProviderValue().optional(),
		escrow_client_key_id: unspecifiedProviderValue().optional(),
		cc_account_id: unspecifiedProviderValue().optional(),
		cc_container_id: unspecifiedProviderValue().optional(),
		security_identifier: unspecifiedProviderValue().optional(),
		ian_string: unspecifiedProviderValue().optional(),
		aws_acm: unspecifiedProviderValue().optional(),
		connector_provider: unspecifiedProviderValue().optional(),
		extended_key_usage: unspecifiedProviderValue().optional(),
		file_path: unspecifiedProviderValue().optional(),
		file_name: unspecifiedProviderValue().optional(),
		file_type: unspecifiedProviderValue().optional(),
		system_scan_cert_id: unspecifiedProviderValue().optional(),
		intune_deployment_details: unspecifiedProviderValue().optional(),
		found_in_archive: unspecifiedProviderValue().optional(),
		msca_template_name: unspecifiedProviderValue().optional(),
		cert_delivery_details: unspecifiedProviderValue().optional(),
		dcone_user_id: unspecifiedProviderValue().optional(),
		dcone_user_email: unspecifiedProviderValue().optional(),
		bulk_job_name: unspecifiedProviderValue().optional(),
		bulk_operation_job_id: unspecifiedProviderValue().optional(),
		bulk_operation_job_name: unspecifiedProviderValue().optional(),
		vs_partition: unspecifiedProviderValue().optional(),
		vs_alias: unspecifiedProviderValue().optional(),
		domain_name: unspecifiedProviderValue().optional(),
		host_name: unspecifiedProviderValue().optional(),
		renewal_window: unspecifiedProviderValue().optional(),
		custom_attributes: unspecifiedProviderValue().optional(),
		cert_owners: unspecifiedProviderValue().optional(),
		protocols: unspecifiedProviderValue().optional(),
		smime_cert_profile_type: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_c6787b39d482Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_ids: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c6787b39d482Output = z.undefined();
const r_15baf5205f5fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_ids: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_15baf5205f5fOutput = z.undefined();
const r_795aa866d75eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				trap_seat_duplicate_error: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue().optional(),
	})
	.strict();
const r_795aa866d75eOutput = unspecifiedProviderValue();
const r_cd0ce04fc2f9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				business_unit_name: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				seat_type_id: unspecifiedProviderValue().optional(),
				serial_number: unspecifiedProviderValue().optional(),
				valid_from: unspecifiedProviderValue().optional(),
				valid_to: unspecifiedProviderValue().optional(),
				common_name: unspecifiedProviderValue().optional(),
				aki: unspecifiedProviderValue().optional(),
				issuing_ca_id: unspecifiedProviderValue().optional(),
				issuing_ca_name: unspecifiedProviderValue().optional(),
				issuing_ca_serial_number: unspecifiedProviderValue().optional(),
				status: unspecifiedProviderValue().optional(),
				thumbprint: unspecifiedProviderValue().optional(),
				enrollment_id: unspecifiedProviderValue().optional(),
				custom_attributes: unspecifiedProviderValue().optional(),
				cert_owners: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd0ce04fc2f9Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z
		.object({
			has_more: unspecifiedProviderValue().optional(),
			items: unspecifiedProviderValue().optional(),
		})
		.passthrough(),
);
const r_47b5ee161d58Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				status: z
					.enum(['issued', 'revoked', 'expired', 'suspended'])
					.optional(),
				issuer_type: z.enum(['private_ca']).optional(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_47b5ee161d58Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z
		.object({
			has_more: unspecifiedProviderValue().optional(),
			items: unspecifiedProviderValue().optional(),
		})
		.passthrough(),
);
const r_cb5f6a5e8c6eInput = z
	.object({
		path: z.object({ certificate_id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				ip: unspecifiedProviderValue().optional(),
				survey_id: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				server_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cb5f6a5e8c6eOutput = z.undefined();
const r_c1e6841c6826Input = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				thumbprint_sha256: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c1e6841c6826Output = z
	.object({
		profile: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		seat: z
			.object({ seat_id: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		seat_type: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		business_unit: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		account: z
			.object({ id: unspecifiedProviderValue() })
			.passthrough()
			.optional(),
		certificate: unspecifiedProviderValue().optional(),
		ica: z.object({ id: unspecifiedProviderValue() }).passthrough().optional(),
		common_name: unspecifiedProviderValue().optional(),
		status: z
			.enum(['issued', 'revoked', 'expired', 'suspended'])
			.or(z.string())
			.optional(),
		serial_number: unspecifiedProviderValue().optional(),
		thumbprint: unspecifiedProviderValue().optional(),
		valid_from: unspecifiedProviderValue().optional(),
		valid_to: unspecifiedProviderValue().optional(),
		notes: unspecifiedProviderValue().optional(),
		revocation: z
			.object({
				reason: z
					.enum([
						'aa_compromise',
						'affiliation_changed',
						'ca_compromise',
						'certificate_hold',
						'cessation_of_operation',
						'key_compromise',
						'privilege_withdrawn',
						'remove_from_crl',
						'superseded',
						'unspecified',
					])
					.optional(),
				revocation_date: unspecifiedProviderValue().optional(),
				comments: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		ca_response_attributes: z
			.object({
				schema: z
					.object({ order_id: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		template_name: unspecifiedProviderValue().optional(),
		issuing_ca_name: unspecifiedProviderValue().optional(),
		key_size: unspecifiedProviderValue().optional(),
		signature_algorithm: unspecifiedProviderValue().optional(),
		subject: z
			.object({
				common_name: unspecifiedProviderValue().optional(),
				organization_name: unspecifiedProviderValue().optional(),
				organization_units: unspecifiedProviderValue().optional(),
				description: unspecifiedProviderValue().optional(),
				serial_number: unspecifiedProviderValue().optional(),
				pseudonym: unspecifiedProviderValue().optional(),
				unique_identifier: unspecifiedProviderValue().optional(),
				user_identifier: unspecifiedProviderValue().optional(),
				domain_component: unspecifiedProviderValue().optional(),
				dn_qualifier: unspecifiedProviderValue().optional(),
				unstructured_name: unspecifiedProviderValue().optional(),
				unstructured_address: unspecifiedProviderValue().optional(),
				street_address: unspecifiedProviderValue().optional(),
				locality: unspecifiedProviderValue().optional(),
				state: unspecifiedProviderValue().optional(),
				postal_code: unspecifiedProviderValue().optional(),
				country: unspecifiedProviderValue().optional(),
				email: unspecifiedProviderValue().optional(),
				title: unspecifiedProviderValue().optional(),
				given_name: unspecifiedProviderValue().optional(),
				surname: unspecifiedProviderValue().optional(),
				organization_identifier: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		cert_security_rating: unspecifiedProviderValue().optional(),
		security_rating_info: z
			.object({
				security_rating: unspecifiedProviderValue().optional(),
				handshake_protocols: z
					.object({
						cipher_algorithm: unspecifiedProviderValue().optional(),
						key_size: unspecifiedProviderValue().optional(),
						protocol: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				security_headers: unspecifiedProviderValue().optional(),
				http_response_headers: unspecifiedProviderValue().optional(),
				certificate_chain: z
					.object({
						cert_chain_details: unspecifiedProviderValue().optional(),
						no_of_cert_chain_found: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				security_rating_score: unspecifiedProviderValue().optional(),
				certificate_chain_score: unspecifiedProviderValue().optional(),
				handshake_protocols_score: unspecifiedProviderValue().optional(),
				security_headers_score: unspecifiedProviderValue().optional(),
				http_response_headers_score: unspecifiedProviderValue().optional(),
				protocol_ciphers: unspecifiedProviderValue().optional(),
				protocol_ciphers_score: z
					.object({
						protocols: unspecifiedProviderValue().optional(),
						score: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		file_path: unspecifiedProviderValue().optional(),
		file_name: unspecifiedProviderValue().optional(),
		file_type: unspecifiedProviderValue().optional(),
		ip: unspecifiedProviderValue().optional(),
		port: unspecifiedProviderValue().optional(),
		net_scan_domain_name: unspecifiedProviderValue().optional(),
		application: unspecifiedProviderValue().optional(),
		automation_status: unspecifiedProviderValue().optional(),
		ca_vendor: unspecifiedProviderValue().optional(),
		connector: unspecifiedProviderValue().optional(),
		dcone_user_id: unspecifiedProviderValue().optional(),
		enrollment_method: unspecifiedProviderValue().optional(),
		system_name: unspecifiedProviderValue().optional(),
		source: unspecifiedProviderValue().optional(),
		scan_name: unspecifiedProviderValue().optional(),
		expires_in_days: unspecifiedProviderValue().optional(),
		instance_count: unspecifiedProviderValue().optional(),
		extended_key_usage: unspecifiedProviderValue().optional(),
		msca_template_name: unspecifiedProviderValue().optional(),
		escrow: unspecifiedProviderValue().optional(),
		attributes: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_b85de13db956Input = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z
			.object({ thumbprint_sha256: unspecifiedProviderValue().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b85de13db956Output = z
	.object({
		delivery_format: z.enum(['pkcs12']).or(z.string()).optional(),
		certificate: unspecifiedProviderValue().optional(),
		pkcs12_password: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_d7ae6dc4292dInput = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				thumbprint_sha256: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				revocation_reason: z.enum([
					'unspecified',
					'key_compromise',
					'affiliation_changed',
					'superseded',
					'cessation_of_operation',
					'privilege_withdrawn',
					'certificate_hold',
				]),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_d7ae6dc4292dOutput = z.undefined();
const r_32308d9d0956Input = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_32308d9d0956Output = z.undefined();
const r_e81b68e657ccInput = z
	.object({
		path: z.object({ serial_number: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e81b68e657ccOutput = z
	.object({
		pkcs7: unspecifiedProviderValue().optional(),
		x509_cert_chain: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_00aaa42b68c2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				exclude_certificate_status: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_00aaa42b68c2Output = z
	.object({ total_count: unspecifiedProviderValue().optional() })
	.passthrough();
const r_a09ad9571231Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				exclude_certificate_status: unspecifiedProviderValue().optional(),
				cursor: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a09ad9571231Output = z
	.object({
		batch_size: unspecifiedProviderValue().optional(),
		cursor: unspecifiedProviderValue().nullable().optional(),
		items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_565bb358f1fcInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.union([
				z
					.object({
						name: unspecifiedProviderValue(),
						business_unit_id: unspecifiedProviderValue(),
						account_id: unspecifiedProviderValue(),
						preset_id: z.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4']),
						tags: unspecifiedProviderValue().optional(),
						username: unspecifiedProviderValue(),
						password: unspecifiedProviderValue(),
						api_key: unspecifiedProviderValue(),
						credentials: unspecifiedProviderValue().optional(),
						region: z.enum(['US', 'EU']),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years:
									unspecifiedProviderValue().optional(),
								all_expired_certificates_within:
									unspecifiedProviderValue().optional(),
								all_revoked_certificates_that_are_valid:
									unspecifiedProviderValue().optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								cc_division_bu_mapping: unspecifiedProviderValue().optional(),
								import_all_data: unspecifiedProviderValue().optional(),
								business_unit_name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						account_id: unspecifiedProviderValue(),
						business_unit_id: unspecifiedProviderValue().optional(),
						name: unspecifiedProviderValue(),
						preset_id: z.enum(['a7f721aa-4796-4815-9128-6796fedbb917']),
						username: unspecifiedProviderValue(),
						password: unspecifiedProviderValue(),
						url: unspecifiedProviderValue(),
					})
					.passthrough(),
				z
					.object({
						account_id: unspecifiedProviderValue(),
						business_unit_id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
						preset_id: unspecifiedProviderValue(),
						core_attributes: unspecifiedProviderValue(),
						config_attributes: unspecifiedProviderValue(),
						additional_attributes: z
							.object({
								all_valid_certificates_from_last_4_years:
									unspecifiedProviderValue().optional(),
								all_expired_certificates_within:
									unspecifiedProviderValue().optional(),
								all_revoked_certificates_that_are_valid:
									unspecifiedProviderValue().optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								s3_bucket_name: unspecifiedProviderValue().optional(),
								is_new_s3_bucket_required:
									unspecifiedProviderValue().optional(),
								last_fetched_time: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
			])
			.optional(),
	})
	.strict();
const r_565bb358f1fcOutput = z.undefined();
const r_c4f2ebc60dafInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				limit: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: unspecifiedProviderValue().optional(),
				provider: z
					.enum([
						'CERTCENTRAL',
						'MICROSOFT_CA',
						'QUALYS',
						'AMAZON_CA',
						'DIGICERT_PKI_PLATFORM_8',
						'TENABLE',
						'AZURE_KEY_VAULT',
						'LETS_ENCRYPT',
						'BIGIP',
						'SNOW',
						'STEP_CA',
						'MICROSOFT_INTUNE',
						'AMAZON_ACM',
						'GOOGLE_CLOUD',
					])
					.optional(),
				type: z
					.enum([
						'CA',
						'IT_SERVICE_MANAGEMENT',
						'SCAN_SOLUTIONS',
						'APPLIANCE',
						'CLOUD_SERVICE',
						'DNS_INTEGRATION',
						'KEY_VAULT',
						'IT_AUTOMATION',
						'UNIFIED_ENDPOINT_MANAGEMENT',
					])
					.optional(),
				status: z
					.enum([
						'INITIAL',
						'ACTIVE',
						'RUNNING',
						'REFRESHING_CONFIG',
						'SUSPENDED',
						'ACTION_NEEDED',
						'SUSPENDED_BY_FEATURE_FLAG',
						'DELETED',
					])
					.optional(),
				last_completed_at: unspecifiedProviderValue().optional(),
				next_update: unspecifiedProviderValue().optional(),
				business_unit_name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c4f2ebc60dafOutput = z.undefined();
const r_cac1d643fd7dInput = z
	.object({
		path: z.object({ field: z.enum(['provider', 'type']) }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cac1d643fd7dOutput = z.undefined();
const r_9fdfa9ff199aInput = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				template_id: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9fdfa9ff199aOutput = z.undefined();
const r_6ae814861232Input = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.union([
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: z
							.enum(['1c389430-7885-4eb3-82e9-96fec17de7a6'])
							.optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						aws_account_id: unspecifiedProviderValue().optional(),
						aws_region: unspecifiedProviderValue().optional(),
						authentication_method: unspecifiedProviderValue().optional(),
						aws_access_key_id: unspecifiedProviderValue().optional(),
						aws_secret_key: unspecifiedProviderValue().optional(),
						profile_name: unspecifiedProviderValue().optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years:
									unspecifiedProviderValue().optional(),
								all_expired_certificates_within:
									unspecifiedProviderValue().optional(),
								all_revoked_certificates_that_are_valid:
									unspecifiedProviderValue().optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								s3_bucket_name: unspecifiedProviderValue().optional(),
								is_new_s3_bucket_required:
									unspecifiedProviderValue().optional(),
								last_fetched_time: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						api_key: unspecifiedProviderValue().optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						username: unspecifiedProviderValue().optional(),
						password: unspecifiedProviderValue().optional(),
						credentials: unspecifiedProviderValue().optional(),
						region: z.enum(['US', 'EU']).optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years:
									unspecifiedProviderValue().optional(),
								all_expired_certificates_within:
									unspecifiedProviderValue().optional(),
								all_revoked_certificates_that_are_valid:
									unspecifiedProviderValue().optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								s3_bucket_name: unspecifiedProviderValue().optional(),
								is_new_s3_bucket_required:
									unspecifiedProviderValue().optional(),
								last_fetched_time: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						username: unspecifiedProviderValue().optional(),
						password: unspecifiedProviderValue().optional(),
						additional_properties: unspecifiedProviderValue().optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years:
									unspecifiedProviderValue().optional(),
								all_expired_certificates_within:
									unspecifiedProviderValue().optional(),
								all_revoked_certificates_that_are_valid:
									unspecifiedProviderValue().optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								s3_bucket_name: unspecifiedProviderValue().optional(),
								is_new_s3_bucket_required:
									unspecifiedProviderValue().optional(),
								last_fetched_time: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						username: unspecifiedProviderValue().optional(),
						password: unspecifiedProviderValue().optional(),
						import_attributes: z
							.object({
								import: z
									.object({
										certificates: unspecifiedProviderValue().optional(),
										unsecured_ips_ports: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								include_data: z
									.object({
										ciphers: unspecifiedProviderValue().optional(),
										security_ratings: unspecifiedProviderValue().optional(),
										vulnerabilities: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
								business_unit_id: unspecifiedProviderValue().optional(),
								tags: unspecifiedProviderValue().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: z
							.enum(['1c389430-7885-4eb3-82e9-96fec17de7a6'])
							.optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						username: unspecifiedProviderValue().optional(),
						password: unspecifiedProviderValue().optional(),
						url: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				z
					.object({
						name: unspecifiedProviderValue().optional(),
						preset_id: unspecifiedProviderValue().optional(),
						api_key: unspecifiedProviderValue().optional(),
						sensor_id: unspecifiedProviderValue().optional(),
						tags: unspecifiedProviderValue().optional(),
						business_unit_id: unspecifiedProviderValue().optional(),
						core_attributes: unspecifiedProviderValue().optional(),
						config_attributes: unspecifiedProviderValue().optional(),
						additional_attributes: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			])
			.optional(),
	})
	.strict();
const r_6ae814861232Output = z.undefined();
const r_ddbe3acdfffaInput = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ddbe3acdfffaOutput = z.undefined();
const r_cd2034a0a43dInput = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd2034a0a43dOutput = z.undefined();
const r_e97c7e325ac0Input = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e97c7e325ac0Output = z.undefined();
const r_3ae1daaeb731Input = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_3ae1daaeb731Output = z.undefined();
const r_c594c0e3a8d1Input = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c594c0e3a8d1Output = z.undefined();
const r_2b39cff6b19aInput = z
	.object({
		path: z.object({ connector_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2b39cff6b19aOutput = z.undefined();
const r_13488561d95dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
				type: z
					.enum([
						'TEXT_FIELD',
						'DROP_DOWN_LIST',
						'GROUPED_DROP_DOWN',
						'FIXED_VALUE',
					])
					.optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_13488561d95dOutput = z
	.object({
		total: unspecifiedProviderValue().optional(),
		items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_0d465a62c1baInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				custom_attribute: z
					.object({
						name: unspecifiedProviderValue(),
						type: z.enum([
							'TEXT_FIELD',
							'DROP_DOWN_LIST',
							'GROUPED_DROP_DOWN',
							'FIXED_VALUE',
						]),
						items: unspecifiedProviderValue().optional(),
						required: unspecifiedProviderValue().optional(),
						default_value: unspecifiedProviderValue().optional(),
						multi_select: unspecifiedProviderValue().optional(),
						grouped_items: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_0d465a62c1baOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		type: unspecifiedProviderValue().optional(),
		items: unspecifiedProviderValue().optional(),
		required: unspecifiedProviderValue().optional(),
		default_value: unspecifiedProviderValue().optional(),
		multi_select: unspecifiedProviderValue().optional(),
		grouped_items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_ffd3d18f94d9Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ffd3d18f94d9Output = unspecifiedProviderValue();
const r_9c0ee24ba5a8Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				custom_attributes_request: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_9c0ee24ba5a8Output = z.undefined();
const r_7593ade75363Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				custom_attribute_ids: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_7593ade75363Output = z.undefined();
const r_38b65a4ff043Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38b65a4ff043Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		type: unspecifiedProviderValue().optional(),
		items: unspecifiedProviderValue().optional(),
		required: unspecifiedProviderValue().optional(),
		default_value: unspecifiedProviderValue().optional(),
		multi_select: unspecifiedProviderValue().optional(),
		grouped_items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_aa2372f83a2eInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				custom_attribute: z
					.object({
						name: unspecifiedProviderValue(),
						type: z.enum([
							'TEXT_FIELD',
							'DROP_DOWN_LIST',
							'GROUPED_DROP_DOWN',
							'FIXED_VALUE',
						]),
						items: unspecifiedProviderValue().optional(),
						required: unspecifiedProviderValue().optional(),
						default_value: unspecifiedProviderValue().optional(),
						multi_select: unspecifiedProviderValue().optional(),
						grouped_items: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_aa2372f83a2eOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		type: unspecifiedProviderValue().optional(),
		items: unspecifiedProviderValue().optional(),
		required: unspecifiedProviderValue().optional(),
		default_value: unspecifiedProviderValue().optional(),
		multi_select: unspecifiedProviderValue().optional(),
		grouped_items: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_d11c9f59c2deInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d11c9f59c2deOutput = z
	.object({
		status: unspecifiedProviderValue().optional(),
		affected_profiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_f31cdd16607bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				connector_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({ connector_ids: unspecifiedProviderValue().optional() })
							.passthrough(),
					)
					.optional(),
				network_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({
								network_scan_ids: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
					)
					.optional(),
				system_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						unspecifiedProviderValue(),
					)
					.optional(),
				ct_log_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						unspecifiedProviderValue(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_f31cdd16607bOutput = unspecifiedProviderValue();
const r_413eadd6d21dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				source_type: unspecifiedProviderValue(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				connector_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({ connector_ids: unspecifiedProviderValue().optional() })
							.passthrough(),
					)
					.optional(),
				network_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({
								network_scan_ids: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
					)
					.optional(),
				system_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						unspecifiedProviderValue(),
					)
					.optional(),
				ct_log_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: unspecifiedProviderValue().optional(),
										sans: unspecifiedProviderValue().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						unspecifiedProviderValue(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_413eadd6d21dOutput = z.undefined();
const r_90e92b7da5a3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				search: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				unassigned: unspecifiedProviderValue().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_90e92b7da5a3Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_a1438d4fc523Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ devices: unspecifiedProviderValue() }).passthrough(),
	})
	.strict();
const r_a1438d4fc523Output = unspecifiedProviderValue();
const r_e0d550d921c4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ deviceInventoryIds: unspecifiedProviderValue() })
			.passthrough(),
	})
	.strict();
const r_e0d550d921c4Output = z
	.object({
		count: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_db452f94fae3Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_db452f94fae3Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		accountId: unspecifiedProviderValue().optional(),
		deviceName: unspecifiedProviderValue().optional(),
		serialNumber: unspecifiedProviderValue().optional(),
		udid: unspecifiedProviderValue().optional(),
		status: z.enum(['ACTIVE', 'INACTIVE']).or(z.string()).optional(),
		profileIds: unspecifiedProviderValue().optional(),
		profiles: unspecifiedProviderValue().optional(),
		createdAt: unspecifiedProviderValue().optional(),
		updatedAt: unspecifiedProviderValue().optional(),
		createdBy: unspecifiedProviderValue().optional(),
		updatedBy: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_38524550bc70Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: unspecifiedProviderValue().optional(),
				accountId: unspecifiedProviderValue().optional(),
				deviceName: unspecifiedProviderValue().optional(),
				serialNumber: unspecifiedProviderValue().optional(),
				udid: unspecifiedProviderValue().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
				profileIds: unspecifiedProviderValue().optional(),
				profiles: unspecifiedProviderValue().optional(),
				createdAt: unspecifiedProviderValue().optional(),
				updatedAt: unspecifiedProviderValue().optional(),
				createdBy: unspecifiedProviderValue().optional(),
				updatedBy: unspecifiedProviderValue().optional(),
				rejectedProfiles: unspecifiedProviderValue().optional(),
				message: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_38524550bc70Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		accountId: unspecifiedProviderValue().optional(),
		deviceName: unspecifiedProviderValue().optional(),
		serialNumber: unspecifiedProviderValue().optional(),
		udid: unspecifiedProviderValue().optional(),
		status: z.enum(['ACTIVE', 'INACTIVE']).or(z.string()).optional(),
		profileIds: unspecifiedProviderValue().optional(),
		profiles: unspecifiedProviderValue().optional(),
		createdAt: unspecifiedProviderValue().optional(),
		updatedAt: unspecifiedProviderValue().optional(),
		createdBy: unspecifiedProviderValue().optional(),
		updatedBy: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_01008ef1501aInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_01008ef1501aOutput = z.undefined();
const r_6ac8994ec3c4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ file: unspecifiedProviderValue() }).passthrough(),
	})
	.strict();
const r_6ac8994ec3c4Output = z
	.object({
		totalRows: unspecifiedProviderValue().optional(),
		imported: unspecifiedProviderValue().optional(),
		skipped: unspecifiedProviderValue().optional(),
		failed: unspecifiedProviderValue().optional(),
		errors: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_2ff73ca5e82fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				search: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				unassigned: unspecifiedProviderValue().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2ff73ca5e82fOutput = z.string();
const r_371fd4d4a326Input = z
	.object({
		path: z.object({ profileId: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ deviceInventoryIds: unspecifiedProviderValue() })
			.passthrough(),
	})
	.strict();
const r_371fd4d4a326Output = z
	.object({
		count: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_27064376ccadInput = z
	.object({
		path: z.object({ profileId: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ deviceInventoryIds: unspecifiedProviderValue() })
			.passthrough(),
	})
	.strict();
const r_27064376ccadOutput = z
	.object({
		count: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_b106e7869ed7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				deviceInventoryIds: unspecifiedProviderValue(),
				profileIds: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_b106e7869ed7Output = z
	.object({
		count: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_67f447c0dbdcInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				deviceInventoryIds: unspecifiedProviderValue(),
				profileIds: unspecifiedProviderValue(),
			})
			.passthrough(),
	})
	.strict();
const r_67f447c0dbdcOutput = z
	.object({
		count: unspecifiedProviderValue().optional(),
		message: unspecifiedProviderValue().optional(),
		rejectedProfiles: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_21affda0f31fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				application: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				automationStatus: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
				virtualServerName: unspecifiedProviderValue().optional(),
				isAutoRenew: unspecifiedProviderValue().optional(),
				hasBeenAutomated: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_21affda0f31fOutput = z.undefined();
const r_99aba927208cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				application: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				automationStatus: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
				virtualServerName: unspecifiedProviderValue().optional(),
				isAutoRenew: unspecifiedProviderValue().optional(),
				hasBeenAutomated: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_99aba927208cOutput = z.undefined();
const r_427ad84ed835Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				portlet_ids: unspecifiedProviderValue(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_427ad84ed835Output = z.undefined();
const r_832902848134Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				application: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				automationStatus: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
				virtualServerName: unspecifiedProviderValue().optional(),
				isAutoRenew: unspecifiedProviderValue().optional(),
				hasBeenAutomated: unspecifiedProviderValue().optional(),
				certificateThumbprint: unspecifiedProviderValue().optional(),
				common_name: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_832902848134Output = z.undefined();
const r_ae14a0cad4edInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				application: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				automationStatus: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
				virtualServerName: unspecifiedProviderValue().optional(),
				isAutoRenew: unspecifiedProviderValue().optional(),
				hasBeenAutomated: unspecifiedProviderValue().optional(),
				certificateThumbprint: unspecifiedProviderValue().optional(),
				common_name: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ae14a0cad4edOutput = z.undefined();
const r_a7822a6bdea6Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				instance_type: unspecifiedProviderValue(),
				account_id: unspecifiedProviderValue(),
				inventory_type: unspecifiedProviderValue(),
				certificate_id: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a7822a6bdea6Output = z.undefined();
const r_659d2b8e8aceInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				businessUnitName: unspecifiedProviderValue().optional(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				source: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				scanName: unspecifiedProviderValue().optional(),
				commonName: unspecifiedProviderValue().optional(),
				certificateThumbprint: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_659d2b8e8aceOutput = z.undefined();
const r_4a9d25a10305Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				businessUnitName: unspecifiedProviderValue().optional(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				connector: unspecifiedProviderValue().optional(),
				source: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
				scanName: unspecifiedProviderValue().optional(),
				commonName: unspecifiedProviderValue().optional(),
				certificateThumbprint: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4a9d25a10305Output = z.undefined();
const r_eaa4afa67b1cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue(),
					})
					.passthrough(),
				certificateThumbprint: unspecifiedProviderValue(),
				businessUnit: z
					.object({
						id: unspecifiedProviderValue().optional(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				ip: unspecifiedProviderValue().optional(),
				port: unspecifiedProviderValue().optional(),
				application: unspecifiedProviderValue().optional(),
				automationStatus: z
					.enum([
						'ACME_ACCOUNT_CREATED',
						'ACME_CLIENT_APP_UPGRADE_IN_PROGRESS',
						'ACTION_REQUIRED',
						'AGENT_ERROR',
						'AUTOMATED_BY_AGENT',
						'AUTOMATED_BY_AGENTLESS',
						'AUTOMATION_AT_RISK',
						'AUTOMATION_FAILED',
						'AUTOMATION_PROFILE_BLOCKED',
						'AUTOMATION_REQUESTED',
						'AUTOMATION_SCHEDULED',
						'AUTOMATION_SUCCESSFUL',
						'AUTO_RENEW_SCHEDULED',
						'CERT_PENDING_APPROVAL',
						'CERT_READY_TO_INSTALL',
						'CERT_REQ_DENIED_BY_CIS',
						'CONFIGURATION_ERROR',
						'CONFIGURATION_IN_PROGRESS',
						'CONFIGURED',
						'CONFLICTED',
						'CSR_GENERATION_FAILED',
						'CSR_GENERATION_IN_PROGRESS',
						'CSR_GENERATION_SUCCEEDED',
						'DELETED',
						'DISABLED_FOR_AUTOMATION',
						'DNS_INTEGRATION_FAILED',
						'IGNORED',
						'INSTALL_FAILED',
						'INSTALL_IN_PROGRESS',
						'INSTALL_SUCCEEDED',
						'INSTALL_VALIDATED',
						'INSTALL_VALIDATION_FAILED',
						'INSTALL_VALIDATION_IN_PROGRESS',
						'IS_UPGRADE',
						'NOT_CONFIGURED',
						'NOT_SCANNED',
						'POST_CSR_FAILED',
						'REMOVED',
						'SCAN_IN_PROGRESS',
					])
					.optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_eaa4afa67b1cOutput = z.undefined();
const r_889a59dc528aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: unspecifiedProviderValue(),
				seat: z
					.object({
						seat_id: unspecifiedProviderValue(),
						email: unspecifiedProviderValue(),
					})
					.passthrough(),
				attributes: z
					.object({
						csr: unspecifiedProviderValue().optional(),
						subject: z
							.object({
								common_name: unspecifiedProviderValue().optional(),
								organization_name: unspecifiedProviderValue().optional(),
								organization_units: unspecifiedProviderValue().optional(),
								description: unspecifiedProviderValue().optional(),
								serial_number: unspecifiedProviderValue().optional(),
								pseudonym: unspecifiedProviderValue().optional(),
								unique_identifier: unspecifiedProviderValue().optional(),
								user_identifier: unspecifiedProviderValue().optional(),
								domain_component: unspecifiedProviderValue().optional(),
								dn_qualifier: unspecifiedProviderValue().optional(),
								unstructured_name: unspecifiedProviderValue().optional(),
								unstructured_address: unspecifiedProviderValue().optional(),
								street_address: unspecifiedProviderValue().optional(),
								locality: unspecifiedProviderValue().optional(),
								state: unspecifiedProviderValue().optional(),
								postal_code: unspecifiedProviderValue().optional(),
								country: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
								title: unspecifiedProviderValue().optional(),
								given_name: unspecifiedProviderValue().optional(),
								surname: unspecifiedProviderValue().optional(),
								organization_identifier: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				enrollment_code: unspecifiedProviderValue().optional(),
				expiry_date: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_889a59dc528aOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		seat_id: unspecifiedProviderValue().optional(),
		profile_id: unspecifiedProviderValue().optional(),
		profile_name: unspecifiedProviderValue().optional(),
		enrollment_code: unspecifiedProviderValue().optional(),
		creation_date_time: unspecifiedProviderValue().optional(),
		expiry_date_time: unspecifiedProviderValue().optional(),
		status: unspecifiedProviderValue().optional(),
		number_of_bad_attempts: unspecifiedProviderValue().optional(),
		enrollment_url: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_604d6ac29079Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				seat: z
					.object({ id: unspecifiedProviderValue() })
					.passthrough()
					.optional(),
				profile: z
					.object({ id: unspecifiedProviderValue() })
					.passthrough()
					.optional(),
				enrollment_code: unspecifiedProviderValue().optional(),
				csr: unspecifiedProviderValue().optional(),
				attributes: z
					.object({
						subject: z
							.object({
								common_name: unspecifiedProviderValue().optional(),
								organization_name: unspecifiedProviderValue().optional(),
								organization_units: unspecifiedProviderValue().optional(),
								description: unspecifiedProviderValue().optional(),
								serial_number: unspecifiedProviderValue().optional(),
								pseudonym: unspecifiedProviderValue().optional(),
								unique_identifier: unspecifiedProviderValue().optional(),
								user_identifier: unspecifiedProviderValue().optional(),
								domain_component: unspecifiedProviderValue().optional(),
								dn_qualifier: unspecifiedProviderValue().optional(),
								unstructured_name: unspecifiedProviderValue().optional(),
								unstructured_address: unspecifiedProviderValue().optional(),
								street_address: unspecifiedProviderValue().optional(),
								locality: unspecifiedProviderValue().optional(),
								state: unspecifiedProviderValue().optional(),
								postal_code: unspecifiedProviderValue().optional(),
								country: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
								title: unspecifiedProviderValue().optional(),
								given_name: unspecifiedProviderValue().optional(),
								surname: unspecifiedProviderValue().optional(),
								organization_identifier: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				custom_attributes: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_604d6ac29079Output = z
	.object({
		serial_number: unspecifiedProviderValue().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: unspecifiedProviderValue().optional(),
		pkcs12_password: unspecifiedProviderValue().optional(),
		request_id: unspecifiedProviderValue().optional(),
		dv_details: z
			.object({
				schema: z
					.object({
						dcv_method: z
							.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
							.optional(),
						dcv_random_value: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_6d7a2c7d5b92Input = z
	.object({
		path: z.object({ enrollment_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				new_status: z.enum([
					'approved',
					'created',
					'expired',
					'in_progress',
					'locked',
					'pending',
					'pending_second_approval',
					'redeemed',
					'rejected',
				]),
				message_to_user: unspecifiedProviderValue().optional(),
				custom_validity_days: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_6d7a2c7d5b92Output = z.undefined();
const r_c1244e33b2b4Input = z
	.object({
		path: z.object({ enrollment_code: unspecifiedProviderValue() }).strict(),
		query: z.object({ seat_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c1244e33b2b4Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		seat_id: unspecifiedProviderValue().optional(),
		profile_id: unspecifiedProviderValue().optional(),
		profile_name: unspecifiedProviderValue().optional(),
		enrollment_code: unspecifiedProviderValue().optional(),
		creation_date_time: unspecifiedProviderValue().optional(),
		expiry_date_time: unspecifiedProviderValue().optional(),
		status: unspecifiedProviderValue().optional(),
		number_of_bad_attempts: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_fa40e5e88461Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				created_at_from: unspecifiedProviderValue().optional(),
				created_at_to: unspecifiedProviderValue().optional(),
				expires_at_from: unspecifiedProviderValue().optional(),
				expires_at_to: unspecifiedProviderValue().optional(),
				email: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				seat_identifier: unspecifiedProviderValue().optional(),
				seat_name: unspecifiedProviderValue().optional(),
				status: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fa40e5e88461Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_4ef7dea657b7Input = z
	.object({
		path: z.object({ enrollment_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4ef7dea657b7Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		status: z
			.enum([
				'created',
				'pending',
				'pending_second_approval',
				'in_progress',
				'expired',
				'approved',
				'rejected',
				'locked',
				'redeemed',
			])
			.optional(),
		email: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		expires_at: unspecifiedProviderValue().optional(),
		profile: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		seat: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				seat_type: z
					.enum([
						'USER_SEAT',
						'DISCOVERY_SEAT',
						'SERVER_SEAT',
						'DEVICE_SEAT',
						'IMPORTED_SEAT',
						'ORGANIZATION_SEAT',
						'CERTIFICATE_MANAGEMENT_SEAT',
					])
					.optional(),
			})
			.passthrough()
			.optional(),
		business_unit: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		message_to_user: unspecifiedProviderValue().optional(),
		seat_id_mapping_value: unspecifiedProviderValue().optional(),
		approved_by_current_user: unspecifiedProviderValue().optional(),
		comments: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_2edfe1f4b869Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: z
					.object({ id: unspecifiedProviderValue() })
					.passthrough()
					.optional(),
				email: unspecifiedProviderValue().optional(),
				csr: unspecifiedProviderValue().optional(),
				comments: unspecifiedProviderValue().optional(),
				saml_response_id: unspecifiedProviderValue().optional(),
				attributes: z
					.object({
						subject: z
							.object({
								common_name: unspecifiedProviderValue().optional(),
								organization_name: unspecifiedProviderValue().optional(),
								organization_units: unspecifiedProviderValue().optional(),
								description: unspecifiedProviderValue().optional(),
								serial_number: unspecifiedProviderValue().optional(),
								pseudonym: unspecifiedProviderValue().optional(),
								unique_identifier: unspecifiedProviderValue().optional(),
								user_identifier: unspecifiedProviderValue().optional(),
								domain_component: unspecifiedProviderValue().optional(),
								dn_qualifier: unspecifiedProviderValue().optional(),
								unstructured_name: unspecifiedProviderValue().optional(),
								unstructured_address: unspecifiedProviderValue().optional(),
								street_address: unspecifiedProviderValue().optional(),
								locality: unspecifiedProviderValue().optional(),
								state: unspecifiedProviderValue().optional(),
								postal_code: unspecifiedProviderValue().optional(),
								country: unspecifiedProviderValue().optional(),
								email: unspecifiedProviderValue().optional(),
								title: unspecifiedProviderValue().optional(),
								given_name: unspecifiedProviderValue().optional(),
								surname: unspecifiedProviderValue().optional(),
								organization_identifier: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				authentication_attributes: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2edfe1f4b869Output = z
	.object({ id: unspecifiedProviderValue() })
	.passthrough();
const r_2b49885a43e5Input = z
	.object({
		path: z.object({ certificate_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2b49885a43e5Output = z
	.object({
		attributes: z
			.object({ custom_values: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		email: unspecifiedProviderValue().optional(),
		enrollment_id: unspecifiedProviderValue().optional(),
		enrollment_secret: unspecifiedProviderValue().optional(),
		enrollment_status: z
			.enum([
				'approved',
				'created',
				'expired',
				'in_progress',
				'locked',
				'pending',
				'pending_second_approval',
				'redeemed',
				'rejected',
			])
			.optional(),
		has_parent: unspecifiedProviderValue().optional(),
		profile: z
			.object({
				account: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				acme_credentials: z
					.object({
						directory_url: unspecifiedProviderValue().optional(),
						eab_hmac: unspecifiedProviderValue().optional(),
						eab_kid: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				action_needed_reason: unspecifiedProviderValue().optional(),
				active: unspecifiedProviderValue().optional(),
				additional_recipients: unspecifiedProviderValue().optional(),
				admin_contact: z
					.object({
						account_id: unspecifiedProviderValue().optional(),
						email: unspecifiedProviderValue().optional(),
						enabled: unspecifiedProviderValue().optional(),
						id: unspecifiedProviderValue().optional(),
						name: unspecifiedProviderValue().optional(),
						phone: unspecifiedProviderValue().optional(),
						profile_id: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				allow_validity_from_rest_api: unspecifiedProviderValue().optional(),
				api_token_ids: unspecifiedProviderValue().optional(),
				authentication_fields: unspecifiedProviderValue().optional(),
				authentication_method: unspecifiedProviderValue().optional(),
				automated_renewal: unspecifiedProviderValue().optional(),
				business_unit: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				ca_chain_value: unspecifiedProviderValue().optional(),
				ca_settings: z
					.object({
						auto_renew_settings: z
							.object({
								auto_renew_certificate_and_order: unspecifiedProviderValue(),
								auto_renew_time: z
									.object({
										days: unspecifiedProviderValue().optional(),
										hours: unspecifiedProviderValue().optional(),
										minutes: unspecifiedProviderValue().optional(),
										time_format: unspecifiedProviderValue(),
										zone: unspecifiedProviderValue(),
									})
									.passthrough()
									.optional(),
								before_expiration: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						contacts: unspecifiedProviderValue().optional(),
						msca_settings: z
							.object({
								certificate_fields: unspecifiedProviderValue().optional(),
								extensions: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({
								id: unspecifiedProviderValue(),
								name: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				cc_settings: unspecifiedProviderValue().optional(),
				cert_delivery_format: z
					.enum(['pkcs12', 'pkcs12_der', 'pkcs12_pem', 'pkcs7', 'x509'])
					.optional(),
				connector: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				days_till_enrollment_expires: unspecifiedProviderValue().optional(),
				digicert_desktop_client_settings: unspecifiedProviderValue().optional(),
				digicert_trust_assistant_settings:
					unspecifiedProviderValue().optional(),
				duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
				email_templates: unspecifiedProviderValue().optional(),
				embed_enrollment_code_in_url: unspecifiedProviderValue().optional(),
				enable_dual_admin_approval: unspecifiedProviderValue().optional(),
				enable_ldap_search: unspecifiedProviderValue().optional(),
				enrollment_code_length: unspecifiedProviderValue().optional(),
				enrollment_method: unspecifiedProviderValue().optional(),
				enrollment_urls: unspecifiedProviderValue().optional(),
				fields: unspecifiedProviderValue().optional(),
				fixed_enrollment_url: unspecifiedProviderValue().optional(),
				global_enrollment_code: unspecifiedProviderValue().optional(),
				global_enrollment_code_enabled: unspecifiedProviderValue().optional(),
				ica: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				id: unspecifiedProviderValue().optional(),
				instruction_file_id: unspecifiedProviderValue().optional(),
				instruction_file_name: unspecifiedProviderValue().optional(),
				instruction_format: z
					.enum(['doc', 'docx', 'pdf', 'ppt', 'pptx', 'txt'])
					.optional(),
				intune_settings: z
					.object({
						intune_app_id: unspecifiedProviderValue().optional(),
						intune_app_key: unspecifiedProviderValue().optional(),
						intune_push_enabled: unspecifiedProviderValue().optional(),
						intune_tenant_name: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						dual_admin_recovery: unspecifiedProviderValue().optional(),
						key_escrow_deployment_mode: z
							.enum(['CLOUD', 'LOCAL'])
							.or(z.string())
							.optional(),
						key_escrow_enabled: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				max_number_of_bad_attempts: unspecifiedProviderValue().optional(),
				microsoft_auto_enrollment_client_settings: z
					.object({
						crypto_providers: z
							.object({
								modifiable: unspecifiedProviderValue().optional(),
								providers: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						end_entity_type: z
							.enum(['machine', 'user'])
							.or(z.string())
							.optional(),
						enroll_on_behalf_of: unspecifiedProviderValue().optional(),
						enroll_on_behalf_of_modifiable:
							unspecifiedProviderValue().optional(),
						enrollment_mode: z
							.object({
								mode: z.enum(['inform_user', 'silent']).or(z.string()),
								modifiable: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						key_spec: z
							.enum(['at_keyexchange', 'at_signature', 'xcn_at_none'])
							.optional(),
						private_key_export: z
							.object({
								allowed: unspecifiedProviderValue().optional(),
								modifiable: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						publish_to_ad: unspecifiedProviderValue().optional(),
						template_oid: unspecifiedProviderValue().optional(),
						template_schema_version: unspecifiedProviderValue().optional(),
						windows_hello_logon: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				name: unspecifiedProviderValue().optional(),
				notify_requestor: unspecifiedProviderValue().optional(),
				platform8_api_key: z
					.object({
						id: unspecifiedProviderValue().optional(),
						name: unspecifiedProviderValue().optional(),
						value: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				renewal_window_days: unspecifiedProviderValue().optional(),
				saml_settings: z
					.object({
						enforce_manual_approval: unspecifiedProviderValue().optional(),
						idp_certificate: unspecifiedProviderValue().optional(),
						idp_issuer: unspecifiedProviderValue().optional(),
						idp_single_logout_url: unspecifiedProviderValue().optional(),
						idp_url: unspecifiedProviderValue().optional(),
						sp_certificate: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				scep_settings: z
					.object({
						encryption_algorithm: z
							.enum([
								'aes128WithCBC',
								'aes128WithGCM',
								'aes256WithCBC',
								'aes256WithGCM',
								'desEDEWith3CBC',
								'desWithCBC',
							])
							.or(z.string()),
						standard: z
							.enum(['DRAFT_NOURSE_SCEP_23', 'RFC_8894_DRAFT_GUTMANN_SCEP_16'])
							.or(z.string()),
					})
					.passthrough()
					.optional(),
				seat_id_mapping: z
					.enum([
						'common_name',
						'dns_names',
						'email',
						'other_name_guid',
						'registered_ids',
						'san_emails',
						'serial_number',
						'subject_email',
						'unique_identifier',
						'upn',
					])
					.optional(),
				seat_type_id: unspecifiedProviderValue().optional(),
				seat_type_name: unspecifiedProviderValue().optional(),
				suspended: unspecifiedProviderValue().optional(),
				template: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
						trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				use_custom_contact: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_a730dc9722bbInput = z
	.object({
		path: z.object({ certificate_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: z
					.object({ id: unspecifiedProviderValue() })
					.passthrough()
					.optional(),
				csr: unspecifiedProviderValue().optional(),
				saml_response_id: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_a730dc9722bbOutput = z
	.object({ id: unspecifiedProviderValue() })
	.passthrough();
const r_a38f059e2a70Input = z
	.object({
		path: z.object({ profileId: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a38f059e2a70Output = z.array(z.number().int());
const r_aa991ba230c3Input = z
	.object({
		path: z.object({ profileId: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue().optional(),
	})
	.strict();
const r_aa991ba230c3Output = z.array(z.number().int());
const r_af7ddf1c733dInput = z
	.object({
		path: z.object({ profileId: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue().optional(),
	})
	.strict();
const r_af7ddf1c733dOutput = z.array(z.number().int());
const r_e827e3bec28aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				search_query: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e827e3bec28aOutput = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_fe3221ef0855Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: unspecifiedProviderValue(),
				integration_type: z
					.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
					.optional(),
				sensor_id: unspecifiedProviderValue(),
				category: z.enum(['APPLIANCE', 'CLOUD_SERVICE', 'DNS_INTEGRATION']),
				parameters: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_fe3221ef0855Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		status: z
			.enum([
				'INITIAL',
				'NOT_CONFIGURED',
				'REFRESHING_CONFIG',
				'CONFIGURED',
				'COMMUNICATION_ERROR',
				'SUSPENDED',
				'VOIDED',
				'NETWORK_ERROR',
				'AUTHENTICATION_ERROR',
				'TESTING_CONNECTION',
				'LICENSE_REQUESTED',
				'UPGRADING',
				'ACTION_NEEDED',
			])
			.optional(),
		status_details: unspecifiedProviderValue().optional(),
		type: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
			.optional(),
		application_name: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER'])
			.optional(),
		parameter_id: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		business_unit_id: unspecifiedProviderValue().optional(),
		app_info: z
			.object({
				name: unspecifiedProviderValue().optional(),
				version: unspecifiedProviderValue().optional(),
				arch: unspecifiedProviderValue().optional(),
				flavor: unspecifiedProviderValue().optional(),
				automation_order: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		management_key: unspecifiedProviderValue().optional(),
		is_fips_present: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		updated: unspecifiedProviderValue().optional(),
		category: z
			.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
			.optional(),
		ha_peers: unspecifiedProviderValue().optional(),
		parameters: unspecifiedProviderValue().optional(),
		sensor_ids: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_cf48324a6d66Input = z
	.object({
		path: z.object({ integration_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cf48324a6d66Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		status: z
			.enum([
				'INITIAL',
				'NOT_CONFIGURED',
				'REFRESHING_CONFIG',
				'CONFIGURED',
				'COMMUNICATION_ERROR',
				'SUSPENDED',
				'VOIDED',
				'NETWORK_ERROR',
				'AUTHENTICATION_ERROR',
				'TESTING_CONNECTION',
				'LICENSE_REQUESTED',
				'UPGRADING',
				'ACTION_NEEDED',
			])
			.optional(),
		status_details: unspecifiedProviderValue().optional(),
		type: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
			.optional(),
		application_name: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER'])
			.optional(),
		parameter_id: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		business_unit_id: unspecifiedProviderValue().optional(),
		app_info: z
			.object({
				name: unspecifiedProviderValue().optional(),
				version: unspecifiedProviderValue().optional(),
				arch: unspecifiedProviderValue().optional(),
				flavor: unspecifiedProviderValue().optional(),
				automation_order: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		management_key: unspecifiedProviderValue().optional(),
		is_fips_present: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		updated: unspecifiedProviderValue().optional(),
		category: z
			.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
			.optional(),
		ha_peers: unspecifiedProviderValue().optional(),
		parameters: unspecifiedProviderValue().optional(),
		sensor_ids: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_31f08184b392Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ integrations: unspecifiedProviderValue() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_31f08184b392Output = unspecifiedProviderValue();
const r_5f0c91e25af4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_5f0c91e25af4Output = z.undefined();
const r_090e1558aef3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ integrations: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_090e1558aef3Output = z.undefined();
const r_a12209ad174fInput = z
	.object({
		path: z.object({ integration_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a12209ad174fOutput = z.undefined();
const r_a7f9ba1b6636Input = z
	.object({
		path: z
			.object({
				application_name: z.enum([
					'AWS',
					'AWS-CLOUDFRONT',
					'BIGIP',
					'NETSCALER',
					'A10',
				]),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a7f9ba1b6636Output = unspecifiedProviderValue();
const r_cd234014f0ffInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: unspecifiedProviderValue(),
				description: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue(),
				ica: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				account_id: unspecifiedProviderValue(),
				template_id: unspecifiedProviderValue(),
				enrollment_method: z.enum([
					'digicert_desktop_client',
					'android',
					'browser_pkcs12',
					'csr',
					'est',
					'ios',
					'os_browser',
					'pki_client',
					'rest_api',
					'scep',
					'acme',
					'acme_device_attestation',
				]),
				authentication_method: z.enum([
					'third_party_app',
					'active_directory',
					'certificate_authentication',
					'enrollment_code',
					'global_passphrase',
					'manual_approval',
					'saml_idp',
					'no_auth',
				]),
				seat_id_mapping: z.enum([
					'email',
					'san_emails',
					'common_name',
					'upn',
					'unique_identifier',
					'serial_number',
					'dns_names',
					'other_name_guid',
					'registered_ids',
					'subject_email',
					'dn_qualifier',
					'pseudonym',
					'seat_identifier',
				]),
				cert_delivery_format: z
					.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem', 'pkcs12_der'])
					.optional(),
				custom_extended_key_usages: unspecifiedProviderValue().optional(),
				renewal_window_days: unspecifiedProviderValue(),
				days_till_enrollment_expires: unspecifiedProviderValue().optional(),
				duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
				notify_requestor: unspecifiedProviderValue().optional(),
				embed_enrollment_code_in_url: unspecifiedProviderValue().optional(),
				grace_period_enabled: unspecifiedProviderValue().optional(),
				enable_ldap_search: unspecifiedProviderValue().optional(),
				self_service_portal_active: unspecifiedProviderValue().optional(),
				global_enrollment_code: unspecifiedProviderValue().optional(),
				fields: unspecifiedProviderValue().optional(),
				connector_id: unspecifiedProviderValue().optional(),
				use_custom_contact: unspecifiedProviderValue().optional(),
				ca_settings: z
					.object({
						contacts: unspecifiedProviderValue().optional(),
						certificate_fields: z
							.object({
								validity_period: unspecifiedProviderValue().optional(),
								renewal_period: unspecifiedProviderValue().optional(),
								key_type: unspecifiedProviderValue().optional(),
								key_size: unspecifiedProviderValue().optional(),
								signature_algorithm: unspecifiedProviderValue().optional(),
								crypto_providers: unspecifiedProviderValue().optional(),
								arn: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				cc_settings: z
					.object({
						auto_renew_settings: z
							.object({
								auto_renew_certificate_and_order: unspecifiedProviderValue(),
								auto_renew_time: z
									.object({
										days: unspecifiedProviderValue().optional(),
										hours: unspecifiedProviderValue().optional(),
										minutes: unspecifiedProviderValue().optional(),
										time_format: unspecifiedProviderValue(),
										zone: unspecifiedProviderValue(),
									})
									.passthrough()
									.optional(),
								before_expiration: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						contacts: unspecifiedProviderValue().optional(),
						http_signed_exchange: unspecifiedProviderValue().optional(),
						key_sizes: unspecifiedProviderValue().optional(),
						account_id: unspecifiedProviderValue().optional(),
						is_custom_validity: unspecifiedProviderValue().optional(),
						duplicate_minimum_validity_days: unspecifiedProviderValue()
							.nullable()
							.optional(),
						key_type: unspecifiedProviderValue().optional(),
						order_coverage_length: unspecifiedProviderValue().optional(),
						override_validity: unspecifiedProviderValue().optional(),
						organization: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						organization_contact: z
							.object({
								id: unspecifiedProviderValue(),
								name: unspecifiedProviderValue(),
								contact_type: z.enum([
									'organization_contact',
									'technical_contact',
									'verified_contact',
								]),
							})
							.passthrough()
							.optional(),
						product_type: z.enum([
							'cloud_dv_geotrust',
							'code_signing',
							'code_signing_ev',
							'private_ssl_flex',
							'private_ssl_multi_domain',
							'private_ssl_plus',
							'private_ssl_wildcard',
							'ssl_basic',
							'ssl_cloud_wildcard',
							'ssl_dv_geotrust',
							'ssl_dv_geotrust_flex',
							'ssl_dv_rapidssl',
							'ssl_dv_thawte',
							'ssl_ev_basic',
							'ssl_ev_geotrust_truebizid',
							'ssl_ev_multi_domain',
							'ssl_ev_plus',
							'ssl_ev_securesite',
							'ssl_ev_securesite_flex',
							'ssl_ev_securesite_multi_domain',
							'ssl_ev_securesite_pro',
							'ssl_ev_thawte_webserver',
							'ssl_geotrust_truebizid',
							'ssl_multi_domain',
							'ssl_plus',
							'ssl_securesite',
							'ssl_securesite_flex',
							'ssl_securesite_multi_domain',
							'ssl_securesite_pro',
							'ssl_securesite_wildcard',
							'ssl_thawte_webserver',
							'ssl_wildcard',
							'wildcard_dv_geotrust',
							'wildcard_dv_rapidssl',
						]),
						signature_algorithm: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						container: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						region: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						key_escrow_enabled: unspecifiedProviderValue(),
						key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
						dual_admin_recovery: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				tags: unspecifiedProviderValue().optional(),
				api_token_binding_enabled: unspecifiedProviderValue()
					.nullable()
					.optional(),
				api_token_ids: unspecifiedProviderValue().optional(),
				ssp_auth_operations: unspecifiedProviderValue().optional(),
				ssp_open_operations: unspecifiedProviderValue().optional(),
				allowed_user_group: unspecifiedProviderValue().optional(),
				allowed_fqdn_regex: unspecifiedProviderValue().optional(),
				additional_recipients: unspecifiedProviderValue().optional(),
				certificate_owner_ids: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_cd234014f0ffOutput = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		description: unspecifiedProviderValue().optional(),
		status: z
			.enum(['Active', 'Deleted', 'Suspended', 'Action needed'])
			.optional(),
		signature_algorithm: z
			.enum([
				'SHA1_WITH_RSA',
				'SHA256_WITH_RSA',
				'SHA384_WITH_RSA',
				'SHA512_WITH_RSA',
				'sha256WithRSAPSS',
				'sha384WithRSAPSS',
				'sha512WithRSAPSS',
				'sha3_256WithRSA',
				'sha3_384WithRSA',
				'sha3_512WithRSA',
				'SHA256_WITH_ECDSA',
				'SHA384_WITH_ECDSA',
				'SHA512_WITH_ECDSA',
				'MATCH_ISSUER',
			])
			.optional(),
		publish_to_public_directory: unspecifiedProviderValue().optional(),
		renewal_period_days: unspecifiedProviderValue().optional(),
		duplicate_cert_policy: unspecifiedProviderValue().optional(),
		override_cert_validity_via_api: unspecifiedProviderValue().optional(),
		certificate_delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12'])
			.or(z.string())
			.optional(),
		account_id: unspecifiedProviderValue().optional(),
		business_unit_id: unspecifiedProviderValue().optional(),
		business_unit_name: unspecifiedProviderValue().optional(),
		enrollment_method: z
			.enum([
				'digicert_desktop_client',
				'android',
				'browser_pkcs12',
				'csr',
				'est',
				'ios',
				'os_browser',
				'pki_client',
				'rest_api',
				'scep',
				'acme',
				'acme_device_attestation',
			])
			.optional(),
		authentication_method: z
			.enum([
				'third_party_app',
				'active_directory',
				'certificate_authentication',
				'enrollment_code',
				'global_passphrase',
				'manual_approval',
				'saml_idp',
				'no_auth',
			])
			.optional(),
		days_till_enrollment_expires: unspecifiedProviderValue().optional(),
		automated_renewal: unspecifiedProviderValue().optional(),
		global_enrollment_code_enabled: unspecifiedProviderValue().optional(),
		renewal_window_days: unspecifiedProviderValue().optional(),
		connector_id: unspecifiedProviderValue().optional(),
		ica: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		key_escrow_policy: z
			.object({
				key_escrow_enabled: unspecifiedProviderValue(),
				key_escrow_deployment_mode: z
					.enum(['CLOUD', 'LOCAL'])
					.or(z.string())
					.optional(),
				dual_admin_recovery: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		api_token_binding_enabled: unspecifiedProviderValue().optional(),
		api_token_ids: unspecifiedProviderValue().optional(),
		enable_dual_admin_approval: unspecifiedProviderValue().optional(),
		enable_ldap_search: unspecifiedProviderValue().optional(),
		acme_credentials: z
			.object({
				eab_kid: unspecifiedProviderValue().optional(),
				eab_hmac: unspecifiedProviderValue().optional(),
				directory_url: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		tags: unspecifiedProviderValue().optional(),
		useCustomContact: unspecifiedProviderValue().optional(),
		duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
		cert_delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12'])
			.or(z.string())
			.optional(),
		notifyRequestor: unspecifiedProviderValue().optional(),
		custom_extended_key_usages: unspecifiedProviderValue().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				issuer: z
					.intersection(
						z
							.object({
								serial_number: unspecifiedProviderValue().optional(),
								subject_dn: unspecifiedProviderValue().optional(),
								certificate: unspecifiedProviderValue().optional(),
								root: unspecifiedProviderValue().optional(),
								chain: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
						z
							.object({ chain: unspecifiedProviderValue().optional() })
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: unspecifiedProviderValue().optional(),
		allowed_key_sizes: unspecifiedProviderValue().optional(),
		fields: z
			.object({
				optional: unspecifiedProviderValue().optional(),
				multiple: unspecifiedProviderValue().optional(),
				key: unspecifiedProviderValue().optional(),
				type: unspecifiedProviderValue().optional(),
				input: unspecifiedProviderValue().optional(),
				oid: unspecifiedProviderValue().optional(),
				dataType: unspecifiedProviderValue().optional(),
				allowed_groups: unspecifiedProviderValue().optional(),
				sources: unspecifiedProviderValue().optional(),
				labels: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		custom_attributes_fields: unspecifiedProviderValue().optional(),
		certificate_owners: unspecifiedProviderValue().optional(),
		additional_recipients: unspecifiedProviderValue().optional(),
		self_service_portal_active: unspecifiedProviderValue().optional(),
		ssp_auth_operations: unspecifiedProviderValue().optional(),
		ssp_open_operations: unspecifiedProviderValue().optional(),
		allowed_user_group: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_9a2ea6339160Input = z
	.object({
		path: z.object({ profile_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: unspecifiedProviderValue(),
				description: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue(),
				ica: z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				account_id: unspecifiedProviderValue(),
				template_id: unspecifiedProviderValue(),
				enrollment_method: z.enum([
					'digicert_desktop_client',
					'android',
					'browser_pkcs12',
					'csr',
					'est',
					'ios',
					'os_browser',
					'pki_client',
					'rest_api',
					'scep',
					'acme',
					'acme_device_attestation',
				]),
				authentication_method: z.enum([
					'third_party_app',
					'active_directory',
					'certificate_authentication',
					'enrollment_code',
					'global_passphrase',
					'manual_approval',
					'saml_idp',
					'no_auth',
				]),
				seat_id_mapping: z.enum([
					'email',
					'san_emails',
					'common_name',
					'upn',
					'unique_identifier',
					'serial_number',
					'dns_names',
					'other_name_guid',
					'registered_ids',
					'subject_email',
					'dn_qualifier',
					'pseudonym',
					'seat_identifier',
				]),
				cert_delivery_format: z
					.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem', 'pkcs12_der'])
					.optional(),
				custom_extended_key_usages: unspecifiedProviderValue().optional(),
				renewal_window_days: unspecifiedProviderValue(),
				days_till_enrollment_expires: unspecifiedProviderValue().optional(),
				duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
				notify_requestor: unspecifiedProviderValue().optional(),
				embed_enrollment_code_in_url: unspecifiedProviderValue().optional(),
				grace_period_enabled: unspecifiedProviderValue().optional(),
				enable_ldap_search: unspecifiedProviderValue().optional(),
				self_service_portal_active: unspecifiedProviderValue().optional(),
				global_enrollment_code: unspecifiedProviderValue().optional(),
				fields: unspecifiedProviderValue().optional(),
				connector_id: unspecifiedProviderValue().optional(),
				use_custom_contact: unspecifiedProviderValue().optional(),
				ca_settings: z
					.object({
						contacts: unspecifiedProviderValue().optional(),
						certificate_fields: z
							.object({
								validity_period: unspecifiedProviderValue().optional(),
								renewal_period: unspecifiedProviderValue().optional(),
								key_type: unspecifiedProviderValue().optional(),
								key_size: unspecifiedProviderValue().optional(),
								signature_algorithm: unspecifiedProviderValue().optional(),
								crypto_providers: unspecifiedProviderValue().optional(),
								arn: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				cc_settings: z
					.object({
						auto_renew_settings: z
							.object({
								auto_renew_certificate_and_order: unspecifiedProviderValue(),
								auto_renew_time: z
									.object({
										days: unspecifiedProviderValue().optional(),
										hours: unspecifiedProviderValue().optional(),
										minutes: unspecifiedProviderValue().optional(),
										time_format: unspecifiedProviderValue(),
										zone: unspecifiedProviderValue(),
									})
									.passthrough()
									.optional(),
								before_expiration: unspecifiedProviderValue(),
							})
							.passthrough()
							.optional(),
						contacts: unspecifiedProviderValue().optional(),
						http_signed_exchange: unspecifiedProviderValue().optional(),
						key_sizes: unspecifiedProviderValue().optional(),
						account_id: unspecifiedProviderValue().optional(),
						is_custom_validity: unspecifiedProviderValue().optional(),
						duplicate_minimum_validity_days: unspecifiedProviderValue()
							.nullable()
							.optional(),
						key_type: unspecifiedProviderValue().optional(),
						order_coverage_length: unspecifiedProviderValue().optional(),
						override_validity: unspecifiedProviderValue().optional(),
						organization: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						organization_contact: z
							.object({
								id: unspecifiedProviderValue(),
								name: unspecifiedProviderValue(),
								contact_type: z.enum([
									'organization_contact',
									'technical_contact',
									'verified_contact',
								]),
							})
							.passthrough()
							.optional(),
						product_type: z.enum([
							'cloud_dv_geotrust',
							'code_signing',
							'code_signing_ev',
							'private_ssl_flex',
							'private_ssl_multi_domain',
							'private_ssl_plus',
							'private_ssl_wildcard',
							'ssl_basic',
							'ssl_cloud_wildcard',
							'ssl_dv_geotrust',
							'ssl_dv_geotrust_flex',
							'ssl_dv_rapidssl',
							'ssl_dv_thawte',
							'ssl_ev_basic',
							'ssl_ev_geotrust_truebizid',
							'ssl_ev_multi_domain',
							'ssl_ev_plus',
							'ssl_ev_securesite',
							'ssl_ev_securesite_flex',
							'ssl_ev_securesite_multi_domain',
							'ssl_ev_securesite_pro',
							'ssl_ev_thawte_webserver',
							'ssl_geotrust_truebizid',
							'ssl_multi_domain',
							'ssl_plus',
							'ssl_securesite',
							'ssl_securesite_flex',
							'ssl_securesite_multi_domain',
							'ssl_securesite_pro',
							'ssl_securesite_wildcard',
							'ssl_thawte_webserver',
							'ssl_wildcard',
							'wildcard_dv_geotrust',
							'wildcard_dv_rapidssl',
						]),
						signature_algorithm: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						container: z
							.object({
								id: unspecifiedProviderValue().optional(),
								name: unspecifiedProviderValue().optional(),
								value: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						region: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						key_escrow_enabled: unspecifiedProviderValue(),
						key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
						dual_admin_recovery: unspecifiedProviderValue(),
					})
					.passthrough()
					.optional(),
				tags: unspecifiedProviderValue().optional(),
				api_token_binding_enabled: unspecifiedProviderValue()
					.nullable()
					.optional(),
				api_token_ids: unspecifiedProviderValue().optional(),
				ssp_auth_operations: unspecifiedProviderValue().optional(),
				ssp_open_operations: unspecifiedProviderValue().optional(),
				allowed_user_group: unspecifiedProviderValue().optional(),
				allowed_fqdn_regex: unspecifiedProviderValue().optional(),
				additional_recipients: unspecifiedProviderValue().optional(),
				certificate_owner_ids: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_9a2ea6339160Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		status: z
			.enum(['Active', 'Deleted', 'Suspended', 'Action needed'])
			.optional(),
		signature_algorithm: z
			.enum([
				'SHA1_WITH_RSA',
				'SHA256_WITH_RSA',
				'SHA384_WITH_RSA',
				'SHA512_WITH_RSA',
				'SHA256_WITH_ECDSA',
				'SHA384_WITH_ECDSA',
				'SHA512_WITH_ECDSA',
				'MATCH_ISSUER',
			])
			.optional(),
		publish_to_public_directory: unspecifiedProviderValue().optional(),
		renewal_period_days: unspecifiedProviderValue().optional(),
		duplicate_cert_policy: unspecifiedProviderValue().optional(),
		override_cert_validity_via_api: unspecifiedProviderValue().optional(),
		certificate_delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12'])
			.or(z.string())
			.optional(),
		business_unit_id: unspecifiedProviderValue().optional(),
		account_id: unspecifiedProviderValue().optional(),
		enrollment_method: z
			.enum([
				'digicert_desktop_client',
				'android',
				'browser_pkcs12',
				'csr',
				'est',
				'ios',
				'os_browser',
				'pki_client',
				'rest_api',
				'scep',
				'acme',
				'acme_device_attestation',
			])
			.optional(),
		authentication_method: z
			.enum([
				'third_party_app',
				'active_directory',
				'certificate_authentication',
				'enrollment_code',
				'global_passphrase',
				'manual_approval',
				'saml_idp',
				'no_auth',
			])
			.optional(),
		key_escrow_policy: z
			.object({
				key_escrow_enabled: unspecifiedProviderValue(),
				key_escrow_deployment_mode: z
					.enum(['CLOUD', 'LOCAL'])
					.or(z.string())
					.optional(),
				dual_admin_recovery: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		allowed_key_sizes: unspecifiedProviderValue().optional(),
		api_token_binding_enabled: unspecifiedProviderValue().optional(),
		api_token_id: unspecifiedProviderValue().optional(),
		enable_dual_admin_approval: unspecifiedProviderValue().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.object({ attributes: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				issuer: z
					.intersection(
						z
							.object({
								serial_number: unspecifiedProviderValue().optional(),
								subject_dn: unspecifiedProviderValue().optional(),
								certificate: unspecifiedProviderValue().optional(),
								root: unspecifiedProviderValue().optional(),
								chain: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
						z
							.object({ chain: unspecifiedProviderValue().optional() })
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: unspecifiedProviderValue().optional(),
		custom_extended_key_usages: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_b31cfc3255d8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				api_token_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b31cfc3255d8Output = unspecifiedProviderValue();
const r_9cd9f0927b03Input = z
	.object({
		path: z.object({ profile_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9cd9f0927b03Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		description: unspecifiedProviderValue().optional(),
		status: z
			.enum(['Active', 'Deleted', 'Suspended', 'Action needed'])
			.optional(),
		signature_algorithm: z
			.enum([
				'SHA1_WITH_RSA',
				'SHA256_WITH_RSA',
				'SHA384_WITH_RSA',
				'SHA512_WITH_RSA',
				'sha256WithRSAPSS',
				'sha384WithRSAPSS',
				'sha512WithRSAPSS',
				'sha3_256WithRSA',
				'sha3_384WithRSA',
				'sha3_512WithRSA',
				'SHA256_WITH_ECDSA',
				'SHA384_WITH_ECDSA',
				'SHA512_WITH_ECDSA',
				'MATCH_ISSUER',
			])
			.optional(),
		publish_to_public_directory: unspecifiedProviderValue().optional(),
		renewal_period_days: unspecifiedProviderValue().optional(),
		duplicate_cert_policy: unspecifiedProviderValue().optional(),
		override_cert_validity_via_api: unspecifiedProviderValue().optional(),
		certificate_delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12'])
			.or(z.string())
			.optional(),
		account_id: unspecifiedProviderValue().optional(),
		business_unit_id: unspecifiedProviderValue().optional(),
		business_unit_name: unspecifiedProviderValue().optional(),
		enrollment_method: z
			.enum([
				'digicert_desktop_client',
				'android',
				'browser_pkcs12',
				'csr',
				'est',
				'ios',
				'os_browser',
				'pki_client',
				'rest_api',
				'scep',
				'acme',
				'acme_device_attestation',
			])
			.optional(),
		authentication_method: z
			.enum([
				'third_party_app',
				'active_directory',
				'certificate_authentication',
				'enrollment_code',
				'global_passphrase',
				'manual_approval',
				'saml_idp',
				'no_auth',
			])
			.optional(),
		days_till_enrollment_expires: unspecifiedProviderValue().optional(),
		automated_renewal: unspecifiedProviderValue().optional(),
		global_enrollment_code_enabled: unspecifiedProviderValue().optional(),
		renewal_window_days: unspecifiedProviderValue().optional(),
		connector_id: unspecifiedProviderValue().optional(),
		ica: z
			.object({
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		key_escrow_policy: z
			.object({
				key_escrow_enabled: unspecifiedProviderValue(),
				key_escrow_deployment_mode: z
					.enum(['CLOUD', 'LOCAL'])
					.or(z.string())
					.optional(),
				dual_admin_recovery: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		api_token_binding_enabled: unspecifiedProviderValue().optional(),
		api_token_ids: unspecifiedProviderValue().optional(),
		enable_dual_admin_approval: unspecifiedProviderValue().optional(),
		enable_ldap_search: unspecifiedProviderValue().optional(),
		acme_credentials: z
			.object({
				eab_kid: unspecifiedProviderValue().optional(),
				eab_hmac: unspecifiedProviderValue().optional(),
				directory_url: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		tags: unspecifiedProviderValue().optional(),
		useCustomContact: unspecifiedProviderValue().optional(),
		duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
		cert_delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12'])
			.or(z.string())
			.optional(),
		notifyRequestor: unspecifiedProviderValue().optional(),
		custom_extended_key_usages: unspecifiedProviderValue().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: unspecifiedProviderValue().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: unspecifiedProviderValue().optional(),
								attributes: unspecifiedProviderValue().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				issuer: z
					.intersection(
						z
							.object({
								serial_number: unspecifiedProviderValue().optional(),
								subject_dn: unspecifiedProviderValue().optional(),
								certificate: unspecifiedProviderValue().optional(),
								root: unspecifiedProviderValue().optional(),
								chain: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
						z
							.object({ chain: unspecifiedProviderValue().optional() })
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: unspecifiedProviderValue().optional(),
		allowed_key_sizes: unspecifiedProviderValue().optional(),
		fields: z
			.object({
				optional: unspecifiedProviderValue().optional(),
				multiple: unspecifiedProviderValue().optional(),
				key: unspecifiedProviderValue().optional(),
				type: unspecifiedProviderValue().optional(),
				input: unspecifiedProviderValue().optional(),
				oid: unspecifiedProviderValue().optional(),
				dataType: unspecifiedProviderValue().optional(),
				allowed_groups: unspecifiedProviderValue().optional(),
				sources: unspecifiedProviderValue().optional(),
				labels: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		custom_attributes_fields: unspecifiedProviderValue().optional(),
		certificate_owners: unspecifiedProviderValue().optional(),
		additional_recipients: unspecifiedProviderValue().optional(),
		self_service_portal_active: unspecifiedProviderValue().optional(),
		ssp_auth_operations: unspecifiedProviderValue().optional(),
		ssp_open_operations: unspecifiedProviderValue().optional(),
		allowed_user_group: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_87c7a8fcf2c3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				api_token_id: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_87c7a8fcf2c3Output = unspecifiedProviderValue();
const r_beff76538781Input = z
	.object({
		path: z.object({ profile_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_beff76538781Output = z.union([
	z
		.object({
			id: unspecifiedProviderValue().optional(),
			name: unspecifiedProviderValue().optional(),
			description: unspecifiedProviderValue().optional(),
			status: z
				.enum(['Active', 'Deleted', 'Suspended', 'Action needed'])
				.optional(),
			signature_algorithm: z
				.enum([
					'SHA1_WITH_RSA',
					'SHA256_WITH_RSA',
					'SHA384_WITH_RSA',
					'SHA512_WITH_RSA',
					'sha256WithRSAPSS',
					'sha384WithRSAPSS',
					'sha512WithRSAPSS',
					'sha3_256WithRSA',
					'sha3_384WithRSA',
					'sha3_512WithRSA',
					'SHA256_WITH_ECDSA',
					'SHA384_WITH_ECDSA',
					'SHA512_WITH_ECDSA',
					'MATCH_ISSUER',
				])
				.optional(),
			publish_to_public_directory: unspecifiedProviderValue().optional(),
			renewal_period_days: unspecifiedProviderValue().optional(),
			duplicate_cert_policy: unspecifiedProviderValue().optional(),
			override_cert_validity_via_api: unspecifiedProviderValue().optional(),
			certificate_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.optional(),
			account_id: unspecifiedProviderValue().optional(),
			business_unit_id: unspecifiedProviderValue().optional(),
			enrollment_method: z
				.enum([
					'digicert_desktop_client',
					'android',
					'browser_pkcs12',
					'csr',
					'est',
					'ios',
					'os_browser',
					'pki_client',
					'rest_api',
					'scep',
					'acme',
					'acme_device_attestation',
				])
				.optional(),
			authentication_method: z
				.enum([
					'third_party_app',
					'active_directory',
					'certificate_authentication',
					'enrollment_code',
					'global_passphrase',
					'manual_approval',
					'saml_idp',
					'no_auth',
				])
				.optional(),
			days_till_enrollment_expires: unspecifiedProviderValue().optional(),
			automated_renewal: unspecifiedProviderValue().optional(),
			renewal_window_days: unspecifiedProviderValue().optional(),
			connector_id: unspecifiedProviderValue().optional(),
			ica: z
				.object({
					id: unspecifiedProviderValue(),
					name: unspecifiedProviderValue().optional(),
				})
				.passthrough()
				.optional(),
			key_escrow_policy: z
				.object({
					key_escrow_enabled: unspecifiedProviderValue(),
					key_escrow_deployment_mode: z
						.enum(['CLOUD', 'LOCAL'])
						.or(z.string())
						.optional(),
					dual_admin_recovery: unspecifiedProviderValue(),
				})
				.passthrough()
				.optional(),
			private_key_attributes: z
				.object({ key_size: unspecifiedProviderValue().optional() })
				.passthrough()
				.optional(),
			api_token_binding_enabled: unspecifiedProviderValue().optional(),
			api_token_ids: unspecifiedProviderValue().optional(),
			enable_dual_admin_approval: unspecifiedProviderValue().optional(),
			enable_ldap_search: unspecifiedProviderValue().optional(),
			tags: unspecifiedProviderValue().optional(),
			useCustomContact: unspecifiedProviderValue().optional(),
			duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
			cert_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.or(z.string())
				.optional(),
			notifyRequestor: unspecifiedProviderValue().optional(),
			custom_extended_key_usages: unspecifiedProviderValue().optional(),
			certificate: z
				.object({
					subject: z
						.object({ attributes: unspecifiedProviderValue().optional() })
						.passthrough()
						.optional(),
					validity: z
						.object({
							unit: z
								.enum(['years', 'months', 'days', 'hours', 'minutes'])
								.optional(),
							duration: unspecifiedProviderValue().optional(),
						})
						.passthrough()
						.optional(),
					extensions: z
						.object({
							san: z
								.object({
									critical: unspecifiedProviderValue().optional(),
									attributes: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
							issuer_alt_name: z
								.object({
									critical: unspecifiedProviderValue().optional(),
									attributes: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough()
						.optional(),
					issuer: z
						.intersection(
							z
								.object({
									serial_number: unspecifiedProviderValue().optional(),
									subject_dn: unspecifiedProviderValue().optional(),
									certificate: unspecifiedProviderValue().optional(),
									root: unspecifiedProviderValue().optional(),
									chain: unspecifiedProviderValue().optional(),
								})
								.passthrough(),
							z
								.object({ chain: unspecifiedProviderValue().optional() })
								.passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
			template: z
				.object({
					id: unspecifiedProviderValue().optional(),
					name: unspecifiedProviderValue().optional(),
					trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
				})
				.passthrough()
				.optional(),
			allowed_key_sizes: unspecifiedProviderValue().optional(),
			fields: z
				.object({
					optional: unspecifiedProviderValue().optional(),
					multiple: unspecifiedProviderValue().optional(),
					key: unspecifiedProviderValue().optional(),
					type: unspecifiedProviderValue().optional(),
					input: unspecifiedProviderValue().optional(),
					oid: unspecifiedProviderValue().optional(),
					dataType: unspecifiedProviderValue().optional(),
					allowed_groups: unspecifiedProviderValue().optional(),
					sources: unspecifiedProviderValue().optional(),
					labels: unspecifiedProviderValue().optional(),
				})
				.passthrough()
				.optional(),
			custom_attributes_fields: unspecifiedProviderValue().optional(),
			certificate_owners: unspecifiedProviderValue().optional(),
		})
		.passthrough(),
	z
		.object({
			id: unspecifiedProviderValue().optional(),
			name: unspecifiedProviderValue().optional(),
			description: unspecifiedProviderValue().optional(),
			status: z
				.enum(['Active', 'Deleted', 'Suspended', 'Action needed'])
				.optional(),
			signature_algorithm: z
				.enum([
					'SHA1_WITH_RSA',
					'SHA256_WITH_RSA',
					'SHA384_WITH_RSA',
					'SHA512_WITH_RSA',
					'sha256WithRSAPSS',
					'sha384WithRSAPSS',
					'sha512WithRSAPSS',
					'sha3_256WithRSA',
					'sha3_384WithRSA',
					'sha3_512WithRSA',
					'SHA256_WITH_ECDSA',
					'SHA384_WITH_ECDSA',
					'SHA512_WITH_ECDSA',
					'MATCH_ISSUER',
				])
				.optional(),
			publish_to_public_directory: unspecifiedProviderValue().optional(),
			renewal_period_days: unspecifiedProviderValue().optional(),
			duplicate_cert_policy: unspecifiedProviderValue().optional(),
			override_cert_validity_via_api: unspecifiedProviderValue().optional(),
			certificate_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.optional(),
			account_id: unspecifiedProviderValue().optional(),
			business_unit_id: unspecifiedProviderValue().optional(),
			business_unit_name: unspecifiedProviderValue().optional(),
			enrollment_method: z
				.enum([
					'digicert_desktop_client',
					'android',
					'browser_pkcs12',
					'csr',
					'est',
					'ios',
					'os_browser',
					'pki_client',
					'rest_api',
					'scep',
					'acme',
					'acme_device_attestation',
				])
				.optional(),
			authentication_method: z
				.enum([
					'third_party_app',
					'active_directory',
					'certificate_authentication',
					'enrollment_code',
					'global_passphrase',
					'manual_approval',
					'saml_idp',
					'no_auth',
				])
				.optional(),
			days_till_enrollment_expires: unspecifiedProviderValue().optional(),
			automated_renewal: unspecifiedProviderValue().optional(),
			global_enrollment_code_enabled: unspecifiedProviderValue().optional(),
			renewal_window_days: unspecifiedProviderValue().optional(),
			connector_id: unspecifiedProviderValue().optional(),
			ica: z
				.object({
					id: unspecifiedProviderValue(),
					name: unspecifiedProviderValue().optional(),
				})
				.passthrough()
				.optional(),
			key_escrow_policy: z
				.object({
					key_escrow_enabled: unspecifiedProviderValue(),
					key_escrow_deployment_mode: z
						.enum(['CLOUD', 'LOCAL'])
						.or(z.string())
						.optional(),
					dual_admin_recovery: unspecifiedProviderValue(),
				})
				.passthrough()
				.optional(),
			private_key_attributes: z
				.object({ key_size: unspecifiedProviderValue().optional() })
				.passthrough()
				.optional(),
			api_token_binding_enabled: unspecifiedProviderValue().optional(),
			api_token_ids: unspecifiedProviderValue().optional(),
			enable_dual_admin_approval: unspecifiedProviderValue().optional(),
			enable_ldap_search: unspecifiedProviderValue().optional(),
			acme_credentials: z
				.object({
					eab_kid: unspecifiedProviderValue().optional(),
					eab_hmac: unspecifiedProviderValue().optional(),
					directory_url: unspecifiedProviderValue().optional(),
				})
				.passthrough()
				.optional(),
			tags: unspecifiedProviderValue().optional(),
			useCustomContact: unspecifiedProviderValue().optional(),
			duplicate_certificate_allowed: unspecifiedProviderValue().optional(),
			cert_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.or(z.string())
				.optional(),
			notifyRequestor: unspecifiedProviderValue().optional(),
			custom_extended_key_usages: unspecifiedProviderValue().optional(),
			certificate: z
				.object({
					subject: z
						.object({ attributes: unspecifiedProviderValue().optional() })
						.passthrough()
						.optional(),
					validity: z
						.object({
							unit: z
								.enum(['years', 'months', 'days', 'hours', 'minutes'])
								.optional(),
							duration: unspecifiedProviderValue().optional(),
						})
						.passthrough()
						.optional(),
					extensions: z
						.object({
							san: z
								.object({
									critical: unspecifiedProviderValue().optional(),
									attributes: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
							issuer_alt_name: z
								.object({
									critical: unspecifiedProviderValue().optional(),
									attributes: unspecifiedProviderValue().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough()
						.optional(),
					issuer: z
						.intersection(
							z
								.object({
									serial_number: unspecifiedProviderValue().optional(),
									subject_dn: unspecifiedProviderValue().optional(),
									certificate: unspecifiedProviderValue().optional(),
									root: unspecifiedProviderValue().optional(),
									chain: unspecifiedProviderValue().optional(),
								})
								.passthrough(),
							z
								.object({ chain: unspecifiedProviderValue().optional() })
								.passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
			template: z
				.object({
					id: unspecifiedProviderValue().optional(),
					name: unspecifiedProviderValue().optional(),
					trust_type: z.enum(['private', 'public']).or(z.string()).optional(),
				})
				.passthrough()
				.optional(),
			allowed_list: unspecifiedProviderValue().optional(),
			allowed_key_sizes: unspecifiedProviderValue().optional(),
			fields: z
				.object({
					optional: unspecifiedProviderValue().optional(),
					multiple: unspecifiedProviderValue().optional(),
					key: unspecifiedProviderValue().optional(),
					type: unspecifiedProviderValue().optional(),
					input: unspecifiedProviderValue().optional(),
					oid: unspecifiedProviderValue().optional(),
					dataType: unspecifiedProviderValue().optional(),
					allowed_groups: unspecifiedProviderValue().optional(),
					sources: unspecifiedProviderValue().optional(),
					labels: unspecifiedProviderValue().optional(),
				})
				.passthrough()
				.optional(),
			custom_attributes_fields: unspecifiedProviderValue().optional(),
			certificate_owners: unspecifiedProviderValue().optional(),
			additional_recipients: unspecifiedProviderValue().optional(),
			self_service_portal_active: unspecifiedProviderValue().optional(),
			ssp_auth_operations: unspecifiedProviderValue().optional(),
			ssp_open_operations: unspecifiedProviderValue().optional(),
			allowed_user_group: unspecifiedProviderValue().optional(),
		})
		.passthrough(),
]);
const r_ddb85158bd5dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				admin_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				profile_id: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				create_date: unspecifiedProviderValue().optional(),
				expiry_date: unspecifiedProviderValue().optional(),
				redeem_date: unspecifiedProviderValue().optional(),
				reject_date: unspecifiedProviderValue().optional(),
				reset_date: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ddb85158bd5dOutput = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_8544e8ac7f57Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				resource_id: unspecifiedProviderValue().optional(),
				admin_id: unspecifiedProviderValue().optional(),
				admin_name: unspecifiedProviderValue().optional(),
				resource_name: unspecifiedProviderValue().optional(),
				seat_identifier: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				resource_type: z
					.enum([
						'enrollment',
						'end_entity_certificate',
						'ca_certificate',
						'account',
						'business_unit',
						'seat',
						'user',
						'profile',
						'sensor',
						'agent',
						'cc_api_token',
						'integration',
						'automation',
						'acme_credentials',
						'acme_order',
						'report',
						'email',
						'connector',
						'truststore',
						'notification',
						'self_service_portal',
					])
					.optional(),
				action: z
					.enum([
						'create',
						'get',
						'update',
						'delete',
						'reject',
						'approve',
						'login',
						'logout',
						'expire',
						'suspend',
						'ssp_suspend',
						'resume',
						'ssp_resume',
						'import',
						'recover',
						'ssp_recover',
						'revoke',
						'ssp_revoke',
						'revoke_failed',
						'revoke_initiated',
						'refresh_config',
						'create_acme_account',
						'create_acme_order',
						'place_order',
						'acme_challenge',
						'acme_authz',
						'finalize_acme_order',
						'get_acme_order_details',
						'revoke_cert',
						'parse_acme_order',
						'place_duplicate_cert_order',
						'update_account_details',
						'validate_license_seat',
						'validate_hmac',
						'run',
						'download',
						'stop',
						'not_after_validity',
					])
					.optional(),
				status: z.enum(['success', 'warning', 'failure']).optional(),
				from: unspecifiedProviderValue().optional(),
				to: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_8544e8ac7f57Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_fb0b80993f03Input = z
	.object({
		path: z.object({ event_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fb0b80993f03Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		account: z
			.object({ id: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		business_unit: z
			.object({ id: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
		resource_type: z
			.enum([
				'enrollment',
				'end_entity_certificate',
				'ca_certificate',
				'account',
				'business_unit',
				'seat',
				'user',
				'profile',
				'sensor',
				'agent',
				'cc_api_token',
				'integration',
				'automation',
				'acme_credentials',
				'acme_order',
				'report',
				'email',
				'connector',
				'truststore',
				'notification',
				'self_service_portal',
			])
			.optional(),
		resource_id: unspecifiedProviderValue().optional(),
		action: z
			.enum([
				'create',
				'get',
				'update',
				'delete',
				'reject',
				'approve',
				'login',
				'logout',
				'expire',
				'suspend',
				'ssp_suspend',
				'resume',
				'ssp_resume',
				'import',
				'recover',
				'ssp_recover',
				'revoke',
				'ssp_revoke',
				'revoke_failed',
				'revoke_initiated',
				'refresh_config',
				'create_acme_account',
				'create_acme_order',
				'place_order',
				'acme_challenge',
				'acme_authz',
				'finalize_acme_order',
				'get_acme_order_details',
				'revoke_cert',
				'parse_acme_order',
				'place_duplicate_cert_order',
				'update_account_details',
				'validate_license_seat',
				'validate_hmac',
				'run',
				'download',
				'stop',
				'not_after_validity',
			])
			.optional(),
		user: z
			.object({
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
		timestamp: unspecifiedProviderValue().optional(),
		description: unspecifiedProviderValue().optional(),
		status: z.enum(['success', 'warning', 'failure']).or(z.string()).optional(),
		error_message: unspecifiedProviderValue().optional(),
		detailed_error_message: unspecifiedProviderValue().optional(),
		data: unspecifiedProviderValue().optional(),
		new_data: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_f27878dd7018Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				exclude_context_data: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				resource_id: unspecifiedProviderValue().optional(),
				admin_id: unspecifiedProviderValue().optional(),
				admin_name: unspecifiedProviderValue().optional(),
				resource_name: unspecifiedProviderValue().optional(),
				seat_identifier: unspecifiedProviderValue().optional(),
				seat_id: unspecifiedProviderValue().optional(),
				resource_type: z
					.enum([
						'enrollment',
						'end_entity_certificate',
						'ca_certificate',
						'account',
						'business_unit',
						'seat',
						'user',
						'profile',
						'sensor',
						'agent',
						'cc_api_token',
						'integration',
						'automation',
						'acme_credentials',
						'acme_order',
						'report',
						'email',
						'connector',
						'truststore',
						'notification',
						'self_service_portal',
					])
					.optional(),
				action: z
					.enum([
						'create',
						'get',
						'update',
						'delete',
						'reject',
						'approve',
						'login',
						'logout',
						'expire',
						'suspend',
						'ssp_suspend',
						'resume',
						'ssp_resume',
						'import',
						'recover',
						'ssp_recover',
						'revoke',
						'ssp_revoke',
						'revoke_failed',
						'revoke_initiated',
						'refresh_config',
						'create_acme_account',
						'create_acme_order',
						'place_order',
						'acme_challenge',
						'acme_authz',
						'finalize_acme_order',
						'get_acme_order_details',
						'revoke_cert',
						'parse_acme_order',
						'place_duplicate_cert_order',
						'update_account_details',
						'validate_license_seat',
						'validate_hmac',
						'run',
						'download',
						'stop',
						'not_after_validity',
					])
					.optional(),
				status: z.enum(['success', 'warning', 'failure']).optional(),
				from: unspecifiedProviderValue().optional(),
				to: unspecifiedProviderValue().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f27878dd7018Output = z.intersection(
	z.object({ total: unspecifiedProviderValue() }).passthrough(),
	z.object({ total: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_10c05d173009Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_10c05d173009Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_936d50859847Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue(),
				description: unspecifiedProviderValue().optional(),
				type: z.enum(['certificate', 'asset']),
				rule_id: unspecifiedProviderValue().optional(),
				status: unspecifiedProviderValue().optional(),
				assignments: unspecifiedProviderValue().optional(),
				conditions: unspecifiedProviderValue().optional(),
				targets: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_936d50859847Output = z.undefined();
const r_fba0a11d0af9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: unspecifiedProviderValue(),
	})
	.strict();
const r_fba0a11d0af9Output = z.undefined();
const r_39fd79124781Input = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_39fd79124781Output = z
	.object({
		name: unspecifiedProviderValue(),
		account_id: unspecifiedProviderValue(),
		rule_id: unspecifiedProviderValue().optional(),
		type: z.enum(['certificate', 'asset']).or(z.string()).optional(),
		description: unspecifiedProviderValue().optional(),
		status: unspecifiedProviderValue().optional(),
		created_at: unspecifiedProviderValue().optional(),
		updated_at: unspecifiedProviderValue().optional(),
		conditions: unspecifiedProviderValue().optional(),
		assignments: unspecifiedProviderValue().optional(),
		targets: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_d1a0900ac1cdInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue(),
				description: unspecifiedProviderValue().optional(),
				type: z.enum(['certificate', 'asset']),
				rule_id: unspecifiedProviderValue().optional(),
				status: unspecifiedProviderValue().optional(),
				assignments: unspecifiedProviderValue().optional(),
				conditions: unspecifiedProviderValue().optional(),
				targets: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_d1a0900ac1cdOutput = z.undefined();
const r_2c4418daa501Input = z
	.object({
		path: z.object({ ruleId: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2c4418daa501Output = z.undefined();
const r_716491633306Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				businessUnit: unspecifiedProviderValue().optional(),
				businessUnitName: unspecifiedProviderValue().optional(),
				currentScanStatus: unspecifiedProviderValue().optional(),
				frequency: unspecifiedProviderValue().optional(),
				lastScanStatus: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				scanType: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_716491633306Output = z.undefined();
const r_f41e8938ed63Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				business_unit_id: unspecifiedProviderValue().optional(),
				cipher_scan: unspecifiedProviderValue().optional(),
				config: z
					.object({
						day_of_month: unspecifiedProviderValue().optional(),
						days_to_run: unspecifiedProviderValue().optional(),
						disable_ping: unspecifiedProviderValue().optional(),
						do_not_follow_http_redirects: unspecifiedProviderValue().optional(),
						extra_tls_protocols_discovery:
							unspecifiedProviderValue().optional(),
						ipv6: unspecifiedProviderValue().optional(),
						is_os_discovery: unspecifiedProviderValue().optional(),
						is_server_application_discovery:
							unspecifiedProviderValue().optional(),
						refresh_host_ip_inventory: unspecifiedProviderValue().optional(),
						restrict_emulated_tls_issues_scan:
							unspecifiedProviderValue().optional(),
						scan_option: z.enum(['CUSTOM', 'OPTIMIZE']).optional(),
						sensor_with_ip_port: unspecifiedProviderValue().optional(),
						sni: unspecifiedProviderValue().optional(),
						speed: z.enum(['FAST', 'MEDIUM', 'SLOW']).optional(),
						ssh_discovery: unspecifiedProviderValue().optional(),
						start_time: unspecifiedProviderValue().optional(),
						time_to_complete: unspecifiedProviderValue().optional(),
						timezone: unspecifiedProviderValue().optional(),
						tls_ssl_critical_issues: unspecifiedProviderValue().optional(),
						tls_ssl_non_critical_issues: unspecifiedProviderValue().optional(),
						week_of_month: z
							.enum(['FIRST', 'FOURTH', 'LAST', 'SECOND', 'THIRD'])
							.optional(),
					})
					.passthrough(),
				data_business_unit_id: unspecifiedProviderValue().optional(),
				enable_debug_ports: unspecifiedProviderValue().optional(),
				frequency: z.enum(['DAILY', 'MONTHLY', 'ONE_TIME', 'WEEKLY']),
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue(),
				save_only: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_f41e8938ed63Output = z.undefined();
const r_3cab39f7decfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ scans: unspecifiedProviderValue().optional() })
			.passthrough(),
	})
	.strict();
const r_3cab39f7decfOutput = z.undefined();
const r_0d8b21f3f0fcInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				business_unit_id: unspecifiedProviderValue().optional(),
				cipher_scan: unspecifiedProviderValue().optional(),
				config: z
					.object({
						day_of_month: unspecifiedProviderValue().optional(),
						days_to_run: unspecifiedProviderValue().optional(),
						disable_ping: unspecifiedProviderValue().optional(),
						do_not_follow_http_redirects: unspecifiedProviderValue().optional(),
						extra_tls_protocols_discovery:
							unspecifiedProviderValue().optional(),
						ipv6: unspecifiedProviderValue().optional(),
						is_os_discovery: unspecifiedProviderValue().optional(),
						is_server_application_discovery:
							unspecifiedProviderValue().optional(),
						refresh_host_ip_inventory: unspecifiedProviderValue().optional(),
						restrict_emulated_tls_issues_scan:
							unspecifiedProviderValue().optional(),
						scan_option: z.enum(['CUSTOM', 'OPTIMIZE']).optional(),
						sensor_with_ip_port: unspecifiedProviderValue().optional(),
						sni: unspecifiedProviderValue().optional(),
						speed: z.enum(['FAST', 'MEDIUM', 'SLOW']).optional(),
						ssh_discovery: unspecifiedProviderValue().optional(),
						start_time: unspecifiedProviderValue().optional(),
						time_to_complete: unspecifiedProviderValue().optional(),
						timezone: unspecifiedProviderValue().optional(),
						tls_ssl_critical_issues: unspecifiedProviderValue().optional(),
						tls_ssl_non_critical_issues: unspecifiedProviderValue().optional(),
						week_of_month: z
							.enum(['FIRST', 'FOURTH', 'LAST', 'SECOND', 'THIRD'])
							.optional(),
					})
					.passthrough(),
				data_business_unit_id: unspecifiedProviderValue().optional(),
				enable_debug_ports: unspecifiedProviderValue().optional(),
				frequency: z.enum(['DAILY', 'MONTHLY', 'ONE_TIME', 'WEEKLY']),
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue(),
				save_only: unspecifiedProviderValue().optional(),
				tags: unspecifiedProviderValue().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_0d8b21f3f0fcOutput = z.undefined();
const r_dc1a10c2c3a6Input = z
	.object({
		path: z.object({ scan_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_dc1a10c2c3a6Output = z.undefined();
const r_38f57b41183dInput = z
	.object({
		path: z.object({ scan_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38f57b41183dOutput = z.undefined();
const r_3b605dc8977cInput = z
	.object({
		path: z.object({ id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				category: z.enum(['CURRENT', 'PAST']).optional(),
				limit: unspecifiedProviderValue().optional(),
				offset: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				status: z
					.enum([
						'ADDED',
						'CANCELLED',
						'COMPLETED',
						'DELETED',
						'ERROR',
						'FAILED',
						'PARTIAL',
						'SKIPPED',
					])
					.optional(),
				account_id: unspecifiedProviderValue(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_3b605dc8977cOutput = z.undefined();
const r_10508ac747cdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				input: z
					.object({
						data: unspecifiedProviderValue().optional(),
						type: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				included_ip_fqdns: unspecifiedProviderValue().optional(),
				excluded_ip_fqdns: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_10508ac747cdOutput = z.undefined();
const r_feb002186f05Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_feb002186f05Output = z.undefined();
const r_523236c02350Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				account_id: unspecifiedProviderValue().optional(),
				business_unit_id: unspecifiedProviderValue().optional(),
				seat_type: z
					.enum([
						'USER_SEAT',
						'DEVICE_SEAT',
						'SERVER_SEAT',
						'CERTIFICATE_MANAGEMENT_SEAT',
						'IMPORTED_SEAT',
						'DISCOVERY_SEAT',
						'ORGANIZATION_SEAT',
					])
					.optional(),
				active: z
					.union([z.literal(false), z.literal(true), z.literal('all')])
					.optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_523236c02350Output = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_495ebdedb32bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.intersection(
				z
					.object({
						business_unit_id: unspecifiedProviderValue().optional(),
						seat_type: z
							.object({
								id: z
									.enum([
										'USER_SEAT',
										'DEVICE_SEAT',
										'CERTIFICATE_MANAGEMENT_SEAT',
										'SERVER_SEAT',
										'ORGANIZATION_SEAT',
									])
									.optional(),
							})
							.passthrough()
							.optional(),
						seat_id: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				z
					.object({
						seat_name: unspecifiedProviderValue().optional(),
						email: unspecifiedProviderValue().optional(),
						phone: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.strict();
const r_495ebdedb32bOutput = z.undefined();
const r_0d6230796736Input = z
	.object({
		path: z.object({ seat_id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				seat_type_id: z.enum([
					'USER_SEAT',
					'DEVICE_SEAT',
					'SERVER_SEAT',
					'CERTIFICATE_MANAGEMENT_SEAT',
					'IMPORTED_SEAT',
					'DISCOVERY_SEAT',
					'ORGANIZATION_SEAT',
				]),
				business_unit_id: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_0d6230796736Output = z
	.object({
		seat_id: unspecifiedProviderValue().optional(),
		seat_name: unspecifiedProviderValue().optional(),
		email: unspecifiedProviderValue().optional(),
		phone: unspecifiedProviderValue().optional(),
		seat_creation_date: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_5c95b7617096Input = z
	.object({
		path: z.object({ seat_id: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.intersection(
				z
					.object({
						business_unit_id: unspecifiedProviderValue().optional(),
						seat_type: z
							.object({
								id: z
									.enum([
										'USER_SEAT',
										'DEVICE_SEAT',
										'SERVER_SEAT',
										'CERTIFICATE_MANAGEMENT_SEAT',
										'IMPORTED_SEAT',
										'DISCOVERY_SEAT',
										'ORANIZATION_SEAT',
									])
									.optional(),
							})
							.passthrough()
							.optional(),
						seat_id: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				z
					.object({
						seat_name: unspecifiedProviderValue().optional(),
						email: unspecifiedProviderValue().optional(),
						phone: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.strict();
const r_5c95b7617096Output = z.undefined();
const r_50f5dbf5b576Input = z
	.object({
		path: z.object({ seat_id: unspecifiedProviderValue() }).strict(),
		query: z
			.object({
				seat_type_id: z.enum([
					'USER_SEAT',
					'DEVICE_SEAT',
					'SERVER_SEAT',
					'CERTIFICATE_MANAGEMENT_SEAT',
					'IMPORTED_SEAT',
					'DISCOVERY_SEAT',
					'ORGANIZATION_SEAT',
				]),
				business_unit_id: unspecifiedProviderValue().optional(),
				revocation_reason: z
					.enum([
						'cessation_of_operation',
						'key_compromise',
						'affiliation_changed',
						'superseded',
					])
					.optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_50f5dbf5b576Output = z.undefined();
const r_acd12ea8b342Input = z
	.object({
		path: z
			.object({
				seat_id: unspecifiedProviderValue(),
				new_business_unit_id: unspecifiedProviderValue(),
			})
			.strict(),
		query: z.object({ business_unit_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_acd12ea8b342Output = z
	.object({
		seat_id: unspecifiedProviderValue().optional(),
		seat_name: unspecifiedProviderValue().optional(),
		email: unspecifiedProviderValue().optional(),
		phone: unspecifiedProviderValue().optional(),
		seat_creation_date: unspecifiedProviderValue().optional(),
	})
	.passthrough();
const r_26265e7690c1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ account_id: unspecifiedProviderValue().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_26265e7690c1Output = unspecifiedProviderValue();
const r_c5bef0f817eeInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				offset: unspecifiedProviderValue().optional(),
				limit: unspecifiedProviderValue().optional(),
				sort: unspecifiedProviderValue().optional(),
				search_query: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c5bef0f817eeOutput = z.intersection(
	z
		.object({
			total: unspecifiedProviderValue(),
			offset: unspecifiedProviderValue(),
			limit: unspecifiedProviderValue(),
		})
		.passthrough(),
	z.object({ items: unspecifiedProviderValue().optional() }).passthrough(),
);
const r_2a5b40269113Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: unspecifiedProviderValue(),
				business_unit_id: unspecifiedProviderValue().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2a5b40269113Output = z
	.object({
		id: unspecifiedProviderValue().optional(),
		name: unspecifiedProviderValue().optional(),
		status: z
			.enum([
				'ACTIVE',
				'ALLOCATE',
				'COMMUNICATION_LOST_ERROR',
				'SHUTDOWN',
				'SUSPEND',
				'VOID',
			])
			.optional(),
		version: unspecifiedProviderValue().optional(),
		license_key: unspecifiedProviderValue().optional(),
		debug_enabled: unspecifiedProviderValue().optional(),
		allowed_actions: unspecifiedProviderValue().optional(),
		business_unit: z
			.intersection(
				z
					.object({
						id: unspecifiedProviderValue(),
						name: unspecifiedProviderValue().optional(),
					})
					.passthrough(),
				unspecifiedProviderValue(),
			)
			.optional(),
	})
	.passthrough();
const r_69deb2fed908Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				license_keys: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_69deb2fed908Output = z.undefined();
const r_359f84ec7e33Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				license_keys: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_359f84ec7e33Output = z.undefined();
const r_559e713c21d8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				advanced_settings: z
					.object({
						debug_enabled: unspecifiedProviderValue().optional(),
						heartbeat_interval: unspecifiedProviderValue().optional(),
						heartbeat_port: unspecifiedProviderValue().optional(),
					})
					.passthrough()
					.optional(),
				business_unit: z
					.intersection(
						z
							.object({
								id: unspecifiedProviderValue(),
								name: unspecifiedProviderValue().optional(),
							})
							.passthrough(),
						unspecifiedProviderValue(),
					)
					.optional(),
				id: unspecifiedProviderValue().optional(),
				name: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_559e713c21d8Output = z.undefined();
const r_3ccfd3c7488eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue().optional(),
				license_keys: unspecifiedProviderValue().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_3ccfd3c7488eOutput = z.undefined();
const r_ae93bfb2ed4dInput = z
	.object({
		path: z.object({ sensor_id: unspecifiedProviderValue() }).strict(),
		query: z.object({ account_id: unspecifiedProviderValue() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ae93bfb2ed4dOutput = z.undefined();
const r_e13817c6d741Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: unspecifiedProviderValue(),
				id: unspecifiedProviderValue(),
				name: unspecifiedProviderValue(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_e13817c6d741Output = z.undefined();
const r_a638a4b395a8Input = z
	.object({
		path: z.object({ license_key: unspecifiedProviderValue() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a638a4b395a8Output = z.string();
const r_8ca19107d770Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_8ca19107d770Output = z.string();
const r_ba846e3e9a98Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ba846e3e9a98Output = z
	.object({
		status: unspecifiedProviderValue().optional(),
		details: z
			.object({
				db_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				am_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ca_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				smtp_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ldap_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				dta_web_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				scheduled_jobs: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ticket_service: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ticket_service_heart_beat: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ts_upload_ticket_job: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				critical_services_overall_status: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				non_critical_service_overall_status: z
					.object({
						status: z
							.enum(['UP', 'DOWN', 'NOT_AVAILABLE'])
							.or(z.string())
							.optional(),
						details: z
							.object({ error: unspecifiedProviderValue().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		scheduled_jobs: z
			.object({ DEFAULT: unspecifiedProviderValue().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_f3162c793b3cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				cursor_timestamp: z.string().optional(),
				cursor_id: z.string().optional(),
				limit: z.number().int().min(1).max(1000).optional(),
				direction: z.enum(['NEXT', 'PREVIOUS']).optional(),
				sort_by: z.enum(['timestamp']).optional(),
				sort_order: z.enum(['ASC', 'DESC']).optional(),
				id: z.string().optional(),
				action: z
					.enum([
						'SIGN',
						'UPDATE',
						'ENABLE',
						'DISABLE',
						'CREATE',
						'DELETE',
						'EMAIL_SENT',
						'FETCH',
						'AUTHORIZE',
						'SEND_OTP',
						'REVOKE',
						'VERIFY',
						'LIST',
					])
					.optional(),
				resource_type: z
					.enum([
						'VALIDATION',
						'SIGNATURE',
						'LICENSE',
						'CREDENTIAL',
						'TIMESTAMP',
						'MANAGER_CONFIG',
						'DSE_ACCOUNT',
						'DSE_PROFILE',
						'CERTIFICATE_PROFILE',
						'SIGNING_PROVIDER',
						'DOCUMENT',
						'CERTIFICATE',
						'SELF_ENROLLMENT_LINK',
						'VALIDATION_PROFILE',
						'DSM_CERTIFICATE_TEMPLATE',
						'DSM_CERTIFICATE_PROFILE',
						'MIGRATION',
						'PRODUCT',
						'ONBOARDING',
						'SIGNER',
						'USER',
					])
					.optional(),
				resource_id: z.string().optional(),
				account_id: z.string().optional(),
				user_id: z.string().optional(),
				start_date: z.string().optional(),
				end_date: z.string().optional(),
				status: z.enum(['SUCCESS', 'FAILURE']).optional(),
				created_by: z.string().optional(),
				certificate_type: z
					.array(
						z.enum([
							'ESEAL',
							'INDIVIDUAL',
							'INDIVIDUAL_WITH_ORGANIZATION',
							'PROFESSIONAL',
							'CLIENT_AUTHENTICATION',
						]),
					)
					.optional(),
				certificate_level: z
					.array(z.enum(['ADVANCED_PLUS', 'QUALIFIED', 'BASIC']))
					.optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f3162c793b3cOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						id: z.string().optional(),
						account_id: z.string().optional(),
						resource_type: z
							.enum([
								'VALIDATION',
								'SIGNATURE',
								'LICENSE',
								'CREDENTIAL',
								'TIMESTAMP',
								'MANAGER_CONFIG',
								'DSE_ACCOUNT',
								'DSE_PROFILE',
								'CERTIFICATE_PROFILE',
								'SIGNING_PROVIDER',
								'DOCUMENT',
								'CERTIFICATE',
								'SELF_ENROLLMENT_LINK',
								'VALIDATION_PROFILE',
								'DSM_CERTIFICATE_TEMPLATE',
								'DSM_CERTIFICATE_PROFILE',
								'MIGRATION',
								'PRODUCT',
								'ONBOARDING',
								'SIGNER',
								'USER',
							])
							.optional(),
						resource_id: z.string().optional(),
						action: z
							.enum([
								'SIGN',
								'UPDATE',
								'CREATE',
								'DELETE',
								'EMAIL_SENT',
								'FETCH',
								'AUTHORIZE',
								'SEND_OTP',
								'ENABLE',
								'DISABLE',
								'CANCEL',
								'REVOKE',
								'SIGNING_HUB_USER_CREATION',
								'HASH_ENHANCEMENT',
								'SIGNATURE_ENHANCEMENT',
							])
							.optional(),
						auth_type: z
							.enum(['BASIC', 'API_TOKEN', 'INTERNAL'])
							.or(z.string())
							.optional(),
						timestamp: z.string().optional(),
						description: z.string().optional(),
						status: z.enum(['SUCCESS', 'FAILURE']).or(z.string()).optional(),
						error_message: z.string().optional(),
						data: z.string().optional(),
						userId: z.string().optional(),
						created_by: z.string().optional(),
						hash: z.string().optional(),
						number_hashes: z.number().int().optional(),
						license_hash_enabled: z.boolean().optional(),
						certificateLevel: z
							.enum(['ADVANCED_PLUS', 'QUALIFIED', 'BASIC'])
							.optional(),
						certificateType: z
							.enum([
								'ESEAL',
								'INDIVIDUAL',
								'INDIVIDUAL_WITH_ORGANIZATION',
								'PROFESSIONAL',
								'CLIENT_AUTHENTICATION',
							])
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pagination: z
			.object({
				count: z.number().int().optional(),
				limit: z.number().int().optional(),
				has_next: z.boolean().optional(),
				has_previous: z.boolean().optional(),
				next_cursor_timestamp: z.string().optional(),
				next_cursor_id: z.string().optional(),
				previous_cursor_timestamp: z.string().optional(),
				previous_cursor_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_496bcb0a0fcaInput = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_496bcb0a0fcaOutput = z
	.object({
		calculated_hash: z.string().optional(),
		stored_hash: z.string().optional(),
		status: z.enum(['SUCCESS', 'FAILURE']).or(z.string()).optional(),
	})
	.passthrough();
const r_67bf21878ca5Input = z
	.object({
		path: z.object({ id: z.string() }).strict(),
		query: z.object({ account_id: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_67bf21878ca5Output = z
	.object({
		id: z.string().optional(),
		account_id: z.string().optional(),
		resource_type: z
			.enum([
				'VALIDATION',
				'SIGNATURE',
				'LICENSE',
				'CREDENTIAL',
				'TIMESTAMP',
				'MANAGER_CONFIG',
				'DSE_ACCOUNT',
				'DSE_PROFILE',
				'CERTIFICATE_PROFILE',
				'SIGNING_PROVIDER',
				'DOCUMENT',
				'CERTIFICATE',
				'SELF_ENROLLMENT_LINK',
				'VALIDATION_PROFILE',
				'DSM_CERTIFICATE_TEMPLATE',
				'DSM_CERTIFICATE_PROFILE',
				'MIGRATION',
				'PRODUCT',
				'ONBOARDING',
				'SIGNER',
				'USER',
			])
			.optional(),
		resource_id: z.string().optional(),
		action: z
			.enum([
				'SIGN',
				'UPDATE',
				'CREATE',
				'DELETE',
				'EMAIL_SENT',
				'FETCH',
				'AUTHORIZE',
				'SEND_OTP',
				'ENABLE',
				'DISABLE',
				'CANCEL',
				'REVOKE',
				'SIGNING_HUB_USER_CREATION',
				'HASH_ENHANCEMENT',
				'SIGNATURE_ENHANCEMENT',
			])
			.optional(),
		auth_type: z
			.enum(['BASIC', 'API_TOKEN', 'INTERNAL'])
			.or(z.string())
			.optional(),
		timestamp: z.string().optional(),
		description: z.string().optional(),
		status: z.enum(['SUCCESS', 'FAILURE']).or(z.string()).optional(),
		error_message: z.string().optional(),
		data: z.string().optional(),
		userId: z.string().optional(),
		created_by: z.string().optional(),
		hash: z.string().optional(),
		number_hashes: z.number().int().optional(),
		license_hash_enabled: z.boolean().optional(),
		certificateLevel: z
			.enum(['ADVANCED_PLUS', 'QUALIFIED', 'BASIC'])
			.optional(),
		certificateType: z
			.enum([
				'ESEAL',
				'INDIVIDUAL',
				'INDIVIDUAL_WITH_ORGANIZATION',
				'PROFESSIONAL',
				'CLIENT_AUTHENTICATION',
			])
			.optional(),
	})
	.passthrough();
const r_1ea779a5917aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough(),
				label: z.string(),
				mobile: z.string().optional(),
				profileId: z.string(),
				reuseExistingSecret: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_1ea779a5917aOutput = z
	.object({
		id: z.string().optional(),
		account_id: z.string().optional(),
		userId: z.string().optional(),
		credential_id: z.string().optional(),
		name: z.string().optional(),
		profile_id: z.string().optional(),
		first_credential: z.boolean().optional(),
	})
	.passthrough();
const r_10a0b05680c8Input = z
	.object({
		path: z.object({ credentialId: z.string() }).strict(),
		query: z.object({ user_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough()
					.optional(),
				label: z.string().max(255).optional(),
			})
			.passthrough(),
	})
	.strict();
const r_10a0b05680c8Output = z.undefined();
const r_2f9db2b2221bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				'Paging parameters': z
					.object({
						offset: z.number().int().min(0).optional(),
						limit: z.number().int().min(1).max(100).optional(),
						sort: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				'Search parameters': z
					.object({
						id: z.string().optional(),
						label: z.string().optional(),
						user_id: z.string().optional(),
						status: z
							.enum([
								'ACTIVE',
								'PENDING_APPROVAL',
								'DEACTIVATED',
								'VALID',
								'SUSPENDED',
								'EXPIRED',
								'REVOKED',
								'PENDING_ISSUANCE',
							])
							.optional(),
						key_algorithm: z.string().optional(),
						key_size: z.number().int().optional(),
						account_id: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2f9db2b2221bOutput = z
	.object({
		total: z.number().int().optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		credentials: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						credential_id: z.string().optional(),
						label: z.string().optional(),
						key_algorithm: z.string().optional(),
						key_size: z.number().int().optional(),
						status: z.string().optional(),
						profile_id: z.string().optional(),
						userId: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_49706a34a257Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				grant_type: z.string(),
				code: z.string().optional(),
				client_id: z.string(),
				client_secret: z.string().optional(),
				redirect_uri: z.string().optional(),
				client_data: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_49706a34a257Output = z
	.object({
		access_token: z.string().optional(),
		refresh_token: z.string().optional(),
		token_type: z.string().optional(),
		expires_in: z.number().int().optional(),
	})
	.passthrough();
const r_e187a6b43f8aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				userID: z.string(),
				clientData: z.string().optional(),
				pageToken: z.string().regex(new RegExp('^[1-9][0-9]*$')).optional(),
				maxResults: z.number().int().min(1).max(100).optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_e187a6b43f8aOutput = z
	.object({
		nextPageToken: z.string().optional(),
		credentialIDs: z.array(z.string()).optional(),
	})
	.passthrough();
const r_1c6a50e75c89Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificates: z.string().optional(),
				lang: z.string().optional(),
				clientData: z.string().optional(),
				credentialID: z.string(),
				certInfo: z.boolean().optional(),
				authInfo: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_1c6a50e75c89Output = z
	.object({
		description: z.string().optional(),
		authMode: z.string().optional(),
		lang: z.string().optional(),
		key: z
			.object({
				status: z.string().optional(),
				algo: z.array(z.string()).optional(),
				len: z.number().int().optional(),
				curve: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cert: z
			.object({
				status: z.string().optional(),
				certificates: z.array(z.string()).optional(),
				issuerDN: z.string().optional(),
				serialNumber: z.string().optional(),
				subjectDN: z.string().optional(),
				validFrom: z.string().optional(),
				validTo: z.string().optional(),
			})
			.passthrough()
			.optional(),
		SCAL: z.string().optional(),
		PIN: z
			.object({
				presence: z.string().optional(),
				format: z.string().optional(),
				label: z.string().optional(),
				description: z.string().optional(),
			})
			.passthrough()
			.optional(),
		OTP: z
			.object({
				presence: z.string().optional(),
				type: z.string().optional(),
				provider: z.string().optional(),
				format: z.string().optional(),
				label: z.string().optional(),
				description: z.string().optional(),
				ID: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_4f1ae9384a62Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				credentialID: z.string(),
				numSignatures: z.number().int(),
				PIN: z.string().optional(),
				OTP: z.string().optional(),
				description: z.string().optional(),
				clientData: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_4f1ae9384a62Output = z
	.object({ expiresIn: z.string().optional(), SAD: z.string().optional() })
	.passthrough();
const r_0a89eb9da37aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				clientData: z.string().optional(),
				credentialID: z.string(),
				SAD: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_0a89eb9da37aOutput = z
	.object({ expiresIn: z.string().optional(), SAD: z.string().optional() })
	.passthrough();
const r_b6e2c6352946Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ clientData: z.string().optional(), credentialID: z.string() })
			.passthrough(),
	})
	.strict();
const r_b6e2c6352946Output = z.undefined();
const r_1dfa31b33752Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				hashAlgo: z.string().optional(),
				signAlgo: z.string(),
				signAlgoParams: z.string().optional(),
				clientData: z.string().optional(),
				credentialID: z.string(),
				SAD: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_1dfa31b33752Output = z
	.object({ signatures: z.array(z.string()).optional() })
	.passthrough();
const r_01f60286e899Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				nonce: z.string().optional(),
				clientData: z.string().optional(),
				hash: z.string(),
				hashAlgo: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_01f60286e899Output = z.string();
const r_ca1177a347b7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				token: z.string(),
				token_type_hint: z.string().optional(),
				client_data: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_ca1177a347b7Output = z.undefined();
const r_6a8b01159864Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				grant_type: z.string(),
				code: z.string().optional(),
				client_id: z.string(),
				client_secret: z.string().optional(),
				redirect_uri: z.string().optional(),
				client_data: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_6a8b01159864Output = z
	.object({
		access_token: z.string().optional(),
		refresh_token: z.string().optional(),
		token_type: z.string().optional(),
		expires_in: z.number().int().optional(),
	})
	.passthrough();
const r_239bdd33faf8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				userID: z.string(),
				clientData: z.string().optional(),
				pageToken: z.string().regex(new RegExp('^[1-9][0-9]*$')).optional(),
				maxResults: z.number().int().min(1).max(100).optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_239bdd33faf8Output = z
	.object({
		nextPageToken: z.string().optional(),
		credentialIDs: z.array(z.string()).optional(),
	})
	.passthrough();
const r_bf7ea6ad7e85Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificates: z.string().optional(),
				lang: z.string().optional(),
				clientData: z.string().optional(),
				credentialID: z.string(),
				certInfo: z.boolean().optional(),
				authInfo: z.boolean().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_bf7ea6ad7e85Output = z
	.object({
		description: z.string().optional(),
		authMode: z.string().optional(),
		lang: z.string().optional(),
		key: z
			.object({
				status: z.string().optional(),
				algo: z.array(z.string()).optional(),
				len: z.number().int().optional(),
				curve: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cert: z
			.object({
				status: z.string().optional(),
				certificates: z.array(z.string()).optional(),
				issuerDN: z.string().optional(),
				serialNumber: z.string().optional(),
				subjectDN: z.string().optional(),
				validFrom: z.string().optional(),
				validTo: z.string().optional(),
			})
			.passthrough()
			.optional(),
		SCAL: z.string().optional(),
		PIN: z
			.object({
				presence: z.string().optional(),
				format: z.string().optional(),
				label: z.string().optional(),
				description: z.string().optional(),
			})
			.passthrough()
			.optional(),
		OTP: z
			.object({
				presence: z.string().optional(),
				type: z.string().optional(),
				provider: z.string().optional(),
				format: z.string().optional(),
				label: z.string().optional(),
				description: z.string().optional(),
				ID: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_52c298194dc9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				credentialID: z.string(),
				numSignatures: z.number().int(),
				PIN: z.string().optional(),
				OTP: z.string().optional(),
				description: z.string().optional(),
				clientData: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_52c298194dc9Output = z
	.object({ expiresIn: z.string().optional(), SAD: z.string().optional() })
	.passthrough();
const r_ff4a7601c20eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				clientData: z.string().optional(),
				credentialID: z.string(),
				SAD: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_ff4a7601c20eOutput = z
	.object({ expiresIn: z.string().optional(), SAD: z.string().optional() })
	.passthrough();
const r_8b2f49243338Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ clientData: z.string().optional(), credentialID: z.string() })
			.passthrough(),
	})
	.strict();
const r_8b2f49243338Output = z.undefined();
const r_28b5d547e130Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				hash: z.array(z.string()),
				hashAlgo: z.string().optional(),
				signAlgo: z.string(),
				signAlgoParams: z.string().optional(),
				clientData: z.string().optional(),
				credentialID: z.string(),
				SAD: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_28b5d547e130Output = z
	.object({ signatures: z.array(z.string()).optional() })
	.passthrough();
const r_eca3835a228cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				nonce: z.string().optional(),
				clientData: z.string().optional(),
				hash: z.string(),
				hashAlgo: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_eca3835a228cOutput = z.string();
const r_d47572214cdfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				token: z.string(),
				token_type_hint: z.string().optional(),
				client_data: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_d47572214cdfOutput = z.undefined();
const r_6618ac8ee70fInput = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				reason: z.enum([
					'TECH_PHOTO',
					'TECH_HOLOGRAM',
					'BAD_PHOTO_QUALITY',
					'ID_NOT_SUPPORTED',
					'USER_ID',
					'ID_DAMAGED',
					'ID_OTHER',
					'USER_WRONG_PERSON',
					'PHOTO_OTHER',
					'OTHER_ERROR',
					'WARNING_SOCIAL_ENGINEERING',
					'WARNING_ID_MANIPULATION',
					'FACE_COMPARISON_UNMATCHED',
					'WARNING_FAKE_ID',
					'WARNING_PHOTO',
					'WARNING_DESCRIPTION',
					'WARNING_USER_UNDERAGE',
					'WARNING_INCONSISTENT_DATA',
					'DOCUMENT_TAMPERED',
					'WARNING_FAKED_MANIPULATED_ID',
					'WARNING_FRAUD_OTHER',
					'WARNING_WRONG_CHECKSUM',
					'WARNING_IDENTITY_THEFT',
					'SECURITY_FEATURE_IDENTITY_FAKED',
					'LIVENESS_DETECTION_FAILED',
					'SECURITY_FEATURE_DIGITAL_IMAGE\\',
					'FRONT_DOCUMENT_DIGITAL_IMAGE',
					'BACK_DOCUMENT_DIGITAL_IMAGE',
					'FACE_COMPARISON_DIGITAL_IMAGE',
					'LIVENESS_LEFT_DIGITAL_IMAGE',
					'LIVENESS_RIGHT_DIGITAL_IMAGE',
				]),
			})
			.passthrough(),
	})
	.strict();
const r_6618ac8ee70fOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_bc284230bd68Input = z
	.object({
		path: z.object({ userId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_bc284230bd68Output = z
	.object({
		oauth_account_id: z.string().optional(),
		sli: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		oauth_account_cert_central_enabled: z.string().optional(),
		validation_list: z
			.array(
				z
					.object({
						validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'REVIEW_PENDING',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						validation_expiry_date: z.string().optional(),
						validation_type: z
							.enum(['advanced+', 'qualified', 'basic'])
							.optional(),
						terms_and_conditions: z.string().optional(),
						terms_id: z.string().optional(),
						certificate: z
							.object({
								subject_dn: z.string().optional(),
								validity: z.string().optional(),
							})
							.passthrough()
							.optional(),
						default_profile_id: z.string().optional(),
						validation_id: z.string().optional(),
						validation_method: z
							.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
							.optional(),
						ident_type: z
							.enum([
								'AUTO_IDENT_ADVANCED',
								'AUTO_IDENT_QUALIFIED',
								'VIDEO_IDENT_QUALIFIED',
								'AUTO_IDENT_BASIC',
								'VIDEO_IDENT_BASIC',
								'VIDEO_IDENT_ADVANCED_PLUS',
								'VIDEO_IDENT_TEST_QUALIFIED',
								'AUTO_IDENT_TEST_ADVANCED',
								'AUTO_IDENT_TEST_QUALIFIED',
								'AUTO_IDENT_TEST_BASIC',
								'VIDEO_IDENT_TEST_BASIC',
								'VIDEO_IDENT_TEST_ADVANCED_PLUS',
							])
							.optional(),
						ident_id: z.string().optional(),
						oauth_account_id: z.string().optional(),
						client_data: z.string().optional(),
						sli: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_53dc0f0c10e0Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_53dc0f0c10e0Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_d3443d50d56fInput = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough(),
				contact_data: z
					.object({
						mobile_phone: z.string(),
						email: z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*@[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*[a-zA-Z]{2,}$",
								),
							),
					})
					.passthrough(),
				user_data: z
					.object({
						first_name: z.string(),
						last_name: z.string(),
						common_name: z.string().optional(),
						nationality: z.string().optional(),
						ident_language: z.string().optional(),
						organization_uuid: z.string().optional(),
						organization: z.string().optional(),
						title: z.string().optional(),
						partner_id: z.string().optional(),
						profession_validation_date: z.string().optional(),
						organization_identifier: z.string().optional(),
						organization_country: z.string().optional(),
						organization_state: z.string().optional(),
						organization_locality: z.string().optional(),
					})
					.passthrough(),
				identification_document: z
					.object({
						country: z.string(),
						number: z.string(),
						date_issued: z.string(),
						valid_until: z.string(),
						type: z.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD']),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_d3443d50d56fOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_5246dd4ce6efInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.string(),
				'Paging parameters': z
					.object({
						offset: z.number().int().min(0).optional(),
						limit: z.number().int().min(1).max(100).optional(),
						sort: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				'Search parameters': z
					.object({
						id: z.string().optional(),
						email: z.string().optional(),
						validation_entity_type: z.string().optional(),
						validation_type: z.string().optional(),
						validation_method: z
							.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
							.optional(),
						validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'REVIEW_PENDING',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						validation_entity: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_5246dd4ce6efOutput = z
	.object({
		total: z.number().int().optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		items: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						validation_id: z.string().optional(),
						validation_entity: z.string().optional(),
						validation_entity_type: z.string().optional(),
						validation_type: z.string().optional(),
						validation_method: z.string().optional(),
						validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'REVIEW_PENDING',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'CANCELLED',
							])
							.optional(),
						default_profile_id: z.string().optional(),
						credential_profile_ids: z.array(z.string()).optional(),
						verifyid_transaction_id: z.string().optional(),
						associated_users: z
							.array(
								z
									.object({
										created_by: z.string().optional(),
										modified_on: z.string().optional(),
										modified_by: z.string().optional(),
										created_on: z.string().optional(),
										associate_user_id: z.string().optional(),
										email: z.string().optional(),
										phone: z.string().optional(),
										pending_user_creation: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
						expiration_date: z.string().optional(),
						expired: z.boolean().optional(),
						rejection_status: z.string().optional(),
						vetting_details: z
							.object({
								first_name: z.string().optional(),
								last_name: z.string().optional(),
								common_name: z.string().optional(),
								country: z.string().optional(),
								document_type: z
									.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
									.optional(),
								document_id: z.string().optional(),
								date_issued: z.string().optional(),
								valid_until: z.string().optional(),
								nationality: z.string().optional(),
								ident_language: z.string().optional(),
								title: z.string().optional(),
								organization_uuid: z.string().optional(),
								organization: z.string().optional(),
								organization_identifier: z.string().optional(),
								organization_country: z.string().optional(),
								organization_unit: z.string().optional(),
								organization_state: z.string().optional(),
								organization_locality: z.string().optional(),
								phone: z.string().optional(),
								email: z.string().optional(),
								blocklist_transaction_number: z.string().optional(),
								partner_id: z.string().optional(),
								profession_validation_date: z.string().optional(),
							})
							.passthrough()
							.optional(),
						validation_approvals: z
							.array(
								z
									.object({
										id: z.string().optional(),
										validationId: z.string().optional(),
										reviewed_validation_status: z
											.enum([
												'VALIDATION_CREATED',
												'VALIDATION_ERROR',
												'INVITE_SENT',
												'INVITE_FAILED',
												'PENDING_IDENTITY_PROOFING',
												'APPROVED',
												'REJECTED',
												'ABORTED',
												'DOCUMENT_VERIFICATION_ERROR',
												'EXPIRED',
												'PENDING_MANUAL_REVIEW',
												'PENDING_SIGNER_APPROVAL',
												'PENDING_ORG_REVIEW',
												'DISABLED',
												'CANCELLED',
											])
											.optional(),
										status: z
											.enum(['APPROVED', 'REJECTED'])
											.or(z.string())
											.optional(),
										reason: z.string().optional(),
										reason_code: z
											.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
											.optional(),
										userId: z.string().optional(),
										reviewed_on: z.string().optional(),
										reviewed_by: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						validation_enrollment_id: z.string().optional(),
						validation_profile_id: z.string().optional(),
						failure_reason: z.string().optional(),
						language_code: z.string().optional(),
						auto_approval_enabled: z.boolean().optional(),
						terms_and_conditions: z.string().optional(),
						terms_acceptance_time: z.string().optional(),
						client_data: z.string().optional(),
						last_sent: z.string().optional(),
						invites_number: z.number().int().optional(),
						validation_profile: z
							.object({
								id: z.string().optional(),
								credential_profile_ids: z.array(z.string()).optional(),
								default_credential_profile_id: z.string().optional(),
								validation_method: z
									.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
									.optional(),
								validation_type: z
									.enum(['advanced+', 'qualified', 'basic'])
									.optional(),
								nickname: z.string().optional(),
								policies: z
									.array(
										z
											.object({
												name: z
													.enum([
														'organization_details_required',
														'title_detail_required',
														'create_user',
														'issue_credential',
														'suppress_validation_approval_email',
														'add_san_value_to_certificate',
														'blocklist_transaction_number_required',
														'allow_opt_out',
														'register_notary_profession_validation',
														'organization_identifier_required',
													])
													.optional(),
												value: z.boolean().optional(),
											})
											.passthrough(),
									)
									.optional(),
								status: z
									.enum(['ACTIVE', 'DISABLED'])
									.or(z.string())
									.optional(),
								modified_on: z.string().optional(),
								created_by: z.string().optional(),
								created_on: z.string().optional(),
								modified_by: z.string().optional(),
								account_id: z.string().optional(),
								alternative_validation_profile_id: z.string().optional(),
								is_default_profile: z.string().optional(),
								organization_id: z.string().optional(),
								remote_identity_vendor: z
									.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
									.optional(),
								product_type: z.string().optional(),
								organization_identifier: z.string().optional(),
								onboarding_credential_profile_id: z.string().optional(),
							})
							.passthrough()
							.optional(),
						cancelationReason: z.string().optional(),
						bulk_onboarding_user_id: z.string().optional(),
						legal_first_name: z.string().optional(),
						legal_last_name: z.string().optional(),
						account_id: z.string().optional(),
						tags: z
							.array(
								z
									.object({
										name: z.string().optional(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_8ee4f85d366dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough(),
				validation_entity: z.enum(['person', 'organization']).optional(),
				validation_entity_type: z
					.enum(['account_user', 'end_user', 'organization'])
					.optional(),
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				default_profile_id: z.string().optional(),
				associated_users: z
					.object({
						list: z
							.array(
								z
									.object({
										associate_user_id: z.string().optional(),
										email: z.string(),
										phone: z.string().optional(),
										new_user: z.boolean().optional(),
										language_code: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						empty: z.boolean().optional(),
					})
					.passthrough(),
				validation_profile_id: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_8ee4f85d366dOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
		tags: z
			.array(
				z
					.object({
						name: z.string().optional(),
						values: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_a15028cb4d8cInput = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a15028cb4d8cOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
		tags: z
			.array(
				z
					.object({
						name: z.string().optional(),
						values: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const r_e6736eb32525Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z
			.object({ account_id: z.string(), force: z.boolean().optional() })
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e6736eb32525Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_d52a0423fb82Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({ account_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d52a0423fb82Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_75c13df8a979Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_75c13df8a979Output = z.undefined();
const r_5506f0d0c709Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough()
					.optional(),
				notes: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_5506f0d0c709Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_fa557bf6435eInput = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough()
					.optional(),
				notes: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_fa557bf6435eOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_fdcd632d15c3Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough()
					.optional(),
				reason_code: z
					.enum([
						'KEY_COMPROMISE',
						'AFFILIATION_CHANGED',
						'SUPERSEDED',
						'CESSATION_OF_OPERATION',
					])
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_fdcd632d15c3Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_cdc09308beb2Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cdc09308beb2Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_715ac3807e24Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				reason: z.enum([
					'VALIDATION_IN_PROCESS',
					'VALIDATION_COMPLETED',
					'UNDEFINED',
				]),
			})
			.passthrough(),
	})
	.strict();
const r_715ac3807e24Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_9082880056c2Input = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9082880056c2Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_537bfeb702eeInput = z
	.object({
		path: z.object({ validationId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				reason: z.enum([
					'TECH_PHOTO',
					'TECH_HOLOGRAM',
					'BAD_PHOTO_QUALITY',
					'ID_NOT_SUPPORTED',
					'USER_ID',
					'ID_DAMAGED',
					'ID_OTHER',
					'USER_WRONG_PERSON',
					'PHOTO_OTHER',
					'OTHER_ERROR',
					'WARNING_SOCIAL_ENGINEERING',
					'WARNING_ID_MANIPULATION',
					'FACE_COMPARISON_UNMATCHED',
					'WARNING_FAKE_ID',
					'WARNING_PHOTO',
					'WARNING_DESCRIPTION',
					'WARNING_USER_UNDERAGE',
					'WARNING_INCONSISTENT_DATA',
					'DOCUMENT_TAMPERED',
					'WARNING_FAKED_MANIPULATED_ID',
					'WARNING_FRAUD_OTHER',
					'WARNING_WRONG_CHECKSUM',
					'WARNING_IDENTITY_THEFT',
					'SECURITY_FEATURE_IDENTITY_FAKED',
					'LIVENESS_DETECTION_FAILED',
					'SECURITY_FEATURE_DIGITAL_IMAGE\\',
					'FRONT_DOCUMENT_DIGITAL_IMAGE',
					'BACK_DOCUMENT_DIGITAL_IMAGE',
					'FACE_COMPARISON_DIGITAL_IMAGE',
					'LIVENESS_LEFT_DIGITAL_IMAGE',
					'LIVENESS_RIGHT_DIGITAL_IMAGE',
				]),
			})
			.passthrough(),
	})
	.strict();
const r_537bfeb702eeOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		validation_id: z.string().optional(),
		validation_entity: z.string().optional(),
		validation_entity_type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_method: z.string().optional(),
		validation_status: z
			.enum([
				'VALIDATION_CREATED',
				'VALIDATION_ERROR',
				'INVITE_SENT',
				'INVITE_FAILED',
				'PENDING_IDENTITY_PROOFING',
				'APPROVED',
				'REJECTED',
				'ABORTED',
				'DOCUMENT_VERIFICATION_ERROR',
				'REVIEW_PENDING',
				'EXPIRED',
				'PENDING_MANUAL_REVIEW',
				'PENDING_SIGNER_APPROVAL',
				'CANCELLED',
			])
			.optional(),
		default_profile_id: z.string().optional(),
		credential_profile_ids: z.array(z.string()).optional(),
		verifyid_transaction_id: z.string().optional(),
		associated_users: z
			.array(
				z
					.object({
						created_by: z.string().optional(),
						modified_on: z.string().optional(),
						modified_by: z.string().optional(),
						created_on: z.string().optional(),
						associate_user_id: z.string().optional(),
						email: z.string().optional(),
						phone: z.string().optional(),
						pending_user_creation: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		expiration_date: z.string().optional(),
		expired: z.boolean().optional(),
		rejection_status: z.string().optional(),
		vetting_details: z
			.object({
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				common_name: z.string().optional(),
				country: z.string().optional(),
				document_type: z
					.enum(['PASSPORT', 'DRIVER_LICENSE', 'ID_CARD'])
					.optional(),
				document_id: z.string().optional(),
				date_issued: z.string().optional(),
				valid_until: z.string().optional(),
				nationality: z.string().optional(),
				ident_language: z.string().optional(),
				title: z.string().optional(),
				organization_uuid: z.string().optional(),
				organization: z.string().optional(),
				organization_identifier: z.string().optional(),
				organization_country: z.string().optional(),
				organization_unit: z.string().optional(),
				organization_state: z.string().optional(),
				organization_locality: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				blocklist_transaction_number: z.string().optional(),
				partner_id: z.string().optional(),
				profession_validation_date: z.string().optional(),
			})
			.passthrough()
			.optional(),
		validation_approvals: z
			.array(
				z
					.object({
						id: z.string().optional(),
						validationId: z.string().optional(),
						reviewed_validation_status: z
							.enum([
								'VALIDATION_CREATED',
								'VALIDATION_ERROR',
								'INVITE_SENT',
								'INVITE_FAILED',
								'PENDING_IDENTITY_PROOFING',
								'APPROVED',
								'REJECTED',
								'ABORTED',
								'DOCUMENT_VERIFICATION_ERROR',
								'EXPIRED',
								'PENDING_MANUAL_REVIEW',
								'PENDING_SIGNER_APPROVAL',
								'PENDING_ORG_REVIEW',
								'DISABLED',
								'CANCELLED',
							])
							.optional(),
						status: z.enum(['APPROVED', 'REJECTED']).or(z.string()).optional(),
						reason: z.string().optional(),
						reason_code: z
							.enum(['VALIDATION_IN_PROCESS', 'VALIDATION_COMPLETED'])
							.optional(),
						userId: z.string().optional(),
						reviewed_on: z.string().optional(),
						reviewed_by: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		validation_enrollment_id: z.string().optional(),
		validation_profile_id: z.string().optional(),
		failure_reason: z.string().optional(),
		language_code: z.string().optional(),
		auto_approval_enabled: z.boolean().optional(),
		terms_and_conditions: z.string().optional(),
		terms_acceptance_time: z.string().optional(),
		client_data: z.string().optional(),
		last_sent: z.string().optional(),
		invites_number: z.number().int().optional(),
		validation_profile: z
			.object({
				id: z.string().optional(),
				credential_profile_ids: z.array(z.string()).optional(),
				default_credential_profile_id: z.string().optional(),
				validation_method: z
					.enum(['f2f', 'remote', 'RA', 'manual', 'remote_manual'])
					.optional(),
				validation_type: z
					.enum(['advanced+', 'qualified', 'basic'])
					.or(z.string())
					.optional(),
				nickname: z.string().optional(),
				policies: z
					.array(
						z
							.object({
								name: z
									.enum([
										'organization_details_required',
										'title_detail_required',
										'create_user',
										'issue_credential',
										'suppress_validation_approval_email',
										'add_san_value_to_certificate',
										'blocklist_transaction_number_required',
										'allow_opt_out',
										'register_notary_profession_validation',
										'organization_identifier_required',
									])
									.optional(),
								value: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				status: z.enum(['ACTIVE', 'DISABLED']).or(z.string()).optional(),
				modified_on: z.string().optional(),
				created_by: z.string().optional(),
				created_on: z.string().optional(),
				modified_by: z.string().optional(),
				account_id: z.string().optional(),
				alternative_validation_profile_id: z.string().optional(),
				is_default_profile: z.string().optional(),
				organization_id: z.string().optional(),
				remote_identity_vendor: z
					.enum(['AUTO_IDENT', 'VIDEO_IDENT'])
					.optional(),
				product_type: z.string().optional(),
				organization_identifier: z.string().optional(),
				onboarding_credential_profile_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		cancelationReason: z.string().optional(),
		bulk_onboarding_user_id: z.string().optional(),
		legal_first_name: z.string().optional(),
		legal_last_name: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();
const r_b1d9a5f5f20fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				credential_id: z.string().optional(),
				hashes: z.array(z.string()).optional(),
				sign_algo: z.string().optional(),
				advanced_electronic_signature: z
					.enum(['PAdES-B', 'PAdES-T', 'CAdES-B', 'CAdES-T', 'CAdES-LT'])
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_b1d9a5f5f20fOutput = z
	.object({ hashes: z.array(z.string()).optional() })
	.passthrough();
const r_efe3153749c0Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				credential_id: z.string().optional(),
				signatures: z.array(z.string()).optional(),
				sign_algo: z.string().optional(),
				advanced_electronic_signature: z
					.enum(['PAdES-B', 'PAdES-T', 'CAdES-B', 'CAdES-T', 'CAdES-LT'])
					.optional(),
				hashes: z.array(z.string()).optional(),
			})
			.passthrough(),
	})
	.strict();
const r_efe3153749c0Output = z
	.object({ signatures: z.array(z.string()).optional() })
	.passthrough();
const r_415ee9fded4fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_name: z.string(),
				locale: z.string(),
				is_delegated: z.boolean(),
				admin_user: z
					.object({
						first_name: z.string(),
						last_name: z.string(),
						email: z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*@[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*[a-zA-Z]{2,}$",
								),
							),
						user_name: z.string(),
						phone_number: z.string(),
						locale: z.string(),
						id: z.string(),
					})
					.passthrough(),
				service_user: z
					.object({
						email: z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*@[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*[a-zA-Z]{2,}$",
								),
							),
					})
					.passthrough(),
				organization_details: z
					.object({
						id: z.string().optional(),
						name: z.string(),
						address: z.string(),
						address2: z.string(),
						zip: z.string().optional(),
						city: z.string().optional(),
						state: z.string().optional(),
						country: z.string(),
						telephone: z.string().optional(),
						organization_contact: z
							.object({
								first_name: z.string(),
								last_name: z.string(),
								email: z.string(),
								job_title: z.string(),
								telephone: z.string(),
							})
							.passthrough(),
						authorized_representative: z.array(
							z
								.object({
									first_name: z.string(),
									last_name: z.string(),
									email: z.string(),
									job_title: z.string(),
									telephone: z.string(),
								})
								.passthrough(),
						),
						organization_identifier: z.string().optional(),
					})
					.passthrough(),
				sso_configuration: z
					.object({
						authorization_endpoint: z.string().optional(),
						token_endpoint: z.string().optional(),
						jwks_endpoint: z.string().optional(),
						client_id: z.string().optional(),
						client_secret: z.string().optional(),
						token_audience: z.string().optional(),
						token_issuer: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_415ee9fded4fOutput = z
	.object({
		id: z.string().optional(),
		service_user: z
			.object({ api_key: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		admin_user: z
			.object({ api_key: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		products: z.array(z.string()).optional(),
		account_id: z.string().optional(),
		organization: z
			.object({
				id: z.number().int().optional(),
				status: z.string().optional(),
				display_name: z.string().optional(),
				name: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				zip: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
			})
			.passthrough()
			.optional(),
		sso_configuration: z
			.object({
				callback_url: z.string().optional(),
				login_initiation_endpoint: z.string().optional(),
				logout_endpoint: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_697bc713dbd3Input = z
	.object({
		path: z.object({ onboardingId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				organization_details: z
					.object({
						id: z.string().optional(),
						name: z.string(),
						address: z.string(),
						address2: z.string(),
						zip: z.string().optional(),
						city: z.string().optional(),
						state: z.string().optional(),
						country: z.string(),
						telephone: z.string().optional(),
						organization_contact: z
							.object({
								first_name: z.string(),
								last_name: z.string(),
								email: z.string(),
								job_title: z.string(),
								telephone: z.string(),
							})
							.passthrough(),
						authorized_representative: z.array(
							z
								.object({
									first_name: z.string(),
									last_name: z.string(),
									email: z.string(),
									job_title: z.string(),
									telephone: z.string(),
								})
								.passthrough(),
						),
						organization_identifier: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.strict();
const r_697bc713dbd3Output = z
	.object({
		id: z.string().optional(),
		service_user: z
			.object({ api_key: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		admin_user: z
			.object({ api_key: z.string().optional(), id: z.string().optional() })
			.passthrough()
			.optional(),
		products: z.array(z.string()).optional(),
		account_id: z.string().optional(),
		organization: z
			.object({
				id: z.number().int().optional(),
				status: z.string().optional(),
				display_name: z.string().optional(),
				name: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				zip: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
			})
			.passthrough()
			.optional(),
		sso_configuration: z
			.object({
				callback_url: z.string().optional(),
				login_initiation_endpoint: z.string().optional(),
				logout_endpoint: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_c1004107761fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				email: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				user_name: z.string(),
				phone_number: z.string().optional(),
				locale: z.string().optional(),
				description: z.string().optional(),
				user_type: z.string(),
				accounts: z.array(z.string()),
				roles: z.array(
					z.enum([
						'AM_ACCOUNT_ADMIN',
						'DSM_DOCUMENT_SIGNER',
						'AM_DEFAULT_USER',
						'DSM_CLIENT_ADMIN',
					]),
				),
				is_pipl_accepted: z.boolean(),
				is_tou_accepted: z.boolean(),
			})
			.passthrough(),
	})
	.strict();
const r_c1004107761fOutput = z
	.object({ id: z.string().optional() })
	.passthrough();
const r_67d02fcd971fInput = z
	.object({
		path: z.object({ userId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account: z
					.object({ id: z.string(), name: z.string().optional() })
					.passthrough(),
				phone_number: z.string().regex(new RegExp('\\+\\d{8,15}')).optional(),
				email: z
					.string()
					.regex(
						new RegExp(
							"^[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*@[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*[a-zA-Z]{2,}$",
						),
					)
					.optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				locale: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_67d02fcd971fOutput = z.undefined();
const r_a2afdf611241Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				label: z.string(),
				countryCode: z.string().optional(),
				productName: z.string(),
				organization: z
					.object({
						id: z.number().int(),
						contacts: z.array(
							z
								.object({
									first_name: z.string().optional(),
									last_name: z.string().optional(),
									telephone: z.string().optional(),
									email: z.string().optional(),
									job_title: z.string().optional(),
									country: z.string().optional(),
									city: z.string().optional(),
									state: z.string().optional(),
									zip: z.string().optional(),
									contact_type: z.enum([
										'VERIFIED_CONTACT',
										'ORGANIZATION_CONTACT',
									]),
									id: z.number().int().optional(),
								})
								.passthrough(),
						),
					})
					.passthrough(),
				userId: z.string(),
			})
			.passthrough(),
	})
	.strict();
const r_a2afdf611241Output = z
	.object({
		id: z.string().optional(),
		account_id: z.string().optional(),
		userId: z.string().optional(),
		credential_id: z.string().optional(),
		name: z.string().optional(),
		profile_id: z.string().optional(),
		first_credential: z.boolean().optional(),
	})
	.passthrough();
const r_4a3694a0845bInput = z
	.object({
		path: z.object({ name: z.string() }).strict(),
		query: z.object({ user_id: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4a3694a0845bOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		id: z.string().optional(),
		name: z.string().optional(),
		user_id: z.string().optional(),
		account_id: z.string().optional(),
		profile_id: z.string().optional(),
		first_credential: z.boolean().optional(),
		status: z.string().optional(),
		cc_order_id: z.string().optional(),
	})
	.passthrough();
const r_90c9fc0dc00aInput = z
	.object({
		path: z.object({ name: z.string() }).strict(),
		query: z.object({ user_id: z.string().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ notes: z.string() }).passthrough(),
	})
	.strict();
const r_90c9fc0dc00aOutput = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		id: z.string().optional(),
		name: z.string().optional(),
		user_id: z.string().optional(),
		account_id: z.string().optional(),
		profile_id: z.string().optional(),
		first_credential: z.boolean().optional(),
		status: z.string().optional(),
		cc_order_id: z.string().optional(),
	})
	.passthrough();
const r_30b532b72cb1Input = z
	.object({
		path: z.object({ name: z.string() }).strict(),
		query: z.object({ user_id: z.string() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				reason: z.enum([
					'KEY_COMPROMISE',
					'AFFILIATION_CHANGED',
					'SUPERSEDED',
					'CESSATION_OF_OPERATION',
				]),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_30b532b72cb1Output = z
	.object({
		created_by: z.string().optional(),
		modified_on: z.string().optional(),
		modified_by: z.string().optional(),
		created_on: z.string().optional(),
		credential_id: z.string().optional(),
		label: z.string().optional(),
		key_algorithm: z.string().optional(),
		key_size: z.number().int().optional(),
		status: z.string().optional(),
		profile_id: z.string().optional(),
		userId: z.string().optional(),
	})
	.passthrough();
const r_707c330daa32Input = z
	.object({
		path: z.object({ userId: z.string() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				email: z
					.string()
					.regex(
						new RegExp(
							"^[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*@[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]+\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*\\.{0,1}[a-zA-Z0-9!#$%&'*.+/=?^_‘{|}~-]*[a-zA-Z]{2,}$",
						),
					),
				first_name: z.string(),
				last_name: z.string(),
				user_name: z.string(),
				phone_number: z.string().optional(),
				locale: z.string().optional(),
				description: z.string().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_707c330daa32Output = z
	.object({ id: z.string().optional() })
	.passthrough();

export const generatedOpenApiSchemasB = {
	r_652f18b2b4b6Output: r_652f18b2b4b6Output,
	r_0c3e91de6873Input: r_0c3e91de6873Input,
	r_0c3e91de6873Output: r_0c3e91de6873Output,
	r_80834d3f81b9Input: r_80834d3f81b9Input,
	r_80834d3f81b9Output: r_80834d3f81b9Output,
	r_a2ed911770eaInput: r_a2ed911770eaInput,
	r_a2ed911770eaOutput: r_a2ed911770eaOutput,
	r_1343adaa2bdbInput: r_1343adaa2bdbInput,
	r_1343adaa2bdbOutput: r_1343adaa2bdbOutput,
	r_f55c3dc3abceInput: r_f55c3dc3abceInput,
	r_f55c3dc3abceOutput: r_f55c3dc3abceOutput,
	r_b4cfb481a98cInput: r_b4cfb481a98cInput,
	r_b4cfb481a98cOutput: r_b4cfb481a98cOutput,
	r_865bfb3a91f3Input: r_865bfb3a91f3Input,
	r_865bfb3a91f3Output: r_865bfb3a91f3Output,
	r_4538e37bbe0dInput: r_4538e37bbe0dInput,
	r_4538e37bbe0dOutput: r_4538e37bbe0dOutput,
	r_90bc1797ca46Input: r_90bc1797ca46Input,
	r_90bc1797ca46Output: r_90bc1797ca46Output,
	r_bd131d63be89Input: r_bd131d63be89Input,
	r_bd131d63be89Output: r_bd131d63be89Output,
	r_611f78545acbInput: r_611f78545acbInput,
	r_611f78545acbOutput: r_611f78545acbOutput,
	r_f35b7c3e0b8aInput: r_f35b7c3e0b8aInput,
	r_f35b7c3e0b8aOutput: r_f35b7c3e0b8aOutput,
	r_7dc5f63f47d9Input: r_7dc5f63f47d9Input,
	r_7dc5f63f47d9Output: r_7dc5f63f47d9Output,
	r_471f260d6e40Input: r_471f260d6e40Input,
	r_471f260d6e40Output: r_471f260d6e40Output,
	r_514ed64de87dInput: r_514ed64de87dInput,
	r_514ed64de87dOutput: r_514ed64de87dOutput,
	r_860e43c6a58aInput: r_860e43c6a58aInput,
	r_860e43c6a58aOutput: r_860e43c6a58aOutput,
	r_07af58d0eb37Input: r_07af58d0eb37Input,
	r_07af58d0eb37Output: r_07af58d0eb37Output,
	r_aaa0dcb230feInput: r_aaa0dcb230feInput,
	r_aaa0dcb230feOutput: r_aaa0dcb230feOutput,
	r_aee3d7f5a977Input: r_aee3d7f5a977Input,
	r_aee3d7f5a977Output: r_aee3d7f5a977Output,
	r_6ea9c4afe524Input: r_6ea9c4afe524Input,
	r_6ea9c4afe524Output: r_6ea9c4afe524Output,
	r_c70a8bd812d1Input: r_c70a8bd812d1Input,
	r_c70a8bd812d1Output: r_c70a8bd812d1Output,
	r_8c26364ba4e1Input: r_8c26364ba4e1Input,
	r_8c26364ba4e1Output: r_8c26364ba4e1Output,
	r_8fc8acf59dceInput: r_8fc8acf59dceInput,
	r_8fc8acf59dceOutput: r_8fc8acf59dceOutput,
	r_e6f593872eaaInput: r_e6f593872eaaInput,
	r_e6f593872eaaOutput: r_e6f593872eaaOutput,
	r_8368e7d73f61Input: r_8368e7d73f61Input,
	r_8368e7d73f61Output: r_8368e7d73f61Output,
	r_61fda20c9ab6Input: r_61fda20c9ab6Input,
	r_61fda20c9ab6Output: r_61fda20c9ab6Output,
	r_39c28941d620Input: r_39c28941d620Input,
	r_39c28941d620Output: r_39c28941d620Output,
	r_14f3953c0d38Input: r_14f3953c0d38Input,
	r_14f3953c0d38Output: r_14f3953c0d38Output,
	r_2a9e994a5917Input: r_2a9e994a5917Input,
	r_2a9e994a5917Output: r_2a9e994a5917Output,
	r_e631ae341675Input: r_e631ae341675Input,
	r_e631ae341675Output: r_e631ae341675Output,
	r_f46d472400ecInput: r_f46d472400ecInput,
	r_f46d472400ecOutput: r_f46d472400ecOutput,
	r_198e7a38a10cInput: r_198e7a38a10cInput,
	r_198e7a38a10cOutput: r_198e7a38a10cOutput,
	r_3de0b5e30515Input: r_3de0b5e30515Input,
	r_3de0b5e30515Output: r_3de0b5e30515Output,
	r_7784c95351dfInput: r_7784c95351dfInput,
	r_7784c95351dfOutput: r_7784c95351dfOutput,
	r_908be7c77f53Input: r_908be7c77f53Input,
	r_908be7c77f53Output: r_908be7c77f53Output,
	r_5ba49344c30fInput: r_5ba49344c30fInput,
	r_5ba49344c30fOutput: r_5ba49344c30fOutput,
	r_2eeb27b0266eInput: r_2eeb27b0266eInput,
	r_2eeb27b0266eOutput: r_2eeb27b0266eOutput,
	r_145c99f05651Input: r_145c99f05651Input,
	r_145c99f05651Output: r_145c99f05651Output,
	r_99ffa6002270Input: r_99ffa6002270Input,
	r_99ffa6002270Output: r_99ffa6002270Output,
	r_ed3ac2b880e3Input: r_ed3ac2b880e3Input,
	r_ed3ac2b880e3Output: r_ed3ac2b880e3Output,
	r_214735411dd4Input: r_214735411dd4Input,
	r_214735411dd4Output: r_214735411dd4Output,
	r_98ae93786afeInput: r_98ae93786afeInput,
	r_98ae93786afeOutput: r_98ae93786afeOutput,
	r_b907984f070bInput: r_b907984f070bInput,
	r_b907984f070bOutput: r_b907984f070bOutput,
	r_1e4c8b4f1269Input: r_1e4c8b4f1269Input,
	r_1e4c8b4f1269Output: r_1e4c8b4f1269Output,
	r_73d4daf6bd17Input: r_73d4daf6bd17Input,
	r_73d4daf6bd17Output: r_73d4daf6bd17Output,
	r_a4a835e15a4fInput: r_a4a835e15a4fInput,
	r_a4a835e15a4fOutput: r_a4a835e15a4fOutput,
	r_b1de500e018cInput: r_b1de500e018cInput,
	r_b1de500e018cOutput: r_b1de500e018cOutput,
	r_b5bd22f27e1dInput: r_b5bd22f27e1dInput,
	r_b5bd22f27e1dOutput: r_b5bd22f27e1dOutput,
	r_308eb2d1df1cInput: r_308eb2d1df1cInput,
	r_308eb2d1df1cOutput: r_308eb2d1df1cOutput,
	r_920a440ee1dfInput: r_920a440ee1dfInput,
	r_920a440ee1dfOutput: r_920a440ee1dfOutput,
	r_0b702b08d456Input: r_0b702b08d456Input,
	r_0b702b08d456Output: r_0b702b08d456Output,
	r_5e7f03054b55Input: r_5e7f03054b55Input,
	r_5e7f03054b55Output: r_5e7f03054b55Output,
	r_5c203004de20Input: r_5c203004de20Input,
	r_5c203004de20Output: r_5c203004de20Output,
	r_97fb243f7243Input: r_97fb243f7243Input,
	r_97fb243f7243Output: r_97fb243f7243Output,
	r_1664e1d5afc5Input: r_1664e1d5afc5Input,
	r_1664e1d5afc5Output: r_1664e1d5afc5Output,
	r_99797a8dc240Input: r_99797a8dc240Input,
	r_99797a8dc240Output: r_99797a8dc240Output,
	r_b4f767ee3a21Input: r_b4f767ee3a21Input,
	r_b4f767ee3a21Output: r_b4f767ee3a21Output,
	r_92967c73d90eInput: r_92967c73d90eInput,
	r_92967c73d90eOutput: r_92967c73d90eOutput,
	r_28403eaf35f7Input: r_28403eaf35f7Input,
	r_28403eaf35f7Output: r_28403eaf35f7Output,
	r_692763a58cdaInput: r_692763a58cdaInput,
	r_692763a58cdaOutput: r_692763a58cdaOutput,
	r_14cebde31ad8Input: r_14cebde31ad8Input,
	r_14cebde31ad8Output: r_14cebde31ad8Output,
	r_6873b02914f1Input: r_6873b02914f1Input,
	r_6873b02914f1Output: r_6873b02914f1Output,
	r_cd67d7ceb107Input: r_cd67d7ceb107Input,
	r_cd67d7ceb107Output: r_cd67d7ceb107Output,
	r_2b409ddd1947Input: r_2b409ddd1947Input,
	r_2b409ddd1947Output: r_2b409ddd1947Output,
	r_f8e988a67b87Input: r_f8e988a67b87Input,
	r_f8e988a67b87Output: r_f8e988a67b87Output,
	r_90ec560047bdInput: r_90ec560047bdInput,
	r_90ec560047bdOutput: r_90ec560047bdOutput,
	r_e3b44e3e638bInput: r_e3b44e3e638bInput,
	r_e3b44e3e638bOutput: r_e3b44e3e638bOutput,
	r_4470d3e39ef2Input: r_4470d3e39ef2Input,
	r_4470d3e39ef2Output: r_4470d3e39ef2Output,
	r_c0eb04e32216Input: r_c0eb04e32216Input,
	r_c0eb04e32216Output: r_c0eb04e32216Output,
	r_710554dcec90Input: r_710554dcec90Input,
	r_710554dcec90Output: r_710554dcec90Output,
	r_bcabad219d28Input: r_bcabad219d28Input,
	r_bcabad219d28Output: r_bcabad219d28Output,
	r_fdcddee44a8eInput: r_fdcddee44a8eInput,
	r_fdcddee44a8eOutput: r_fdcddee44a8eOutput,
	r_f993fc71dd6cInput: r_f993fc71dd6cInput,
	r_f993fc71dd6cOutput: r_f993fc71dd6cOutput,
	r_948c3283fb77Input: r_948c3283fb77Input,
	r_948c3283fb77Output: r_948c3283fb77Output,
	r_ef7eddd600a0Input: r_ef7eddd600a0Input,
	r_ef7eddd600a0Output: r_ef7eddd600a0Output,
	r_382f226cdcf4Input: r_382f226cdcf4Input,
	r_382f226cdcf4Output: r_382f226cdcf4Output,
	r_5bec67c21dcfInput: r_5bec67c21dcfInput,
	r_5bec67c21dcfOutput: r_5bec67c21dcfOutput,
	r_162c051d7b24Input: r_162c051d7b24Input,
	r_162c051d7b24Output: r_162c051d7b24Output,
	r_38929d3c5c45Input: r_38929d3c5c45Input,
	r_38929d3c5c45Output: r_38929d3c5c45Output,
	r_e130670d7f5aInput: r_e130670d7f5aInput,
	r_e130670d7f5aOutput: r_e130670d7f5aOutput,
	r_59f4fecff54aInput: r_59f4fecff54aInput,
	r_59f4fecff54aOutput: r_59f4fecff54aOutput,
	r_78c077df3817Input: r_78c077df3817Input,
	r_78c077df3817Output: r_78c077df3817Output,
	r_23c269effbe6Input: r_23c269effbe6Input,
	r_23c269effbe6Output: r_23c269effbe6Output,
	r_e254ce295d12Input: r_e254ce295d12Input,
	r_e254ce295d12Output: r_e254ce295d12Output,
	r_589d79d3192eInput: r_589d79d3192eInput,
	r_589d79d3192eOutput: r_589d79d3192eOutput,
	r_c0711fd42515Input: r_c0711fd42515Input,
	r_c0711fd42515Output: r_c0711fd42515Output,
	r_9f6fcd99fd97Input: r_9f6fcd99fd97Input,
	r_9f6fcd99fd97Output: r_9f6fcd99fd97Output,
	r_08c5118e8629Input: r_08c5118e8629Input,
	r_08c5118e8629Output: r_08c5118e8629Output,
	r_a4a3093d5297Input: r_a4a3093d5297Input,
	r_a4a3093d5297Output: r_a4a3093d5297Output,
	r_4ea70ee9ce09Input: r_4ea70ee9ce09Input,
	r_4ea70ee9ce09Output: r_4ea70ee9ce09Output,
	r_aba4f70417deInput: r_aba4f70417deInput,
	r_aba4f70417deOutput: r_aba4f70417deOutput,
	r_ef37eb3829e2Input: r_ef37eb3829e2Input,
	r_ef37eb3829e2Output: r_ef37eb3829e2Output,
	r_b8f4fd999e91Input: r_b8f4fd999e91Input,
	r_b8f4fd999e91Output: r_b8f4fd999e91Output,
	r_c6787b39d482Input: r_c6787b39d482Input,
	r_c6787b39d482Output: r_c6787b39d482Output,
	r_15baf5205f5fInput: r_15baf5205f5fInput,
	r_15baf5205f5fOutput: r_15baf5205f5fOutput,
	r_795aa866d75eInput: r_795aa866d75eInput,
	r_795aa866d75eOutput: r_795aa866d75eOutput,
	r_cd0ce04fc2f9Input: r_cd0ce04fc2f9Input,
	r_cd0ce04fc2f9Output: r_cd0ce04fc2f9Output,
	r_47b5ee161d58Input: r_47b5ee161d58Input,
	r_47b5ee161d58Output: r_47b5ee161d58Output,
	r_cb5f6a5e8c6eInput: r_cb5f6a5e8c6eInput,
	r_cb5f6a5e8c6eOutput: r_cb5f6a5e8c6eOutput,
	r_c1e6841c6826Input: r_c1e6841c6826Input,
	r_c1e6841c6826Output: r_c1e6841c6826Output,
	r_b85de13db956Input: r_b85de13db956Input,
	r_b85de13db956Output: r_b85de13db956Output,
	r_d7ae6dc4292dInput: r_d7ae6dc4292dInput,
	r_d7ae6dc4292dOutput: r_d7ae6dc4292dOutput,
	r_32308d9d0956Input: r_32308d9d0956Input,
	r_32308d9d0956Output: r_32308d9d0956Output,
	r_e81b68e657ccInput: r_e81b68e657ccInput,
	r_e81b68e657ccOutput: r_e81b68e657ccOutput,
	r_00aaa42b68c2Input: r_00aaa42b68c2Input,
	r_00aaa42b68c2Output: r_00aaa42b68c2Output,
	r_a09ad9571231Input: r_a09ad9571231Input,
	r_a09ad9571231Output: r_a09ad9571231Output,
	r_565bb358f1fcInput: r_565bb358f1fcInput,
	r_565bb358f1fcOutput: r_565bb358f1fcOutput,
	r_c4f2ebc60dafInput: r_c4f2ebc60dafInput,
	r_c4f2ebc60dafOutput: r_c4f2ebc60dafOutput,
	r_cac1d643fd7dInput: r_cac1d643fd7dInput,
	r_cac1d643fd7dOutput: r_cac1d643fd7dOutput,
	r_9fdfa9ff199aInput: r_9fdfa9ff199aInput,
	r_9fdfa9ff199aOutput: r_9fdfa9ff199aOutput,
	r_6ae814861232Input: r_6ae814861232Input,
	r_6ae814861232Output: r_6ae814861232Output,
	r_ddbe3acdfffaInput: r_ddbe3acdfffaInput,
	r_ddbe3acdfffaOutput: r_ddbe3acdfffaOutput,
	r_cd2034a0a43dInput: r_cd2034a0a43dInput,
	r_cd2034a0a43dOutput: r_cd2034a0a43dOutput,
	r_e97c7e325ac0Input: r_e97c7e325ac0Input,
	r_e97c7e325ac0Output: r_e97c7e325ac0Output,
	r_3ae1daaeb731Input: r_3ae1daaeb731Input,
	r_3ae1daaeb731Output: r_3ae1daaeb731Output,
	r_c594c0e3a8d1Input: r_c594c0e3a8d1Input,
	r_c594c0e3a8d1Output: r_c594c0e3a8d1Output,
	r_2b39cff6b19aInput: r_2b39cff6b19aInput,
	r_2b39cff6b19aOutput: r_2b39cff6b19aOutput,
	r_13488561d95dInput: r_13488561d95dInput,
	r_13488561d95dOutput: r_13488561d95dOutput,
	r_0d465a62c1baInput: r_0d465a62c1baInput,
	r_0d465a62c1baOutput: r_0d465a62c1baOutput,
	r_ffd3d18f94d9Input: r_ffd3d18f94d9Input,
	r_ffd3d18f94d9Output: r_ffd3d18f94d9Output,
	r_9c0ee24ba5a8Input: r_9c0ee24ba5a8Input,
	r_9c0ee24ba5a8Output: r_9c0ee24ba5a8Output,
	r_7593ade75363Input: r_7593ade75363Input,
	r_7593ade75363Output: r_7593ade75363Output,
	r_38b65a4ff043Input: r_38b65a4ff043Input,
	r_38b65a4ff043Output: r_38b65a4ff043Output,
	r_aa2372f83a2eInput: r_aa2372f83a2eInput,
	r_aa2372f83a2eOutput: r_aa2372f83a2eOutput,
	r_d11c9f59c2deInput: r_d11c9f59c2deInput,
	r_d11c9f59c2deOutput: r_d11c9f59c2deOutput,
	r_f31cdd16607bInput: r_f31cdd16607bInput,
	r_f31cdd16607bOutput: r_f31cdd16607bOutput,
	r_413eadd6d21dInput: r_413eadd6d21dInput,
	r_413eadd6d21dOutput: r_413eadd6d21dOutput,
	r_90e92b7da5a3Input: r_90e92b7da5a3Input,
	r_90e92b7da5a3Output: r_90e92b7da5a3Output,
	r_a1438d4fc523Input: r_a1438d4fc523Input,
	r_a1438d4fc523Output: r_a1438d4fc523Output,
	r_e0d550d921c4Input: r_e0d550d921c4Input,
	r_e0d550d921c4Output: r_e0d550d921c4Output,
	r_db452f94fae3Input: r_db452f94fae3Input,
	r_db452f94fae3Output: r_db452f94fae3Output,
	r_38524550bc70Input: r_38524550bc70Input,
	r_38524550bc70Output: r_38524550bc70Output,
	r_01008ef1501aInput: r_01008ef1501aInput,
	r_01008ef1501aOutput: r_01008ef1501aOutput,
	r_6ac8994ec3c4Input: r_6ac8994ec3c4Input,
	r_6ac8994ec3c4Output: r_6ac8994ec3c4Output,
	r_2ff73ca5e82fInput: r_2ff73ca5e82fInput,
	r_2ff73ca5e82fOutput: r_2ff73ca5e82fOutput,
	r_371fd4d4a326Input: r_371fd4d4a326Input,
	r_371fd4d4a326Output: r_371fd4d4a326Output,
	r_27064376ccadInput: r_27064376ccadInput,
	r_27064376ccadOutput: r_27064376ccadOutput,
	r_b106e7869ed7Input: r_b106e7869ed7Input,
	r_b106e7869ed7Output: r_b106e7869ed7Output,
	r_67f447c0dbdcInput: r_67f447c0dbdcInput,
	r_67f447c0dbdcOutput: r_67f447c0dbdcOutput,
	r_21affda0f31fInput: r_21affda0f31fInput,
	r_21affda0f31fOutput: r_21affda0f31fOutput,
	r_99aba927208cInput: r_99aba927208cInput,
	r_99aba927208cOutput: r_99aba927208cOutput,
	r_427ad84ed835Input: r_427ad84ed835Input,
	r_427ad84ed835Output: r_427ad84ed835Output,
	r_832902848134Input: r_832902848134Input,
	r_832902848134Output: r_832902848134Output,
	r_ae14a0cad4edInput: r_ae14a0cad4edInput,
	r_ae14a0cad4edOutput: r_ae14a0cad4edOutput,
	r_a7822a6bdea6Input: r_a7822a6bdea6Input,
	r_a7822a6bdea6Output: r_a7822a6bdea6Output,
	r_659d2b8e8aceInput: r_659d2b8e8aceInput,
	r_659d2b8e8aceOutput: r_659d2b8e8aceOutput,
	r_4a9d25a10305Input: r_4a9d25a10305Input,
	r_4a9d25a10305Output: r_4a9d25a10305Output,
	r_eaa4afa67b1cInput: r_eaa4afa67b1cInput,
	r_eaa4afa67b1cOutput: r_eaa4afa67b1cOutput,
	r_889a59dc528aInput: r_889a59dc528aInput,
	r_889a59dc528aOutput: r_889a59dc528aOutput,
	r_604d6ac29079Input: r_604d6ac29079Input,
	r_604d6ac29079Output: r_604d6ac29079Output,
	r_6d7a2c7d5b92Input: r_6d7a2c7d5b92Input,
	r_6d7a2c7d5b92Output: r_6d7a2c7d5b92Output,
	r_c1244e33b2b4Input: r_c1244e33b2b4Input,
	r_c1244e33b2b4Output: r_c1244e33b2b4Output,
	r_fa40e5e88461Input: r_fa40e5e88461Input,
	r_fa40e5e88461Output: r_fa40e5e88461Output,
	r_4ef7dea657b7Input: r_4ef7dea657b7Input,
	r_4ef7dea657b7Output: r_4ef7dea657b7Output,
	r_2edfe1f4b869Input: r_2edfe1f4b869Input,
	r_2edfe1f4b869Output: r_2edfe1f4b869Output,
	r_2b49885a43e5Input: r_2b49885a43e5Input,
	r_2b49885a43e5Output: r_2b49885a43e5Output,
	r_a730dc9722bbInput: r_a730dc9722bbInput,
	r_a730dc9722bbOutput: r_a730dc9722bbOutput,
	r_a38f059e2a70Input: r_a38f059e2a70Input,
	r_a38f059e2a70Output: r_a38f059e2a70Output,
	r_aa991ba230c3Input: r_aa991ba230c3Input,
	r_aa991ba230c3Output: r_aa991ba230c3Output,
	r_af7ddf1c733dInput: r_af7ddf1c733dInput,
	r_af7ddf1c733dOutput: r_af7ddf1c733dOutput,
	r_e827e3bec28aInput: r_e827e3bec28aInput,
	r_e827e3bec28aOutput: r_e827e3bec28aOutput,
	r_fe3221ef0855Input: r_fe3221ef0855Input,
	r_fe3221ef0855Output: r_fe3221ef0855Output,
	r_cf48324a6d66Input: r_cf48324a6d66Input,
	r_cf48324a6d66Output: r_cf48324a6d66Output,
	r_31f08184b392Input: r_31f08184b392Input,
	r_31f08184b392Output: r_31f08184b392Output,
	r_5f0c91e25af4Input: r_5f0c91e25af4Input,
	r_5f0c91e25af4Output: r_5f0c91e25af4Output,
	r_090e1558aef3Input: r_090e1558aef3Input,
	r_090e1558aef3Output: r_090e1558aef3Output,
	r_a12209ad174fInput: r_a12209ad174fInput,
	r_a12209ad174fOutput: r_a12209ad174fOutput,
	r_a7f9ba1b6636Input: r_a7f9ba1b6636Input,
	r_a7f9ba1b6636Output: r_a7f9ba1b6636Output,
	r_cd234014f0ffInput: r_cd234014f0ffInput,
	r_cd234014f0ffOutput: r_cd234014f0ffOutput,
	r_9a2ea6339160Input: r_9a2ea6339160Input,
	r_9a2ea6339160Output: r_9a2ea6339160Output,
	r_b31cfc3255d8Input: r_b31cfc3255d8Input,
	r_b31cfc3255d8Output: r_b31cfc3255d8Output,
	r_9cd9f0927b03Input: r_9cd9f0927b03Input,
	r_9cd9f0927b03Output: r_9cd9f0927b03Output,
	r_87c7a8fcf2c3Input: r_87c7a8fcf2c3Input,
	r_87c7a8fcf2c3Output: r_87c7a8fcf2c3Output,
	r_beff76538781Input: r_beff76538781Input,
	r_beff76538781Output: r_beff76538781Output,
	r_ddb85158bd5dInput: r_ddb85158bd5dInput,
	r_ddb85158bd5dOutput: r_ddb85158bd5dOutput,
	r_8544e8ac7f57Input: r_8544e8ac7f57Input,
	r_8544e8ac7f57Output: r_8544e8ac7f57Output,
	r_fb0b80993f03Input: r_fb0b80993f03Input,
	r_fb0b80993f03Output: r_fb0b80993f03Output,
	r_f27878dd7018Input: r_f27878dd7018Input,
	r_f27878dd7018Output: r_f27878dd7018Output,
	r_10c05d173009Input: r_10c05d173009Input,
	r_10c05d173009Output: r_10c05d173009Output,
	r_936d50859847Input: r_936d50859847Input,
	r_936d50859847Output: r_936d50859847Output,
	r_fba0a11d0af9Input: r_fba0a11d0af9Input,
	r_fba0a11d0af9Output: r_fba0a11d0af9Output,
	r_39fd79124781Input: r_39fd79124781Input,
	r_39fd79124781Output: r_39fd79124781Output,
	r_d1a0900ac1cdInput: r_d1a0900ac1cdInput,
	r_d1a0900ac1cdOutput: r_d1a0900ac1cdOutput,
	r_2c4418daa501Input: r_2c4418daa501Input,
	r_2c4418daa501Output: r_2c4418daa501Output,
	r_716491633306Input: r_716491633306Input,
	r_716491633306Output: r_716491633306Output,
	r_f41e8938ed63Input: r_f41e8938ed63Input,
	r_f41e8938ed63Output: r_f41e8938ed63Output,
	r_3cab39f7decfInput: r_3cab39f7decfInput,
	r_3cab39f7decfOutput: r_3cab39f7decfOutput,
	r_0d8b21f3f0fcInput: r_0d8b21f3f0fcInput,
	r_0d8b21f3f0fcOutput: r_0d8b21f3f0fcOutput,
	r_dc1a10c2c3a6Input: r_dc1a10c2c3a6Input,
	r_dc1a10c2c3a6Output: r_dc1a10c2c3a6Output,
	r_38f57b41183dInput: r_38f57b41183dInput,
	r_38f57b41183dOutput: r_38f57b41183dOutput,
	r_3b605dc8977cInput: r_3b605dc8977cInput,
	r_3b605dc8977cOutput: r_3b605dc8977cOutput,
	r_10508ac747cdInput: r_10508ac747cdInput,
	r_10508ac747cdOutput: r_10508ac747cdOutput,
	r_feb002186f05Input: r_feb002186f05Input,
	r_feb002186f05Output: r_feb002186f05Output,
	r_523236c02350Input: r_523236c02350Input,
	r_523236c02350Output: r_523236c02350Output,
	r_495ebdedb32bInput: r_495ebdedb32bInput,
	r_495ebdedb32bOutput: r_495ebdedb32bOutput,
	r_0d6230796736Input: r_0d6230796736Input,
	r_0d6230796736Output: r_0d6230796736Output,
	r_5c95b7617096Input: r_5c95b7617096Input,
	r_5c95b7617096Output: r_5c95b7617096Output,
	r_50f5dbf5b576Input: r_50f5dbf5b576Input,
	r_50f5dbf5b576Output: r_50f5dbf5b576Output,
	r_acd12ea8b342Input: r_acd12ea8b342Input,
	r_acd12ea8b342Output: r_acd12ea8b342Output,
	r_26265e7690c1Input: r_26265e7690c1Input,
	r_26265e7690c1Output: r_26265e7690c1Output,
	r_c5bef0f817eeInput: r_c5bef0f817eeInput,
	r_c5bef0f817eeOutput: r_c5bef0f817eeOutput,
	r_2a5b40269113Input: r_2a5b40269113Input,
	r_2a5b40269113Output: r_2a5b40269113Output,
	r_69deb2fed908Input: r_69deb2fed908Input,
	r_69deb2fed908Output: r_69deb2fed908Output,
	r_359f84ec7e33Input: r_359f84ec7e33Input,
	r_359f84ec7e33Output: r_359f84ec7e33Output,
	r_559e713c21d8Input: r_559e713c21d8Input,
	r_559e713c21d8Output: r_559e713c21d8Output,
	r_3ccfd3c7488eInput: r_3ccfd3c7488eInput,
	r_3ccfd3c7488eOutput: r_3ccfd3c7488eOutput,
	r_ae93bfb2ed4dInput: r_ae93bfb2ed4dInput,
	r_ae93bfb2ed4dOutput: r_ae93bfb2ed4dOutput,
	r_e13817c6d741Input: r_e13817c6d741Input,
	r_e13817c6d741Output: r_e13817c6d741Output,
	r_a638a4b395a8Input: r_a638a4b395a8Input,
	r_a638a4b395a8Output: r_a638a4b395a8Output,
	r_8ca19107d770Input: r_8ca19107d770Input,
	r_8ca19107d770Output: r_8ca19107d770Output,
	r_ba846e3e9a98Input: r_ba846e3e9a98Input,
	r_ba846e3e9a98Output: r_ba846e3e9a98Output,
	r_f3162c793b3cInput: r_f3162c793b3cInput,
	r_f3162c793b3cOutput: r_f3162c793b3cOutput,
	r_496bcb0a0fcaInput: r_496bcb0a0fcaInput,
	r_496bcb0a0fcaOutput: r_496bcb0a0fcaOutput,
	r_67bf21878ca5Input: r_67bf21878ca5Input,
	r_67bf21878ca5Output: r_67bf21878ca5Output,
	r_1ea779a5917aInput: r_1ea779a5917aInput,
	r_1ea779a5917aOutput: r_1ea779a5917aOutput,
	r_10a0b05680c8Input: r_10a0b05680c8Input,
	r_10a0b05680c8Output: r_10a0b05680c8Output,
	r_2f9db2b2221bInput: r_2f9db2b2221bInput,
	r_2f9db2b2221bOutput: r_2f9db2b2221bOutput,
	r_49706a34a257Input: r_49706a34a257Input,
	r_49706a34a257Output: r_49706a34a257Output,
	r_e187a6b43f8aInput: r_e187a6b43f8aInput,
	r_e187a6b43f8aOutput: r_e187a6b43f8aOutput,
	r_1c6a50e75c89Input: r_1c6a50e75c89Input,
	r_1c6a50e75c89Output: r_1c6a50e75c89Output,
	r_4f1ae9384a62Input: r_4f1ae9384a62Input,
	r_4f1ae9384a62Output: r_4f1ae9384a62Output,
	r_0a89eb9da37aInput: r_0a89eb9da37aInput,
	r_0a89eb9da37aOutput: r_0a89eb9da37aOutput,
	r_b6e2c6352946Input: r_b6e2c6352946Input,
	r_b6e2c6352946Output: r_b6e2c6352946Output,
	r_1dfa31b33752Input: r_1dfa31b33752Input,
	r_1dfa31b33752Output: r_1dfa31b33752Output,
	r_01f60286e899Input: r_01f60286e899Input,
	r_01f60286e899Output: r_01f60286e899Output,
	r_ca1177a347b7Input: r_ca1177a347b7Input,
	r_ca1177a347b7Output: r_ca1177a347b7Output,
	r_6a8b01159864Input: r_6a8b01159864Input,
	r_6a8b01159864Output: r_6a8b01159864Output,
	r_239bdd33faf8Input: r_239bdd33faf8Input,
	r_239bdd33faf8Output: r_239bdd33faf8Output,
	r_bf7ea6ad7e85Input: r_bf7ea6ad7e85Input,
	r_bf7ea6ad7e85Output: r_bf7ea6ad7e85Output,
	r_52c298194dc9Input: r_52c298194dc9Input,
	r_52c298194dc9Output: r_52c298194dc9Output,
	r_ff4a7601c20eInput: r_ff4a7601c20eInput,
	r_ff4a7601c20eOutput: r_ff4a7601c20eOutput,
	r_8b2f49243338Input: r_8b2f49243338Input,
	r_8b2f49243338Output: r_8b2f49243338Output,
	r_28b5d547e130Input: r_28b5d547e130Input,
	r_28b5d547e130Output: r_28b5d547e130Output,
	r_eca3835a228cInput: r_eca3835a228cInput,
	r_eca3835a228cOutput: r_eca3835a228cOutput,
	r_d47572214cdfInput: r_d47572214cdfInput,
	r_d47572214cdfOutput: r_d47572214cdfOutput,
	r_6618ac8ee70fInput: r_6618ac8ee70fInput,
	r_6618ac8ee70fOutput: r_6618ac8ee70fOutput,
	r_bc284230bd68Input: r_bc284230bd68Input,
	r_bc284230bd68Output: r_bc284230bd68Output,
	r_53dc0f0c10e0Input: r_53dc0f0c10e0Input,
	r_53dc0f0c10e0Output: r_53dc0f0c10e0Output,
	r_d3443d50d56fInput: r_d3443d50d56fInput,
	r_d3443d50d56fOutput: r_d3443d50d56fOutput,
	r_5246dd4ce6efInput: r_5246dd4ce6efInput,
	r_5246dd4ce6efOutput: r_5246dd4ce6efOutput,
	r_8ee4f85d366dInput: r_8ee4f85d366dInput,
	r_8ee4f85d366dOutput: r_8ee4f85d366dOutput,
	r_a15028cb4d8cInput: r_a15028cb4d8cInput,
	r_a15028cb4d8cOutput: r_a15028cb4d8cOutput,
	r_e6736eb32525Input: r_e6736eb32525Input,
	r_e6736eb32525Output: r_e6736eb32525Output,
	r_d52a0423fb82Input: r_d52a0423fb82Input,
	r_d52a0423fb82Output: r_d52a0423fb82Output,
	r_75c13df8a979Input: r_75c13df8a979Input,
	r_75c13df8a979Output: r_75c13df8a979Output,
	r_5506f0d0c709Input: r_5506f0d0c709Input,
	r_5506f0d0c709Output: r_5506f0d0c709Output,
	r_fa557bf6435eInput: r_fa557bf6435eInput,
	r_fa557bf6435eOutput: r_fa557bf6435eOutput,
	r_fdcd632d15c3Input: r_fdcd632d15c3Input,
	r_fdcd632d15c3Output: r_fdcd632d15c3Output,
	r_cdc09308beb2Input: r_cdc09308beb2Input,
	r_cdc09308beb2Output: r_cdc09308beb2Output,
	r_715ac3807e24Input: r_715ac3807e24Input,
	r_715ac3807e24Output: r_715ac3807e24Output,
	r_9082880056c2Input: r_9082880056c2Input,
	r_9082880056c2Output: r_9082880056c2Output,
	r_537bfeb702eeInput: r_537bfeb702eeInput,
	r_537bfeb702eeOutput: r_537bfeb702eeOutput,
	r_b1d9a5f5f20fInput: r_b1d9a5f5f20fInput,
	r_b1d9a5f5f20fOutput: r_b1d9a5f5f20fOutput,
	r_efe3153749c0Input: r_efe3153749c0Input,
	r_efe3153749c0Output: r_efe3153749c0Output,
	r_415ee9fded4fInput: r_415ee9fded4fInput,
	r_415ee9fded4fOutput: r_415ee9fded4fOutput,
	r_697bc713dbd3Input: r_697bc713dbd3Input,
	r_697bc713dbd3Output: r_697bc713dbd3Output,
	r_c1004107761fInput: r_c1004107761fInput,
	r_c1004107761fOutput: r_c1004107761fOutput,
	r_67d02fcd971fInput: r_67d02fcd971fInput,
	r_67d02fcd971fOutput: r_67d02fcd971fOutput,
	r_a2afdf611241Input: r_a2afdf611241Input,
	r_a2afdf611241Output: r_a2afdf611241Output,
	r_4a3694a0845bInput: r_4a3694a0845bInput,
	r_4a3694a0845bOutput: r_4a3694a0845bOutput,
	r_90c9fc0dc00aInput: r_90c9fc0dc00aInput,
	r_90c9fc0dc00aOutput: r_90c9fc0dc00aOutput,
	r_30b532b72cb1Input: r_30b532b72cb1Input,
	r_30b532b72cb1Output: r_30b532b72cb1Output,
	r_707c330daa32Input: r_707c330daa32Input,
	r_707c330daa32Output: r_707c330daa32Output,
};
