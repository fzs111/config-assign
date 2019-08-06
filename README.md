# config-assign
> A configurable alternative of [`Object.assign`][assign]

## 0. Table of contents <a id="contents">
0. [Table of contents (You're reading it right now, so this link is useless)](#contents)
1. [Installation](#install)
2. [Usage](#usage)
	1. [Require](#usage-require)
	2. [Syntax](#usage-syntax)
	3. [Return value](#usage-return)
	4. [Throws](#usage-throws)
3. [Examples](#examples)
4. [All together...](#all_together)
5. [See also](#see_also)
6. [License](#license)

## 1. Installation <a id="install">
Run the following command to install:

    npm i config-assign

>**Note!** `config-assign` works on ES6 and above
## 2. Usage <a id="usage">
### 2.1 Require <a id="usage-require">
Obtain the function like this:
```js
const configAssign = require('config-assign')
```
### 2.2 Syntax <a id="usage-syntax">
Syntax:
```js
configAssign(target, source[, options])
//or
configAssign(target, ...sources, options)
```
- **`target <Object>`**:  The target object
- **`source <Object>`**, **`...sources <Object>`**: The source object(s)
- **`options <Object>`**: A configuration object containing (some of) the following values:
	- **`descriptors <boolean>`**: Whether or not to copy [accessor property descriptors]([https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)).  
	Default is `true`.
	- **`define <boolean>`**: Whether or not to use `defineProperty` and `getOwnPropertyDescriptors` instead of `[[Set]]` and `[[Get]]`. If `false`, `configAssign` will trigger getters and setters, while if `true`, it will copy them.  
	Default is `true`.
	- **`mutate <boolean>`**: Whether or not to mutate the `target` object.  <a id="usage-syntax-mutate">
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
### 2.3 Return value <a id="usage-return">
- On success, the function returns the target object. It is the same object as the `target` given as argument, unless the `mutate` option set to `false`. In that case, a cloned object get returned.
- On failure, returns `false` if the `returnBool` option set to `true`
### 2.4 Throws <a id="usage-throws">
- [`Error`]([https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)) on failure, if the `returnBool` option is `false`
## 3. Examples <a id="examples">
Works like `Object.assign`:
```js
const result = configAssign({foo:0},{bar:1},{baz:2},{/* options */})

console.log(result) //{foo:0, bar:1, baz:2}
```
Works with any JS object (incuding arrays):
```js
const result = configAssign(['a','b'],[,,'c','d'],{4:'e',5:'f'},{/* options */})

console.log(result) //['a','b','c','d','e','f']
```
By default, it mutates the `target` object:
```js
const target = {foo:0}
const source = {bar:1}

configAssign(target,source,{/* options */})

console.log(target) //{foo:0, bar:1}
```
And returns the `target`:
```js
const target = {foo:0}
const source = {bar:1}

const result = configAssign(target,source,{/* options */})

console.log(target === result) //true
```
Easier error handling with `returnBool: true`:
```js
const target = Object.freeze({foo:0}) //Immutable target
const source = {bar:1}

//Original
{
	let result;
	try{
		result = configAssign(target,source,{/* options */})
	}catch(e){
		//Handle error somehow
	}
	if(result){
		//Do something
	}
}

//With `returnBool:true`
{
	if(configAssign(target,source,{returnBool:true})){
		//Do something
	} else {
		//Handle error somehow
	}
}
```
Supports recursion:
```js
const target = {
	foo:{
		bar:{
			baz:0,
			x:0
		}, 
		x:0
	}, 
	x:0
}
const source = {foo:{bar:{baz:1}}}

//Reassign only baz
configAssign(target,source,{recursive:Infinity})

console.log(target)
/*
{
	foo:{
		bar:{
			baz:1,
			x:0
		}, 
		x:0
	}, 
	x:0
}
*/
```
You can even restrict recursion depth:
```js
const target = {
	foo:{
		bar:{
			baz:0,
			x:0
		}, 
		x:0
	}, 
	x:0
}
const source = {foo:{bar:{baz:1}}}

//Reassign only bar
configAssign(target,source,{recursive:1})

console.log(target)
/*
{
	foo:{
		bar:{
			baz:1
		}, 
		x:0
	}, 
	x:0
}
*/
```
Or you can disable mutations:
```js
const target = {foo:0}
const source = {bar:1}

const result = configAssign(target,source,{mutate:false})

console.log(target) //{foo:0}
console.log(result) //{foo:0,bar:1}
console.log(result === target) //false
```
But [be careful](#usage-syntax-mutate) with more complex objects:
```js
class Foo{}

const target = new Foo()
const source = {bar:1}

const result = configAssign(target,source,{mutate:false})

console.log(target) //Foo{}
console.log(result) //Foo{bar:1}
console.log(result instanceof Foo) //false ?!
```
Whether or not to copy getters / setters? It relies on the `define` option:
```js
const target = {bar:0, set foo(value){this.bar=value}}
const source = {baz:1, get foo(){return this.baz}}, 

//With `define: false`
{
	const result = configAssign(target,source,{define:false,mutate:false}) //Trigger getters and setters

	console.log(result) //{get foo(){...}, bar:1, baz:1}
}

//With `define: true` (default)
{
	const result = configAssign(target,source,{define:true,mutate:false}) //Copy getters and setters

	console.log(result) //{get foo(){...}, set foo(){...}, bar:0, baz:1}
}
```
## 4. All together... <a id="all_together">
You got the power!  
Combine all options together, and reach anything you want.  
If you have a question, recommendation, bug or a feature request, open an issue in the [Github repository][github].
## 5. See also <a id="see_also">
[`Object.assign`][assign] - Similar, native JS function, without options
## 6. License <a id="license">
Licensed under: [MIT © 2019 fzs111][mit]

[github]: https://github.com/fzs111/config-assign
[mit]: https://github.com/fzs111/config-assign/blob/master/LICENSE
[assign]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign