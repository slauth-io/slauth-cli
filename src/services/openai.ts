import { ChatOpenAI } from 'langchain/chat_models/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import JSONSchemas from '../utils/json-schemas';
import {
  AWS_DETECT_STATEMENTS_PROMPT,
  AWS_GENERATE_POLICIES_PROMPT,
} from '../utils/prompts';
import {
  PolicyDocumentsOpenAIResult,
  Statement,
  StatementOpenAIResult,
} from '../types/aws-policy';

const modelName = 'gpt-4-32k';

export async function getStatementsFromCode(code: string) {
  const llm = new ChatOpenAI({ modelName, temperature: 0 });
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'statements_output_formatter',
        description: 'Should always be used to properly format output',
        parameters: JSONSchemas.statementsOpenAIResultSchema,
      },
    ],
    function_call: {
      name: 'statements_output_formatter',
    },
  });

  const outputParser = new JsonOutputFunctionsParser();
  const chain =
    AWS_DETECT_STATEMENTS_PROMPT.pipe(functionCallingModel).pipe(outputParser);

  const response = (await chain.invoke({
    code,
  })) as StatementOpenAIResult;

  return response.statements;
}

export async function getPoliciesFromStatements(statements: Statement[]) {
  if (!statements.length) {
    return;
  }

  const llm = new ChatOpenAI({ modelName, temperature: 0 });
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'policy_documents_output_formatter',
        description: 'Should always be used to properly format output',
        parameters: JSONSchemas.policyDocumentsOpenAIResultSchema,
      },
    ],
    function_call: {
      name: 'policy_documents_output_formatter',
    },
  });

  const outputParser = new JsonOutputFunctionsParser();
  const chain =
    AWS_GENERATE_POLICIES_PROMPT.pipe(functionCallingModel).pipe(outputParser);

  const response = (await chain.invoke({
    statements: JSON.stringify(statements, null, 2),
  })) as PolicyDocumentsOpenAIResult;

  return response.policyDocuments;
}
