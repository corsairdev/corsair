// Request/response samples from Intuit's model catalog
// (https://static.developer.intuit.com/JSONObjects/CodesModelsJsonObjects_v2.json),
// trimmed to three items per array, email addresses replaced. Used by samples.test.ts only.
// unknown because each sample is checked by the operation's own schema in the test.
export const intuitSamples: Record<
	string,
	{ request?: unknown; response?: unknown }
> = {
	'Invoice.Create0': {
		request: {
			Line: [
				{
					DetailType: 'SalesItemLineDetail',
					Amount: 100.0,
					SalesItemLineDetail: {
						ItemRef: {
							name: 'Services',
							value: '1',
						},
					},
				},
			],
			CustomerRef: {
				value: '1',
			},
		},
		response: {
			Invoice: {
				AllowOnlineACHPayment: false,
				domain: 'QBO',
				TxnDate: '2026-07-24',
				PrintStatus: 'NeedToPrint',
				TotalAmt: 100.0,
				AllowOnlineAffirmPayment: false,
				Line: [
					{
						LineNum: 1,
						Amount: 100.0,
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'NON',
							},
							ItemRef: {
								name: 'Services',
								value: '1',
							},
						},
						Id: '1',
						DetailType: 'SalesItemLineDetail',
					},
					{
						DetailType: 'SubTotalLineDetail',
						Amount: 100.0,
						SubTotalLineDetail: {},
					},
				],
				DueDate: '2026-08-23',
				MetaData: {
					CreateTime: '2026-07-24T10:33:39-07:00',
					LastUpdatedTime: '2026-07-24T10:33:39-07:00',
				},
				DocNumber: '1069',
				sparse: false,
				AllowOnlinePayPalPayment: false,
				ProjectRef: {
					value: '39298034',
				},
				Deposit: 0,
				Balance: 100.0,
				CustomerRef: {
					name: "Amy's Bird Sanctuary",
					value: '1',
				},
				TxnTaxDetail: {
					TotalTax: 0,
				},
				AllowOnlineCreditCardPayment: false,
				SyncToken: '0',
				LinkedTxn: [],
				ShipAddr: {
					City: 'Bayshore',
					Line1: '4581 Finch St.',
					PostalCode: '94326',
					Lat: 'INVALID',
					Long: 'INVALID',
					CountrySubDivisionCode: 'CA',
					Id: '109',
				},
				EmailStatus: 'NotSet',
				BillAddr: {
					City: 'Bayshore',
					Line1: '4581 Finch St.',
					PostalCode: '94326',
					Lat: 'INVALID',
					Long: 'INVALID',
					CountrySubDivisionCode: 'CA',
					Id: '2',
				},
				ApplyTaxAfterDiscount: false,
				CustomField: [
					{
						DefinitionId: '1',
						Type: 'StringType',
						Name: 'Crew #',
					},
				],
				Id: '238',
				AllowOnlinePayment: false,
			},
			time: '2026-07-24T10:33:39.11-07:00',
		},
	},
	'Invoice.Update0': {
		request: {
			TxnDate: '2015-07-24',
			domain: 'QBO',
			PrintStatus: 'NeedToPrint',
			TotalAmt: 150.0,
			Line: [
				{
					LineNum: 1,
					Amount: 150.0,
					SalesItemLineDetail: {
						TaxCodeRef: {
							value: 'NON',
						},
						ItemRef: {
							name: 'Services',
							value: '1',
						},
					},
					Id: '1',
					DetailType: 'SalesItemLineDetail',
				},
				{
					DetailType: 'SubTotalLineDetail',
					Amount: 150.0,
					SubTotalLineDetail: {},
				},
			],
			DueDate: '2015-08-23',
			ApplyTaxAfterDiscount: false,
			DocNumber: '1070',
			sparse: false,
			CustomerMemo: {
				value: 'Added customer memo.',
			},
			ProjectRef: {
				value: '39298045',
			},
			Balance: 150.0,
			CustomerRef: {
				name: "Amy's Bird Sanctuary",
				value: '1',
			},
			TxnTaxDetail: {
				TotalTax: 0,
			},
			SyncToken: '0',
			LinkedTxn: [],
			ShipAddr: {
				City: 'Bayshore',
				Line1: '4581 Finch St.',
				PostalCode: '94326',
				Lat: 'INVALID',
				Long: 'INVALID',
				CountrySubDivisionCode: 'CA',
				Id: '109',
			},
			EmailStatus: 'NotSet',
			BillAddr: {
				City: 'Bayshore',
				Line1: '4581 Finch St.',
				PostalCode: '94326',
				Lat: 'INVALID',
				Long: 'INVALID',
				CountrySubDivisionCode: 'CA',
				Id: '2',
			},
			MetaData: {
				CreateTime: '2015-07-24T10:35:08-07:00',
				LastUpdatedTime: '2015-07-24T10:35:08-07:00',
			},
			CustomField: [
				{
					DefinitionId: '1',
					Type: 'StringType',
					Name: 'Crew #',
				},
			],
			Id: '239',
		},
		response: {
			Invoice: {
				AllowOnlineACHPayment: false,
				domain: 'QBO',
				TxnDate: '2026-07-24',
				PrintStatus: 'NeedToPrint',
				TotalAmt: 150.0,
				AllowOnlineAffirmPayment: false,
				Line: [
					{
						LineNum: 1,
						Amount: 150.0,
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'NON',
							},
							ItemRef: {
								name: 'Services',
								value: '1',
							},
						},
						Id: '1',
						DetailType: 'SalesItemLineDetail',
					},
					{
						DetailType: 'SubTotalLineDetail',
						Amount: 150.0,
						SubTotalLineDetail: {},
					},
				],
				DueDate: '2026-08-23',
				MetaData: {
					CreateTime: '2026-07-24T10:35:08-07:00',
					LastUpdatedTime: '2026-07-24T10:53:39-07:00',
				},
				DocNumber: '1070',
				sparse: false,
				CustomerMemo: {
					value: 'Added customer memo.',
				},
				AllowOnlinePayPalPayment: false,
				ProjectRef: {
					value: '39298045',
				},
				Deposit: 0,
				Balance: 150.0,
				CustomerRef: {
					name: "Amy's Bird Sanctuary",
					value: '1',
				},
				TxnTaxDetail: {
					TotalTax: 0,
				},
				AllowOnlineCreditCardPayment: false,
				SyncToken: '1',
				LinkedTxn: [],
				ShipAddr: {
					CountrySubDivisionCode: 'CA',
					City: 'Bayshore',
					PostalCode: '94326',
					Id: '118',
					Line1: '4581 Finch St.',
				},
				EmailStatus: 'NotSet',
				BillAddr: {
					CountrySubDivisionCode: 'CA',
					City: 'Bayshore',
					PostalCode: '94326',
					Id: '117',
					Line1: '4581 Finch St.',
				},
				ApplyTaxAfterDiscount: false,
				CustomField: [
					{
						DefinitionId: '1',
						Type: 'StringType',
						Name: 'Crew #',
					},
				],
				Id: '239',
				AllowOnlinePayment: false,
			},
			time: '2026-07-24T10:53:39.287-07:00',
		},
	},
	'Invoice.Void0': {
		request: {
			SyncToken: '0',
			Id: '129',
		},
		response: {
			Invoice: {
				AllowOnlineACHPayment: false,
				domain: 'QBO',
				TxnDate: '2014-11-09',
				PrintStatus: 'NEED_TO_PRINT',
				SalesTermRef: {
					value: '3',
				},
				TotalAmt: 0,
				AllowOnlineAffirmPayment: false,
				Line: [
					{
						Description: 'Sod',
						DetailType: 'SALES_ITEM_LINE_DETAIL',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'TAX',
							},
							Qty: 0,
							ItemRef: {
								name: 'Sod',
								value: '14',
							},
						},
						LineNum: 1,
						Amount: 0,
						Id: '1',
					},
					{
						Description: '2 cubic ft. bag',
						DetailType: 'SALES_ITEM_LINE_DETAIL',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'TAX',
							},
							Qty: 0,
							ItemRef: {
								name: 'Soil',
								value: '15',
							},
						},
						LineNum: 2,
						Amount: 0,
						Id: '2',
					},
					{
						Description: 'Weekly Gardening Service',
						DetailType: 'SALES_ITEM_LINE_DETAIL',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'NON',
							},
							Qty: 0,
							ItemRef: {
								name: 'Gardening',
								value: '6',
							},
						},
						LineNum: 3,
						Amount: 0,
						Id: '3',
					},
				],
				DueDate: '2014-12-09',
				MetaData: {
					CreateTime: '2014-11-09T13:15:36-08:00',
					LastUpdatedTime: '2016-03-16T12:27:10-07:00',
				},
				DocNumber: '1036',
				PrivateNote: 'Voided',
				BillAddr: {
					Line4: 'Middlefield, CA  94482',
					Line3: '370 Easy St.',
					Line2: 'Freeman Sporting Goods',
					Line1: 'Sasha Tillou',
					Long: 'INVALID',
					Lat: 'INVALID',
					Id: '94',
				},
				CustomerMemo: {
					value: 'Thank you for your business and have a great day!',
				},
				AllowOnlinePayPalPayment: false,
				ProjectRef: {
					value: '39298045',
				},
				Deposit: 0,
				Balance: 0,
				CustomerRef: {
					name: '0969 Ocean View Road',
					value: '8',
				},
				TxnTaxDetail: {
					TotalTax: 0,
				},
				AllowOnlineCreditCardPayment: false,
				SyncToken: '1',
				LinkedTxn: [],
				BillEmail: {
					Address: 'customer@example.com',
				},
				ShipAddr: {
					City: 'Middlefield',
					Line1: '370 Easy St.',
					PostalCode: '94482',
					Lat: '37.4031672',
					Long: '-122.0642815',
					CountrySubDivisionCode: 'CA',
					Id: '8',
				},
				EmailStatus: 'NOT_SET',
				sparse: false,
				ApplyTaxAfterDiscount: false,
				CustomField: [
					{
						DefinitionId: '1',
						StringValue: '105',
						Type: 'STRING_TYPE',
						Name: 'Crew #',
					},
				],
				Id: '129',
				AllowOnlinePayment: false,
				AllowIPNPayment: false,
			},
			time: '2016-03-16T12:27:10.711-07:00',
		},
	},
	'Creditcardpayment.Read0': {
		response: {
			CreditCardPaymentTxn: {
				SyncToken: '0',
				domain: 'QBO',
				CreditCardAccountRef: {
					name: 'Credit Card',
					value: '57',
				},
				TxnDate: '2020-03-27',
				CurrencyRef: {
					name: 'United States Dollar',
					value: 'USD',
				},
				Amount: 10.0,
				sparse: false,
				BankAccountRef: {
					name: 'Checking',
					value: '37',
				},
				Id: '29',
				MetaData: {
					CreateTime: '2020-03-27T07:01:04-07:00',
					LastUpdatedTime: '2020-03-27T07:01:04-07:00',
				},
			},
			time: '2020-03-27T07:06:45.630-07:00',
		},
	},
	'Exchangerate.Query0': {
		request:
			"select * from exchangerate where sourcecurrencycode in ('EUR', 'INR') and asofdate='2015-07-07'",
		response: {
			QueryResponse: {
				startPosition: 1,
				ExchangeRate: [
					{
						SyncToken: '0',
						AsOfDate: '2015-05-15',
						SourceCurrencyCode: 'INR',
						Rate: 5,
						TargetCurrencyCode: 'USD',
						MetaData: {
							LastUpdatedTime: '2015-07-07T12:38:40-07:00',
						},
					},
					{
						SyncToken: '0',
						AsOfDate: '2015-07-07',
						SourceCurrencyCode: 'EUR',
						Rate: 5,
						TargetCurrencyCode: 'USD',
						MetaData: {
							LastUpdatedTime: '2015-07-07T12:40:08-07:00',
						},
					},
				],
				maxResults: 2,
				totalCount: 2,
			},
			time: '2015-07-08T09:19:44.495-07:00',
		},
	},
	'Exchangerate.Update0': {
		request: {
			SyncToken: '0',
			AsOfDate: '2015-07-08',
			SourceCurrencyCode: 'INR',
			Rate: 7,
			TargetCurrencyCode: 'USD',
			MetaData: {
				LastUpdatedTime: '2015-07-07T12:38:40-07:00',
			},
		},
		response: {
			ExchangeRate: {
				SyncToken: '0',
				domain: 'QBO',
				AsOfDate: '2015-07-08',
				SourceCurrencyCode: 'INR',
				Rate: 7,
				sparse: false,
				TargetCurrencyCode: 'USD',
				MetaData: {
					LastUpdatedTime: '2015-07-08T09:21:46-07:00',
				},
			},
			time: '2015-07-08T09:21:46.310-07:00',
		},
	},
	'Attachable.Upload0': {
		request: {
			AttachableRef: [
				{
					EntityRef: {
						type: 'Invoice',
						value: '95',
					},
				},
			],
			ContentType: 'image/jpg',
			FileName: 'receipt_nov15.jpg',
		},
		response: {
			AttachableResponse: [
				{
					Attachable: {
						SyncToken: '0',
						domain: 'QBO',
						FileAccessUri: 'https://example.com/file',
						ThumbnailFileAccessUri: 'https://example.com/file',
						AttachableRef: [
							{
								IncludeOnSend: false,
								EntityRef: {
									type: 'Invoice',
									value: '95',
								},
							},
						],
						TempDownloadUri: 'https://example.com/file',
						MetaData: {
							CreateTime: '2015-11-16T10:59:02-08:00',
							LastUpdatedTime: '2015-11-16T10:59:02-08:00',
						},
						sparse: false,
						ContentType: 'image/jpeg',
						FileName: 'receipt_nov15.jpg',
						Id: '100000000004190865',
						Size: 1594261,
					},
				},
			],
			time: '2015-11-16T10:58:58.100-08:00',
		},
	},
	'Profitandloss.Query0': {
		request:
			'BaseURL/v3/company/companyId/reports/ProfitAndLoss?start_date=2015-06-01&end_date=2015-06-30&customer=1',
		response: {
			Header: {
				Customer: '1',
				ReportName: 'ProfitAndLoss',
				Option: [
					{
						Name: 'AccountingStandard',
						Value: 'GAAP',
					},
					{
						Name: 'NoReportData',
						Value: 'false',
					},
				],
				ReportBasis: 'Accrual',
				StartPeriod: '2015-06-01',
				Currency: 'USD',
				EndPeriod: '2015-06-30',
				Time: '2016-03-03T13:00:18-08:00',
				SummarizeColumnsBy: 'Total',
			},
			Rows: {
				Row: [
					{
						Header: {
							ColData: [
								{
									value: 'Income',
								},
								{
									value: '',
								},
							],
						},
						Rows: {
							Row: [
								{
									Header: {
										ColData: [
											{
												id: '45',
												value: 'Landscaping Services',
											},
											{
												value: '',
											},
										],
									},
									Rows: {
										Row: [
											{
												Header: {
													ColData: [
														{
															id: '46',
															value: 'Job Materials',
														},
														{
															value: '',
														},
													],
												},
												Rows: {
													Row: [
														{
															ColData: [
																{
																	id: '48',
																	value: 'Fountains and Garden Lighting',
																},
																{
																	value: '275.00',
																},
															],
															type: 'Data',
														},
														{
															ColData: [
																{
																	id: '49',
																	value: 'Plants and Soil',
																},
																{
																	value: '150.00',
																},
															],
															type: 'Data',
														},
													],
												},
												type: 'Section',
												Summary: {
													ColData: [
														{
															value: 'Total Job Materials',
														},
														{
															value: '425.00',
														},
													],
												},
											},
										],
									},
									type: 'Section',
									Summary: {
										ColData: [
											{
												value: 'Total Landscaping Services',
											},
											{
												value: '425.00',
											},
										],
									},
								},
								{
									ColData: [
										{
											id: '54',
											value: 'Pest Control Services',
										},
										{
											value: '-100.00',
										},
									],
									type: 'Data',
								},
							],
						},
						type: 'Section',
						group: 'Income',
						Summary: {
							ColData: [
								{
									value: 'Total Income',
								},
								{
									value: '325.00',
								},
							],
						},
					},
					{
						group: 'GrossProfit',
						type: 'Section',
						Summary: {
							ColData: [
								{
									value: 'Gross Profit',
								},
								{
									value: '325.00',
								},
							],
						},
					},
					{
						Header: {
							ColData: [
								{
									value: 'Expenses',
								},
								{
									value: '',
								},
							],
						},
						type: 'Section',
						group: 'Expenses',
						Summary: {
							ColData: [
								{
									value: 'Total Expenses',
								},
								{
									value: '',
								},
							],
						},
					},
				],
			},
			Columns: {
				Column: [
					{
						ColType: 'Account',
						ColTitle: '',
						MetaData: [
							{
								Name: 'ColKey',
								Value: 'account',
							},
						],
					},
					{
						ColType: 'Money',
						ColTitle: 'Total',
						MetaData: [
							{
								Name: 'ColKey',
								Value: 'total',
							},
						],
					},
				],
			},
		},
	},
	'Deposit.Create0': {
		request: {
			Line: [
				{
					DetailType: 'DepositLineDetail',
					Amount: 20.0,
					ProjectRef: {
						value: '42991284',
					},
					DepositLineDetail: {
						AccountRef: {
							name: 'Unapplied Cash Payment Income',
							value: '87',
						},
					},
				},
			],
			DepositToAccountRef: {
				name: 'Checking',
				value: '35',
			},
		},
		response: {
			Deposit: {
				SyncToken: '0',
				domain: 'QBO',
				DepositToAccountRef: {
					name: 'Checking',
					value: '35',
				},
				TxnDate: '2014-12-22',
				TotalAmt: 20.0,
				sparse: false,
				Line: [
					{
						DetailType: 'DepositLineDetail',
						ProjectRef: {
							value: '42991284',
						},
						LineNum: 1,
						Amount: 20.0,
						Id: '1',
						DepositLineDetail: {
							AccountRef: {
								name: 'Unapplied Cash Payment Income',
								value: '87',
							},
						},
					},
				],
				Id: '149',
				MetaData: {
					CreateTime: '2014-12-22T14:46:36-08:00',
					LastUpdatedTime: '2014-12-22T14:46:36-08:00',
				},
			},
			time: '2014-12-22T14:46:36.084-08:00',
		},
	},
	'Journalentry.Create0': {
		request: {
			Line: [
				{
					JournalEntryLineDetail: {
						PostingType: 'Debit',
						AccountRef: {
							name: 'Opening Bal Equity',
							value: '39',
						},
					},
					DetailType: 'JournalEntryLineDetail',
					Amount: 100.0,
					Id: '0',
					Description: 'nov portion of rider insurance',
				},
				{
					JournalEntryLineDetail: {
						PostingType: 'Credit',
						AccountRef: {
							name: 'Notes Payable',
							value: '44',
						},
					},
					DetailType: 'JournalEntryLineDetail',
					Amount: 100.0,
					Description: 'nov portion of rider insurance',
				},
			],
		},
		response: {
			time: '2015-06-29T12:45:32.183-07:00',
			JournalEntry: {
				SyncToken: '0',
				domain: 'QBO',
				TxnDate: '2015-06-29',
				sparse: false,
				Line: [
					{
						JournalEntryLineDetail: {
							PostingType: 'Debit',
							AccountRef: {
								name: 'Truck:Depreciation',
								value: '39',
							},
						},
						DetailType: 'JournalEntryLineDetail',
						Amount: 100.0,
						Id: '0',
						Description: 'nov portion of rider insurance',
					},
					{
						JournalEntryLineDetail: {
							PostingType: 'Credit',
							AccountRef: {
								name: 'Notes Payable',
								value: '44',
							},
						},
						DetailType: 'JournalEntryLineDetail',
						Amount: 100.0,
						Id: '1',
						Description: 'nov portion of rider insurance',
					},
				],
				Adjustment: false,
				Id: '228',
				TxnTaxDetail: {},
				MetaData: {
					CreateTime: '2015-06-29T12:45:32-07:00',
					LastUpdatedTime: '2015-06-29T12:45:32-07:00',
				},
			},
		},
	},
	'Vendorcredit.Create0': {
		request: {
			TotalAmt: 90.0,
			TxnDate: '2014-12-23',
			Line: [
				{
					DetailType: 'AccountBasedExpenseLineDetail',
					Amount: 90.0,
					ProjectRef: {
						value: '39298045',
					},
					Id: '1',
					AccountBasedExpenseLineDetail: {
						TaxCodeRef: {
							value: 'TAX',
						},
						AccountRef: {
							name: 'Bank Charges',
							value: '8',
						},
						BillableStatus: 'Billable',
						CustomerRef: {
							name: "Amy's Bird Sanctuary",
							value: '1',
						},
					},
				},
			],
			APAccountRef: {
				name: 'Accounts Payable (A/P)',
				value: '33',
			},
			VendorRef: {
				name: 'Books by Bessie',
				value: '30',
			},
		},
		response: {
			VendorCredit: {
				SyncToken: '0',
				domain: 'QBO',
				VendorRef: {
					name: 'Books by Bessie',
					value: '30',
				},
				TxnDate: '2014-12-23',
				TotalAmt: 90.0,
				APAccountRef: {
					name: 'Accounts Payable (A/P)',
					value: '33',
				},
				sparse: false,
				Line: [
					{
						DetailType: 'AccountBasedExpenseLineDetail',
						Amount: 90.0,
						ProjectRef: {
							value: '39298045',
						},
						Id: '1',
						AccountBasedExpenseLineDetail: {
							TaxCodeRef: {
								value: 'TAX',
							},
							AccountRef: {
								name: 'Bank Charges',
								value: '8',
							},
							BillableStatus: 'Billable',
							CustomerRef: {
								name: "Amy's Bird Sanctuary",
								value: '1',
							},
						},
					},
				],
				Id: '157',
				MetaData: {
					CreateTime: '2014-12-23T11:14:15-08:00',
					LastUpdatedTime: '2014-12-23T11:14:15-08:00',
				},
			},
			time: '2014-12-23T11:14:15.462-08:00',
		},
	},
	'Recurringtransaction.Create0': {
		request: {
			Invoice: {
				AllowOnlineACHPayment: false,
				ShipFromAddr: {
					Id: '713',
					Line1: '123 Sierra Way, San Pablo, CA, 87999, USA',
				},
				CurrencyRef: {
					name: 'United States Dollar',
					value: 'USD',
				},
				HomeBalance: 55,
				PrintStatus: 'NeedToPrint',
				BillEmail: {
					Address: 'customer@example.com',
				},
				DeliveryInfo: {
					DeliveryType: 'Email',
				},
				TotalAmt: 55,
				AllowOnlineAffirmPayment: false,
				Line: [
					{
						LineNum: 1,
						Amount: 55,
						SalesItemLineDetail: {
							ItemRef: {
								name: 'Hours',
								value: '2',
							},
							Qty: 1,
							TaxCodeRef: {
								value: 'NON',
							},
							ItemAccountRef: {
								name: 'Services',
								value: '1',
							},
							UnitPrice: 55,
							TaxClassificationRef: {
								value: 'EUC-99990201-V1-00020000',
							},
						},
						Id: '1',
						DetailType: 'SalesItemLineDetail',
					},
					{
						DetailType: 'SubTotalLineDetail',
						Amount: 55,
						SubTotalLineDetail: {},
					},
				],
				ApplyTaxAfterDiscount: false,
				RecurDataRef: {
					value: '4',
				},
				AllowOnlinePayPalPayment: false,
				TaxExemptionRef: {},
				Balance: 55,
				CustomerRef: {
					name: 'Travis Waldron',
					value: '26',
				},
				TxnTaxDetail: {
					TotalTax: 0,
				},
				AllowOnlineCreditCardPayment: false,
				LinkedTxn: [],
				RecurringInfo: {
					Active: true,
					RecurType: 'Automated',
					ScheduleInfo: {
						StartDate: '2020-09-01',
						MaxOccurrences: 10,
						IntervalType: 'Monthly',
						DaysBefore: 2,
						NextDate: '2020-09-01',
						NumInterval: 1,
						DayOfMonth: 1,
					},
					Name: 'RecurTemplate2',
				},
				ExchangeRate: 1,
				ShipAddr: {
					City: 'Monlo Park',
					Line1: '78 First St.',
					PostalCode: '94304',
					Lat: '37.4585825',
					Long: '-122.1352789',
					CountrySubDivisionCode: 'CA',
					Id: '27',
				},
				DepartmentRef: {
					name: 'DeptName100768f890d64',
					value: '1',
				},
				EmailStatus: 'NeedToSend',
				BillAddr: {
					City: 'Monlo Park',
					Line1: '78 First St.',
					PostalCode: '94304',
					Lat: '37.4585825',
					Long: '-122.1352789',
					CountrySubDivisionCode: 'CA',
					Id: '27',
				},
				FreeFormAddress: true,
				CustomField: [
					{
						DefinitionId: '1',
						Type: 'StringType',
						Name: 'Crew #',
					},
				],
				HomeTotalAmt: 55,
				AllowOnlinePayment: false,
				AllowIPNPayment: false,
			},
		},
		response: {
			time: '2020-08-13T17:04:57.367-07:00',
			RecurringTransaction: {
				Invoice: {
					AllowOnlineACHPayment: false,
					domain: 'QBO',
					CurrencyRef: {
						name: 'United States Dollar',
						value: 'USD',
					},
					PrintStatus: 'NeedToPrint',
					BillEmail: {
						Address: 'customer@example.com',
					},
					DeliveryInfo: {
						DeliveryType: 'Email',
					},
					TotalAmt: 55.0,
					AllowOnlineAffirmPayment: false,
					Line: [
						{
							LineNum: 1,
							Amount: 55.0,
							SalesItemLineDetail: {
								TaxCodeRef: {
									value: 'NON',
								},
								Qty: 1,
								UnitPrice: 55,
								ItemRef: {
									name: 'Hours',
									value: '2',
								},
							},
							Id: '1',
							DetailType: 'SalesItemLineDetail',
						},
						{
							DetailType: 'SubTotalLineDetail',
							Amount: 55.0,
							SubTotalLineDetail: {},
						},
					],
					DueDate: '2020-08-13',
					MetaData: {
						CreateTime: '2020-08-13T17:04:57-07:00',
						LastUpdatedTime: '2020-08-13T17:04:57-07:00',
					},
					sparse: false,
					RecurDataRef: {
						value: '6',
					},
					AllowOnlinePayPalPayment: false,
					Balance: 55.0,
					CustomerRef: {
						name: 'Travis Waldron',
						value: '26',
					},
					TxnTaxDetail: {
						TotalTax: 0,
					},
					AllowOnlineCreditCardPayment: false,
					SyncToken: '0',
					LinkedTxn: [],
					RecurringInfo: {
						Active: true,
						RecurType: 'Automated',
						ScheduleInfo: {
							StartDate: '2020-09-01',
							MaxOccurrences: 10,
							IntervalType: 'Monthly',
							DaysBefore: 2,
							NextDate: '2020-09-01',
							NumInterval: 1,
							DayOfMonth: 1,
						},
						Name: 'RecurTemplate2',
					},
					ExchangeRate: 1,
					ShipAddr: {
						CountrySubDivisionCode: 'CA',
						City: 'Monlo Park',
						PostalCode: '94304',
						Id: '717',
						Line1: '78 First St.',
					},
					HomeTotalAmt: 55.0,
					DepartmentRef: {
						name: 'DeptName100768f890d64',
						value: '1',
					},
					EmailStatus: 'NeedToSend',
					BillAddr: {
						CountrySubDivisionCode: 'CA',
						City: 'Monlo Park',
						PostalCode: '94304',
						Id: '716',
						Line1: '78 First St.',
					},
					ApplyTaxAfterDiscount: false,
					CustomField: [
						{
							DefinitionId: '1',
							Type: 'StringType',
							Name: 'Crew #',
						},
					],
					Id: '1483',
					AllowOnlinePayment: false,
					AllowIPNPayment: false,
				},
			},
		},
	},
	'Recurringtransaction.Delete0': {
		request: {
			Invoice: {
				SyncToken: '0',
				Id: '1483',
			},
		},
		response: {
			time: '2020-08-13T17:40:08.008-07:00',
			RecurringTransaction: {
				status: 'Deleted',
				domain: 'QBO',
				Invoice: {
					Id: '1483',
				},
			},
		},
	},
	'Recurringtransaction.Read0': {
		response: {
			QueryResponse: {
				startPosition: 1,
				maxResults: 1,
				RecurringTransaction: [
					{
						Bill: {
							SyncToken: '0',
							domain: 'QBO',
							RecurringInfo: {
								Active: true,
								RecurType: 'Automated',
								ScheduleInfo: {
									NumInterval: 1,
									NextDate: '2020-08-01',
									DayOfMonth: 1,
									PreviousDate: '2020-07-01',
									IntervalType: 'Monthly',
								},
								Name: 'Telephone Bill',
							},
							RecurDataRef: {
								value: '2',
							},
							CurrencyRef: {
								name: 'United States Dollar',
								value: 'USD',
							},
							TotalAmt: 74.36,
							APAccountRef: {
								name: 'Name_01ff6',
								value: '33',
							},
							Id: '20',
							sparse: false,
							VendorRef: {
								name: 'Cal Telephone',
								value: '32',
							},
							Line: [
								{
									Description: 'Monthly Phone Bill',
									DetailType: 'AccountBasedExpenseLineDetail',
									LineNum: 1,
									Amount: 74.36,
									Id: '1',
									AccountBasedExpenseLineDetail: {
										TaxCodeRef: {
											value: 'NON',
										},
										AccountRef: {
											name: 'Utilities:Telephone',
											value: '77',
										},
										BillableStatus: 'NotBillable',
									},
								},
							],
							Balance: 74.36,
							SalesTermRef: {
								value: '3',
							},
							MetaData: {
								CreateTime: '2019-02-17T15:27:25-08:00',
								LastUpdatedTime: '2020-07-05T01:19:13-07:00',
							},
						},
					},
				],
			},
			time: '2020-07-09T10:18:02.049-07:00',
		},
	},
	'Batch.BatchRequest0': {
		request: {
			BatchItemRequest: [
				{
					bId: 'bid1',
					Vendor: {
						DisplayName: 'Smith Family Store',
					},
					operation: 'create',
				},
				{
					bId: 'bid2',
					operation: 'delete',
					Invoice: {
						SyncToken: '0',
						Id: '129',
					},
				},
				{
					SalesReceipt: {
						PrivateNote: 'A private note.',
						SyncToken: '0',
						domain: 'QBO',
						Id: '11',
						sparse: true,
					},
					bId: 'bid3',
					operation: 'update',
				},
			],
		},
		response: {
			BatchItemResponse: [
				{
					Fault: {
						type: 'ValidationFault',
						Error: [
							{
								Message: 'Duplicate Name Exists Error',
								code: '6240',
								Detail:
									'The name supplied already exists. : Another customer, vendor or employee is already using this \nname. Please use a different name.',
								element: '',
							},
						],
					},
					bId: 'bid1',
				},
				{
					Fault: {
						type: 'ValidationFault',
						Error: [
							{
								Message: 'Object Not Found',
								code: '610',
								Detail:
									"Object Not Found : Something you're trying to use has been made inactive. Check the fields with accounts, customers, items, vendors or employees.",
								element: '',
							},
						],
					},
					bId: 'bid2',
				},
				{
					Fault: {
						type: 'ValidationFault',
						Error: [
							{
								Message: 'Stale Object Error',
								code: '5010',
								Detail:
									'Stale Object Error : You and root were working on this at the same time. root finished before you did, so your work was not saved.',
								element: '',
							},
						],
					},
					bId: 'bid3',
				},
			],
			time: '2016-04-15T09:01:18.141-07:00',
		},
	},
	'Timeactivity.Update0': {
		request: {
			TxnDate: '2014-09-16',
			domain: 'QBO',
			NameOf: 'Employee',
			Description: 'Updated descirption',
			ItemRef: {
				name: 'Design',
				value: '4',
			},
			Minutes: 0,
			ProjectRef: {
				value: '39298005',
			},
			Hours: 5,
			BillableStatus: 'Billable',
			sparse: false,
			HourlyRate: 75,
			Taxable: false,
			EmployeeRef: {
				name: 'John Johnson',
				value: '54',
			},
			SyncToken: '0',
			CustomerRef: {
				name: "Amy's Bird Sanctuary",
				value: '1',
			},
			Id: '3',
			MetaData: {
				CreateTime: '2014-09-17T11:53:15-07:00',
				LastUpdatedTime: '2014-09-17T11:53:15-07:00',
			},
		},
		response: {
			TimeActivity: {
				TxnDate: '2014-09-16',
				domain: 'QBO',
				NameOf: 'Employee',
				Description: 'Updated descirption',
				ItemRef: {
					name: 'Design',
					value: '4',
				},
				Minutes: 0,
				ProjectRef: {
					value: '39298005',
				},
				Hours: 5,
				BillableStatus: 'Billable',
				sparse: false,
				HourlyRate: 75,
				Taxable: false,
				EmployeeRef: {
					name: 'John Johnson',
					value: '54',
				},
				SyncToken: '1',
				CustomerRef: {
					name: "Amy's Bird Sanctuary",
					value: '1',
				},
				Id: '3',
				MetaData: {
					CreateTime: '2014-09-17T11:53:15-07:00',
					LastUpdatedTime: '2015-07-28T11:59:41-07:00',
				},
			},
			time: '2015-07-28T11:59:41.178-07:00',
		},
	},
	'Customer.Create0': {
		request: {
			FullyQualifiedName: 'King Groceries',
			PrimaryEmailAddr: {
				Address: 'customer@example.com',
			},
			DisplayName: "King's Groceries",
			Suffix: 'Jr',
			Title: 'Mr',
			MiddleName: 'B',
			Notes: 'Here are other details.',
			FamilyName: 'King',
			PrimaryPhone: {
				FreeFormNumber: '(555) 555-5555',
			},
			CompanyName: 'King Groceries',
			BillAddr: {
				CountrySubDivisionCode: 'CA',
				City: 'Mountain View',
				PostalCode: '94042',
				Line1: '123 Main Street',
				Country: 'USA',
			},
			GivenName: 'James',
		},
		response: {
			Customer: {
				domain: 'QBO',
				PrimaryEmailAddr: {
					Address: 'customer@example.com',
				},
				DisplayName: "King's Groceries",
				CurrencyRef: {
					name: 'United States Dollar',
					value: 'USD',
				},
				DefaultTaxCodeRef: {
					value: '2',
				},
				PreferredDeliveryMethod: 'Print',
				GivenName: 'James',
				FullyQualifiedName: "King's Groceries",
				BillWithParent: false,
				Title: 'Mr',
				Job: false,
				BalanceWithJobs: 0,
				PrimaryPhone: {
					FreeFormNumber: '(555) 555-5555',
				},
				Taxable: true,
				MetaData: {
					CreateTime: '2015-07-23T10:58:12-07:00',
					LastUpdatedTime: '2015-07-23T10:58:12-07:00',
				},
				BillAddr: {
					City: 'Mountain View',
					Country: 'USA',
					Line1: '123 Main Street',
					PostalCode: '94042',
					CountrySubDivisionCode: 'CA',
					Id: '112',
				},
				MiddleName: 'B',
				Notes: 'Here are other details.',
				Active: true,
				Balance: 0,
				SyncToken: '0',
				Suffix: 'Jr',
				CompanyName: 'King Groceries',
				FamilyName: 'King',
				PrintOnCheckName: 'King Groceries',
				sparse: false,
				Id: '67',
			},
			time: '2015-07-23T10:58:12.099-07:00',
		},
	},
	'Changeorder.Update0': {
		request: {
			SyncToken: '1',
			AcceptedBy: 'John Smith',
			TxnStatus: 'Accepted',
			AcceptedDate: '2024-09-16',
			LinkedTxn: [
				{
					TxnId: '512',
					TxnType: 'Estimate',
				},
			],
			Line: [
				{
					LinkedTxn: [
						{
							TxnId: '512',
							TxnType: 'Estimate',
						},
					],
					Description:
						'Structural steel — additional load-bearing beam (LB-200)',
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {
						TaxCodeRef: {
							value: 'TAX',
						},
						Qty: 3,
						UnitPrice: 800.0,
						ItemRef: {
							name: 'Structural Materials',
							value: '21',
						},
					},
					LineNum: 1,
					Amount: 2400.0,
					Id: '1',
				},
				{
					LinkedTxn: [
						{
							TxnId: '512',
							TxnType: 'Estimate',
						},
					],
					Description: 'Labor — structural reinforcement installation (20 hrs)',
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {
						TaxCodeRef: {
							value: 'NON',
						},
						Qty: 20,
						UnitPrice: 100.0,
						ItemRef: {
							name: 'Labor',
							value: '7',
						},
					},
					LineNum: 2,
					Amount: 2000.0,
					Id: '2',
				},
				{
					LinkedTxn: [
						{
							TxnId: '512',
							TxnType: 'Estimate',
						},
					],
					Description: 'Permit fee — structural modification',
					DetailType: 'SalesItemLineDetail',
					SalesItemLineDetail: {
						TaxCodeRef: {
							value: 'NON',
						},
						Qty: 1,
						UnitPrice: 350.0,
						ItemRef: {
							name: 'Permit Fees',
							value: '33',
						},
					},
					LineNum: 3,
					Amount: 350.0,
				},
			],
			Id: '621',
		},
		response: {
			ChangeOrder: {
				DocNumber: 'CO-001',
				SyncToken: '2',
				AcceptedBy: 'John Smith',
				TxnStatus: 'Accepted',
				TotalAmt: 4966.0,
				AcceptedDate: '2024-09-16',
				ProjectRef: {
					name: 'Kitchen Renovation - Phase 2',
					value: '39298034',
				},
				LinkedTxn: [
					{
						TxnId: '512',
						TxnType: 'Estimate',
					},
				],
				TxnDate: '2024-09-15',
				Line: [
					{
						LinkedTxn: [
							{
								TxnId: '512',
								TxnType: 'Estimate',
							},
						],
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'TAX',
							},
							Qty: 3,
							UnitPrice: 800.0,
							ItemRef: {
								name: 'Structural Materials',
								value: '21',
							},
						},
						LineNum: 1,
						Amount: 2400.0,
						Id: '1',
					},
					{
						LinkedTxn: [
							{
								TxnId: '512',
								TxnType: 'Estimate',
							},
						],
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'NON',
							},
							Qty: 20,
							UnitPrice: 100.0,
							ItemRef: {
								name: 'Labor',
								value: '7',
							},
						},
						LineNum: 2,
						Amount: 2000.0,
						Id: '2',
					},
					{
						LinkedTxn: [
							{
								TxnId: '512',
								TxnType: 'Estimate',
							},
						],
						DetailType: 'SalesItemLineDetail',
						SalesItemLineDetail: {
							TaxCodeRef: {
								value: 'NON',
							},
							Qty: 1,
							UnitPrice: 350.0,
							ItemRef: {
								name: 'Permit Fees',
								value: '33',
							},
						},
						LineNum: 3,
						Amount: 350.0,
						Id: '3',
					},
				],
				CustomerRef: {
					name: 'Acme Construction Corp',
					value: '58',
				},
				Id: '621',
				TxnTaxDetail: {
					TotalTax: 216.0,
				},
				MetaData: {
					CreateTime: '2024-09-15T08:30:00-07:00',
					LastUpdatedTime: '2024-09-16T11:00:00-07:00',
				},
			},
			time: '2024-09-16T11:00:00.000-07:00',
		},
	},
	'Payment.Update0': {
		request: {
			SyncToken: '0',
			PaymentMethodRef: {
				value: '16',
			},
			ProjectRef: {
				value: '39298045',
			},
			PaymentRefNum: '123456',
			sparse: false,
			Line: [
				{
					Amount: 300,
					LinkedTxn: [
						{
							TxnId: '67',
							TxnType: 'Invoice',
						},
					],
				},
				{
					Amount: 300,
					LinkedTxn: [
						{
							TxnId: '68',
							TxnType: 'CreditMemo',
						},
					],
				},
			],
			CustomerRef: {
				value: '16',
			},
			Id: '69',
			MetaData: {
				CreateTime: '2013-03-13T14:49:21-07:00',
				LastUpdatedTime: '2013-03-13T14:49:21-07:00',
			},
		},
		response: {
			Payment: {
				SyncToken: '1',
				domain: 'QBO',
				PaymentMethodRef: {
					value: '16',
				},
				UnappliedAmt: 0,
				TxnDate: '2013-03-13',
				TotalAmt: 0,
				ProjectRef: {
					value: '39298045',
				},
				PaymentRefNum: '123456',
				sparse: false,
				Line: [
					{
						Amount: 300,
						LinkedTxn: [
							{
								TxnId: '67',
								TxnType: 'Invoice',
							},
						],
					},
					{
						Amount: 300,
						LinkedTxn: [
							{
								TxnId: '68',
								TxnType: 'CreditMemo',
							},
						],
					},
				],
				CustomerRef: {
					value: '16',
				},
				Id: '69',
				MetaData: {
					CreateTime: '2013-03-13T14:49:21-07:00',
					LastUpdatedTime: '2013-03-13T14:49:21-07:00',
				},
			},
			time: '2013-03-13T14:49:41.512-07:00',
		},
	},
};
