#!/bin/bash
set -e

./scripts/destroy.sh
./scripts/build-static-site.sh

source ./config/versioned

echo "Make sure the network $DOCKERNETWORK exists."
docker network ls | grep "$DOCKERNETWORK" || docker network create "$DOCKERNETWORK"

docker run --rm -d \
  --name "$DOCKERNAME" \
  --network "$DOCKERNETWORK" \
  -p "$DOCKERPORT":80 -v "$PWD/docs/_site":/usr/local/apache2/htdocs/ httpd:2.4

./scripts/uli.sh
