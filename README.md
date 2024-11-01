# storopoli.io

![CC-BI-NC-SA 4.0][cc-by-nc-sa-shield]

This is my personal site at [storopoli.io](https://storopoli.io).

It is built with [Hugo](https://gohugo.io/)
and the theme is my personal fork of [WonderMod](https://github.com/storopoli/hugo-WonderMod)
by [Wonderfall](https://github.com/Wonderfall).
WonderMod is a fork of an original theme called [PaperMod](https://github.com/adityatelange/hugo-PaperMod).
Since PaperMod isn't interested in a few changes such as **removing inline JavaScript**,
which I personally require to harden my websites,
I am using the WonderMod fork.
The search functionality needs JavaScript to be enabled.
However, it doesn't break the user experience if JavaScript is disabled.

Deployment is done through a [GitHub Action workflow](https://github.com/storopoli/storopoli.github.io/tree/main/.github/workflows).
It is built with [Hugo](https://gohugo.io/)

## JavaScript

By default, all JavaScript[^javascript] is disabled.
You can enable them in posts by setting the YAML front matter with:

```yaml
javascript: true
```

## Math Support

Math support can be enabled by setting the YAML front matter with:

```yaml
math: true
```

This will load [KaTeX](https://katex.org/) under the hood,
and anything between `$` and `$$` will be rendered as inline or equation math
using JavaScript.

Check all the supported functions in [KaTeX documentation](https://katex.org/docs/supported).

## Mermaid Support

[MermaidJS](https://mermaid.js.org/) support can be enabled by setting the YAML front matter with:

```yaml
mermaid: true
```

This will load MermaidJS under the hood,
and you can specify diagrams and charts with the shortcode:

```md
## {{<mermaid>}}

## title: My Flowchart

flowchart LR
a --> b & c --> d
{{</mermaid>}}
```

They will be rendered automatically using JavaScript.

## License

The code is [MIT](https://mit-license.org/)
and the content is [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

[^javascript]:
    JavaScript is a security issue.
    JavaScript enables **remote code execution**.
    The browser is millions of lines of code, nobody truly knows what is going on,
    and often has escalated privileges in your computer.
