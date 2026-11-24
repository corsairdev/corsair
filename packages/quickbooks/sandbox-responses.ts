// Trimmed responses from a QuickBooks sandbox company (Intuit's sample data, names and
// addresses removed), captured 2026-11-23 for sandbox-responses.test.ts. Not imported by the plugin.

export const quickBooksSandboxResponses = {
	billGet: {
		Bill: {
			DueDate: '2026-10-28',
			Balance: 205,
			domain: 'QBO',
			sparse: false,
			Id: '126',
			SyncToken: '0',
			MetaData: {
				CreateTime: '2026-10-28T13:10:36-07:00',
				LastUpdatedTime: '2026-10-28T13:10:36-07:00',
			},
			TxnDate: '2026-10-28',
			CurrencyRef: {
				value: 'USD',
				name: 'Sample',
			},
			LinkedTxn: [],
			Line: [
				{
					Id: '1',
					LineNum: 1,
					Description: 'Fountain Pump',
					Amount: 80,
					LinkedTxn: [],
					DetailType: 'ItemBasedExpenseLineDetail',
					ItemBasedExpenseLineDetail: {
						BillableStatus: 'NotBillable',
						ItemRef: {
							value: '11',
							name: 'Sample',
						},
						UnitPrice: 10,
						Qty: 8,
						TaxCodeRef: {
							value: 'NON',
						},
					},
					CustomExtensions: [],
				},
				{
					Id: '2',
					LineNum: 2,
					Description: 'Rock Fountain',
					Amount: 125,
					LinkedTxn: [],
					DetailType: 'ItemBasedExpenseLineDetail',
					ItemBasedExpenseLineDetail: {
						BillableStatus: 'NotBillable',
						ItemRef: {
							value: '5',
							name: 'Sample',
						},
						UnitPrice: 125,
						Qty: 1,
						TaxCodeRef: {
							value: 'NON',
						},
					},
					CustomExtensions: [],
				},
			],
			VendorRef: {
				value: '46',
				name: 'Sample',
			},
			APAccountRef: {
				value: '33',
				name: 'Sample',
			},
			TotalAmt: 205,
		},
		time: '2026-11-23T00:15:54.171-08:00',
	},
	journalEntryList: {
		QueryResponse: {
			JournalEntry: [
				{
					Adjustment: false,
					TotalAmt: 0,
					domain: 'QBO',
					sparse: false,
					Id: '8',
					SyncToken: '0',
					MetaData: {
						CreateTime: '2026-10-25T10:04:24-07:00',
						LastUpdatedTime: '2026-10-25T10:04:24-07:00',
					},
					TxnDate: '2026-10-25',
					CurrencyRef: {
						value: 'USD',
						name: 'Sample',
					},
					PrivateNote: 'Opening Balance',
					Line: [
						{
							Id: '0',
							Description: 'Opening Balance',
							Amount: 25000,
							DetailType: 'JournalEntryLineDetail',
							JournalEntryLineDetail: {
								PostingType: 'Credit',
								AccountRef: {
									value: '44',
									name: 'Sample',
								},
							},
							CustomExtensions: [],
						},
						{
							Id: '1',
							Description: 'Opening Balance',
							Amount: 25000,
							DetailType: 'JournalEntryLineDetail',
							JournalEntryLineDetail: {
								PostingType: 'Debit',
								AccountRef: {
									value: '34',
									name: 'Sample',
								},
							},
							CustomExtensions: [],
						},
					],
					TxnTaxDetail: {},
				},
			],
			startPosition: 1,
			maxResults: 1,
			totalCount: 1,
		},
		time: '2026-11-23T00:15:54.644-08:00',
	},
	purchaseOrderGet: {
		PurchaseOrder: {
			EmailStatus: 'NotSet',
			POStatus: 'Closed',
			domain: 'QBO',
			sparse: false,
			Id: '125',
			SyncToken: '1',
			MetaData: {
				CreateTime: '2026-10-28T13:10:14-07:00',
				LastUpdatedTime: '2026-10-28T13:10:36-07:00',
			},
			CustomField: [],
			DocNumber: '1004',
			TxnDate: '2026-10-28',
			CurrencyRef: {
				value: 'USD',
				name: 'Sample',
			},
			LinkedTxn: [
				{
					TxnId: '126',
					TxnType: 'Bill',
				},
			],
			Line: [
				{
					Id: '1',
					LineNum: 1,
					Description: 'Fountain Pump',
					Amount: 80,
					DetailType: 'ItemBasedExpenseLineDetail',
					ItemBasedExpenseLineDetail: {
						BillableStatus: 'NotBillable',
						ItemRef: {
							value: '11',
							name: 'Sample',
						},
						UnitPrice: 10,
						Qty: 8,
						TaxCodeRef: {
							value: 'NON',
						},
					},
					CustomExtensions: [],
				},
				{
					Id: '2',
					LineNum: 2,
					Description: 'Rock Fountain',
					Amount: 125,
					DetailType: 'ItemBasedExpenseLineDetail',
					ItemBasedExpenseLineDetail: {
						BillableStatus: 'NotBillable',
						ItemRef: {
							value: '5',
							name: 'Sample',
						},
						UnitPrice: 125,
						Qty: 1,
						TaxCodeRef: {
							value: 'NON',
						},
					},
					CustomExtensions: [],
				},
			],
			VendorRef: {
				value: '46',
				name: 'Sample',
			},
			APAccountRef: {
				value: '33',
				name: 'Sample',
			},
			TotalAmt: 205,
		},
		time: '2026-11-23T00:15:55.137-08:00',
	},
	taxClassificationGet: {
		TaxClassification: {
			Code: 'EUC-09021125',
			Name: 'Gas or diesel fuel tank',
			Description: 'Gas or diesel fuel tank',
			Level: '3',
			ParentRef: {
				value: '9212277233',
				name: 'Disaster preparedness supplies',
			},
			ApplicableTo: ['Inventory', 'NonInventory'],
			Id: 'EUC-09021125-V1-00120000',
		},
		time: '2026-11-23T00:15:55.607-08:00',
	},
	taxClassificationListByLevel: {
		QueryResponse: {
			TaxClassification: [
				{
					Code: '0093611972',
					Name: 'Miscellaneous',
					Description: 'Miscellaneous',
					Level: '1',
					ApplicableTo: ['Inventory', 'NonInventory', 'Service'],
					Id: '0093611972',
				},
				{
					Code: '4100590950',
					Name: 'Clothing',
					Description: 'Clothing',
					Level: '1',
					ApplicableTo: ['Inventory', 'NonInventory'],
					Id: '4100590950',
				},
			],
		},
	},
	purchaseOrderCreateAccountLine: {
		PurchaseOrder: {
			EmailStatus: 'NotSet',
			POStatus: 'Open',
			domain: 'QBO',
			sparse: false,
			Id: '169',
			SyncToken: '0',
			MetaData: {
				CreateTime: '2026-11-23T00:15:56-08:00',
				LastUpdatedTime: '2026-11-23T00:15:56-08:00',
			},
			CustomField: [],
			DocNumber: '1007',
			TxnDate: '2026-11-23',
			CurrencyRef: {
				value: 'USD',
				name: 'Sample',
			},
			LinkedTxn: [],
			Line: [
				{
					Id: '1',
					LineNum: 1,
					Amount: 30,
					DetailType: 'AccountBasedExpenseLineDetail',
					AccountBasedExpenseLineDetail: {
						AccountRef: {
							value: '7',
							name: 'Sample',
						},
						BillableStatus: 'NotBillable',
						TaxCodeRef: {
							value: 'NON',
						},
					},
					CustomExtensions: [],
				},
			],
			VendorRef: {
				value: '56',
				name: 'Sample',
			},
			APAccountRef: {
				value: '33',
				name: 'Sample',
			},
			TotalAmt: 30,
		},
		time: '2026-11-23T00:15:56.393-08:00',
	},
} as const;
