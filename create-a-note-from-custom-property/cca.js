const axios = require('axios');

const axiosConfig = {
    headers: {
        authorization: `Bearer ${process.env.privateAppToken}`
    }
};

if (!process.env.privateAppToken) throw new Error('The private APP token is missing ');


exports.main = async (event, callback) => {


    /*
        {
    "hs_timestamp": "2019-10-30T03:30:17.883Z",
    "hs_note_body": "Spoke with decision maker john",
    "hubspot_owner_id": "11349275740"
    }
    */
    const createNote = (properties) => {

        const endpoint = `https://api.hubapi.com/crm/v3/objects/notes`;

        return axios.post(endpoint, { "properties": properties }, axiosConfig);
    }


    if (!event.inputFields.hubspot_owner_id) throw new Error(' event.inputFields.hubspot_owner_id is not set, are you sure you added the hubspot_owner_id in the "property to include in code" option ? ');

    if (!event.inputFields.latestNote) throw new Error(' event.inputFields.latestNote is not set, are you sure you added the latestNote in the "property to include in code" option ? ');

    if (event.inputFields.latestNote === "") throw new Error(" event.inputFields.latestNote is empty, we can't create empty notes ");

    const noteCreated = await createNote({
        "hs_timestamp": new Date(),
        "hs_note_body": event.inputFields.latestNote,
        "hubspot_owner_id": event.inputFields.hubspot_owner_id
    });

    const { id } = noteCreated.data;


    const associateNoteWithContact = async (noteId, toObjectID) => {

        const endpoint = "https://api.hubapi.com/crm/v3/associations/notes/contacts/batch/create";

        return await axios.post(endpoint, {
            "inputs": [{
                "from": {
                    "id": noteId
                },
                "to": {
                    "id": toObjectID
                },
                "type": "note_to_contact"
            }]
        }, axiosConfig);
    }


    if (!event.inputFields.contactId) throw new Error(' event.inputFields.contactId is not set, are you sure you added the contactId in the "property to include in code" option ? ');

    const res = await associateNoteWithContact(id, event.inputFields.contactId);

    const { status } = res.data;

    callback({
        outputFields: {
            id
        }
    });

}