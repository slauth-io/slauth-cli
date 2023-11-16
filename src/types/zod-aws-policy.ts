import { z } from 'zod';

const PolicyVersionSchema = z.enum(['2012-10-17', '2008-10-17']);

const PrincipalTypesSchema = z.enum([
  'AWS',
  'CanonicalUser',
  'Federated',
  'Service',
]);

const PrincipalSchema = z.union([
  z.record(
    PrincipalTypesSchema,
    z.union([z.array(z.string()), z.string()]).optional()
  ),
  z.literal('*'),
]);

const ConditionSchema = z.record(
  z.string(),
  z.record(z.string(), z.union([z.array(z.string()), z.string()]))
);

const BaseStatementSchema = z.object({
  Sid: z.string().optional(),
  Effect: z.enum(['Allow', 'Deny']),
  Action: z.union([z.array(z.string()), z.string()]).optional(),
  NotAction: z.union([z.array(z.string()), z.string()]).optional(),
  Resource: z.union([z.array(z.string()), z.string()]).optional(),
  NotResource: z.union([z.array(z.string()), z.string()]).optional(),
  Principal: PrincipalSchema.optional(),
  Condition: ConditionSchema.optional(),
});

const NotPrincipalStatementSchema = BaseStatementSchema.extend({
  Effect: z.literal('Deny'),
  NotPrincipal: PrincipalSchema,
});

export const StatementSchema = z.union([
  BaseStatementSchema,
  NotPrincipalStatementSchema,
]);

export const StatementArraySchema = z.array(StatementSchema);

export const PolicyDocumentSchema = z.object({
  Version: PolicyVersionSchema,
  Id: z.string().optional(),
  Statement: z.union([StatementArraySchema, StatementSchema]),
});

// Preparing openai output schemas
export const StatementsOpenAIResultSchema = z.object({
  statements: StatementArraySchema,
});

export const PolicyDocumentsOpenAIResultSchema = z.object({
  policyDocuments: z.array(PolicyDocumentSchema),
});
