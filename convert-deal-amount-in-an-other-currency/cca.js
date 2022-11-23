const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

if (!process.env.privateAppToken) throw new Error('The private APP token is missing ');


exports.main = async (event, callback) => {

    /**
     * The main currency code for your portal. 
     * If the current deal is in the main currency we do not convert the amount
     */
    const mainCurrencyCode = "USD";



    const getDealInfos = (dealId, props) => {

        const formatedProps = props.map(p => `properties=${p}`).join('&');

        const endpoint = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?${formatedProps}&archived=false&`;

        return axios.get(endpoint, axiosConfig);
    }


    if (!event.inputFields.dealId) throw new Error(' event.inputFields.dealId is not set, are you sure you added the dealId in the "property to include in code" option ? ');

    const dealId =  event.inputFields.dealId;

    const deal = await getDealInfos(dealId, ['hs_mrr', 'amount', 'deal_currency_code']);

    
    const { amount, deal_currency_code } = deal.data.properties;


    const exchangeRates = [{
            currency: "EUR",
            to: "USD",
            exchangeRate: 1.12
        },
        {
            currency: "GBP",
            to: "USD",
            exchangeRate: 1.34
        }
    ];

    let amountConverted = null;

    // checkif curency had to be formated  
    if (deal_currency_code !== mainCurrencyCode) {

        console.log(`The deal currency code is ${deal_currency_code} and will be formated`);

        // find the exchangeRate based on the current deal currency 
        const rate = exchangeRates.find(er => er.currency === deal_currency_code);

        if (!rate) throw new Error('No rate found for this currency');


        //convert the amount to mainCurrencyCode
        amountConverted = amount * rate.exchangeRate;

    }


    callback({
        outputFields: {
            amountConverted: amountConverted
        }
    });

}