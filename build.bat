@echo off
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" amd64
cd /d C:\Users\ASUS\corsair-bugherd
set PATH=%PATH%;C:\Program Files\Git\bin;C:\Users\ASUS\AppData\Local\Programs\Python\Python312
set PYTHON=C:\Users\ASUS\AppData\Local\Programs\Python\Python312\python.exe
pnpm install