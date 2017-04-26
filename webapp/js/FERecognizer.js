$(document).ready(function() {
  original_data();

});

var N;
var data = [];
var labels = [];
var step_num = 0;

// int main
var lossWindows = new cnnutil.Window(800);
var trainAccWindows = new cnnutil.Window(800);
var testAccWindows = new cnnutil.Window(800);
var lossGraph, trainGraph, testGraph;

var net = new convnetjs.Net(); // declared outside -> global variable in window scope

function initNetwork() {

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
    activation: 'sigmoid'
  });
  layer_defs.push({
    type: 'fc',
    num_neurons: 20,
    activation: 'sigmoid'
  });
  layer_defs.push({
    type: 'fc',
    num_neurons: 20,
    activation: 'sigmoid'
  });
  //layer_defs.push({type:'fc', num_neurons:20, activation:'sigmoid'});
  // a softmax classifier predicting probabilities for two classes: 0,1
  layer_defs.push({
    type: 'softmax',
    num_classes: 10
  });

  // create a net out of it
  net.makeLayers(layer_defs);

  setInterval(load_and_step, 0); // lets go!

}

function original_data() {
  /*  data = [];
    labels = [];*/
  files = ['a_affirmative_datapoints.json', 'a_conditional_datapoints.json', 'a_doubt_question_datapoints.json', 'a_emphasis_datapoints.json',
    'a_negative_datapoints.json', 'a_relative_datapoints.json', 'a_topics_datapoints.json', 'a_wh_question_datapoints.json', 'a_yn_question_datapoints.json',
    'b_affirmative_datapoints.json', 'b_conditional_datapoints.json', 'b_doubt_question_datapoints.json', 'b_emphasis_datapoints.json', 'b_negative_datapoints.json',
    'b_relative_datapoints.json', 'b_topics_datapoints.json', 'b_wh_question_datapoints.json', 'b_yn_question_datapoints.json'
  ];

  //files = ['a_affirmative_datapoints.json'];
  for (file of files) {
    console.log('Loading file ' + file);
    load_JSON(file, prepare_data);
  }

  setTimeout(function() {
    console.log(data);
    console.log(labels);
  }, 3000);
}

function load_JSON(file, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'JSON/' + file, true);

  xobj.onreadystatechange = function() {
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

function test() {
  console.log(data);
  console.log(labels);

  var i = 0;
  for (line of data) {
    var x = new convnetjs.Vol(1, 1, 20);
    x.w = line;
    var scores = net.forward(x); // pass forward through network
    // scores is now a Vol() of output activations
    console.log('Expected Result: ' + labels[i]);
    console.log('Scores:' + scores.w);
    i++;
    scores = null;
  }
}

var load_and_step = function() {
  step_num++;
  // train on all networks
  N = data.length;
  var losses = [];
  var trainacc = [];
  testacc = [];


  var trainer = new convnetjs.Trainer(net, {
    method: 'adadelta',
    l2_decay: 0.001,
    batch_size: 10
  });
  var netx = new convnetjs.Vol(1, 1, 20);
  for (var i = 0; i < N; i++) {

    netx.w = data[i];
    var stats = trainer.train(netx, labels[i]);


    var yhat = net.getPrediction();
    trainAccWindows.add(yhat === labels[i] ? 1.0 : 0.0);
    lossWindows.add(stats.loss);

    var x = new convnetjs.Vol(1, 1, 20);
    x.w = data[i];
    net.forward(x); // pass forward through network
    var yhat_test = net.getPrediction();
    testAccWindows.add(yhat_test === labels[i] ? 1.0 : 0.0);

    // every 100 iterations also draw
    if (step_num % 100 === 0) {
      losses.push(lossWindows[i].get_average());
      trainacc.push(trainAccWindows[i].get_average());
      testacc.push(testAccWindows[i].get_average());
    }

    if (step_num % 100 === 0) {
      lossGraph.add(step_num, losses);
      lossGraph.drawSelf(document.getElementById("lossgraph"));

      trainGraph.add(step_num, trainacc);
      trainGraph.drawSelf(document.getElementById("trainaccgraph"));

      testGraph.add(step_num, testacc);
      testGraph.drawSelf(document.getElementById("testaccgraph"));
    }
  }
}
