---
layout:     post
title:      "Side-To-Side Comparisons between Erlang and TypeScript Programs"
date:       2024-02-01 15:45:07 +0800
categories: ["erlang", "javascript", "typescript"]
comments:   true

---

## TLDR

Pattern-matching -> Higher order functions -> recursion -> terse code that feels good.

## The Push

The problems in _Learn You Some Erlang for great good_'s [Functionally Solving Problems](https://learnyousomeerlang.com/functionally-solving-problems){:rel="nofollow noopener noreferrer" target="_blank"} were interesting, thus the (premature) attempt in TypeScript.

## Closing Thoughts

Erlang's pattern-matching and [term comparison](https://www.erlang.org/doc/reference_manual/expressions#term-comparisons){:rel="nofollow noopener noreferrer" target="_blank"} features make actual code part a lot neater. And I still have much to learn to better harness these languages.

Time in reading [_Learn You Some Erlang for great good_](https://learnyousomeerlang.com/content){:rel="nofollow noopener noreferrer" target="_blank"} has been an enjoyment to me, compare to my recent [LeetCode routines](https://leetcode.com/studyplan/leetcode-75/){:rel="nofollow noopener noreferrer" target="_blank"} in the past few weeks. While the latter pushs me to reason in an efficient way, the former allows me to revisit what I missed in Elixir, the beauty of functional programming. Erlang's syntax does take a bit time to get used to, but it is growing on me now.

## Code

### RPN (Reverse Polish Notation) Calculator

```erlang
%% RPN calculator in Erlang
-module(calc).
-export([rpn/1, rpn_test/0]).

rpn(L) when is_list(L) ->
  [Res] = lists:foldl(fun rpn/2, [], string:tokens(L, " ")),
  Res.

rpn("+", [N1, N2 | S]) -> [N2 + N1 | S];
rpn("-", [N1, N2 | S]) -> [N2 - N1 | S];
rpn("*", [N1, N2 | S]) -> [N2 * N1 | S];
rpn("/", [N1, N2 | S]) -> [N2 / N1 | S];
rpn("^", [N1, N2 | S]) -> [math:pow(N2, N1) | S];
rpn("ln", [N | S]) -> [math:log(N) | S];
rpn("log10", [N | S]) -> [math:log10(N) | S];

rpn("sum", L) -> lists:sum(L);
rpn("prod", L) ->
  Res = lists:foldl(fun (Val, Acc) -> Val * Acc end, 1, L),
  [Res];

rpn(X, Stack) -> [read(X) | Stack].

read(N) ->
  case string:to_float(N) of
    {error, no_float} -> list_to_integer(N);
    {F, _} -> F
  end.

rpn_test() ->
  4037 = rpn("90 34 12 33 55 66 + * - + -"),
  ok.
```

```ts
// RPN calculator in TypeScript
interface Calculator {
  execute: (s: string) => number;
}

class RPN implements Calculator {
  private stack: Stack<number | string> = new Stack<number | string>();

  execute(s: string) {
    const elements = s.split(' ').map(this.#read);

    for (const element of elements) {
      if (typeof element === 'number') {
        this.stack.push(element);
      } else {
        this.#operateBy(element);
      }
    }

    return this.stack.pop()! as number;
  }

  #read(s: string) {
    const casted = Number(s);
    return isNaN(casted) ? s : casted;
  }

  /**
   * Only basic arith ops implemented
   */
  #operateBy(s: string): void {
    const n1 = this.stack.pop();
    const n2 = this.stack.pop();
    if (!isNumber(n1) || !isNumber(n2)) {
      console.error(
        'Unexpected values found' +
        `${isNumber(n1) ? '' : `${n1} of type ${typeof n1}`} ${isNumber(n2) ? '' : `${n2} of type ${typeof n2}`}` +
        `with operand ${s}.`
      );
      this.stack.clear();
      return;
    }

    switch (s) {
      case '+':
        this.stack.push(n2 + n1);
        break;
      case '-':
        this.stack.push(n2 - n1);
        break;
      case '*':
        this.stack.push(n2 * n1);
        break;
      case '/':
        this.stack.push(n2 / n1);
        break;
      default:
        throw(`Unknown operand "${s}" encountered.`);
    }
  }
}

function isNumber(val: unknown): val is number {
  return typeof val === 'number';
}

const rpn = new RPN();
console.log(rpn.execute('90 34 12 33 55 66 + * - + -'));

//region stack interface and impl
interface IStack<T> {
  pop: () => T | undefined;
  push: (element: T) => void;
  clear: () => void;
  elements: T[];
}

class Stack<T> implements IStack<T> {
  private stack: T[] = [];

  pop() {
    return this.stack.shift();
  }

  push(element: T) {
    this.stack.unshift(element);
  }

  clear() {
    this.stack = [];
  }

  get elements() {
    return this.stack;
  }
}
//endregion
```

### Optimal Pathfinder

```erlang
%% Optimal Pathfinder in Erlang
-module(road).
-compile([export_all, nowarn_export_all]).

main([FileName]) ->
  {ok, Bin} = file:read_file(FileName),
  Map = parse_map(Bin),
  io:format("~p~n", [optimal_path(Map)]),
  erlang:halt().

parse_map(Bin) when is_binary(Bin) ->
  parse_map(binary_to_list(Bin));
parse_map(Str) when is_list(Str) ->
  Values = [list_to_integer(X) || X <- string:tokens(Str, "\r\n\t ")],
  group_vals(Values, []).

group_vals([], Acc) ->
  lists:reverse(Acc);
group_vals([A, B, X | Rest], Acc) ->
  group_vals(Rest, [{A, B, X} | Acc]).

{% raw %}
optimal_path(Map) ->
  {A, B} = lists:foldl(fun shortest_step/2, {{0, []}, {0, []}}, Map),
  {_Dist, Path} = if hd(element(2, A)) =/= {x, 0} -> A;
                     hd(element(2, B)) =/= {x, 0} -> B
                  end,
  lists:reverse(Path).

%% actual problem solving
shortest_step({A, B, X}, {{DistA, PathA}, {DistB, PathB}}) ->
  OptA1 = {DistA + A, [{a, A} | PathA]},
  OptA2 = {DistA + B + X, [{x, X}, {b, B} | PathA]},
  OptB1 = {DistB + B, [{b, B} | PathB]},
  OptB2 = {DistB + A + X, [{x, X}, {a, A} | PathA]},
{% endraw %}
  %% see https://www.erlang.org/doc/reference_manual/expressions#term-comparisons
  %% "Tuples are ordered by size, two tuples with the same size are compared element by element."
  {erlang:min(OptA1, OptA2), erlang:min(OptB1, OptB2)}.
```

```ts
// Optimal Pathfinder in TypeScript
type Distance = number;
type Path = 'a' | 'b' | 'x';
type PathTuple = [Path, Distance];
type Triple = [distanceA: Distance, distanceB: Distance, distanceX: Distance];

function parseMap(s: string): Triple[] {
  const list = s.split(' ').map(Number);
  return groupVals(list);
}

function groupVals(array: number[], acc: Triple[] = []): Triple[] {
  if (array.length < 3) {
    return acc;
  }

  const [a, b, x, ...rest] = array;
  const triple: Triple = [a, b, x];

  return groupVals(rest, acc.concat([triple]));
}

type DistancePathsTuple = [distance: Distance, path: Array<PathTuple>];
type AccDistanceFromAAndB = [pathFromA: DistancePathsTuple, pathFromB: DistancePathsTuple];

function getOptimalPath(map: Triple[]): PathTuple[] {
  const [a, b] =
    map.reduce(getShortestPathsFromAAndB, [[0, []], [0, []]]);

  const [lastPathFromA] = a[1].slice(-1);
  return lastPathFromA[0] === `x` && lastPathFromA[1] === 0 ? a[1] : b[1];
}

function getShortestPathsFromAAndB(
    [[distA, pathA], [distB, pathB]]: AccDistanceFromAAndB,
    [a, b, x]: Triple
  ) {
  const [optA1, optA2, optB1, optB2]: DistancePathsTuple[] =
    [
      [distA + a, pathA.concat([['a', a]])],
      [distA + b + x, pathA.concat([['b', b], ['x', x]])],
      [distB + b, pathB.concat([['b', b]])],
      [distB + a + x, pathB.concat([['a', a], ['x', x]])]
    ];

  const getShorterPath = (path1: DistancePathsTuple, path2: DistancePathsTuple) => {
    return (
      (path1[0] < path2[0]) ||
      (path1[0] === path2[0] && path1[1].length < path2[1].length)
    ) ? path1 : path2;

  return [getShorterPath(optA1, optA2), getShorterPath(optB1, optB2)] as AccDistanceFromAAndB;
}

const mapString = '50 10 30 5 90 20 40 2 25 10 8 0';
console.log(getOptimalPath(parseMap(mapString)))
```

## Refs

- [Learn You Some Erlang for great good - Functionally Solving Problems](https://learnyousomeerlang.com/functionally-solving-problems){:rel="nofollow noopener noreferrer" target="_blank"}
