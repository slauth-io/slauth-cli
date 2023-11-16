import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  StatementsOpenAIResultSchema,
  PolicyDocumentsOpenAIResultSchema,
} from '../types/zod-aws-policy';

export default {
  statementsOpenAIResultSchema: zodToJsonSchema(StatementsOpenAIResultSchema),
  policyDocumentsOpenAIResultSchema: zodToJsonSchema(
    PolicyDocumentsOpenAIResultSchema
  ),
};
