#!/bin/bash

#
# Run this script to publish a new version of the library to npm.  This requires
# that you have a clean working directory and have created a tag that matches
# the version number in package.json.
#
set -o errexit

#
# Destination directory for the package.
#
BUILT_PACKAGE=build/ol-displaced-points

#
# Build the package and publish.
#
main() {
    npm install
    npm run build-package
    cd ${BUILT_PACKAGE}
    npm  publish --access public
}

main
