; Includes

((command_name) @keyword.control.import.matlab
  (#eq? @keyword.control.import.matlab "import"))

; Keywords

[
  "arguments"
  "classdef"
  "end"
  "enumeration"
  "events"
  "global"
  "methods"
  "persistent"
  "properties"
] @keyword.control.matlab

; Conditionals

(if_statement [ "if" "end" ] @keyword.control.conditional.matlab)
(elseif_clause "elseif" @keyword.control.conditional.matlab)
(else_clause "else" @keyword.control.conditional.matlab)
(switch_statement [ "switch" "end" ] @keyword.control.conditional.matlab)
(case_clause "case" @keyword.control.conditional.matlab)
(otherwise_clause "otherwise" @keyword.control.conditional.matlab)
(break_statement) @keyword.control.conditional.matlab

; Repeats

(for_statement [ "for" "parfor" "end" ] @keyword.control.loop.matlab)
(while_statement [ "while" "end" ] @keyword.control.loop.matlab)
(continue_statement) @keyword.control.loop.matlab

; Exceptions

(try_statement [ "try" "end" ] @keyword.control.exception.matlab)
(catch_clause "catch" @keyword.control.exception.matlab)

; Variables

(identifier) @variable.other.matlab

; Constants

(events (identifier) @constant.other.matlab)
(attribute (identifier) @constant.other.matlab)

"~" @constant.language.matlab

; Fields/Properties

(field_expression field: (identifier) @variable.other.member.matlab)

(superclass "." (identifier) @variable.other.member.matlab)

(property_name "." (identifier) @variable.other.member.matlab)

(property name: (identifier) @variable.other.member.matlab)

; Types

(class_definition name: (identifier) @support.type.matlab)

(attributes (identifier) @constant.other.matlab)

(enum . (identifier) @support.type.matlab)

((identifier) @support.type.matlab
  )

; Functions

(function_definition
  "function" @storage.type.function.matlab
  name: (identifier) @entity.name.function.matlab
  [ "end" "endfunction" ]? @storage.type.function.matlab)

(function_signature name: (identifier) @entity.name.function.matlab)

(function_call
  name: (identifier) @support.other.function.matlab)

(handle_operator (identifier) @entity.name.function.matlab)

(validation_functions (identifier) @entity.name.function.matlab)

(command (command_name) @support.other.function.matlab)
(command_argument) @variable.parameter.matlab

(return_statement) @keyword.control.return.matlab

; Parameters

(function_arguments (identifier) @variable.parameter.matlab)

; Punctuation

";" @punctuation.terminator.statement.matlab
"," @punctuation.separator.comma.matlab
"." @punctuation.separator.property.matlab

"(" @punctuation.definition.arguments.begin.bracket.round.matlab
")" @punctuation.definition.arguments.end.bracket.round.matlab
"[" @punctuation.definition.matrix.begin.bracket.square.matlab
"]" @punctuation.definition.matrix.end.bracket.square.matlab
"{" @punctuation.definition.cell.begin.bracket.curly.matlab
"}" @punctuation.definition.cell.end.bracket.curly.matlab

; Operators

[
  "+"
  ".+"
  "-"
  ".*"
  "*"
  ".*"
  "/"
  "./"
  "\\"
  ".\\"
  "^"
  ".^"
  "'"
  ".'"
  "|"
  "&"
  "?"
  "@"
  "<"
  "<="
  ">"
  ">="
  "=="
  "~="
  "="
  "&&"
  "||"
  ":"
] @keyword.operator.matlab

; Literals

(string) @string.quoted.double.matlab

(escape_sequence) @constant.character.escape.matlab
(formatting_sequence) @string.other.matlab

(number) @constant.numeric.matlab

((identifier) @constant.language.boolean.matlab
  (#eq? @constant.language.boolean.matlab "true"))
((identifier) @constant.language.boolean.matlab
  (#eq? @constant.language.boolean.matlab "false"))

; Comments

[ (comment) (line_continuation) ] @comment.line.matlab @_IGNORE_.spell

; Errors

(ERROR) @invalid.illegal.matlab
