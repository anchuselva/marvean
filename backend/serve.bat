@echo off
echo ========================================================
echo Starting MARVEAN Intelligence Platform Backend...
echo Local URL: http://localhost:8000/
echo Database: logicstrand_marvean
echo ========================================================
"C:\xampp\php\php.exe" -S localhost:8000 -t public public/index.php
