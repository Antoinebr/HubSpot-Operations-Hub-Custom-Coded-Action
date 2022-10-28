const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

exports.main = async (event, callback) => {


    /**
     * @name searchACompany
     * @desc run a graphQL query, it's important to have a private app token with the graphQL scope enabled see : https://developers.hubspot.com/docs/cms/data/query-hubspot-data-using-graphql#scope-requirements
     * 
     */
    const searchACompany = async (nameContains) => {

        const endpoint = `https://api.hubapi.com/collector/graphql`;

        return await axios.post(endpoint, {
            "query": `
                query MyQuery {
                    CRM {
                      company_collection(filter: {name__contains: "${nameContains}"}) {
                        items {
                          name
                          domain
                          address
                          description
                          country
                        }
                      }
                    }
                  }
                `
        }, axiosConfig);
    }



    const res = await searchACompany('golf');

    console.log(res.data.data.CRM.company_collection);

    callback({
        outputFields: {
            result: res.data.data.CRM.company_collection
        }
    });

}