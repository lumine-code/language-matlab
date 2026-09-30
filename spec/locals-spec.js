const path = require("path");

describe("MATLAB local queries", () => {
  let grammar;
  let editor;

  beforeEach(async () => {
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    grammar = pack.grammars.find(({ scopeName }) => scopeName === "source.matlab");
  });

  afterEach(() => editor?.destroy());

  async function captures(source) {
    editor = await lumine.workspace.open();
    editor.setGrammar(grammar);
    editor.setText(source);
    await editor.whenGrammarSettled();
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    const groups = await editor.getGrammarQueryCaptureGroups("localsQuery");
    return groups.find((group) => group.grammar === grammar).captures;
  }

  it("defines every input parameter once and preserves function scopes and other definitions", async () => {
    const result = await captures(
      "function output = generated(first, second, third)\noutput = first;\nend\nfunction noArguments\nend",
    );
    expect(
      result.filter(({ name }) => name === "definition.parameter").map(({ node }) => node.text),
    ).toEqual(["first", "second", "third"]);
    expect(
      result.filter(({ name }) => name === "definition.function").map(({ node }) => node.text),
    ).toEqual(["generated", "noArguments"]);
    expect(result.filter(({ name }) => name === "scope").length).toBe(2);
    expect(
      result.filter(({ name }) => name === "definition.var").map(({ node }) => node.text),
    ).toEqual(["output"]);
  });

  it("keeps parameter captures local inside a 3000-argument function", async () => {
    const size = 3000;
    const lines = ["function output = generated( ..."];
    for (let i = 0; i < size; i++) lines.push(`  value_${i}${i === size - 1 ? "" : ","} ...`);
    lines.push(")", "output = value_0;", "end");
    const source = lines.join("\n");
    const query = await grammar.getQuery("localsQuery");
    const parser = grammar.createParser(await grammar.getLanguage());
    const tree = parser.parse(source);
    try {
      expect(tree.rootNode.hasError).toBe(false);
      const local = query.captures(tree.rootNode, {
        startPosition: { row: 1500, column: 0 },
        endPosition: { row: 1506, column: 0 },
      });
      const parameters = local.filter(({ name }) => name === "definition.parameter");
      expect(parameters.length).toBe(6);
      expect(
        parameters.every(
          ({ node }) => node.startPosition.row >= 1500 && node.startPosition.row < 1506,
        ),
      ).toBe(true);
      expect(local.length).toBeLessThanOrEqual(16);
      expect(query.didExceedMatchLimit()).toBe(false);
    } finally {
      tree.delete();
      parser.delete();
    }
    const result = await captures(source);
    const parameters = result.filter(({ name }) => name === "definition.parameter");
    expect(parameters.length).toBe(size);
    expect(parameters[0].node.text).toBe("value_0");
    expect(parameters.at(-1).node.text).toBe("value_2999");
  });
});
