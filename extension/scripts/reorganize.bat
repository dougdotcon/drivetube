@echo off
echo Reorganizando estrutura do projeto...

:: Criar diretórios principais
mkdir src 2>nul
mkdir src\background 2>nul
mkdir src\content 2>nul
mkdir src\popup 2>nul
mkdir src\popup\components 2>nul
mkdir src\services 2>nul
mkdir src\utils 2>nul
mkdir public 2>nul
mkdir tests 2>nul
mkdir docs 2>nul

:: Mover arquivos para nova estrutura
move background.js src\background\background.js 2>nul
move contentScript.js src\content\contentScript.js 2>nul
move popup.html src\popup\popup.html 2>nul
move popup.js src\popup\popup.js 2>nul
move manifest.json public\manifest.json 2>nul
move icons public\icons 2>nul

:: Criar arquivo de configuração webpack
echo module.exports = {> webpack.config.js
echo   entry: {>> webpack.config.js
echo     background: './src/background/background.js',>> webpack.config.js
echo     contentScript: './src/content/contentScript.js',>> webpack.config.js
echo     popup: './src/popup/popup.js'>> webpack.config.js
echo   },>> webpack.config.js
echo   output: {>> webpack.config.js
echo     filename: '[name].js',>> webpack.config.js
echo     path: __dirname + '/dist'>> webpack.config.js
echo   }>> webpack.config.js
echo };>> webpack.config.js

echo Estrutura reorganizada com sucesso! 