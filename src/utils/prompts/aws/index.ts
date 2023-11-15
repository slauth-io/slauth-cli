import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';

const AWS_DETECT_STATEMENTS_SYSTEM = `
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

** Very important! **: Ensure that the generated policy statements are valid AWS IAM policy statements and can only include permissions for existing AWS Services.`;

export const AWS_DETECT_STATEMENTS_PROMPT = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(AWS_DETECT_STATEMENTS_SYSTEM),
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
      Given an array of AWS Policy Statements, your task is to generate an array of AWS Policy Documents. Each AWS Policy Document should be specific to a unique AWS service and should only contain statements related to that service. Here's how to proceed:

      1. **Identify Unique AWS Services**: Look at the 'Action' field in each statement. The service name typically precedes the action (e.g., 's3', 'iam', 'sqs', etc.). Identify all unique service names.
      
      2. **Group Policy Statements by Service**: Create a separate group of Policy Statements for each unique AWS service. Each group should contain only the statements related to its service.

      3. **Remove duplicate Policy Statements**: Do not include duplicate statements. Duplicate statements have the same actions and resources.
      
      4. **Combine Statements with Same 'Resource'**: Within each service-specific group, check for statements that refer to the same 'Resource'. If you find multiple statements referring to the same resource, combine them into a single statement. Merge their 'Action' fields into a single array.
      
      5. **Create AWS Policy Document for Each Service**: Now, create a new AWS Policy Document for each unique AWS service. Each document should include all the statements from the corresponding service-specific group.
      
      6. **Structure AWS Policy Document**: Structure each AWS Policy Document as a valid JSON object like this:
         \`\`\`
         {
           "Version": "2012-10-17",
           "Statement": [<grouped_statements>]
         }
         \`\`\`
         Replace \`<grouped_statements>\` with the grouped Policy Statements for the corresponding service.
      
      7. **Return Array of AWS Policy Documents**: Finally, return an array of all the created AWS Policy Documents.
      
      Remember, each AWS Policy Document should only contain statements related to one AWS service. Also, within each document, there should be no duplicate statements for the same resource. Instead, the actions of such statements should be combined into a single statement.
      
      **Very Important**: Each unique AWS Service name should have its own AWS Policy Document.
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
