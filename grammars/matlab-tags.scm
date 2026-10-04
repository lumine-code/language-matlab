(class_definition name: (identifier) @name) @definition.class
(function_definition "get." name: [(identifier) (property_name)] @name
  (#set! symbol.prepend "get.")) @definition.function
(function_definition "set." name: [(identifier) (property_name)] @name
  (#set! symbol.prepend "set.")) @definition.function
(function_definition name: [(identifier) (property_name)] @name
  (#is-not? test.typeAt "previousSibling get. set.")) @definition.function
(properties (property name: [(identifier) (property_name)] @name) @definition.property)
(enumeration (enum . (identifier) @name) @definition.constant)
(events (identifier) @name @definition.event)
