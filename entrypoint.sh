#!/bin/bash

if [ -e $ENTRYPOINT ]; then
  bash $ENTRYPOINT
fi

exec "$@"