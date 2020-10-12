---
layout:     post
title:      "Super, or Super()?"
date:       2019-05-14 00:00:00 +0800
categories: ruby
comments:   true

---

## TLDR
- `super` equals `super(*args)`, which brings ALL args to the inherited method
- `super()`..., is just `super()` that simply invokes the inherited method

|super|super()|super(arg1, arg2, ...)|
|---|---|---|
|Will take ALL args to the inherited method|Will NOT take any args|Will take the specified args|

## Keyword "Super" in Ruby
When `super` is used in a method, e.g., `#eat` in class `Dog`, `super` calls the method **of the same name** in parent class, i.e., `#eat` in `Animal`:

```ruby
class Animal
  def eat
   puts "eating"
  end
end

class Dog < Animal
  def eat
    # calls super here
    super
  end
end

doggy = Dog.new
p doggy.eat # "eating"
```

### Wait, ArgumentError?
Things start to get messy when we decide to explicitly pass arguments to `super`:

```ruby
class Animal
  def eat(food)
    puts "eating #{food}"
  end
end

class Dog < Animal
  def eat(food1, food2)
    # super without declaring args
    super
    puts "eating #{food2} as well"
  end
end

class Cat < Animal
  def eat(food1, food2)
    # super with args
    super(food1)
    puts "eating #{food2} as well"
  end
end

doggy = Dog.new
kitty = Cat.new
doggy.eat("bento", "sushi") # "ArgumentError: (given 2, expected 1)"
kitty.eat("bento", "sushi") # "eating bento" & "eating sushi as well"
```

## Super vs. Super()
- `super` equals `super(*args)`, which brings ALL args to the inherited method
- Use `super()` when you just want to call the method inherited from Parent without passing args

|super|super()|super(arg1, arg2, ...)|
|---|---|---|
|Will take ALL args to the inherited method|Will NOT take any args|Will take the specified args|

## Examples
Say, we have a class, called `Animal`:
```ruby
class Animal
  def eat
    puts "eating"
  end
end
```
### Scenarios
- Use `super` in `#eat`:

```ruby
class Dog < Animal
  def eat(food1, food2)
    super
    puts "eating #{food2} as well"
  end
end

doggy = Dog.new
doggy.eat("bento", "sushi") # "ArgumentError: (given 2, expected 0)"
#                                              ^^^^^^^
```

- Use `super(arg)` in `#eat`:

```ruby
class Cat < Animal
  def eat(food1, food2)
    # super(arg)
    super(food1)
    puts "eating #{food2} as well"
  end
end

kitty = Cat.new
kitty.eat("bento", "sushi") # "ArgumentError: (given 1, expected 0)"
#                                              ^^^^^^^
```

- Use `super()` in `#eat`:

```ruby
class Bird < Animal
  def eat(food1, food2)
    # Just super()
    super()
    puts "eating #{food1} and #{food2} as well"
  end
end

birdy = Bird.new
birdy.eat("bento", "sushi") # program executes; prints
# eating
# eating bento and sushi as well
```

## References
- [Object#super](https://ruby-doc.org/docs/keywords/1.9/Object.html#method-i-super){:rel="nofollow noopener noreferrer" target="_blank"} by ruby-doc.org

- [How to Use The Ruby Super Keyword](https://www.rubyguides.com/2018/09/ruby-super-keyword/){:rel="nofollow noopener noreferrer" target="_blank"} by Jesus Castello

- [super vs super() in Ruby](https://carsontang.github.io/ruby/2013/06/16/super-vs-super-in-ruby/){:rel="nofollow noopener noreferrer" target="_blank"} by [Carson Tang](https://carsontang.github.io/){:rel="nofollow noopener noreferrer" target="_blank"}
