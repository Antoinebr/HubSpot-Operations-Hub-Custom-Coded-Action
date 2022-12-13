# HubSpot OperationsHub Custom Coded Action


The idea of this repo is to share Custom Coded Actions which work with HubSpot Operations Hub pro. 
It also provides a "framework" to work locally on your Custom Coded Action and execute it in the same context as HubSpot. 



## How to use

create a .env file at the root of the project with your privateAppToken 

```
privateAppToken = "sdfsd-dsfsdf-wwxcwx-ffdsdfdsf-fsdffdsfs"
```

### Create a new project 


You have to initialize a new project by calling 

```
npm run init <nameOfYourProject>
```

Like :

```
npm run init my-new-custom-coded-action
```

The template created contains a first file name cca.js, this is where you write your code. 



```JavaScript 
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

    if(!domainName) throw new Error('domainName is not set, are you sure you put domainName in the "properties to include in code" ? ');

    const portalInfos = await getPortalInfo();
    
    if(!portalInfos.data) throw new Error(`We couldn't grab the siret infos for ${domainName}`);
    

    callback({
        outputFields: {
            domainName,
        }
    });

}
```

The event.js file represent the properties you can include in code. 


```JavaScript
exports.events = {
    object: {
        objectId: 3401
    },
    inputFields: {
        companyName : "HubSpot"
    }
}
```

In this example to access companyName, you have to use : 

```JavaScript
 const domainName = event.inputFields.domainName;
```

Then execute the code by calling : 

```bash
node run.js ./name-of-the-folder/file-name.js 
```

or 

```bash
npm run cca ./get-siret-from-domain-name/cca.js
```



Or for more confort it can be a good idea to create an alias in your bashrc / .zshrc

example : 
```bash 
cca(){
    node /Users/userName/Documents/code/HubSpot-Operations-Hub-Custom-Coded-Action/run.js $1;   
}
```

Then to invoke the  Custom Coded Action you can just call 

```bash
cca ./merge-companies-based-on-name/cca.js
```


