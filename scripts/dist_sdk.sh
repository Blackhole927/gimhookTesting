#!/bin/sh

echo "Building SDK..."

cd sdk/packages

cd gimhook

if [ ! -d node_modules ]
then
	npm i
fi

npm run dist

cd ..

cd create-gimhook

if [ ! -d node_modules ]
then
	npm i
fi

npm run dist

cd ..

cd ../..