---
title: 'Three Ways to Make Database Queries in Rails'
summary: 'Introduction of Rails find(), find_by(), and where(), and their behaviors.'
createdAt: 2019-07-24 00:00:00 +0800
publishedAt: 2019-07-24
categories: [rails, active_record]
---

In Rails, querying the record(s) from database can be done through the following methods:

1. [`find(*arguments){:ruby}`](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find)

   - Find records by their IDs
   - **Raises exception ([`ActiveRecord::RecordNotFound{:ruby}`](https://api.rubyonrails.org/classes/ActiveRecord/RecordNotFound.html)) if no record is found**

2. [`find_by(argument, *arguments){:ruby}`](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find_by)

   - Finds the first record matching the specified conditions
   - Returns `nil{:ruby}` if no record is found
   - `find_by!(argument, *arguments){:ruby}` raises ActiveRecord::RecordNotFound like `find(){:ruby}` if no record is found

3. [`where(options = :chain, *rest){:ruby}`](https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where)

   - Refer to [How to Use The Rails Where Method (with Examples)](https://www.rubyguides.com/2019/07/rails-where-method/?tl_inbound=1&tl_target_all=1&tl_period_type=1), starting from "Basic Where Conditions", for examples and their use cases

### Refs

- [How to Use The Rails Where Method (with Examples)](https://www.rubyguides.com/2019/07/rails-where-method/?tl_inbound=1&tl_target_all=1&tl_period_type=1)
- [ActiveRecord::FinderMethods](https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html)
- [ActiveRecord::QueryMethods](https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html)
