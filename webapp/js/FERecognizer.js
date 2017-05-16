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
var number_of_neurons;
var netx;
var avloss = 0;
var legend = ['negative', 'conditional', 'emphasis', 'topics', 'yn_question', 'doubt_question', 'affirmative', 'wh_question', 'relative'];
// p            .44          .65           .88        .80         .73             .84              .76            .77           .59
var stats;
var nets = [];
var trainers = [];

$(document).ready(function () {
  original_data();
});

function initNetwork() {
  //Shuffles the data while keeping targets synced
  shuffleData();
  var layer_defs = [];
  setPreferences();
  initGraphs();

  /* Input layer of size 1x1x38, 38 input points (30-distances + 8 angles)*/
  layer_defs.push({
    type: 'input',
    out_sx: 1,
    out_sy: 1,
    out_depth: 38
  });

  /* Fully connected layers */
  for (let i = 0; i < number_of_hidden_layers; i++) {
    layer_defs.push({
      type: 'fc',
      num_neurons: number_of_neurons,
      activation: activation_function
    });
  }

  /* Output layer */
  layer_defs.push({
    type: activation_function_output,
    num_classes: 2
  });

  for(var i=0;i<legend.length;i++) {
    var net = new convnetjs.Net();
    net.makeLayers(layer_defs);
    var trainer = new convnetjs.Trainer(net, {
      method: training_method,
      l2_decay: l2_decay,
      batch_size: batch_size
    });
    nets.push(net); 
    trainers.push(trainer);
  }
  //setPreferences();
  //initTrainer();
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
  number_of_neurons = $('#hidden-layers-neurons').val();

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
    'train/a_wh_question.json', 'train/a_yn_question.json'
  ];


  test_files = ['test/a_affirmative.json', 'test/a_conditional.json',
    'test/a_doubt_question.json', 'test/a_emphasis.json',
    'test/a_negative.json', 'test/a_relative.json', 'test/a_topics.json',
    'test/a_wh_question.json', 'test/a_yn_question.json'
  ];


  for (file of train_files)
    load_JSON(file, prepare_train_data);

  for (file of test_files)
    load_JSON(file, prepare_test_data);

  setTimeout(function () {
    console.log("Loaded data");
    $('#buttons').append('<strong id="data-loaded">Data Loaded</strong>');
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

  var trainData = train_data[trainIteraction];
  var trainLabel = train_labels[trainIteraction];
  var testData = test_data[testIteraction];
  var testLabel = test_labels[testIteraction];
  var trainExpression = trainData.slice(-1)[0] -1;
  var testExpression = testData.slice(-1)[0] -1;

  if(trainLabel != 0)
    trainLabel = 1;

  if(testLabel != 0)
    testLabel = 1;


  netx = new convnetjs.Vol(1, 1, 38);

  netx.w = trainData;
  var stats = trainers[trainExpression].train(netx, trainLabel);
  avloss = stats.loss;

  var yhat = nets[trainExpression].getPrediction();

  console.log(trainLabel);

  var result1 = 0;
  if(yhat === trainLabel){
    result1 = 1;
  }

  var x = new convnetjs.Vol(1, 1, 38);
  x.w = testData;
  var scores = nets[testExpression].forward(x); // pass forward through network
  var yhat_test = nets[testExpression].getPrediction();
  
  var result = 0;
  if(yhat_test === testLabel){
    result=1;
  }
   
  if(trainLabel != 0){
    trainAccWindows[trainExpression].add(result1);
    lossWindows[trainExpression].add(avloss);
  }
  if(testLabel != 0){
    testAccWindows[testExpression].add(result);
  }
  

  if (step_num % 300 === 0) {
    for (var i = 0; i < legend.length; i++) {
      if (lossWindows[i].get_average() != -1) {
        losses.push(lossWindows[i].get_average());
      }
      if (trainAccWindows[i].get_average() != -1) {
        trainacc.push(trainAccWindows[i].get_average());
      }
      if (testAccWindows[i].get_average() != -1) {
        testacc.push(testAccWindows[i].get_average());
      }

    }

    //$('.lossgraph p#neutra').html(lossWindows[0].get_average());
    $('.lossgraph p#affirmative').html(lossWindows[6].get_average());
    $('.lossgraph p#conditional').html(lossWindows[1].get_average());
    $('.lossgraph p#doubt_question').html(lossWindows[5].get_average());
    $('.lossgraph p#emphasis').html(lossWindows[2].get_average());
    $('.lossgraph p#negative').html(lossWindows[0].get_average());
    $('.lossgraph p#relative').html(lossWindows[8].get_average());
    $('.lossgraph p#topics').html(lossWindows[3].get_average());
    $('.lossgraph p#wh_question').html(lossWindows[7].get_average());
    $('.lossgraph p#yn_question').html(lossWindows[4].get_average());

    //$('.trainaccgraph p#neutra').html(trainAccWindows[0].get_average());
    $('.trainaccgraph p#affirmative').html(trainAccWindows[6].get_average());
    $('.trainaccgraph p#conditional').html(trainAccWindows[1].get_average());
    $('.trainaccgraph p#doubt_question').html(trainAccWindows[5].get_average());
    $('.trainaccgraph p#emphasis').html(trainAccWindows[2].get_average());
    $('.trainaccgraph p#negative').html(trainAccWindows[0].get_average());
    $('.trainaccgraph p#relative').html(trainAccWindows[8].get_average());
    $('.trainaccgraph p#wh_question').html(trainAccWindows[7].get_average());
    $('.trainaccgraph p#yn_question').html(trainAccWindows[4].get_average());

    //$('.testaccgraph p#neutra').html(testAccWindows[0].get_average());
    $('.testaccgraph p#affirmative').html(testAccWindows[6].get_average());
    $('.testaccgraph p#conditional').html(testAccWindows[1].get_average());
    $('.testaccgraph p#doubt_question').html(testAccWindows[5].get_average());
    $('.testaccgraph p#emphasis').html(testAccWindows[2].get_average());
    $('.testaccgraph p#negative').html(testAccWindows[0].get_average());
    $('.testaccgraph p#relative').html(testAccWindows[8].get_average());
    $('.testaccgraph p#topics').html(testAccWindows[3].get_average());
    $('.testaccgraph p#wh_question').html(testAccWindows[7].get_average());
    $('.testaccgraph p#yn_question').html(testAccWindows[4].get_average());

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

function stopNetwork() {
  console.log("Stoping Network...");
  clearInterval(intervalId);
}

function resumeNetwork(){
  console.log("Resuming Network...");
  intervalId = setInterval(load_and_step, 0);
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