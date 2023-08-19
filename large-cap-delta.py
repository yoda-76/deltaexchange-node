import hashlib
import hmac
import base64
import requests
import datetime
import urllib
import json
import pandas as pd

class DeltaExchangeAPI:
    def __init__(self, api_key, api_secret):
        self.base_url = "https://api.delta.exchange"
        self.api_key = api_key
        self.api_secret = api_secret

    def get_time_stamp(self):
        d = datetime.datetime.utcnow()
        epoch = datetime.datetime(1970, 1, 1)
        return str(int((d - epoch).total_seconds()))

    def generate_signature(self, secret, message):
        message = bytes(message, 'utf-8')
        secret = bytes(secret, 'utf-8')
        hash = hmac.new(secret, message, hashlib.sha256)
        return hash.hexdigest()

    def query_string(self, query):
        if query is None:
            return ''
        else:
            query_strings = []
            for key, value in query.items():
                query_strings.append(key + '=' + urllib.parse.quote_plus(str(value)))
            return '?' + '&'.join(query_strings)

    def body_string(self, body):
        if body is None:
            return ''
        else:
            return json.dumps(body, separators=(',', ':'))

    def request(self, method, path, payload=None, query=None, auth=False, headers={}):
        url = '%s%s' % (self.base_url, path)
        headers['Content-Type'] = 'application/json'
        if auth:
            if self.api_key is None or self.api_secret is None:
                raise Exception('Api_key or Api_secret missing')
            timestamp = self.get_time_stamp()
            signature_data = method + timestamp + path + self.query_string(query) + self.body_string(payload)
            signature = self.generate_signature(self.api_secret, signature_data)
            headers['api-key'] = self.api_key
            headers['timestamp'] = timestamp
            headers['signature'] = signature
        res = requests.request(method, url, data=self.body_string(payload), params=query, timeout=(3, 27), headers=headers)
        return res

    def get_wallet_balance(self):
        response = self.request('GET', '/v2/wallet/balances', query=None, auth=True, headers={})
        return response.json()['result']

    def get_asset_prices(self):
        url = "https://cdn.deltaex.org/v2/tickers?contract_types=spot"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data['result']
        return []

    def calculate_total_balance(self):
        wallet_balances = self.get_wallet_balance()
        asset_prices = self.get_asset_prices()

        df_wallet = pd.DataFrame(wallet_balances)
        df_prices = pd.DataFrame(asset_prices)
        df_prices['asset_symbol'] = df_prices['symbol'].str.split('_', expand=True)[0]

        merged_df = df_wallet.merge(df_prices[['asset_symbol', 'close']], on='asset_symbol', how='left')
        merged_df.rename(columns={'close': 'prices'}, inplace=True)

        balance = 0
        for idx, row in merged_df.iterrows():
            if row['available_balance'] != 0:
                if row['asset_symbol'] in ['USDT', 'DAI', 'USDC']:
                    balance += float(row['available_balance'])
                    continue
                elif row['asset_symbol'] == 'BNS':
                    continue
                balance += (float(row['prices']) * float(row['available_balance']))
        return balance


# Create an instance of the DeltaExchangeAPI class
api_key = "TIBzzyqnQRwwAJYN0HLRr7jI0yUwv9"
api_secret = "9acBSoPfVlUa9rpFVVqQC2T63ZdONQ6kKZkmMkNo1rPOMLsVOYqzYxzYMZq1"
delta_api = DeltaExchangeAPI(api_key, api_secret)
total_balance = delta_api.calculate_total_balance()
print("Total balance:", total_balance)
