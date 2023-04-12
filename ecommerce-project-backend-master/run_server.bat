@echo off
title Run Site Server
start cmd /k "cd /d %~dp0 & php -S localhost:8070"
