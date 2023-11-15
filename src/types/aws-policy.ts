import { z } from 'zod';

const zodPolicyVersionSchema = z.enum(['2012-10-17', '2008-10-17']);

const zodPrincipalTypesSchema = z.enum([
  'AWS',
  'CanonicalUser',
  'Federated',
  'Service',
]);

const zodPrincipalSchema = z.union([
  z.record(
    zodPrincipalTypesSchema,
    z.union([z.array(z.string()), z.string()]).optional()
  ),
  z.literal('*'),
]);

const zodConditionSchema = z.record(
  z.string(),
  z.record(z.string(), z.union([z.array(z.string()), z.string()]))
);

const zodBaseStatementSchema = z.object({
  Sid: z.string().optional(),
  Effect: z.enum(['Allow', 'Deny']),
  Action: z.union([z.array(z.string()), z.string()]).optional(),
  NotAction: z.union([z.array(z.string()), z.string()]).optional(),
  Resource: z.union([z.array(z.string()), z.string()]).optional(),
  NotResource: z.union([z.array(z.string()), z.string()]).optional(),
  Principal: zodPrincipalSchema.optional(),
  Condition: zodConditionSchema.optional(),
});

const zodNotPrincipalStatementSchema = zodBaseStatementSchema.extend({
  Effect: z.literal('Deny'),
  NotPrincipal: zodPrincipalSchema,
});

const zodStatementSchema = z.union([
  zodBaseStatementSchema,
  zodNotPrincipalStatementSchema,
]);

const zodStatementArraySchema = z.array(zodStatementSchema);

const zodPolicyDocumentSchema = z.object({
  Version: zodPolicyVersionSchema,
  Id: z.string().optional(),
  Statement: z.union([zodStatementArraySchema, zodStatementSchema]),
});

// Preparing openai output schemas
const zodStatementsOpenAIResultSchema = z.object({
  statements: zodStatementArraySchema,
});

const zodPolicyDocumentsOpenAIResultSchema = z.object({
  policyDocuments: z.array(zodPolicyDocumentSchema),
});

export const zodSchemas = {
  zodStatementsOpenAIResultSchema,
  zodPolicyDocumentsOpenAIResultSchema,
};

export type Statement = z.infer<typeof zodStatementSchema>;
export type PolicyDocument = z.infer<typeof zodPolicyDocumentSchema>;
export type PolicyDocumentsOpenAIResult = z.infer<
  typeof zodPolicyDocumentsOpenAIResultSchema
>;
export type StatementOpenAIResult = z.infer<
  typeof zodStatementsOpenAIResultSchema
>;
