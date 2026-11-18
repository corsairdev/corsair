import { z } from 'zod';
import { outBoolean, outNumber, outText } from './json-value';

const text = z.string().min(1);
const positiveInteger = z.number().int().positive();
const optionalNumber = z.number().nullable().optional();
const optionalText = z.string().nullable().optional();
const period = z.enum(['annual', 'quarter']);

// Finage documents a stable subset for these records, while the remaining
// fields vary across statements and plans. Known fields stay typed and all
// additional provider JSON values are validated recursively.
type FinageJsonValue =
	| string
	| number
	| boolean
	| null
	| FinageJsonValue[]
	| { [key: string]: FinageJsonValue };
const jsonValue: z.ZodType<FinageJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(jsonValue),
		z.record(z.string(), jsonValue),
	]),
);

const balanceSheetSchema = z
	.object({
		symbol: outText,
		date: outText,
		period: outText,
		fillingDate: optionalText,
		filingDate: optionalText,
		acceptedDate: optionalText,
		link: optionalText,
		finalLink: optionalText,
		cashAndCashEquivalents: optionalNumber,
		shortTermInvestments: optionalNumber,
		cashAndShortTermInvestments: optionalNumber,
		netReceivables: optionalNumber,
		inventory: optionalNumber,
		otherCurrentAssets: optionalNumber,
		totalCurrentAssets: optionalNumber,
		propertyPlantEquipmentNet: optionalNumber,
		goodwill: optionalNumber,
		intangibleAssets: optionalNumber,
		goodwillAndIntangibleAssets: optionalNumber,
		doubleTermInvestments: optionalNumber,
		taxAssets: optionalNumber,
		otherNonCurrentAssets: optionalNumber,
		totalNonCurrentAssets: optionalNumber,
		otherAssets: optionalNumber,
		longTermInvestments: optionalNumber,
		totalAssets: optionalNumber,
		accountPayables: optionalNumber,
		shortTermDebt: optionalNumber,
		taxPayables: optionalNumber,
		deferredRevenue: optionalNumber,
		otherCurrentLiabilities: optionalNumber,
		totalCurrentLiabilities: optionalNumber,
		longTermDebt: optionalNumber,
		doubleTermDebt: optionalNumber,
		deferredRevenueNonCurrent: optionalNumber,
		deferredTaxLiabilitiesNonCurrent: optionalNumber,
		otherNonCurrentLiabilities: optionalNumber,
		totalNonCurrentLiabilities: optionalNumber,
		otherLiabilities: optionalNumber,
		totalLiabilities: optionalNumber,
		commonStock: optionalNumber,
		retainedEarnings: optionalNumber,
		accumulatedOtherComprehensiveIncomeLoss: optionalNumber,
		othertotalStockholdersEquity: optionalNumber,
		totalStockholdersEquity: optionalNumber,
		totalLiabilitiesAndStockholdersEquity: optionalNumber,
		totalInvestments: optionalNumber,
		totalDebt: optionalNumber,
		netDebt: optionalNumber,
	})
	.catchall(jsonValue);

const cashFlowSchema = z
	.object({
		symbol: outText,
		date: outText,
		period: outText,
		fillingDate: optionalText,
		filingDate: optionalText,
		acceptedDate: optionalText,
		link: optionalText,
		finalLink: optionalText,
		netIncome: optionalNumber,
		depreciationAndAmortization: optionalNumber,
		deferredIncomeTax: optionalNumber,
		stockBasedCompensation: optionalNumber,
		changeInWorkingCapital: optionalNumber,
		accountsReceivables: optionalNumber,
		inventory: optionalNumber,
		accountsPayables: optionalNumber,
		otherWorkingCapital: optionalNumber,
		otherNonCashItems: optionalNumber,
		netCashProvidedByOperatingActivities: optionalNumber,
		investmentsInPropertyPlantAndEquipment: optionalNumber,
		acquisitionsNet: optionalNumber,
		purchasesOfInvestments: optionalNumber,
		salesMaturitiesOfInvestments: optionalNumber,
		otherInvestingActivites: optionalNumber,
		netCashUsedForInvestingActivites: optionalNumber,
		debtRepayment: optionalNumber,
		commonStockIssued: optionalNumber,
		commonStockRepurchased: optionalNumber,
		dividendsPaid: optionalNumber,
		otherFinancingActivites: optionalNumber,
		netCashUsedProvidedByFinancingActivities: optionalNumber,
		effectOfForexChangesOnCash: optionalNumber,
		netChangeInCash: optionalNumber,
		cashAtEndOfPeriod: optionalNumber,
		cashAtBeginningOfPeriod: optionalNumber,
		operatingCashFlow: optionalNumber,
		capitalExpenditure: optionalNumber,
		freeCashFlow: optionalNumber,
	})
	.catchall(jsonValue);

const incomeStatementSchema = z
	.object({
		symbol: outText,
		date: outText,
		period: outText,
		fillingDate: optionalText,
		filingDate: optionalText,
		acceptedDate: optionalText,
		link: optionalText,
		finalLink: optionalText,
		revenue: optionalNumber,
		costOfRevenue: optionalNumber,
		grossProfit: optionalNumber,
		grossProfitRatio: optionalNumber,
		researchAndDevelopmentExpenses: optionalNumber,
		generalAndAdministrativeExpenses: optionalNumber,
		sellingAndMarketingExpenses: optionalNumber,
		otherExpenses: optionalNumber,
		operatingExpenses: optionalNumber,
		costAndExpenses: optionalNumber,
		interestExpense: optionalNumber,
		depreciationAndAmortization: optionalNumber,
		ebitda: optionalNumber,
		ebitdaratio: optionalNumber,
		ebitdaRatio: optionalNumber,
		operatingIncome: optionalNumber,
		operatingIncomeRatio: optionalNumber,
		totalOtherIncomeExpensesNet: optionalNumber,
		incomeBeforeTax: optionalNumber,
		incomeBeforeTaxRatio: optionalNumber,
		incomeTaxExpense: optionalNumber,
		netIncome: optionalNumber,
		netIncomeRatio: optionalNumber,
		eps: optionalNumber,
		epsdiluted: optionalNumber,
		epsDiluted: optionalNumber,
		weightedAverageShsOut: optionalNumber,
		weightedAverageShsOutDil: optionalNumber,
	})
	.catchall(jsonValue);

const financialRatioSchema = z
	.object({
		symbol: outText,
		date: outText,
		fiscalYear: outText,
		period: outText,
		reportedCurrency: outText,
		grossProfitMargin: optionalNumber,
		ebitMargin: optionalNumber,
		ebitdaMargin: optionalNumber,
		operatingProfitMargin: optionalNumber,
		pretaxProfitMargin: optionalNumber,
		continuousOperationsProfitMargin: optionalNumber,
		netProfitMargin: optionalNumber,
		bottomLineProfitMargin: optionalNumber,
		receivablesTurnover: optionalNumber,
		payablesTurnover: optionalNumber,
		inventoryTurnover: optionalNumber,
		fixedAssetTurnover: optionalNumber,
		assetTurnover: optionalNumber,
		currentRatio: optionalNumber,
		quickRatio: optionalNumber,
		solvencyRatio: optionalNumber,
		cashRatio: optionalNumber,
		priceToEarningsRatio: optionalNumber,
		priceToEarningsGrowthRatio: optionalNumber,
		forwardPriceToEarningsGrowthRatio: optionalNumber,
		priceToBookRatio: optionalNumber,
		priceToSalesRatio: optionalNumber,
		priceToFreeCashFlowRatio: optionalNumber,
		priceToOperatingCashFlowRatio: optionalNumber,
		debtToAssetsRatio: optionalNumber,
		debtToEquityRatio: optionalNumber,
		debtToCapitalRatio: optionalNumber,
		longTermDebtToCapitalRatio: optionalNumber,
		financialLeverageRatio: optionalNumber,
		workingCapitalTurnoverRatio: optionalNumber,
		operatingCashFlowRatio: optionalNumber,
		operatingCashFlowSalesRatio: optionalNumber,
		freeCashFlowOperatingCashFlowRatio: optionalNumber,
		debtServiceCoverageRatio: optionalNumber,
		interestCoverageRatio: optionalNumber,
		shortTermOperatingCashFlowCoverageRatio: optionalNumber,
		operatingCashFlowCoverageRatio: optionalNumber,
		capitalExpenditureCoverageRatio: optionalNumber,
		dividendPaidAndCapexCoverageRatio: optionalNumber,
		dividendPayoutRatio: optionalNumber,
		dividendYield: optionalNumber,
		dividendYieldPercentage: optionalNumber,
		revenuePerShare: optionalNumber,
		netIncomePerShare: optionalNumber,
		interestDebtPerShare: optionalNumber,
		cashPerShare: optionalNumber,
		bookValuePerShare: optionalNumber,
		tangibleBookValuePerShare: optionalNumber,
		shareholdersEquityPerShare: optionalNumber,
		operatingCashFlowPerShare: optionalNumber,
		capexPerShare: optionalNumber,
		freeCashFlowPerShare: optionalNumber,
		netIncomePerEBT: optionalNumber,
		ebtPerEbit: optionalNumber,
		priceToFairValue: optionalNumber,
		debtToMarketCap: optionalNumber,
		effectiveTaxRate: optionalNumber,
		enterpriseValueMultiple: optionalNumber,
	})
	.catchall(jsonValue);

// Finage documents this body twice: "Forex Signal API" shows the bare object,
// "Forex Technical Indicators" shows the same route with the object inside an
// array. Accept both documented forms.
const signalItem = z.object({
	timestamp: outText,
	symbol: outText,
	// A plain string and an unbounded number: a signal label or confidence scale
	// Finage adds later must not fail the response.
	signal: outText,
	confidence: outNumber,
	indicators: z.object({
		sma_20: outNumber,
		sma_50: outNumber,
		rsi: outNumber,
		macd: outNumber,
		macd_signal: outNumber,
		macd_diff: outNumber,
		bollinger_high: outNumber,
		bollinger_low: outNumber,
		ma_crossover: outBoolean,
		macd_cross: outBoolean,
	}),
	price: outNumber,
});
const signalResponse = z.union([signalItem, z.array(signalItem)]);

export const FinageFundamentalInputSchemas = {
	getBalanceSheetStatements: z.object({
		symbol: text,
		limit: positiveInteger,
		period,
	}),
	getCashFlowStatements: z.object({
		symbol: text,
		limit: positiveInteger.optional(),
		period: period.optional(),
	}),
	getDelistedCompanies: z.object({ limit: positiveInteger.optional() }),
	getDividendsCalendar: z.object({ from: text, to: text }),
	getEarningsCalendar: z.object({}),
	getEconomicCalendar: z.object({ from: text, to: text }),
	getFinancialRatios: z.object({ symbol: text }),
	getForexSignal: z.object({
		interval: z.enum(['daily', 'weekly']),
		symbol: text,
	}),
	getHistoricalDividendsCalendar: z.object({ symbol: text }),
	getHistoricalStockSplitCalendar: z.object({ symbol: text }),
	getIncomeStatements: z.object({
		symbol: text,
		limit: positiveInteger,
		period,
		exchange_code: text.optional(),
	}),
	getInstitutionalHolders: z.object({ symbol: text }),
	getIpoCalendar: z.object({ from: text, to: text }),
	getMutualFundHolders: z.object({ symbol: text }),
	getSharesFloat: z.object({ symbol: text }),
	getStockSplitCalendar: z.object({ from: text, to: text }),
	getUsStocksSignal: z.object({
		interval: z.enum(['daily', 'weekly']),
		symbol: text,
	}),
} as const;

// Calendar, holder and float rows come from filings and exchange feeds, and the
// reference itself shows null values in them (the earnings calendar example).
// Only the field that identifies a row stays required: any other value may be
// null, blank or absent without failing the whole list.
export const FinageFundamentalOutputSchemas = {
	getBalanceSheetStatements: z.array(balanceSheetSchema),
	getCashFlowStatements: z.array(cashFlowSchema),
	getDelistedCompanies: z.array(
		z.object({
			symbol: outText,
			company_name: optionalText,
			exchange: optionalText,
			ipo_date: optionalText,
			delisted_date: optionalText,
		}),
	),
	getDividendsCalendar: z.array(
		z.object({
			symbol: outText,
			label: optionalText,
			adj_dividend: optionalNumber,
			date: outText,
		}),
	),
	getEarningsCalendar: z.array(
		z.object({
			symbol: outText,
			eps: optionalNumber,
			estimated_eps: optionalNumber,
			revenue: optionalNumber,
			estimated_revenue: optionalNumber,
			time: optionalText,
			date: outText,
		}),
	),
	getEconomicCalendar: z.array(
		z.object({
			event: outText,
			date: outText,
			country: optionalText,
			countryFlag: optionalText,
			actual: optionalNumber,
			previous: optionalNumber,
			change: optionalNumber,
			changePercentage: optionalNumber,
			estimate: optionalNumber,
		}),
	),
	getFinancialRatios: z.array(financialRatioSchema),
	getForexSignal: signalResponse,
	getHistoricalDividendsCalendar: z.array(
		z.object({
			label: optionalText,
			adj_dividend: optionalNumber,
			dividend: optionalNumber,
			record_date: optionalText,
			payment_date: optionalText,
			declaration_date: optionalText,
			date: outText,
		}),
	),
	getHistoricalStockSplitCalendar: z.array(
		z.object({
			numerator_factor: optionalNumber,
			denominator_factor: optionalNumber,
			label: optionalText,
			date: outText,
		}),
	),
	getIncomeStatements: z.array(incomeStatementSchema),
	getInstitutionalHolders: z.array(
		z.object({
			holder: outText,
			shares: optionalNumber,
			change: optionalNumber,
			report_date: optionalText,
		}),
	),
	getIpoCalendar: z.array(
		z.object({
			symbol: outText,
			date: outText,
			exchange: optionalText,
			status: optionalText,
			shares: optionalNumber,
			price_range: optionalText,
			market_cap: optionalNumber,
			company: optionalText,
		}),
	),
	getMutualFundHolders: z.array(
		z.object({
			holder: outText,
			shares: optionalNumber,
			change: optionalNumber,
			report_date: optionalText,
			weight_percentage: optionalNumber,
		}),
	),
	getSharesFloat: z.array(
		z.object({
			symbol: outText,
			public_float: optionalNumber,
			stock_float: optionalNumber,
			outstanding_shares: optionalNumber,
			date: optionalText,
		}),
	),
	getStockSplitCalendar: z.array(
		z.object({
			symbol: outText,
			numerator_factor: optionalNumber,
			denominator_factor: optionalNumber,
			label: optionalText,
			date: outText,
		}),
	),
	getUsStocksSignal: signalResponse,
} as const;
