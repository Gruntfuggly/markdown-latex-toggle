var markdownToLatexMappings =
{
    "^```(.*)$": { replacement: "\\begin{verbatim}", verbatim: true },
    "^```$": { replacement: "\\end{verbatim}", verbatim: false },
    "^#\\s+(.*)$": { replacement: "\\chapter{\$1}", groups: [ 1 ] },
    "^#{2}\\s+(.*)$": { replacement: "\\section{\$1}", groups: [ 1 ] },
    "^#{3}\\s+(.*)$": { replacement: "\\subsection{\$1}", groups: [ 1 ] },
    "^#{4}\\s+(.*)$": { replacement: "\\subsubsection{\$1}", groups: [ 1 ] },
    "^#{5}\\s+(.*)$": { replacement: "\\paragraph{\$1}\\hfill\\break", groups: [ 1 ] },
    "^(\\s*)\-\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "itemize" },
    "^(\\s*)\\d+\\.\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "enumerate" },
    "^<img (alt|title)=\"(.*)\" src=\"(.*)\"></img>$": { replacement: "\\begin{figure}[h]\\includegraphics[width=\\textwidth]{\$3}\\caption{\$2}\\end{figure}", groups: [ 2, 3 ] },
    "^<img (alt|title)=\"(.*)\" src=\"(.*)\"/>$": { replacement: "\\begin{figure}[h]\\includegraphics[width=\\textwidth]{\$3}\\caption{\$2}\\end{figure}", groups: [ 2, 3 ] },
    "(_)": { replacement: "\\_", simple: true },
    "^\\|([:-]*\\|){1,}$": { ignore: true, state: "tabularx" },
    "^\\|(.*\\|){1,}$": { state: "tabularx" },
    "\\*\\*(.*?)\\*\\*": { replacement: "\\textbf{\$1}", groups: [ 1 ], simple: true },
    "\\*(.*?)\\*": { replacement: "\\textit{\$1}", groups: [ 1 ], simple: true },
    "\\`(.*?)\\`": { replacement: "\\texttt{\$1}", groups: [ 1 ], simple: true },
    "^---$": { replacement: "\\rule{\\textwidth}{1pt}" },
    "^===$": { replacement: "\\rule{\\textwidth}{2pt}" }
};

var latexToMarkdownMappings =
{
    "\\\\begin\\{verbatim\\}": { replacement: "```", verbatim: true },
    "\\\\end\\{verbatim\\}": { replacement: "```", verbatim: false },
    "\\\\chapter\\{(.*)\\}": { replacement: "# \$1", groups: [ 1 ] },
    "\\\\section\\{(.*)\\}": { replacement: "## \$1", groups: [ 1 ] },
    "\\\\subsection\\{(.*)\\}": { replacement: "### \$1", groups: [ 1 ] },
    "\\\\subsubsection\\{(.*)\\}": { replacement: "#### \$1", groups: [ 1 ] },
    "\\\\paragraph\\{(.*)\\}\\\\hfill\\\\break": { replacement: "##### \$1", groups: [ 1 ] },
    "\\\\item\\{(.*)\\}": { replacements: { itemize: "- \$1", enumerate: "1. \$1" }, groups: [ 1 ] },
    "\\\\begin\\{itemize\\}": { ignore: true, state: "itemize" },
    "\\\\end\\{itemize\\}": { ignore: true, state: "" },
    "\\\\begin\\{enumerate\\}": { ignore: true, state: "enumerate" },
    "\\\\end\\{enumerate\\}": { ignore: true, state: "" },
    "\\\\begin\\{figure\\}\\[h\\]\\\\includegraphics\\[width=\\\\textwidth\\]\\{(.*)\\}\\\\caption\\{(.*)\\}\\\\end\\{figure\\}": {
        replacement: "<img alt=\"\$2\" src=\"\$1\"/>", groups: [ 1, 2 ]
    },
    "\\\\begin\\{tabularx\\}\\{\\\\textwidth\\}\\{[\|Xlrx]*}\\\\hline": { ignore: true },
    "(.*?&){1,}(.*)(\\\\\\\\ \\\\hline)$": { state: "table" },
    "\\\\end\\{tabularx\\}": { ignore: true, state: "" },
    "\\\\textit\\{(.*?)\\}": { replacement: "*\$1*", groups: [ 1 ] },
    "\\\\textbf\\{(.*?)\\}": { replacement: "**\$1**", groups: [ 1 ] },
    "\\\\texttt\\{(.*?)\\}": { replacement: "`\$1`", groups: [ 1 ] },
    "\\\\rule\\{\\\\textwidth\\}\\{1pt\\}": { replacement: "---" },
    "\\\\rule\\{\\\\textwidth\\}\\{2pt\\}": { replacement: "===" }
};

module.exports.markdownToLatexMappings = markdownToLatexMappings;
module.exports.latexToMarkdownMappings = latexToMarkdownMappings;