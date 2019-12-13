#!/usr/bin/env bash
#rm -rf node_modules/
#rm -rf release/
#rm -rf .tmp*
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo dnf install -y yarn python27 fedora-packager gcc-c++ @development-tools
wget "https://aur.archlinux.org/cgit/aur.git/plain/openssl-linking.patch?h=signal" -O ./patches/openssl-linking.patch
sed -i.bak "s/node\": \"10.13.0/node\": \"$(node --version | sed 's/v//')/" package.json

yarn install --frozen-lockfile
#patch -p1 < ./patches/openssl-linking.patch
#sudo chattr +i node_modules/@journeyapps/sqlcipher/deps/sqlite3.gyp

yarn grunt
yarn icon-gen
#yarn test
yarn generate
yarn build-release
