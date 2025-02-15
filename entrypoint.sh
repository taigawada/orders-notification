#!/bin/bash
echo "current mode is:"
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode;"

echo "change sqlite journal_mode to:"
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=delete;"

npx prisma migrate deploy

sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=wal;"

exec "$@"