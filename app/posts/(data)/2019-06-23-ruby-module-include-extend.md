---
title: 'Difference between Include/Extend Modules in Ruby'
createdAt: 2019-06-23 00:00:00 +0800
publishedAt: 2019-06-23
categories: [ruby]
---

|                                  | `include{:ruby}`                                                            | `extend{:ruby}`                                                         |
| -------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| API                              | include(module, ...) → self                                                 | extend(module, ...) → obj                                               |
| Behavior                         | Invokes `Module.append_features{:ruby}` on each parameter in reverse order. | Adds to obj the instance methods from each module given as a parameter. |
| \*When used inside of a class... | Methods become **instance methods** of the class                            | Methods become **class methods** of the class                           |
| When used upon an instance...    |                                                                             | Adds to obj the instance methods from each module given as a parameter. |

### Code Example

```ruby
module Flyable
  def fly
    puts 'I am flying!'
  end
end

module Greetable
  def say_hi
    puts 'Hello!'
  end
end


class Car
  include Flyable
end

class Airplane
  extend Flyable
end


Car.new.fly # outputs "I am flying!"
Car.fly # undefined method `fly' for Car:Class (NoMethodError)

Airplane.new.fly # undefined method `fly' for #<Airplane:0x00007f8f59118998> (NoMethodError)
Airplane.fly # "I am flying!"

instance = Airplane.new.extend(Flyable, Greetable)
instance.fly # "I am flying!"
instance.say_hi # "Hello!"
```

### Refs

- [[宅] 宅男臥軌日記 (2) - ruby 中的 include, extend 及 require](http://cat-son.blogspot.com/2012/10/2-rubyinclude-extendrequire.html#sthash.uTkhw4vY.zCRDCK1W.dpbs) by [貓桑](https://www.blogger.com/profile/01978864455251846796)

- [Module#method-i-include](https://ruby-doc.org/core-2.6.3/Module.html#method-i-include) by ruby-doc.org

- [Object#method-i-extend](https://ruby-doc.org/core-2.6.3/Object.html#method-i-extend) by ruby-doc.org
