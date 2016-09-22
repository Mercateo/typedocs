#!/bin/bash

set -o errexit # Exit on error

MODULE=../node_modules/typedoc 

git clone -b ts-2.0 --single-branch git://github.com/zakhenry/typedoc $MODULE
npm install --prefix $MODULE --force
