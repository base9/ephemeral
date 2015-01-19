angular.module('radar')
.factory('DateTimeFactory', function() {
  var dateTimeObj = {};
  var ampm;
  var time;
  var startDate;
  var endDate;
  var startAMPM;
  var endAMPM;

  dateTimeObj.get24Hours = function(hours, ampm) {
    if (ampm === "AM" && hours === "12") { return 0; }
    return ampm === "AM" ? hours : hours + 12;
  };

  dateTimeObj.getAMPM = function(hours) {
    hours > -1 && hours < 12 ? ampm = "AM" : ampm = "PM";
    return ampm;
  };

  dateTimeObj.getTwelveHours = function(hours) {
    if (hours > 12 || hours === 0) {
      hours = Math.abs(hours-12);
    }
    return hours;
  };

  dateTimeObj.combineDateTimeInputs = function(obj, startEnd) {
    time = new Date();
    time.setHours(dateTimeObj.get24Hours(obj[startEnd].hours, obj[startEnd].ampm));
    time.setMinutes(obj[startEnd].minutes);
    time.setDate(obj[startEnd].day);
    time.setMonth(obj[startEnd].month);
    time.setYear(obj[startEnd].year);

    return Date.parse(time);
  };

  dateTimeObj.getDateTime = function() {
    startDate = new Date();
    endDate = new Date();
    endDate.setHours(endDate.getHours()+2);

    startAMPM = dateTimeObj.getAMPM(startDate.getHours());
    endAMPM = dateTimeObj.getAMPM(endDate.getHours());
    
    return {
      start: {
        month: startDate.getMonth(),
        day: startDate.getDate(),
        hours: dateTimeObj.getTwelveHours(startDate.getHours()),
        minutes: Math.floor(startDate.getMinutes()/15)*15,
        ampm: startAMPM,
        year: 2015,
      },
      end: {
        month: endDate.getMonth(),
        day: endDate.getDate(),
        hours: dateTimeObj.getTwelveHours(endDate.getHours()),
        minutes: Math.floor(startDate.getMinutes()/15)*15,
        ampm: endAMPM,
        year: 2015
      }
    };   
  };

  dateTimeObj.isoDateToTimeString = function(date) {
    date = new Date(date);
    var hours = date.getHours();
    var mins = date.getMinutes();
    var ampm;
    mins === 0 ? mins = ':00' : mins = ':' + mins;
    hours > 11 ? ampm = 'pm' : ampm = 'am';
    if (hours > 12 || hours === 0) {
      hours = Math.abs(hours-12);
    }
    return hours+mins+ampm;
  };

  return dateTimeObj;
});

