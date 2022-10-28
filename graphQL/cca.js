const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

exports.main = async (event, callback) => {


    /**
     * @name searchACompany
     * @desc runs a graphQL query
     * 
     */
    const searchACompany = async (nameContains) => {

        const endpoint = `https://api.hubapi.com/collector/graphql`;

        return await axios.post(endpoint, {
            "query": `
                query myQuery {
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