@echo off
if "%~1"=="-rf" shift
:next
if "%~1"=="" exit /b 0
if exist "%~1" rmdir /s /q "%~1"
shift
goto next
