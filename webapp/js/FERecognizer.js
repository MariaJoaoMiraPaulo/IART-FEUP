$(document).ready(function () {
  original_data();

});

var N;
var data = [];
var labels = [];

var net = new convnetjs.Net(); // declared outside -> global variable in window scope

function trainNetwork() {
  // this gets executed on startup
  //...

  var layer_defs = [];
  // input layer of size 1x1x20, 20 pontos de input (12-distancias + 8 angulos)
  layer_defs.push({
    type: 'input',
    out_sx: 1,
    out_sy: 1,
    out_depth: 20
  });
  // some fully connected layers
  layer_defs.push({
    type: 'fc',
    num_neurons: 20,
    activation: 'relu'
  });
  //layer_defs.push({type:'fc', num_neurons:20, activation:'sigmoid'});
  // a softmax classifier predicting probabilities for two classes: 0,1
  layer_defs.push({
    type: 'softmax',
    num_classes: 10
  });

  // create a net out of it
  net.makeLayers(layer_defs);

  var trainer = new convnetjs.Trainer(net, {
    learning_rate: 0.01,
    l2_decay: 0.001
  });
  // forward prop the data
  var netx = new convnetjs.Vol(1, 1, 20);
  avloss = 0.0;
  N = data.length;
  for (var ix = 0; ix < N; ix++) {
    netx.w = data[ix];
    var stats = trainer.train(netx, labels[ix]);
    avloss += stats.loss;
    console.log(avloss);
  }
}

function original_data() {
  /*  data = [];
    labels = [];*/
  files = ['a_affirmative_datapoints.json', 'a_conditional_datapoints.json', 'a_doubt_question_datapoints.json', 'a_emphasis_datapoints.json',
    'a_negative_datapoints.json', 'a_relative_datapoints.json', 'a_topics_datapoints.json', 'a_wh_question_datapoints.json', 'a_yn_question_datapoints.json',
    'b_affirmative_datapoints.json', 'b_conditional_datapoints.json', 'b_doubt_question_datapoints.json', 'b_emphasis_datapoints.json', 'b_negative_datapoints.json',
    'b_relative_datapoints.json', 'b_topics_datapoints.json', 'b_wh_question_datapoints.json', 'b_yn_question_datapoints.json'];

  //files = ['a_affirmative_datapoints.json'];
  for (file of files) {
    console.log('Loading file ' + file);
    load_JSON(file, prepare_data);
  }

  setTimeout(function () {
    console.log(data);
    console.log(labels);
  }, 3000);
}

function load_JSON(file, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'JSON/' + file, true);

  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {

      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(xobj.responseText);

    }
  }
  xobj.send(null);
}

function prepare_data(response) {
  jsonResponse = JSON.parse(response);

  console.log(jsonResponse.length);

  var label;

  for (line of jsonResponse) {
    var lineData = [];
    for (element in line) {

      if (element == 'target') {
        label = line[element];
      } else if (element != 'index') {
        lineData.push(line[element]);
      }
    }
    data.push(lineData);
    labels.push(label);
  }
}
/*
function test(){
  var x = new convnetjs.Vol(1,1,20);
  x.w[0] = 0.9065846950924712;
  x.w[1] = 0.7431822894135484;
  x.w[2] = 1.057387971937015;
  x.w[3] = 0.35112476303914236;
  x.w[4] = 0.5973611729782062;
  x.w[5] = 0.29241697239288705;
  x.w[6] = 0.45789930466823864;
  x.w[7] = 0.21919092451634095;
  x.w[8] = 26.75948000242157;
  x.w[9] = 9.127165715598663;
  x.w[10] = 5.127947055108882;
  x.w[11] = 17.61661695672583;
  x.w[12] = 9.026716789619597;
  x.w[13] = 0.13901438774456015;
  x.w[14] = 48.549585065168166;
  x.w[15] = 32.62042121125966;
  x.w[16] = 12.189843846415746;
  x.w[17] = 16.773005037857704;
  x.w[18] = 5.152003493787622;
  x.w[19] = 8.954682462265186;
// a shortcut for the above is var x = new convnetjs.Vol([0.5, -1.3]);
var scores = net.forward(x); // pass forward through network
// scores is now a Vol() of output activations
console.log('Scores:'  + scores.w);
console.log('Expected Result: 0')

var y = new convnetjs.Vol(1,1,20); 
  y.w[0] = 0.5249305206330519;
  y.w[1] = 1.087375664664462;
  y.w[2] = 1.05387120677727;
  y.w[3] = 0.43314720887515573;
  y.w[4] = 0.497061196283857;
  y.w[5] = 0.2335505493039744;
  y.w[6] = 1.27277081396257;
  y.w[7] = 0.5478535876715201;
  y.w[8] =23.42626997624679;
  y.w[9] = 6.7908616537226125;
  y.w[10] = 3.1276145862301967;
  y.w[11] =11.839522160965814;
  y.w[12] = 6.408958807793978;
  y.w[13] = 0.061619802012007695;
  y.w[14] = 32.663031656599145;
  y.w[15] = 21.342365098554524;
  y.w[16] = 8.151401903967184;
  y.w[17] = 11.876271468773325;
  y.w[18] = 3.2703065605536223;
  y.w[19] = 6.69890267133357;
// a shortcut for the above is var x = new convnetjs.Vol([0.5, -1.3]);
var scores_2 = net.forward(y); // pass forward through network
// scores is now a Vol() of output activations
console.log('Scores:'  + scores_2.w);
console.log('Expected Result: 8')

}*/

function test() {
  console.log(data);
  console.log(labels[0]);

  var i = 0;
  for (line of data) {
    var x = new convnetjs.Vol(1, 1, 20);
    x.w = line;
    var scores = net.forward(x); // pass forward through network
    // scores is now a Vol() of output activations
    console.log('Scores:' + scores.w);
    console.log('Expected Result: ' + labels[i]);
    i++; 
    scores = null;
  }
}
