/**
 * prism-pseudocode — Prism.js grammar for the Open Learner's Guide pseudocode dialect.
 *
 * Registered on the same Prism instance exported by prism-react-renderer so that
 * the CodeBlock component finds it via `prism.languages[language]` (line 3124 of
 * the renderer's dist). Loaded as a clientModule so webpack bundles it together.
 *
 * Keywords from docs/meta/pseudocode_standard.md
 */

import { Prism } from 'prism-react-renderer';

Prism.languages.pseudocode = {
  // Single-line comment: // ...
  "comment": {
    pattern: /\/\/[^\n]*/,
    greedy: true,
  },

  // Multi-line comment: /* ... */
  "block-comment": {
    pattern: /\/\*[\s\S]*?\*\//,
    alias: "comment",
    greedy: true,
  },

  // String literals
  "string": {
    pattern: /"[^"]*"|'[^']*'/,
    greedy: true,
  },

  // Numbers
  "number": /\b\d+(?:\.\d+)?\b/,

  // Assignment / return arrows  ← →  ->
  "arrow": {
    pattern: /←|→|->|<-/,
    alias: "operator",
  },

  // Declaration keywords: FUNCTION, CLASS, RETURN, NEW, IMPORT, END …
  // These get the "keyword" token (styled purple in oneDark)
  "keyword": {
    pattern:
      /\b(?:FUNCTION|END\s+FUNCTION|CLASS|END\s+CLASS|RETURN|NEW|IMPORT|CONSTRUCTOR|END|SELF|self)\b/,
  },

  // Control-flow keywords: IF, ELSE, WHILE, FOR, FOREACH …
  // alias "builtin" → styled in a contrasting colour (cyan/teal in oneDark)
  "control": {
    pattern:
      /\b(?:IF|ELSE(?:\s+IF)?|THEN|END\s+IF|WHILE|DO|END\s+WHILE|FOR|FROM|TO|STEP|END\s+FOR|FOREACH|IN|END\s+FOREACH|BREAK|CONTINUE|TRY|CATCH|FINALLY|END\s+TRY|AS|THROW|PRINT)\b/,
    alias: "builtin",
  },

  // Literal constants: NULL, TRUE, FALSE, AND, OR, NOT
  // alias "boolean" → styled orange/coral in oneDark
  "constant": {
    pattern: /\b(?:NULL|TRUE|FALSE|AND|OR|NOT|VOID)\b/,
    alias: "boolean",
  },

  // Built-in operations defined in the pseudocode standard
  // alias "function" → styled yellow in oneDark
  "builtin-op": {
    pattern:
      /\b(?:length|append|prepend|remove|contains|sort|keys|values|push|pop|peek|enqueue|dequeue|front|back|hash)\b/,
    alias: "function",
  },

  // Type names: Int, Float, String, Bool, List<T>, Map<K,V>, Optional<T> …
  // alias "class-name" → styled green in oneDark
  "type-name": {
    pattern: /\b(?:Int|Float|String|Bool|List|Map|Set|Optional|Any|Deque|Pair|Node|Void)\b/,
    alias: "class-name",
  },

  // Comparison and arithmetic operators
  "operator": /==|!=|<=|>=|[+\-*\/%<>]/,

  // Punctuation
  "punctuation": /[{}[\](),:.]/,
};

// Register alias
Prism.languages.pseudo = Prism.languages.pseudocode;

