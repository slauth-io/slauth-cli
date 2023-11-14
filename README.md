# slauth-cli

CLI that scans repositories and generates the necessary IAM Policies for the service to run.

## Development

1. set your `OPENAI_API_KEY` in the `.env` file at the root of the project
2. run `npm i`
3. install the `slauth` CLI globally: `npm install -g .`
4. compile tsc on file change: `npm run build-watch`
5. test it, `slauth -h` should work
