exports.main = async (event, callback) => {

    const daysRemaining = () => {
        // Create a Date object for the current date
        const currentDate = new Date();
        
        // Create a Date object for the end of the current year
        // by specifying the year, month (0-11), and day (1-31)
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
        
        // Calculate the difference in milliseconds between the two dates
        const diff = endOfYear - currentDate;
        
        // Calculate the number of days by dividing the difference in milliseconds by
        // the number of milliseconds in a day (1000 * 60 * 60 * 24)
        const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        // Return the number of days remaining
        return daysRemaining;
      }


    if (!event.inputFields.dealAmount) throw new Error('dealAmount has to be setup in the "Property to include in code" section ');
    if (!event.inputFields.probability) throw new Error('probability has to be setup in the "Property to include in code" section ');
    if (!event.inputFields.landAndExpand) throw new Error('landAndExpand has to be setup in the "Property to include in code" section ');


    const dealAmount = event.inputFields.dealAmount;

    const probability = event.inputFields.probability;

    const landAndExpand = (event.inputFields.landAndExpand === "true") ? 1.25 : 1;

    /**
        Deal amount * Probability * Days left in the year * Land and expand (1.25 for yes, 1.00 for no)
    */

    const customForecastAmount = (dealAmount * probability * daysRemaining() * landAndExpand)


    callback({
        outputFields: {
            customForecastAmount
        }
    });

}