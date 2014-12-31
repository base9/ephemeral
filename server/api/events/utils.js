// any requirements?  

module.exports = {
  //addRecord: addRecord,
  sendResponse: sendResponse
}


function addRecord(params){

};

function queryDb(params){

};

function parseKimonoJSON(req,res){

};

function parseEventbriteJSON(res){

};

function validateRecord(params){

};

function sendResponse(record, res){
  if(record){
    res.json(record);
  } else {
    res.status(404).end();
  }
}