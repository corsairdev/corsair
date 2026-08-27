import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Copy supported insights by target playground ID */
/** Official: PUT /api/v2/genai/playgrounds/{targetPlaygroundId}/supportedInsights/{sourcePlaygroundId}/ (`copy_supported_insights_playgrounds__targetPlaygroundId__supportedInsights__sourcePlaygroundId___put`) */
export const copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut: DatarobotEndpoints['copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{targetPlaygroundId}/supportedInsights/{sourcePlaygroundId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['targetPlaygroundId', 'sourcePlaygroundId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create chat */
/** Official: POST /api/v2/genai/chats/ (`create_chat_chats__post`) */
export const createChatChatsPost: DatarobotEndpoints['createChatChatsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chats/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createChatChatsPost.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createChatChatsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create playground prompt trace dataset by playground ID */
/** Official: POST /api/v2/genai/playgrounds/{playgroundId}/traceDatasets/ (`create_chat_export_job_playgrounds__playgroundId__traceDatasets__post`) */
export const createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost: DatarobotEndpoints['createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/traceDatasets/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create chat prompt */
/** Official: POST /api/v2/genai/chatPrompts/ (`create_chat_prompt_chatPrompts__post`) */
export const createChatPromptChatPromptsPost: DatarobotEndpoints['createChatPromptChatPromptsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chatPrompts/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createChatPromptChatPromptsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createChatPromptChatPromptsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create comparison chat */
/** Official: POST /api/v2/genai/comparisonChats/ (`create_comparison_chat_comparisonChats__post`) */
export const createComparisonChatComparisonChatsPost: DatarobotEndpoints['createComparisonChatComparisonChatsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/comparisonChats/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createComparisonChatComparisonChatsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createComparisonChatComparisonChatsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create comparison prompt */
/** Official: POST /api/v2/genai/comparisonPrompts/ (`create_comparison_prompt_comparisonPrompts__post`) */
export const createComparisonPromptComparisonPromptsPost: DatarobotEndpoints['createComparisonPromptComparisonPromptsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/comparisonPrompts/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createComparisonPromptComparisonPromptsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createComparisonPromptComparisonPromptsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create cost metric configuration */
/** Official: POST /api/v2/genai/costMetricConfigurations/ (`create_cost_metric_configuration_costMetricConfigurations__post`) */
export const createCostMetricConfigurationCostMetricConfigurationsPost: DatarobotEndpoints['createCostMetricConfigurationCostMetricConfigurationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/costMetricConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCostMetricConfigurationCostMetricConfigurationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCostMetricConfigurationCostMetricConfigurationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Validate custom model embedding */
/** Official: POST /api/v2/genai/customModelEmbeddingValidations/ (`create_custom_model_embedding_validation_customModelEmbeddingValidations__post`) */
export const createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost: DatarobotEndpoints['createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Validate custom model LLM */
/** Official: POST /api/v2/genai/customModelLLMValidations/ (`create_custom_model_llm_validation_customModelLLMValidations__post`) */
export const createCustomModelLlmValidationCustomModelLLMValidationsPost: DatarobotEndpoints['createCustomModelLlmValidationCustomModelLLMValidationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCustomModelLlmValidationCustomModelLLMValidationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCustomModelLlmValidationCustomModelLLMValidationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Validate custom model vector database */
/** Official: POST /api/v2/genai/customModelVectorDatabaseValidations/ (`create_custom_model_vector_database_validation_customModelVectorDatabaseValidations__post`) */
export const createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost: DatarobotEndpoints['createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a vector databases from a custom model deployment */
/** Official: POST /api/v2/genai/vectorDatabases/fromCustomModelDeployment/ (`create_custom_model_vector_database_vectorDatabases_fromCustomModelDeployment__post`) */
export const createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost: DatarobotEndpoints['createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/fromCustomModelDeployment/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model version */
/** Official: POST /api/v2/genai/customModelVersions/ (`create_custom_model_version_customModelVersions__post`) */
export const createCustomModelVersionCustomModelVersionsPost: DatarobotEndpoints['createCustomModelVersionCustomModelVersionsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVersions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createCustomModelVersionCustomModelVersionsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createCustomModelVersionCustomModelVersionsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create evaluation dataset configuration */
/** Official: POST /api/v2/genai/evaluationDatasetConfigurations/ (`create_evaluation_dataset_configuration_evaluationDatasetConfigurations__post`) */
export const createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost: DatarobotEndpoints['createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create evaluation dataset metric aggregation */
/** Official: POST /api/v2/genai/evaluationDatasetMetricAggregations/ (`create_evaluation_dataset_metric_aggregation_evaluationDatasetMetricAggregations__post`) */
export const createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost: DatarobotEndpoints['createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetMetricAggregations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a LLM blueprints from a chat prompt */
/** Official: POST /api/v2/genai/llmBlueprints/fromChatPrompt/ (`create_from_chat_prompt_llmBlueprints_fromChatPrompt__post`) */
export const createFromChatPromptLlmBlueprintsFromChatPromptPost: DatarobotEndpoints['createFromChatPromptLlmBlueprintsFromChatPromptPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmBlueprints/fromChatPrompt/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createFromChatPromptLlmBlueprintsFromChatPromptPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createFromChatPromptLlmBlueprintsFromChatPromptPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Duplicate LLM blueprint */
/** Official: POST /api/v2/genai/llmBlueprints/fromLLMBlueprint/ (`create_from_llm_blueprint_llmBlueprints_fromLLMBlueprint__post`) */
export const createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost: DatarobotEndpoints['createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmBlueprints/fromLLMBlueprint/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create LLM blueprint */
/** Official: POST /api/v2/genai/llmBlueprints/ (`create_llm_blueprint_llmBlueprints__post`) */
export const createLlmBlueprintLlmBlueprintsPost: DatarobotEndpoints['createLlmBlueprintLlmBlueprintsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmBlueprints/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createLlmBlueprintLlmBlueprintsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createLlmBlueprintLlmBlueprintsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create LLM test configuration */
/** Official: POST /api/v2/genai/llmTestConfigurations/ (`create_llm_test_configuration_llmTestConfigurations__post`) */
export const createLlmTestConfigurationLlmTestConfigurationsPost: DatarobotEndpoints['createLlmTestConfigurationLlmTestConfigurationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createLlmTestConfigurationLlmTestConfigurationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createLlmTestConfigurationLlmTestConfigurationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create LLM test result */
/** Official: POST /api/v2/genai/llmTestResults/ (`create_llm_test_result_llmTestResults__post`) */
export const createLlmTestResultLlmTestResultsPost: DatarobotEndpoints['createLlmTestResultLlmTestResultsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmTestResults/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createLlmTestResultLlmTestResultsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createLlmTestResultLlmTestResultsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create LLM test suite */
/** Official: POST /api/v2/genai/llmTestSuites/ (`create_llm_test_suite_llmTestSuites__post`) */
export const createLlmTestSuiteLlmTestSuitesPost: DatarobotEndpoints['createLlmTestSuiteLlmTestSuitesPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmTestSuites/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createLlmTestSuiteLlmTestSuitesPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createLlmTestSuiteLlmTestSuitesPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create OOTB metric configuration by playground ID */
/** Official: POST /api/v2/genai/playgrounds/{playgroundId}/ootbMetricConfigurations/ (`create_ootb_metric_configuration_playgrounds__playgroundId__ootbMetricConfigurations__post`) */
export const createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost: DatarobotEndpoints['createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/ootbMetricConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create playground */
/** Official: POST /api/v2/genai/playgrounds/ (`create_playground_playgrounds__post`) */
export const createPlaygroundPlaygroundsPost: DatarobotEndpoints['createPlaygroundPlaygroundsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/playgrounds/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createPlaygroundPlaygroundsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createPlaygroundPlaygroundsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create prompt template */
/** Official: POST /api/v2/genai/promptTemplates/ (`create_prompt_template_promptTemplates__post`) */
export const createPromptTemplatePromptTemplatesPost: DatarobotEndpoints['createPromptTemplatePromptTemplatesPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/promptTemplates/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createPromptTemplatePromptTemplatesPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createPromptTemplatePromptTemplatesPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create prompt template version by prompt template ID */
/** Official: POST /api/v2/genai/promptTemplates/{promptTemplateId}/versions/ (`create_prompt_template_version_promptTemplates__promptTemplateId__versions__post`) */
export const createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost: DatarobotEndpoints['createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/promptTemplates/{promptTemplateId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['promptTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Validate sidecar model metric */
/** Official: POST /api/v2/genai/sidecarModelMetricValidations/ (`create_sidecar_model_metric_validation_sidecarModelMetricValidations__post`) */
export const createSidecarModelMetricValidationSidecarModelMetricValidationsPost: DatarobotEndpoints['createSidecarModelMetricValidationSidecarModelMetricValidationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createSidecarModelMetricValidationSidecarModelMetricValidationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createSidecarModelMetricValidationSidecarModelMetricValidationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model version by vector database ID */
/** Official: POST /api/v2/genai/vectorDatabases/{vectorDatabaseId}/customModelVersions/ (`create_vector_database_custom_model_version_vectorDatabases__vectorDatabaseId__customModelVersions__post`) */
export const createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost: DatarobotEndpoints['createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/customModelVersions/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create new custom model version by vector database ID */
/** Official: POST /api/v2/genai/vectorDatabases/{vectorDatabaseId}/deployments/ (`create_vector_database_deployment_vectorDatabases__vectorDatabaseId__deployments__post`) */
export const createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost: DatarobotEndpoints['createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/deployments/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create vector database */
/** Official: POST /api/v2/genai/vectorDatabases/ (`create_vector_database_vectorDatabases__post`) */
export const createVectorDatabaseVectorDatabasesPost: DatarobotEndpoints['createVectorDatabaseVectorDatabasesPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/vectorDatabases/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.createVectorDatabaseVectorDatabasesPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.createVectorDatabaseVectorDatabasesPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete chat by chat ID */
/** Official: DELETE /api/v2/genai/chats/{chatId}/ (`delete_chat_chats__chatId___delete`) */
export const deleteChatChatsChatIdDelete: DatarobotEndpoints['deleteChatChatsChatIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chats/{chatId}/', input);
		const { query, body } = splitDatarobotInput(input, ['chatId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteChatChatsChatIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteChatChatsChatIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete chat prompt by chat prompt ID */
/** Official: DELETE /api/v2/genai/chatPrompts/{chatPromptId}/ (`delete_chat_prompt_chatPrompts__chatPromptId___delete`) */
export const deleteChatPromptChatPromptsChatPromptIdDelete: DatarobotEndpoints['deleteChatPromptChatPromptsChatPromptIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/chatPrompts/{chatPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['chatPromptId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteChatPromptChatPromptsChatPromptIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteChatPromptChatPromptsChatPromptIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete comparison chat by comparison chat ID */
/** Official: DELETE /api/v2/genai/comparisonChats/{comparisonChatId}/ (`delete_comparison_chat_comparisonChats__comparisonChatId___delete`) */
export const deleteComparisonChatComparisonChatsComparisonChatIdDelete: DatarobotEndpoints['deleteComparisonChatComparisonChatsComparisonChatIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonChats/{comparisonChatId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonChatId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteComparisonChatComparisonChatsComparisonChatIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteComparisonChatComparisonChatsComparisonChatIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete comparison prompt by comparison prompt ID */
/** Official: DELETE /api/v2/genai/comparisonPrompts/{comparisonPromptId}/ (`delete_comparison_prompt_comparisonPrompts__comparisonPromptId___delete`) */
export const deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete: DatarobotEndpoints['deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonPrompts/{comparisonPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonPromptId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete cost metric configuration by cost metric configuration ID */
/** Official: DELETE /api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/ (`delete_cost_metric_configuration_costMetricConfigurations__costMetricConfigurationId___delete`) */
export const deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete: DatarobotEndpoints['deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['costMetricConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom model embedding validation by validation ID */
/** Official: DELETE /api/v2/genai/customModelEmbeddingValidations/{validationId}/ (`delete_custom_model_embedding_validation_customModelEmbeddingValidations__validationId___delete`) */
export const deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete: DatarobotEndpoints['deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom model LLM validation by validation ID */
/** Official: DELETE /api/v2/genai/customModelLLMValidations/{validationId}/ (`delete_custom_model_llm_validation_customModelLLMValidations__validationId___delete`) */
export const deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete: DatarobotEndpoints['deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom model vector database validation by validation ID */
/** Official: DELETE /api/v2/genai/customModelVectorDatabaseValidations/{validationId}/ (`delete_custom_model_vector_database_validation_customModelVectorDatabaseValidations__validationId___delete`) */
export const deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete: DatarobotEndpoints['deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete evaluation dataset configuration by evaluation dataset configuration ID */
/** Official: DELETE /api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/ (`delete_evaluation_dataset_configuration_evaluationDatasetConfigurations__evaluationDatasetConfigurationId___delete`) */
export const deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete: DatarobotEndpoints['deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['evaluationDatasetConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete evaluation dataset metric aggregation */
/** Official: DELETE /api/v2/genai/evaluationDatasetMetricAggregations/ (`delete_evaluation_dataset_metric_aggregation_evaluationDatasetMetricAggregations__delete`) */
export const deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete: DatarobotEndpoints['deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetMetricAggregations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['llmBlueprintIds', 'chatIds'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete LLM blueprint by LLM blueprint ID */
/** Official: DELETE /api/v2/genai/llmBlueprints/{llmBlueprintId}/ (`delete_llm_blueprint_llmBlueprints__llmBlueprintId___delete`) */
export const deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete: DatarobotEndpoints['deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmBlueprints/{llmBlueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete LLM test configuration by LLM test configuration ID */
/** Official: DELETE /api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/ (`delete_llm_test_configuration_llmTestConfigurations__llmTestConfigurationId___delete`) */
export const deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete: DatarobotEndpoints['deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['llmTestConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete LLM test result by LLM test result ID */
/** Official: DELETE /api/v2/genai/llmTestResults/{llmTestResultId}/ (`delete_llm_test_result_llmTestResults__llmTestResultId___delete`) */
export const deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete: DatarobotEndpoints['deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestResults/{llmTestResultId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmTestResultId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete LLM test suite by LLM test suite ID */
/** Official: DELETE /api/v2/genai/llmTestSuites/{llmTestSuiteId}/ (`delete_llm_test_suite_llmTestSuites__llmTestSuiteId___delete`) */
export const deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete: DatarobotEndpoints['deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestSuites/{llmTestSuiteId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmTestSuiteId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a NeMo metric by playground ID */
/** Official: DELETE /api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/{metricId}/ (`delete_nemo_metric_playgrounds__playgroundId__nemoConfiguration__metricId___delete`) */
export const deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete: DatarobotEndpoints['deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/{metricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['playgroundId', 'metricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete OOTB metric configuration by ootb metric configuration ID */
/** Official: DELETE /api/v2/genai/ootbMetricConfigurations/{ootbMetricConfigurationId}/ (`delete_ootb_metric_configuration_ootbMetricConfigurations__ootbMetricConfigurationId___delete`) */
export const deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete: DatarobotEndpoints['deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/ootbMetricConfigurations/{ootbMetricConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['ootbMetricConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the NeMo configuration by playground ID */
/** Official: DELETE /api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/ (`delete_playground_nemo_configuration_playgrounds__playgroundId__nemoConfiguration__delete`) */
export const deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete: DatarobotEndpoints['deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete playground by playground ID */
/** Official: DELETE /api/v2/genai/playgrounds/{playgroundId}/ (`delete_playground_playgrounds__playgroundId___delete`) */
export const deletePlaygroundPlaygroundsPlaygroundIdDelete: DatarobotEndpoints['deletePlaygroundPlaygroundsPlaygroundIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletePlaygroundPlaygroundsPlaygroundIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deletePlaygroundPlaygroundsPlaygroundIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete existing search study by ID by search study ID */
/** Official: DELETE /api/v2/genai/syftrSearch/{searchStudyId}/ (`delete_search_study_syftrSearch__searchStudyId___delete`) */
export const deleteSearchStudySyftrSearchSearchStudyIdDelete: DatarobotEndpoints['deleteSearchStudySyftrSearchSearchStudyIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/syftrSearch/{searchStudyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['searchStudyId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteSearchStudySyftrSearchSearchStudyIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteSearchStudySyftrSearchSearchStudyIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete sidecar model metric validation by validation ID */
/** Official: DELETE /api/v2/genai/sidecarModelMetricValidations/{validationId}/ (`delete_sidecar_model_metric_validation_sidecarModelMetricValidations__validationId___delete`) */
export const deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete: DatarobotEndpoints['deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete vector database by vector database ID */
/** Official: DELETE /api/v2/genai/vectorDatabases/{vectorDatabaseId}/ (`delete_vector_database_vectorDatabases__vectorDatabaseId___delete`) */
export const deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete: DatarobotEndpoints['deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve text chunks and embeddings by vector database ID */
/** Official: GET /api/v2/genai/vectorDatabases/{vectorDatabaseId}/textAndEmbeddings/ (`download_text_and_embeddings_asset_vectorDatabases__vectorDatabaseId__textAndEmbeddings__get`) */
export const downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet: DatarobotEndpoints['downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/textAndEmbeddings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			['part'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit chat by chat ID */
/** Official: PATCH /api/v2/genai/chats/{chatId}/ (`edit_chat_chats__chatId___patch`) */
export const editChatChatsChatIdPatch: DatarobotEndpoints['editChatChatsChatIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chats/{chatId}/', input);
		const { query, body } = splitDatarobotInput(input, ['chatId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.editChatChatsChatIdPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.editChatChatsChatIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit comparison chat by comparison chat ID */
/** Official: PATCH /api/v2/genai/comparisonChats/{comparisonChatId}/ (`edit_comparison_chat_comparisonChats__comparisonChatId___patch`) */
export const editComparisonChatComparisonChatsComparisonChatIdPatch: DatarobotEndpoints['editComparisonChatComparisonChatsComparisonChatIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonChats/{comparisonChatId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonChatId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.editComparisonChatComparisonChatsComparisonChatIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.editComparisonChatComparisonChatsComparisonChatIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit LLM test configuration by LLM test configuration ID */
/** Official: PATCH /api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/ (`edit_llm_test_configuration_llmTestConfigurations__llmTestConfigurationId___patch`) */
export const editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch: DatarobotEndpoints['editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['llmTestConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit LLM test suite by LLM test suite ID */
/** Official: PATCH /api/v2/genai/llmTestSuites/{llmTestSuiteId}/ (`edit_llm_test_suite_llmTestSuites__llmTestSuiteId___patch`) */
export const editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch: DatarobotEndpoints['editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestSuites/{llmTestSuiteId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmTestSuiteId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit search study by search study ID */
/** Official: PATCH /api/v2/genai/syftrSearch/{searchStudyId}/ (`edit_search_study_syftrSearch__searchStudyId___patch`) */
export const editSearchStudySyftrSearchSearchStudyIdPatch: DatarobotEndpoints['editSearchStudySyftrSearchSearchStudyIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/syftrSearch/{searchStudyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['searchStudyId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.editSearchStudySyftrSearchSearchStudyIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.editSearchStudySyftrSearchSearchStudyIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Export vector database dataset by vector database ID */
/** Official: POST /api/v2/genai/vectorDatabases/{vectorDatabaseId}/datasetExportJobs/ (`export_vector_database_dataset_vectorDatabases__vectorDatabaseId__datasetExportJobs__post`) */
export const exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost: DatarobotEndpoints['exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/datasetExportJobs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request chat completion by custom model ID */
/** Official: POST /api/v2/genai/agents/fromCustomModel/{customModelId}/chat/ (`from_custom_model_chat_agents_fromCustomModel__customModelId__chat__post`) */
export const fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost: DatarobotEndpoints['fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/agents/fromCustomModel/{customModelId}/chat/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Generate synthetic evaluation dataset */
/** Official: POST /api/v2/genai/syntheticEvaluationDatasetGenerations/ (`generate_synthetic_dataset_syntheticEvaluationDatasetGenerations__post`) */
export const generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost: DatarobotEndpoints['generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/syntheticEvaluationDatasetGenerations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve chat by chat ID */
/** Official: GET /api/v2/genai/chats/{chatId}/ (`get_chat_chats__chatId___get`) */
export const getChatChatsChatIdGet: DatarobotEndpoints['getChatChatsChatIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chats/{chatId}/', input);
		const { query, body } = splitDatarobotInput(input, ['chatId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getChatChatsChatIdGet.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getChatChatsChatIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve chat prompt by chat prompt ID */
/** Official: GET /api/v2/genai/chatPrompts/{chatPromptId}/ (`get_chat_prompt_chatPrompts__chatPromptId___get`) */
export const getChatPromptChatPromptsChatPromptIdGet: DatarobotEndpoints['getChatPromptChatPromptsChatPromptIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/chatPrompts/{chatPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['chatPromptId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getChatPromptChatPromptsChatPromptIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getChatPromptChatPromptsChatPromptIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Obtain chat completion response by custom model ID */
/** Official: GET /api/v2/genai/agents/fromCustomModel/{customModelId}/chat/{chatCompletionId}/ (`get_chat_response_agents_fromCustomModel__customModelId__chat__chatCompletionId___get`) */
export const getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet: DatarobotEndpoints['getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/agents/fromCustomModel/{customModelId}/chat/{chatCompletionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'chatCompletionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve comparison chat by comparison chat ID */
/** Official: GET /api/v2/genai/comparisonChats/{comparisonChatId}/ (`get_comparison_chat_comparisonChats__comparisonChatId___get`) */
export const getComparisonChatComparisonChatsComparisonChatIdGet: DatarobotEndpoints['getComparisonChatComparisonChatsComparisonChatIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonChats/{comparisonChatId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonChatId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getComparisonChatComparisonChatsComparisonChatIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getComparisonChatComparisonChatsComparisonChatIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve comparison prompt by comparison prompt ID */
/** Official: GET /api/v2/genai/comparisonPrompts/{comparisonPromptId}/ (`get_comparison_prompt_comparisonPrompts__comparisonPromptId___get`) */
export const getComparisonPromptComparisonPromptsComparisonPromptIdGet: DatarobotEndpoints['getComparisonPromptComparisonPromptsComparisonPromptIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonPrompts/{comparisonPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonPromptId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getComparisonPromptComparisonPromptsComparisonPromptIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getComparisonPromptComparisonPromptsComparisonPromptIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve cost metric configuration by cost metric configuration ID */
/** Official: GET /api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/ (`get_cost_metric_configuration_costMetricConfigurations__costMetricConfigurationId___get`) */
export const getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet: DatarobotEndpoints['getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['costMetricConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom model embedding validation status by validation ID */
/** Official: GET /api/v2/genai/customModelEmbeddingValidations/{validationId}/ (`get_custom_model_embedding_validation_customModelEmbeddingValidations__validationId___get`) */
export const getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet: DatarobotEndpoints['getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom model LLM validation status by validation ID */
/** Official: GET /api/v2/genai/customModelLLMValidations/{validationId}/ (`get_custom_model_llm_validation_customModelLLMValidations__validationId___get`) */
export const getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet: DatarobotEndpoints['getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom model vector database validation status by validation ID */
/** Official: GET /api/v2/genai/customModelVectorDatabaseValidations/{validationId}/ (`get_custom_model_vector_database_validation_customModelVectorDatabaseValidations__validationId___get`) */
export const getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet: DatarobotEndpoints['getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve evaluation dataset configuration by evaluation dataset configuration ID */
/** Official: GET /api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/ (`get_evaluation_dataset_configuration_evaluationDatasetConfigurations__evaluationDatasetConfigurationId___get`) */
export const getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet: DatarobotEndpoints['getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['evaluationDatasetConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve LLM blueprint by LLM blueprint ID */
/** Official: GET /api/v2/genai/llmBlueprints/{llmBlueprintId}/ (`get_llm_blueprint_llmBlueprints__llmBlueprintId___get`) */
export const getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet: DatarobotEndpoints['getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmBlueprints/{llmBlueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get LLM by LLM ID */
/** Official: GET /api/v2/genai/llms/{llmId}/ (`get_llm_llms__llmId___get`) */
export const getLlmLlmsLlmIdGet: DatarobotEndpoints['getLlmLlmsLlmIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llms/{llmId}/', input);
		const { query } = splitDatarobotInput(input, ['llmId'], ['useCaseId']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getLlmLlmsLlmIdGet.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getLlmLlmsLlmIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve LLM test configuration by LLM test configuration ID */
/** Official: GET /api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/ (`get_llm_test_configuration_llmTestConfigurations__llmTestConfigurationId___get`) */
export const getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet: DatarobotEndpoints['getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/{llmTestConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['llmTestConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve LLM test result by LLM test result ID */
/** Official: GET /api/v2/genai/llmTestResults/{llmTestResultId}/ (`get_llm_test_result_llmTestResults__llmTestResultId___get`) */
export const getLlmTestResultLlmTestResultsLlmTestResultIdGet: DatarobotEndpoints['getLlmTestResultLlmTestResultsLlmTestResultIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestResults/{llmTestResultId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmTestResultId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getLlmTestResultLlmTestResultsLlmTestResultIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getLlmTestResultLlmTestResultsLlmTestResultIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve LLM test suite by LLM test suite ID */
/** Official: GET /api/v2/genai/llmTestSuites/{llmTestSuiteId}/ (`get_llm_test_suite_llmTestSuites__llmTestSuiteId___get`) */
export const getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet: DatarobotEndpoints['getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestSuites/{llmTestSuiteId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmTestSuiteId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OOTB metric configuration by ootb metric configuration ID */
/** Official: GET /api/v2/genai/ootbMetricConfigurations/{ootbMetricConfigurationId}/ (`get_ootb_metric_configuration_ootbMetricConfigurations__ootbMetricConfigurationId___get`) */
export const getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet: DatarobotEndpoints['getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/ootbMetricConfigurations/{ootbMetricConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['ootbMetricConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrive the NeMo configuration by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/ (`get_playground_nemo_configuration_playgrounds__playgroundId__nemoConfiguration__get`) */
export const getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet: DatarobotEndpoints['getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve playground by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/ (`get_playground_playgrounds__playgroundId___get`) */
export const getPlaygroundPlaygroundsPlaygroundIdGet: DatarobotEndpoints['getPlaygroundPlaygroundsPlaygroundIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getPlaygroundPlaygroundsPlaygroundIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getPlaygroundPlaygroundsPlaygroundIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get prompt template by prompt template ID */
/** Official: GET /api/v2/genai/promptTemplates/{promptTemplateId}/ (`get_prompt_template_promptTemplates__promptTemplateId___get`) */
export const getPromptTemplatePromptTemplatesPromptTemplateIdGet: DatarobotEndpoints['getPromptTemplatePromptTemplatesPromptTemplateIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/promptTemplates/{promptTemplateId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['promptTemplateId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getPromptTemplatePromptTemplatesPromptTemplateIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getPromptTemplatePromptTemplatesPromptTemplateIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get prompt template version by prompt template ID */
/** Official: GET /api/v2/genai/promptTemplates/{promptTemplateId}/versions/{promptTemplateVersionId}/ (`get_prompt_template_version_promptTemplates__promptTemplateId__versions__promptTemplateVersionId___get`) */
export const getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet: DatarobotEndpoints['getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/promptTemplates/{promptTemplateId}/versions/{promptTemplateVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['promptTemplateId', 'promptTemplateVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get existing search study by ID by search study ID */
/** Official: GET /api/v2/genai/syftrSearch/{searchStudyId}/ (`get_search_study_syftrSearch__searchStudyId___get`) */
export const getSearchStudySyftrSearchSearchStudyIdGet: DatarobotEndpoints['getSearchStudySyftrSearchSearchStudyIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/syftrSearch/{searchStudyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['searchStudyId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSearchStudySyftrSearchSearchStudyIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSearchStudySyftrSearchSearchStudyIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve sidecar model metric validation status by validation ID */
/** Official: GET /api/v2/genai/sidecarModelMetricValidations/{validationId}/ (`get_sidecar_model_metric_validation_sidecarModelMetricValidations__validationId___get`) */
export const getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet: DatarobotEndpoints['getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve job status by status ID */
/** Official: GET /api/v2/genai/status/{statusId}/ (`get_status_status__statusId___get`) */
export const getStatusStatusStatusIdGet: DatarobotEndpoints['getStatusStatusStatusIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/status/{statusId}/', input);
		const { query, body } = splitDatarobotInput(input, ['statusId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getStatusStatusStatusIdGet.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getStatusStatusStatusIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported embedding models */
/** Official: GET /api/v2/genai/vectorDatabases/supportedEmbeddings/ (`get_supported_embeddings_vectorDatabases_supportedEmbeddings__get`) */
export const getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet: DatarobotEndpoints['getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/supportedEmbeddings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['datasetId', 'useCaseId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported insights by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/supportedInsights/ (`get_supported_insights_playgrounds__playgroundId__supportedInsights__get`) */
export const getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet: DatarobotEndpoints['getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/supportedInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['playgroundId'],
			[
				'withAggregationTypesOnly',
				'productionOnly',
				'completedOnly',
				'llmBlueprintIds',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported languages by vector database ID */
/** Official: GET /api/v2/genai/vectorDatabases/{vectorDatabaseId}/supportedSyntheticDatasetGenerationLanguages/ (`get_supported_languages_vectorDatabases__vectorDatabaseId__supportedSyntheticDatasetGenerationLanguages__get`) */
export const getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet: DatarobotEndpoints['getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/supportedSyntheticDatasetGenerationLanguages/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported vector database retrieval settings */
/** Official: GET /api/v2/genai/vectorDatabases/supportedRetrievalSettings/ (`get_supported_retrieval_settings_vectorDatabases_supportedRetrievalSettings__get`) */
export const getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet: DatarobotEndpoints['getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/supportedRetrievalSettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported text chunking methods */
/** Official: GET /api/v2/genai/vectorDatabases/supportedTextChunkings/ (`get_supported_text_chunking_configs_vectorDatabases_supportedTextChunkings__get`) */
export const getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet: DatarobotEndpoints['getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/supportedTextChunkings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve vector database creation count */
/** Official: GET /api/v2/genai/userLimits/vectorDatabases/ (`get_user_limit_counter_for_vector_databases_userLimits_vectorDatabases__get`) */
export const getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet: DatarobotEndpoints['getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/userLimits/vectorDatabases/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve vector database latest version by vector database ID */
/** Official: GET /api/v2/genai/vectorDatabases/{vectorDatabaseId}/latestVersion/ (`get_vector_database_latest_version_vectorDatabases__vectorDatabaseId__latestVersion__get`) */
export const getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet: DatarobotEndpoints['getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/latestVersion/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			['completedOnly'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve vector database by vector database ID */
/** Official: GET /api/v2/genai/vectorDatabases/{vectorDatabaseId}/ (`get_vector_database_vectorDatabases__vectorDatabaseId___get`) */
export const getVectorDatabaseVectorDatabasesVectorDatabaseIdGet: DatarobotEndpoints['getVectorDatabaseVectorDatabasesVectorDatabaseIdGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List chat prompts */
/** Official: GET /api/v2/genai/chatPrompts/ (`list_chat_prompts_chatPrompts__get`) */
export const listChatPromptsChatPromptsGet: DatarobotEndpoints['listChatPromptsChatPromptsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chatPrompts/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['playgroundId', 'llmBlueprintId', 'chatId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listChatPromptsChatPromptsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listChatPromptsChatPromptsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List chats */
/** Official: GET /api/v2/genai/chats/ (`list_chats_chats__get`) */
export const listChatsChatsGet: DatarobotEndpoints['listChatsChatsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/chats/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['llmBlueprintId', 'offset', 'limit', 'sort'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listChatsChatsGet.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listChatsChatsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List comparison chats */
/** Official: GET /api/v2/genai/comparisonChats/ (`list_comparison_chats_comparisonChats__get`) */
export const listComparisonChatsComparisonChatsGet: DatarobotEndpoints['listComparisonChatsComparisonChatsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/comparisonChats/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['playgroundId', 'offset', 'limit', 'sort'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listComparisonChatsComparisonChatsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listComparisonChatsComparisonChatsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List comparison prompts */
/** Official: GET /api/v2/genai/comparisonPrompts/ (`list_comparison_prompts_comparisonPrompts__get`) */
export const listComparisonPromptsComparisonPromptsGet: DatarobotEndpoints['listComparisonPromptsComparisonPromptsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/comparisonPrompts/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['llmBlueprintIds', 'comparisonChatId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listComparisonPromptsComparisonPromptsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listComparisonPromptsComparisonPromptsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom model embedding validations */
/** Official: GET /api/v2/genai/customModelEmbeddingValidations/ (`list_custom_model_embeddings_customModelEmbeddingValidations__get`) */
export const listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet: DatarobotEndpoints['listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'playgroundId',
				'offset',
				'limit',
				'search',
				'sort',
				'completedOnly',
				'deploymentId',
				'modelId',
				'promptColumnName',
				'targetColumnName',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom model LLM validations */
/** Official: GET /api/v2/genai/customModelLLMValidations/ (`list_custom_model_llm_validations_customModelLLMValidations__get`) */
export const listCustomModelLlmValidationsCustomModelLLMValidationsGet: DatarobotEndpoints['listCustomModelLlmValidationsCustomModelLLMValidationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'playgroundId',
				'offset',
				'limit',
				'search',
				'sort',
				'completedOnly',
				'deploymentId',
				'modelId',
				'promptColumnName',
				'targetColumnName',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listCustomModelLlmValidationsCustomModelLLMValidationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listCustomModelLlmValidationsCustomModelLLMValidationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom model vector database validations */
/** Official: GET /api/v2/genai/customModelVectorDatabaseValidations/ (`list_custom_model_vector_database_validations_customModelVectorDatabaseValidations__get`) */
export const listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet: DatarobotEndpoints['listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'playgroundId',
				'offset',
				'limit',
				'search',
				'sort',
				'completedOnly',
				'deploymentId',
				'modelId',
				'promptColumnName',
				'targetColumnName',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List evaluation dataset configurations */
/** Official: GET /api/v2/genai/evaluationDatasetConfigurations/ (`list_evaluation_dataset_configuration_evaluationDatasetConfigurations__get`) */
export const listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet: DatarobotEndpoints['listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetConfigurations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'playgroundId',
				'evaluationDatasetConfigurationId',
				'offset',
				'limit',
				'search',
				'sort',
				'correctnessEnabledOnly',
				'completedOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List evaluation dataset metric aggregations aggregated by llm blueprint. */
/** Official: GET /api/v2/genai/evaluationDatasetMetricAggregations/aggregateByLLMBlueprint/ (`list_evaluation_dataset_metric_aggregation_aggregated_by_llm_blueprint_evaluationDatasetMetricAggregations_aggregateByLLMBlueprint__get`) */
export const listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet: DatarobotEndpoints['listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetMetricAggregations/aggregateByLLMBlueprint/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'llmBlueprintIds',
				'chatIds',
				'evaluationDatasetConfigurationIds',
				'metricNames',
				'aggregationTypes',
				'currentConfigurationOnly',
				'offset',
				'limit',
				'nonErroredOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List evaluation dataset metric aggregations */
/** Official: GET /api/v2/genai/evaluationDatasetMetricAggregations/ (`list_evaluation_dataset_metric_aggregation_evaluationDatasetMetricAggregations__get`) */
export const listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet: DatarobotEndpoints['listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetMetricAggregations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'llmBlueprintIds',
				'chatIds',
				'evaluationDatasetConfigurationIds',
				'metricNames',
				'aggregationTypes',
				'currentConfigurationOnly',
				'sort',
				'offset',
				'limit',
				'nonErroredOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List evaluation dataset metric aggregations unique computed metrics by uniquefield */
/** Official: GET /api/v2/genai/evaluationDatasetMetricAggregations/uniqueFieldValues/{uniqueField}/ (`list_evaluation_dataset_metric_aggregation_unique_field_values_evaluationDatasetMetricAggregations_uniqueFieldValues__uniqueField___get`) */
export const listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet: DatarobotEndpoints['listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetMetricAggregations/uniqueFieldValues/{uniqueField}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['uniqueField'],
			[
				'llmBlueprintIds',
				'metricNames',
				'chatIds',
				'evaluationDatasetConfigurationIds',
				'aggregationTypes',
				'currentConfigurationOnly',
				'offset',
				'limit',
				'nonErroredOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List LLM blueprints */
/** Official: GET /api/v2/genai/llmBlueprints/ (`list_llm_blueprints_llmBlueprints__get`) */
export const listLlmBlueprintsLlmBlueprintsGet: DatarobotEndpoints['listLlmBlueprintsLlmBlueprintsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmBlueprints/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'playgroundId',
				'llmIds',
				'vectorDatabaseIds',
				'isSaved',
				'isStarred',
				'offset',
				'limit',
				'sort',
				'creationUserIds',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmBlueprintsLlmBlueprintsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmBlueprintsLlmBlueprintsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List non out-of-the-box datasets */
/** Official: GET /api/v2/genai/llmTestConfigurations/nonOotbDatasets/ (`list_llm_test_configuration_non_ootb_datasets_llmTestConfigurations_nonOotbDatasets__get`) */
export const listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet: DatarobotEndpoints['listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/nonOotbDatasets/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'offset', 'limit', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List out-of-the-box datasets */
/** Official: GET /api/v2/genai/llmTestConfigurations/ootbDatasets/ (`list_llm_test_configuration_ootb_datasets_llmTestConfigurations_ootbDatasets__get`) */
export const listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet: DatarobotEndpoints['listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/ootbDatasets/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List supported insights */
/** Official: GET /api/v2/genai/llmTestConfigurations/supportedInsights/ (`list_llm_test_configuration_supported_insights_llmTestConfigurations_supportedInsights__get`) */
export const listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet: DatarobotEndpoints['listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/supportedInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'playgroundId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List LLM test configuration */
/** Official: GET /api/v2/genai/llmTestConfigurations/ (`list_llm_test_configurations_llmTestConfigurations__get`) */
export const listLlmTestConfigurationsLlmTestConfigurationsGet: DatarobotEndpoints['listLlmTestConfigurationsLlmTestConfigurationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmTestConfigurations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'offset', 'limit', 'testConfigType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestConfigurationsLlmTestConfigurationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestConfigurationsLlmTestConfigurationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List LLM test results */
/** Official: GET /api/v2/genai/llmTestResults/ (`list_llm_test_results_llmTestResults__get`) */
export const listLlmTestResultsLlmTestResultsGet: DatarobotEndpoints['listLlmTestResultsLlmTestResultsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmTestResults/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'llmTestConfigurationId',
				'llmBlueprintId',
				'llmTestSuiteId',
				'offset',
				'limit',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestResultsLlmTestResultsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestResultsLlmTestResultsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List LLM test suites */
/** Official: GET /api/v2/genai/llmTestSuites/ (`list_llm_test_suites_llmTestSuites__get`) */
export const listLlmTestSuitesLlmTestSuitesGet: DatarobotEndpoints['listLlmTestSuitesLlmTestSuitesGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/llmTestSuites/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'offset', 'limit', 'sort'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listLlmTestSuitesLlmTestSuitesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listLlmTestSuitesLlmTestSuitesGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List LLMs */
/** Official: GET /api/v2/genai/llms/ (`list_llms_llms__get`) */
export const listLlmsLlmsGet: DatarobotEndpoints['listLlmsLlmsGet'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/genai/llms/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'useCaseId',
			'activeOnly',
			'moderationSupportedOnly',
			'chatCompletionsSupportedOnly',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.listLlmsLlmsGet.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.genai.listLlmsLlmsGet',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List OOTB metric configurations by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/ootbMetricConfigurations/ (`list_ootb_metric_configurations_playgrounds__playgroundId__ootbMetricConfigurations__get`) */
export const listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet: DatarobotEndpoints['listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/ootbMetricConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List playgrounds */
/** Official: GET /api/v2/genai/playgrounds/ (`list_playgrounds_playgrounds__get`) */
export const listPlaygroundsPlaygroundsGet: DatarobotEndpoints['listPlaygroundsPlaygroundsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/playgrounds/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'offset', 'limit', 'search', 'sort'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listPlaygroundsPlaygroundsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listPlaygroundsPlaygroundsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List prompt template versions by prompt template ID */
/** Official: GET /api/v2/genai/promptTemplates/{promptTemplateId}/versions/ (`list_prompt_template_versions_promptTemplates__promptTemplateId__versions__get`) */
export const listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet: DatarobotEndpoints['listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/promptTemplates/{promptTemplateId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['promptTemplateId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List prompt templates */
/** Official: GET /api/v2/genai/promptTemplates/ (`list_prompt_templates_promptTemplates__get`) */
export const listPromptTemplatesPromptTemplatesGet: DatarobotEndpoints['listPromptTemplatesPromptTemplatesGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/promptTemplates/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'sort', 'search', 'creationUserIds'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listPromptTemplatesPromptTemplatesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listPromptTemplatesPromptTemplatesGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List prompt templates versions */
/** Official: GET /api/v2/genai/promptTemplates/versions/ (`list_prompt_templates_versions_promptTemplates_versions__get`) */
export const listPromptTemplatesVersionsPromptTemplatesVersionsGet: DatarobotEndpoints['listPromptTemplatesVersionsPromptTemplatesVersionsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/promptTemplates/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'promptTemplatesIds'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listPromptTemplatesVersionsPromptTemplatesVersionsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listPromptTemplatesVersionsPromptTemplatesVersionsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List search studies by use case ID. */
/** Official: GET /api/v2/genai/syftrSearch/ (`list_search_study_syftrSearch__get`) */
export const listSearchStudySyftrSearchGet: DatarobotEndpoints['listSearchStudySyftrSearchGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/syftrSearch/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['useCaseId', 'offset', 'limit', 'playgroundId', 'search', 'sort'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listSearchStudySyftrSearchGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listSearchStudySyftrSearchGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List sidecar model metric validations */
/** Official: GET /api/v2/genai/sidecarModelMetricValidations/ (`list_sidecar_model_validations_sidecarModelMetricValidations__get`) */
export const listSidecarModelValidationsSidecarModelMetricValidationsGet: DatarobotEndpoints['listSidecarModelValidationsSidecarModelMetricValidationsGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'offset',
				'limit',
				'search',
				'sort',
				'completedOnly',
				'deploymentId',
				'modelId',
				'promptColumnName',
				'targetColumnName',
				'citationsPrefixColumnName',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listSidecarModelValidationsSidecarModelMetricValidationsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listSidecarModelValidationsSidecarModelMetricValidationsGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List vector databases */
/** Official: GET /api/v2/genai/vectorDatabases/ (`list_vector_databases_vectorDatabases__get`) */
export const listVectorDatabasesVectorDatabasesGet: DatarobotEndpoints['listVectorDatabasesVectorDatabasesGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/vectorDatabases/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'useCaseId',
				'playgroundId',
				'familyId',
				'parentsOnly',
				'offset',
				'limit',
				'search',
				'sort',
				'completedOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.listVectorDatabasesVectorDatabasesGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.listVectorDatabasesVectorDatabasesGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve playground prompt traces metadata by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/trace/metadata/ (`playground_trace_metadata_playgrounds__playgroundId__trace_metadata__get`) */
export const playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet: DatarobotEndpoints['playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/trace/metadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve playground prompt traces by playground ID */
/** Official: GET /api/v2/genai/playgrounds/{playgroundId}/trace/ (`playground_trace_playgrounds__playgroundId__trace__get`) */
export const playgroundTracePlaygroundsPlaygroundIdTraceGet: DatarobotEndpoints['playgroundTracePlaygroundsPlaygroundIdTraceGet'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/trace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['playgroundId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.playgroundTracePlaygroundsPlaygroundIdTraceGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.playgroundTracePlaygroundsPlaygroundIdTraceGet',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Revalidate custom model embedding by validation ID */
/** Official: POST /api/v2/genai/customModelEmbeddingValidations/{validationId}/revalidate/ (`revalidate_custom_model_embedding_validation_customModelEmbeddingValidations__validationId__revalidate__post`) */
export const revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost: DatarobotEndpoints['revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/{validationId}/revalidate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Revalidate custom model LLM by validation ID */
/** Official: POST /api/v2/genai/customModelLLMValidations/{validationId}/revalidate/ (`revalidate_custom_model_llm_validation_customModelLLMValidations__validationId__revalidate__post`) */
export const revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost: DatarobotEndpoints['revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/{validationId}/revalidate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Revalidate custom model vector database by validation ID */
/** Official: POST /api/v2/genai/customModelVectorDatabaseValidations/{validationId}/revalidate/ (`revalidate_custom_model_vector_database_validation_customModelVectorDatabaseValidations__validationId__revalidate__post`) */
export const revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost: DatarobotEndpoints['revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/{validationId}/revalidate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Revalidate sidecar model metric by validation ID */
/** Official: POST /api/v2/genai/sidecarModelMetricValidations/{validationId}/revalidate/ (`revalidate_sidecar_model_validation_sidecarModelMetricValidations__validationId__revalidate__post`) */
export const revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost: DatarobotEndpoints['revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/{validationId}/revalidate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Run agentic search. */
/** Official: POST /api/v2/genai/syftrSearch/ (`run_agentic_search_syftrSearch__post`) */
export const runAgenticSearchSyftrSearchPost: DatarobotEndpoints['runAgenticSearchSyftrSearchPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/genai/syftrSearch/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.runAgenticSearchSyftrSearchPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.runAgenticSearchSyftrSearchPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit chat prompt by chat prompt ID */
/** Official: PATCH /api/v2/genai/chatPrompts/{chatPromptId}/ (`update_chat_prompt_data_chatPrompts__chatPromptId___patch`) */
export const updateChatPromptDataChatPromptsChatPromptIdPatch: DatarobotEndpoints['updateChatPromptDataChatPromptsChatPromptIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/chatPrompts/{chatPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['chatPromptId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateChatPromptDataChatPromptsChatPromptIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateChatPromptDataChatPromptsChatPromptIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit comparison prompt by comparison prompt ID */
/** Official: PATCH /api/v2/genai/comparisonPrompts/{comparisonPromptId}/ (`update_comparison_prompt_comparisonPrompts__comparisonPromptId___patch`) */
export const updateComparisonPromptComparisonPromptsComparisonPromptIdPatch: DatarobotEndpoints['updateComparisonPromptComparisonPromptsComparisonPromptIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/comparisonPrompts/{comparisonPromptId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['comparisonPromptId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add documents by vector database ID */
/** Official: PATCH /api/v2/genai/vectorDatabases/{vectorDatabaseId}/externalVectorDatabaseDocuments/ (`update_connected_vector_database_vectorDatabases__vectorDatabaseId__externalVectorDatabaseDocuments__patch`) */
export const updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch: DatarobotEndpoints['updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/externalVectorDatabaseDocuments/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit cost metric configuration by cost metric configuration ID */
/** Official: PATCH /api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/ (`update_cost_metric_configuration_costMetricConfigurations__costMetricConfigurationId___patch`) */
export const updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch: DatarobotEndpoints['updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/costMetricConfigurations/{costMetricConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['costMetricConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit custom model LLM validation by validation ID */
/** Official: PATCH /api/v2/genai/customModelLLMValidations/{validationId}/ (`update_custom_model_llm_validation_customModelLLMValidations__validationId___patch`) */
export const updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch: DatarobotEndpoints['updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelLLMValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit custom model embedding validation by validation ID */
/** Official: PATCH /api/v2/genai/customModelEmbeddingValidations/{validationId}/ (`update_custom_model_validation_customModelEmbeddingValidations__validationId___patch`) */
export const updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch: DatarobotEndpoints['updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelEmbeddingValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit custom model vector database validation by validation ID */
/** Official: PATCH /api/v2/genai/customModelVectorDatabaseValidations/{validationId}/ (`update_custom_model_vector_database_validation_customModelVectorDatabaseValidations__validationId___patch`) */
export const updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch: DatarobotEndpoints['updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/customModelVectorDatabaseValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit evaluation dataset configuration by evaluation dataset configuration ID */
/** Official: PATCH /api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/ (`update_evaluation_dataset_configuration_evaluationDatasetConfigurations__evaluationDatasetConfigurationId___patch`) */
export const updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch: DatarobotEndpoints['updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/evaluationDatasetConfigurations/{evaluationDatasetConfigurationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['evaluationDatasetConfigurationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit LLM blueprint by LLM blueprint ID */
/** Official: PATCH /api/v2/genai/llmBlueprints/{llmBlueprintId}/ (`update_llm_blueprint_llmBlueprints__llmBlueprintId___patch`) */
export const updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch: DatarobotEndpoints['updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/llmBlueprints/{llmBlueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['llmBlueprintId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit playground by playground ID */
/** Official: PATCH /api/v2/genai/playgrounds/{playgroundId}/ (`update_playground_playgrounds__playgroundId___patch`) */
export const updatePlaygroundPlaygroundsPlaygroundIdPatch: DatarobotEndpoints['updatePlaygroundPlaygroundsPlaygroundIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updatePlaygroundPlaygroundsPlaygroundIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updatePlaygroundPlaygroundsPlaygroundIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit sidecar model metric validation by validation ID */
/** Official: PATCH /api/v2/genai/sidecarModelMetricValidations/{validationId}/ (`update_sidecar_model_metric_validation_sidecarModelMetricValidations__validationId___patch`) */
export const updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch: DatarobotEndpoints['updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/sidecarModelMetricValidations/{validationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['validationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Edit vector database by vector database ID */
/** Official: PATCH /api/v2/genai/vectorDatabases/{vectorDatabaseId}/ (`update_vector_database_vectorDatabases__vectorDatabaseId___patch`) */
export const updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch: DatarobotEndpoints['updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/vectorDatabases/{vectorDatabaseId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['vectorDatabaseId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update/insert the NeMo configuration by playground ID */
/** Official: POST /api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/ (`upsert_playground_nemo_configuration_playgrounds__playgroundId__nemoConfiguration__post`) */
export const upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost: DatarobotEndpoints['upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/genai/playgrounds/{playgroundId}/nemoConfiguration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['playgroundId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.genai.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost',
			input ?? {},
			'completed',
		);
		return parsed;
	};
