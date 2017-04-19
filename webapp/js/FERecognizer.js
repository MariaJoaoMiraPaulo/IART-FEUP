

var net; // declared outside -> global variable in window scope
function start() {
  // this gets executed on startup
  //...
  net = new convnetjs.Net();

  var layer_defs = [];
// input layer of size 1x1x2 (all volumes are 3D)
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:20});
// some fully connected layers
layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
// a softmax classifier predicting probabilities for two classes: 0,1
layer_defs.push({type:'softmax', num_classes:10});

// create a net out of it
var net = new convnetjs.Net();
net.makeLayers(layer_defs);

// the network always works on Vol() elements. These are essentially
// simple wrappers around lists, but also contain gradients and dimensions
// line below will create a 1x1x2 volume and fill it with 0.5 and -1.3
var x = new convnetjs.Vol([0.5, -1.3]);

var probability_volume = net.forward(x);
console.log('probability that x is class 0: ' + probability_volume.w[0]);
// prints 0.50101

var trainer = new convnetjs.Trainer(net, {learning_rate:0.01, l2_decay:0.001});
trainer.train(x, 0);

var probability_volume2 = net.forward(x);
console.log('probability that x is class 0: ' + probability_volume2.w[0]);
// prints 0.50374

}
