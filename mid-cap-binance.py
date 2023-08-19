from binance.client import Client
import pandas as pd

class BinanceAPI:
    def __init__(self, api_key, api_secret):
        self.client = Client(api_key, api_secret)

    def get_total_wallet_balance(self):
        account_info = self.client.get_account()
        df = pd.DataFrame(account_info['balances'])
        ticker = self.client.get_symbol_ticker(symbol="BTCUSDT")
        btc_price = float(ticker["price"])
        btc_valuation = pd.DataFrame(client.get_user_asset())['btcValuation'].astype(float).sum()
        total_wallet_balance = btc_valuation * btc_price

        return total_wallet_balance


api_key = 'Z0kGxMMUhuj8HSezNB4nzjk1KhVUeyDTkT00YAWQ32u3VgKksNce7E5ZRHPgzcdu'
api_secret = 'GdlUdlE6vfhJFPe6QaCgbJUtFi78lcWOAQClBPYzHf3VSd988bmwBJrz3sCPTXOu'

binance_api = BinanceAPI(api_key, api_secret)
total_balance = binance_api.get_total_wallet_balance()
print("Total wallet balance in BTC:", total_balance)
