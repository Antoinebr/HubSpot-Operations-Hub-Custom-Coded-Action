const axios = require('axios');


exports.main = async (event, callback) => {

    /**
     * @name getSiretInfos
     * @desc Grab the SIRET infos from a domain name /!\ data returned are not real ! 
     * @returns {promise} it returns an axios object
     */
    const getSiretInfos = async domainName => {
        const endpoint = `https://partner-app.antoinebrossault.com/api/siret?domainName=${domainName}`;

        return axios.get(endpoint);
    }   


    const domainName = event.inputFields.domainName;

    if(!domainName) throw new Error('domainName is not set, are you sure you put domainName in the "properties to include in code" ? ');

    const siretInfos = await getSiretInfos(event.inputFields.domainName);

    if(!siretInfos.data) throw new Error(`We couldn't grab the siret infos for ${domainName}`);
    

    callback({
        outputFields: {
            domainName,
            siret: siretInfos.data.siret,
            solvabilite: siretInfos.data.solvabilite
        }
    });

}