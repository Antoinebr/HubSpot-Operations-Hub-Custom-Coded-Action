const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

exports.main = async (event, callback) => {

    /**
     * @name getAllUsers
     * @desc grab all the users in the account
     * @returns {promise} axios object 
     */
    const getAllUsers = async () => {

        const endpoint = `https://api.hubapi.com/crm/v3/owners/?limit=400&archived=false`;

        return axios.get(endpoint, axiosConfig);

    }

    /**
     * @name searchInDeals
     * @param {integer} userId 
     * @returns {promise} axios object 
     */
    const searchInDeals = async (userId) => {

        const endpoint = `https://api.hubapi.com/crm/v3/objects/deals/search`;

        return axios.post(endpoint, {
            "filterGroups": [{
                "filters": [

                    // Search a given HubSpot owner id 
                    {
                        "value": userId,
                        "propertyName": "hubspot_owner_id",
                        "operator": "EQ"
                    },

                    // Not in the closewon deal
                    {
                        "value": "closedwon",
                        "propertyName": "dealstage",
                        "operator": "NEQ"
                    }

                ]
            }],
            // properties to include in the response 
            "properties": [
                "hubspot_owner_id",
                "dealname",
                "dealstage"
            ],
        }, axiosConfig);

    }


    const userBusyness = [];


    const users = await getAllUsers();

    for (user of users.data.results) {

        const alldeals = await searchInDeals(user.id);

        userBusyness.push({
            hubspot_owner_id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            numberOfDeals: alldeals.data.results.length
        });

    }

    const sorted = userBusyness.sort((a, b) => a.numberOfDeals > b.numberOfDeals).reverse();

    const leastBusyUser = sorted[0];

    callback({
        outputFields: {
            firstName: leastBusyUser.firstName,
            lastName: leastBusyUser.lastName,
            email: leastBusyUser.email,
            numberOfDeals: leastBusyUser.numberOfDeals,
            hubspot_owner_id: leastBusyUser.hubspot_owner_id
        }
    });

}