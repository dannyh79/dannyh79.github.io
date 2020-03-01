---
layout:     post
title:      "How to Use .reduce() in JavaScript (1/2)"
date:       2019-04-24 02:00:00 +0800
categories: javascript
comments:   true

---
Looking for a fancier way to add up all the numbers in an array? You might want to give `.reduce()` a try.

```js
let arr = [0, 1, 2, 3, 4];

function getSum(total, num) {
  return total + num;
}
console.log(arr.reduce(getSum)); // outputs 10
```
_Example from [W3School](https://www.w3schools.com/jsref/jsref_reduce.asp){:rel="nofollow noopener noreferrer"}{:target="_blank"} and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce){:rel="nofollow noopener noreferrer"}{:target="_blank"}_

The .reduce() method (function that is inside an object in JavaScript), by [definition](https://www.w3schools.com/jsref/jsref_reduce.asp){:rel="nofollow noopener noreferrer"}{:target="_blank"}, **is to reduce an array into a single value.**

![reduce syntax](/assets/images/reduce-in-js1/1.png)

However, the execution is somewhat less than intuitive (to me, at least) by just looking at the raw code and the doc. Thus comes my version of interpretation on .reduce(). Here in part 1 I am only going through its **callback**, **accumulator**, and **currentValue** parameter, for the sake of simplicity.
Now, let's dissect the example code into two parts:

```js
function getSum(total, num) {
  return total + num;
}
```

The first part is where we define the **callback** function[¹] (function that gets called after being defined) for later use in .reduce(). Inside of it we have the **accumulator** (_total_ in example), the container that stores the sum of the previous values in each iteration, and **currentValue** (_num_), the number to be added in current cycle. The two works like this when the callback is called in .reduce():

![reduce iteration](/assets/images/reduce-in-js1/2.png)

```js
console.log(arr.reduce(getSum));
```

We call ".reduce()" on an array (_arr_ in example), with our callback `getSum()`. It should print out "10" the number without a problem.

A more thorough guide on **initialValue** and **currentIndex** parameter will be given in [the next part]({% post_url 2019-04-29-reduce-in-js2 %}).

---

[¹] You could give the callback function a name of your liking, but keeping it readable goes a long way
