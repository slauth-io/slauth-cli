import { ChatOpenAI } from 'langchain/chat_models/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import JSONSchemas from '../utils/json-schemas';
import prompts from '../utils/prompts';
import { z } from 'zod';
import {
  StatementsOpenAIResultSchema,
  StatementArraySchema,
  PolicyDocumentsOpenAIResultSchema,
} from '../types/zod-aws-policy';
import CloudProviders from '../utils/cloud-providers';
import OpenAIModels from '../utils/models';

const defaultModelName = OpenAIModels['gpt-4-32k'];

export async function getStatementsFromCode(
  code: string,
  cloudProvider: keyof typeof CloudProviders,
  modelName: keyof typeof OpenAIModels = defaultModelName
) {
  const llm = new ChatOpenAI({ modelName, temperature: 0 });
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'statements_output_formatter',
        description:
          "Formats the output to be an JSON-parseable object containing an array of AWS policy statements under the key 'statements'",
        parameters: JSONSchemas.statementsOpenAIResultSchema,
      },
    ],
    function_call: {
      name: 'statements_output_formatter',
    },
  });

  const outputParser = new JsonOutputFunctionsParser();
  const chain =
    prompts[cloudProvider].DETECT_STATEMENTS_PROMPT.pipe(
      functionCallingModel
    ).pipe(outputParser);

  const response = await chain.invoke({
    code,
  });

  const validResponse = StatementsOpenAIResultSchema.parse(response);

  return validResponse.statements;
}

export async function getPoliciesFromStatements(
  statements: z.infer<typeof StatementArraySchema>,
  cloudProvider: keyof typeof CloudProviders,
  modelName: keyof typeof OpenAIModels = defaultModelName
) {
  if (!statements.length) {
    return;
  }

  const llm = new ChatOpenAI({ modelName, temperature: 0 });
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'policy_documents_output_formatter',
        description:
          "Formats the output to be an JSON-parseable object containing an array of AWS policy documents under the key 'policyDocuments'",
        parameters: JSONSchemas.policyDocumentsOpenAIResultSchema,
      },
    ],
    function_call: {
      name: 'policy_documents_output_formatter',
    },
  });

  const outputParser = new JsonOutputFunctionsParser();
  const chain =
    prompts[cloudProvider].GENERATE_POLICIES_PROMPT.pipe(
      functionCallingModel
    ).pipe(outputParser);

  const response = await chain.invoke({
    statements: JSON.stringify(statements, null, 2),
  });

  const validResponse = PolicyDocumentsOpenAIResultSchema.parse(response);

  return validResponse.policyDocuments;
}
