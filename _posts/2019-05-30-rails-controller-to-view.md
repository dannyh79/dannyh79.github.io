---
layout:     post
title:      "How Does Rails Pass Data from Controller to View?"
date:       2019-05-30 00:00:00 +0800
categories: rails
comments:   true

---

## How Variables Flow from Controller to View
Assuming we have the following files:

#### Route
```ruby
# config/routes.rb
Rails.application.routes.draw do
  get 'pokemons/:id', to: 'pokemons#show'
end
```

#### Model

```ruby
# app/models/pokemon.rb
class Pokemon < ApplicationRecord
  has_one :trainer
end
```
```ruby
# app/models/trainer.rb
class Trainer < ApplicationRecord
end
```

#### Controller

```ruby
# app/controllerspokemons_controller.rb
class PokemonsController < ApplicationController
  def show
    @pokemon = pokemon.find_by(id: params[:id])
    @trainer = if @pokemon
                 @pokemon.trainer
               else
                 nil
               end
  end
end
```

#### View

```erb
# app/views/pokemons/show.html.erb
<h3>My Pokemon</h3>
<p><%= @pokemon&.name %>(trainer: <%= @trainer&.name %>)</p>
```

### Steps
Per [GoRails](https://www.youtube.com/watch?v=mRJSovhdzWc){:rel="nofollow noopener noreferrer" target="_blank"}, how variables in an action of a controller are passed to View can be thought as the following:
```ruby
# Pseudo code; NOT how Rails actually runs

# Assuming we have records for pokemons/trainers in DB:
## When a HTTP request knocks on our Rails app's door with the url,
## "yourdomain.com/pokemons/1"...

# 1.
## Route calls a certain action of a controller according to its routing setup
kontroller = PokemonsController.new
kontroller.send(:show)

# 2.
## Now we have the following
## since we have instance variables set via "show" method
kontroller.instance_variables # [:@pokemon, :@trainer]

# 3.
## When no explicit "render()" stated in the method, Rails by default calls
## the template with matching name to the action
## See:
## https://guides.rubyonrails.org/layouts_and_rendering.html#rendering-by-default-convention-over-configuration-in-action
## https://youtu.be/mRJSovhdzWc?t=146 (Sending Data Between Rails Controllers and Views by GoRails)
def show
  # ..omitted

  render 'show.html.erb', kontroller.instance_variables
end
```

```html
<!--
4.
The final product, "show.html", from show.html.erb
-->
<h3>My Pokemon</h3>
<p>Pikachu(trainer: Dannyboi)</p>
```
```ruby
# When Rails receives some other request...
instance = SomeOtherController.new
```
## Description of the Steps (*not how Rails actually runs)
> When a HTTP request comes into Rails and enters its Route...

1. On the inside, Rails creates a new instance of the controller and calls a certain method (or "action", in terms of MVC model), "show"
2. Now the instance has the instance variables in the method "show"
3. At the end of the action method it calls `render()` to bind variables in the ERB template (see [default rendering in controllers](https://guides.rubyonrails.org/layouts_and_rendering.html#rendering-by-default-convention-over-configuration-in-action){:rel="nofollow noopener noreferrer" target="_blank"}) with instance variables that we just created
4. Variables in ERB template are now filled in and the template gets "translated" into HTML

## Why not just the Local Variables, but Instance Variables for Controller's Actions?
> Local variables can NOT be accessed outside of the method like instance variables do

From the illustration above, variables must still be accessible out of its containing method’s scope, so they can be used in ERB template.

Consider the examples below. In `Ex. 1`, the value of the instance variable `@var` is still accessible outside of the `bar` method, where in `Ex. 2`, the value assigned from local `var` can’t be found beyond the scope of `boo` method:
```ruby
# Ex. 1
class Foo
  attr_reader :var
  def bar
    @var = 'bar'
  end
end

i = Foo.new
i.send(:bar)

p i.var # outputs "bar"
```

```ruby
# Ex. 2
class Foo
  attr_reader :var
  def baz
    var = 'baz'
  end
end

i = Foo.new
i.send(:baz)

p i.var # outputs nil, instead of "baz"
```

## Refs
- [Sending Data Between Rails Controllers and Views](https://www.youtube.com/watch?v=mRJSovhdzWc){:rel="nofollow noopener noreferrer" target="_blank"} (Video) by [GoRails](https://www.youtube.com/channel/UCIQmhQxCvLHRr3Beku77tww){:rel="nofollow noopener noreferrer" target="_blank"}

---
Disclaimer: The above serves as reference of my understanding to Rails ONLY and the actual flow is yet to verified.
