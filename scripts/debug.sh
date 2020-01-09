#!/usr/bin/env bash

yarn install --lock-file
#find ./patches -type f -name '*.patch' -print0 | sort -z | xargs -t -0 -n 1 patch -N -p1 -i
yarn grunt
yarn icon-gen
yarn start
