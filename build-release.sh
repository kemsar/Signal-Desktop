#!/usr/bin/env bash
yarn install --frozen-lockfile # Install and build dependencies (this will take a while)
yarn grunt                     # Generate final JS and CSS assets
yarn icon-gen                  # Generate full set of icons for Electron
yarn test                      # A good idea to make sure tests run first
yarn generate
yarn build-release
