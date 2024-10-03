---
title: 'Super, or Super()?'
createdAt: 2019-05-14 00:00:00 +0800
publishedAt: 2019-05-14
categories: [ruby]
---

## TLDR

- `super{:ruby}` equals `super(*args){:ruby}`, which brings ALL args to the inherited method
- `super(){:ruby}`..., is just `super(){:ruby}` that simply invokes the inherited method

| `super{:ruby}`                             | `super(){:ruby}`       | `super(arg1, arg2, ...){:ruby}` |
| ------------------------------------------ | ---------------------- | ------------------------------- |
| Will take ALL args to the inherited method | Will NOT take any args | Will take the specified args    |

## Keyword "Super" in Ruby

When `super{:ruby}` is used in a method, e.g., `Dog#eat{:ruby}`, `super{:ruby}` calls the method **of the same name** in parent class, i.e., `#eat` in `Animal{:ruby}`:

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

Things start to get messy when we decide to explicitly pass arguments to `super{:ruby}`:

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

## `Super{:ruby}` vs. `Super(){:ruby}`

- `super{:ruby}` equals `super(*args){:ruby}`, which brings ALL args to the inherited method
- Use `super(){:ruby}` when you just want to call the method inherited from Parent without passing args

| `super{:ruby}`                             | `super(){:ruby}`       | `super(arg1, arg2, ...){:ruby}` |
| ------------------------------------------ | ---------------------- | ------------------------------- |
| Will take ALL args to the inherited method | Will NOT take any args | Will take the specified args    |

## Examples

Say, we have a class, called `Animal{:ruby}`:

```ruby
class Animal
  def eat
    puts "eating"
  end
end
```

### Scenarios

- Use `super{:ruby}` in `#eat`:

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

- Use `super(arg){:ruby}` in `#eat`:

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

- Use `super(){:ruby}` in `#eat`:

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

- [`Object#super{:ruby}`](https://ruby-doc.org/docs/keywords/1.9/Object.html#method-i-super) by ruby-doc.org

- [How to Use The Ruby Super Keyword](https://www.rubyguides.com/2018/09/ruby-super-keyword/) by Jesus Castello

- [super vs super() in Ruby](https://carsontang.github.io/ruby/2013/06/16/super-vs-super-in-ruby/) by [Carson Tang](https://carsontang.github.io/)
