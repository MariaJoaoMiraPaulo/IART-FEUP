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
var testIteraction = 1;
var trainIteraction = 1;

// int main
var lossWindows = new cnnutil.Window(800);
var trainAccWindows = new cnnutil.Window(800);
var testAccWindows = new cnnutil.Window(800);
var lossGraph, trainGraph, testGraph;
legend = ['adadelta'];
var net = new convnetjs.Net(); // declared outside -> global variable in window scope

function initGraphs() {
  lossGraph = new cnnvis.MultiGraph(legend);
  trainGraph = new cnnvis.MultiGraph(legend);
  testGraph = new cnnvis.MultiGraph(legend);
}


function initNetwork() {
  initGraphs();

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

function train() {

var trainer = new convnetjs.Trainer(net, {
    learning_rate: 0.01,
    l2_decay: 0.001
  });
  // forward prop the data
  var netx = new convnetjs.Vol(1, 1, 20);
  avloss = 0.0;
  N = train_data.length;
    for (var ix = 0; ix < N; ix++) {
      netx.w = train_data[ix];
      var stats = trainer.train(netx, train_labels[ix]);
      avloss = stats.loss;
      //console.log("loss" + avloss);
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

  if(testIteraction > N1){
    testIteraction=1;
  }

  if(trainIteraction > N2){
    trainIteraction=1;
  }

  var trainer = new convnetjs.Trainer(net, {
    method: 'adadelta',
    l2_decay: 0.001,
    batch_size: 10
  });
  var netx = new convnetjs.Vol(1, 1, 20);

    //netx.w = train_data[trainIteraction];
    //var stats = trainer.train(netx, train_labels[trainIteraction]);
    var avloss=0;

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

function saveNetwork(){

  var json = net.toJSON(); // network outputs all of its parameters into json object
  var netwok_data = JSON.stringify(json); // the entire object is now simply string. You can save this somewhere

  console.log("Saving network ... ");

  $("#network_data").html(netwok_data);
}

function loadNetwork(){

  var network_data =document.getElementById("network_data").value; 
  console.log(network_data);
  var json = JSON.parse(network_data);
  console.log("Loading network ... ");


  net = new convnetjs.Net(); // create an empty network
  net.fromJSON(json); // load all parameters from JSON
  initGraphs();
  setInterval(load_and_step, 0); // lets go!
}
