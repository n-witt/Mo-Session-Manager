from Abstract_Persistance import Abstract_Persistance

import os
import json

class Key_value_storage(Abstract_Persistance):
    '''
    This class is the most simplyfied storage class i could think of.
    It only allows storing and fetching simple python dicts. 
    Under the hood it uses a single json file.
    '''
    def __init__(self):
        self._filename = 'storage.json'
        self._dict = dict()

        if os.path.isfile(self._filename):
            with open(self._filename, 'r') as fh:
                try:
                    self._dict = json.load(fh)
                except json.decoder.JSONDecodeError:
                    # invalid JSON in the storage. we'll skip
                    # it an overwrite it later with valid JSON
                    pass
        else:
            with open(self._filename, 'x') as fh:
                json.dump(self._dict, fh)

    def push(self, key='', value={}):
        self._dict[key] = value 
        with open(self._filename, 'w') as fh:
            json.dump(self._dict, fh)
    
    def pop(self, key=''):
        return self._dict[key]

