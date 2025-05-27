// Only OpikCallbackHandler is used now
import { OpikCallbackHandler } from 'opik-langchain';

import type { BaseCallbackConfig } from '@langchain/core/callbacks/manager';
import type { IExecuteFunctions } from 'n8n-workflow';

interface TracingConfig {
	additionalMetadata?: Record<string, unknown>;
}

export function getTracingConfig(
	context: IExecuteFunctions,
	config: TracingConfig = {},
): BaseCallbackConfig {
	if (context.getParentCallbackManager) {
		const callbackHandlers = context.getParentCallbackManager();
		parentRunManager.addHandler(opikHandler);
	} else {
		const callbackHandlers = tracingCallbacks;
	}

	console.log('callbackHandlers', callbackHandlers);

	return {
		runName: `[${context.getWorkflow().name}] ${context.getNode().name}`,
		metadata: {
			execution_id: context.getExecutionId(),
			workflow: context.getWorkflow(),
			node: context.getNode().name,
			...(config.additionalMetadata ?? {}),
		},
		callbacks: callbackHandlers,
	};
}

export const tracingCallbacks = [
	// new CallbackHandler({
	// 	secretKey: 'sk-lf-d0c030b2-2288-4a11-9dec-4dbc54608896',
	// 	publicKey: 'pk-lf-5926b9d7-8717-4dc4-a734-a2c0e042150f',
	// 	baseUrl: 'https://cloud.langfuse.com', // 🇪🇺 EU region
	// 	// baseUrl: "https://us.cloud.langfuse.com", // 🇺🇸 US region
	// }),
	new OpikCallbackHandler({
		tags: [], // Optional
		metadata: {}, // Optional, additional metadata for each trace logged by the tracer.
		projectName: 'test-n8n-js', // Optional, if not sent data will be logged to the default project
	}),
];
