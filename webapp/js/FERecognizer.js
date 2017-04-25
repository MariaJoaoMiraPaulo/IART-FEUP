$(document).ready(function() {
  original_data();

});

var N;
var data = [];
var labels = [];

var net = new convnetjs.Net(); // declared outside -> global variable in window scope

function trainNetwork() {

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

  var trainer = new convnetjs.Trainer(net, {
    method: 'adadelta',
    l2_decay: 0.001,
    batch_size: 10
  });
  // forward prop the data
  var netx = new convnetjs.Vol(1, 1, 20);
  avloss = 0.0;
  N = data.length;
  //iterations
  for(var it = 0; it < 200; it++){
    for (var ix = 0; ix < N; ix++) {
      netx.w = data[ix];
      var stats = trainer.train(netx, labels[ix]);
      avloss = stats.cost_loss;
      console.log(avloss);
    }
  }
}

function original_data() {
  /*  data = [];
    labels = [];*/
  files = ['a_affirmative_datapoints.json',  'a_conditional_datapoints.json', 'a_doubt_question_datapoints.json', 'a_emphasis_datapoints.json',
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
  console.log(labels[0]);

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
