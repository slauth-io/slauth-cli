import { OpenAI } from 'langchain/llms/openai';
import parseJson from '../utils/parse-json';
import {
  DETECT_STATEMENTS_PROMPT,
  GENERATE_POLICY_PROMPT,
} from '../utils/prompts';
import { PolicyDocument, Statement } from '../types/AWSPolicy';

const modelName = 'gpt-4-32k';
const llm = new OpenAI({ temperature: 0, modelName });

export async function getStatementsFromCode(code: string) {
  const result = await llm.call(
    await DETECT_STATEMENTS_PROMPT.format({
      code,
    })
  );

  return parseJson<Statement[]>(result);
}

export async function getPoliciesFromStatements(statements: Statement[]) {
  const result = await llm.call(
    await GENERATE_POLICY_PROMPT.format({
      statements: JSON.stringify(statements, null, 2),
    })
  );

  return parseJson<PolicyDocument>(result);
}
