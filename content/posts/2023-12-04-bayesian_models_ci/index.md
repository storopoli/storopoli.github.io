+++
title = "Testing Bayesian Models with Nix and GitHub Actions"
date = "2023-12-04T17:43:03-03:00"
tags = ["bayesian", "nix", "CI/CD"]
categories = []
javascript = false
math = false
mermaid = false
+++

![bayesian-models-go-brrrrr](bayesian-models-go-brrrrr.png#center)

I have an open access and open source[^open] graduate-level course on Bayesian statistics.
It is available in GitHub through the repo [`storopoli/Bayesian-Statistics`](https://github.com/storopoli/Bayesian-Statistics).
I've taught it many times and every time was such a joy.
It is composed of:

[^open]: the code is MIT-licensed and the content is CreativeCommons
Non-Commercial 4.0

- a set of 300+ slides[^slides] covering the theoretical part
- [Stan](https://mc-stan.org)[^stan] models
- [Turing.jl](https://turinglang.org)[^turing] models

[^slides]: I am also planning to go over the slides for every lecture
in a YouTube playlist in the near future.
This would make it the experience complete: slides, lectures, and code.

[^stan]: a probabilistic programming language and suite of MCMC samplers written in C++.
It is today's gold standard in Bayesian stats.

[^turing]: is an ecosystem of Julia packages for Bayesian inference using probabilistic
programming.

Now and then I receive emails from someone saying that the materials helped
them to understand Bayesian statistics.
These kind messages really make my day, and that's why I strive to keep
the content up-to-date and relevant.

I decided to make the repository fully reproducible and testable in CI[^ci] using
[Nix](https://nixos.org)
and [GitHub actions](https://docs.github.com/en/actions).

[^ci]: CI stands for **c**ontinuous **i**ntegration,
sometimes also known as CI/CD, **c**ontinuous **i**ntegration and **c**ontinuous
**d**elivery.
[CI/CD](https://en.wikipedia.org/wiki/CI/CD) is a wide "umbrella" term
for "everything that is tested in all parts of the development cicle",
and these tests commonly take place in a cloud machine.

Here's what I am testing on every new change to the main repository
and every new pull request (PR):

1. **slides in LaTeX** are built and released as PDF in CI
1. **typos** in content and code are tested
1. **Turing.jl models** are run and tested in CI using the latest version of Julia,
   Turing.jl and dependencies
1. **Stan models** are run and test in CI using the latest version of Stan

## Nix

All of these tests demand a highly reproducible and intricate development
environment.
That's where [Nix](https://nixos.org) comes in.
Nix can be viewed as a package manager, operating system, build tool,
immutable system, and many things.

Nix is purely functional.
Everything is described as an expression/function,
taking some inputs and producing deterministic outputs.
This guarantees reproducible results and makes caching everything easy.
Nix expressions are lazy. Anything described in Nix code will only be executed
if some other expression needs its results.
This is very powerful but somewhat unnatural for developers not familiar
with functional programming.

I enjoy Nix so much that I use it as the operating system and package manager in
all of my computers.
Feel free to check my setup at
[`storopoli/flakes`](https://github.com/storopoli/flakes).

The main essence of the repository setup is the
[`flake.nix` file](https://github.com/storopoli/Bayesian-Statistics/blob/main/flake.nix).
A Flake is a collection of recipes (Nix derivations) that the repository
provides.
From the [NixOS Wiki article on Flakes](https://nixos.wiki/wiki/Flakes):

> Flakes is a feature of managing Nix packages to simplify usability and improve
> reproducibility of Nix installations.
> Flakes manages dependencies between Nix expressions,
> which are the primary protocols for specifying packages.
> Flakes implements these protocols in a consistent schema with a common set
> of policies for managing packages.

I use the Nix's Flakes to not only setup the main repository package,
defined in the Flake as just `package.default`
which is the PDF build of the LaTeX slides,
but also to setup the development environment,
defined in the Flake as the `devShell.default`,
to run the latest versions of
Stan and Julia/Turing.jl.

We'll go over the Flake file in detail.
However, let me show the full Flake file:

```nix
{
  description = "A basic flake with a shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";

  outputs = { self, nixpkgs, flake-utils, pre-commit-hooks }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        tex = pkgs.texlive.combine {
          inherit (pkgs.texlive) scheme-small;
          inherit (pkgs.texlive) latexmk pgf pgfplots tikzsymbols biblatex beamer;
          inherit (pkgs.texlive) silence appendixnumberbeamer fira fontaxes mwe;
          inherit (pkgs.texlive) noto csquotes babel helvetic transparent;
          inherit (pkgs.texlive) xpatch hyphenat wasysym algorithm2e listings;
          inherit (pkgs.texlive) lstbayes ulem subfigure ifoddpage relsize;
          inherit (pkgs.texlive) adjustbox media9 ocgx2 biblatex-apa wasy;
        };
        julia = pkgs.julia-bin.overrideDerivation (oldAttrs: { doInstallCheck = false; });

      in
      {
        checks = {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              typos.enable = true;
            };
          };
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs;[
            bashInteractive
            # pdfpc # FIXME: broken on darwin
            typos
            cmdstan
            julia
          ];

          shellHook = ''
            export JULIA_NUM_THREADS="auto"
            export JULIA_PROJECT="turing"
            export CMDSTAN_HOME="${pkgs.cmdstan}/opt/cmdstan"
            ${self.checks.${system}.pre-commit-check.shellHook}
          '';
        };
        packages.default = pkgs.stdenvNoCC.mkDerivation rec {
          name = "slides";
          src = self;
          buildInputs = with pkgs; [
            coreutils
            tex
            gnuplot
            biber
          ];
          phases = [ "unpackPhase" "buildPhase" "installPhase" ];
          buildPhase = ''
            export PATH="${pkgs.lib.makeBinPath buildInputs}";
            cd slides
            export HOME=$(pwd)
            latexmk -pdflatex -shell-escape slides.tex
          '';
          installPhase = ''
            mkdir -p $out
            cp slides.pdf $out/
          '';
        };
      });
}
```

A flake is composed primarily of `inputs` and `outputs`.
As `inputs` I have:

```nix
inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
inputs.flake-utils.url = "github:numtide/flake-utils";
inputs.pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
```

- [**`nixpkgs`**](https://github.com/NixOS/nixpkgs)
  is responsible for providing all of the packages necessary for both
  `package.default` and `devShell.default`: `cmdstan`, `julia-bin`, `typos`,
  and a bunch of `texlive` LaTeX small packages.
- [**`flake-utils`**](https://github.com/numtide/flake-utils)
  are a bunch of Nix utility functions that creates tons of
  syntactic sugar to make the Flake easily accessible in all platforms,
  such as macOS and Linux.
- [**`pre-commit-hooks`**](https://github.com/cachix/pre-commit-hooks.nix)
  is a nice Nix utility to create easy
  [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
  that do some checking at several steps of the git workflow.
  The only hook that I am using is the [`typos`](https://github.com/crate-ci/typos)
  pre-commit hook that checks the whole commit changes for common typos and won't
  let you commit successfully if you have typos:
  either correct or whitelist them in the `_typos.toml` file.

The `outputs` are the bulk of the Flake file and it is a Nix function that
takes all the above as inputs and outputs a couple of things:

```nix
outputs = { self, nixpkgs, flake-utils, pre-commit-hooks }:
    flake-utils.lib.eachDefaultSystem (system: {
      checks = ...
      devShells = ...
      packages = ...
   });
```

- `checks` things that are executed/built when you run `nix flake check`
- `devShells` things that are executed/built when you run `nix develop`
- `packages` things that are executed/built when you run `nix build`

Let's go over each one of the outputs that the repository Flake has.

### `packages` -- LaTeX slides

We all know that LaTeX is a pain to make it work.
If it builds in my machine definitely won't build in yours.
This is solved effortlessly in Nix.
Take a look at the `tex` variable definition in the `let ... in` block:

```nix
let
  # ...
  tex = pkgs.texlive.combine {
    inherit (pkgs.texlive) scheme-small;
    inherit (pkgs.texlive) latexmk pgf pgfplots tikzsymbols biblatex beamer;
    inherit (pkgs.texlive) silence appendixnumberbeamer fira fontaxes mwe;
    inherit (pkgs.texlive) noto csquotes babel helvetic transparent;
    inherit (pkgs.texlive) xpatch hyphenat wasysym algorithm2e listings;
    inherit (pkgs.texlive) lstbayes ulem subfigure ifoddpage relsize;
    inherit (pkgs.texlive) adjustbox media9 ocgx2 biblatex-apa wasy;
  };
  # ...
in
```

`tex` is a custom instantiation of the `texlive.combine` derivation with some
overrides to specify which CTAN packages you need to build the slides.
We use `tex` in the `packages.default` Flake `output`:

```nix
packages.default = pkgs.stdenvNoCC.mkDerivation rec {
  name = "slides";
  src = self;
  buildInputs = with pkgs; [
    coreutils
    tex
    gnuplot
    biber
  ];
  phases = [ "unpackPhase" "buildPhase" "installPhase" ];
  buildPhase = ''
    export PATH="${pkgs.lib.makeBinPath buildInputs}";
    cd slides
    export HOME=$(pwd)
    latexmk -pdflatex -shell-escape slides.tex
  '';
  installPhase = ''
    mkdir -p $out
    cp slides.pdf $out/
  '';
};
```

Here we are declaring a Nix derivation with the `stdenvNoCC.mkDerivation`,
the `NoCC` part means that we don't need C/C++ build tools.
The `src` is the Flake repository itself and I also specify the dependencies
in `buildInputs`: I still need some fancy stuff to build my slides.
Finally, I specify the several `phases` of the derivation.
The most important part is that I `cd` into the `slides/` directory
and run `latexmk` in it, and copy the resulting PDF to the `$out` Nix
special directory which serves as the output directory for the derivation.

This is really nice because anyone with Nix installed can run:

```shell
nix build github:storopoli/Bayesian-Statistics
```

and bingo! You have my slides as PDF built from LaTeX files without having to
clone or download the repository.
Fully reproducible in any machine or architecture.

The next step is to configure GitHub actions to run Nix and build the slides'
PDF file in CI.
I have two workflows for that and they are almost identical except for the
last step.
The first one is the
[`build-slides.yml`](https://github.com/storopoli/Bayesian-Statistics/blob/main/.github/workflows/build-slides.yml),
which, of course, builds the slides.
These are the relevant parts:

```yaml
name: Build Slides
runs-on: ubuntu-latest
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Install Nix
    uses: DeterminateSystems/nix-installer-action@v8

  - name: Build Slides
    run: nix build -L

  - name: Copy result out of nix store
    run: cp -v result/slides.pdf slides.pdf

  - name: Upload Artifacts
    uses: actions/upload-artifact@v3
    with:
      name: output
      path: ./slides.pdf
      if-no-files-found: error
```

Here we use a set of actions to:

1. install Nix
1. build the slides' PDF file using `nix build`
   (the `-L` flag is to have more verbose logs)
1. upload the built slides' PDF file as an artifact of the CI run.
   This is useful for inspection and debugging.
   There is also the caveat that if the PDF file is not found the whole workflow
   should error.

The last one is the
[`release-slides.yml`](https://github.com/storopoli/Bayesian-Statistics/blob/main/.github/workflows/release-slides.yml),
which releases the slides when I publish a new tag.
It is almost the same as `build-slides.yml`, thus I will only highlight the
relevant bits:

```yaml
on:
  push:
    tags:
      - "*"
# ...
- name: Release
  uses: ncipollo/release-action@v1
  id: release
  with:
    artifacts: ./slides.pdf
```

The only change is the final step that we now use a `release-action`
that automatically publishes a release with the slides' PDF file as one of the
release artifacts.
This is good since, once I achieve a milestone in the slides,
I can easily tag a new version and have GitHub automatically publish a new
release with the resulting PDF file attached in the release.

This is a very good workflow, both in GitHub but also locally.
I don't need to install tons of gigabytes of texlive stuff to build my slides
locally.
I just run `nix build`.
Also, if someones contributes to the slides I don't need to check the correctness
of the LaTeX code, only the content and the output PDF artifact in the
resulting CI from the PR.
If it's all good, just thank the blessed soul and merge it!

### Turing.jl Models

The repository has a directory called `turing/` which is a Julia project with
`.jl` files and a `Project.toml` that lists the Julia dependencies and
appropriate `compat` bounds.
In order to test the Turing.jl models in the Julia files,
I have the following things in the Nix Flake `devShell`:

```nix
let
  # ...
  julia = pkgs.julia-bin.overrideDerivation (oldAttrs: { doInstallCheck = false; });
  # ...
in
# ...
devShells.default = pkgs.mkShell {
  packages = with pkgs;[
    # ...
    julia
    # ...
  ];

  shellHook = ''
    # ...
    export JULIA_NUM_THREADS="auto"
    export JULIA_PROJECT="turing"
    # ...
  '';
};
```

Nix `devShell` lets you create a development environment by adding a
transparent layer on top of your standard shell environment with additional
packages, hooks, and environment variables.
First, in the `let ... in` block, I am defining a variable called `julia`
that is the `julia-bin` package with an attribute `doInstallCheck`
being overridden to `false`.
I don't want the Nix derivation of the `mkShell` to run all Julia standard tests.
Next, I define some environment variables in the `shellHook`,
which, as the name implies, runs every time that I instantiate the default
`devShell` with `nix develop`.

With the Nix Flake part covered, let's check how we wrap everything in a
GitHub action workflow file named
[`models.yml`](https://github.com/storopoli/Bayesian-Statistics/blob/main/.github/workflows/models.yml).
Again, I will only highlight the relevant parts for the Turing.jl model testing
CI job:

```yaml
jobs:
  test-turing:
    name: Test Turing Models
    runs-on: ubuntu-latest
    strategy:
      matrix:
        jl-file: [
            "01-predictive_checks.jl",
            # ...
            "13-model_comparison-roaches.jl",
          ]
    steps:
      # ...
      - name: Test ${{ matrix.jl-file }}
        run: |
          nix develop -L . --command bash -c "julia -e 'using Pkg; Pkg.instantiate()'"
          nix develop -L . --command bash -c "julia turing/${{ matrix.jl-file }}"
```

I list all the Turing.jl model Julia files in a `matrix.jl-file` list
to
[define variations for each job](https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs).
Next, we install the latest Julia version.
Finally, we run everything in parallel using the YAML string interpolation
`${{ matrix.jl-file }}`.
This expands the expression into `N` parallel jobs,
where `N` is the `jl-file` list length.

If any of these parallel jobs error out, then the whole workflow will error.
Hence, we are always certain that the models are up-to-date with the latest Julia
version in `nixpkgs`, and the latest Turing.jl dependencies.

### Stan Models

The repository has a directory called `stan/` that holds a bunch of Stan models
in `.stan` files.
These models can be used with any Stan interface,
such as
[`RStan`](https://mc-stan.org/rstan)/[`CmdStanR`](https://mc-stan.org/cmdstanr),
[`PyStan`](https://pystan.readthedocs.org/en/latest/)/[`CmdStanPy`](https://mc-stan.org/cmdstanpy),
or [`Stan.jl`](https://github.com/goedman/Stan.jl).
However I am using [`CmdStan`](https://mc-stan.org/docs/cmdstan-guide/index.html)
which only needs a shell environment and Stan, no additional dependencies
like Python, R, or Julia.
Additionally, `nixpkgs` has a
[`cmdstan`](https://search.nixos.org/packages?query=cmdstan)
package that is well-maintained and up-to-date with the latest Stan release.

In order to test the Stan models,
I have the following setup in the Nix Flake `devShell`:

```nix
devShells.default = pkgs.mkShell {
  packages = with pkgs;[
    # ...
    cmdstan
    # ...
  ];

  shellHook = ''
    # ...
    export CMDSTAN_HOME="${pkgs.cmdstan}/opt/cmdstan"
    # ...
  '';
};
```

Here I am also defining an environment variable in the `shellHook`,
`CMDSTAN_HOME` because that is useful for local development.

In the same GitHub action workflow
[`models.yml`](https://github.com/storopoli/Bayesian-Statistics/blob/main/.github/workflows/models.yml)
file is defined the Stan model testing CI job:

```yaml
jobs:
  test-stan:
    name: Test Stan Models
    runs-on: ubuntu-latest
    strategy:
      matrix:
        stan: [
            {
              model: "01-predictive_checks-posterior",
              data: "coin_flip.data.json",
            },
            # ...
            {
              model: "13-model_comparison-zero_inflated-poisson",
              data: "roaches.data.json",
            },
          ]
    steps:
      # ...
      - name: Test ${{ matrix.stan.model }}
        run: |
          echo "Compiling: ${{ matrix.stan.model }}"
          nix develop -L . --command bash -c "stan stan/${{ matrix.stan.model }}"
          nix develop -L . --command bash -c "stan/${{ matrix.stan.model }} sample data file=stan/${{ matrix.stan.data }}"
```

Now I am using a YAML dictionary as the entry for every element in the `stan`
YAML list with two keys: `model` and `data`.
`model` lists the Stan model file without the `.stan` extension,
and `data` lists the JSON data file that the model needs to run.
We'll use both to run parallel jobs to test all the Stan models listed in the
`stan` list.
For that we use the following commands:

```nix
nix develop -L . --command bash -c "stan stan/${{ matrix.stan.model }}"
nix develop -L . --command bash -c "stan/${{ matrix.stan.model }} sample data file=stan/${{ matrix.stan.data }}"
```

This instantiates the `devShell.default` shell environment,
and uses the `stan` binary provided by the `cmdstan` Nix package to compile the
model into an executable binary.
Next, we run this model executable binary in `sample` mode while also providing
the corresponding data file with `data file=`.

As before, if any of these parallel jobs error out, then the whole workflow will
error.
Hence, we are always certain that the models are up-to-date with the latest
Stan/CmdStan version in `nixpkgs`.

## Conclusion

I am quite happy with this setup.
It makes easy to run test in CI with GitHub Actions,
while also being effortless to instantiate a development environment with Nix.
If I want to get a new computer up and running, I don't need to install a bunch
of packages and go over "getting started" instructions to have all the necessary
dependencies.

This setup also helps onboard new contributors since it is:

1. easy to setup the dependencies necessary to develop and test
1. trivial to check if contributions won't break anything

Speaking of "contributors", if you are interested in Bayesian modeling,
feel free to go over the contents of the repository
[`storopoli/Bayesian-Statistics`](https://github.com/storopoli/Bayesian-Statistics).
**Contributions are most welcomed**.
Don't hesitate on opening an issue or pull request.

## License

This post is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
