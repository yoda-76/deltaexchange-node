const crypto = require('crypto');
const fetch = require('node-fetch');

class DeltaExchangeAPI {
    constructor(api_key, api_secret) {
        this.base_url = "https://api.delta.exchange";
        this.api_key = api_key;
        this.api_secret = api_secret;
    }

    get_time_stamp() {
        const d = new Date();
        const epoch = new Date(1970, 1, 1);
        return Math.floor((d - epoch) / 1000).toString();
    }

    generate_signature(secret, message) {
        const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
        return hash;
    }

    query_string(query) {
        if (!query) {
            return '';
        } else {
            const query_strings = [];
            for (const [key, value] of Object.entries(query)) {
                query_strings.push(`${key}=${encodeURIComponent(value)}`);
            }
            return '?' + query_strings.join('&');
        }
    }

    body_string(body) {
        if (!body) {
            return '';
        } else {
            return JSON.stringify(body);
        }
    }

    async request(method, path, payload = null, query = null, auth = false, headers = {}) {
        const url = `${this.base_url}${path}`;
        headers['Content-Type'] = 'application/json';
        
        if (auth) {
            if (!this.api_key || !this.api_secret) {
                throw new Error('Api_key or Api_secret missing');
            }
            const timestamp = this.get_time_stamp();
            const signature_data = method + timestamp + path + this.query_string(query) + this.body_string(payload);
            const signature = this.generate_signature(this.api_secret, signature_data);
            
            headers['api-key'] = this.api_key;
            headers['timestamp'] = timestamp;
            headers['signature'] = signature;
        }

        const options = {
            method: method,
            headers: headers,
        };

        if (payload) {
            options.body = this.body_string(payload);
        }

        const res = await fetch(url, options);
        return res;
    }

    async get_wallet_balance() {
        const response = await this.request('GET', '/v2/wallet/balances', null, true, {});
        const data = await response.json();
        return data.result;
    }

    async get_asset_prices() {
        const url = "https://cdn.deltaex.org/v2/tickers?contract_types=spot";
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            return data.result;
        }
        return [];
    }

    async calculate_total_balance() {
        const wallet_balances = await this.get_wallet_balance();
        const asset_prices = await this.get_asset_prices();

        // Rest of the implementation for calculating total balance...

    }
}

// Create an instance of the DeltaExchangeAPI class
const api_key = "TIBzzyqnQRwwAJYN0HLRr7jI0yUwv9";
const api_secret = "9acBSoPfVlUa9rpFVVqQC2T63ZdONQ6kKZkmMkNo1rPOMLsVOYqzYxzYMZq1";
const delta_api = new DeltaExchangeAPI(api_key, api_secret);

async function main() {
    const total_balance = await delta_api.calculate_total_balance();
    console.log("Total balance:", total_balance);
}

main();
