const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const retry = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operation: any,
  delay: number,
  retries: number
) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason: Error) => {
        if (retries > 0) {
          return wait(delay)
            .then(retry.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });
