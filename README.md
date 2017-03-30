# IART-FEUP

##Neural network to rate facial expressions.

#####Resources
  - [Grammatical Facial Expressions Data Set](http://archive.ics.uci.edu/ml/datasets/Grammatical+Facial+Expressions)
  - [Relevant Paper](http://www.aaai.org/ocs/index.php/FLAIRS/FLAIRS14/paper/viewFile/7788/7821)
  - [ConvNetJS - Javascript library for training Neural Networks](http://cs.stanford.edu/people/karpathy/convnetjs/index.html)
  

##Project Structure

###Convnetjs Demos
Contains a few examples of using Convuntional Neural Networks. ConvNetJS implements Deep Learning models and learning algorithms as well as nice browser-based demos, all in Javascript.

###GFE Data
Grammatical Facial Expressions for Brazilian Sign Language

The dataset is organized in 36 files: 18 datapoint files and 18 target files, one pair for each video which compose the dataset.The name of the file refers to each video: the letter corresponding to the user (A and B), name of grammatical facial expression and a specification (target or datapoints).

Contains:
  - Datapoints files (* _ datapoints.txt): a timestamp (double) and 100 numeric attributes (double).
	- Targets files (* _ targets.txt): a class attribute (interger)

###Parsed GFE Data
  Contains datapoints and target files in JSON format for further use in the web application.

###text2json Parse
  Small CLI style node app to convert delimited `.txt` files into `.json`

###webapp
  Our implementation of a neural network using ConvNetJS to rate facial expressions.
