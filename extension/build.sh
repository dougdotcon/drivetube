#!/bin/bash

# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Criar diretório de distribuição se não existir
mkdir -p dist

# Copiar arquivos necessários
cp manifest.json dist/
cp -r icons dist/
cp -r pages dist/
cp background.js dist/
cp contentScript.js dist/
cp popup.html dist/
cp popup.js dist/

# Criar arquivo ZIP para distribuição
cd dist
zip -r ../mulakintola-extension.zip ./*
cd ..

echo "Build completo! O arquivo mulakintola-extension.zip foi criado." 