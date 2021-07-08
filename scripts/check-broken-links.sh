#!/bin/bash
#
# Check for broken links.
#
set -e

source ./config/versioned

docker run --rm \
  --network "$DOCKERNETWORK" \
  dcycle/broken-link-checker:2 http://"$DOCKERNAME/"
docker run --rm \
  --network "$DOCKERNETWORK" \
  dcycle/broken-link-checker:2 http://"$DOCKERNAME/splash.html"
echo ""
echo "Done checking for broken links!"
echo ""
