@echo off
c:\
cd c:\Users\LattePanda\Desktop\Everyware\pi
node server.js
timeout 5
cd "C:\Program Files (x86)\Google\Chrome\Application"
.\chrome.exe http://localhost:3000 --start-fullscreen
