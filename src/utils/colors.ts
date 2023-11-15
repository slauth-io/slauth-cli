export function yellow(s: unknown) {
  return `\x1b[33m${s}\x1b[0m`;
}

export function green(s: unknown) {
  return `\x1b[32m${s}\x1b[0m`;
}

export function blue(s: unknown) {
  return `\x1b[34m${s}\x1b[0m`;
}

export function red(s: unknown) {
  return `\x1b[31m${s}\x1b[0m`;
}

export function gray(s: unknown) {
  return `\x1b[90m${s}\x1b[0m`;
}
