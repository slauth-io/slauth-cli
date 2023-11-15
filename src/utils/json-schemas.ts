import { zodToJsonSchema } from 'zod-to-json-schema';
import { zodSchemas } from '../types/aws-policy';

export default {
  statementsOpenAIResultSchema: zodToJsonSchema(
    zodSchemas.zodStatementsOpenAIResultSchema
  ),
  policyDocumentsOpenAIResultSchema: zodToJsonSchema(
    zodSchemas.zodPolicyDocumentsOpenAIResultSchema
  ),
};
