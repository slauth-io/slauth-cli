# <p align="center"><img src="./static/images/slauth-logo.png" alt="slauth.io logo"/></p>

CLI that scans repositories and generates the necessary IAM Policies for the service to run.

If you need any help getting started or have any questions, please join our [Slack Community](https://join.slack.com/t/slauthiocommunity/shared_invite/zt-268nxuwyd-Vav8lYJdiP44Kt8lQSSybg)

## Installation

```bash
npm install -g @slauth.io/slauth
```

## Usage

1. Set the `OPENAI_API_KEY` environment variable: `export OPENAI_API_KEY=<key>`
2. Run `slauth --help` to see available commands

### Examples

#### Scan command

The scan command will look for any `aws-sdk` calls in your git repository and generate the necessary policies for it.

```bash
slauth scan -p aws ../path/to/my/repository
```

> Note: By default the `scan` command will print the generated policies to `stdout`. Use `-o,--output-file` option to specify a file to output to.

**Result:**

The result of the scan command is an array of AWS IAM Policy Documents.
If the resource is not explicit in the code (e.g. comes from a variable), we use a placholder for it.
Before deploying the policies, you will have to **manually** change these placeholders with the correct resources the service will try to interact with.

```bash
Detected Policies:

[
  {
    "Version": "2012-10-17",
    "Id": "S3Policy",
    "Statement": [
      {
        "Sid": "S3Permissions",
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetBucketAcl"
        ],
        "Resource": [
          "<S3_BUCKET_PLACEHOLDER>",
          "<S3_BUCKET_1_PLACEHOLDER>",
          "arn:aws:s3:::my_bucket_2/*"
        ]
      }
    ]
  },
  {
    "Version": "2012-10-17",
    "Id": "DynamoDBPolicy",
    "Statement": [
      {
        "Sid": "DynamoDBPermissions",
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem"
        ],
        "Resource": [
          "<DYNAMODB_TABLE_PLACEHOLDER>"
        ]
      }
    ]
  },
  {
    "Version": "2012-10-17",
    "Id": "SQSPolicy",
    "Statement": [
      {
        "Sid": "SQSPermissions",
        "Effect": "Allow",
        "Action": [
          "sqs:SendMessage"
        ],
        "Resource": [
          "<SQS_QUEUE_URL_PLACEHOLDER>"
        ]
      }
    ]
  }
]
```

##### Available options

- `-p, --cloud-provider <cloudProvider>` select the cloud provider you would like to generate policies for (choices: "aws")
- `-m, --openai-model <openaiModel>` select the openai model to use (choices: "gpt-3.5-turbo-16k", "gpt-4-32k")
- `-o, --output-file <outputFile>` write generated policies to a file instead of stdout

### Selecting which OpenAI Model to use

By default `slauth` will use `gpt-4-32k` as it provides the best results. You can still choose to use other models to scan you repo, specially if cost is a concern:

To choose a different model, use the `-m` option of the `scan` command

```bash
slauth scan -p aws -m gpt-3.5-turbo-16k ./path/to/my/repository
```

Available models:

- `gpt-3.5-turbo-16k`
- `gpt-4-32k` (default)

### Running in CI/CD

Slauth being a CLI, it can be easily integrated in your CI/CD pipelines.

#### Github Action Example

In this GitHub action workflow we install Slauth, run it and then output the resulting policies to an artifact which can then be downloaded so the policies can be used in your IaC.

```yaml
name: scan
on:
  push:

permissions:
  contents: read

jobs:
  release:
    name: policy-scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 'lts/*'
      - name: Install Slauth
        run: npm install -g @slauth.io/slauth
      - name: Run Slauth
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: slauth scan -p aws -o ./policies.json .
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: policies
          path: policies.json
```

## Development

1. Set your `OPENAI_API_KEY` in the `.env` file at the root of the project
2. Run `npm i`
3. Install the `slauth` CLI globally: `npm install -g .`
4. Compile tsc on file change: `npm run build-watch`
5. Test it, `slauth -h` should work
