+++
title = "Zero-Knowledge Proofs"
date = "2024-06-08T15:48:33-03:00"
tags = ["bitcoin", "cryptography"]
categories = []
javascript = true
math = true
mermaid = false
+++

{{< figure src="zkp_meme.jpg#center" alt="Zero-Knowledge Proofs and the Meaning of Life" title="Zero-Knowledge Proofs and the Meaning of Life" width="500" >}}

> Warning: This post has [KaTeX](https://katex.org/) enabled,
> so if you want to view the rendered math formulas,
> you'll have to unfortunately enable JavaScript.

Lately, I've been diving a little into the world of **Zero-Knowledge Proofs**.
The idea is to prove that you know something without revealing what you know.
More specifically, a **Zero-Knowledge Proof** is a cryptographic protocol that allows
a **prover** to convince a **verifier** that a statement is true without revealing
any information beyond the validity of the statement.
In essence, by the end of the protocol, the verifier is convinced that the prover knows the secret,
and the **verifier hasn't learned anything (zero-knowledge) about the secret**.

**Zero-Knowledge Proofs** (ZKPs) are kinda hot right now,
since a lot of new Bitcoin innovations are being built on top of them.
It allows for a higher level of privacy and potential scalability improvements
in the Bitcoin network.

The idea behind this post is to give a general overview of Zero-Knowledge Proofs,
while providing further resources,
especially which papers to read,
to dive deeper into the subject.
As always, I'll try to keep it simple and intuitive.
However, as you might guess, the subject is quite complex,
and I'll try to simplify it as much as possible;
but some mathematical background is necessary.

## Placeholder

Video

{{< youtube >}}
gcKCW7CNu_M
{{< /youtube >}}


## License

This post is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
