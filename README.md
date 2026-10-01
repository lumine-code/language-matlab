# language-matlab

MATLAB language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-matlab](https://github.com/acristoffers/tree-sitter-matlab).
- **Syntax highlighting**: functions, classdefs, matrices and cell arrays, with `%%` sections recognised.
- **Brackets**: matrix `[ ]` and cell `{ }` are scoped apart, since they build different things.
- **Folding**: folds functions and blocks.
- **Locals**: resolves parameters and local bindings.

## Installation

To install `language-matlab` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-matlab`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
