var N;
/* 3/4 of data in order to train network*/
var negative_train_data = [];
var conditional_train_data = [];
var emphasis_train_data = [];
var yn_train_data = [];
var doubt_train_data = [];
var aff_train_data = [];
var wh_train_data = [];
var relative_train_data = [];
var topics_train_data = [];

/* 1/4 of data in order to test network*/
var negative_test_data = [];
var conditional_test_data = [];
var emphasis_test_data = [];
var yn_test_data = [];
var doubt_test_data = [];
var aff_test_data = [];
var wh_test_data = [];
var relative_test_data = [];
var topics_test_data = [];

/* 1/4 of data results in order to train network*/
var negative_train_labels = [];
var conditional_train_labels = [];
var emphasis_train_labels = [];
var yn_train_labels = [];
var doubt_train_labels = [];
var aff_train_labels = [];
var wh_train_labels = [];
var relative_train_labels = [];
var topics_train_labels = [];

/* 3/4 of data results in order to test network*/

var negative_test_labels = [];
var conditional_test_labels = [];
var emphasis_test_labels = [];
var yn_test_labels = [];
var doubt_test_labels = [];
var aff_test_labels = [];
var wh_test_labels = [];
var relative_test_labels = [];
var topics_test_labels = [];


var negative_testIteraction = 1;
var negative_trainIteraction = 1;

var conditional_testIteraction = 1;
var conditional_trainIteraction = 1;

var emphasis_testIteraction = 1;
var emphasis_trainIteraction = 1;

var yn_testIteraction = 1;
var yn_trainIteraction = 1;

var doubt_testIteraction = 1;
var doubt_trainIteraction = 1;

var aff_testIteraction = 1;
var aff_trainIteraction = 1;

var wh_testIteraction = 1;
var wh_trainIteraction = 1;

var relative_testIteraction = 1;
var relative_trainIteraction = 1;

var topics_testIteraction = 1;
var topics_trainIteraction = 1;



var step_num = 0;
//var trainer;

/*
//TRAINERS
var negative_trainer;
var conditional_trainer;
var emphasis_trainer;
var yn_question_trainer;
var doubt_question_trainer;
var aff_trainer;
var wh_question_trainer;
var relative_trainer;
var topics_trainer;*/


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
var avloss = 0;


var trainers = [];
var nets = [];
var legend = ['neutra', 'negative', 'conditional', 'emphasis', 'topics', 'yn_question', 'doubt_question', 'affirmative', 'wh_question', 'relative'];
// paper values            .44          .65           .88        .80         .73             .84              .76            .77           .59

/*
//NETWORKS
var negative_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var conditional_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var emphasis_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var yn_question_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var doubt_question_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var aff_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var wh_question_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var relative_net = new convnetjs.Net(); // declared outside -> global variable in window scope
var topics_net = new convnetjs.Net();*/



$(document).ready(function () {
  original_data();
});

function initNetwork() {
  //Shuffles the data while keeping targets synced
  //shuffleData();
  var layer_defs = [];
  setPreferences();
  initGraphs();
  initNetworks();

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

  //net.makeLayers(layer_defs);

  /* Fully connected layers */
  for (let i = 0; i < nets.length; i++) {
    nets[i].makeLayers(layer_defs);
  }

/*
  negative_net.makeLayers(layer_defs);
  conditional_net.makeLayers(layer_defs);
  emphasis_net.makeLayers(layer_defs);
  yn_question_net.makeLayers(layer_defs);
  doubt_question_net.makeLayers(layer_defs);
  aff_net.makeLayers(layer_defs);
  wh_question_net.makeLayers(layer_defs);
  relative_net.makeLayers(layer_defs);
  topics_net.makeLayers(layer_defs);*/

  initTrainer();
  intervalId = setInterval(load_and_step, 0);
}


function initNetworks(){

  for (var i = 0; i < legend.length-1; i++) {
    nets.push(new convnetjs.Net());
  }
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

  for (var i = 0; i < legend.length-1; i++)
  {
    if (training_method == 'sgd') {
      trainers.push( new convnetjs.Trainer(nets[i], {
        method: 'sgd',
        learning_rate: learning_rate,
        l2_decay: l2_decay,
        momentum: momentum,
        batch_size: batch_size,
        l1_decay: l1_decay
      }));
    }
   else {
    trainers.push( new convnetjs.Trainer(nets[i], {
      method: training_method,
      l2_decay: l2_decay,
      batch_size: batch_size
    }));
  }
}

}

function original_data() {

  train_files_negative = ['train/a_negative.json'];
  test_files_negative = ['test/a_negative.json'];

  train_files_conditional = ['train/a_conditional.json'];
  test_files_conditional = ['test/a_conditional.json'];

  train_files_emphasis = ['train/a_emphasis.json'];
  test_files_emphasis = ['test/a_emphasis.json'];

  train_files_yn = ['train/a_yn_question.json'];
  test_files_yn = ['test/a_yn_question.json'];

  train_files_doubt = ['train/a_doubt_question.json'];
  test_files_doubt = ['test/a_doubt_question.json'];

  train_files_aff = ['train/a_affirmative.json'];
  test_files_aff = ['test/a_affirmative.json'];

  train_files_wh = ['train/a_wh_question.json'];
  test_files_wh = ['test/a_wh_question.json'];

  train_files_relative = ['train/a_relative.json'];
  test_files_relative = ['test/a_relative.json'];

  train_files_topics = ['train/a_topics.json'];
  test_files_topics = ['test/a_topics.json'];


  //NEGATIVE
  for (file of train_files_negative)
  load_JSON(file, prepare_negative_train_data);

  for (file of test_files_negative)
  load_JSON(file, prepare_negative_test_data);

  //CONDITIONAL
  for (file of train_files_conditional)
  load_JSON(file, prepare_conditional_train_data);

  for (file of test_files_conditional)
  load_JSON(file, prepare_conditional_test_data);

  //EMPHASIS
  for (file of train_files_emphasis)
  load_JSON(file, prepare_emphasis_train_data);

  for (file of test_files_emphasis)
  load_JSON(file, prepare_emphasis_test_data);

  //YN
  for (file of train_files_yn)
  load_JSON(file, prepare_yn_train_data);

  for (file of test_files_yn)
  load_JSON(file, prepare_yn_test_data);

  //DOUBT
  for (file of train_files_doubt)
  load_JSON(file, prepare_doubt_train_data);

  for (file of test_files_doubt)
  load_JSON(file, prepare_doubt_test_data);

  //AFFIRMATIVE
  for (file of train_files_aff)
  load_JSON(file, prepare_aff_train_data);

  for (file of test_files_aff)
  load_JSON(file, prepare_aff_test_data);

  //WH
  for (file of train_files_wh)
  load_JSON(file, prepare_wh_train_data);

  for (file of train_files_wh)
  load_JSON(file, prepare_wh_test_data);


  //RELATIVE
  for (file of train_files_relative)
  load_JSON(file, prepare_relative_train_data);

  for (file of test_files_relative)
  load_JSON(file, prepare_relative_test_data);

  //TOPICS
  for (file of train_files_topics)
  load_JSON(file, prepare_topics_train_data);

  for (file of test_files_topics)
  load_JSON(file, prepare_topics_test_data);


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

function prepare_negative_train_data(response) {
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
    negative_train_data.push(lineData);
    negative_train_labels.push(label);
  }
}


function prepare_negative_test_data(response) {
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
    negative_test_data.push(lineData);
    negative_test_labels.push(label);
  }
}

function prepare_conditional_train_data(response) {
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
    conditional_train_data.push(lineData);
    conditional_train_labels.push(label);
  }
}


function prepare_conditional_test_data(response) {
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
    conditional_test_data.push(lineData);
    conditional_test_labels.push(label);
  }
}

function prepare_emphasis_train_data(response) {
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
    emphasis_train_data.push(lineData);
    emphasis_train_labels.push(label);
  }
}


function prepare_emphasis_test_data(response) {
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
    emphasis_test_data.push(lineData);
    emphasis_test_labels.push(label);
  }
}

function prepare_yn_train_data(response) {
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
    yn_train_data.push(lineData);
    yn_train_labels.push(label);
  }
}


function prepare_yn_test_data(response) {
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
    yn_test_data.push(lineData);
    yn_test_labels.push(label);
  }
}


function prepare_doubt_train_data(response) {
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
    doubt_train_data.push(lineData);
    doubt_train_labels.push(label);
  }
}


function prepare_doubt_test_data(response) {
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
    doubt_test_data.push(lineData);
    doubt_test_labels.push(label);
  }
}

function prepare_aff_train_data(response) {
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
    aff_train_data.push(lineData);
    aff_train_labels.push(label);
  }
}


function prepare_aff_test_data(response) {
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
    aff_test_data.push(lineData);
    aff_test_labels.push(label);
  }
}


function prepare_wh_train_data(response) {
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
    wh_train_data.push(lineData);
    wh_train_labels.push(label);
  }
}


function prepare_wh_test_data(response) {
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
    wh_test_data.push(lineData);
    wh_test_labels.push(label);
  }
}

function prepare_relative_train_data(response) {
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
    relative_train_data.push(lineData);
    relative_train_labels.push(label);
  }
}


function prepare_relative_test_data(response) {
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
    relative_test_data.push(lineData);
    relative_test_labels.push(label);
  }
}

function prepare_topics_train_data(response) {
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
    topics_train_data.push(lineData);
    topics_train_labels.push(label);
  }
}


function prepare_topics_test_data(response) {
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
    topics_test_data.push(lineData);
    topics_test_labels.push(label);
  }
}

function load_and_step() {

  negative_testIteraction ++;
  negative_trainIteraction ++;

  conditional_testIteraction ++;
  conditional_trainIteraction ++;

  emphasis_testIteraction ++;
  emphasis_trainIteraction ++;

  yn_testIteraction ++;
  yn_trainIteraction ++;

  doubt_testIteraction ++;
  doubt_trainIteraction ++;

  aff_testIteraction ++;
  aff_trainIteraction ++;

  wh_testIteraction ++;
  wh_trainIteraction ++;

  relative_testIteraction ++;
  relative_trainIteraction ++;

  topics_testIteraction++;
  topics_trainIteraction++;

  step_num++;

  var losses = [];
  var trainacc = [];
  var testacc = [];


  if (negative_testIteraction >= negative_test_data.length)
  negative_testIteraction = 0;

  if (negative_trainIteraction >=  negative_train_data.length)
  negative_trainIteraction = 0;

  if (conditional_testIteraction >= conditional_test_data.length)
  conditional_testIteraction = 0;

  if (conditional_trainIteraction >=  conditional_train_data.length)
  conditional_trainIteraction = 0;

  if (emphasis_testIteraction >= emphasis_test_data.length)
  emphasis_testIteraction = 0;

  if (emphasis_trainIteraction >= emphasis_train_data.length)
  emphasis_trainIteraction = 0;

  if (yn_testIteraction >= yn_test_data.length)
  yn_testIteraction = 0;

  if (yn_trainIteraction >= yn_train_data.length)
  yn_trainIteraction = 0;

  if ( doubt_testIteraction >= doubt_test_data.length)
  doubt_testIteraction = 0;

  if (doubt_trainIteraction >= doubt_train_data.length)
  doubt_trainIteraction = 0;

  if (aff_testIteraction >= aff_test_data.length)
  aff_testIteraction = 0;

  if (aff_trainIteraction >= aff_train_data.length)
  aff_trainIteraction = 0;

  if (wh_testIteraction >= wh_test_data.length)
  wh_testIteraction = 0;

  if (wh_trainIteraction >= wh_train_data.length)
  wh_trainIteraction = 0;

  if (relative_testIteraction >= relative_test_data.length)
  relative_testIteraction = 0;

  if (relative_trainIteraction >= relative_train_data.length)
  relative_trainIteraction = 0;

  if (topics_testIteraction >= topics_test_data.length)
  topics_testIteraction = 0;

  if (topics_trainIteraction >= topics_train_data.length)
  topics_trainIteraction = 0;


//var legend = ['neutra', 'negative', 'conditional', 'emphasis', 'topics', 'yn_question', 'doubt_question', 'affirmative', 'wh_question', 'relative'];



  networkTrainingAndTesting( negative_train_data, negative_train_labels, negative_trainIteraction, negative_test_data, negative_test_labels, negative_testIteraction, 1);
  networkTrainingAndTesting( conditional_train_data, conditional_train_labels, conditional_trainIteraction, conditional_test_data, conditional_test_labels, conditional_testIteraction,2);
  networkTrainingAndTesting( emphasis_train_data, emphasis_train_labels, emphasis_trainIteraction, emphasis_test_data, emphasis_test_labels, emphasis_testIteraction,3);
  networkTrainingAndTesting( topics_train_data, topics_train_labels, topics_trainIteraction, topics_test_data, topics_test_labels, topics_testIteraction,4);
  networkTrainingAndTesting( yn_train_data, yn_train_labels, yn_trainIteraction, yn_test_data, yn_test_labels, yn_testIteraction,5);
  networkTrainingAndTesting( doubt_train_data, doubt_train_labels, doubt_trainIteraction, doubt_test_data, doubt_test_labels, doubt_testIteraction,6);
  networkTrainingAndTesting( aff_train_data, aff_train_labels, aff_trainIteraction, aff_test_data, aff_test_labels, aff_testIteraction,7);
  networkTrainingAndTesting( wh_train_data, wh_train_labels, wh_trainIteraction, wh_test_data, wh_test_labels, wh_testIteraction,8);
  networkTrainingAndTesting( relative_train_data, relative_train_labels, relative_trainIteraction, relative_test_data, relative_test_labels, relative_testIteraction,9);


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
    $('.lossgraph p#affirmative').html(lossWindows[7].get_average());
    $('.lossgraph p#conditional').html(lossWindows[2].get_average());
    $('.lossgraph p#doubt_question').html(lossWindows[6].get_average());
    $('.lossgraph p#emphasis').html(lossWindows[3].get_average());
    $('.lossgraph p#negative').html(lossWindows[1].get_average());
    $('.lossgraph p#relative').html(lossWindows[9].get_average());
    $('.lossgraph p#topics').html(lossWindows[4].get_average());
    $('.lossgraph p#wh_question').html(lossWindows[8].get_average());
    $('.lossgraph p#yn_question').html(lossWindows[5].get_average());

  //  $('.trainaccgraph p#neutra').html(trainAccWindows[0].get_average());
    $('.trainaccgraph p#affirmative').html(trainAccWindows[7].get_average());
    $('.trainaccgraph p#conditional').html(trainAccWindows[2].get_average());
    $('.trainaccgraph p#doubt_question').html(trainAccWindows[6].get_average());
    $('.trainaccgraph p#emphasis').html(trainAccWindows[3].get_average());
    $('.trainaccgraph p#negative').html(trainAccWindows[1].get_average());
    $('.trainaccgraph p#relative').html(trainAccWindows[9].get_average());
    $('.trainaccgraph p#topics').html(trainAccWindows[4].get_average());
    $('.trainaccgraph p#wh_question').html(trainAccWindows[8].get_average());
    $('.trainaccgraph p#yn_question').html(trainAccWindows[5].get_average());

  //  $('.testaccgraph p#neutra').html(testAccWindows[0].get_average());
    $('.testaccgraph p#affirmative').html(testAccWindows[7].get_average());
    $('.testaccgraph p#conditional').html(testAccWindows[2].get_average());
    $('.testaccgraph p#doubt_question').html(testAccWindows[6].get_average());
    $('.testaccgraph p#emphasis').html(testAccWindows[3].get_average());
    $('.testaccgraph p#negative').html(testAccWindows[1].get_average());
    $('.testaccgraph p#relative').html(testAccWindows[9].get_average());
    $('.testaccgraph p#topics').html(testAccWindows[4].get_average());
    $('.testaccgraph p#wh_question').html(testAccWindows[8].get_average());
    $('.testaccgraph p#yn_question').html(testAccWindows[5].get_average());

    lossGraph.add(step_num, losses);
    lossGraph.drawSelf(document.getElementById("lossgraph"));

    trainGraph.add(step_num, trainacc);
    trainGraph.drawSelf(document.getElementById("trainaccgraph"));

    testGraph.add(step_num, testacc);
    testGraph.drawSelf(document.getElementById("testaccgraph"));
  }
}

function networkTrainingAndTesting(trainData, trainLabels, trainIteraction, testData, testLabels, testIteraction, expressionNumber){
  //  networkTrainingAndTesting(aff_trainer, aff_train_data, aff_train_labels, aff_trainIteraction, aff_test_data, aff_test_labels, aff_testIteraction, aff_net);

  var netx = new convnetjs.Vol(1, 1, 38);
  netx.w = trainData[trainIteraction];

  console.log(trainers);
  var stats = trainers[expressionNumber-1].train(netx, trainLabels[trainIteraction]);
  avloss = stats.loss;

  var yhat = nets[expressionNumber-1].getPrediction();
  trainAccWindows[expressionNumber].add(yhat == trainLabels[trainIteraction] ? 1.0 : 0.0);

  lossWindows[expressionNumber].add(avloss);

  var x = new convnetjs.Vol(1, 1, 38);
  x.w = testData[testIteraction];

  var scores = nets[expressionNumber-1].forward(x); // pass forward through network
  var yhat_test = nets[expressionNumber-1].getPrediction();
  testAccWindows[expressionNumber].add(yhat_test == testLabels[testIteraction] ? 1.0 : 0.0);
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
  let trainCounter = aff_train_data.length;
  let testCounter = aff_test_data.length
  // While there are elements in the array
  while (trainCounter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * trainCounter);

    // Decrease counter by 1
    trainCounter--;

    // And swap the last element with it
    let temp1 = aff_train_data[trainCounter];
    let temp2 = aff_train_labels[trainCounter];
    aff_train_data[trainCounter] = aff_train_data[index];
    aff_train_data[index] = temp1;
    aff_train_labels[trainCounter] = aff_train_labels[index];
    aff_train_labels[index] = temp2;
  }
  while (testCounter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * testCounter);

    // Decrease counter by 1
    testCounter--;

    // And swap the last element with it
    let temp1 = aff_test_data[testCounter];
    let temp2 = aff_test_labels[testCounter];
    aff_test_data[testCounter] = aff_test_data[index];
    aff_test_data[index] = temp1;
    aff_test_labels[testCounter] = aff_test_labels[index];
    aff_test_labels[index] = temp2;
  }
}
