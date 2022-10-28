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
    const searchACompany = async () => {

        const endpoint = `https://api.hubapi.com/collector/graphql`;

        const res = await axios.post(endpoint, {
            "query": `
               
                query MyQuery {
                    CRM {
                      company_collection(filter: {name__contains: "golf"}) {
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


    const {
        data
    } = res.data;

    console.log(data.CRM.company_collection);

    callback({
        outputFields: {
            result: data.CRM.company_collection
        }
    });

}