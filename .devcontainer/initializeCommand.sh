#!/bin/sh
set -e

# Runs on the host before the container starts. macOS doesn't export TZ, but
# /etc/localtime links into the zoneinfo database, and the zone ID is the tail
# of that path (…/zoneinfo/America/Chicago). An explicit TZ on the host wins.
zone="${TZ:-$(readlink /etc/localtime | sed 's|.*/zoneinfo/||')}"

printf 'TZ=%s\n' "${zone}" > "$(dirname "$0")/host.env"
