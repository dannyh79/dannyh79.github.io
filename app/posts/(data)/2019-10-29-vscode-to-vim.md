---
title: 'From VS Code to Vim'
summary: 'How I transioned to Vim from VS Code.'
createdAt: 2019-10-29 00:00:00 +0800
publishedAt: 2019-10-29
categories: [vim]
---

<Image
  src="/assets/images/vscode-to-vim/1.png"
  alt="illustration of terminal on 2019/12/28"
  width={1600}
  height={900}
  isFirst
/>

<Figcaption>
    Setup as of 2019/12/28; W.I.P. dots can be found [HERE](https://gist.github.com/dannyh79/157ad3160ff92b5791019efd2e7afec9)
</Figcaption>

<Image
  src="/assets/images/vscode-to-vim/2.png"
  alt="illustration of terminal on 2019/10/28"
  width={1600}
  height={900}
  isFirst
/>

<Figcaption>
    Initial Setup on 2019/10/28 (Vim, Tmux)
</Figcaption>

My journey to Vim is rather a slowly one: about a week's worth of coding on side project to get the hang of it, enable Vim mode in VS Code for about a month to get use to the flow (with arrow keys from time to time...), and, onward to tinkering with config of terminal and Vim to get it a more IDE-like feel.

The current setup, on 2019/10/28, after tinkering with config file with a myriad of boilerplates for 2 days, is in the following:

For Terminal:

- Iterm2 - through Homebrew
- ZSH - through Homebrew
- [ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)
- ryanoasis/nerd-fonts - [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/Hack)
- [romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k) - It has a really friendly [config wizard](https://github.com/romkatv/powerlevel10k#configuration-wizard)!
- Tmux - through Homebrew

For Vim (See below for update):

- [tpope/vim-pathogen](https://github.com/tpope/vim-pathogen) (package manager)
- [preservim/nerdtree](https://github.com/preservim/nerdtree) (file tree explorer)
- [morhetz/gruvbox](https://github.com/morhetz/gruvbox) (theme)

## Update-20191124

- Vim:
  - [junegunn/vim-plug](https://github.com/junegunn/vim-plug) - package manager changed
  - [junegunn/fzf](https://github.com/junegunn/fzf) & [junegunn/fzf.vim](https://github.com/junegunn/fzf.vim/) - file fuzzy search
  - [vim-airline/vim-airline](https://github.com/vim-airline/vim-airline) - status line for Vim
    > Themes from [vim-airline/vim-airline-themes](https://github.com/vim-airline/vim-airline-themes)

## Update-20191207

- Vim:
  - [airblade/vim-gitgutter](https://github.com/airblade/vim-gitgutter) - gitgutter in Vim
  - [ryanoasis/vim-deviconsa](https://github.com/ryanoasis/vim-devicons) - file icons in NerdTree
  - Change indentation from 1 tab to 2 spaces

## Update-20191214

- Vim:

  - airblade/vim-gitgutter - tuned and custom-mapped key for hunk preview mode
  - [preservim/nerdcommenter](https://github.com/preservim/nerdcommenter) - making commenting a lot easier
  - Ignore \*~/\*.swp/\*.swo files that vim generates globally (settings put under ~/home/.gitignore)

- Tmux:
  - Enable mouse mode for scrolling/pane-resizing/etc inside Tmux

## Update-20191215

- Vim:

  - [tpope/vim-fugitive](https://github.com/tpope/vim-fugitive) - version control in Vim
  - vim-airline/vim-airline - enabling smart tabline
    > `let g:airline#extensions#tabline#enabled = 1{:vim}`
  - [jiangmiao/auto-pairs](https://github.com/jiangmiao/auto-pairs) - auto-pairing in Vim
  - Enables MacOS clipboard sharing in .vimrc
    > `set clipboard=unnamed{:vim}`

- Tmux:
  - [tmux-plugins/tpm](https://github.com/tmux-plugins/tpm) - Tmux plugin manager
  - [tmux-plugins/tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) - persisting Tmux sessions
  - [tmux-plugins/tmux-battery](https://github.com/tmux-plugins/tmux-battery) - showing battery life on Tmux

## Update-20191221

- Vim:
  - [yggdroot/indentline](https://github.com/yggdroot/indentline) - marking indentline
  - [tpope/vim-surround](https://github.com/tpope/vim-surround) - making/changing surrounding tags fast
  - [drewtempelmeyer/palenight.vim](https://github.com/drewtempelmeyer/palenight.vim) - theme

## Update-20191227

- Vim:
  - [tadaa/vimade](https://github.com/tadaa/vimade) - dimming unfocused splits
