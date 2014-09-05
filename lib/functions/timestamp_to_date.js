// name: timestamp_to_date
// outputs: 1
// create a new javascript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds
var date = new Date(msg.payload);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = date.getMinutes();
// seconds part from the timestamp
var seconds = date.getSeconds();

// will display time in 10:30:23 format

var formated_date = { "payload" : hours + ':' + minutes + ':' + seconds };

return formated_date;