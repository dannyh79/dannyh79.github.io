---
layout:     post
title:      "Difference between \"{}\" & \"do...end\" in Ruby"
date:       2020-03-27 12:00:00 +0800
categories: ruby
comments:   true

---

## TLDR
- In Ruby, blocks in braces, `{ ... }`, bind stronger than in `do ... end` do
- Rule of thumb
  1. Use `{ ... }` for single-line blocks
  2. `do ... end` for multi-liners

## Try Guess the Output
> Answers in section "Precedence in Execution"

```ruby
arr = [1, 2, 3]
a = arr.map { |num| num * 2 }
b = arr.map do
  |num| num * 2
end

puts a # => ???
puts b # => ???
```

```ruby
arr = [1, 2, 3]
puts arr.map { |num| num * 2 } # => ???
puts arr.map do
  |num| num * 2
end # => ???
```

## What is Block in Ruby
In Ruby, a (code) block is a piece of code that takes arguments. A block can NOT "survive" on its own, UNLESS it is attached to methods, or in the form of `proc` or `lambda`.

```ruby
# Two ways to wrap a block in Ruby
# They will cause errors if put like these
# 1. { ... }
{ puts 1 } # gets "SyntaxError"
# 2. do ... end
do puts 1 end # gets "SyntaxError"
```

```ruby
def some_method
  yield
end

# Good; these will not cause SyntaxError
some_method { puts 1 }
proc_print_one = proc { puts 1 }
lambda_print_one = lambda { puts 1 }
```

> Read more about the difference between `proc` and `lambda` in my blog post [Proc & Lambda in Ruby]({% post_url 2019-05-12-ruby-proc-lambda %})!

## Precedence in Execution
Per documentation in Ruby-Doc.org, `{ ... }` blocks have priority below all [listed operations](https://ruby-doc.org/core-2.7.0/doc/syntax/precedence_rdoc.html){:rel="nofollow noopener noreferrer" target="_blank"}, but `do ... end` blocks have even lower priority.

- No difference in terms of output, as all gets executed before printed

```ruby
arr = [1, 2, 3]
a = arr.map { |num| num * 2 }
b = arr.map do
  |num| num * 2
end

puts a # => [2, 4, 6]
puts b # => [2, 4, 6]
```

- The following `#map`s are interpreted differently in Ruby
  - `puts arr.map { ... }` equals `puts(arr.map { ... })`, but
  - `puts arr.map do ... end` are actually `puts(arr.map) do ... end`

```ruby
arr = [1, 2, 3]
puts arr.map { |num| num * 2 } # prints the following
# 2
# 4
# 6
puts arr.map do
  |num| num * 2
end # => #<Enumerator:0x00007fb34d8d40c0>
```

See [Precedence](https://ruby-doc.org/core-2.7.0/doc/syntax/precedence_rdoc.html){:rel="nofollow noopener noreferrer" target="_blank"} for the comprehensive list of precedence.

## References
- [Precedence](https://ruby-doc.org/core-2.7.0/doc/syntax/precedence_rdoc.html){:rel="nofollow noopener noreferrer" target="_blank"} by Ruby-Doc.org
