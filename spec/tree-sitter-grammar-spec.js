const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "matlab-highlights.scm");

// Asserts the scopes the grammar actually produces, using the fixture beside
// this file. `runGrammarTests` reads `<- scope` and `^ scope` assertions out of
// the fixture's own comments, so the fixture is the readable spec.
//
// A fixture whose assertions never run still reports green, so break one
// expected scope and confirm this fails before trusting it.

describe("MATLAB Tree-sitter grammar", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-matlab");
  });

  afterEach(() => editor?.destroy());

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.m"), /%/);
  });

  it("keeps function parameters local inside a 6000-argument signature", async () => {
    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).not.toMatch(/\(function_arguments\s+\(identifier\)/);
    expect(query).toContain("(#is? test.childOfType function_arguments)");

    const lines = ["function output = generated( ..."];
    for (let index = 0; index < 6000; index++) {
      lines.push(`  value_${index}${index === 5999 ? "" : ","} ...`);
    }
    lines.push(")", "output = 1;", "end");
    editor = await lumine.workspace.open("parameter-locality.m");
    editor.setText(lines.join("\r\n"));
    const languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.scopeDescriptorForBufferPosition([1, 2]).getScopesArray()).toContain(
      "variable.parameter.matlab",
    );

    const startRow = 2998;
    const endRow = startRow + 6;
    const layer = languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
    expect(captures.length).toBeLessThanOrEqual(48);
    expect(
      captures
        .filter(({ name }) => name === "variable.parameter.matlab")
        .every(({ node }) => node.startPosition.row >= startRow && node.startPosition.row < endRow),
    ).toBe(true);
  });
});
