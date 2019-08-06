

# config-assign
> A configurable alternative of Object.assign

## 0. Table of contents
TODO 

## 1. Installation
Run the following command to install:

    npm i config-assign

>**Note!** `config-assign` works on ES6 and above
## 2. Usage
### 2.1 Require
Obtain the function like this:

    const configAssign = require('config-assign')

### 2.2 Syntax
Syntax:
```js
configAssign(target, source[, options])
//or
configAssign(target, ...sources, options)
```
- **`target <Object>`**:  The target object
- **`source <Object>`**, **`...sources <Object>`**: The source object(s)
- **`options <Object>`**: A configuration object containing (some of) the following values:
	- **`descriptors <Boolean>`**: Whether or not to copy [accessor property descriptors]([https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)).  
	Default is `true`.
	- **`define <boolean>`**: Whether or not to use `defineProperty` and `getOwnPropertyDescriptors` instead of `[[Set]]` and `[[Get]]`. If `false`, `configAssign` will trigger getters and setters, while if `true`, it will copy them.  
	Default is `true`.
	- **`mutate <boolean>`**: Whether or not to mutate the `target` object.  
		>**Warning!** Disabling this option won't preserve object's method closures and constructors! Calling a closure-based method, or using  `instanceof` on the newly created object, probably won't return the expected result, so it should be used only with plain objects.
		
		Default is `true`.
	- **`symbols <boolean>`**: Whether or not to copy symbol properties.  
	Default is `true`.
	- **`recursive <number>`**: Maximum depth of recursion. Use `Infinity` or `-1` for infinite depth, and `0` to disable recursion.  
	Default is `0`.
	- **`returnBool <boolean>`**: Whether or not to return boolean `false` on error, instead of throwing an exception.  
	Default is `false`.
	- **`stopOnError <boolean>`**: Whether or not to abort the copying task when an error occurs.  
	Default is `true`.
	- **`nonEnumerable <boolean>`**: Whether or not to copy non-enumerable properties.  
	Default is `false`.
	- **`filter <Function> | <null>`**: Function used to filter properties. The function should return `true` or `false`, indicating whether the property should or shouldn't be copied, respectively. If `null`, all properties being copied. The function gets called for each property of the source objects, and receives the following arguments:
		- **`property <string> | <symbol>`**: The property being copied
		- **`target <Object>`**: The `target` object
		- **`source <Object>`**: The current `source` object

		Default is `null`.
### 2.3 Return value
- On success, the function returns the target object. It is the same object as the `target` given as argument, unless the `mutate` option set to `false`. In that case, a cloned object get returned.
- On failure, returns `false` if the `returnBool` option set to `true`
### 2.4 Throws
- [`Error`]([https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)) on failure, if the `returnBool` option is `false`
## 3. Examples
TODO
## 4. License
ISC