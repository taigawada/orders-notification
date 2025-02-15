#!/bin/bash
sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=delete"

npx prisma migrate deploy

sqlite3 /root/db/sqlite.db "PRAGMA journal_mode=wal"

exec "$@"