import { PromptTemplate } from 'langchain/prompts';

export const DETECT_STATEMENTS_PROMPT = new PromptTemplate({
  inputVariables: ['code'],
  template: `
Analyze the provided code snippet, which will only contain AWS SDK calls, and create an array of AWS policy statements (with Effect, Action, and Resource) necessary for running the code. Follow these rules:

1. Include only the necessary permissions to execute the code present in the snippet.

2. Use least-privilege principles.

3. If the snippet doesn't require any IAM permissions, return an empty array ([]).

4. Never use wildcards.

5. If the resource is not known, return a placeholder with the format "<AWS_RESOURCE_PLACEHOLDER>" where "AWS_RESOURCE" is the type of resource and nothing else.

6. If the same AWS SDK call is done on different resources, return a new statement with a different placeholder name by adding a number.

7. If there are multiple ways to do it, choose the simplest one.

8. Return **only** the JSON array of policy statements and nothing else. The response needs to be parsed by JSON.parse() in Node.js.

9. **Do not make assumptions about the use of AWS services. If the code snippet does not explicitly indicate the use of an AWS service, return an empty array.**

10. **Ensure that the generated policy statements are valid AWS IAM policy statements and can only include permissions for existing AWS Services. Do not include permissions for services from other cloud providers, such as Google Cloud Platform or Microsoft Azure.**

** Very important! **: Ensure that the generated policy statements are valid AWS IAM policy statements and can only include permissions for existing AWS Services.

<codeSnippet>
{code}
</codeSnippet>`,
});
