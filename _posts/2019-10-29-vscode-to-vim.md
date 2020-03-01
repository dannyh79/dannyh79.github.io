---
layout:     post
title:      "From VS Code to Vim"
date:       2019-10-29 00:00:00 +0800
categories: vim
comments:   true

---
![illustration of terminal on 2019/12/28](/assets/images/vscode-to-vim/1.png)
Setup as of 2019/12/28; W.I.P. dots can be found [HERE](https://gist.github.com/dannyh79/157ad3160ff92b5791019efd2e7afec9){:rel="nofollow noopener noreferrer" target="_blank"}
{: style="color:gray; font-size: 80%; text-align: center;"}

![illustration of terminal on 2019/10/28](/assets/images/vscode-to-vim/2.png)
Initial Setup on 2019/10/28 (Vim, Tmux)
{: style="color:gray; font-size: 80%; text-align: center;"}

My journey to Vim is rather a slowly one: about a week's worth of coding on side project to get the hang of it, enable Vim mode in VS Code for about a month to get use to the flow (with arrow keys from time to time...), and, onward to tinkering with config of terminal and Vim to get it a more IDE-like feel.

The current setup, on 2019/10/28, after tinkering with config file with a myriad of boilerplates for 2 days, is in the following:

For Terminal:
- Iterm2 - through Homebrew
- ZSH - through Homebrew
- [ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh){:rel="nofollow noopener noreferrer" target="_blank"}
- ryanoasis/nerd-fonts - [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/Hack){:rel="nofollow noopener noreferrer" target="_blank"}
- [romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k){:rel="nofollow noopener noreferrer" target="_blank"} - It has a really friendly [config wizard](https://github.com/romkatv/powerlevel10k#configuration-wizard){:rel="nofollow noopener noreferrer" target="_blank"}!
- Tmux - through Homebrew

For Vim (See below for update):
- [tpope/vim-pathogen](https://github.com/tpope/vim-pathogen){:rel="nofollow noopener noreferrer" target="_blank"} (package manager)
- [preservim/nerdtree](https://github.com/preservim/nerdtree){:rel="nofollow noopener noreferrer" target="_blank"} (file tree explorer)
- [morhetz/gruvbox](https://github.com/morhetz/gruvbox){:rel="nofollow noopener noreferrer" target="_blank"} (theme)

## Update-20191124
- Vim:
  - [junegunn/vim-plug](https://github.com/junegunn/vim-plug){:rel="nofollow noopener noreferrer" target="_blank"} - package manager changed
  - [junegunn/fzf](https://github.com/junegunn/fzf){:rel="nofollow noopener noreferrer" target="_blank"} & [junegunn/fzf.vim](https://github.com/junegunn/fzf.vim/){:rel="nofollow noopener noreferrer" target="_blank"} - file fuzzy search
  - [vim-airline/vim-airline](https://github.com/vim-airline/vim-airline){:rel="nofollow noopener noreferrer" target="_blank"} - status line for Vim
    > Themes from [vim-airline/vim-airline-themes](https://github.com/vim-airline/vim-airline-themes){:rel="nofollow noopener noreferrer" target="_blank"}

## Update-20191207
- Vim:
  - [airblade/vim-gitgutter](https://github.com/airblade/vim-gitgutter){:rel="nofollow noopener noreferrer" target="_blank"} - gitgutter in Vim
  - [ryanoasis/vim-deviconsa](https://github.com/ryanoasis/vim-devicons){:rel="nofollow noopener noreferrer" target="_blank"} - file icons in NerdTree
  - Change indentation from 1 tab to 2 spaces

## Update-20191214
- Vim:
  - airblade/vim-gitgutter - tuned and custom-mapped key for hunk preview mode
  - [preservim/nerdcommenter](https://github.com/preservim/nerdcommenter){:rel="nofollow noopener noreferrer" target="_blank"} - making commenting a lot easier
  - Ignore \*~/\*.swp/\*.swo files that vim generates globally (settings put under ~/home/.gitignore)

- Tmux:
  - Enable mouse mode for scrolling/pane-resizing/etc inside Tmux

## Update-20191215
- Vim:
  - [tpope/vim-fugitive](https://github.com/tpope/vim-fugitive){:rel="nofollow noopener noreferrer" target="_blank"} - version control in Vim
  - vim-airline/vim-airline - enabling smart tabline
    > `let g:airline#extensions#tabline#enabled = 1`
  - [jiangmiao/auto-pairs](https://github.com/jiangmiao/auto-pairs){:rel="nofollow noopener noreferrer" target="_blank"} - auto-pairing in Vim
  - Enables MacOS clipboard sharing in .vimrc
    > `set clipboard=unnamed`

- Tmux:
  - [tmux-plugins/tpm](https://github.com/tmux-plugins/tpm){:rel="nofollow noopener noreferrer" target="_blank"} - Tmux plugin manager
  - [tmux-plugins/tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect){:rel="nofollow noopener noreferrer" target="_blank"} - persisting Tmux sessions
  - [tmux-plugins/tmux-battery](https://github.com/tmux-plugins/tmux-battery){:rel="nofollow noopener noreferrer" target="_blank"} - showing battery life on Tmux

## Update-20191221
- Vim:
  - [yggdroot/indentline](https://github.com/yggdroot/indentline){:rel="nofollow noopener noreferrer" target="_blank"} - marking indentline
  - [tpope/vim-surround](https://github.com/tpope/vim-surround){:rel="nofollow noopener noreferrer" target="_blank"} - making/changing surrounding tags fast
  - [drewtempelmeyer/palenight.vim](https://github.com/drewtempelmeyer/palenight.vim) - theme

## Update-20191227
- Vim:
  - [tadaa/vimade](https://github.com/tadaa/vimade){:rel="nofollow noopener noreferrer" target="_blank"} - dimming unfocused splits
