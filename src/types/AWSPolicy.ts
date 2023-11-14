export type PolicyVersion = '2012-10-17' | '2008-10-17';
export type PrincipalTypes = 'AWS' | 'CanonicalUser' | 'Federated' | 'Service';
export type Principal =
  | {
      [k in PrincipalTypes]?: string[] | string;
    }
  | '*';

export interface Condition {
  [condition: string]: {
    [resourceAction: string]: string[] | string;
  };
}

export interface BaseStatement {
  Sid?: string;
  Effect: 'Allow' | 'Deny';
  Action?: string[] | string;
  NotAction?: string[] | string;
  Resource?: string[] | string;
  NotResource?: string[] | string;
  Principal?: Principal;
  Condition?: Condition;
}

export interface NotPrincipalStatement extends BaseStatement {
  Effect: 'Deny';
  NotPrincipal: Principal;
}

export type Statement = NotPrincipalStatement | BaseStatement;

export interface PolicyDocument {
  Version: PolicyVersion;
  Id?: string;
  Statement: Statement[] | Statement;
}

export type AWSPolicyDocument = PolicyDocument | Record<string, never>; // AWSPolicyDocument can be {}

export interface AWSPolicyType {
  name?: string | undefined;
  document: AWSPolicyDocument;
  arn?: string | undefined;
}
