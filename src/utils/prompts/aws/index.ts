import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const AWS_DETECT_STATEMENTS_PROMPT = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      `
      Analyze the provided code snippet, which will only contain AWS SDK calls, and create an array of AWS policy statements (with Effect, Action, and Resource) necessary for running the code. Follow these rules:
      
      1. Include only the necessary permissions to execute the code present in the snippet.
      2. Use least-privilege principles.
      3. If the snippet doesn't require any IAM permissions, return an empty array ([]).
      4. Never use wildcards.
      5. If the resource is not known, return a placeholder with the format "<AWS_RESOURCE_PLACEHOLDER>" where "AWS_RESOURCE" is the type of resource and nothing else.
      6. If the same AWS SDK call is done on different resources, return a new statement with a different placeholder name by adding a number.
      7. If there are multiple ways to do it, choose the simplest one.
      8. **Do not make assumptions about the use of AWS services. If the code snippet does not explicitly indicate the use of an AWS service, return an empty array.**
      9. **Ensure that the generated policy statements are valid AWS IAM policy statements and can only include permissions for existing AWS Services. Do not include permissions for services from other cloud providers, such as Google Cloud Platform or Microsoft Azure.**
      
      ** Very important! **: Ensure that the generated policy statements are valid AWS IAM policy statements and can only include permissions for existing AWS Services, do not include any permissions for services of any other cloud providers such as Google Cloud Platform or Microsoft Azure.
      `
    ),
    HumanMessagePromptTemplate.fromTemplate(`
    <codeSnippet>
    {code}
    </codeSnippet>`),
  ],
  inputVariables: ['code'],
});

export const AWS_GENERATE_POLICIES_PROMPT = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      `
      Given an array of AWS Policy Statements, please generate an array of AWS Policy Documents, where each document corresponds to a unique AWS service type present in the input array. The AWS service type can be inferred from the AWS service prefix in the Action field (e.g. 's3', 'dynamodb', 'lambda', etc.) of each statement.

      The rules to follow are:
      
      1. If multiple statements are related to the same AWS service type, combine them into a single AWS Policy Document. This should be done by merging the statements, not by simply appending them.
      2. If there are multiple statements with the exact same action, merge their resources into a single statement.
      3. If there are multiple statements with the exact same resource, merge their actions into a single statement.
      4. If a single statement includes multiple resources or actions, ensure that these are not duplicated within the statement. If there are duplicates, remove them.
      
      The output should be an array of valid AWS Policy Documents, each in JSON format and adhering to AWS' JSON policy document syntax and structure.
      `
    ),
    HumanMessagePromptTemplate.fromTemplate(`
    <statements>
    {statements}
    </statements>
    `),
  ],
  inputVariables: ['statements'],
});
