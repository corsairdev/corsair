import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createLoggedModel: DatabricksEndpoints['createLoggedModel'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ model_id: string }>(
			'mlflow/logged-models/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.create_logged_model',
			input,
			'completed',
		);
		return response;
	};

export const createMlExperiment: DatabricksEndpoints['createMlExperiment'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ experiment_id: string }>(
			'mlflow/experiments/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.create_experiment',
			input,
			'completed',
		);
		return response;
	};

export const createMlFeatureStoreOnlineStore: DatabricksEndpoints['createMlFeatureStoreOnlineStore'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'feature-store/online-stores',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.create_online_store',
			input,
			'completed',
		);
		return response;
	};

export const createMlForecastingExperiment: DatabricksEndpoints['createMlForecastingExperiment'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ experiment_id: string }>(
			'automl/forecasting/experiments',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.create_forecasting_experiment',
			input,
			'completed',
		);
		return response;
	};

export const createMlflowExperimentRun: DatabricksEndpoints['createMlflowExperimentRun'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ run_id: string }>(
			'mlflow/runs/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.create_experiment_run',
			input,
			'completed',
		);
		return response;
	};

export const deleteLoggedModel: DatabricksEndpoints['deleteLoggedModel'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`mlflow/logged-models/${safeEncode(input.model_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_logged_model',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteLoggedModelTag: DatabricksEndpoints['deleteLoggedModelTag'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`mlflow/logged-models/${safeEncode(input.model_id)}/tags/${safeEncode(input.key)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_logged_model_tag',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlExperiment: DatabricksEndpoints['deleteMlExperiment'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('mlflow/experiments/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_experiment',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlExperimentRun: DatabricksEndpoints['deleteMlExperimentRun'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('mlflow/runs/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_experiment_run',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlExperimentRunTag: DatabricksEndpoints['deleteMlExperimentRunTag'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('mlflow/runs/delete-tag', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_experiment_run_tag',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlExperimentRuns: DatabricksEndpoints['deleteMlExperimentRuns'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('mlflow/runs/delete-bulk', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_experiment_runs',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlFeatureEngKafkaConfig: DatabricksEndpoints['deleteMlFeatureEngKafkaConfig'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`feature-store/kafka-configs/${safeEncode(input.config_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_kafka_config',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlFeatureStoreOnlineStore: DatabricksEndpoints['deleteMlFeatureStoreOnlineStore'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`feature-store/online-stores/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_online_store',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMlFeatureTag: DatabricksEndpoints['deleteMlFeatureTag'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`feature-store/feature-tables/${safeEncode(input.feature_table_name)}/features/${safeEncode(input.feature_name)}/tags/${safeEncode(input.tag_key)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.ml.delete_feature_tag',
			input,
			'completed',
		);
		return { success: true };
	};
