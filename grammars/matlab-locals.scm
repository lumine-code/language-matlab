; References

(identifier) @reference

; Definitions

(function_definition
  name: (identifier) @definition.function) @scope

; The arguments field is repeated in the parser, so a field-constrained query
; would select only its first value. Match each argument leaf independently.
((identifier) @definition.parameter
  (#is? test.childOfType function_arguments))

(assignment left: (identifier) @definition.var)
(multioutput_variable (identifier) @definition.var)

(iterator . (identifier) @definition.var)
(lambda (arguments (identifier) @definition.parameter))
(global_operator (identifier) @definition.var)
(persistent_operator (identifier) @definition.var)
(catch_clause (identifier) @definition)
