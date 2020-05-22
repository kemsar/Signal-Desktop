#!/bin/bash

NODE_DIR="./node_modules"
RELEASE_DIR="./release"
CLEAN=""
PREP=""
TEST=""
DEBUG=""
RELEASE=""
BUILD=""
NODE_VER=$(node -p -e "require('./package.json').engines.node")

usage() {
  echo "This script helps developers on Linux use BASH to debug and build releases.

  Usage:  linux-build.sh [args]

  Arguments:

      -b | --build                              Just build it. Typically just for running in IDE.
      -c | --clean                              Removes old build artifacts in order to start fresh including the
                                                node_modules directory, release directory, any tmp files and the
                                                yarn.lock file.
      -p | --prep                               Prepares the environment by installing Fedora build dependencies.
      -d | --debug                              Launches a local, debug instance of Signal.
      -t | --test                               Runs unit tests.
      -r | --release                            Builds a release.
      -n <version> | --node-version <version>   Switches the Node version. The default is the version in the
                                                package.json file, not your default shell version.
      -h | --help                               Displays this content.
  "
}

clean(){
  if [ -n "$CLEAN" ]; then
    echo -e "Cleaning workspace..."
    [ -d "$NODE_DIR" ] && rm -rf $NODE_DIR
    [ -d "$RELEASE_DIR" ] && rm -rf $RELEASE_DIR
    rm -rf .tmp*
    rm yarn.lock
  fi
}

prep(){
  if [ -n "$PREP" ]; then
    echo -e "Prepping workspace..."
    # make sure build dependencies are installed
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    sudo dnf install -y yarn python27 fedora-packager gcc-c++ make @development-tools
    sudo dnf install -y nodejs
    curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
    source ~/.bashrc
  fi
}

install_pkgs(){
  yarn install "$1"
}

generate_js_and_icons(){
  yarn grunt                     # Generate final JS and CSS assets
  yarn build:webpack
}

tests() {
  if [ -n "$TEST" ] && [ -z "$DEBUG" ] && [ -z "$RELEASE" ]; then
    echo -e "Running tests..."
    install_pkgs "--no-lockfile"
    generate_js_and_icons
    yarn test
  fi
}

debug() {
  if [ -n "$DEBUG" ] && [ -z "$RELEASE" ]; then
    echo -e "Launching a debug session..."
    install_pkgs "--no-lockfile"
    generate_js_and_icons
    [ -n "$TEST" ] && yarn test
    yarn start
  fi
}

release(){
  if [ -z "$DEBUG" ] && [ -n "$RELEASE" ]; then
    echo -e "Building a release..."
    install_pkgs "--frozen-lockfile" # Install and build dependencies (this will take a while)
    generate_js_and_icons
    [ -n "$TEST" ] && yarn test
    yarn generate
    yarn build-release
  fi
}

update_node_version(){
  echo -e "Using Node version $NODE_VER..."
  curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
  source ~/.bashrc
  nvm use "$NODE_VER"
}

if [ "$1" == "" ]; then
  echo -e "[ERROR] No arguments provided. Please review the usage notes below:"
  usage
  exit 1
fi

while [ "$1" != "" ]; do
  case $1 in
  #        -f | --file )           shift
  #                                filename=$1
  #                                ;;
  #        -i | --interactive )    interactive=1
  #                                ;;
  -b | --build )
    update_node_version
#    install_pkgs "--no-lockfile"
    generate_js_and_icons
    exit
    ;;
  -c | --clean )
    CLEAN="true"
    ;;
  -p | --prep )
    PREP="true"
    ;;
  -d | --debug )
    DEBUG="true"
    ;;
  -t | --test )
    TEST="true"
    ;;
  -r | --release )
    RELEASE="true"
    ;;
  -n | --node-version )
    shift
    NODE_VER=$1
    ;;
  -h | --help )
    usage
    exit
    ;;
  *)
    echo -e "[ERROR] Unrecognized argument provided. Please review the usage notes below:"
    usage
    exit 1
    ;;
  esac
  shift
done

clean
prep
update_node_version
tests
debug
release
