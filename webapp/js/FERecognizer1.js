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
var lossWindows = [];
var trainAccWindows = [];
var testAccWindows = [];
var lossGraph, trainGraph, testGraph;
var activation_function_output;
var number_of_hidden_layers;
var activation_function;
var netx;
var avloss = 0;
var legend = ['neutra', 'affirmative', 'conditional', 'doubt_question', 'emphasis', 'negative', 'relative', 'topics', 'wh_question', 'yn_question'];
var stats;
var net = new convnetjs.Net(); // declared outside -> global variable in window scope 

$(document).ready(function () {
  original_data();
});

function initNetwork() {
  //Shuffles the data while keeping targets synced
  shuffleData();
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
  //Start with a trained network
  //trainNetwork();
  intervalId = setInterval(load_and_step, 0);
}


function setPreferences() {

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

  for (var i = 0; i < legend.length; i++) {
    lossWindows.push(new cnnutil.Window(800));
    trainAccWindows.push(new cnnutil.Window(800));
    testAccWindows.push(new cnnutil.Window(800));
  }

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


  test_length = test_data.length;
  train_length = train_data.length;
  var losses = [];
  var trainacc = [];
  var testacc = [];

  if (testIteraction >= test_length)
    testIteraction = 0;

  if (trainIteraction >= train_length)
    trainIteraction = 0;


  netx = new convnetjs.Vol(1, 1, 20);

  netx.w = train_data[trainIteraction];
  var stats = trainer.train(netx, train_labels[trainIteraction]);
  avloss = stats.loss;

  var yhat = net.getPrediction();
  trainAccWindows[train_labels[testIteraction]].add(yhat === train_labels[trainIteraction] ? 1.0 : 0.0);

  lossWindows[train_labels[trainIteraction]].add(avloss);

  var x = new convnetjs.Vol(1, 1, 20);
  x.w = test_data[testIteraction];
  var scores = net.forward(x); // pass forward through network
  var yhat_test = net.getPrediction();
  testAccWindows[test_labels[testIteraction]].add(yhat_test === test_labels[testIteraction] ? 1.0 : 0.0);
  /*if (yhat_test === test_labels[testIteraction]) {
    console.log("Correct: Result  " + yhat_test + " Expected " + test_labels[testIteraction]);
    console.log(scores.w);
  } else {
    console.log("False: Result " + yhat_test + " Expected " + test_labels[testIteraction]);
    console.log(scores.w);
  }*/

  if (step_num % 300 === 0) {
    for (var i = 0; i < legend.length; i++) {
      if (lossWindows[i].get_average() != -1) {
        losses.push(lossWindows[i].get_average());
      }
      if (lossWindows[i].get_average() != -1) {
        trainacc.push(trainAccWindows[i].get_average());
      }
      if (lossWindows[i].get_average() != -1) {
        testacc.push(testAccWindows[i].get_average());
      }

    }

    lossGraph.add(step_num, losses);
    lossGraph.drawSelf(document.getElementById("lossgraph"));

    trainGraph.add(step_num, trainacc);
    trainGraph.drawSelf(document.getElementById("trainaccgraph"));

    testGraph.add(step_num, testacc);
    testGraph.drawSelf(document.getElementById("testaccgraph"));
  }
}

function saveNetwork() {

  document.getElementById("network_data").innerHTML = "";

  /* network outputs all of its parameters into json object*/
  var json = net.toJSON();

  /* the entire object is now simply string. You can save this somewhere */
  var netwok_data = JSON.stringify(json);

  console.log("Saving network ... ");
  document.getElementById("network_data").innerHTML = netwok_data;
}

function loadNetwork() {

  var network_data = document.getElementById("network_data").value;
  var json = JSON.parse(network_data);
  console.log("Loading network ... ");
  shuffleData();
  /* create an empty network */
  net = new convnetjs.Net();
  net.fromJSON(json);
  /* load all parameters from JSON */
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

function trainNetwork() {
  netx = new convnetjs.Vol(1, 1, 20);

  for (var x = 0; x < 100; x++) {
    for (var i = 0; i < test_data.length; i++) {
      netx.w = train_data[trainIteraction];
      stats = trainer.train(netx, train_labels[trainIteraction]);
      avloss = stats.loss;
      console.log(avloss);
    }
  }
}

function shuffleData() {
  let trainCounter = train_data.length;
  let testCounter = test_data.length
  // While there are elements in the array
  while (trainCounter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * trainCounter);

    // Decrease counter by 1
    trainCounter--;

    // And swap the last element with it
    let temp1 = train_data[trainCounter];
    let temp2 = train_labels[trainCounter];
    train_data[trainCounter] = train_data[index];
    train_data[index] = temp1;
    train_labels[trainCounter] = train_labels[index];
    train_labels[index] = temp2;
  }
  while (testCounter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * testCounter);

    // Decrease counter by 1
    testCounter--;

    // And swap the last element with it
    let temp1 = test_data[testCounter];
    let temp2 = test_labels[testCounter];
    test_data[testCounter] = test_data[index];
    test_data[index] = temp1;
    test_labels[testCounter] = test_labels[index];
    test_labels[index] = temp2;
  }
}