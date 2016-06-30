#!/usr/bin/env python3

import aiohttp_cors

from aiohttp import web
from Key_value_storage import Key_value_storage
from Route_Handlers import Route_Handlers

    
persistor = Key_value_storage()
handlers = Route_Handlers(persistor)
app = web.Application()

app.router.add_route('GET', '/pop', handlers.pop)
app.router.add_route('POST', '/pop', handlers.pop)
app.router.add_route('GET', '/push', handlers.push)
app.router.add_route('POST', '/push', handlers.push)
#web.run_app(app, port=5000)
