import CloudProviders from '../../types/cloud-providers';
import { ChatPromptTemplate } from 'langchain/prompts';
import {
  AWS_DETECT_STATEMENTS_PROMPT,
  AWS_GENERATE_POLICIES_PROMPT,
} from './aws';

type Prompts = {
  [k in CloudProviders]: {
    DETECT_STATEMENTS_PROMPT: ChatPromptTemplate;
    GENERATE_POLICIES_PROMPT: ChatPromptTemplate;
  };
};

export default {
  aws: {
    DETECT_STATEMENTS_PROMPT: AWS_DETECT_STATEMENTS_PROMPT,
    GENERATE_POLICIES_PROMPT: AWS_GENERATE_POLICIES_PROMPT,
  },
} as Prompts;
