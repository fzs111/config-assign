module.exports = function objectAssign(target, ...args) {
  let success = true;
  const
    options = Object.assign({
      descriptors: true,    //whether or not to copy accessor descriptors
      define: true,         //whether or not to use [[Define]] instead of [[Set]]
      mutate: true,         //whether or not to mutate target
      symbols: true,        //whether or not to copy Symbol properties
      recursive: 0,         //depth of recursion
      returnBool: false,    //whether or not to return boolean false on failure instead of throwing
      stopOnError: true,    //whether or not to stop copying on error
      nonEnumerable: false, //whether or not to copy non-enumerable properties
      filter: null
    }, args.length > 1 ? args.splice(args.length - 1, 1)[0] : {}),
    get = (obj, prop) => {
      const output = Object.getOwnPropertyDescriptor(obj, prop);
      if (!output) return {
        writable: true,
        enumerable: true,
        configurable: true
      };
      if (!options.define) {
        output.value = obj[prop];
        delete output.get;
        delete output.set;
      }
      return output;
    },
    set = (obj, prop, value) => {
      if (options.define) {
        return Reflect.defineProperty(obj, prop, value);
      } else {
        let success;
        if (options.descriptors) {
          delete value.value;
          success = Reflect.defineProperty(obj, prop, value);
        }
        return Reflect.set(obj, prop, value.value) && success;
      };
    };
  if (!options.mutate) target = objectAssign({}, target, Object.assign({}, options, {
    mutate: true,
    recursive: 0
  }));
  args.forEach(source => {
    const foreach = prop => {
      if (options.stopOnError && !success) return;
      if (!options.nonEnumerable && !get(prop).enumerable) return;
      if (options.filter && !options.filter.call(target, prop, target, source)) return;
      if (options.recursive && source !== target && typeof get(target, prop).value === "object" && typeof get(source, prop).value === "object") {
        const value = objectAssign(get(target, prop).value, get(source, prop).value, Object.assign({}, options, {
          returnBool: true,
          recursive: options.recursive - 1,
          mutate: false
        }));
        success = value && set(target, prop, {value}) && success;
      } else {
        success = set(target, prop, get(source, prop)) && success;
      };
    };
    Object.getOwnPropertyNames(source).forEach(foreach);
    if (options.symbols) Object.getOwnPropertySymbols(source).forEach(foreach);
  });
  if (success) return target;
  else if (options.returnBool) return false;
  else throw new Error('Object assign failed');
};