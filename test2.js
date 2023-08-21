const crypto = require('crypto');
const axios = require('axios');
const querystring = require('querystring');

class DeltaExchangeAPI {
    constructor(api_key, api_secret) {
        console.log("inside constroctor")
        this.base_url = "https://api.delta.exchange";
        this.api_key = api_key;
        this.api_secret = api_secret;
    }

    get_time_stamp() {
        console.log("get_time_stamp")

        const d = new Date();
        const epoch = new Date(1970, 1, 1);
        return Math.floor((d - epoch) / 1000).toString();
    }

    generate_signature(secret, message) {
        console.log("generate_signature")

        const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
        return hash;
    }

    query_string(query) {
        console.log("query_string")

        if (!query) {
            return '';
        } else {
            return '?' + querystring.stringify(query);
        }
    }

    async request(method, path, payload = null, query = null, auth = false, headers = {}) {
        console.log("request")

        const url = `${this.base_url}${path}`;
        headers['Content-Type'] = 'application/json';

        if (auth) {
            if (!this.api_key || !this.api_secret) {
                throw new Error('Api_key or Api_secret missing');
            }
            const timestamp = this.get_time_stamp();
            const signature_data = method + timestamp + path + this.query_string(query) + JSON.stringify(payload);
            const signature = this.generate_signature(this.api_secret, signature_data);
            console.log("sign: ",signature)

            headers['api-key'] = this.api_key;
            headers['timestamp'] = timestamp;
            headers['signature'] = signature;
        }

        const options = {
            method: method,
            headers: headers,
        };

        if (payload) {
            options.data = JSON.stringify(payload);
        }
        console.log("first")
        const res = await axios(url, options);
        console.log("res:",res)
        return res;
    }

    async get_wallet_balance() {
        console.log("get_wallet_balance")

        const response = await this.request('GET', '/v2/wallet/balances', null, null, true, {});
        return response.data.result;
    }

    async get_asset_prices() {
        console.log("get_asset_prices")

        const url = "https://cdn.deltaex.org/v2/tickers?contract_types=spot";
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data.result;
        }
        return [];
    }

    async calculate_total_balance() {
        console.log("calculate_total_balance")
        const wallet_balances = await this.get_wallet_balance();
        const asset_prices = await this.get_asset_prices();

        let balance = 0;
        for (let idx = 0; idx < wallet_balances.length; idx++) {
            const row = wallet_balances[idx];
            if (row.available_balance !== 0) {
                if (['USDT', 'DAI', 'USDC'].includes(row.asset_symbol)) {
                    balance += parseFloat(row.available_balance);
                    continue;
                } else if (row.asset_symbol === 'BNS') {
                    continue;
                }
                const priceData = asset_prices.find(asset => asset.symbol === row.asset_symbol + '_USDT');
                if (priceData) {
                    balance += (parseFloat(priceData.close) * parseFloat(row.available_balance));
                }
            }
        }
        return balance;
    }
}

// Create an instance of the DeltaExchangeAPI class
const api_key = "TIBzzyqnQRwwAJYN0HLRr7jI0yUwv9";
const api_secret = "9acBSoPfVlUa9rpFVVqQC2T63ZdONQ6kKZkmMkNo1rPOMLsVOYqzYxzYMZq1";
const delta_api = new DeltaExchangeAPI(api_key, api_secret);
delta_api.calculate_total_balance()
    .then(total_balance => {
        console.log("Total balance:", total_balance);
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
