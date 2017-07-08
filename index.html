<html>
<head>
<title>IART</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Bootstrap Core CSS -->
<link href="css/bootstrap.min.css" rel="stylesheet">

<!-- Custom CSS -->
<link href="css/1-col-portfolio.css" rel="stylesheet">


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<!-- import convnetjs library -->
<script src="js/convNet/convnet-min.js"></script>
<script src="js/vis.js"></script>
<script src="js/util.js"></script>
<!-- import convnetjs library -->
<script src="js/convNet/convnet-min.js"></script>
<script src="js/FERecognizer.js"></script>
<link rel="stylesheet" href="vis.min.css">


<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>

</head>

<body>

  <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
          <div class="navbar-header">
              <a class="navbar-brand">Inteligência Artificial Feup</a>
          </div>
      </div>
  </nav>

  <div class="container">

      <!-- Page Heading -->
      <div class="row">
          <div class="col-lg-12">
              <h1 class="page-header">Neural Network
                  <small>for Facial Expressions detection</small>
              </h1>
          </div>
      </div>

      <div class="row">
        <div class="col-lg-6">
          <h4>Training Stuff</h4>
          <br>
          <label>Training method: </label>
          <select id="training-method">
              <option value="adadelta">adadelta</option>
              <option value="sgd">sgd</option>
              <option value="adagrad">adagrad</option>
          </select>
          <br>
          <label>Learning Rate(if you use sgd as a training method): </label>
          <input id="learning-rate" value="0.01"/>
          <br>
          <label>L1-Decay(if you use sgd as a training method): </label>
          <input id="l1-decay" value="0.01"/>
          <br>
          <label>L2-Decay: </label>
          <input id="l2-decay" value="0.01"/>
          <br>
          <label>Batch-Size: </label>
          <input id="batch-size" value="10"/>
          <br>
          <label>Momentum(if you use sgd as a training method): </label>
          <input id="momentum" value="0.9"/>
        </div>
        <div class="col-lg-6">
          <h4>Hidden Layer Stuff</h4>
          <br>
          <label>Number of hidden layers: </label>
          <input id="hidden-layers" value="1"/>
          <br>
          <label>Number of hidden layers neurons: </label>
          <input id="hidden-layers-neurons" value="32"/>
          <br>
          <label>Activation function for hidden layers: </label>
          <select id="activation-function">
              <option value="relu">relu</option>
              <option value="sigmoid">sigmoid</option>
              <option value="tanh">tanh</option>
              <option value="maxout">maxout</option>
          </select>
        </div>

        <div class="col-lg-6">
          <h4>Output Layer Stuff</h4>
          <br>
          <label>Activation function for output layer: </label>
          <select id="activation-function-for-output-layer">
              <option value="softmax">softmax</option>
              <option value="svm">svm</option>
          </select>
        </div>
      </div><hr>
      <div class="row">
        <div id="buttons" class="col-lg-12">
          <button class="btn btn-default" onclick="initNetwork()">Init Network</button>
          <button class="btn btn-default" onclick="stopNetwork()">Stop Network</button>
          <button class="btn btn-default" onclick="resumeNetwork()">Resume Network</button>
          <button class="btn btn-default" onclick="saveNetwork()">Save Network</button>
          <button class="btn btn-default" onclick="loadNetwork()">Load Network</button>
        </div>

        <div class="col-lg-12">
          <br>
          <textarea style="min-height: 200px; width: 100%" id="network_data"></textarea>
        </div>
      </div>

      <br>


      <div class="row">
          <div class="col-md-9">
            <big>Loss vs. Number of examples seen</big>
            <canvas id="lossgraph" width="800" height="400"></canvas>
          </div>
          <div class="col-md-3 lossgraph">
                <h5><strong>neutra </strong></h5><p id="neutra"></p>
                <h5><strong>affirmative </strong></h5><p id="affirmative"></p>
                <h5><strong>conditional </strong></h5><p id="conditional"></p>
                <h5><strong>doubt_question </strong></h5><p id="doubt_question"></p>
                <h5><strong>emphasis </strong></h5><p id="emphasis"></p>
                <h5><strong>negative </strong></h5><p id="negative"></p>
                <h5><strong>relative </strong></h5><p id="relative"></p>
                <h5><strong>topics </strong></h5><p id="topics"></p>
                <h5><strong>wh_question </strong></h5><p id="wh_question"></p>
                <h5><strong>yn_question </strong></h5><p id="yn_question"></p>
          </div>
      </div>
      <hr>

      <div class="row">
          <div class="col-md-9">
            <big>Training Accuracy vs. Number of examples seen</big>
            <canvas id="trainaccgraph" width="800" height="400"></canvas>
          </div>
          <div class="col-md-3 trainaccgraph">
                <h5><strong>neutra </strong></h5><p id="neutra"></p>
                <h5><strong>affirmative </strong></h5><p id="affirmative"></p>
                <h5><strong>conditional </strong></h5><p id="conditional"></p>
                <h5><strong>doubt_question </strong></h5><p id="doubt_question"></p>
                <h5><strong>emphasis </strong></h5><p id="emphasis"></p>
                <h5><strong>negative </strong></h5><p id="negative"></p>
                <h5><strong>relative </strong></h5><p id="relative"></p>
                <h5><strong>topics </strong></h5><p id="topics"></p>
                <h5><strong>wh_question </strong></h5><p id="wh_question"></p>
                <h5><strong>yn_question </strong></h5><p id="yn_question"></p>
          </div>

      </div><hr>

      <div class="row">
          <div class="col-md-9">
            <big>Testing Accuracy vs. Number of examples seen</big>
            <canvas id="testaccgraph" width="800" height="400"></canvas>
          </div>
          <div class="col-md-3 testaccgraph">
                <h5><strong>neutra </strong></h5><p id="neutra"></p>
                <h5><strong>affirmative </strong></h5><p id="affirmative"></p>
                <h5><strong>conditional </strong></h5><p id="conditional"></p>
                <h5><strong>doubt_question </strong></h5><p id="doubt_question"></p>
                <h5><strong>emphasis </strong></h5><p id="emphasis"></p>
                <h5><strong>negative </strong></h5><p id="negative"></p>
                <h5><strong>relative </strong></h5><p id="relative"></p>
                <h5><strong>topics </strong></h5><p id="topics"></p>
                <h5><strong>wh_question </strong></h5><p id="wh_question"></p>
                <h5><strong>yn_question </strong></h5><p id="yn_question"></p>
          </div>

      </div>
  </div>

</body>
</html>
