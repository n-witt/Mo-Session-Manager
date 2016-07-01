#!/usr/bin/env bash
gunicorn mo_server:app -c config.py -D
