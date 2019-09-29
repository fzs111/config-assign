//Licensed under MIT (c) 2019 fzs111
//Visit this project on GitHub: https://github.com/fzs111/config-assign/

module.exports = function configAssign(target, ...args) {
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
      filter: null,         //function used to filter properties
      reverse: false        //whether or not to keep the leftmost instead of the rightmost value on same keys
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
        };
        return Reflect.set(obj, prop, value.value) && success;
      };
    },
    isObject = value => typeof value === "object" && value === Object(value);
  if (target !== Object(target) || !args.every(source=>source === Object(source))) {
    if(options.returnBool){
      return false;
    } else {
      throw new TypeError('Target and sources must be objects, primitive given');
    }
  }
  if (!options.mutate) {
    const clone = (obj) => {
      let proto = Object.getPrototypeOf(obj);
      const desc = Object.getOwnPropertyDescriptors(obj);
      Object.keys(desc).forEach(key => {
        if (isObject(desc[key].value)) {
          desc[key].value=clone(desc[key].value);
        };
      });
      if (proto) proto = clone(proto);
      return Object.create(proto, desc);
    };
    target = clone(target);
  };
  args.forEach(source => {
    const foreach = prop => {
      if (options.stopOnError && !success) return;
      if (!options.nonEnumerable && !get(prop).enumerable) return;
      if (options.reverse && Object.prototype.hasOwnProperty.call(target, prop)) return;
      if (options.filter && !options.filter.call(target, prop, target, source)) return;
      if (Math.floor(options.recursive) && source !== target && isObject(get(target, prop).value) && isObject(get(source, prop).value)) {
        const value = configAssign(get(target, prop).value, get(source, prop).value, Object.assign({}, options, {
          returnBool: true,
          recursive: options.recursive - 1
        }));
        if (options.mutate) {
          success = value && set(target, prop, {value}) && success;
        } else {
          success = value && success;
        };
      } else {
        success = set(target, prop, get(source, prop)) && success;
      };
    };
    Object.getOwnPropertyNames(source).forEach(foreach);
    if (options.symbols) Object.getOwnPropertySymbols(source).forEach(foreach);
  });
  if (success) return target;
  else if (options.returnBool) return false;
  else throw new Error('configAssign failed');
};
