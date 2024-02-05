---
title: "Cryptography Basics"
date: 2024-02-05T18:53:28-03:00
draft: true
tags: ["math", "cryptography", "number theory", "bitcoin"]
categories: []
javascript: true
math: true
mermaid: false
---

![euclid's one-way function](euclid.webp#center)

> Warning: This post has [KaTeX](https://katex.org/) enabled,
> so if you want to view the rendered math formulas,
> you'll have to unfortunately enable JavaScript.

This is the companion post to the [cryptography workshop](https://github.com/storopoli/cryptography-workshop)
that I gave at a local BitDevs.
Let's explore the basics of cryptography.
We'll go through the following topics:

- One-way functions
- Hash functions
- Public-key cryptography
- DSA
- Schnorr
- Why we don't reuse nonces?
- Why we can combine Schnorr Signatures and not DSA?

## One-way functions

A one-way function is a **function that is easy to compute on every input,
but hard to invert given the image[^image] of a random input**.
For example, imagine an omelette.
It's easy to make an omelette from eggs,
but it's hard to make eggs from an omelette.
In a sense we can say that the function "omelette" is a one-way function:

[^image]: the image of a function $f$ is the set of all values that $f$ may produce.

$$ \text{omellete}^{-1}(x) = \ldots $$

That is, we don't know how to invert the function "omelette" to get the original eggs back.
Or, even better, the benefit we get from reverting the omelette to eggs is not worth the effort,
either in time or money.

Not all functions are one-way functions.
The exponential function, $f(x) = e^x$, is not a one-way function.
It is easy to undo the exponential function by taking the natural logarithm:

$$ f^{-1}(x) = \ln(x) $$

Let's play around with some numbers.
Not any kind of numbers, but very special numbers called **primes**.
A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

If I give you a big number $n$ and ask you to find its prime factors,
and point a gun at your head,
you'll pretty much screwed.
There's no known efficient algorithm[^np] to factorize a big number into its prime factors.
You'll be forced to test all numbers from 2 to $\sqrt{n}$ to see if they divide $n$.

[^np]: the problem of factoring a number into its prime factors is not known to be in
the class of problems that can be solved in polynomial time, P.
It is not known to be NP-complete, NP, either.
Actually to find it P is NP or not is the hardest way to earn a million dollars,
[the P vs NP problem](https://en.m.wikipedia.org/wiki/Millennium_Prize_Problems#P_versus_NP).

Here's a number:

$$ 90809 $$

What are its prime factors?
It's $1279 \cdot 71$.
Easy to check, right?
Hard to find.
That's because prime factorization, if you choose a fucking big number, is a one-way function.

## Hash Functions

Let's spice things up.
There is a special class of one-way functions called **hash functions**.

**A hash function is any function that can be used to map data of arbitrary size to fixed-size values**.

But we are most interested in **_cryptographic_ hash functions**,
which are hash functions that have statistical properties desirable for cryptographic application:

- **One-way function**: easy to compute $y = f(x)$, hard as fuck to do the opposite, $x = f^{-1}(y)$.
- **Deterministic**: given a function that maps elements from set $X$ to set $Y$, $f: X \to Y$,
  for every $x \in X$ there's _at least one_ $y \in Y$[^surjective].
- **Collision resistance**: the possible values of $f: X \to Y$ follows a uniform distribution,
  that is, given the size of the set $Y$,
  it is hard to find two $x_1, x_2 \in X$ that have the same $y \in Y$ value[^1/n].

[^surjective]: this is called [surjection](https://en.wikipedia.org/wiki/Bijection%2C_injection_and_surjection).
[^1/n]: at least $\frac{1}{N}$ where $N$ is the size of $Y$.

These properties make enable cryptographic hash functions to be used in a wide range of applications,
including but not limited to:

- **Digital signatures**: Hash functions are used to create a digest of the message to be signed.
  The digital signature is then generated using the hash, rather than the message itself,
  to ensure integrity and non-repudiation.

- **Password hashing**: Storing passwords as hash values instead of plain text.
  Even if the hash values are exposed,
  the original passwords remain secure due to the pre-image resistance property.

- **Blockchain and cryptocurrency**: Hash functions are used to maintain the integrity of the blockchain.
  Each block contains the hash of the previous block, creating a secure link.
  Cryptographic hashes also underpin various aspects of cryptocurrency transactions.

- **Data integrity verification**: Hash functions are used to ensure that files, messages,
  or data blocks have not been altered.
  By comparing hash values computed before and after transmission or storage,
  any changes in the data can be detected.

We'll cover just the digital signatures part in this post.

## Public-key cryptography

## DSA

## Schnorr

## Why we don't reuse nonces?

## Why we can combine Schnorr Signatures and not DSA?

## License

This post is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
