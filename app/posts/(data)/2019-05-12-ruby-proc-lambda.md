---
title: 'Proc & Lambda in Ruby'
summary: "Introduction to Ruby's proc and lambda, with side-to-side comparisons."
createdAt: 2019-05-12 00:00:00 +0800
publishedAt: 2019-05-12
categories: [ruby]
---

The following are some of notes about Ruby's proc and lambda:

- Function composition in mathmetics
- Blocks (of code) in Ruby (normal blocks, procs & lambdas)

## Function Composition in Mathmetics

In Ruby, a composite proc/lambda is an example of function composition. On Wikipedia, the definition goes by the following:

> In mathematics, function composition is an operation that takes two functions f and g and produces a function h such that h(x) = g(f(x)).

```ruby
# Ruby's lambda equivalent of
# h(x) = g(f(x)) = (g ∘ f)(x)
f = ->(x) { x + 1 }
g = ->(x) { puts x }
h = ->(x) { g.(f.(x)) }

h.(1) # prints 2
```

I see the above as if someone were "hitting combo" with the two functions, `f` and `g`. Function `f` gets executed first, then function `g` carries on and process function `f`'s output. And the order goes from inside out and on.

## Blocks in Ruby

```ruby
def x
 # "yield" yields block attached to method "x", if any
 yield
end

# Make block 2 ways
# Note there's slight difference in precedence of code execution
# 1. With curly braces
foos.each { |foo| puts foo }

# 2. With "do...end"
bars.each do |bar|
  puts bar
end
```

A block, or [closure](<https://en.wikipedia.org/wiki/Closure_(computer_programming)>) in other programming languages, can NOT "survive" on its own in Ruby. It has to be attached to an object, i.e., variables or methods, or in the form of a proc/lambda.

```ruby
{ puts 1 } # gets "SyntaxError"
do puts 1 end # gets "SyntaxError"
```

> Do you know there is difference between using `{ ... }{:ruby}` and `do ... end{:ruby}` block? Check out my blog post [Difference between "{}" & "do...end" in Ruby](/posts/ruby-precedence-in-block)!

## Proc and Lambda

- [Definition](http://ruby-doc.org/core-2.6.3/Proc.html#class-Proc-label-Lambda+and+non-lambda+semantics) by ruby-doc.org
  > A [procedure object](https://ruby-doc.org/docs/ruby-doc-bundle/UsersGuide/rg/procobjects.html), or proc, is an encapsulation of a **block (of code)**, which can be stored in a local variable, passed to a method or another proc, and can be called.

### Proc

- Ways to create a proc (courtesy of [A Guide to Function Composition in Ruby](https://www.ghostcassette.com/function-composition-in-ruby/#functions-in-ruby))

  ```ruby
  # Use the Proc class constructor
  double = Proc.new { |number| number * 2 }

  # Use the Kernel#proc method as a shorthand
  double = proc { |number| number * 2 }

  # Receive a block as an argument (note the &)
  def make_proc(&block)
    block
  end

  double = make_proc { |number| number * 2 }

  # Use Proc.new to capture a block passed to a method without an
  # explicit block argument
  def make_proc
    Proc.new
  end

  double = make_proc { |number| number * 2 }
  ```

- Ways to call a proc (courtesy of [A Guide to Function Composition in Ruby](https://www.ghostcassette.com/function-composition-in-ruby/#functions-in-ruby))

  ```ruby
  double.call(2) # => 4
  double.(2)     # => 4
  double[2]      # => 4
  double === 2   # => 4
  ```

### Lambda - Proc with Flavor

- Ways to create a lambda (courtesy of [A Guide to Function Composition in Ruby](https://www.ghostcassette.com/function-composition-in-ruby/#functions-in-ruby))

  ```ruby
  # Use Kernel#lambda
  double = lambda { |number| number * 2 }

  # Use the Lambda literal syntax (more elegant)
  double = ->(number) { number * 2 }
  ```

- Ways to call a lambda
  > Same as proc's

## Lambda vs. Proc

> Summarized from [Lambda and Non-Lambda Semantics](http://ruby-doc.org/core-2.6.3/Proc.html#class-Proc-label-Lambda+and+non-lambda+semantics).

| Scenario                                               | Proc                                                                                | Lambda                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------- |
| a.) _When there is a `return{:ruby}` on the inside..._ | Jumps out and end the embracing function (function that called the proc)            | **ONLY** jumps out of the block |
| b.) _When being fed on extra args..._                  | NO ERROR raised                                                                     | `ArgumentError{:ruby}`          |
| c.) _When there is not enough args..._                 | Missing args will be substituted with `nil{:ruby}`                                  | `ArgumentError{:ruby}`          |
|                                                        | If the last arg entered is an array, it will be broken down to fit the missing args |                                 |

### Example

> Rearranged from [A Guide to Function Composition in Ruby](https://www.ghostcassette.com/function-composition-in-ruby/#functions-in-ruby).

```ruby
# a.)
proc = proc { return }
lambda = -> { return }

def call_proc_return
  proc.call
  "This will not be reached"
end

def call_lambda_return
  lambda.call
  "This will be reached"
end

call_proc_return # prints nil
call_lambda_return # prints "This will be reached"
```

```ruby
# b.)
proc = proc { |x, y| "#{x} and #{y}" }
lambda = ->(x, y) { "#{x} and #{y}" }

proc.(1, 2, 3) # prints "1 and 2"
lambda.(1, 2, 3) # ArgumentError (wrong number of arguments (given 3, expected 2))
```

```ruby
# c.)
proc = proc { |x, y| "#{x} and #{y}" }
lambda = ->(x, y) { "#{x} and #{y}" }

# note: some args below are a set of array,
# which is only ONE arg
proc.(1) # prints "1 and "
proc.([1, 2, 3]) # prints "1 and 2"
lambda.([1, 2, 3]) # ArgumentError (wrong number of arguments (given 1, expected 2))
```

## References

- [A Guide to Function Composition in Ruby](https://www.ghostcassette.com/function-composition-in-ruby/) by Paul Mucur

- [Closure (computer programming)](<https://en.wikipedia.org/wiki/Closure_(computer_programming)>) on Wikipedia

- [Proc](http://ruby-doc.org/core-2.6.3/Proc.html#class-Proc-label-Lambda+and+non-lambda+semantics) by ruby-doc.org

- [Procedure objects](https://ruby-doc.org/docs/ruby-doc-bundle/UsersGuide/rg/procobjects.html) by ruby-doc.org

- [程式區塊與 Proc](https://openhome.cc/Gossip/Ruby/Proc.html) by openhome.cc

- [使用 Lambda](https://openhome.cc/Gossip/Ruby/Lamdba.html) by openhome.cc
