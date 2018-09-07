var markdownToLatexMappings =
{
    "^#\\s+(.*)$": { replacement: "\\chapter{\$1}", groups: [ 1 ] },
    "^#{2}\\s+(.*)$": { replacement: "\\section{\$1}", groups: [ 1 ] },
    "^#{3}\\s+(.*)$": { replacement: "\\subsection{\$1}", groups: [ 1 ] },
    "^#{4}\\s+(.*)$": { replacement: "\\subsubsection{\$1}", groups: [ 1 ] },
    "^#{5}\\s+(.*)$": { replacement: "\\paragraph{\$1}\\hfill\\break", groups: [ 1 ] },
    "^(\\s*)\-\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "itemize" },
    "^(\\s*)\\d+\\.\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "enumerate" },
    "<img alt=\"(.*)\" src=\"(.*)\"></img>": { replacement: "\\begin{figure}[h]\\includegraphics[width=\\textwidth]{\$2}\\caption{\$1}\\end{figure}", groups: [ 1, 2 ] },
    "<img alt=\"(.*)\" src=\"(.*)\"/>": { replacement: "\\begin{figure}[h]\\includegraphics[width=\\textwidth]{\$2}\\caption{\$1}\\end{figure}", groups: [ 1, 2 ] },
    "(_)": { replacement: "\\_" }
};

var latexToMarkdownMappings =
{
    "\\\\chapter\\{(.*)\\}": { replacement: "# \$1", groups: [ 1 ] },
    "\\\\section\\{(.*)\\}": { replacement: "## \$1", groups: [ 1 ] },
    "\\\\subsection\\{(.*)\\}": { replacement: "### \$1", groups: [ 1 ] },
    "\\\\subsubsection\\{(.*)\\}": { replacement: "#### \$1", groups: [ 1 ] },
    "\\\\paragraph\\{(.*)\\}\\\\hfill\\\\break": { replacement: "##### \$1", groups: [ 1 ] },
    "\\\\item\\{(.*)\\}": { replacements: { itemize: "- \$1", enumerate: "1. \$1" }, groups: [ 1 ] },
    "\\\\begin\\{itemize\\}": { state: "itemize" },
    "\\\\end\\{itemize\\}": { state: "" },
    "\\\\begin\\{enumerate\\}": { state: "enumerate" },
    "\\\\end\\{enumerate\\}": { state: "" },
    "\\\\begin\\{figure\\}\\[h\\]\\\\includegraphics\\[width=\\\\textwidth\\]\\{(.*)\\}\\\\caption\\{(.*)\\}\\\\end\\{figure\\}": {
        replacement: "<img alt=\"\$2\" src=\"\$1\"/>", groups: [ 1, 2 ]
    }
};

module.exports.markdownToLatexMappings = markdownToLatexMappings;
module.exports.latexToMarkdownMappings = latexToMarkdownMappings;