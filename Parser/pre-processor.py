import json
import numpy as np
import os

def angle_between(p1, p2):
    ang1 = np.arctan2(*p1[::-1])
    ang2 = np.arctan2(*p2[::-1])
    return np.rad2deg((ang1 - ang2) % (2 * np.pi))

class Datapoints:
    def __init__(self, d):
        self.__dict__ = d


for fileName in os.listdir("/home/pedroc/Documents/IART-FEUP/GFEData/datapoints/"):
    if fileName.endswith(".txt"):
        file = open("/home/pedroc/Documents/IART-FEUP/GFEData/datapoints/"+fileName, 'r')
        lines = file.readlines()
        file.close()
        for line in lines:
            i = i + 1
            line = line.strip()
            print line