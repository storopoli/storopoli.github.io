# storopoli.com

![CC-BI-NC-SA 4.0][cc-by-nc-sa-shield]

This is my personal site at [storopoli.com](https://storopoli.com).

It is built with [Zig](https://ziglang.org/)
and [Zine](https://zine-ssg.io).

To run the site locally, you need to have Zig installed,
and run the following command;

```sh
zig build serve
```

## JavaScript

By default, all JavaScript[^javascript] is disabled.

## Math Support

Math support can be enabled by setting the frontmatter with;

```zig
.custom = {"math": true},
```

This will load either [KaTeX](https://katex.org/)
under the hood, and anything between `$` and `$$`
will be rendered as inline or equation math
using JavaScript.

Check all the supported functions in [KaTeX documentation](https://katex.org/docs/supported)
or [wypst sourcecode](https://github.com/0xpapercut/wypst/blob/0687e570c6c641c0875f4e9448d7936c1eadc9ac/src/core/src/converter.rs#L488-L511)

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
