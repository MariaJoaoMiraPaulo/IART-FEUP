var N;
/* 3/4 of data in order to train network*/
var train_data = [];
/* 1/4 of data in order to test network*/
var test_data = [];
/* 1/4 of data results in order to train network*/
var train_labels = [];
/* 3/4 of data results in order to test network*/
var test_labels = [];
var step_num = 0;
var testIteraction = 1;
var trainIteraction = 1;
var trainer;
var intervalId;
var learning_rate;
var l1_decay;
var l2_decay;
var batch_size;
var training_method;
var momentum;
var lossWindows;
var trainAccWindows;
var testAccWindows;
var lossGraph, trainGraph, testGraph;
var activation_function_output;
var number_of_hidden_layers;
var activation_function;
var netx;
var avloss = 0;

var net = new convnetjs.Net(); // declared outside -> global variable in window scope 

$(document).ready(function () {
  original_data();
});

function initNetwork() {
  var layer_defs = [];
  setPreferences();
  initGraphs();

  /* Input layer of size 1x1x20, 20 input points (12-distances + 8 angles)*/
  layer_defs.push({
    type: 'input',
    out_sx: 1,
    out_sy: 1,
    out_depth: 20
  });

  /* Fully connected layers */
  for (let i = 0; i < number_of_hidden_layers; i++) {
    layer_defs.push({
      type: 'fc',
      num_neurons: 20,
      activation: activation_function
    });
  }

/* Output layer */
  layer_defs.push({
    type: activation_function_output,
    num_classes: 10
  });

  net.makeLayers(layer_defs);
  setPreferences();
  initTrainer();
  intervalId = setInterval(load_and_step, 0);
}


function setPreferences(){

  activation_function_output = $('#activation-function-for-output-layer').val();
  number_of_hidden_layers = $('#hidden-layers').val();
  activation_function = $('#activation-function').val();
  learning_rate = $('#learning-rate').val();  
  l1_decay = $('#l1-decay').val();
  l2_decay = $('#l2-decay').val();
  batch_size = $('#batch-size').val();
  training_method = $('#training-method').val();
  momentum = $('#momentum').val();
}

function initGraphs() {

  lossWindows = new cnnutil.Window(800);
  trainAccWindows = new cnnutil.Window(800);
  testAccWindows = new cnnutil.Window(800);
  lossGraph, trainGraph, testGraph;

  if (training_method)
    legend = [training_method];
  else legend = ['adadelta'];

  lossGraph = new cnnvis.MultiGraph(legend);
  trainGraph = new cnnvis.MultiGraph(legend);
  testGraph = new cnnvis.MultiGraph(legend);
}

function initTrainer() {
  if (training_method == 'sgd') {
    trainer = new convnetjs.Trainer(net, {
      method: 'sgd',
      learning_rate: learning_rate,
      l2_decay: l2_decay,
      momentum: momentum,
      batch_size: batch_size,
      l1_decay: l1_decay
    });
  } else {
    trainer = new convnetjs.Trainer(net, {
      method: training_method,
      l2_decay: l2_decay,
      batch_size: batch_size
    });
  }
}

function original_data() {
  train_files = ['train/a_affirmative.json', 'train/a_conditional.json',
    'train/a_doubt_question.json', 'train/a_emphasis.json',
    'train/a_negative.json', 'train/a_relative.json', 'train/a_topics.json',
    'train/a_wh_question.json', 'train/a_yn_question.json',
    'train/b_affirmative.json', 'train/b_conditional.json',
    'train/b_doubt_question.json', 'train/b_emphasis.json', 'train/b_negative.json',
    'train/b_relative.json', 'train/b_topics.json',
    'train/b_wh_question.json', 'train/b_yn_question.json'
  ];


  test_files = ['test/a_affirmative.json', 'test/a_conditional.json',
    'test/a_doubt_question.json', 'test/a_emphasis.json',
    'test/a_negative.json', 'test/a_relative.json', 'test/a_topics.json',
    'test/a_wh_question.json', 'test/a_yn_question.json',
    'test/b_affirmative.json', 'test/b_conditional.json',
    'test/b_doubt_question.json', 'test/b_emphasis.json', 'test/b_negative.json',
    'test/b_relative.json', 'test/b_topics.json',
    'test/b_wh_question.json', 'test/b_yn_question.json'
  ];


  for (file of train_files)
    load_JSON(file, prepare_train_data);

  for (file of test_files)
    load_JSON(file, prepare_test_data);

  setTimeout(function () {
    console.log("Loaded data");
  }, 5000);
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

function prepare_train_data(response) {
  jsonResponse = JSON.parse(response);


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
    train_data.push(lineData);
    train_labels.push(label);
  }
}


function prepare_test_data(response) {
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
    test_data.push(lineData);
    test_labels.push(label);
  }
}

function load_and_step() {
  step_num++;
  testIteraction++;
  trainIteraction++;
  
  // train on all networks
  N1 = test_data.length;
  N2 = train_data.length;
  var losses = [];
  var trainacc = [];
  testacc = [];


  if (testIteraction > N1) {
    testIteraction = 1;
  }

  if (trainIteraction > N2) {
    trainIteraction = 1;
  }


  netx = new convnetjs.Vol(1, 1, 20);

  netx.w = train_data[trainIteraction];
  var stats = trainer.train(netx, train_labels[trainIteraction]);
  avloss = stats.loss;
  // console.log("loss" + avloss);
  var yhat = net.getPrediction();
  trainAccWindows.add(yhat === train_labels[trainIteraction] ? 1.0 : 0.0);

  lossWindows.add(avloss);

  var x = new convnetjs.Vol(1, 1, 20);
  x.w = test_data[testIteraction];
  var scores = net.forward(x); // pass forward through network
  var yhat_test = net.getPrediction();
  testAccWindows.add(yhat_test === test_labels[testIteraction] ? 1.0 : 0.0);
  if (yhat_test === test_labels[testIteraction]) {
    console.log("CORRECT:");
    console.log(yhat_test);
    console.log(scores.w);
    console.log(test_labels[testIteraction]);
  } else {
    console.log("FALSE:");
    console.log(yhat_test);
    console.log(scores.w);
    console.log(test_labels[testIteraction]);
  }


  losses.push(lossWindows.get_average());
  trainacc.push(trainAccWindows.get_average());
  testacc.push(testAccWindows.get_average());

  lossGraph.add(step_num, losses);
  lossGraph.drawSelf(document.getElementById("lossgraph"));

  trainGraph.add(step_num, trainacc);
  trainGraph.drawSelf(document.getElementById("trainaccgraph"));

  testGraph.add(step_num, testacc);
  testGraph.drawSelf(document.getElementById("testaccgraph"));

}

function saveNetwork() {

  document.getElementById("network_data").innerHTML = "";

  var json = net.toJSON(); // network outputs all of its parameters into json object
  var netwok_data = JSON.stringify(json); // the entire object is now simply string. You can save this somewhere

  console.log("Saving network ... ");
  document.getElementById("network_data").innerHTML = netwok_data;
}

function loadNetwork() {

  var network_data = document.getElementById("network_data").value;
  var json = JSON.parse(network_data);
  console.log("Loading network ... ");

  net = new convnetjs.Net(); // create an empty network
  net.fromJSON(json); // load all parameters from JSON
  initGraphs();

  trainer = new convnetjs.Trainer(net, {
    method: 'adadelta',
    l2_decay: 0.01,
    batch_size: 10
  });

  intervalId = setInterval(load_and_step, 0);
}

function stopNetwork() {
  console.log("Stoping Network...");
  clearInterval(intervalId);
}