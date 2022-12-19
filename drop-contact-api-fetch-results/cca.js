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

    const { civility, company, company_linkedin, first_name, full_name, last_name, linkedin, phone, website } = userData;


    const email = (userData.email[0].email !== undefined) ? userData.email[0].email : '';
    const secondaryEmail = (userData.email[1] !== undefined) ? userData.email[1].email : '';
    const tertiaryEmail = (userData.email[2] !== undefined) ? userData.email[2].email : '';


    callback({
        outputFields: {
            dropContactCreditLeft: queryResult.data.credits_left,
            email,
            secondaryEmail,
            tertiaryEmail,
            civility,
            company,
            company_linkedin,
            first_name,
            full_name,
            last_name,
            linkedin,
            phone,
            website
        }
    });

}