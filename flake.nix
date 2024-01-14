{
  description = "virtual environments";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs";
  inputs.devshell.url = "github:numtide/devshell";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
  inputs.treefmt-nix.url = "github:numtide/treefmt-nix";

  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

  outputs = { self, flake-utils, devshell, nixpkgs, pre-commit-hooks, treefmt-nix, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;

          overlays = [ devshell.overlays.default ];
        };
        treefmtEval = treefmt-nix.lib.evalModule pkgs ./treefmt.nix;
      in
      rec {
        formatter = treefmtEval.config.build.wrapper;
        checks = {
          formatting = treefmtEval.config.build.check self;
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              typos.enable = true;
              treefmt = {
                enable = true;
              };
            };
            settings = {
              treefmt.package = treefmtEval.config.build.wrapper;
            };
          };
        };
        devShell = pkgs.devshell.mkShell {
          imports = [ (pkgs.devshell.importTOML ./devshell.toml) ];
        };
      });
}
