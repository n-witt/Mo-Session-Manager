import json
from aiohttp import web
from paste.util.multidict import MultiDict

class Route_Handlers:
    def __init__(self, persistor):
        self._persistor = persistor
        self._allowed_params = {'u_id', 'urls', 'url', 'list'}


    def _has_dead_params(self, given):
        return len(set(given).difference(self._allowed_params)) > 0

    def _get_params(self, request):
        '''
        Returns the parameter from request, regardless their type
        (GET OR POST) and returns a MultiDict containg the values.
        '''
        params = MultiDict()
        if request.method == 'POST':
            # this is required by aiohttp. without this,
            # request.POST is empty
            _ = [f for f in request.post()]
            for k, v in request.POST.items():
               # when data is transfered via POST, array names are
               # appended a '[]'.
               params.add(k.replace('[]', ''), v)
        elif request.method == 'GET':
            for k, v in request.GET.items():
               params.add(k, v)
        else:
           raise TypeError('You need to pass a Request obj')

        return params

    async def pop(self, request):
        '''
        Returns the value that is stored under key 'request'.
        '''
        params = self._get_params(request)
        if 'u_id' in params:
            u_id = params['u_id']
            try:
                urls = self._persistor.pop(u_id)
                # send warning if unused params were passed
                if self._has_dead_params(params.keys()):
                    response = json.dumps({
                            'status': 'warning',
                            'msg': 'unused parameters passed',
                            'urls': urls
                        })
                else:
                    response = json.dumps({
                            'status': 'ok',
                            'urls': urls
                        })
            except KeyError:
                response = json.dumps({'status': 'error',
                                       'msg': 'unknown u_id'})
        else:
            response = json.dumps({'status': 'error',
                                   'msg': 'invalid query. u_id required'})
        if 'origin' in request.headers:
           header = {'Access-Control-Allow-Origin': request.headers['origin']}
        else:
           header = {}

        return web.Response(body=response.encode('utf8'), headers=header)


    async def push(self, request):
        '''
        Stores the 'url's in the request dict obj under the key
        given in 'u_id'.
        '''
        params = self._get_params(request)
        if 'u_id' in params and 'urls' in params:
            urls = [v for k, v in params.items() if k == 'urls']
            self._persistor.push(params['u_id'], urls)
            # send warning if unused params were passed
            if self._has_dead_params(params.keys()):
                response = json.dumps({
                        'status': 'warning',
                        'msg': 'unused parameters passed',
                })
            else:
                response = json.dumps({'status': 'ok'})
        else:
            response = json.dumps({'status': 'error',
                                   'msg': 'invalid query. u_id and ' + \
                                           'at least one urls field required'})

        if 'origin' in request.headers:
           header = {'Access-Control-Allow-Origin': request.headers['origin']}
        else:
           header = {}

        return web.Response(body=response.encode('utf8'), headers=header)
