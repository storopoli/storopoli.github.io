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
## ZKPs Taxonomy

We can classify **Zero-Knowledge Proofs** into two broad categories:

1. **Interactive Zero-Knowledge Proofs**: In this case, the prover and the verifier interact multiple times.
   The prover sends a proof to the verifier,
   and the verifier sends a challenge to the prover,
   and this interaction continues until the verifier is convinced.
   The Fiat-Shamir Heuristic can transform an interactive ZKP into a non-interactive ZKP.

1. **Non-Interactive Zero-Knowledge Proofs**: In this case, the prover sends a proof to the verifier,
    and the verifier accepts or rejects the proof.
    No further interaction is needed.

Additionally,
the setup of the **simulator $S$ with respect to the data it uses**
can be further classified into three categories.
Generally speaking, the data used by $S$ is some random bits.

1. **Trusted Setup**: $S$ uses data that must be kept secret.
   If compromised trusted setup, any proof by an adversary $A$ can be accepted by any verifier $V$.
   This is bad, and we want to avoid it.
1. **Trusted but Universal Setup**: $S$ uses data that must be public,
    but it only uses for the initial setup.
    Future proofs can be verified without the need for this data.
1. **Transparent Setup**: $S$ uses no data at all.
    This is the best setup, as it doesn't require any data to be used by $S$.

Some of the most popular Zero-Knowledge Proof systems are:

- **zk-SNARKs**: Zero-Knowledge Succinct Non-Interactive Argument of Knowledge.
  This is a non-interactive ZKP system with a trusted setup.
- **Bulletproofs**: A non-interactive ZKP system with a transparent setup.
- **zk-STARKs**: Zero-Knowledge Scalable Transparent Argument of Knowledge.
  This is a non-interactive ZKP system with a transparent setup,
  with an additional property of being (plausibly) post-quantum secure.


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

We have tons of papers on the subject.
Here are some selected few.

The whole idea of ZKPs as discussed above in three properties was first conceived by [[SMR85]].
Later [[Kil92]] showed that some of the properties' assumptions can be relaxed,
more specifically using computational soundness instead of statistical soundness.
[[Mic94]] applied the [Fiat-Shamir Heuristic](https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic)
to [[Kil92]]'s contributions to show that you can create any non-interactive ZKP system into
a non-interactive ZKP system using the [Random Oracle Model](https://en.wikipedia.org/wiki/Random_oracle_model).

Going to the zk-SNARKs side,
the term was introduced by [[Bit11]]
and the first protocol, the Pinocchio protocol,
was introduced by [[Gen12]] and [[Par13]].
The Bulletproofs protocol was introduced by [[Bunz18]],
followed by the Bulletproofs++ protocol by [[Eagen24]].

zk-STARKs were introduced by [[Ben-Sasson19]].

Finally, if you want an intuitive but very comprehensive explanation of zk-SNARKs,
then you should read [[Petkus19]].

[SMR85]: https://epubs.siam.org/doi/10.1137/0218012 "Goldwasser, S., Micali, S., & Rackoff, C. (1985). The knowledge complexity of interactive proof systems. SIAM Journal on computing, 18(1), 186-208."

[Kil92]: https://dl.acm.org/doi/abs/10.1145/129712.129782 "Kilian, J. (1992). A note on efficient zero-knowledge proofs and arguments (extended abstract). In Proceedings of the twenty-fourth annual ACM symposium on Theory of computing (pp. 723-732)."

[Mic94]: https://ieeexplore.ieee.org/abstract/document/365746/ "Micali, S. (1994). CS proofs (extended abstract). In Proceedings 35th Annual Symposium on Foundations of Computer Science (pp. 436-445)."

[Bit11]: https://eprint.iacr.org/2011/443 "Bitansky, N., Canetti, R., & Goldwasser, S. (2011). From Extractable Collision Resistance to Succinct Non-Interactive Arguments of Knowledge, and Back Again. In Proceedings of the 3rd innovations in theoretical computer science conference (pp. 326-349)."

[Gen12]: https://eprint.iacr.org/2012/215 "Gennaro, R., Gentry, C., Parno, B., & Raykova, M. (2013). Quadratic span programs and succinct NIZKs without PCPs. In Advances in Cryptology–EUROCRYPT 2013: 32nd Annual International Conference on the Theory and Applications of Cryptographic Techniques, Athens, Greece, May 26-30, 2013. Proceedings 32 (pp. 626-645)."

[Par13]: https://eprint.iacr.org/2013/279 "Parno, B., Gentry, C., Howell, J., & Raykova, M. (2013). Pinocchio: Nearly practical verifiable computation. In Proceedings of the 2013 IEEE Symposium on Security and Privacy (SP) (pp. 238-252)."

[Bunz18]: https://ieeexplore.ieee.org/document/8418611 "Bünz, B., Bootle, J., Boneh, D., Poelstra, A., Wuille, P., & Maxwell, G. (2018). Bulletproofs: Short Proofs for Confidential Transactions and More. In Proceedings of the 2018 IEEE Symposium on Security and Privacy (SP) (pp. 315-334)."

[Eagen24]: https://link.springer.com/chapter/10.1007/978-3-031-58740-5_9 "Bulletproofs++: next generation confidential transactions via reciprocal set membership arguments. In Annual International Conference on the Theory and Applications of Cryptographic Techniques (pp. 249-279)."

[Ben-Sasson19]: https://link.springer.com/chapter/10.1007/978-3-030-26954-8_23 "Ben-Sasson, E., Bentov, I., Horesh, Y., & Riabzev, M. (2019). Scalable zero knowledge with no trusted setup. In Advances in Cryptology–CRYPTO 2019: 39th Annual International Cryptology Conference, Santa Barbara, CA, USA, August 18–22, 2019, Proceedings, Part III 39 (pp. 701-732)."

[Petkus19]: https://arxiv.org/abs/1906.07221 "Petkus, M. (2019). Why and How zk-SNARK works. arXiv preprint 1906.07221."

The following video from YouTube is from the
[Blockchain Web3 MOOC from Berkeley University](https://rdi.berkeley.edu/).
It provides a good introduction to Zero-Knowledge Proofs,
while being quite accessible to beginners.

{{<youtube>}}gcKCW7CNu_M{{</youtube>}}

## License

This post is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
