Some cool tricks in bash:
- !! -> the last command
- !$ -> the last argument from last command
  - esc + .
- `!*` -> all argument from last command

- History
```sh
$ history | grep "105[8-9]"
 1058  echo 1 2 3 4
 1059  echo 5 6 7 8
```

$ echo !1058:2
echo 2
2
$ echo !1059:3
echo 7
7

Ref: https://unix.stackexchange.com/questions/86036/use-same-arguments-with-different-command
