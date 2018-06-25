## Quelques notes à propos de Javascript

### Pour lancer node en mode [use strict](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode)
`node --use_strict`

### [Egalité](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
```js
> NaN === NaN
false
> -0 === +0
true
```

```js
> Object.is(NaN, NaN)
true
> Object.is(-0,+0)
false
```

Il est préférable d'utiliser `===` et `isNaN(NaN)` si besoin.

### Types de données

6 types primitifs et `Object`

* Boolean (`true`, `false`)
* Null (`null`)
* Undefined (`undefined`)

```js
> typeof null
'object'
> typeof undefined
'undefined'
> var a
undefined
> a
undefined
> 1 + null
1
> 1 + undefined
NaN
```

* Number (double, `+Infinity`, `-Infinity`, `NaN`)

```js
> 42 / +0
Infinity
> 42 / -0
-Infinity
```

* String
   	* string primitives
   	
   	```js
      	> String('foo') === 'foo'
	true
	> typeof 'foo'
	'string'
	> 'foo'.length
	3
	```
   	* String objects

   	```js
   	> new String('foo') === 'foo'
	false
	> typeof new String('foo')
	'object'
	> new String('foo').toString() === 'foo'
	true
   	```
   	
	* template

	```js
	var a = 5;
	var b = 10;
	console.log(`Fifteen is ${a + b} and
	not ${2 * a + b}.`);
	// "Fifteen is 15 and
	// not 20."
	```

* Symbol (new in ECMAScript 6)

* Objects

### Scope

* `var` déclare une variable ("en début de fonction"). La portée est la fonction et non le block :

	```js
	f = function() {
	  { var x = 3; }
	  console.log(x);  // 3
	}
	```
	
* `let` déclare une variable locallement à un block :

	```js
	function f() {
	  let x = 1;
	  if (true) {
	    let x = 2;
	    console.log(x);  // 2
	  }
	  console.log(x);  // 1
	}
	```
* `const` se comporte comme `let` mais définit une constante

