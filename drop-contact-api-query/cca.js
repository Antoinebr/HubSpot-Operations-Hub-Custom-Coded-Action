const axios = require('axios');

const axiosConfig = {
    headers: {
        'X-Access-Token': process.env.dropContactAPI
    }
};


exports.main = async (event, callback) => {



    /**
     * @name getInfos
     * @desc connects to dropContact and query their database
     * @returns {object} 
     *      {
                credits_left: 99,
                error: false,
                request_id: 'aagwfigojshwjzw',
                success: true
            }
     */
    const getInfos = async (query) => {


        if( typeof query !== "object") throw new Error('query has to be an object');

        const endpoint = `https://api.dropcontact.io/batch`;

        return await axios.post(endpoint, query, axiosConfig);

    }


    if(!event.inputFields.contactEmail) throw new Error('event.inputFields.contactEmail is not set, are you sure you added the contact email in the "property to include in code" option ? ');

    const res =  await getInfos({
        data: [{
            email: event.inputFields.contactEmail
        }]
    });


    if(!res.data) throw new Error('The query made to dropcontact failed');


    if(res.data.error) throw new Error(`We reached dropcontact but dropcontact sent an error ${res.data.toString()}`);


    if(!res.data.request_id) throw new Error(`Dropcontact responded but with no request_id ${res.data.toString()}`);


    callback({
        outputFields: {
            dropContactCreditLeft : res.data.credits_left,
            dropContactRequestId: res.data.request_id
        }
    });

}