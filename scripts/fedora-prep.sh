#!/usr/bin/env bash

rm -rf node_modules/
rm -rf release/
rm -rf .tmp*
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo dnf install -y yarn python27 fedora-packager gcc-c++ @development-tools

yarn install
#find ./patches -type f -name '*.patch' -print0 | sort -z | xargs -t -0 -n 1 patch -N -p1 -i
