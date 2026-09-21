exports.activate = function () {};

exports.consumeHyperlinkInjection = (hyperlink) => {
  return hyperlink.addInjectionPoint("source.matlab", {
    types: ["comment"],
  });
};

exports.consumeTodoInjection = (todo) => {
  return todo.addInjectionPoint("source.matlab", {
    types: ["comment"],
  });
};
