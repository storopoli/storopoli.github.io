+++
title = "Zero-Knowledge Proofs"
date = "2024-06-08T15:48:33-03:00"
tags = ["bitcoin", "cryptography"]
categories = []
javascript = true
math = true
mermaid = true
+++

{{< figure src="zkp_meme.jpg#center" alt="Zero-Knowledge Proofs and the Meaning of Life" title="Zero-Knowledge Proofs and the Meaning of Life" width="500" >}}

> Warning: This post has [KaTeX](https://katex.org/)
> and [`mermaid.js`](https://mermaid.js.org) enabled,
> so if you want to view the rendered math formulas,
> and diagrams,
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

## What are ZKPs?

Let's formalize the concept of **Zero-Knowledge Proofs**.
A formal definition of zero-knowledge has to use some computational model,
and without loss of generality,
we can use the [Turing Machine](https://en.wikipedia.org/wiki/Turing_machine).
model.
So let's create three Turing machines:

- $P$ (the **prover**),
- $V$ (the **verifier**),
- and $S$ (the **simulator**).

Let's also spicy things up a bit and introduce an **adversary** $A$,
and assume that it is also a Turing machine.
**The secret we want to prove knowledge without revealing is $x$**.

The prover $P$ wants to prove to the verifier $V$ that it knows the secret $x$.
They both share a common simulator $S$.
The adversary $A$ is trying to fool the verifier $V$ into believing that it knows the secret $x$,
without actually knowing it.

The prover $P$ generates a proof $\pi = P(S, x)$,
and sends it to the verifier $V$.
The verifier $V$ then checks the proof $\pi$,
and decides whether to accept or reject it.

The tuple $(P, V, S)$ is a **Zero-Knowledge Proof** if the following properties hold:

1. **Completeness**: If the statement is true, the verifier will accept the proof.

   $$ \Pr\big[V(S, \pi) = \text{accept} \big] = 1. $$

   Here $\Pr\big[V(S, \pi) = \text{accept} \big]$ denotes the probability that the verifier accepts the proof given a simulator $S$ and a proof $\pi$.

1. **Soundness**: If the statement is true, no cheating prover can convince an honest verifier that it is true,
   except with some negligible probability [^negligible].

   $$ \forall A, \forall x, \forall \pi: \Pr\big[V(A, S, \pi) = \text{accept} \big] < \text{negligible}. $$

   Here $\Pr\big[V(A, S, \pi) = \text{accept} \big]$ denotes the probability that the verifier accepts the proof given an adversary $A$, a simulator $S$, and a proof $\pi$.

1. **Zero-Knowledge**: If the statement is true, the verifier learns nothing about the secret $x$.
    A proof is zero-knowledge if there exists a simulator $S$ that can simulate the verifier's view
    without knowing the secret $x$.

    $$ \forall x: \text{View}_V\big[P(x) \leftrightarrow V(\pi)\big] = S(x, \pi). $$

    Here $\text{View}_V$ is the view of the verifier $V$,
    and $\leftrightarrow$ denotes the interaction between the prover and the verifier.

[^negligible]: A function $f$ is negligible if for every polynomial $p$,
   there exists an $N$ such that for all $n > N$,
   $$ f(n) < \frac{1}{p(n)}. $$
   If you want to learn more about negligible functions,
   read Chapter 3 Section 3.1 of the book [Introduction to Modern Cryptography](https://doi.org/10.1201/9781420010756) by Katz & Lindell.

If you come up from a scheme that satisfies these properties,
congratulations, you have a **Zero-Knowledge Proof** scheme
and you can name it whatever you want,
just like a Pokemon!

## DAG

{{<mermaid>}}
---

title: DAG
---

graph TD
  A(A) -- Link Text --> B(B)
  A -- Link Text --> C(C)
{{</mermaid>}}

## Resources

The following video from YouTube is from the
[Blockchain Web3 MOOC from Berkeley University](https://rdi.berkeley.edu/).
It provides a good introduction to Zero-Knowledge Proofs,
while being quite accessible to beginners.

{{<youtube>}}gcKCW7CNu_M{{</youtube>}}

Also we have tons of papers on the subject.
Here are some of the most important ones:

[Petkus19] M. Petkus. Why and How zk-SNARK works. arXiv preprint arXiv:1906.07221. 2019 Jun 17.

[Kil92] J. Kilian. A note on efficient zero-knowledge proofs and arguments (extended abstract). In STOC, pages 723–732, 1992.

[Mic94] S. Micali. Cs proofs (extended abstracts). In FOCS, pages 436–453, 1994.

[GGPR13] R. Gennaro, C. Gentry, B. Parno, and M. Raykova. Quadratic span programs and succinct NIZKs without PCPs. In EUROCRYPT, 2013.

[Growth16] J. Growth. On the size of pairing-based non-interactive arguments. In EUROCRYPT, 2016.

[Sonic19] B. Bunz, B. Fisch, and A. Szepieniec. Transparent SNARKs from DARK compilers. ePrint Report 2019/1229, 2019.

[Marlin19] A. Chiesa, Y. Hu, M. Maller, P. Mishra, N. Vesely, and N. Ward. "Marlin: Preprocessing zkSNARKs with universal and updatable SRS." In Advances in Cryptology–EUROCRYPT 2020: 39th Annual International Conference on the Theory and Applications of Cryptographic Techniques, Zagreb, Croatia, May 10–14, 2020, Proceedings, Part I 39, pp. 738-768. Springer International Publishing, 2020.

[Plonk19] A. Gabizon Z. Williamson, and O. Ciobotaru. "Plonk: Permutations over lagrange-bases for oecumenical noninteractive arguments of knowledge." Cryptology ePrint Archive (2019).

[Dark20] B. Bünz, B. Fisch, and A. Szepieniec. Transparent SNARKs from DARK compilers. In Advances in Cryptology–EUROCRYPT 2020: 39th Annual International Conference on the Theory and Applications of Cryptographic Techniques, Zagreb, Croatia, May 10–14, 2020, Proceedings, Part I 39 2020 (pp. 677-706). Springer International Publishing.

[Halo20] L. Wang. Halo 0.9: A Halo Protocol with Fully-Succinctness. Cryptology ePrint Archive. 2020.

[STARK19] E. Ben-Sasson, A. Chiesa, E. Tromer, and M. Virza. "Scalable, transparent, and post-quantum secure computational integrity." In Advances in Cryptology–CRYPTO 2019: 39th Annual International Cryptology Conference, Santa Barbara, CA, USA, August 18–22, 2019, Proceedings, Part III 39, pp. 19-48. Springer International Publishing, 2019.

## License

This post is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
