@echo off
REM This script replicates the environment setup and package installation from start_bot in main.py

REM Check if venv exists, if not, create it
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

REM Install requirements if requirements.txt exists

REM Create requirements.txt if it does not exist and freeze installed packages
if not exist requirements.txt (
    echo requirements.txt not found. Creating requirements.txt with current packages...
    venv\Scripts\pip.exe freeze > requirements.txt
) else (
    echo requirements.txt found. Updating with current packages...
    venv\Scripts\pip.exe freeze > requirements.txt
)

REM Install packages from requirements.txt
echo Installing packages from requirements.txt...
venv\Scripts\pip.exe install -r requirements.txt

echo To run the bot, activate the venv and run main.py:
echo venv\Scripts\activate && python main.py
