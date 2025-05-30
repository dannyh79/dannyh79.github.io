---
title: 'How to Use .reduce() in JavaScript (1/2)'
summary: "Introduction to JavaScript's Array.prototype.reduce()."
createdAt: 2019-04-24 02:00:00 +0800
publishedAt: 2019-04-24
categories: [javascript]
---

Looking for a fancier way to add up all the numbers in an array? You might want to give `.reduce(){:js}` a try.

```js
let arr = [0, 1, 2, 3, 4];

function getSum(total, num) {
  return total + num;
}
console.log(arr.reduce(getSum)); // outputs 10
```

_Example from [W3School](https://www.w3schools.com/jsref/jsref_reduce.asp) and [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)_

The `.reduce(){:js}` method (function that is inside an object in JavaScript), by [definition](https://www.w3schools.com/jsref/jsref_reduce.asp), **is to reduce an array into a single value.**

<Image
  src="/assets/images/reduce-in-js1/1.png"
  alt="reduce syntax"
  width={800}
  height={600}
  isFirst
/>

<Figcaption>
    Fig. 1; from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</Figcaption>

However, the execution is somewhat less than intuitive (to me, at least) by just looking at the raw code and the doc. Thus comes my version of interpretation on `.reduce(){:js}`. Here in part 1 I am only going through its **callback**, **accumulator**, and **currentValue** parameter, for the sake of simplicity.
Now, let's dissect the example code into two parts:

```js
function getSum(total, num) {
  return total + num;
}
```

The first part is where we define the **callback** function[^1] (function that gets called after being defined) for later use in `.reduce(){:js}`. Inside of it we have the **accumulator** (_total_ in example), the container that stores the sum of the previous values in each iteration, and **currentValue** (_num_), the number to be added in current cycle. The two works like this when the callback is called in `.reduce(){:js}`:

<Image
  src="/assets/images/reduce-in-js1/2.png"
  alt="reduce iteration"
  width={1600}
  height={450}
/>

<Figcaption>
    Fig. 2; from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</Figcaption>

```js
console.log(arr.reduce(getSum));
```

We call `.reduce(){:js}` on an array (_arr_ in example), with our callback `getSum(){:js}`. It should print out "10" the number without a problem.

A more thorough guide on **initialValue** and **currentIndex** parameter will be given in [the next part](/posts/reduce-in-js2).

---

[^1]: You could give the callback function a name of your liking, but keeping it readable goes a long way
