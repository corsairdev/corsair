import { z } from 'zod';

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
						critical: z.unknown().optional(),
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
						critical: z.unknown().optional(),
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
			items: z.object({}).passthrough().optional(),
			limit: z.number().int().optional(),
			offset: z.number().int().optional(),
			total: z.number().int().optional(),
		})
		.passthrough(),
	z
		.object({
			itmes: z
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
											crl_frequency_hours: z.unknown().optional(),
											crl_validity_hours: z.unknown().optional(),
											override_global: z.unknown().optional(),
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
								crl_frequency_hours: z.unknown().optional(),
								crl_validity_hours: z.unknown().optional(),
								override_global: z.unknown().optional(),
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
						crl_frequency_hours: z.unknown().optional(),
						crl_validity_hours: z.unknown().optional(),
						override_global: z.unknown().optional(),
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
			items: z.object({}).passthrough().optional(),
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
				crl_frequency_hours: z.unknown().optional(),
				crl_validity_hours: z.unknown().optional(),
				override_global: z.unknown().optional(),
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
						crl_frequency_hours: z.unknown().optional(),
						crl_validity_hours: z.unknown().optional(),
						override_global: z.unknown().optional(),
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
			items: z.object({}).passthrough().optional(),
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
									enabled: z.unknown().optional(),
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
								critical: z.unknown().optional(),
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
						critical: z.unknown().optional(),
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
				hosted_type: z.enum(['online', 'offline', 'third_party']).optional(),
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
						critical: z.unknown().optional(),
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
				hosted_type: z.enum(['online', 'offline', 'third_party']).optional(),
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
								critical: z.unknown().optional(),
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
						critical: z.unknown().optional(),
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
				hosted_type: z.enum(['online', 'offline', 'third_party']).optional(),
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
								critical: z.unknown().optional(),
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
						critical: z.unknown().optional(),
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
				hosted_type: z.enum(['online', 'offline', 'third_party']).optional(),
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
			items: z.object({}).passthrough().optional(),
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
											critical: z.unknown().optional(),
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
const r_61fda20c9ab6Output = z.string();
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
			items: z.object({}).passthrough().optional(),
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
	.passthrough();
const r_2eeb27b0266eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profileId: z.unknown().optional(),
				expiry_at: z.unknown().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2eeb27b0266eOutput = z
	.object({
		eab_kid: z.unknown().optional(),
		eab_hmac: z.unknown().optional(),
		directory_url: z.unknown().optional(),
		expiry_date: z.unknown().nullable().optional(),
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
				account_id: z.unknown(),
				targets: z
					.object({
						agents: z.unknown().optional(),
						groups: z.unknown().optional(),
					})
					.passthrough(),
				options: z
					.object({
						os_certificate_store_scan: z.unknown().optional(),
						file_system_scan: z.unknown().optional(),
						file_system_scan_types: z.unknown().optional(),
						keystore_credentials: z.unknown().optional(),
						os_cert_store_scan_options: z
							.object({
								local_machine_stores: z.unknown().optional(),
								current_user_stores: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						data_business_unit_id: z.unknown().optional(),
						tags: z.unknown().optional(),
					})
					.passthrough(),
				schedule: z
					.object({
						frequency: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY']),
						start_time: z.unknown(),
						timezone: z.unknown().optional(),
						days_to_run: z.unknown().optional(),
						day_of_month: z.unknown().optional(),
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
		path: z.object({ agentId: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_99ffa6002270Output = z.undefined();
const r_ed3ac2b880e3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ agents: z.unknown().optional() }).passthrough(),
	})
	.strict();
const r_ed3ac2b880e3Output = z.undefined();
const r_214735411dd4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ agents: z.unknown().optional() }).passthrough(),
	})
	.strict();
const r_214735411dd4Output = z.undefined();
const r_98ae93786afeInput = z
	.object({
		path: z.object({ agentId: z.unknown(), time: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_98ae93786afeOutput = z.undefined();
const r_b907984f070bInput = z
	.object({
		path: z.object({ agentId: z.unknown(), time: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b907984f070bOutput = z.undefined();
const r_1e4c8b4f1269Input = z
	.object({
		path: z.object({ agentId: z.unknown(), scanId: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_1e4c8b4f1269Output = z.undefined();
const r_73d4daf6bd17Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z
			.object({
				limit: z.unknown().optional(),
				offset: z.unknown().optional(),
				sort: z.unknown().optional(),
				searchParams: z
					.object({ skipped: z.unknown().optional() })
					.passthrough()
					.optional(),
				account_id: z.unknown(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_73d4daf6bd17Output = z.undefined();
const r_a4a835e15a4fInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z
			.object({
				category: z.enum(['CURRENT', 'PAST']).optional(),
				limit: z.unknown().optional(),
				offset: z.unknown().optional(),
				sort: z.unknown().optional(),
				status: z
					.enum(['COMPLETED', 'DELETED', 'FAILED', 'PARTIAL', 'SKIPPED'])
					.optional(),
				account_id: z.unknown(),
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
				limit: z.unknown().optional(),
				offset: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown(),
				search_query: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b1de500e018cOutput = z.undefined();
const r_b5bd22f27e1dInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b5bd22f27e1dOutput = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		status: z.unknown().optional(),
		status_details: z.unknown().optional(),
		version: z.unknown().optional(),
		account_id: z.unknown().optional(),
		business_unit: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		app_info: z
			.object({
				name: z.unknown().optional(),
				version: z.unknown().optional(),
				arch: z.unknown().optional(),
				flavor: z.unknown().optional(),
				automation_order: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		management_key: z.unknown().optional(),
		created_at: z.unknown().optional(),
		updated_at: z.unknown().optional(),
		inventories: z.unknown().optional(),
		os_name: z.unknown().optional(),
		os_version: z.unknown().optional(),
		agent_group: z.unknown().optional(),
		host_name: z.unknown().optional(),
		sni: z
			.object({
				is_enabled: z.unknown().optional(),
				items: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		error_message: z.unknown().optional(),
		auto_update_enabled: z.unknown().optional(),
		deployed_at: z.unknown().optional(),
		os_info: z.unknown().optional(),
		hb_interval: z.unknown().optional(),
		recipients: z.unknown().optional(),
		upgradable: z.unknown().optional(),
		post_install_service_restart: z.unknown().optional(),
		proxy_host: z.unknown().optional(),
		license_key: z.unknown().optional(),
	})
	.passthrough();
const r_308eb2d1df1cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				ids: z.unknown().optional(),
				location_preference: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_308eb2d1df1cOutput = z.undefined();
const r_920a440ee1dfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ ids: z.unknown().optional() }).passthrough().optional(),
	})
	.strict();
const r_920a440ee1dfOutput = z.undefined();
const r_0b702b08d456Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ ids: z.unknown().optional() }).passthrough().optional(),
	})
	.strict();
const r_0b702b08d456Output = z.undefined();
const r_5e7f03054b55Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				agent_group: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				hb_interval: z.unknown().optional(),
				id: z.unknown().optional(),
				inventories: z.unknown().optional(),
				name: z.unknown().optional(),
				recipients: z.unknown().optional(),
				sni: z
					.object({
						is_enabled: z.unknown().optional(),
						items: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				version: z.unknown().optional(),
				script_settings: z.unknown().optional(),
				post_install_service_restart: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5e7f03054b55Output = z.undefined();
const r_5c203004de20Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: z.unknown().optional(),
				inventory: z
					.object({
						acme_client_id: z.unknown().optional(),
						app_name: z.unknown().optional(),
						app_version: z.unknown().optional(),
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
						id: z.unknown().optional(),
						ip: z.unknown().optional(),
						port: z
							.object({ port: z.unknown().optional() })
							.passthrough()
							.optional(),
						script_args: z.unknown().optional(),
						script_path: z.unknown().optional(),
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
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				field: z.unknown().optional(),
				searchQuery: z.unknown().optional(),
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
				account_id: z.unknown(),
				operation_system: z.unknown().optional(),
				type: z.unknown().optional(),
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
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
				os: z.unknown().optional(),
				type: z.unknown().optional(),
				path: z.unknown().optional(),
				executionCommand: z.unknown().optional(),
				description: z.unknown().optional(),
				automationId: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_99797a8dc240Output = z.undefined();
const r_b4f767ee3a21Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b4f767ee3a21Output = z.undefined();
const r_92967c73d90eInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
				os: z.unknown().optional(),
				type: z.unknown().optional(),
				path: z.unknown().optional(),
				executionCommand: z.unknown().optional(),
				description: z.unknown().optional(),
				automationId: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_92967c73d90eOutput = z.undefined();
const r_28403eaf35f7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown().optional(),
	})
	.strict();
const r_28403eaf35f7Output = z.undefined();
const r_692763a58cdaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ ids: z.unknown().optional() }).passthrough().optional(),
	})
	.strict();
const r_692763a58cdaOutput = z.undefined();
const r_14cebde31ad8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ comment: z.unknown().optional(), ids: z.unknown().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_14cebde31ad8Output = z.undefined();
const r_6873b02914f1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ ids: z.unknown().optional() }).passthrough().optional(),
	})
	.strict();
const r_6873b02914f1Output = z.undefined();
const r_cd67d7ceb107Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ account_id: z.unknown(), default: z.unknown().optional() })
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd67d7ceb107Output = z.undefined();
const r_2b409ddd1947Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				linux_restricted_ports: z.unknown().optional(),
				manual_approval: z.unknown().optional(),
				scan_block_list: z.unknown().optional(),
				windows_restricted_ports: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2b409ddd1947Output = z.undefined();
const r_f8e988a67b87Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				linux_restricted_ports: z.unknown().optional(),
				manual_approval: z.unknown().optional(),
				scan_block_list: z.unknown().optional(),
				windows_restricted_ports: z.unknown().optional(),
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
				automation_id: z.unknown(),
				account_id: z.unknown(),
				action_type: z.enum([
					'ENROLL',
					'GET_NEXT_CERT',
					'REISSUE',
					'RENEW',
					'TRANSFER',
				]),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: z.unknown(),
						auto_renew_time: z
							.object({
								days: z.unknown().optional(),
								hours: z.unknown().optional(),
								minutes: z.unknown().optional(),
								time_format: z.unknown(),
								zone: z.unknown(),
							})
							.passthrough()
							.optional(),
						before_expiration: z.unknown(),
					})
					.passthrough()
					.optional(),
				cn: z.unknown(),
				custom_fields: z.unknown().optional(),
				dns_integration_id: z.unknown().optional(),
				profile_id: z.unknown(),
				redirect_port: z.unknown().optional(),
				run_now: z.unknown().optional(),
				sans: z.unknown().optional(),
				schedule_settings: z
					.object({
						hours: z.unknown().optional(),
						minutes: z.unknown().optional(),
						start_date: z.unknown(),
						time_format: z.unknown(),
						zone: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				match_wildcard_subdomain: z.unknown().optional(),
				custom_attributes_field: z.unknown().optional(),
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
				profile_id: z.unknown().optional(),
				cn: z.unknown().optional(),
				sans: z.unknown().optional(),
				account_id: z.unknown().optional(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: z.unknown(),
						auto_renew_time: z
							.object({
								days: z.unknown().optional(),
								hours: z.unknown().optional(),
								minutes: z.unknown().optional(),
								time_format: z.unknown(),
								zone: z.unknown(),
							})
							.passthrough()
							.optional(),
						before_expiration: z.unknown(),
					})
					.passthrough()
					.optional(),
				additional_order_options: z
					.object({
						comments_to_administrator: z.unknown().optional(),
						order_specific_renewal_message: z.unknown().optional(),
						additional_emails: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				cert_delivery_settings: z.unknown().optional(),
				tags: z.unknown().optional(),
				action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				inventory_id: z.unknown().optional(),
				source_certificate_id: z.unknown().optional(),
				custom_attributes_field: z.unknown().optional(),
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
				account_id: z.unknown().optional(),
				record_ids: z.unknown().optional(),
				awr_profile_id: z.unknown().optional(),
				sensor_profile_id: z.unknown().optional(),
				agent_profile_id: z.unknown().optional(),
				ca_name: z.unknown().optional(),
				bulk_action_type: z
					.object({
						primaryAction: z
							.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
							.optional(),
						renewalStartDate: z.unknown().optional(),
						secondaryActions: z.unknown().optional(),
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
				automation_ids: z.unknown(),
				account_id: z.unknown(),
				custom_fields: z.unknown().optional(),
				dns_integration_id: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				run_now: z.unknown().optional(),
				schedule_settings: z
					.object({
						hours: z.unknown().optional(),
						minutes: z.unknown().optional(),
						start_date: z.unknown(),
						time_format: z.unknown(),
						zone: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				awr_profile_id: z.unknown().optional(),
				sensor_profile_id: z.unknown().optional(),
				agent_profile_id: z.unknown().optional(),
				bulk_action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				bulk_automation_batch_name: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c0eb04e32216Output = z.undefined();
const r_710554dcec90Input = z
	.object({
		path: z.object({ automation_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_710554dcec90Output = z
	.object({
		id: z.unknown().optional(),
		automation_flow_details: z
			.object({
				auto_renew_enabled: z.unknown().optional(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: z.unknown(),
						auto_renew_time: z
							.object({
								days: z.unknown().optional(),
								hours: z.unknown().optional(),
								minutes: z.unknown().optional(),
								time_format: z.unknown(),
								zone: z.unknown(),
							})
							.passthrough()
							.optional(),
						before_expiration: z.unknown(),
					})
					.passthrough()
					.optional(),
				automation_error: z
					.object({
						error_code: z.unknown().optional(),
						error_message: z.unknown().optional(),
						solution: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				is_retry_applicable: z.unknown().optional(),
				last_initiated_time: z.unknown().optional(),
				last_run_time: z.unknown().optional(),
				next_run_time: z.unknown().optional(),
				organization: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				dns_integration: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				profile: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				schedule_settings: z
					.object({
						hours: z.unknown().optional(),
						minutes: z.unknown().optional(),
						start_date: z.unknown(),
						time_format: z.unknown(),
						zone: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				template: z
					.object({
						id: z.unknown().optional(),
						name: z.unknown().optional(),
						trust_type: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		automation_status: z
			.intersection(
				z.enum([
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
				]),
				z.unknown(),
			)
			.optional(),
		certificate_details: z
			.object({
				cert_validity: z.unknown().optional(),
				common_name: z.unknown().optional(),
				ip: z.unknown().optional(),
				key_algorithm: z.unknown().optional(),
				key_size: z.unknown().optional(),
				order_id: z.unknown().optional(),
				order_valid_till: z.unknown().optional(),
				port: z.unknown().optional(),
				previous_action_type: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				product_name: z.unknown().optional(),
				product_type: z.unknown().optional(),
				redirect_port: z.unknown().optional(),
				sans: z.unknown().optional(),
				serial_number: z.unknown().optional(),
				signature_hash: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const r_bcabad219d28Input = z
	.object({
		path: z.object({ automation_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: z.unknown(),
						auto_renew_time: z
							.object({
								days: z.unknown().optional(),
								hours: z.unknown().optional(),
								minutes: z.unknown().optional(),
								time_format: z.unknown(),
								zone: z.unknown(),
							})
							.passthrough()
							.optional(),
						before_expiration: z.unknown(),
					})
					.passthrough()
					.optional(),
				profile_id: z.unknown(),
				run_now: z.unknown().optional(),
				schedule_settings: z
					.object({
						hours: z.unknown().optional(),
						minutes: z.unknown().optional(),
						start_date: z.unknown(),
						time_format: z.unknown(),
						zone: z.unknown().optional(),
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
		path: z.object({ automation_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fdcddee44a8eOutput = z.undefined();
const r_f993fc71dd6cInput = z
	.object({
		path: z.object({ automation_id: z.unknown() }).strict(),
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown().optional(),
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
				device: z.unknown().optional(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				source: z.unknown().optional(),
				system_name: z.unknown().optional(),
				tags: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_948c3283fb77Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_ef7eddd600a0Input = z
	.object({
		path: z.object({ automation_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ef7eddd600a0Output = z
	.object({
		id: z.unknown().optional(),
		automation: z
			.intersection(
				z.intersection(
					z.unknown(),
					z
						.object({
							id: z.unknown().optional(),
							ip: z.unknown().optional(),
							port: z.unknown().optional(),
							system_name: z.unknown().optional(),
							application: z.unknown().optional(),
							device: z.unknown().optional(),
							profile: z
								.object({
									id: z.unknown().optional(),
									name: z.unknown().optional(),
								})
								.passthrough()
								.optional(),
							is_auto_renew: z.unknown().optional(),
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
									renewalStartDate: z.unknown().optional(),
									secondaryActions: z.unknown().optional(),
								})
								.passthrough()
								.optional(),
						})
						.passthrough(),
				),
				z
					.object({
						os_name: z.unknown().optional(),
						os_version: z.unknown().optional(),
						app_info: z
							.object({
								name: z.unknown().optional(),
								version: z.unknown().optional(),
								arch: z.unknown().optional(),
								flavor: z.unknown().optional(),
								automation_order: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						category: z
							.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
							.optional(),
						first_discovered: z.unknown().optional(),
						last_discovered: z.unknown().optional(),
						last_initiated_time: z.unknown().optional(),
						last_run: z.unknown().optional(),
						next_run: z.unknown().optional(),
						common_name: z.unknown().optional(),
						domain_name: z.unknown().optional(),
						source: z.unknown().optional(),
						custom_fields: z.unknown().optional(),
						tags: z.unknown().optional(),
					})
					.passthrough(),
			)
			.optional(),
		certificate: z
			.intersection(
				z.unknown(),
				z
					.object({
						id: z.unknown().optional(),
						inventory_id: z.unknown().optional(),
						ip: z.unknown().optional(),
						port: z.unknown().optional(),
						application: z.unknown().optional(),
						system_name: z.unknown().optional(),
						attributes: z.unknown().optional(),
						auto_renew_status: z.unknown().optional(),
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
								renewalStartDate: z.unknown().optional(),
								secondaryActions: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						automation_status: z
							.intersection(
								z.enum([
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
								]),
								z.unknown(),
							)
							.optional(),
						business_unit: z
							.object({ id: z.unknown(), name: z.unknown().optional() })
							.passthrough()
							.optional(),
						ca_cert_id: z.unknown().optional(),
						cc_settings: z
							.object({
								auto_renew_settings: z
									.object({
										auto_renew_certificate_and_order: z.unknown(),
										auto_renew_time: z
											.object({
												days: z.unknown().optional(),
												hours: z.unknown().optional(),
												minutes: z.unknown().optional(),
												time_format: z.unknown(),
												zone: z.unknown(),
											})
											.passthrough()
											.optional(),
										before_expiration: z.unknown(),
									})
									.passthrough()
									.optional(),
								contacts: z.unknown().optional(),
								http_signed_exchange: z.unknown().optional(),
								key_sizes: z.unknown().optional(),
								account_id: z.unknown().optional(),
								is_custom_validity: z.unknown().optional(),
								duplicate_minimum_validity_days: z
									.unknown()
									.nullable()
									.optional(),
								key_type: z.unknown().optional(),
								order_coverage_length: z.unknown().optional(),
								override_validity: z.unknown().optional(),
								organization: z
									.object({
										id: z.unknown().optional(),
										name: z.unknown().optional(),
										value: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								organization_contact: z
									.object({
										id: z.unknown(),
										name: z.unknown(),
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
										id: z.unknown().optional(),
										name: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								container: z
									.object({
										id: z.unknown().optional(),
										name: z.unknown().optional(),
										value: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								region: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						common_name: z.unknown().optional(),
						dual_approval_status: z
							.object({
								admins_approved: z.unknown().optional(),
								dual_approve_enabled: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						enrollment: z.unknown().optional(),
						escrow: z.unknown().optional(),
						external_ca_name: z.unknown().optional(),
						ica: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						key_length: z.unknown().optional(),
						key_type: z.unknown().optional(),
						managing_integration: z.unknown().optional(),
						notes: z.unknown().optional(),
						order_id: z.unknown().optional(),
						organization_name: z.unknown().optional(),
						organization_unit: z.unknown().optional(),
						organization_identifier: z.unknown().optional(),
						profile: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
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
								id: z.unknown().optional(),
								active: z.unknown().optional(),
								business_unit: z
									.object({ id: z.unknown(), name: z.unknown().optional() })
									.passthrough()
									.optional(),
								created_at: z.unknown().optional(),
								email: z.unknown().optional(),
								number_of_pending: z.unknown().optional(),
								phone: z.unknown().optional(),
								seat_allowed_for_enrollment: z.unknown().optional(),
								seat_id: z.unknown().optional(),
								seat_name: z.unknown().optional(),
								seat_type: z
									.object({
										id: z.unknown().optional(),
										name: z
											.intersection(
												z.intersection(
													z.enum([
														'USER_SEAT',
														'DISCOVERY_SEAT',
														'SERVER_SEAT',
														'DEVICE_SEAT',
														'IMPORTED_SEAT',
														'ORGANIZATION_SEAT',
														'CERTIFICATE_MANAGEMENT_SEAT',
													]),
													z.unknown(),
												),
												z.unknown(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						serial_number: z.unknown().optional(),
						status: z
							.enum(['deleted', 'expired', 'issued', 'revoked', 'suspended'])
							.optional(),
						subject_email: z.unknown().optional(),
						valid_from: z.unknown().optional(),
						valid_to: z.unknown().optional(),
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
				account_id: z.unknown().optional(),
				name: z.unknown().optional(),
				created_at_from: z.unknown().optional(),
				created_at_to: z.unknown().optional(),
				active: z.unknown().optional(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_382f226cdcf4Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_5bec67c21dcfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.unknown(),
				account: z.object({ id: z.unknown() }).passthrough(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_5bec67c21dcfOutput = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		active: z.unknown().optional(),
		created_at: z.unknown().optional(),
		account: z.object({ id: z.unknown() }).passthrough().optional(),
	})
	.passthrough();
const r_162c051d7b24Input = z
	.object({
		path: z.object({ bu_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_162c051d7b24Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		active: z.unknown().optional(),
		created_at: z.unknown().optional(),
		account: z
			.object({ id: z.unknown().optional(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		admins: z.unknown().optional(),
		available_seats_stats: z.unknown().optional(),
	})
	.passthrough();
const r_38929d3c5c45Input = z
	.object({
		path: z.object({ bu_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38929d3c5c45Output = z.undefined();
const r_e130670d7f5aInput = z
	.object({
		path: z.object({ bu_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown().optional(),
	})
	.strict();
const r_e130670d7f5aOutput = z.unknown();
const r_59f4fecff54aInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ id: z.unknown() }).passthrough(),
	})
	.strict();
const r_59f4fecff54aOutput = z.unknown();
const r_78c077df3817Input = z
	.object({
		path: z.object({ id: z.unknown(), adminId: z.unknown() }).strict(),
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown(),
				first_name: z.unknown().optional(),
				last_name: z.unknown().optional(),
				email: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_23c269effbe6Output = z
	.object({ total: z.unknown().optional(), items: z.unknown().optional() })
	.passthrough();
const r_e254ce295d12Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				certificate_owner: z
					.object({
						first_name: z.unknown().optional(),
						last_name: z.unknown().optional(),
						email: z.unknown(),
						custom_identifier: z.unknown().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_e254ce295d12Output = z
	.object({
		id: z.unknown().optional(),
		first_name: z.unknown().optional(),
		last_name: z.unknown().optional(),
		email: z.unknown().optional(),
		account_id: z.unknown().optional(),
		custom_identifier: z.unknown().optional(),
	})
	.passthrough();
const r_589d79d3192eInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_589d79d3192eOutput = z
	.object({
		id: z.unknown().optional(),
		first_name: z.unknown().optional(),
		last_name: z.unknown().optional(),
		email: z.unknown().optional(),
		account_id: z.unknown().optional(),
		custom_identifier: z.unknown().optional(),
	})
	.passthrough();
const r_c0711fd42515Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				certificate_owner: z
					.object({
						first_name: z.unknown().optional(),
						last_name: z.unknown().optional(),
						email: z.unknown(),
						custom_identifier: z.unknown().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_c0711fd42515Output = z
	.object({
		id: z.unknown().optional(),
		first_name: z.unknown().optional(),
		last_name: z.unknown().optional(),
		email: z.unknown().optional(),
		account_id: z.unknown().optional(),
		custom_identifier: z.unknown().optional(),
	})
	.passthrough();
const r_9f6fcd99fd97Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9f6fcd99fd97Output = z
	.object({
		status: z.unknown().optional(),
		affected_profiles: z.unknown().optional(),
	})
	.passthrough();
const r_08c5118e8629Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ account_id: z.unknown(), certificate_owner_ids: z.unknown() })
			.passthrough(),
	})
	.strict();
const r_08c5118e8629Output = z.undefined();
const r_a4a3093d5297Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ account_id: z.unknown(), certificate_owner_ids: z.unknown() })
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
							.object({ id: z.unknown().optional() })
							.passthrough()
							.optional(),
						seat: z
							.object({
								seat_id: z.unknown().optional(),
								email: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						csr: z.unknown().optional(),
						validity: z
							.object({
								unit: z
									.enum(['years', 'months', 'days', 'hours', 'minutes'])
									.optional(),
								duration: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						delivery_format: z
							.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
							.optional(),
						include_ca_chain: z.unknown().optional(),
						attributes: z
							.object({
								subject: z
									.object({
										common_name: z.unknown().optional(),
										organization_name: z.unknown().optional(),
										organization_units: z.unknown().optional(),
										description: z.unknown().optional(),
										serial_number: z.unknown().optional(),
										pseudonym: z.unknown().optional(),
										unique_identifier: z.unknown().optional(),
										user_identifier: z.unknown().optional(),
										domain_component: z.unknown().optional(),
										dn_qualifier: z.unknown().optional(),
										unstructured_name: z.unknown().optional(),
										unstructured_address: z.unknown().optional(),
										street_address: z.unknown().optional(),
										locality: z.unknown().optional(),
										state: z.unknown().optional(),
										postal_code: z.unknown().optional(),
										country: z.unknown().optional(),
										email: z.unknown().optional(),
										title: z.unknown().optional(),
										given_name: z.unknown().optional(),
										surname: z.unknown().optional(),
										organization_identifier: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								extensions: z
									.object({
										san: z
											.object({
												dns_names: z.unknown().optional(),
												emails: z.unknown().optional(),
												ip_addresses: z.unknown().optional(),
												other_names: z
													.object({
														guid: z.unknown().optional(),
														raw_other_names: z.unknown().optional(),
													})
													.passthrough()
													.optional(),
												registered_ids: z.unknown().optional(),
												directory_name: z.unknown().optional(),
												uris: z.unknown().optional(),
												user_principal_names: z.unknown().optional(),
											})
											.passthrough()
											.optional(),
										issuer_alt_name: z
											.object({
												directory_name: z
													.object({
														value: z.unknown().optional(),
														critical: z.unknown().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										security_identifier: z
											.object({ additional_values: z.unknown().optional() })
											.passthrough()
											.optional(),
										lei: z
											.object({
												value: z.unknown().optional(),
												critical: z.unknown().optional(),
											})
											.passthrough()
											.optional(),
										lei_role: z
											.object({
												value: z.unknown().optional(),
												critical: z.unknown().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								custom_values: z.unknown().optional(),
								tnc_accepted: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						tags: z.unknown().optional(),
						cert_owner_ids: z.unknown().optional(),
						ca_attributes: z
							.object({
								schema: z
									.object({
										ct_log_option: z.unknown().optional(),
										dcv_method: z
											.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
											.optional(),
										renewal_of_order_id: z.unknown().optional(),
										skip_domain_validation: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						custom_attributes: z.unknown().optional(),
					})
					.passthrough(),
				z
					.object({
						profile: z
							.object({ id: z.unknown().optional() })
							.passthrough()
							.optional(),
						seat: z
							.object({
								seat_id: z.unknown().optional(),
								email: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						csr: z.unknown().optional(),
						validity: z
							.object({
								unit: z
									.enum(['years', 'months', 'days', 'hours', 'minutes'])
									.optional(),
								duration: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						delivery_format: z
							.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
							.optional(),
						include_ca_chain: z.unknown().optional(),
						attributes: z
							.object({
								subject: z
									.object({
										pseudonym: z.unknown().optional(),
										title: z.unknown().optional(),
										given_name: z.unknown().optional(),
										surname: z.unknown().optional(),
										UserPrincipalName: z.unknown().optional(),
										email: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								extensions: z
									.object({
										san: z
											.object({ emails: z.unknown().optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								custom_values: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						tags: z.unknown().optional(),
					})
					.passthrough(),
			])
			.optional(),
	})
	.strict();
const r_4ea70ee9ce09Output = z
	.object({
		serial_number: z.unknown().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: z.unknown().optional(),
		pkcs12_password: z.unknown().optional(),
		request_id: z.unknown().optional(),
		dv_details: z
			.object({
				schema: z
					.object({
						dcv_method: z
							.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
							.optional(),
						dcv_random_value: z.unknown().optional(),
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
		path: z.object({ request_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: z
					.object({ id: z.unknown().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_aba4f70417deOutput = z
	.object({
		serial_number: z.unknown().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: z.unknown().optional(),
		status: z.enum(['ISSUED', 'PENDING', 'REJECTED']).optional(),
	})
	.passthrough();
const r_ef37eb3829e2Input = z
	.object({
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z
			.object({ thumbprint_sha256: z.unknown().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ef37eb3829e2Output = z.undefined();
const r_b8f4fd999e91Input = z
	.object({
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z
			.object({
				thumbprint_sha256: z.unknown().optional(),
				account_id: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				csr: z.unknown().optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				delivery_format: z
					.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
					.optional(),
				include_ca_chain: z.unknown().optional(),
				renewal_comment: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_b8f4fd999e91Output = z
	.object({
		agent_id: z.unknown().optional(),
		application: z.unknown().optional(),
		attributes: z.unknown().optional(),
		auth_fields: z.unknown().optional(),
		auto_renew_status: z.unknown().optional(),
		automation_action: z
			.object({
				primaryAction: z
					.enum(['ENROLL', 'GET_NEXT_CERT', 'REISSUE', 'RENEW', 'TRANSFER'])
					.optional(),
				renewalStartDate: z.unknown().optional(),
				secondaryActions: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		automation_status: z.unknown().optional(),
		business_unit: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		ca_cert_id: z.unknown().optional(),
		cc_settings: z
			.object({
				auto_renew_settings: z
					.object({
						auto_renew_certificate_and_order: z.unknown(),
						auto_renew_time: z
							.object({
								days: z.unknown().optional(),
								hours: z.unknown().optional(),
								minutes: z.unknown().optional(),
								time_format: z.unknown(),
								zone: z.unknown(),
							})
							.passthrough()
							.optional(),
						before_expiration: z.unknown(),
					})
					.passthrough()
					.optional(),
				contacts: z.unknown().optional(),
				ct_log_option: z.unknown().optional(),
				ct_log_value: z.unknown().optional(),
				http_signed_exchange: z.unknown().optional(),
				key_size: z.unknown().optional(),
				key_type: z.unknown().optional(),
				order_coverage_length: z
					.object({
						chronology: z
							.object({
								calendarType: z.unknown().optional(),
								id: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						days: z.unknown().optional(),
						months: z.unknown().optional(),
						negative: z.unknown().optional(),
						units: z.unknown().optional(),
						years: z.unknown().optional(),
						zero: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				override_validity: z.unknown().optional(),
				organization: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
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
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		common_name: z.unknown().optional(),
		days_till_renewal: z.unknown().optional(),
		dual_approval_status: z
			.object({
				admins_approved: z.unknown().optional(),
				dual_approve_enabled: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		enrollment: z.object({ id: z.unknown() }).passthrough().optional(),
		escrow: z.unknown().optional(),
		external_ca_name: z.unknown().optional(),
		ica: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		id: z.unknown(),
		inventory_id: z.unknown().optional(),
		ip: z.unknown().optional(),
		key_length: z.unknown().optional(),
		key_type: z.unknown().optional(),
		key_usage: z.unknown().optional(),
		managing_integration: z.unknown().optional(),
		notes: z.unknown().optional(),
		order_id: z.unknown().optional(),
		organization_name: z.unknown().optional(),
		organization_unit: z.unknown().optional(),
		port: z.unknown().optional(),
		private_key_algorithm: z.unknown().optional(),
		product_type: z.unknown().optional(),
		profile: z
			.object({
				authentication_method: z.unknown().optional(),
				enrollment_method: z.unknown().optional(),
				id: z.unknown(),
				name: z.unknown().optional(),
				status: z.enum(['action_needed', 'active', 'suspended']).optional(),
				trust_type: z.enum(['private', 'public']).optional(),
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
		root_ca_name: z.unknown().optional(),
		seat: z
			.object({
				active: z.unknown().optional(),
				business_unit: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				created_at: z.unknown().optional(),
				email: z.unknown().optional(),
				id: z.unknown().optional(),
				number_of_pending: z.unknown().optional(),
				phone: z.unknown().optional(),
				seat_allowed_for_enrollment: z.unknown().optional(),
				seat_id: z.unknown().optional(),
				seat_name: z.unknown().optional(),
				seat_type: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				seat_creation_date: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: z.unknown().optional(),
		signing_algorithm: z.unknown().optional(),
		source: z.unknown().optional(),
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
				common_name: z.unknown().optional(),
				country: z.unknown().optional(),
				locality: z.unknown().optional(),
				organization_name: z.unknown().optional(),
				organization_units: z.unknown().optional(),
				postal_code: z.unknown().optional(),
				state: z.unknown().optional(),
				street_address: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		subject_email: z.unknown().optional(),
		system_name: z.unknown().optional(),
		tags: z.unknown().optional(),
		thumbprint: z.unknown().optional(),
		valid_from: z.unknown().optional(),
		valid_to: z.unknown().optional(),
		automation_instance_count: z.unknown().optional(),
		discovery_instance_count: z.unknown().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: z.unknown().optional(),
		pkcs12_password: z.unknown().optional(),
		account_id: z.unknown().optional(),
		revocation_date: z.unknown().optional(),
		san_email: z.unknown().optional(),
		thumbprint_sha1: z.unknown().optional(),
		cert_arn: z.unknown().optional(),
		azure_cert_id: z.unknown().optional(),
		gcp_metadata: z.unknown().optional(),
		recovery_comment: z.unknown().optional(),
		cert_issues: z.unknown().optional(),
		cert_security_rating: z.unknown().optional(),
		security_rating_info: z
			.object({
				security_rating: z.unknown().optional(),
				handshake_protocols: z
					.object({
						cipher_algorithm: z.unknown().optional(),
						key_size: z.unknown().optional(),
						protocol: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				security_headers: z.unknown().optional(),
				http_response_headers: z.unknown().optional(),
				certificate_chain: z
					.object({
						cert_chain_details: z.unknown().optional(),
						no_of_cert_chain_found: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				security_rating_score: z.unknown().optional(),
				certificate_chain_score: z.unknown().optional(),
				handshake_protocols_score: z.unknown().optional(),
				security_headers_score: z.unknown().optional(),
				http_response_headers_score: z.unknown().optional(),
				protocol_ciphers: z.unknown().optional(),
				protocol_ciphers_score: z
					.object({
						protocols: z.unknown().optional(),
						score: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		server_id: z.unknown().optional(),
		server_id_type: z.unknown().optional(),
		first_discovered_date: z.unknown().optional(),
		last_discovered_date: z.unknown().optional(),
		application_version: z.unknown().optional(),
		os_name: z.unknown().optional(),
		os_version: z.unknown().optional(),
		ca_vendor: z.unknown().optional(),
		renewed_cert_id: z.unknown().optional(),
		expires_in_days: z.unknown().optional(),
		connector_tags: z.unknown().optional(),
		parent_id: z.unknown().optional(),
		has_warning: z.unknown().optional(),
		quantum_safe: z.unknown().optional(),
		related_connector: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		vault_connector: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		vault_uri: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		managing_ca: z.unknown().optional(),
		escrow_client_key_id: z.unknown().optional(),
		cc_account_id: z.unknown().optional(),
		cc_container_id: z.unknown().optional(),
		security_identifier: z.unknown().optional(),
		ian_string: z.unknown().optional(),
		aws_acm: z.unknown().optional(),
		connector_provider: z.unknown().optional(),
		extended_key_usage: z.unknown().optional(),
		file_path: z.unknown().optional(),
		file_name: z.unknown().optional(),
		file_type: z.unknown().optional(),
		system_scan_cert_id: z.unknown().optional(),
		intune_deployment_details: z.unknown().optional(),
		found_in_archive: z.unknown().optional(),
		msca_template_name: z.unknown().optional(),
		cert_delivery_details: z.unknown().optional(),
		dcone_user_id: z.unknown().optional(),
		dcone_user_email: z.unknown().optional(),
		bulk_job_name: z.unknown().optional(),
		bulk_operation_job_id: z.unknown().optional(),
		bulk_operation_job_name: z.unknown().optional(),
		vs_partition: z.unknown().optional(),
		vs_alias: z.unknown().optional(),
		domain_name: z.unknown().optional(),
		host_name: z.unknown().optional(),
		renewal_window: z.unknown().optional(),
		custom_attributes: z.unknown().optional(),
		cert_owners: z.unknown().optional(),
		protocols: z.unknown().optional(),
		smime_cert_profile_type: z.unknown().optional(),
	})
	.passthrough();
const r_c6787b39d482Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_ids: z.unknown().optional(),
				tags: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c6787b39d482Output = z.undefined();
const r_15baf5205f5fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate_ids: z.unknown().optional(),
				tags: z.unknown().optional(),
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
			.object({ trap_seat_duplicate_error: z.unknown().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown().optional(),
	})
	.strict();
const r_795aa866d75eOutput = z.unknown();
const r_cd0ce04fc2f9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				business_unit_name: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				seat_id: z.unknown().optional(),
				seat_type_id: z.unknown().optional(),
				serial_number: z.unknown().optional(),
				valid_from: z.unknown().optional(),
				valid_to: z.unknown().optional(),
				common_name: z.unknown().optional(),
				aki: z.unknown().optional(),
				issuing_ca_id: z.unknown().optional(),
				issuing_ca_name: z.unknown().optional(),
				issuing_ca_serial_number: z.unknown().optional(),
				status: z.unknown().optional(),
				thumbprint: z.unknown().optional(),
				enrollment_id: z.unknown().optional(),
				custom_attributes: z.unknown().optional(),
				cert_owners: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd0ce04fc2f9Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z
		.object({ has_more: z.unknown().optional(), items: z.unknown().optional() })
		.passthrough(),
);
const r_47b5ee161d58Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				status: z
					.enum(['issued', 'revoked', 'expired', 'suspended'])
					.optional(),
				issuer_type: z.enum(['private_ca']).optional(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_47b5ee161d58Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z
		.object({ has_more: z.unknown().optional(), items: z.unknown().optional() })
		.passthrough(),
);
const r_cb5f6a5e8c6eInput = z
	.object({
		path: z.object({ certificate_id: z.unknown() }).strict(),
		query: z
			.object({
				ip: z.unknown().optional(),
				survey_id: z.unknown().optional(),
				port: z.unknown().optional(),
				server_id: z.unknown().optional(),
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
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z
			.object({
				thumbprint_sha256: z.unknown().optional(),
				account_id: z.unknown().optional(),
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
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		seat: z
			.object({ seat_id: z.unknown().optional() })
			.passthrough()
			.optional(),
		seat_type: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		business_unit: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		account: z.object({ id: z.unknown() }).passthrough().optional(),
		certificate: z.unknown().optional(),
		ica: z.object({ id: z.unknown() }).passthrough().optional(),
		common_name: z.unknown().optional(),
		status: z.enum(['issued', 'revoked', 'expired', 'suspended']).optional(),
		serial_number: z.unknown().optional(),
		thumbprint: z.unknown().optional(),
		valid_from: z.unknown().optional(),
		valid_to: z.unknown().optional(),
		notes: z.unknown().optional(),
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
				revocation_date: z.unknown().optional(),
				comments: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		ca_response_attributes: z
			.object({
				schema: z
					.object({ order_id: z.unknown().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		template_name: z.unknown().optional(),
		issuing_ca_name: z.unknown().optional(),
		key_size: z.unknown().optional(),
		signature_algorithm: z.unknown().optional(),
		subject: z
			.object({
				common_name: z.unknown().optional(),
				organization_name: z.unknown().optional(),
				organization_units: z.unknown().optional(),
				description: z.unknown().optional(),
				serial_number: z.unknown().optional(),
				pseudonym: z.unknown().optional(),
				unique_identifier: z.unknown().optional(),
				user_identifier: z.unknown().optional(),
				domain_component: z.unknown().optional(),
				dn_qualifier: z.unknown().optional(),
				unstructured_name: z.unknown().optional(),
				unstructured_address: z.unknown().optional(),
				street_address: z.unknown().optional(),
				locality: z.unknown().optional(),
				state: z.unknown().optional(),
				postal_code: z.unknown().optional(),
				country: z.unknown().optional(),
				email: z.unknown().optional(),
				title: z.unknown().optional(),
				given_name: z.unknown().optional(),
				surname: z.unknown().optional(),
				organization_identifier: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		cert_security_rating: z.unknown().optional(),
		security_rating_info: z
			.object({
				security_rating: z.unknown().optional(),
				handshake_protocols: z
					.object({
						cipher_algorithm: z.unknown().optional(),
						key_size: z.unknown().optional(),
						protocol: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				security_headers: z.unknown().optional(),
				http_response_headers: z.unknown().optional(),
				certificate_chain: z
					.object({
						cert_chain_details: z.unknown().optional(),
						no_of_cert_chain_found: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				security_rating_score: z.unknown().optional(),
				certificate_chain_score: z.unknown().optional(),
				handshake_protocols_score: z.unknown().optional(),
				security_headers_score: z.unknown().optional(),
				http_response_headers_score: z.unknown().optional(),
				protocol_ciphers: z.unknown().optional(),
				protocol_ciphers_score: z
					.object({
						protocols: z.unknown().optional(),
						score: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		file_path: z.unknown().optional(),
		file_name: z.unknown().optional(),
		file_type: z.unknown().optional(),
		ip: z.unknown().optional(),
		port: z.unknown().optional(),
		net_scan_domain_name: z.unknown().optional(),
		application: z.unknown().optional(),
		automation_status: z.unknown().optional(),
		ca_vendor: z.unknown().optional(),
		connector: z.unknown().optional(),
		dcone_user_id: z.unknown().optional(),
		enrollment_method: z.unknown().optional(),
		system_name: z.unknown().optional(),
		source: z.unknown().optional(),
		scan_name: z.unknown().optional(),
		expires_in_days: z.unknown().optional(),
		instance_count: z.unknown().optional(),
		extended_key_usage: z.unknown().optional(),
		msca_template_name: z.unknown().optional(),
		escrow: z.unknown().optional(),
		attributes: z.unknown().optional(),
	})
	.passthrough();
const r_b85de13db956Input = z
	.object({
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z
			.object({ thumbprint_sha256: z.unknown().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b85de13db956Output = z
	.object({
		delivery_format: z.enum(['pkcs12']).optional(),
		certificate: z.unknown().optional(),
		pkcs12_password: z.unknown().optional(),
	})
	.passthrough();
const r_d7ae6dc4292dInput = z
	.object({
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z
			.object({
				thumbprint_sha256: z.unknown().optional(),
				account_id: z.unknown().optional(),
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
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_32308d9d0956Output = z.undefined();
const r_e81b68e657ccInput = z
	.object({
		path: z.object({ serial_number: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e81b68e657ccOutput = z
	.object({
		pkcs7: z.unknown().optional(),
		x509_cert_chain: z.unknown().optional(),
	})
	.passthrough();
const r_00aaa42b68c2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown().optional(),
				exclude_certificate_status: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_00aaa42b68c2Output = z
	.object({ total_count: z.unknown().optional() })
	.passthrough();
const r_a09ad9571231Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown().optional(),
				exclude_certificate_status: z.unknown().optional(),
				cursor: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a09ad9571231Output = z
	.object({
		batch_size: z.unknown().optional(),
		cursor: z.unknown().nullable().optional(),
		items: z.unknown().optional(),
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
						name: z.unknown(),
						business_unit_id: z.unknown(),
						account_id: z.unknown(),
						preset_id: z.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4']),
						tags: z.unknown().optional(),
						username: z.unknown(),
						password: z.unknown(),
						api_key: z.unknown(),
						credentials: z.unknown().optional(),
						region: z.enum(['US', 'EU']),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years: z
									.unknown()
									.optional(),
								all_expired_certificates_within: z.unknown().optional(),
								all_revoked_certificates_that_are_valid: z.unknown().optional(),
								business_unit_id: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								cc_division_bu_mapping: z.unknown().optional(),
								import_all_data: z.unknown().optional(),
								business_unit_name: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				z
					.object({
						account_id: z.unknown(),
						business_unit_id: z.unknown().optional(),
						name: z.unknown(),
						preset_id: z.enum(['a7f721aa-4796-4815-9128-6796fedbb917']),
						username: z.unknown(),
						password: z.unknown(),
						url: z.unknown(),
					})
					.passthrough(),
				z
					.object({
						account_id: z.unknown(),
						business_unit_id: z.unknown(),
						name: z.unknown(),
						preset_id: z.unknown(),
						core_attributes: z.unknown(),
						config_attributes: z.unknown(),
						additional_attributes: z
							.object({
								all_valid_certificates_from_last_4_years: z
									.unknown()
									.optional(),
								all_expired_certificates_within: z.unknown().optional(),
								all_revoked_certificates_that_are_valid: z.unknown().optional(),
								business_unit_id: z.unknown().optional(),
								s3_bucket_name: z.unknown().optional(),
								is_new_s3_bucket_required: z.unknown().optional(),
								last_fetched_time: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
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
				account_id: z.unknown(),
				limit: z.unknown().optional(),
				offset: z.unknown().optional(),
				sort: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.unknown().optional(),
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
				last_completed_at: z.unknown().optional(),
				next_update: z.unknown().optional(),
				business_unit_name: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_c4f2ebc60dafOutput = z.undefined();
const r_cac1d643fd7dInput = z
	.object({
		path: z.object({ field: z.enum(['provider', 'type']) }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cac1d643fd7dOutput = z.undefined();
const r_9fdfa9ff199aInput = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z
			.object({ account_id: z.unknown(), template_id: z.unknown().optional() })
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9fdfa9ff199aOutput = z.undefined();
const r_6ae814861232Input = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.union([
				z
					.object({
						name: z.unknown().optional(),
						preset_id: z
							.enum(['1c389430-7885-4eb3-82e9-96fec17de7a6'])
							.optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						aws_account_id: z.unknown().optional(),
						aws_region: z.unknown().optional(),
						authentication_method: z.unknown().optional(),
						aws_access_key_id: z.unknown().optional(),
						aws_secret_key: z.unknown().optional(),
						profile_name: z.unknown().optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years: z
									.unknown()
									.optional(),
								all_expired_certificates_within: z.unknown().optional(),
								all_revoked_certificates_that_are_valid: z.unknown().optional(),
								business_unit_id: z.unknown().optional(),
								s3_bucket_name: z.unknown().optional(),
								is_new_s3_bucket_required: z.unknown().optional(),
								last_fetched_time: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
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
						name: z.unknown().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						api_key: z.unknown().optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						username: z.unknown().optional(),
						password: z.unknown().optional(),
						credentials: z.unknown().optional(),
						region: z.enum(['US', 'EU']).optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years: z
									.unknown()
									.optional(),
								all_expired_certificates_within: z.unknown().optional(),
								all_revoked_certificates_that_are_valid: z.unknown().optional(),
								business_unit_id: z.unknown().optional(),
								s3_bucket_name: z.unknown().optional(),
								is_new_s3_bucket_required: z.unknown().optional(),
								last_fetched_time: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
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
						name: z.unknown().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						username: z.unknown().optional(),
						password: z.unknown().optional(),
						additional_properties: z.unknown().optional(),
						import_attributes: z
							.object({
								all_valid_certificates_from_last_4_years: z
									.unknown()
									.optional(),
								all_expired_certificates_within: z.unknown().optional(),
								all_revoked_certificates_that_are_valid: z.unknown().optional(),
								business_unit_id: z.unknown().optional(),
								s3_bucket_name: z.unknown().optional(),
								is_new_s3_bucket_required: z.unknown().optional(),
								last_fetched_time: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
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
						name: z.unknown().optional(),
						preset_id: z
							.enum(['36cbd4c2-f6e7-4a35-a4e6-e03ebf939cb4'])
							.optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						username: z.unknown().optional(),
						password: z.unknown().optional(),
						import_attributes: z
							.object({
								import: z
									.object({
										certificates: z.unknown().optional(),
										unsecured_ips_ports: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								include_data: z
									.object({
										ciphers: z.unknown().optional(),
										security_ratings: z.unknown().optional(),
										vulnerabilities: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
								business_unit_id: z.unknown().optional(),
								tags: z.unknown().optional(),
								schedule_frequency: z
									.object({
										units: z.enum(['HOURS', 'MINUTES', 'WEEKS']).optional(),
										value: z.unknown().optional(),
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
						name: z.unknown().optional(),
						preset_id: z
							.enum(['1c389430-7885-4eb3-82e9-96fec17de7a6'])
							.optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						username: z.unknown().optional(),
						password: z.unknown().optional(),
						url: z.unknown().optional(),
					})
					.passthrough(),
				z
					.object({
						name: z.unknown().optional(),
						preset_id: z.unknown().optional(),
						api_key: z.unknown().optional(),
						sensor_id: z.unknown().optional(),
						tags: z.unknown().optional(),
						business_unit_id: z.unknown().optional(),
						core_attributes: z.unknown().optional(),
						config_attributes: z.unknown().optional(),
						additional_attributes: z.unknown().optional(),
					})
					.passthrough(),
			])
			.optional(),
	})
	.strict();
const r_6ae814861232Output = z.undefined();
const r_ddbe3acdfffaInput = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ddbe3acdfffaOutput = z.undefined();
const r_cd2034a0a43dInput = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cd2034a0a43dOutput = z.undefined();
const r_e97c7e325ac0Input = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e97c7e325ac0Output = z.undefined();
const r_3ae1daaeb731Input = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_3ae1daaeb731Output = z.undefined();
const r_c594c0e3a8d1Input = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c594c0e3a8d1Output = z.undefined();
const r_2b39cff6b19aInput = z
	.object({
		path: z.object({ connector_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
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
				account_id: z.unknown(),
				name: z.unknown().optional(),
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
	.object({ total: z.unknown().optional(), items: z.unknown().optional() })
	.passthrough();
const r_0d465a62c1baInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				custom_attribute: z
					.object({
						name: z.unknown(),
						type: z.enum([
							'TEXT_FIELD',
							'DROP_DOWN_LIST',
							'GROUPED_DROP_DOWN',
							'FIXED_VALUE',
						]),
						items: z.unknown().optional(),
						required: z.unknown().optional(),
						default_value: z.unknown().optional(),
						multi_select: z.unknown().optional(),
						grouped_items: z.unknown().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_0d465a62c1baOutput = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		type: z.unknown().optional(),
		items: z.unknown().optional(),
		required: z.unknown().optional(),
		default_value: z.unknown().optional(),
		multi_select: z.unknown().optional(),
		grouped_items: z.unknown().optional(),
	})
	.passthrough();
const r_ffd3d18f94d9Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ffd3d18f94d9Output = z.unknown();
const r_9c0ee24ba5a8Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				custom_attributes_request: z.unknown(),
			})
			.passthrough(),
	})
	.strict();
const r_9c0ee24ba5a8Output = z.undefined();
const r_7593ade75363Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ account_id: z.unknown(), custom_attribute_ids: z.unknown() })
			.passthrough(),
	})
	.strict();
const r_7593ade75363Output = z.undefined();
const r_38b65a4ff043Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38b65a4ff043Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		type: z.unknown().optional(),
		items: z.unknown().optional(),
		required: z.unknown().optional(),
		default_value: z.unknown().optional(),
		multi_select: z.unknown().optional(),
		grouped_items: z.unknown().optional(),
	})
	.passthrough();
const r_aa2372f83a2eInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				custom_attribute: z
					.object({
						name: z.unknown(),
						type: z.enum([
							'TEXT_FIELD',
							'DROP_DOWN_LIST',
							'GROUPED_DROP_DOWN',
							'FIXED_VALUE',
						]),
						items: z.unknown().optional(),
						required: z.unknown().optional(),
						default_value: z.unknown().optional(),
						multi_select: z.unknown().optional(),
						grouped_items: z.unknown().optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	.strict();
const r_aa2372f83a2eOutput = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		type: z.unknown().optional(),
		items: z.unknown().optional(),
		required: z.unknown().optional(),
		default_value: z.unknown().optional(),
		multi_select: z.unknown().optional(),
		grouped_items: z.unknown().optional(),
	})
	.passthrough();
const r_d11c9f59c2deInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_d11c9f59c2deOutput = z
	.object({
		status: z.unknown().optional(),
		affected_profiles: z.unknown().optional(),
	})
	.passthrough();
const r_f31cdd16607bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
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
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.object({ connector_ids: z.unknown().optional() }).passthrough(),
					)
					.optional(),
				network_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({ network_scan_ids: z.unknown().optional() })
							.passthrough(),
					)
					.optional(),
				system_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.unknown(),
					)
					.optional(),
				ct_log_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.unknown(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_f31cdd16607bOutput = z.unknown();
const r_413eadd6d21dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ account_id: z.unknown(), source_type: z.unknown() })
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
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.object({ connector_ids: z.unknown().optional() }).passthrough(),
					)
					.optional(),
				network_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z
							.object({ network_scan_ids: z.unknown().optional() })
							.passthrough(),
					)
					.optional(),
				system_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.unknown(),
					)
					.optional(),
				ct_log_scan_filter: z
					.intersection(
						z
							.object({
								cn_san_filter: z
									.object({
										common_names: z.unknown().optional(),
										sans: z.unknown().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
						z.unknown(),
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
				account_id: z.unknown(),
				search: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				unassigned: z.unknown().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_90e92b7da5a3Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_a1438d4fc523Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ devices: z.unknown() }).passthrough(),
	})
	.strict();
const r_a1438d4fc523Output = z.unknown();
const r_e0d550d921c4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ deviceInventoryIds: z.unknown() }).passthrough(),
	})
	.strict();
const r_e0d550d921c4Output = z
	.object({
		count: z.unknown().optional(),
		message: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
	})
	.passthrough();
const r_db452f94fae3Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_db452f94fae3Output = z
	.object({
		id: z.unknown().optional(),
		accountId: z.unknown().optional(),
		deviceName: z.unknown().optional(),
		serialNumber: z.unknown().optional(),
		udid: z.unknown().optional(),
		status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
		profileIds: z.unknown().optional(),
		profiles: z.unknown().optional(),
		createdAt: z.unknown().optional(),
		updatedAt: z.unknown().optional(),
		createdBy: z.unknown().optional(),
		updatedBy: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
		message: z.unknown().optional(),
	})
	.passthrough();
const r_38524550bc70Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				id: z.unknown().optional(),
				accountId: z.unknown().optional(),
				deviceName: z.unknown().optional(),
				serialNumber: z.unknown().optional(),
				udid: z.unknown().optional(),
				status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
				profileIds: z.unknown().optional(),
				profiles: z.unknown().optional(),
				createdAt: z.unknown().optional(),
				updatedAt: z.unknown().optional(),
				createdBy: z.unknown().optional(),
				updatedBy: z.unknown().optional(),
				rejectedProfiles: z.unknown().optional(),
				message: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_38524550bc70Output = z
	.object({
		id: z.unknown().optional(),
		accountId: z.unknown().optional(),
		deviceName: z.unknown().optional(),
		serialNumber: z.unknown().optional(),
		udid: z.unknown().optional(),
		status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
		profileIds: z.unknown().optional(),
		profiles: z.unknown().optional(),
		createdAt: z.unknown().optional(),
		updatedAt: z.unknown().optional(),
		createdBy: z.unknown().optional(),
		updatedBy: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
		message: z.unknown().optional(),
	})
	.passthrough();
const r_01008ef1501aInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_01008ef1501aOutput = z.undefined();
const r_6ac8994ec3c4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ file: z.unknown() }).passthrough(),
	})
	.strict();
const r_6ac8994ec3c4Output = z
	.object({
		totalRows: z.unknown().optional(),
		imported: z.unknown().optional(),
		skipped: z.unknown().optional(),
		failed: z.unknown().optional(),
		errors: z.unknown().optional(),
	})
	.passthrough();
const r_2ff73ca5e82fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				search: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				unassigned: z.unknown().optional(),
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
		path: z.object({ profileId: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ deviceInventoryIds: z.unknown() }).passthrough(),
	})
	.strict();
const r_371fd4d4a326Output = z
	.object({
		count: z.unknown().optional(),
		message: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
	})
	.passthrough();
const r_27064376ccadInput = z
	.object({
		path: z.object({ profileId: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ deviceInventoryIds: z.unknown() }).passthrough(),
	})
	.strict();
const r_27064376ccadOutput = z
	.object({
		count: z.unknown().optional(),
		message: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
	})
	.passthrough();
const r_b106e7869ed7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ deviceInventoryIds: z.unknown(), profileIds: z.unknown() })
			.passthrough(),
	})
	.strict();
const r_b106e7869ed7Output = z
	.object({
		count: z.unknown().optional(),
		message: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
	})
	.passthrough();
const r_67f447c0dbdcInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ deviceInventoryIds: z.unknown(), profileIds: z.unknown() })
			.passthrough(),
	})
	.strict();
const r_67f447c0dbdcOutput = z
	.object({
		count: z.unknown().optional(),
		message: z.unknown().optional(),
		rejectedProfiles: z.unknown().optional(),
	})
	.passthrough();
const r_21affda0f31fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				application: z.unknown().optional(),
				tags: z.unknown().optional(),
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
				virtualServerName: z.unknown().optional(),
				isAutoRenew: z.unknown().optional(),
				hasBeenAutomated: z.unknown().optional(),
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
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				application: z.unknown().optional(),
				tags: z.unknown().optional(),
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
				virtualServerName: z.unknown().optional(),
				isAutoRenew: z.unknown().optional(),
				hasBeenAutomated: z.unknown().optional(),
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
			.object({ account_id: z.unknown(), portlet_ids: z.unknown() })
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				application: z.unknown().optional(),
				tags: z.unknown().optional(),
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
				virtualServerName: z.unknown().optional(),
				isAutoRenew: z.unknown().optional(),
				hasBeenAutomated: z.unknown().optional(),
				certificateThumbprint: z.unknown().optional(),
				common_name: z.unknown().optional(),
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
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				application: z.unknown().optional(),
				tags: z.unknown().optional(),
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
				virtualServerName: z.unknown().optional(),
				isAutoRenew: z.unknown().optional(),
				hasBeenAutomated: z.unknown().optional(),
				certificateThumbprint: z.unknown().optional(),
				common_name: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ae14a0cad4edOutput = z.undefined();
const r_a7822a6bdea6Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z
			.object({
				instance_type: z.unknown(),
				account_id: z.unknown(),
				inventory_type: z.unknown(),
				certificate_id: z.unknown().optional(),
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				businessUnitName: z.unknown().optional(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				source: z.unknown().optional(),
				tags: z.unknown().optional(),
				scanName: z.unknown().optional(),
				commonName: z.unknown().optional(),
				certificateThumbprint: z.unknown().optional(),
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
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				businessUnitName: z.unknown().optional(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				connector: z.unknown().optional(),
				source: z.unknown().optional(),
				tags: z.unknown().optional(),
				scanName: z.unknown().optional(),
				commonName: z.unknown().optional(),
				certificateThumbprint: z.unknown().optional(),
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account: z.object({ id: z.unknown(), name: z.unknown() }).passthrough(),
				certificateThumbprint: z.unknown(),
				businessUnit: z
					.object({ id: z.unknown().optional(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				ip: z.unknown().optional(),
				port: z.unknown().optional(),
				application: z.unknown().optional(),
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
				profile: z.unknown(),
				seat: z
					.object({ seat_id: z.unknown(), email: z.unknown() })
					.passthrough(),
				attributes: z
					.object({
						csr: z.unknown().optional(),
						subject: z
							.object({
								common_name: z.unknown().optional(),
								organization_name: z.unknown().optional(),
								organization_units: z.unknown().optional(),
								description: z.unknown().optional(),
								serial_number: z.unknown().optional(),
								pseudonym: z.unknown().optional(),
								unique_identifier: z.unknown().optional(),
								user_identifier: z.unknown().optional(),
								domain_component: z.unknown().optional(),
								dn_qualifier: z.unknown().optional(),
								unstructured_name: z.unknown().optional(),
								unstructured_address: z.unknown().optional(),
								street_address: z.unknown().optional(),
								locality: z.unknown().optional(),
								state: z.unknown().optional(),
								postal_code: z.unknown().optional(),
								country: z.unknown().optional(),
								email: z.unknown().optional(),
								title: z.unknown().optional(),
								given_name: z.unknown().optional(),
								surname: z.unknown().optional(),
								organization_identifier: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: z.unknown().optional(),
					})
					.passthrough(),
				enrollment_code: z.unknown().optional(),
				expiry_date: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_889a59dc528aOutput = z
	.object({
		id: z.unknown().optional(),
		seat_id: z.unknown().optional(),
		profile_id: z.unknown().optional(),
		profile_name: z.unknown().optional(),
		enrollment_code: z.unknown().optional(),
		creation_date_time: z.unknown().optional(),
		expiry_date_time: z.unknown().optional(),
		status: z.unknown().optional(),
		number_of_bad_attempts: z.unknown().optional(),
		enrollment_url: z.unknown().optional(),
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
				seat: z.object({ id: z.unknown() }).passthrough().optional(),
				profile: z.object({ id: z.unknown() }).passthrough().optional(),
				enrollment_code: z.unknown().optional(),
				csr: z.unknown().optional(),
				attributes: z
					.object({
						subject: z
							.object({
								common_name: z.unknown().optional(),
								organization_name: z.unknown().optional(),
								organization_units: z.unknown().optional(),
								description: z.unknown().optional(),
								serial_number: z.unknown().optional(),
								pseudonym: z.unknown().optional(),
								unique_identifier: z.unknown().optional(),
								user_identifier: z.unknown().optional(),
								domain_component: z.unknown().optional(),
								dn_qualifier: z.unknown().optional(),
								unstructured_name: z.unknown().optional(),
								unstructured_address: z.unknown().optional(),
								street_address: z.unknown().optional(),
								locality: z.unknown().optional(),
								state: z.unknown().optional(),
								postal_code: z.unknown().optional(),
								country: z.unknown().optional(),
								email: z.unknown().optional(),
								title: z.unknown().optional(),
								given_name: z.unknown().optional(),
								surname: z.unknown().optional(),
								organization_identifier: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				custom_attributes: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_604d6ac29079Output = z
	.object({
		serial_number: z.unknown().optional(),
		delivery_format: z
			.enum(['x509', 'pkcs7', 'pkcs12', 'pkcs12_pem'])
			.optional(),
		certificate: z.unknown().optional(),
		pkcs12_password: z.unknown().optional(),
		request_id: z.unknown().optional(),
		dv_details: z
			.object({
				schema: z
					.object({
						dcv_method: z
							.enum(['dns-cname-token', 'dns-txt-token', 'http-token'])
							.optional(),
						dcv_random_value: z.unknown().optional(),
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
		path: z.object({ enrollment_id: z.unknown() }).strict(),
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
				message_to_user: z.unknown().optional(),
				custom_validity_days: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_6d7a2c7d5b92Output = z.undefined();
const r_c1244e33b2b4Input = z
	.object({
		path: z.object({ enrollment_code: z.unknown() }).strict(),
		query: z.object({ seat_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c1244e33b2b4Output = z
	.object({
		id: z.unknown().optional(),
		seat_id: z.unknown().optional(),
		profile_id: z.unknown().optional(),
		profile_name: z.unknown().optional(),
		enrollment_code: z.unknown().optional(),
		creation_date_time: z.unknown().optional(),
		expiry_date_time: z.unknown().optional(),
		status: z.unknown().optional(),
		number_of_bad_attempts: z.unknown().optional(),
	})
	.passthrough();
const r_fa40e5e88461Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				created_at_from: z.unknown().optional(),
				created_at_to: z.unknown().optional(),
				expires_at_from: z.unknown().optional(),
				expires_at_to: z.unknown().optional(),
				email: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				seat_id: z.unknown().optional(),
				seat_identifier: z.unknown().optional(),
				seat_name: z.unknown().optional(),
				status: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fa40e5e88461Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_4ef7dea657b7Input = z
	.object({
		path: z.object({ enrollment_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_4ef7dea657b7Output = z
	.object({
		id: z.unknown().optional(),
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
		email: z.unknown().optional(),
		created_at: z.unknown().optional(),
		expires_at: z.unknown().optional(),
		profile: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		seat: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
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
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		message_to_user: z.unknown().optional(),
		seat_id_mapping_value: z.unknown().optional(),
		approved_by_current_user: z.unknown().optional(),
		comments: z.unknown().optional(),
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
				profile: z.object({ id: z.unknown() }).passthrough().optional(),
				email: z.unknown().optional(),
				csr: z.unknown().optional(),
				comments: z.unknown().optional(),
				saml_response_id: z.unknown().optional(),
				attributes: z
					.object({
						subject: z
							.object({
								common_name: z.unknown().optional(),
								organization_name: z.unknown().optional(),
								organization_units: z.unknown().optional(),
								description: z.unknown().optional(),
								serial_number: z.unknown().optional(),
								pseudonym: z.unknown().optional(),
								unique_identifier: z.unknown().optional(),
								user_identifier: z.unknown().optional(),
								domain_component: z.unknown().optional(),
								dn_qualifier: z.unknown().optional(),
								unstructured_name: z.unknown().optional(),
								unstructured_address: z.unknown().optional(),
								street_address: z.unknown().optional(),
								locality: z.unknown().optional(),
								state: z.unknown().optional(),
								postal_code: z.unknown().optional(),
								country: z.unknown().optional(),
								email: z.unknown().optional(),
								title: z.unknown().optional(),
								given_name: z.unknown().optional(),
								surname: z.unknown().optional(),
								organization_identifier: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						custom_values: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				authentication_attributes: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_2edfe1f4b869Output = z.object({ id: z.unknown() }).passthrough();
const r_2b49885a43e5Input = z
	.object({
		path: z.object({ certificate_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2b49885a43e5Output = z
	.object({
		attributes: z
			.object({ custom_values: z.unknown().optional() })
			.passthrough()
			.optional(),
		email: z.unknown().optional(),
		enrollment_id: z.unknown().optional(),
		enrollment_secret: z.unknown().optional(),
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
		has_parent: z.unknown().optional(),
		profile: z
			.object({
				account: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				acme_credentials: z
					.object({
						directory_url: z.unknown().optional(),
						eab_hmac: z.unknown().optional(),
						eab_kid: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				action_needed_reason: z.unknown().optional(),
				active: z.unknown().optional(),
				additional_recipients: z.unknown().optional(),
				admin_contact: z
					.object({
						account_id: z.unknown().optional(),
						email: z.unknown().optional(),
						enabled: z.unknown().optional(),
						id: z.unknown().optional(),
						name: z.unknown().optional(),
						phone: z.unknown().optional(),
						profile_id: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				allow_validity_from_rest_api: z.unknown().optional(),
				api_token_ids: z.unknown().optional(),
				authentication_fields: z.unknown().optional(),
				authentication_method: z.unknown().optional(),
				automated_renewal: z.unknown().optional(),
				business_unit: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				ca_chain_value: z.unknown().optional(),
				ca_settings: z
					.object({
						auto_renew_settings: z
							.object({
								auto_renew_certificate_and_order: z.unknown(),
								auto_renew_time: z
									.object({
										days: z.unknown().optional(),
										hours: z.unknown().optional(),
										minutes: z.unknown().optional(),
										time_format: z.unknown(),
										zone: z.unknown(),
									})
									.passthrough()
									.optional(),
								before_expiration: z.unknown(),
							})
							.passthrough()
							.optional(),
						contacts: z.unknown().optional(),
						msca_settings: z
							.object({
								certificate_fields: z.unknown().optional(),
								extensions: z.unknown().optional(),
								name: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({ id: z.unknown(), name: z.unknown() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				cc_settings: z.unknown().optional(),
				cert_delivery_format: z
					.enum(['pkcs12', 'pkcs12_der', 'pkcs12_pem', 'pkcs7', 'x509'])
					.optional(),
				connector: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				days_till_enrollment_expires: z.unknown().optional(),
				digicert_desktop_client_settings: z.unknown().optional(),
				digicert_trust_assistant_settings: z.unknown().optional(),
				duplicate_certificate_allowed: z.unknown().optional(),
				email_templates: z.unknown().optional(),
				embed_enrollment_code_in_url: z.unknown().optional(),
				enable_dual_admin_approval: z.unknown().optional(),
				enable_ldap_search: z.unknown().optional(),
				enrollment_code_length: z.unknown().optional(),
				enrollment_method: z.unknown().optional(),
				enrollment_urls: z.unknown().optional(),
				fields: z.unknown().optional(),
				fixed_enrollment_url: z.unknown().optional(),
				global_enrollment_code: z.unknown().optional(),
				global_enrollment_code_enabled: z.unknown().optional(),
				ica: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough()
					.optional(),
				id: z.unknown().optional(),
				instruction_file_id: z.unknown().optional(),
				instruction_file_name: z.unknown().optional(),
				instruction_format: z
					.enum(['doc', 'docx', 'pdf', 'ppt', 'pptx', 'txt'])
					.optional(),
				intune_settings: z
					.object({
						intune_app_id: z.unknown().optional(),
						intune_app_key: z.unknown().optional(),
						intune_push_enabled: z.unknown().optional(),
						intune_tenant_name: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						dual_admin_recovery: z.unknown().optional(),
						key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
						key_escrow_enabled: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				max_number_of_bad_attempts: z.unknown().optional(),
				microsoft_auto_enrollment_client_settings: z
					.object({
						crypto_providers: z
							.object({
								modifiable: z.unknown().optional(),
								providers: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						end_entity_type: z.enum(['machine', 'user']).optional(),
						enroll_on_behalf_of: z.unknown().optional(),
						enroll_on_behalf_of_modifiable: z.unknown().optional(),
						enrollment_mode: z
							.object({
								mode: z.enum(['inform_user', 'silent']),
								modifiable: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						key_spec: z
							.enum(['at_keyexchange', 'at_signature', 'xcn_at_none'])
							.optional(),
						private_key_export: z
							.object({
								allowed: z.unknown().optional(),
								modifiable: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						publish_to_ad: z.unknown().optional(),
						template_oid: z.unknown().optional(),
						template_schema_version: z.unknown().optional(),
						windows_hello_logon: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				name: z.unknown().optional(),
				notify_requestor: z.unknown().optional(),
				platform8_api_key: z
					.object({
						id: z.unknown().optional(),
						name: z.unknown().optional(),
						value: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				renewal_window_days: z.unknown().optional(),
				saml_settings: z
					.object({
						enforce_manual_approval: z.unknown().optional(),
						idp_certificate: z.unknown().optional(),
						idp_issuer: z.unknown().optional(),
						idp_single_logout_url: z.unknown().optional(),
						idp_url: z.unknown().optional(),
						sp_certificate: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				scep_settings: z
					.object({
						encryption_algorithm: z.enum([
							'aes128WithCBC',
							'aes128WithGCM',
							'aes256WithCBC',
							'aes256WithGCM',
							'desEDEWith3CBC',
							'desWithCBC',
						]),
						standard: z.enum([
							'DRAFT_NOURSE_SCEP_23',
							'RFC_8894_DRAFT_GUTMANN_SCEP_16',
						]),
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
				seat_type_id: z.unknown().optional(),
				seat_type_name: z.unknown().optional(),
				suspended: z.unknown().optional(),
				template: z
					.object({
						id: z.unknown(),
						name: z.unknown().optional(),
						trust_type: z.enum(['private', 'public']).optional(),
					})
					.passthrough()
					.optional(),
				use_custom_contact: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		serial_number: z.unknown().optional(),
	})
	.passthrough();
const r_a730dc9722bbInput = z
	.object({
		path: z.object({ certificate_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				profile: z.object({ id: z.unknown() }).passthrough().optional(),
				csr: z.unknown().optional(),
				saml_response_id: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_a730dc9722bbOutput = z.object({ id: z.unknown() }).passthrough();
const r_a38f059e2a70Input = z
	.object({
		path: z.object({ profileId: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_a38f059e2a70Output = z.undefined();
const r_aa991ba230c3Input = z
	.object({
		path: z.object({ profileId: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown().optional(),
	})
	.strict();
const r_aa991ba230c3Output = z.undefined();
const r_af7ddf1c733dInput = z
	.object({
		path: z.object({ profileId: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown().optional(),
	})
	.strict();
const r_af7ddf1c733dOutput = z.undefined();
const r_e827e3bec28aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				search_query: z.unknown().optional(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_e827e3bec28aOutput = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_fe3221ef0855Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.unknown(),
				integration_type: z
					.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
					.optional(),
				sensor_id: z.unknown(),
				category: z.enum(['APPLIANCE', 'CLOUD_SERVICE', 'DNS_INTEGRATION']),
				parameters: z.unknown(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_fe3221ef0855Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
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
		status_details: z.unknown().optional(),
		type: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
			.optional(),
		application_name: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER'])
			.optional(),
		parameter_id: z.unknown().optional(),
		account_id: z.unknown().optional(),
		business_unit_id: z.unknown().optional(),
		app_info: z
			.object({
				name: z.unknown().optional(),
				version: z.unknown().optional(),
				arch: z.unknown().optional(),
				flavor: z.unknown().optional(),
				automation_order: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		management_key: z.unknown().optional(),
		is_fips_present: z.unknown().optional(),
		created_at: z.unknown().optional(),
		updated: z.unknown().optional(),
		category: z
			.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
			.optional(),
		ha_peers: z.unknown().optional(),
		parameters: z.unknown().optional(),
		sensor_ids: z.unknown().optional(),
	})
	.passthrough();
const r_cf48324a6d66Input = z
	.object({
		path: z.object({ integration_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_cf48324a6d66Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
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
		status_details: z.unknown().optional(),
		type: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER', 'A10'])
			.optional(),
		application_name: z
			.enum(['AWS', 'AWS-CLOUDFRONT', 'BIGIP', 'NETSCALER'])
			.optional(),
		parameter_id: z.unknown().optional(),
		account_id: z.unknown().optional(),
		business_unit_id: z.unknown().optional(),
		app_info: z
			.object({
				name: z.unknown().optional(),
				version: z.unknown().optional(),
				arch: z.unknown().optional(),
				flavor: z.unknown().optional(),
				automation_order: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		management_key: z.unknown().optional(),
		is_fips_present: z.unknown().optional(),
		created_at: z.unknown().optional(),
		updated: z.unknown().optional(),
		category: z
			.enum(['CLOUD_SERVICE', 'APPLIANCE', 'DNS_INTEGRATION'])
			.optional(),
		ha_peers: z.unknown().optional(),
		parameters: z.unknown().optional(),
		sensor_ids: z.unknown().optional(),
	})
	.passthrough();
const r_31f08184b392Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ integrations: z.unknown() }).passthrough().optional(),
	})
	.strict();
const r_31f08184b392Output = z.unknown();
const r_5f0c91e25af4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
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
			.object({ integrations: z.unknown().optional() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_090e1558aef3Output = z.undefined();
const r_a12209ad174fInput = z
	.object({
		path: z.object({ integration_id: z.unknown() }).strict(),
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
const r_a7f9ba1b6636Output = z.unknown();
const r_cd234014f0ffInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.unknown(),
				description: z.unknown().optional(),
				business_unit_id: z.unknown(),
				ica: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough(),
				account_id: z.unknown(),
				template_id: z.unknown(),
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
				custom_extended_key_usages: z.unknown().optional(),
				renewal_window_days: z.unknown(),
				days_till_enrollment_expires: z.unknown().optional(),
				duplicate_certificate_allowed: z.unknown().optional(),
				notify_requestor: z.unknown().optional(),
				embed_enrollment_code_in_url: z.unknown().optional(),
				grace_period_enabled: z.unknown().optional(),
				enable_ldap_search: z.unknown().optional(),
				self_service_portal_active: z.unknown().optional(),
				global_enrollment_code: z.unknown().optional(),
				fields: z.unknown().optional(),
				connector_id: z.unknown().optional(),
				use_custom_contact: z.unknown().optional(),
				ca_settings: z
					.object({
						contacts: z.unknown().optional(),
						certificate_fields: z
							.object({
								validity_period: z.unknown().optional(),
								renewal_period: z.unknown().optional(),
								key_type: z.unknown().optional(),
								key_size: z.unknown().optional(),
								signature_algorithm: z.unknown().optional(),
								crypto_providers: z.unknown().optional(),
								arn: z.unknown().optional(),
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
								auto_renew_certificate_and_order: z.unknown(),
								auto_renew_time: z
									.object({
										days: z.unknown().optional(),
										hours: z.unknown().optional(),
										minutes: z.unknown().optional(),
										time_format: z.unknown(),
										zone: z.unknown(),
									})
									.passthrough()
									.optional(),
								before_expiration: z.unknown(),
							})
							.passthrough()
							.optional(),
						contacts: z.unknown().optional(),
						http_signed_exchange: z.unknown().optional(),
						key_sizes: z.unknown().optional(),
						account_id: z.unknown().optional(),
						is_custom_validity: z.unknown().optional(),
						duplicate_minimum_validity_days: z.unknown().nullable().optional(),
						key_type: z.unknown().optional(),
						order_coverage_length: z.unknown().optional(),
						override_validity: z.unknown().optional(),
						organization: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
								value: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						organization_contact: z
							.object({
								id: z.unknown(),
								name: z.unknown(),
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
								id: z.unknown().optional(),
								name: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						container: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
								value: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						region: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						key_escrow_enabled: z.unknown(),
						key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
						dual_admin_recovery: z.unknown(),
					})
					.passthrough()
					.optional(),
				tags: z.unknown().optional(),
				api_token_binding_enabled: z.unknown().nullable().optional(),
				api_token_ids: z.unknown().optional(),
				ssp_auth_operations: z.unknown().optional(),
				ssp_open_operations: z.unknown().optional(),
				allowed_user_group: z.unknown().optional(),
				allowed_fqdn_regex: z.unknown().optional(),
				additional_recipients: z.unknown().optional(),
				certificate_owner_ids: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_cd234014f0ffOutput = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		description: z.unknown().optional(),
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
		publish_to_public_directory: z.unknown().optional(),
		renewal_period_days: z.unknown().optional(),
		duplicate_cert_policy: z.unknown().optional(),
		override_cert_validity_via_api: z.unknown().optional(),
		certificate_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
		account_id: z.unknown().optional(),
		business_unit_id: z.unknown().optional(),
		business_unit_name: z.unknown().optional(),
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
		days_till_enrollment_expires: z.unknown().optional(),
		automated_renewal: z.unknown().optional(),
		global_enrollment_code_enabled: z.unknown().optional(),
		renewal_window_days: z.unknown().optional(),
		connector_id: z.unknown().optional(),
		ica: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		key_escrow_policy: z
			.object({
				key_escrow_enabled: z.unknown(),
				key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
				dual_admin_recovery: z.unknown(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: z.unknown().optional() })
			.passthrough()
			.optional(),
		api_token_binding_enabled: z.unknown().optional(),
		api_token_ids: z.unknown().optional(),
		enable_dual_admin_approval: z.unknown().optional(),
		enable_ldap_search: z.unknown().optional(),
		acme_credentials: z
			.object({
				eab_kid: z.unknown().optional(),
				eab_hmac: z.unknown().optional(),
				directory_url: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		tags: z.unknown().optional(),
		useCustomContact: z.unknown().optional(),
		duplicate_certificate_allowed: z.unknown().optional(),
		cert_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
		notifyRequestor: z.unknown().optional(),
		custom_extended_key_usages: z.unknown().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: z.unknown().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
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
								serial_number: z.unknown().optional(),
								subject_dn: z.unknown().optional(),
								certificate: z.unknown().optional(),
								root: z.unknown().optional(),
								chain: z.unknown().optional(),
							})
							.passthrough(),
						z.object({ chain: z.unknown().optional() }).passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
				trust_type: z.enum(['private', 'public']).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: z.unknown().optional(),
		allowed_key_sizes: z.unknown().optional(),
		fields: z
			.object({
				optional: z.unknown().optional(),
				multiple: z.unknown().optional(),
				key: z.unknown().optional(),
				type: z.unknown().optional(),
				input: z.unknown().optional(),
				oid: z.unknown().optional(),
				dataType: z.unknown().optional(),
				allowed_groups: z.unknown().optional(),
				sources: z.unknown().optional(),
				labels: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		custom_attributes_fields: z.unknown().optional(),
		certificate_owners: z.unknown().optional(),
		additional_recipients: z.unknown().optional(),
		self_service_portal_active: z.unknown().optional(),
		ssp_auth_operations: z.unknown().optional(),
		ssp_open_operations: z.unknown().optional(),
		allowed_user_group: z.unknown().optional(),
	})
	.passthrough();
const r_9a2ea6339160Input = z
	.object({
		path: z.object({ profile_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.unknown(),
				description: z.unknown().optional(),
				business_unit_id: z.unknown(),
				ica: z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough(),
				account_id: z.unknown(),
				template_id: z.unknown(),
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
				custom_extended_key_usages: z.unknown().optional(),
				renewal_window_days: z.unknown(),
				days_till_enrollment_expires: z.unknown().optional(),
				duplicate_certificate_allowed: z.unknown().optional(),
				notify_requestor: z.unknown().optional(),
				embed_enrollment_code_in_url: z.unknown().optional(),
				grace_period_enabled: z.unknown().optional(),
				enable_ldap_search: z.unknown().optional(),
				self_service_portal_active: z.unknown().optional(),
				global_enrollment_code: z.unknown().optional(),
				fields: z.unknown().optional(),
				connector_id: z.unknown().optional(),
				use_custom_contact: z.unknown().optional(),
				ca_settings: z
					.object({
						contacts: z.unknown().optional(),
						certificate_fields: z
							.object({
								validity_period: z.unknown().optional(),
								renewal_period: z.unknown().optional(),
								key_type: z.unknown().optional(),
								key_size: z.unknown().optional(),
								signature_algorithm: z.unknown().optional(),
								crypto_providers: z.unknown().optional(),
								arn: z.unknown().optional(),
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
								auto_renew_certificate_and_order: z.unknown(),
								auto_renew_time: z
									.object({
										days: z.unknown().optional(),
										hours: z.unknown().optional(),
										minutes: z.unknown().optional(),
										time_format: z.unknown(),
										zone: z.unknown(),
									})
									.passthrough()
									.optional(),
								before_expiration: z.unknown(),
							})
							.passthrough()
							.optional(),
						contacts: z.unknown().optional(),
						http_signed_exchange: z.unknown().optional(),
						key_sizes: z.unknown().optional(),
						account_id: z.unknown().optional(),
						is_custom_validity: z.unknown().optional(),
						duplicate_minimum_validity_days: z.unknown().nullable().optional(),
						key_type: z.unknown().optional(),
						order_coverage_length: z.unknown().optional(),
						override_validity: z.unknown().optional(),
						organization: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
								value: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						organization_contact: z
							.object({
								id: z.unknown(),
								name: z.unknown(),
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
								id: z.unknown().optional(),
								name: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						container: z
							.object({
								id: z.unknown().optional(),
								name: z.unknown().optional(),
								value: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						region: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				key_escrow_policy: z
					.object({
						key_escrow_enabled: z.unknown(),
						key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
						dual_admin_recovery: z.unknown(),
					})
					.passthrough()
					.optional(),
				tags: z.unknown().optional(),
				api_token_binding_enabled: z.unknown().nullable().optional(),
				api_token_ids: z.unknown().optional(),
				ssp_auth_operations: z.unknown().optional(),
				ssp_open_operations: z.unknown().optional(),
				allowed_user_group: z.unknown().optional(),
				allowed_fqdn_regex: z.unknown().optional(),
				additional_recipients: z.unknown().optional(),
				certificate_owner_ids: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_9a2ea6339160Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
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
		publish_to_public_directory: z.unknown().optional(),
		renewal_period_days: z.unknown().optional(),
		duplicate_cert_policy: z.unknown().optional(),
		override_cert_validity_via_api: z.unknown().optional(),
		certificate_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
		business_unit_id: z.unknown().optional(),
		account_id: z.unknown().optional(),
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
				key_escrow_enabled: z.unknown(),
				key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
				dual_admin_recovery: z.unknown(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: z.unknown().optional() })
			.passthrough()
			.optional(),
		allowed_key_sizes: z.unknown().optional(),
		api_token_binding_enabled: z.unknown().optional(),
		api_token_id: z.unknown().optional(),
		enable_dual_admin_approval: z.unknown().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: z.unknown().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						security_identifier: z
							.object({ attributes: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				issuer: z
					.intersection(
						z
							.object({
								serial_number: z.unknown().optional(),
								subject_dn: z.unknown().optional(),
								certificate: z.unknown().optional(),
								root: z.unknown().optional(),
								chain: z.unknown().optional(),
							})
							.passthrough(),
						z.object({ chain: z.unknown().optional() }).passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
				trust_type: z.enum(['private', 'public']).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: z.unknown().optional(),
		custom_extended_key_usages: z.unknown().optional(),
	})
	.passthrough();
const r_b31cfc3255d8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				api_token_id: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_b31cfc3255d8Output = z.unknown();
const r_9cd9f0927b03Input = z
	.object({
		path: z.object({ profile_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_9cd9f0927b03Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
		description: z.unknown().optional(),
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
		publish_to_public_directory: z.unknown().optional(),
		renewal_period_days: z.unknown().optional(),
		duplicate_cert_policy: z.unknown().optional(),
		override_cert_validity_via_api: z.unknown().optional(),
		certificate_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
		account_id: z.unknown().optional(),
		business_unit_id: z.unknown().optional(),
		business_unit_name: z.unknown().optional(),
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
		days_till_enrollment_expires: z.unknown().optional(),
		automated_renewal: z.unknown().optional(),
		global_enrollment_code_enabled: z.unknown().optional(),
		renewal_window_days: z.unknown().optional(),
		connector_id: z.unknown().optional(),
		ica: z
			.object({ id: z.unknown(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		key_escrow_policy: z
			.object({
				key_escrow_enabled: z.unknown(),
				key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
				dual_admin_recovery: z.unknown(),
			})
			.passthrough()
			.optional(),
		private_key_attributes: z
			.object({ key_size: z.unknown().optional() })
			.passthrough()
			.optional(),
		api_token_binding_enabled: z.unknown().optional(),
		api_token_ids: z.unknown().optional(),
		enable_dual_admin_approval: z.unknown().optional(),
		enable_ldap_search: z.unknown().optional(),
		acme_credentials: z
			.object({
				eab_kid: z.unknown().optional(),
				eab_hmac: z.unknown().optional(),
				directory_url: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		tags: z.unknown().optional(),
		useCustomContact: z.unknown().optional(),
		duplicate_certificate_allowed: z.unknown().optional(),
		cert_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
		notifyRequestor: z.unknown().optional(),
		custom_extended_key_usages: z.unknown().optional(),
		certificate: z
			.object({
				subject: z
					.object({ attributes: z.unknown().optional() })
					.passthrough()
					.optional(),
				validity: z
					.object({
						unit: z
							.enum(['years', 'months', 'days', 'hours', 'minutes'])
							.optional(),
						duration: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				extensions: z
					.object({
						san: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
							})
							.passthrough()
							.optional(),
						issuer_alt_name: z
							.object({
								critical: z.unknown().optional(),
								attributes: z.unknown().optional(),
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
								serial_number: z.unknown().optional(),
								subject_dn: z.unknown().optional(),
								certificate: z.unknown().optional(),
								root: z.unknown().optional(),
								chain: z.unknown().optional(),
							})
							.passthrough(),
						z.object({ chain: z.unknown().optional() }).passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		template: z
			.object({
				id: z.unknown().optional(),
				name: z.unknown().optional(),
				trust_type: z.enum(['private', 'public']).optional(),
			})
			.passthrough()
			.optional(),
		allowed_list: z.unknown().optional(),
		allowed_key_sizes: z.unknown().optional(),
		fields: z
			.object({
				optional: z.unknown().optional(),
				multiple: z.unknown().optional(),
				key: z.unknown().optional(),
				type: z.unknown().optional(),
				input: z.unknown().optional(),
				oid: z.unknown().optional(),
				dataType: z.unknown().optional(),
				allowed_groups: z.unknown().optional(),
				sources: z.unknown().optional(),
				labels: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
		custom_attributes_fields: z.unknown().optional(),
		certificate_owners: z.unknown().optional(),
		additional_recipients: z.unknown().optional(),
		self_service_portal_active: z.unknown().optional(),
		ssp_auth_operations: z.unknown().optional(),
		ssp_open_operations: z.unknown().optional(),
		allowed_user_group: z.unknown().optional(),
	})
	.passthrough();
const r_87c7a8fcf2c3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				api_token_id: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_87c7a8fcf2c3Output = z.unknown();
const r_beff76538781Input = z
	.object({
		path: z.object({ profile_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_beff76538781Output = z.union([
	z
		.object({
			id: z.unknown().optional(),
			name: z.unknown().optional(),
			description: z.unknown().optional(),
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
			publish_to_public_directory: z.unknown().optional(),
			renewal_period_days: z.unknown().optional(),
			duplicate_cert_policy: z.unknown().optional(),
			override_cert_validity_via_api: z.unknown().optional(),
			certificate_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.optional(),
			account_id: z.unknown().optional(),
			business_unit_id: z.unknown().optional(),
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
			days_till_enrollment_expires: z.unknown().optional(),
			automated_renewal: z.unknown().optional(),
			renewal_window_days: z.unknown().optional(),
			connector_id: z.unknown().optional(),
			ica: z
				.object({ id: z.unknown(), name: z.unknown().optional() })
				.passthrough()
				.optional(),
			key_escrow_policy: z
				.object({
					key_escrow_enabled: z.unknown(),
					key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
					dual_admin_recovery: z.unknown(),
				})
				.passthrough()
				.optional(),
			private_key_attributes: z
				.object({ key_size: z.unknown().optional() })
				.passthrough()
				.optional(),
			api_token_binding_enabled: z.unknown().optional(),
			api_token_ids: z.unknown().optional(),
			enable_dual_admin_approval: z.unknown().optional(),
			enable_ldap_search: z.unknown().optional(),
			tags: z.unknown().optional(),
			useCustomContact: z.unknown().optional(),
			duplicate_certificate_allowed: z.unknown().optional(),
			cert_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
			notifyRequestor: z.unknown().optional(),
			custom_extended_key_usages: z.unknown().optional(),
			certificate: z
				.object({
					subject: z
						.object({ attributes: z.unknown().optional() })
						.passthrough()
						.optional(),
					validity: z
						.object({
							unit: z
								.enum(['years', 'months', 'days', 'hours', 'minutes'])
								.optional(),
							duration: z.unknown().optional(),
						})
						.passthrough()
						.optional(),
					extensions: z
						.object({
							san: z
								.object({
									critical: z.unknown().optional(),
									attributes: z.unknown().optional(),
								})
								.passthrough()
								.optional(),
							issuer_alt_name: z
								.object({
									critical: z.unknown().optional(),
									attributes: z.unknown().optional(),
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
									serial_number: z.unknown().optional(),
									subject_dn: z.unknown().optional(),
									certificate: z.unknown().optional(),
									root: z.unknown().optional(),
									chain: z.unknown().optional(),
								})
								.passthrough(),
							z.object({ chain: z.unknown().optional() }).passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
			template: z
				.object({
					id: z.unknown().optional(),
					name: z.unknown().optional(),
					trust_type: z.enum(['private', 'public']).optional(),
				})
				.passthrough()
				.optional(),
			allowed_key_sizes: z.unknown().optional(),
			fields: z
				.object({
					optional: z.unknown().optional(),
					multiple: z.unknown().optional(),
					key: z.unknown().optional(),
					type: z.unknown().optional(),
					input: z.unknown().optional(),
					oid: z.unknown().optional(),
					dataType: z.unknown().optional(),
					allowed_groups: z.unknown().optional(),
					sources: z.unknown().optional(),
					labels: z.unknown().optional(),
				})
				.passthrough()
				.optional(),
			custom_attributes_fields: z.unknown().optional(),
			certificate_owners: z.unknown().optional(),
		})
		.passthrough(),
	z
		.object({
			id: z.unknown().optional(),
			name: z.unknown().optional(),
			description: z.unknown().optional(),
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
			publish_to_public_directory: z.unknown().optional(),
			renewal_period_days: z.unknown().optional(),
			duplicate_cert_policy: z.unknown().optional(),
			override_cert_validity_via_api: z.unknown().optional(),
			certificate_delivery_format: z
				.enum(['x509', 'pkcs7', 'pkcs12'])
				.optional(),
			account_id: z.unknown().optional(),
			business_unit_id: z.unknown().optional(),
			business_unit_name: z.unknown().optional(),
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
			days_till_enrollment_expires: z.unknown().optional(),
			automated_renewal: z.unknown().optional(),
			global_enrollment_code_enabled: z.unknown().optional(),
			renewal_window_days: z.unknown().optional(),
			connector_id: z.unknown().optional(),
			ica: z
				.object({ id: z.unknown(), name: z.unknown().optional() })
				.passthrough()
				.optional(),
			key_escrow_policy: z
				.object({
					key_escrow_enabled: z.unknown(),
					key_escrow_deployment_mode: z.enum(['CLOUD', 'LOCAL']).optional(),
					dual_admin_recovery: z.unknown(),
				})
				.passthrough()
				.optional(),
			private_key_attributes: z
				.object({ key_size: z.unknown().optional() })
				.passthrough()
				.optional(),
			api_token_binding_enabled: z.unknown().optional(),
			api_token_ids: z.unknown().optional(),
			enable_dual_admin_approval: z.unknown().optional(),
			enable_ldap_search: z.unknown().optional(),
			acme_credentials: z
				.object({
					eab_kid: z.unknown().optional(),
					eab_hmac: z.unknown().optional(),
					directory_url: z.unknown().optional(),
				})
				.passthrough()
				.optional(),
			tags: z.unknown().optional(),
			useCustomContact: z.unknown().optional(),
			duplicate_certificate_allowed: z.unknown().optional(),
			cert_delivery_format: z.enum(['x509', 'pkcs7', 'pkcs12']).optional(),
			notifyRequestor: z.unknown().optional(),
			custom_extended_key_usages: z.unknown().optional(),
			certificate: z
				.object({
					subject: z
						.object({ attributes: z.unknown().optional() })
						.passthrough()
						.optional(),
					validity: z
						.object({
							unit: z
								.enum(['years', 'months', 'days', 'hours', 'minutes'])
								.optional(),
							duration: z.unknown().optional(),
						})
						.passthrough()
						.optional(),
					extensions: z
						.object({
							san: z
								.object({
									critical: z.unknown().optional(),
									attributes: z.unknown().optional(),
								})
								.passthrough()
								.optional(),
							issuer_alt_name: z
								.object({
									critical: z.unknown().optional(),
									attributes: z.unknown().optional(),
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
									serial_number: z.unknown().optional(),
									subject_dn: z.unknown().optional(),
									certificate: z.unknown().optional(),
									root: z.unknown().optional(),
									chain: z.unknown().optional(),
								})
								.passthrough(),
							z.object({ chain: z.unknown().optional() }).passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
			template: z
				.object({
					id: z.unknown().optional(),
					name: z.unknown().optional(),
					trust_type: z.enum(['private', 'public']).optional(),
				})
				.passthrough()
				.optional(),
			allowed_list: z.unknown().optional(),
			allowed_key_sizes: z.unknown().optional(),
			fields: z
				.object({
					optional: z.unknown().optional(),
					multiple: z.unknown().optional(),
					key: z.unknown().optional(),
					type: z.unknown().optional(),
					input: z.unknown().optional(),
					oid: z.unknown().optional(),
					dataType: z.unknown().optional(),
					allowed_groups: z.unknown().optional(),
					sources: z.unknown().optional(),
					labels: z.unknown().optional(),
				})
				.passthrough()
				.optional(),
			custom_attributes_fields: z.unknown().optional(),
			certificate_owners: z.unknown().optional(),
			additional_recipients: z.unknown().optional(),
			self_service_portal_active: z.unknown().optional(),
			ssp_auth_operations: z.unknown().optional(),
			ssp_open_operations: z.unknown().optional(),
			allowed_user_group: z.unknown().optional(),
		})
		.passthrough(),
]);
const r_ddb85158bd5dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown().optional(),
				admin_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				profile_id: z.unknown().optional(),
				seat_id: z.unknown().optional(),
				create_date: z.unknown().optional(),
				expiry_date: z.unknown().optional(),
				redeem_date: z.unknown().optional(),
				reject_date: z.unknown().optional(),
				reset_date: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_ddb85158bd5dOutput = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_8544e8ac7f57Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				account_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				resource_id: z.unknown().optional(),
				admin_id: z.unknown().optional(),
				admin_name: z.unknown().optional(),
				resource_name: z.unknown().optional(),
				seat_identifier: z.unknown().optional(),
				seat_id: z.unknown().optional(),
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
				from: z.unknown().optional(),
				to: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_8544e8ac7f57Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_fb0b80993f03Input = z
	.object({
		path: z.object({ event_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_fb0b80993f03Output = z
	.object({
		id: z.unknown().optional(),
		account: z.object({ id: z.unknown().optional() }).passthrough().optional(),
		business_unit: z
			.object({ id: z.unknown().optional() })
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
		resource_id: z.unknown().optional(),
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
			.object({ id: z.unknown().optional(), name: z.unknown().optional() })
			.passthrough()
			.optional(),
		timestamp: z.unknown().optional(),
		description: z.unknown().optional(),
		status: z.enum(['success', 'warning', 'failure']).optional(),
		error_message: z.unknown().optional(),
		detailed_error_message: z.unknown().optional(),
		data: z.unknown().optional(),
		new_data: z.unknown().optional(),
	})
	.passthrough();
const r_f27878dd7018Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				exclude_context_data: z.unknown().optional(),
				account_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
				resource_id: z.unknown().optional(),
				admin_id: z.unknown().optional(),
				admin_name: z.unknown().optional(),
				resource_name: z.unknown().optional(),
				seat_identifier: z.unknown().optional(),
				seat_id: z.unknown().optional(),
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
				from: z.unknown().optional(),
				to: z.unknown().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_f27878dd7018Output = z.intersection(
	z.object({ total: z.unknown() }).passthrough(),
	z.object({ total: z.unknown().optional() }).passthrough(),
);
const r_10c05d173009Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_10c05d173009Output = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_936d50859847Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				name: z.unknown(),
				description: z.unknown().optional(),
				type: z.enum(['certificate', 'asset']),
				rule_id: z.unknown().optional(),
				status: z.unknown().optional(),
				assignments: z.unknown().optional(),
				conditions: z.unknown().optional(),
				targets: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_936d50859847Output = z.undefined();
const r_fba0a11d0af9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.unknown(),
	})
	.strict();
const r_fba0a11d0af9Output = z.undefined();
const r_39fd79124781Input = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_39fd79124781Output = z
	.object({
		name: z.unknown(),
		account_id: z.unknown(),
		rule_id: z.unknown().optional(),
		type: z.enum(['certificate', 'asset']).optional(),
		description: z.unknown().optional(),
		status: z.unknown().optional(),
		created_at: z.unknown().optional(),
		updated_at: z.unknown().optional(),
		conditions: z.unknown().optional(),
		assignments: z.unknown().optional(),
		targets: z.unknown().optional(),
	})
	.passthrough();
const r_d1a0900ac1cdInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_id: z.unknown(),
				name: z.unknown(),
				description: z.unknown().optional(),
				type: z.enum(['certificate', 'asset']),
				rule_id: z.unknown().optional(),
				status: z.unknown().optional(),
				assignments: z.unknown().optional(),
				conditions: z.unknown().optional(),
				targets: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_d1a0900ac1cdOutput = z.undefined();
const r_2c4418daa501Input = z
	.object({
		path: z.object({ ruleId: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
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
				account_id: z.unknown(),
				businessUnit: z.unknown().optional(),
				businessUnitName: z.unknown().optional(),
				currentScanStatus: z.unknown().optional(),
				frequency: z.unknown().optional(),
				lastScanStatus: z.unknown().optional(),
				limit: z.unknown().optional(),
				name: z.unknown().optional(),
				offset: z.unknown().optional(),
				scanType: z.unknown().optional(),
				sort: z.unknown().optional(),
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
				account_id: z.unknown(),
				business_unit_id: z.unknown().optional(),
				cipher_scan: z.unknown().optional(),
				config: z
					.object({
						day_of_month: z.unknown().optional(),
						days_to_run: z.unknown().optional(),
						disable_ping: z.unknown().optional(),
						do_not_follow_http_redirects: z.unknown().optional(),
						extra_tls_protocols_discovery: z.unknown().optional(),
						ipv6: z.unknown().optional(),
						is_os_discovery: z.unknown().optional(),
						is_server_application_discovery: z.unknown().optional(),
						refresh_host_ip_inventory: z.unknown().optional(),
						restrict_emulated_tls_issues_scan: z.unknown().optional(),
						scan_option: z.enum(['CUSTOM', 'OPTIMIZE']).optional(),
						sensor_with_ip_port: z.unknown().optional(),
						sni: z.unknown().optional(),
						speed: z.enum(['FAST', 'MEDIUM', 'SLOW']).optional(),
						ssh_discovery: z.unknown().optional(),
						start_time: z.unknown().optional(),
						time_to_complete: z.unknown().optional(),
						timezone: z.unknown().optional(),
						tls_ssl_critical_issues: z.unknown().optional(),
						tls_ssl_non_critical_issues: z.unknown().optional(),
						week_of_month: z
							.enum(['FIRST', 'FOURTH', 'LAST', 'SECOND', 'THIRD'])
							.optional(),
					})
					.passthrough(),
				data_business_unit_id: z.unknown().optional(),
				enable_debug_ports: z.unknown().optional(),
				frequency: z.enum(['DAILY', 'MONTHLY', 'ONE_TIME', 'WEEKLY']),
				id: z.unknown().optional(),
				name: z.unknown(),
				save_only: z.unknown().optional(),
				tags: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_f41e8938ed63Output = z.undefined();
const r_3cab39f7decfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ scans: z.unknown().optional() }).passthrough(),
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
				account_id: z.unknown(),
				business_unit_id: z.unknown().optional(),
				cipher_scan: z.unknown().optional(),
				config: z
					.object({
						day_of_month: z.unknown().optional(),
						days_to_run: z.unknown().optional(),
						disable_ping: z.unknown().optional(),
						do_not_follow_http_redirects: z.unknown().optional(),
						extra_tls_protocols_discovery: z.unknown().optional(),
						ipv6: z.unknown().optional(),
						is_os_discovery: z.unknown().optional(),
						is_server_application_discovery: z.unknown().optional(),
						refresh_host_ip_inventory: z.unknown().optional(),
						restrict_emulated_tls_issues_scan: z.unknown().optional(),
						scan_option: z.enum(['CUSTOM', 'OPTIMIZE']).optional(),
						sensor_with_ip_port: z.unknown().optional(),
						sni: z.unknown().optional(),
						speed: z.enum(['FAST', 'MEDIUM', 'SLOW']).optional(),
						ssh_discovery: z.unknown().optional(),
						start_time: z.unknown().optional(),
						time_to_complete: z.unknown().optional(),
						timezone: z.unknown().optional(),
						tls_ssl_critical_issues: z.unknown().optional(),
						tls_ssl_non_critical_issues: z.unknown().optional(),
						week_of_month: z
							.enum(['FIRST', 'FOURTH', 'LAST', 'SECOND', 'THIRD'])
							.optional(),
					})
					.passthrough(),
				data_business_unit_id: z.unknown().optional(),
				enable_debug_ports: z.unknown().optional(),
				frequency: z.enum(['DAILY', 'MONTHLY', 'ONE_TIME', 'WEEKLY']),
				id: z.unknown().optional(),
				name: z.unknown(),
				save_only: z.unknown().optional(),
				tags: z.unknown().optional(),
			})
			.passthrough(),
	})
	.strict();
const r_0d8b21f3f0fcOutput = z.undefined();
const r_dc1a10c2c3a6Input = z
	.object({
		path: z.object({ scan_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_dc1a10c2c3a6Output = z.undefined();
const r_38f57b41183dInput = z
	.object({
		path: z.object({ scan_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_38f57b41183dOutput = z.undefined();
const r_3b605dc8977cInput = z
	.object({
		path: z.object({ id: z.unknown() }).strict(),
		query: z
			.object({
				category: z.enum(['CURRENT', 'PAST']).optional(),
				limit: z.unknown().optional(),
				offset: z.unknown().optional(),
				sort: z.unknown().optional(),
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
				account_id: z.unknown(),
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
				account_id: z.unknown().optional(),
				input: z
					.object({
						data: z.unknown().optional(),
						type: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				included_ip_fqdns: z.unknown().optional(),
				excluded_ip_fqdns: z.unknown().optional(),
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
			.object({ account_id: z.unknown(), name: z.unknown() })
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
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				account_id: z.unknown().optional(),
				business_unit_id: z.unknown().optional(),
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
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
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
						business_unit_id: z.unknown().optional(),
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
						seat_id: z.unknown().optional(),
					})
					.passthrough(),
				z
					.object({
						seat_name: z.unknown().optional(),
						email: z.unknown().optional(),
						phone: z.unknown().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.strict();
const r_495ebdedb32bOutput = z.undefined();
const r_0d6230796736Input = z
	.object({
		path: z.object({ seat_id: z.unknown() }).strict(),
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
				business_unit_id: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_0d6230796736Output = z
	.object({
		seat_id: z.unknown().optional(),
		seat_name: z.unknown().optional(),
		email: z.unknown().optional(),
		phone: z.unknown().optional(),
		seat_creation_date: z.unknown().optional(),
	})
	.passthrough();
const r_5c95b7617096Input = z
	.object({
		path: z.object({ seat_id: z.unknown() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.intersection(
				z
					.object({
						business_unit_id: z.unknown().optional(),
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
						seat_id: z.unknown().optional(),
					})
					.passthrough(),
				z
					.object({
						seat_name: z.unknown().optional(),
						email: z.unknown().optional(),
						phone: z.unknown().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.strict();
const r_5c95b7617096Output = z.undefined();
const r_50f5dbf5b576Input = z
	.object({
		path: z.object({ seat_id: z.unknown() }).strict(),
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
				business_unit_id: z.unknown().optional(),
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
			.object({ seat_id: z.unknown(), new_business_unit_id: z.unknown() })
			.strict(),
		query: z.object({ business_unit_id: z.unknown() }).strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_acd12ea8b342Output = z
	.object({
		seat_id: z.unknown().optional(),
		seat_name: z.unknown().optional(),
		email: z.unknown().optional(),
		phone: z.unknown().optional(),
		seat_creation_date: z.unknown().optional(),
	})
	.passthrough();
const r_26265e7690c1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ account_id: z.unknown().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_26265e7690c1Output = z.unknown();
const r_c5bef0f817eeInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				offset: z.unknown().optional(),
				limit: z.unknown().optional(),
				sort: z.unknown().optional(),
				search_query: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_c5bef0f817eeOutput = z.intersection(
	z
		.object({ total: z.unknown(), offset: z.unknown(), limit: z.unknown() })
		.passthrough(),
	z.object({ items: z.unknown().optional() }).passthrough(),
);
const r_2a5b40269113Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				account_id: z.unknown(),
				business_unit_id: z.unknown().optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const r_2a5b40269113Output = z
	.object({
		id: z.unknown().optional(),
		name: z.unknown().optional(),
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
		version: z.unknown().optional(),
		license_key: z.unknown().optional(),
		debug_enabled: z.unknown().optional(),
		allowed_actions: z.unknown().optional(),
		business_unit: z
			.intersection(
				z
					.object({ id: z.unknown(), name: z.unknown().optional() })
					.passthrough(),
				z.unknown(),
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
				account_id: z.unknown().optional(),
				license_keys: z.unknown().optional(),
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
				account_id: z.unknown().optional(),
				license_keys: z.unknown().optional(),
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
				account_id: z.unknown().optional(),
				advanced_settings: z
					.object({
						debug_enabled: z.unknown().optional(),
						heartbeat_interval: z.unknown().optional(),
						heartbeat_port: z.unknown().optional(),
					})
					.passthrough()
					.optional(),
				business_unit: z
					.intersection(
						z
							.object({ id: z.unknown(), name: z.unknown().optional() })
							.passthrough(),
						z.unknown(),
					)
					.optional(),
				id: z.unknown().optional(),
				name: z.unknown().optional(),
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
				account_id: z.unknown().optional(),
				license_keys: z.unknown().optional(),
			})
			.passthrough()
			.optional(),
	})
	.strict();
const r_3ccfd3c7488eOutput = z.undefined();
const r_ae93bfb2ed4dInput = z
	.object({
		path: z.object({ sensor_id: z.unknown() }).strict(),
		query: z.object({ account_id: z.unknown() }).strict(),
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
			.object({ account_id: z.unknown(), id: z.unknown(), name: z.unknown() })
			.passthrough()
			.optional(),
	})
	.strict();
const r_e13817c6d741Output = z.undefined();
const r_a638a4b395a8Input = z
	.object({
		path: z.object({ license_key: z.unknown() }).strict(),
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
		status: z.unknown().optional(),
		details: z
			.object({
				db_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				am_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ca_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				smtp_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ldap_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				dta_web_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				scheduled_jobs: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ticket_service: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ticket_service_heart_beat: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				ts_upload_ticket_job: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				critical_services_overall_status: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				non_critical_service_overall_status: z
					.object({
						status: z.enum(['UP', 'DOWN', 'NOT_AVAILABLE']).optional(),
						details: z
							.object({ error: z.unknown().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		scheduled_jobs: z
			.object({ DEFAULT: z.unknown().optional() })
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
						auth_type: z.enum(['BASIC', 'API_TOKEN', 'INTERNAL']).optional(),
						timestamp: z.string().optional(),
						description: z.string().optional(),
						status: z.enum(['SUCCESS', 'FAILURE']).optional(),
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
		status: z.enum(['SUCCESS', 'FAILURE']).optional(),
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
		auth_type: z.enum(['BASIC', 'API_TOKEN', 'INTERNAL']).optional(),
		timestamp: z.string().optional(),
		description: z.string().optional(),
		status: z.enum(['SUCCESS', 'FAILURE']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
										status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
								status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
						status: z.enum(['APPROVED', 'REJECTED']).optional(),
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
				validation_type: z.enum(['advanced+', 'qualified', 'basic']).optional(),
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
				status: z.enum(['ACTIVE', 'DISABLED']).optional(),
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
