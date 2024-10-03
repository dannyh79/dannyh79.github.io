---
title: '原來 Rails Console 可以這樣用'
createdAt: 2020-05-30 10:00:00 +0800
publishedAt: 2020-05-30
categories: [rails, ruby]
---

## 目錄

- 前言
- 使用 `reload!` 來重新讀取更改過後的 Code
- 呼叫 Helper Methods 與發送 HTTP Request
  - 呼叫 URL Helper Method
  - 呼叫 View Helper Method
- 用 YAML Module 將資料漂亮地印出
- Rails Console Sandbox Mode
- 其它小技巧
  - 使用 `~/.irbrc` 載入常用的東西
  - IRB 裡的 `_`
- 補充： `$ rails routes` 加 flag （ Rails 5 以上）

## 前言

程式語言 Perl 的作者 [Larry Wall](https://en.wikipedia.org/wiki/Larry_Wall) 在他的書 [Programming Perl](https://en.wikipedia.org/wiki/Programming_Perl) 曾經提到過的 [Programmer 三大美德 （ Three Virtues of a Programmer ）](http://threevirtues.com/)之中，第一點即為「懶惰 （ Laziness ）」。在 Rails 工程師天天中都會使用到的 Rails console ，其實有些更<del>偷懶</del>聰明的使用方式。筆者在這邊整理了一些小撇步，要來帶著大家一起更有效率地使用 Rails console ！

## 使用 `reload!` 來讀取更改過後的 Code

若是在 Rails console 已經開啟的狀態下更動了 code ，只要執行 `reload!` ， Rails 就會讀取更改過後的 code ！

```ruby
# call a model's scope
>> SomeModel.some_scope

# modify the code and use `reload!`
>> reload!
>> SomeModel.some_scope
```

## 呼叫 Helper Methods 與發送 HTTP Request

說到測試 helper ，一般比較直覺的做法會是在 ERB template 或 helper method 的 method body 中插入斷點（如 `byebug` 或 `binding.pry` ）後試圖讓 code 跑到斷點以進行測試。但其實在 Rails console 中是可以呼叫這些 methods 的。

### 呼叫 URL Helper Method

想要在 console 裡呼叫 URL method 的話，只要將 method send 給 `helper` 就可以了。若想要更進一步、直接在 console 內發送 request ，只要將 HTTP Verb send 給 `app` 即可：

```ruby
# example from https://guides.rubyonrails.org/command_line.html#rails-console
>> app.root_path
 => "/"

>> app.get _
Started GET "/" for 127.0.0.1 at 2014-06-19 10:41:57 -0300
...
```

### 呼叫 View Helper Method

想要在 console 裡呼叫 helper method 的話，可以將 method send 給 `helper` 來使用。筆者自己常用的情境有以下：

- 測試 Rails 的 helper method
- Debug 自己寫的 helper method

```ruby
>> helper.number_to_currency 1234.567, unit: '円', precision: 1, format: '約 %n %u'
 => "約 1,234.6 円"
>> helper.some_helper_method
```

## 用 YAML Module 將資料漂亮地印出

若是平常的工作情境上會常常需要呈現資料給夥伴的話，將資料以好閱讀的方式印出，可以<del>有效降低夥伴眼睛脫窗的機率</del>讓夥伴更快速地掌握資料的樣貌。要在 Rails console 中將資料漂亮地印出，除了使用一般常見的 gem [Hirb](https://github.com/cldwalker/hirb) 或 [Awesome Print](https://github.com/awesome-print/awesome_print) 外，還可以使用已經在 Rails 裡面就引入的 `YAML` module 來達到類似的效果。若想要在一般的 IRB 內使用的話，只要先執行 `require 'yaml'` 就可以了。

```ruby
>> y User.first.attributes
---
id: 1
email: email@email.biz
encrypted_password: "somelonglonglonghashedpw"
 => nil
```

```ruby
2.6.0 :005 > y %w[foo bar baz]
---
- foo
- bar
- baz
 => nil
```

```ruby
>> y({ a: 1, b: 2, c: 3 })
---
:a: 1
:b: 2
:c: 3
 => nil
```

若看不慣 YAML 的資料格式，可以用 `PP` module （ Pretty-Printer ），在保留資料原來的樣態下印出 hash 或 array ：

```ruby
>> pp User.first.attributes
---
{"id"=>1,
 "email"=>"email@email.biz",
 "encrypted_password"=>
  "somelonglonglonghashedpw"}
 => # omitted
```

## Rails Console Sandbox Mode

要在不更動到 DB 裡的資料的前提下在 Rails console 裡面進行操作，可以在呼叫 Rails console 時在後方加上 flag `--sandbox` 。沙盒模式運用了 DB 的 savepoint ，在離開 Rails console 後即 rollback 。

但是沙盒模式並不是萬能的，需要注意的地方有

- 跑 `drop_table` 的 migration 是沒有辦法 rollback 的；與
- **不要在 Production 使用，因為沙盒模式會讓被更新的資料列被鎖住，造成其它需要跟該資料列互動的工作被卡住。**

```sh
# short form
# $ rails c -s
$ rails console --sandbox
```

```ruby
Loading development environment in sandbox (Rails 5.2.4.2)
Any modifications you make will be rolled back on exit
>> User.delete_all
  User Destroy (18.5ms)  DELETE FROM "users"
 => 11
>> exit
   (0.3ms)  ROLLBACK
```

平常在新增 migrate 檔時，若擔心在執行 `rails db:migrate` 的過程當中、會因為 migrate 檔內有一部分 code 沒寫好而造成執行失敗，陷入了「 migrate 檔僅跑完部分、但檔案被 Rails 標註為已執行、 DB 資料還壞掉」的這種不上不下的窘境，也可以運用 Rails console 的沙盒模式來放心地進行測試！

```ruby
# credit goes to https://shime.sh/til/testing-migrations-from-sandboxed-rails-console
>> require './db/migrate/20200516140557_create_identities.rb'
 => true

# use #change/#up to invoke the migration
>> CreateIdentities.new.change
-- create_table(:identities)
   (11.1ms)  CREATE TABLE "identities" ( # omitted
```

## 使用 `~/.irbrc` 載入常用的東西

透過在家目錄下定義的 `.irbrc` ，我們可以在每次 IRB 或 Rails Console 被開啟時，將我們所需要的函式庫及設定一次讀取進來：

- 引入需要平常會用到的 modules ，如前面提到的 `YAML` ，或者是 `BigDecimal`
- 設定在 console 內、給特定專案用的 aliases 及 helper methods

```ruby
# ~/.irbrc
LIBS = %w[yaml bigdecimal hirb].freeze
LIBS.each do |lib|
  next if respond_to? lib

  require lib
  puts "Lib is loaded: #{lib}"
rescue LoadError
  puts "\e[31mLoading lib failed: #{lib}\e[0m"
end

if defined? Rails
  app_name = Rails.application.class.parent.to_s

  # tries to match module name string defined in config/application.rb
  if app_name == 'FooBarBaz'
    def me
      @me ||= User.find_by(first_name: 'danny', last_name: 'boi')
    end
  end

  if app_name == 'BazBarFoo'
    # that long query you find yourself typing every day
    def foo
      Foo.where(some_column: 'some_long_value',
                another_column: 'some_long_long_long_value')
    end
  end
end
```

## 其它小技巧

### IRB 裡的 `_`

若是想要使用上一次 IRB eval 的結果來做些什麼的話，可以使用 `_` ：

```ruby
>> Time.now
 => 2020-05-16 10:43:02 +0800
>> now = _
 => 2020-05-16 10:43:02 +0800
>> now
 => 2020-05-16 10:43:02 +0800
```

### 使用 `CTRL` 加 `r` 搜尋歷史 Input

要搜尋之前打過的東西，除了用上下鍵慢慢找以外，其實還有更快的方式。按下 `CTRL` 加 `r` 後就可以輸入關鍵字、往回搜尋曾經輸入過的 code 。

若要離開 `reverse-i-search` 模式，按下 `ESC` 或 `CTRL` 加 `[` 即可跳出。

## 補充： `$ rails routes` 加 flag （ Rails 5 以上）

若要以 `rails routes` 來尋找特定的路徑，最直覺的方式應該是 pipe 給 grep 來過濾出自己想要的路徑：

```sh
$ rails routes | grep users
```

在 Rails 5 以後，可以靠 flag `-c` 或 `-g` 達到類似的效果：

- Controller specific search

```sh
$ rails -c users
$ rails -c admin/users
```

- Pattern specific search

```sh
$ rails routes -g product
```

若專案使用的是 Rails 6 ，還可以使用 flag `-x` 、漂亮地印出路徑：

```sh
# example from https://guides.rubyonrails.org/routing.html#listing-existing-routes
# short form
# $ rails routes -x
$ rails routes --expanded
```

```
--[ Route 1 ]----------------------------------------------------
Prefix            | users
Verb              | GET
URI               | /users(.:format)
Controller#Action | users#index
--[ Route 2 ]----------------------------------------------------
Prefix            |
Verb              | POST
URI               | /users(.:format)
Controller#Action | users#create
# omitted
```

那以上跟直接呼叫 `rails routes` 後再使用 `grep` 有什麼差異嗎？其實沒有<del>，但是可以拿出來炫一下</del>。

## 參考資料

- [The Rails Command Line - 1.4 rails console](https://guides.rubyonrails.org/command_line.html#rails-console)
- [Testing migrations from sandboxed Rails console](https://shime.sh/til/testing-migrations-from-sandboxed-rails-console) by [Hrvoje Šimić](https://shime.sh/)
- [Rails Routing from the Outside In - 5.1 Listing Existing Routes](https://guides.rubyonrails.org/routing.html#listing-existing-routes)
