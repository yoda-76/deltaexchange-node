import hashlib
import hmac
import base64
import requests
import datetime
import urllib
import json

# This script places a limit order.
# Just enter the proper details below and then run the script.
base_url = "https://api.delta.exchange"
api_key = ""        # Enter your key here
api_secret = ""     # Enter your secret here
 


"""
No need to change anything below this line.
Try to only use the below to learn.
The "request" function defined below is the one that you can use for any API call.
Use this "request" function with proper parameter.
Below is also a example for a function that places order using the func "request"
"""
def get_time_stamp():
    d = datetime.datetime.utcnow()
    epoch = datetime.datetime(1970, 1, 1)
    return str(int((d - epoch).total_seconds()))

def generate_signature(secret, message):
    message = bytes(message, 'utf-8')
    secret = bytes(secret, 'utf-8')
    hash = hmac.new(secret, message, hashlib.sha256)
    return hash.hexdigest()

def query_string(query):
    if query == None:
        return ''
    else:
        query_strings = []
        for key, value in query.items():
            query_strings.append(key + '=' + urllib.parse.quote_plus(str(value)))
        return '?' + '&'.join(query_strings)

def body_string(body):
    if body == None:
        return ''
    else:
        return json.dumps(body, separators=(',', ':'))

# Use this function.
def request(method, path, payload=None, query=None, auth=False, headers={}):
    url = '%s%s' % (base_url, path)
    headers['Content-Type'] = 'application/json'
    if auth:
        if api_key is None or api_secret is None:
            raise Exception('Api_key or Api_secret missing')
        timestamp = get_time_stamp()
        signature_data = method + timestamp + path +  query_string(query) + body_string(payload)
        signature = generate_signature(api_secret, signature_data)
        headers['api-key'] = api_key
        headers['timestamp']  = timestamp
        headers['signature'] = signature
        res = requests.request(method, url, data=body_string(payload), params=query, timeout=(3, 27), headers=headers)
        return res

print("Getting order:")
response = request('GET', '/v2/orders', query=None, auth=True, headers={})
print("Place order response: ")
print(response.status_code)
print(response.json())