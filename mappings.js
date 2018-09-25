
var mdToLatexImgAttr = "[width=\\textwidth,height=\\textheight,keepaspectratio,type=png,ext=.png,read=.png]";

var markdownToLatexMappings =
{
    "^<\\!-- latex:begin -->$": { replacement: "% latex:begin", latex: true },
    "^<\\!-- latex:end -->$": { replacement: "% latex:end", latex: false },
    "^<\\!-- together:begin -->$": { replacement: "\\vbox{%together", simple: true },
    "^<\\!-- together:end -->$": { replacement: "}%together", simple: true },
    "^<\\!-- text:(.*?) -->$": { replacement: "\\\$1", groups: [ 1 ], simple: true },
    "^```(.+)$": { replacement: "\\comment{\$1}\\begin{verbatim}", verbatim: true, groups: [ 1 ] },
    "^```$": { replacement: "\\end{verbatim}", verbatim: false },
    "^#\\s+([\\d\\.]+\\.)\\s+(.*)$": { replacement: "\\chapter{\$2}\\label{\$1}", groups: [ 1, 2 ] },
    "^#{2}\\s+([\\d\\.]+\\.)\\s+(.*)$": { replacement: "\\section{\$2}\\label{\$1}", groups: [ 1, 2 ] },
    "^#{3}\\s+([\\d\\.]+\\.)\\s+(.*)$": { replacement: "\\subsection{\$2}\\label{\$1}", groups: [ 1, 2 ] },
    "^#{4}\\s+([\\d\\.]+\\.)\\s+(.*)$": { replacement: "\\subsubsection{\$2}\\label{\$1}", groups: [ 1, 2 ] },
    "^#{5}\\s+([\\d\\.]+\\.)\\s+(.*)$": { replacement: "\\paragraph{\$2}\\label{\$1}\\hfill\\break", groups: [ 1, 2 ] },
    "^#\\s+(.*)$": { replacement: "\\chapter{\$1}", groups: [ 1 ] },
    "^#{2}\\s+(.*)$": { replacement: "\\section{\$1}", groups: [ 1 ] },
    "^#{3}\\s+(.*)$": { replacement: "\\subsection{\$1}", groups: [ 1 ] },
    "^#{4}\\s+(.*)$": { replacement: "\\subsubsection{\$1}", groups: [ 1 ] },
    "^#{5}\\s+(.*)$": { replacement: "\\paragraph{\$1}\\hfill\\break", groups: [ 1 ] }, "^(\\s*)\[-*+]\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "itemize" },
    "^(\\s*)\\d+\\.\\s+(.*)$": { replacement: "\\item{\$2}", groups: [ 2 ], state: "enumerate" },
    "^<img (alt|title)=\"(.*)\" src=\"(.*)\.png\"></img>$": { replacement: "\\begin{figure}[H]\\includegraphics" + mdToLatexImgAttr + "{\$3}\\caption{\$2}\\end{figure}", groups: [ 2, 3 ] },
    "^<img (alt|title)=\"(.*)\" src=\"(.*)\.png\"/>$": { replacement: "\\begin{figure}[H]\\includegraphics" + mdToLatexImgAttr + "{\$3}\\caption{\$2}\\end{figure}", groups: [ 2, 3 ] },
    "^\\|([:-]*\\|){1,}$": { ignore: true, state: "tabularx" },
    "^\\|(.*\\|){1,}$": { state: "tabularx" },
    "\\*\\*(.*?)\\*\\*": { replacement: "\\textbf{\$1}", groups: [ 1 ], simple: true },
    "__(.*?)__": { replacement: "\\textbf{\$1}", groups: [ 1 ], simple: true },
    "\\*(.*?)\\*": { replacement: "\\textit{\$1}", groups: [ 1 ], simple: true },
    "_(.*?)_": { replacement: "\\textit{\$1}", groups: [ 1 ], simple: true },
    "\\`(.*?)\\`": { replacement: "\\texttt{\$1}", groups: [ 1 ], simple: true },
    "^---$": { replacement: "\\rule{\\textwidth}{1pt}" },
    "^===$": { replacement: "\\rule{\\textwidth}{2pt}" },
    "\\[([\\d\\.]+\\.)]\\(\\)": { replacement: "\\ref{\$1}", groups: [ 1 ], simple: true },
    "\\[(.+?)]\\((.*?)\\)": { replacement: "\\href{\$2}{\$1}", groups: [ 1, 2 ], simple: true },
    "(_)": { replacement: "\\_", simple: true }
};

var latexToMarkdownMappings =
{
    "^% latex:begin$": { replacement: "<!-- latex:begin -->" },
    "^% latex:end$": { replacement: "<!-- latex:end -->" },
    "^\\\\vbox\\{%together$": { replacement: "<!-- together:begin -->" },
    "^}%together$": { replacement: "<!-- together:end -->" },
    "\\\\comment\\{(.*)\\}\\\\begin\\{verbatim\\}": { replacement: "```\$1", verbatim: true, groups: [ 1 ] },
    "\\\\end\\{verbatim\\}": { replacement: "```", verbatim: false },
    "\\\\chapter\\{(.*)\\}\\\\label\\{(.*)\\}": { replacement: "# \$2 \$1", groups: [ 1, 2 ] },
    "\\\\section\\{(.*)\\}\\\\label\\{(.*)\\}": { replacement: "## \$2 \$1", groups: [ 1, 2 ] },
    "\\\\subsection\\{(.*)\\}\\\\label\\{(.*)\\}": { replacement: "### \$2 \$1", groups: [ 1, 2 ] },
    "\\\\subsubsection\\{(.*)\\}\\\\label\\{(.*)\\}": { replacement: "#### \$2 \$1", groups: [ 1, 2 ] },
    "\\\\paragraph\\{(.*)\\}\\\\label\\{(.*)\\}\\\\hfill\\\\break": { replacement: "##### \$2 \$1", groups: [ 1, 2 ] },
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
    "\\\\begin\\{figure\\}\\[H\\]\\\\includegraphics\\[width=\\\\textwidth,height=\\\\textheight,keepaspectratio,type=png,ext=\\.png,read=\\.png\\]\\{(.*)\\}\\\\caption\\{(.*)\\}\\\\end\\{figure\\}": {
        replacement: "<img alt=\"\$2\" src=\"\$1.png\"/>", groups: [ 1, 2 ]
    },
    "\\\\begin\\{tabularx\\}\\{\\\\textwidth\\}\\{[\|Xlrx]*}\\\\hline": { ignore: true },
    "(.*?&){1,}(.*)(\\\\\\\\ \\\\hline)$": { state: "table" },
    "\\\\end\\{tabularx\\}": { ignore: true, state: "" },
    "\\\\textit\\{(.*?)\\}": { replacement: "*\$1*", groups: [ 1 ] },
    "\\\\textbf\\{(.*?)\\}": { replacement: "**\$1**", groups: [ 1 ] },
    "\\\\texttt\\{(.*?)\\}": { replacement: "`\$1`", groups: [ 1 ] },
    "\\\\rule\\{\\\\textwidth\\}\\{1pt\\}": { replacement: "---" },
    "\\\\rule\\{\\\\textwidth\\}\\{2pt\\}": { replacement: "===" },
    "\\\\ref\\{(.*?)\\}": { replacement: "[\$1]()", groups: [ 1 ], simple: true },
    "\\\\href\\{(.*?)\\}\\{(.*?)\\}": { replacement: "[\$2](\$1)", groups: [ 1, 2 ], simple: true },
    "\\\\(tiny|scriptsize|footnotesize|small|normalsize|large|LARGE|huge|HUGE)": { replacement: "<!-- text:\$1 -->", groups: [ 1 ], simple: true },
    "\\\\pagebreak": { replacement: "<!-- break -->", simple: true },
    "^\% break$": { replacement: "", simple: true, state: "" }
};

module.exports.markdownToLatexMappings = markdownToLatexMappings;
module.exports.latexToMarkdownMappings = latexToMarkdownMappings;