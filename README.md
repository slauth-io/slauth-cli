# <p align="center"><img src="./static/images/slauth-logo.png" alt="slauth.io logo"/></p>

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

### Selecting which OpenAI Model to use

By default `slauth` will use `gpt-4-32k` as it provides the best results. You can still choose to use other models to scan you repo, specially if cost is a concern:

To choose a different model, use the `-m` option of the `scan` command

```bash
slauth scan -p aws -m gpt-3.5-turbo-16k ./path/to/my/repository
```

Available models:

- `gpt-3.5-turbo-16k`
- `gpt-4-32k` (default)

## Development

1. Set your `OPENAI_API_KEY` in the `.env` file at the root of the project
2. Run `npm i`
3. Install the `slauth` CLI globally: `npm install -g .`
4. Compile tsc on file change: `npm run build-watch`
5. Test it, `slauth -h` should work
