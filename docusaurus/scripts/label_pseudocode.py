"""
Label bare ``` fences inside <TabItem value="pseudo"> blocks as ```pseudocode.
Only touches real curriculum files, skips tutorial boilerplate.
"""
import os
import re

SKIP_DIRS = {"tutorial-basics", "tutorial-extras"}
ROOT = os.path.join(os.path.dirname(__file__), "..", "docs")

files_changed = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fname in filenames:
        if not fname.endswith((".md", ".mdx")):
            continue
        path = os.path.join(dirpath, fname)
        with open(path, encoding="utf-8") as f:
            content = f.read()

        lines = content.split("\n")
        new_lines = []
        in_pseudo_tab = False
        in_code_fence = False
        changed = False

        for line in lines:
            stripped = line.strip()

            # Track entry / exit of pseudo TabItem
            if re.search(r'<TabItem\s+value=["\']pseudo["\']', line):
                in_pseudo_tab = True
            elif in_pseudo_tab and stripped == "</TabItem>":
                in_pseudo_tab = False

            # Inside pseudo tab, convert bare ``` opener
            if in_pseudo_tab and not in_code_fence:
                if stripped == "```":
                    # Replace only the ``` portion, preserve any leading whitespace
                    line = line.replace("```", "```pseudocode", 1)
                    in_code_fence = True
                    changed = True
                elif re.match(r"^```\w", stripped):
                    in_code_fence = True  # labelled block, don't touch
            elif in_code_fence and stripped == "```":
                in_code_fence = False

            new_lines.append(line)

        if changed:
            with open(path, "w", encoding="utf-8") as f:
                f.write("\n".join(new_lines))
            files_changed.append(path)

print(f"Updated {len(files_changed)} files:")
for p in files_changed:
    print(" ", p)
