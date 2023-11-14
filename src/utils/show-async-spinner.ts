import { Spinner } from 'cli-spinners';
import rdl from 'readline';

function showCursor() {
  process.stdout.write('\u001B[?25h');
}

function hideCursor() {
  process.stdout.write('\u001B[?25l');
}

export default async function showAsyncSpinner(
  opts: { spinner: Spinner; text?: string },
  promise: Promise<unknown>
) {
  let frameIndex = 0;

  process.stdout.write('\n');
  hideCursor();
  const i = setInterval(() => {
    if (frameIndex < opts.spinner.frames.length) {
      process.stdout.write(
        `${opts.text ? opts.text + ' ' : ''}${opts.spinner.frames[frameIndex]}`
      );
      frameIndex++;
    } else {
      frameIndex = 0;
    }

    rdl.cursorTo(process.stdout, 0);
  }, opts.spinner.interval);

  try {
    await promise;
  } catch (err) {
    // noop
  }

  clearInterval(i);
  rdl.clearLine(process.stdout, 0);
  process.stdout.write('\n');
  showCursor();
}
