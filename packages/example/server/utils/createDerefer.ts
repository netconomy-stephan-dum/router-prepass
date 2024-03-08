export interface Derefer<Value> extends Promise<Value> {
  resolve: (result?: Value) => void;
  reject: (error?: unknown) => void;
  cancel: () => void;
}

const createDerefer = <Value = any>(timeout?: number): Derefer<Value> => {
  let resolve;
  let reject;
  let cancel = () => {};
  const promise = new Promise<Value>((dereferResolve, dereferReject) => {
    reject = dereferReject;

    if (timeout) {
      const timer = setTimeout(() => {
        dereferReject(new Error('Timeout derefer not called'));
      }, timeout)
      cancel = () => clearTimeout(timer);
      resolve = (arg: Value) => {
        clearTimeout(timer);
        dereferResolve(arg);
      }
    } else {
      resolve = dereferResolve;
    }
  });

  return Object.assign(promise, { resolve, reject, cancel } as unknown as Derefer<Value>);
};

export default createDerefer;
