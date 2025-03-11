@echo off

REM Instalar dependências
call npm install

REM Compilar TypeScript
call npm run build

REM Criar diretório de distribuição se não existir
if not exist dist mkdir dist

REM Copiar arquivos necessários
copy manifest.json dist\
xcopy /E /I icons dist\icons
xcopy /E /I pages dist\pages
copy background.js dist\
copy contentScript.js dist\
copy popup.html dist\
copy popup.js dist\

echo Build completo! Agora você pode carregar a pasta dist como uma extensão não empacotada no Chrome. 