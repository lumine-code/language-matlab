# language-matlab

MATLAB language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-matlab](https://github.com/acristoffers/tree-sitter-matlab).
- **Syntax highlighting**: functions, classdefs, matrices and cell arrays, with `%%` sections recognised.
- **Brackets**: matrix `[ ]` and cell `{ }` are scoped apart, since they build different things.
- **Folding**: folds functions and blocks.
- **Locals**: resolves parameters and local bindings.

## Installation

To install `language-matlab` search for _language-matlab_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-matlab`.

## Services

- **hyperlink.injection** (`^1.0.0`): consumed to highlight URLs in these files as clickable links.
- **todo.injection** (`^1.0.0`): consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
