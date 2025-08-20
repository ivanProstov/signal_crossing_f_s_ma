import { cloneDeep } from 'lodash';

export const getMock = function <T>(initValue: T) {
  return (fn?: (initValue: T) => void) => {
    const clone = cloneDeep(initValue);
    if (fn) {
      fn(clone);
    }
    return clone;
  };
};
