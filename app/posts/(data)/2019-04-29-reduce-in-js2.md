---
title: 'How to Use .reduce() in JavaScript (2/2)'
summary: "Deep dive into JavaScript's Array.prototype.reduce()."
createdAt: 2019-04-29 02:00:00 +0800
publishedAt: 2019-04-29
categories: [javascript]
---

In this section we are picking up what is left from [Part1](2019-04-24-reduce-in-js1),
**initialValue** and **currentIndex** parameter in `.reduce(){:js}`, as well as some of `.reduce(){:js}`'s application.

![reduce syntax](/assets/images/reduce-in-js2/1.png)

<Figcaption>
    Fig. 1; from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</Figcaption>

Regarding whether the initial value is set, there is connection between **initialValue** and the start point of **currentIndex** (see Fig. 1 "currentIndex"), though not fully manipulatable:

```js
let arr = [0, 1, 2, 3, 4];
function getSum(total, num) {
  return total + num;
}
// Fig. 2
console.log(arr.reduce(getSum));
// Fig. 3
console.log(arr.reduce(getSum, 10));
```

![reduce iteration1](/assets/images/reduce-in-js2/2.png)

<Figcaption>
    Fig. 2; from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</Figcaption>

![reduce iteration2](/assets/images/reduce-in-js2/3.png)

<Figcaption>
    Fig. 3; from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
</Figcaption>

When `.reduce(){:js}` is called without an **initialValue**, **currentValue** is set to go from "index(**currentIndex**) **1** "
(`arr[1]{:js}`; 1 in our example) in the first rotation of the loop,
where the one that is set with an **initialValue** "10" is going from "index(**currentIndex**) **0**" (`arr[0]{:js}`; 0) in the first call.

Aside from adding up the values in a plain array of numbers, `.reduce(){:js}` can also be used to

1.) [Calculate the sum of the values of a certain key in an object array](https://codeburst.io/learn-understand-javascripts-reduce-function-b2b0406efbdc), or

```js
let data = [
  {
    country: 'China',
    population: 1409517397,
  },
  {
    country: 'India',
    population: 1339180127,
  },
  {
    country: 'USA',
    population: 324459463,
  },
  {
    country: 'Indonesia',
    population: 263991379,
  },
];

let sum = data.reduce(function (accumulator, data) {
  return accumulator + data.population;
}, 0); // set initValue 0 to make sum a number instead of a string

console.log(sum); // should output 3337148366
```

2.) [Counting instances of values in an object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Counting_instances_of_values_in_an_object)

```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
let countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++;
  } else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

_...more application of `.reduce(){:js}` can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Examples)_
