# HubSpot OperationsHub Custom Coded Action


The idea of this repo is to share Custom Coded Actions which work with HubSpot Operations Hub pro. 
It also provides a "framework" to work locally on your Custom Coded Action and execute it in the same context as HubSpot. 



## How to use

create a .env file at the root of the project with your privateAppToken 

```
privateAppToken = "sdfsd-dsfsdf-wwxcwx-ffdsdfdsf-fsdffdsfs"
```


Create a new folder with your Custom Coded Action, then create a file which will contain your code. 

The template is : 


```JavaScript 
exports.main = async (event, callback) => {

    callback({
        outputFields: {
            'outputOne' : true
        }
    });

}
```

Then create a file called event.js in the same folder. 
The code for this file looks like :

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

Then execute the code by calling : 

```bash
node run.js ./name-of-the-folder/file-name.js 
```


For more confort it can be a good idea to create an alias in your bashrc / .zshrc

example : 
```bash 
cca(){
    node /Users/userName/Documents/code/HubSpot-Operations-Hub-Custom-Coded-Action/run.js $1;   
}
```


