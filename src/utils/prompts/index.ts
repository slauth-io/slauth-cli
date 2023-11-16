import CloudProviders from '../cloud-providers';
import { ChatPromptTemplate } from 'langchain/prompts';
import {
  AWS_DETECT_STATEMENTS_PROMPT,
  AWS_GENERATE_POLICIES_PROMPT,
} from './aws';

// Make prompts immutable, cannog assign prompts.aws = {} will error
type Prompts = {
  readonly [k in CloudProviders]: {
    DETECT_STATEMENTS_PROMPT: ChatPromptTemplate;
    GENERATE_POLICIES_PROMPT: ChatPromptTemplate;
  };
};

// Enforce all cloudproviders to have prompts
const cpPrompts: Prompts = {
  aws: {
    DETECT_STATEMENTS_PROMPT: AWS_DETECT_STATEMENTS_PROMPT,
    GENERATE_POLICIES_PROMPT: AWS_GENERATE_POLICIES_PROMPT,
  },
};

export default cpPrompts;
