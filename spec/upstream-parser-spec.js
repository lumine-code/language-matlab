describe("MATLAB upstream parser regressions", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-matlab");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.matlab"));
  });

  afterEach(() => editor?.destroy());

  async function parse(text) {
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    return root;
  }

  it("terminates commands and function signatures at the actual end of input", async () => {
    expect((await parse("close all")).descendantsOfType("command")[0].text).toBe("close all");
    expect((await parse("function f")).descendantsOfType("function_definition")[0].text).toBe(
      "function f",
    );
  });

  it("accepts empty property validators and enumeration constructor arguments", async () => {
    const properties = await parse("classdef A\n properties\n value double {} = 1\n end\nend\n");
    const validators = properties.descendantsOfType("validation_functions");
    expect(validators.length).toBe(1);
    expect(validators[0].namedChildren).toEqual([]);
    const enumeration = await parse("classdef E\n enumeration\n A()\n end\nend\n");
    expect(enumeration.descendantsOfType("enum").length).toBe(1);
  });

  it("keeps a spaced nonconjugate transpose inside its matrix row", async () => {
    const root = await parse("out = [a; k .'];\n");
    const transpose = root.descendantsOfType("postfix_operator")[0];
    expect(transpose.parent.type).toBe("row");
    expect(transpose.childForFieldName("operand").text).toBe("k");
  });

  it("groups comments identically with LF and CRLF line endings", async () => {
    const text = "function f\n% one\n% two\n\n% three\n    % four\nend\n";
    const comments = (root) =>
      root.descendantsOfType("comment").map((node) => node.text.replaceAll("\r\n", "\n"));
    const expected = comments(await parse(text));
    expect(expected.length).toBe(2);
    expect(comments(await parse(text.replaceAll("\n", "\r\n")))).toEqual(expected);
  });
});
