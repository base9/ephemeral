// any requirements?  

module.exports = {
  //addRecord: addRecord,
  sendResponse: sendResponse
}


//expects a perfectly-formatted record ready to be added to the Events table.
function addEventRecord(params, res){
  var newEvent = new Event(params)
  .save()
  .then(function(){
    console.log('added new event: ' + params.title);
    res.status(201).end();
  });
};

function queryDb(params){

};

function parseKimonoJSON(req,res){

};

function parseEventbriteJSON(res){

};

function validateEventRecord(params, res){

};

function sendResponse(record, res){
  if(record){
    res.json(record);
  } else {
    res.status(404).end();
  }
}