describe("MATLAB long identifiers", () => {
  let grammar;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-matlab");
    grammar = lumine.grammars.grammarForScopeName("source.matlab");
  });

  it("preserves complete identifiers across the scanner keyword-buffer boundary", async () => {
    const editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
    for (const length of [255, 256, 257, 8192]) {
      const name = "a".repeat(length);
      editor.setText(`${name} = 1;\n`);
      await editor.languageMode.ready;
      await editor.languageMode.atTransactionEnd();
      const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
      expect(root.hasError).toBe(false);
      expect(editor.getSyntaxNodeAtBufferPosition([0, 1]).text).toBe(name);
    }
  });

  it("keeps a long identifier intact after a local edit", async () => {
    const editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
    const name = "a".repeat(128000);
    editor.setText(`${name} = 1;\n`);
    await editor.languageMode.ready;
    await editor.languageMode.atTransactionEnd();
    editor.getBuffer().setTextInRange(
      [
        [0, 64000],
        [0, 64001],
      ],
      "b",
    );
    await editor.languageMode.atTransactionEnd();
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    expect(editor.getSyntaxNodeAtBufferPosition([0, 64000]).text).toBe(
      name.slice(0, 64000) + "b" + name.slice(64001),
    );
  });
});
