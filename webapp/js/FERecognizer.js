$(document).ready(function() {
  original_data();

});


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
var iteraction = 0;

// int main
var lossWindows = new cnnutil.Window(800);
var trainAccWindows = new cnnutil.Window(800);
var testAccWindows = new cnnutil.Window(800);
var lossGraph, trainGraph, testGraph;
legend = ['adadelta'];
var net = new convnetjs.Net(); // declared outside -> global variable in window scope

function initNetwork() {
  lossGraph = new cnnvis.MultiGraph(legend);
  trainGraph = new cnnvis.MultiGraph(legend);
  testGraph = new cnnvis.MultiGraph(legend);

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

  //files = ['a_affirmative.json'];
  for (file of train_files) {
    console.log('Loading file ' + file);
    load_JSON(file, prepare_train_data);
  }

   for (file of test_files) {
    console.log('Loading file ' + file);
    load_JSON(file, prepare_test_data);
  }

  setTimeout(function() {
    console.log("test_data: ");
    console.log(test_data);
    console.log("train_data: ");
    console.log(train_data);
  }, 5000);
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

function test() {
  console.log(test_data);
  console.log(test_labels);

  var i = 0;
  for (line of test_data) {
    var x = new convnetjs.Vol(1, 1, 20);
    x.w = line;
    var scores = net.forward(x); // pass forward through network
    // scores is now a Vol() of output activations
    console.log('Expected Result: ' + test_labels[i]);
    console.log('Scores:' + scores.w);
    i++;
    scores = null;
  }
}

var load_and_step = function() {
  step_num++;
  iteraction++;
  console.log(iteraction);
  console.log(step_num);
  // train on all networks
  N = data.length;
  var losses = [];
  var trainacc = [];
  testacc = [];

  if(iteraction < N){
    i=iteraction;
  }else{
    iteraction=0;
  }

  var trainer = new convnetjs.Trainer(net, {
    method: 'adadelta',
    l2_decay: 0.001,
    batch_size: 10
  });
  var netx = new convnetjs.Vol(1, 1, 20);

    netx.w = train_data[i];
    var stats = trainer.train(netx, train_labels[i]);


    var yhat = net.getPrediction();
    trainAccWindows.add(yhat === train_labels[i] ? 1.0 : 0.0);
    lossWindows.add(stats.loss);

    var x = new convnetjs.Vol(1, 1, 20);
    x.w = test_data[i];
    net.forward(x); // pass forward through network
    var yhat_test = net.getPrediction();
    testAccWindows.add(yhat_test === test_labels[i] ? 1.0 : 0.0);


  // every 100 iterations also draw

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
