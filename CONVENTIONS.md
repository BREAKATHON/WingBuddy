# Code conventions

These are the conventions which we agreed upon. If you want to make any changes to the conventions, 
please make changes to this file and open a Pull Request to start a discussion.

## Variable names

`camelCase`

## Indentation style

[1TBS](https://en.m.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_(OTBS))

## Git commit messages

All messages start with a capital letter and an imperative verb. 

### Examples

* Add header comments
* Remove orphaned code
* Fix issue where image was displayed incorrectly

## Git branching model

We use [Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html).


`main` branch: this branch has stable code, and any changes will be deployed to a server automatically
`develop` branch: Ongoing development, cutting edge
`feature/` branches: If you work on a specific part, you can do so in a feature branch
`bugfix/` branches: when fixing bugs

## Branch permissions
Merging to main is not allowed. Master can only be updated using a Pull Request merge.

## Pipeline
Merging to master will deploy the server automatically

## Recommended IDE
VSCode 