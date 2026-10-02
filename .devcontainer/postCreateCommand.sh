#!/bin/sh
set -e

# No ~/.gitconfig here: the Dev Containers extension copies the host's in,
# and writing one would replace it.

curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://bun.sh/install | bash

"${HOME}/.bun/bin/bun" install
