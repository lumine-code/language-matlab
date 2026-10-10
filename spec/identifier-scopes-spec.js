describe("MATLAB native identifier scopes", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    for (const method of ["openExternal", "openPath", "showItemInFolder", "openApplication"])
      spyOn(lumine.shell, method).and.resolveTo();
    spyOn(lumine.application, "openWindow").and.resolveTo();
    const pack = await lumine.packages.activatePackage("language-matlab");
    const grammar = pack.grammars.find((entry) => entry.scopeName === "source.matlab");
    editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
  });

  afterEach(() => editor?.destroy());

  async function scopesFor(source, position) {
    editor.setText(source);
    expect(await editor.whenGrammarSettled()).toBeTrue();
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBeFalse();
    return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
  }

  it("keeps assigned variable names out of the type scope", async () => {
    const scopes = await scopesFor("value = 1;\n", [0, 1]);
    expect(scopes).toContain("variable.other.matlab");
    expect(scopes).not.toContain("support.type.matlab");
  });

  it("keeps function arguments in the parameter scope", async () => {
    const scopes = await scopesFor(
      "function output = calculate(input)\noutput = input;\nend\n",
      [0, 30],
    );
    expect(scopes).toContain("variable.parameter.matlab");
    expect(scopes).not.toContain("support.type.matlab");
  });

  it("retains the class declaration type scope", async () => {
    const scopes = await scopesFor("classdef Widget\nend\n", [0, 10]);
    expect(scopes).toContain("support.type.matlab");
  });
});
