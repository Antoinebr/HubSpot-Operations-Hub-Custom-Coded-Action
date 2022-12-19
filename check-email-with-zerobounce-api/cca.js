const axios = require('axios');

const zeroBounceAPI = process.env.zeroBounceAPI;

exports.main = async (event, callback) => {

    /**
     * @name validateEmailAdress
     * @returns {promise}it returns an axios object
     */
    const validateEmailAdress = async (email) => {

        if (!zeroBounceAPI) throw new Error('ZeroBounce api is not set');

        if (!email) throw new Error('email is not set');
        const endpoint = `https://api.zerobounce.net/v2/validate?api_key=${zeroBounceAPI}&email=${email}&ip_address=""`;

        return axios.get(endpoint);
    }

    const contactEmail = event.inputFields.contactEmail;

    if (!contactEmail) throw new Error('contactEmail is not set, are you sure you put domainName in the "properties to include in code" ? ');

    const zerobounceResponse = await validateEmailAdress(contactEmail);

    if (!zerobounceResponse.data) throw new Error(`We couldn't grab zerobounce infos`);

    const { status, address, free_email, firstname, lastname, gender, country, region, city, zipcode } = zerobounceResponse.data;

    callback({
        outputFields: {
            status,
            address,
            free_email,
            firstname,
            lastname,
            gender,
            country,
            region,
            city,
            zipcode
        }
    });

}