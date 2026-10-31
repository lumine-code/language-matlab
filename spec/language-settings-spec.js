describe("language-matlab editing defaults", () => {
  let editor;
  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-source");
    await lumine.packages.activatePackage("language-matlab");
    await lumine.packages.activatePackage("bracket-matcher");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.matlab"));
    editor.setText("values = [1, 2];");
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  it("does not insert a second apostrophe for an operator or unpaired token", async () => {
    editor.setText("[1, 2].");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    await editor.insertText("'");
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("[1, 2].'");
  });
  it("still pairs a clear opening parenthesis and honors user quote pairs", async () => {
    editor.setText("");
    await editor.whenGrammarSettled();
    await editor.insertText("(");
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("()");
    const options = { scopeSelector: ".source.matlab" };
    try {
      lumine.config.set("bracket-matcher.autocompleteCharacters", ["''"], options);
      lumine.config.set("bracket-matcher.autocompleteDisabledCharacters", [], options);
      editor.setText("");
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([0, 0]);
      await editor.insertText("'");
      await editor.whenGrammarSettled();
      expect(editor.getText()).toBe("''");
    } finally {
      lumine.config.unset("bracket-matcher.autocompleteCharacters", options);
      lumine.config.unset("bracket-matcher.autocompleteDisabledCharacters", options);
    }
  });
});
