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
     * @returns {promise}it returns an axios object
     */
    const getPortalInfo = async () => {
        const endpoint = `https://api.hubapi.com/integrations/v1/me`;

        return axios.get(endpoint, axiosConfig);
    }

    
    const domainName = event.inputFields.domainName;

    if (!domainName) throw new Error('domainName is not set, are you sure you put domainName in the "properties to include in code" ? ');


    const portalInfos = await getPortalInfo();

    if (!portalInfos.data) throw new Error(`We couldn't grab your portal infos`);

    const { portalId, timeZone, currency } = portalInfos.data;

    callback({
        outputFields: {
            portalId,
            timeZone,
            currency
        }
    });

}