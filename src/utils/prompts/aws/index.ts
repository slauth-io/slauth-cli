import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const AWS_DETECT_STATEMENTS_PROMPT = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      `
      Given a code snippet, look for aws-sdk calls and generate a JSON-parseable object containing an array of AWS policy statements required for the code's execution under the key 'statements'. Each statement should include 'Effect', 'Action', and 'Resource'. Follow these rules:

      1. Only include permissions necessary for the code's execution.
      2. Adhere to the principle of least privilege.
      3. If no IAM permissions are required, return an object with an empty array ([]).
      4. Do not use wildcards.
      5. If a resource is unknown, use a placeholder in the format "<AWS_RESOURCE_PLACEHOLDER>", where "AWS_RESOURCE" is the resource type.
      6. If the same AWS SDK call targets different resources, create a new statement with a unique placeholder name by appending a number.
      7. Choose the simplest solution if multiple exist.
      8. Do not assume AWS service usage. If the code snippet doesn't explicitly indicate an AWS service's usage, return an object with an empty array.
      9. Ensure the generated policy statements are valid AWS IAM policy statements and only include permissions for existing AWS Services. Exclude permissions for services from other cloud providers such as Google Cloud Platform or Microsoft Azure.

      Note: The output should strictly be a JSON-parseable object with the key 'statements' containing an array of AWS policy statements. Exclude any additional text, instructions, or non-JSON content.
      Analyze the provided AWS SDK code snippet and generate a JSON-parseable array of AWS policy statements necessary for its execution. Each policy statement should include 'Effect', 'Action', and 'Resource'. Follow these guidelines:
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
