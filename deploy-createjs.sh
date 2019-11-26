#!/bin/bash

#-------------------------------------
# Deploy script for CreateJS games
#
# This script should be placed at the root directory of the game
# and assumes that the exported files are in src/ folder
#-------------------------------------

if [ "$#" -ne 1 ]; then
  echo ""
  echo "Usage: ./deploy.sh s3_folder_name"
  echo ""
  exit 1
fi

if [[ -n $(git status -s) ]]; then
  echo "You have uncommited changes. Exiting...";
  exit 1;
 fi

cd src
rm -f package.zip
git config user.name > version && git config user.email >> version && git log --pretty=format:'%h%n' -n 1 >> version
zip -x *.sh -r package.zip *
aws s3 sync . s3://bengga-web-funtypes/production/$1 --exclude "*.sh" --exclude "*.git/*"
echo
echo
echo "Package hash is"
shasum package.zip
echo
echo
cd ..