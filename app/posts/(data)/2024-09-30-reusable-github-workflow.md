---
title: 'Create a Reusable GitHub Workflow'
summary: 'GitHub workflow template that can be called from other workflows.'
createdAt: 2024-09-30 17:03:32 +0800
publishedAt: 2024-09-30
categories: [github, devops, ci]
---

## TLDR

- .github/workflows/reusable.yml

  ```yaml
  name: Some reusable workflow

  on:
    workflow_call: # Set trigger to `workflow_call`
      inputs:
        some_input:
          required: true
          type: string

      secrets: # No "type" attribute available for secrets as of 2024-09-30
        some_secret:
          required: true

  jobs:
    some_job:
      - name: Some job
        uses: some/action@v1
        with:
          input: ${{ inputs.some_input }}
          secret: ${{ secrets.some_secret }}
  ```

- .github/workflows/ci.yml

  ```yaml
  name: Example CI workflow

  on: push

  env:
    NODE_VERSION: 20.x

  jobs:
    typecheck:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Use Node.js ${{ env.NODE_VERSION }}
          uses: actions/setup-node@v4
          with:
            node-version: ${{ env.NODE_VERSION }}
            cache: 'yarn'
        - name: Setup
          run: yarn install --frozen-lockfile
        - name: TypeScript Check
          run: yarn tsc

    some_job:
      # Bonus: Prevent the job from running when pushing to the 'main' branch
      if: github.event_name != 'push' || github.ref != 'refs/heads/main'

      # Grant the permission the workflow needs; see
      # https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions
      permissions:
        contents: read
        deployments: write
        pull-requests: write

      # Requires job "typecheck" to succeed to execute the job; see
      # https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds
      needs: [typecheck]

      with:
        some_input: ${{ vars.some_input }}

      # Or just "secrets: inherit" if you'd like to pass all secrets over
      secrets:
        some_secret: ${{ secrets.some_secret }}

      # Set the path to the desired workflow
      uses: ./.github/workflows/reusable.yml
  ```

## Some Context

Lately, I had an honor to take on a project that will serve many people in need. Of which, the CI/CD pipelines need a job to build artifacts as PR's preview build after CI, or in CD to generate production builds.

Requirements for the build job in CI or CD are almost identical, thus the idea of extracting the build job as a reusable workflow to be used in pipelines.

## Gotchas - `Unrecognized named-value: 'secrets'`

In job's `with` section, GitHub Actions does NOT recognize secrets, i.g., attributes keyed by `secrets`. We will need to turn to `secrets` section to pass the secrets over from one workflow to another.

## Pour Closure

Seems that GitHub Actions iterates pretty quickly that many StackOverflow answers are already render stale. For workflow syntax, ChatGPT can only help to a certain extent. I still had to go back to docs to make sure that things work as I intended them to.

## Refs

- [Workflow syntax for GitHub Actions#`jobs.<job_id>.permissions`](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions)
- [Workflow syntax for GitHub Actions#`jobs.<job_id>.needs`](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds)
