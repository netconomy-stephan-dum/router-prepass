export interface Derefer<Type = unknown, Err = Error> extends Promise<Type> {
  resolve: (value: Type) => void;
  reject: (error: Err) => void;
}
const createDerefer = <Type, Error>(): Derefer<Type, Error> => {
  let resolve, reject;
  return Object.assign(
    new Promise<Type>((res, rej) => {
      resolve = res;
      reject = rej;
    }), {
      resolve,
      reject
    });
};

export default createDerefer;