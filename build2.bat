@echo off
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
cd /d C:\Users\ASUS\corsair-bugherd
set PATH=%PATH%;C:\Program Files\Git\bin;C:\Users\ASUS\AppData\Local\Programs\Python\Python312
set PYTHON=C:\Users\ASUS\AppData\Local\Programs\Python\Python312\python.exe
set WindowsSDKVersion=10.0.26100.0
pnpm install