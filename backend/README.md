pip install -r requirements.txt
pyinstaller --onefile --add-data "firebase/aqua-d1330-firebase-adminsdk-iux0o-80f07b7f76.json;firebase" --hidden-import=asyncpg.pgproto.pgproto main.py
