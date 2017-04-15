# IART-FEUP - Neural network to rate facial expressions.

## Contributors

1. [Maria João Mira Paulo](https://github.com/MariaJoaoMiraPaulo)
2. [Nuno Miguel Mendes Ramos](https://github.com/pedro-c)
3. [Pedro Duarte da Costa](https://github.com/NunoRamos)


## Index

1. [Intruction](#intruction)
2. [Resources](#resources)
3. [Project Structure](#project-structure)

## Intruction

In this project, we are going to implement a neural network for recognizing Grammatical Facial Expressions (GFEs) used in the Brazilian Sign Language.
To do so we'll use ConvNetJS, a Javascript library, to train a neural network using backpropagation algorithms. 

## Resources
  - [Grammatical Facial Expressions Data Set](http://archive.ics.uci.edu/ml/datasets/Grammatical+Facial+Expressions)
  - [Relevant Paper](http://www.aaai.org/ocs/index.php/FLAIRS/FLAIRS14/paper/viewFile/7788/7821)
  - [ConvNetJS - Javascript library for training Neural Networks](http://cs.stanford.edu/people/karpathy/convnetjs/index.html)
  - [Notes of the Stanford CS class CS231n: Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/)


## Project Structure

### [Convnetjs Demos](https://github.com/NunoRamos/IART-FEUP/tree/master/Convnetjs%20Demos)
Contains a few examples of using Convuntional Neural Networks. ConvNetJS implements Deep Learning models and learning algorithms as well as nice browser-based demos, all in Javascript.

### [GFE Data](https://github.com/NunoRamos/IART-FEUP/tree/master/GFE%20Data)

#### Pre-processed

Pre-processed data in json format.

#### Raw
Grammatical Facial Expressions for Brazilian Sign Language

The dataset is organized in 36 files: 18 datapoint files and 18 target files, one pair for each video which compose the dataset.The name of the file refers to each video: the letter corresponding to the user (A and B), name of grammatical facial expression and a specification (target or datapoints).

Contains:
  - Datapoints files (* _ datapoints.txt): a timestamp (double) and 100 numeric attributes (double)

  - Targets files (* _ targets.txt): a class attribute (interger)

### [Parser](https://github.com/NunoRamos/IART-FEUP/tree/master/Parser)
  Small CLI style node app to convert delimited `.txt` files into `.json`

### [Reports](https://github.com/NunoRamos/IART-FEUP/tree/master/Repors)
  Project reports.

### [webapp](https://github.com/NunoRamos/IART-FEUP/tree/master/webapp)
  Our implementation of a neural network using ConvNetJS to rate facial expressions.
