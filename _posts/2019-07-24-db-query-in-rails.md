---
layout:     post
title:      "Three Ways to Make Database Queries in Rails"
date:       2019-07-24 00:00:00 +0800
categories: ["rails", "active_record"]
comments:   true

---

In Rails, querying the record(s) from database can be done through the following methods:
1. [`find(*arguments)`](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find){:rel="nofollow noopener noreferrer" target="_blank"}
  - Find records by their IDs
  - **Raises exception ([ActiveRecord::RecordNotFound](https://api.rubyonrails.org/classes/ActiveRecord/RecordNotFound.html){:rel="nofollow noopener noreferrer" target="_blank"}) if no record is found**

2. [`find_by(argument, *arguments)`](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find_by){:rel="nofollow noopener noreferrer" target="_blank"}
  - Finds the first record matching the specified conditions
  - Returns `nil` if no record is found
  - `find_by!(argument, *arguments)` raises ActiveRecord::RecordNotFound like `find()` if no record is found

3. [where(options = :chain, *rest)](https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where){:rel="nofollow noopener noreferrer" target="_blank"}
  - Refer to [How to Use The Rails Where Method (with Examples)](https://www.rubyguides.com/2019/07/rails-where-method/?tl_inbound=1&tl_target_all=1&tl_period_type=1){:rel="nofollow noopener noreferrer" target="_blank"}, starting from "Basic Where Conditions", for examples and their use cases

### Refs
- [How to Use The Rails Where Method (with Examples)](https://www.rubyguides.com/2019/07/rails-where-method/?tl_inbound=1&tl_target_all=1&tl_period_type=1){:rel="nofollow noopener noreferrer" target="_blank"}
- [ActiveRecord::FinderMethods](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html){:rel="nofollow noopener noreferrer" target="_blank"}
- [ActiveRecord::QueryMethods](https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html){:rel="nofollow noopener noreferrer" target="_blank"}
