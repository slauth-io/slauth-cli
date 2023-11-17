# Slauth.io

CLI that scans repositories and generates the necessary IAM Policies for the service to run.

## Installation

```bash
npm install -g @slauth.io/slauth
```

## Usage

1. Set the `OPENAI_API_KEY` environment variable: `export OPENAI_API_KEY=<key>`
2. Run `slauth --help` to see available commands

### Example scan command

> Note: By default the `scan` command will print the generated policies to `stdout`. Use `--output-file` option to specify a file to output to.

```bash
slauth scan -p aws ./path/to/my/repository
```

## Development

1. Set your `OPENAI_API_KEY` in the `.env` file at the root of the project
2. Run `npm i`
3. Install the `slauth` CLI globally: `npm install -g .`
4. Compile tsc on file change: `npm run build-watch`
5. Test it, `slauth -h` should work
