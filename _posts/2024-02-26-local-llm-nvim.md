---
layout:     post
title:      "Set up a Local LLM for Neovim on Mac"
date:       2024-02-26 16:09:11 +0800
categories: ["vim", "editor", "llm"]
comments:   true

---

## TLDR

1. Download and install ollama

    ```shell
    # For Mac, via homebrew
    $ brew install ollama
    ```

2. Pull the model of your choice

    ```shell
    # On one terminal, spin up ollama
    $ ollama serve

    # On another terminal, pull the suitable model for your machine
    $ ollama pull mistral
    ```

3. Configure neovim

    - Add plugin [`nomnivore/ollama.nvim`](https://github.com/nomnivore/ollama.nvim){:rel="nofollow noopener noreferrer" target="_blank"} and make ollama serve on start
    - (Optional) Add in progress status blinker to Lualine

## Steps

### 1. Download and Install Ollama

```shell
$ brew install ollama
```

_Check out [ollama.com](https://ollama.com/download){:rel="nofollow noopener noreferrer" target="_blank"} for other ways to install and run ollama on other OSs._

### 2. Pull the Model of Your Choice

Spin up Ollama on one terminal and use another to pull the model(s). Available models can be found on [Hugging Face](https://huggingface.co/models){:rel="nofollow noopener noreferrer" target="_blank"}. There is [a guide](https://github.com/ex3ndr/llama-coder/tree/996ac715cb722ab7253b217576c66a6311fbd32e?tab=readme-ov-file#models){:rel="nofollow noopener noreferrer" target="_blank"} that helps you pick one, though.

```shell
# On one terminal
$ ollama serve

# On another terminal
$ ollama pull mistral
```

### 3. Configure Neovim

#### Add Neovim plugin nomnivore/ollama.nvim

Add the "adapter", [`nomnivore/ollama.nvim`](https://github.com/nomnivore/ollama.nvim){:rel="nofollow noopener noreferrer" target="_blank"}, to Neovim (See [here](https://github.com/nomnivore/ollama.nvim#installation){:rel="nofollow noopener noreferrer" target="_blank"}).

Next, have the Neovim plugin help serve ollama for us, instead of having to do it manually:

```lua
{
  "nomnivore/ollama.nvim",
  -- ...omitted

  opts = {
    serve = {
      -- set to true here
      on_start = true,

      -- and change the below if you want to serve Ollama in another way
      command = "ollama",
      args = { "serve" },
      stop_command = "pkill",
      stop_args = { "-SIGTERM", "ollama" },
    },
  },
}
```

#### (Optional) Add in Progress Status Blinker to Lualine

This is optional, but if you use lualine and you want a blinking status icon for Ollama in Neovim:
```lua
-- Refer to https://github.com/nomnivore/ollama.nvim#status for details
{
  function()
    local ollama_status = require("ollama").status()

    -- change the icons to ones you see fit
    local icons = {
      "󱙺", -- nf-md-robot-outline
      "󰚩" -- nf-md-robot
    }

    if ollama_status == "IDLE" then
      return icons[1]
    elseif ollama_status == "WORKING" then
      return icons[os.date("%S") % #icons + 1] -- animation
    end
  end,
  cond = function()
    return package.loaded["ollama"] and require("ollama").status() ~= nil
  end,
},
```

## Refs

- [Local LLMs in Neovim: gen.nvim (YouTube)](https://www.youtube.com/watch?v=FIZt7MinpMY){:rel="nofollow noopener noreferrer" target="_blank"}
