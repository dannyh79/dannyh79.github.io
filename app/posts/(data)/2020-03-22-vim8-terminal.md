---
title: 'Terminal-in-Vim Makes You More Productive'
createdAt: 2020-03-22 13:00:00 +0800
publishedAt: 2020-03-22
categories: [vim, editor]
---

![Terminal mode in Vim](/assets/images/vim8-terminal/1.png)

## TLDR

- Vim 8.1 introduced terminal mode, `:terminal{:vim}`
- `:terminal{:vim}` allows you to open terminals inside Vim, hence the potential to be as productive as being in a Tmux session
- You probably don't need it if you are already using Tmux

## How is This Helpful?

In Vim, prior to this, we can only access the shell through either typing `:!{:vim}`, to and back from shell with hitting `CTRL + Z` then using `$ fg{:vim}` , or Tmux.

Now, with the new ternimal mode, combining tabs, we can work wonders with just Vim! In cover photo, I have

1. One tab with a file I am edting, a test watcher, and a terminal for working in Git
2. The other tab with some other file in another area of the code base

### Use Case

1. Checking Git log
2. Running a server or some services
3. Watching files
4. Pretty much anything you would otherwise do with `CTRL + Z` for :)

## Getting Started

### My Setup

```vim
" ~/.vimrc

" Split to the right for vsp
set splitright
" Split to the bottom for sp
set splitbelow

" <leader> + t: Opens a termnial vertically
" Credit: https://medium.com/gr-tech/vim-without-tmux-3ebee29fc71a
nnoremap <silent> <leader>t :vert term<CR>
```

### Working with Terminal Mode

- With the setup, you can open a terminal with `<leader> + t`
- Move among the panes with `CTRL + w + h/j/k/l`
- Go to terminal Normal mode with `CTRL + w + N` to copy the text;
- Hit `i` to go back to terminal mode
- Use Vim's Ex command in terminal pane with `CTRL + w + :`
- From there, type command `:term{:vim}` to open another terminal pane below the current pane

## References

- `:h terminal{:vim}`

- [Vim 8.1 Release Note](https://www.vim.org/vim-8.1-released.php) on vim.org/

- [Vim Without Tmux](https://medium.com/gr-tech/vim-without-tmux-3ebee29fc71a) by [Carl Albrecht-Buehler](https://medium.com/@dinobuehler)
