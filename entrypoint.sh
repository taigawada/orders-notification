#!/bin/bash
echo "current mode is:"
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode;"

echo "change sqlite journal_mode to:"
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=delete;"

mv /root/db/sqlite.db /root/db/tmp_sqlite.db
cp -p /root/db/tmp_sqlite.db /root/db/sqlite.db
rm /root/db/tmp_sqlite.db

npx prisma migrate deploy

echo "return sqlite journal_mode to:"
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=wal;"

exec "$@"