$(document).ready(function () {
  // Call to function with anonymous callback
  loadJSON(function(response) {

    jsonresponse = JSON.parse(response);

    console.log(jsonresponse.length);
    console.log(jsonresponse[0]);
    console.log(jsonresponse[0]);

    for(var k in jsonresponse[0]){
      console.log(k);
    }

    console.log('boa tarde');

  });
});


function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'JSON/a_affirmative_datapoints.json', true);

  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {

      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(xobj.responseText);

    }
  }
  xobj.send(null);

  console.log('bom dia');

}
