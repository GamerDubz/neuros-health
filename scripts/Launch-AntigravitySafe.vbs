Set shell = CreateObject("WScript.Shell")
scriptPath = "C:\Users\thema\AppData\Local\AntigravitySafe\Launch-AntigravitySafe.ps1"
command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & scriptPath & """"
shell.Run command, 0, False
