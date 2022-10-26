const axios = require('axios');


const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};


exports.main = async (event, callback) => {

    /**
     * @name getPortalInfo
     * @desc Grab the portal id and various other infos
     * @returns {promise}
     */
    const getPortalInfo = async () => {
        const endpoint = `https://api.hubapi.com/integrations/v1/me`;

        return axios.get(endpoint, axiosConfig);
    }


    const searchInCompanies = async (name) => {

        const endpoint = `https://api.hubapi.com/crm/v3/objects/companies/search`;

        return axios.post(endpoint, {
            "filterGroups": [{
                "filters": [{
                    "value": name,
                    "propertyName": "name",
                    "operator": "EQ"
                }]
            }],
            "properties": [
                "hubspot_owner_id",
                "dealname",
                "dealstage",
                "name"
            ],
            "limit": 100,
            //"after": after
        }, axiosConfig);

    }





    const mergeAcompany = (primaryObjectId, objectIdToMerge) => {

        if (!primaryObjectId) throw new Error(`You have to put the company id has the first argument `)

        if (!objectIdToMerge) throw new Error(`You have to put the company id has the sencond argument `)


        const endpoint = `https://api.hubapi.com/crm/v3/objects/companies/merge`;

        return axios.post(endpoint, {
            "primaryObjectId": primaryObjectId,
            "objectIdToMerge": objectIdToMerge
        }, axiosConfig);

    }


    
    if (!event.inputFields.companyName) throw new Error('companyName has to be setup in the "Property to include in code" section ');

    const companyName = event.inputFields.companyName;

    const companies = await searchInCompanies(companyName);

    if (companies.data.total === 1) {
        throw new Error(`We found only one company for ${companyName}. There's either no duplicated, or the search criterias are wrong`);
    }


    if (companies.data.total > 2) {

        const portal = await getPortalInfo();

        const errorList = companies.data.results.map(r => {
            return {
                id: r.id,
                name: r.properties.name,
                crmLink: `https://app.hubspot.com/contacts/${portal.data?.portalId}/company/${r.id}`
            }
        });

        throw new Error(`We found more than one match :/, this is an ambigious merge. The results we found are : ${JSON.stringify(errorList)}`);
    }

    // sort the companies by id to put the oldest companies on top on the array
    const companiesSorted = companies.data.results.sort((a, b) => parseInt(b.id) > parseInt(a.id));

    console.table(companiesSorted);

    const oldestCompany = companiesSorted[0].id;

    const newestCompany = companiesSorted[1].id;

    console.log(`Let's merge the company ${oldestCompany} with the duplicate ${newestCompany}`);

    const res = await mergeAcompany(oldestCompany, newestCompany);

    console.log(res.data);

    callback({
        outputFields: {
            email: "email",
            phone: "phone"
        }
    });


}