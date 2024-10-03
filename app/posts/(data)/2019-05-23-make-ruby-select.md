---
title: 'Make Your Own ".select()" Method in Ruby'
createdAt: 2019-05-23 00:00:00 +0800
publishedAt: 2019-05-23
categories: [ruby]
---

## Ruby’s Open Classes

Thought it was a fun exercise that integrates Ruby’s features (code block, open classes) so I’d like to share it. :)

## Example

```ruby
# 1.
class Array
  # 1.
  def dan_select
    # 2.
    result = []
    self.each do |list_item|
      # 3-2.                # 3-1.
      result << list_item if yield list_item
    end
    result
  end
end

arr = [1, 2, 3, 4, 5]

p arr.dan_select { |list_item| list_item.odd? }
# 4.             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# outputs [1, 3, 5]

p arr.dan_select { |list_item| list_item.even? }
# 4.             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# outputs [2, 4]
```

## Explanation

1. Add the method, i.e., `dan_select()`, to Array class, via Ruby’s ["open classes"](https://docs.ruby-lang.org/en/2.4.0/syntax/refinements_rdoc.html) feature

2. Make a result "container" that we can put the filtered list item

3. Set yield for the conditionals (in the form of "code block") in step 4. Then put the list items into the container only when they pass the conditionals; return the filtered result at the end

4. Send our own select method to an array with a block

## Further Reading

- [Get the most out of Ruby by using the .select .map and .reduce methods together](https://medium.freecodecamp.org/ruby-using-the-select-map-and-reduce-methods-together-a9b2af30804b) by [Declan Meehan](https://medium.freecodecamp.org/@declanmeehan)

## Refs

- Exercise by [高見龍](http://kaochenlong.com)
- [Get the most out of Ruby by using the .select .map and .reduce methods together](https://medium.freecodecamp.org/ruby-using-the-select-map-and-reduce-methods-together-a9b2af30804b) by [Declan Meehan](https://medium.freecodecamp.org/@declanmeehan)
