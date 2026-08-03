% Assertions live in the comments: `<- scope` checks the marker's own column
% on the previous non-comment line, `^ scope` checks the caret's. Scopes
% match by prefix, so the trailing `.matlab` segment is left off.

function out = scale(v, n)
% <- storage.type.function
%              ^ entity.name.function
%                   ^ punctuation.definition.arguments.begin.bracket.round

  out = v * n;
%            ^ punctuation.terminator.statement

  m = [1, 2];
%     ^ punctuation.definition.matrix.begin.bracket.square
%      ^ constant.numeric

end
% <- keyword

% a comment
% <- comment
