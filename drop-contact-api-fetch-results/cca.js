const axios = require('axios');

const axiosConfig = {
    headers: {
        'X-Access-Token': process.env.dropContactAPI
    }
};


exports.main = async (event, callback) => {



    const getQueryResult = async (requestID) => {

        if (typeof requestID !== "string") throw new Error(`The request id has to be set we received ${requestID} with a type of ${typeof requestID}`);

        const endpoint = `https://api.dropcontact.io/batch/${requestID}`;

        return await axios.get(endpoint, axiosConfig);
    }


    if (!event.inputFields.dropContactRequestId) throw new Error('event.inputFields.dropContactRequestId is not set, are you sure you added the dropContactRequestId in the "property to include in code" option ? ');

    const queryResult = await getQueryResult(event.inputFields.dropContactRequestId);

    if (!queryResult.data) throw new Error('dropContact API returned an invalid response');

    if (!queryResult.data.data) throw new Error('dropContact returned an empty response');


    const userData = queryResult.data.data[0];


    const dropContactData = {
        company: userData.company ? userData.company : '',
        email: (userData.email[0].email !== undefined) ? userData.email[0].email : '',
        phone: userData.phone ? userData.phone : '',
        website: userData.website ? userData.website : '',
    }


    callback({
        outputFields: {
            dropContactCreditLeft: queryResult.data.credits_left,
            company: dropContactData.company,
            email: dropContactData.email,
            phone: dropContactData.phone,
            website: dropContactData.website,
        }
    });

}