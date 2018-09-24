# Markdown LaTeX Toggle

This is a stupid extension which uses regular expressions to toggle formatting between Markdown and LaTeX. The resulting LaTeX should be suitable for use in an  `\include` statement.

It provides the commands `Convert Markdown To LaTeX` and `Convert LaTeX to Markdown`. Swapping from one to the other and then back again should result in (virtually) the same document.

When converting to LaTeX, a file is created (or overwritten) by adding the `.tex` extension to the markdown file.

When converting to Markdown, a file is created (or overwritten) by adding the `.md` extension to the LaTeX file.

## Supported Markdown:

- bold, italic and fixed fonts

- headings (# to #####)

- images (using HTML img tags, *Note: **title** or **alt** attribute is required*)
```
    <img title="title" src="image.png"/>
```

- numbered lists

- bullet lists

- tables

- horizontal rules

- references to headings (converted to internal links)
```
    ### 1.3.1 Heading

    ...

    see [1.3.1.]() for details
```

- raw LaTeX blocks
```
    <!-- latex:begin -->
    \..
    <!-- latex:end -->
```

- together blocks (to avoid page breaks}
```
    <!-- together:begin -->
    # Heading

    A paragraph of text
    <!-- together:end -->
```

- text size (tiny, scriptsize, footnotesize, small, normalsize, large, LARGE, huge, HUGE)
```
    <!-- text:<size> -->
```

- code blocks (using the LaTeX verbatim environmnent)
```
    ```json
    {
        "flag": bool
    }
    ```
```

- page breaks
```
    <!-- break -->
```

- table breaks (restarts table with the same headings)
```
    | a               | red    |
    | b               | green  |
    | <!-- break -->c | yellow |
    | d               | blue   |
```

### Notes

For italic, bold, etc. to work (where the element is surrounded by characters) both start and end characters need to be on the same line. In general, it's probably best to put each entire paragraph on it's own line and let your editor wrap it for you if necessary.

In most cases there should be no whitespace around elements, e.g. img links, `<!-- -->` directives (apart from table breaks), etc.

For section heading references to work they should have the x.x.x. format. The [Markdown TOC](https://marketplace.visualstudio.com/items?itemName=AlanWalk.markdown-toc) has functions to automatically insert/update/delete the numbers.

**Remember - this is a very stupid extension and will almost certainly not result in a perfect conversion.**

## To Be Supported:

- hyperlinks


## Configuration

None


## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.markdown-latex-toggle).


### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/markdown-latex-toggle).


## Known Issues

It will probably only ever work for my own special circumstances.


## Credits

...
