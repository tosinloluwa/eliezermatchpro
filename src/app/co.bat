@echo off
setlocal EnableDelayedExpansion

set "sourceDir=%CD%"

:: Find all .ts files and create corresponding .txt files
for /r "%sourceDir%" %%F in (*.ts) do (
    echo Processing: %%F
    set "txtFile=%%~dpnF.txt"
    type "%%F" > "!txtFile!"
)

echo Done!
pause