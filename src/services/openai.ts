import { OpenAI } from 'langchain/llms/openai';
import { LLMChain, SimpleSequentialChain } from 'langchain/chains';
import { DETECT_STATEMENTS_PROMPT } from '../utils/prompts';

function getStatementGeneratorChain() {
  const llm = new OpenAI({ temperature: 0 });
  const chain = new LLMChain({
    llm,
    prompt: DETECT_STATEMENTS_PROMPT,
  });

  return chain;
}

export async function generatePoliciesFromCode(code: string) {
  const statementsChain = getStatementGeneratorChain();
  const sequentialChain = new SimpleSequentialChain({
    chains: [statementsChain],
  });

  return await sequentialChain.run(code);
}
