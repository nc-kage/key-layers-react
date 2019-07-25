export const copyStaticProps = <T>(from: T, to: T): T => {
  const systemProps = [
    'length',
    'name',
    'prototype',
    'WrappedComponent',
    'displayName',
    'childContextTypes',
    'contextTypes',
    'propTypes',
    'caller',
    'arguments',
  ];
  Object.getOwnPropertyNames(from)
    .filter((name: string): boolean => !systemProps.includes(name))
    .forEach((name: string) => {
      if (typeof (from as { [key: string]: any })[name] === 'function') {
        (to as { [key: string]: any })[name] = (from as { [key: string]: any })[name].bind(from);
      } else {
        (to as { [key: string]: any })[name] = (from as { [key: string]: any })[name];
      }
    });
  return to;
};
