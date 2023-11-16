# slauth-cli

CLI that scans repositories and generates the necessary IAM Policies for the service to run.

## Usage

1. set the `OPENAI_API_KEY` environment variable: `export OPENAI_API_KEY=<key>`
2. run `slauth --help` to see available commands

> Note: By default slauth-cli will print the generated policies to stdout. Use --output option to specify a file to output to.

### Example scan command

```bash
slauth scan -p aws ./path/to/my/repository
```

## Development

1. set your `OPENAI_API_KEY` in the `.env` file at the root of the project
2. run `npm i`
3. install the `slauth` CLI globally: `npm install -g .`
4. compile tsc on file change: `npm run build-watch`
5. test it, `slauth -h` should work
