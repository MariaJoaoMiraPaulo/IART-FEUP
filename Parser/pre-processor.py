import os
import math  # 'math' needed for 'sqrt'
import json


def angle(e, f, g):
    a = [e.x, e.y, e.z]
    b = [f.x, f.y, f.z]
    c = [g.x, g.y, g.z]

    # calculates angle on b
    # a-----c
    # |    /
    # |   /
    # |  /
    # | /
    # |/
    # b

    # Create vectors from points
    ba = [aa-bb for aa,bb in zip(a, b)]
    bc = [cc-bb for cc,bb in zip(c, b)]

    # Normalize vector
    nba = math.sqrt(sum((x ** 2.0 for x in ba)))
    ba = [x/nba for x in ba]

    nbc = math.sqrt(sum((x**2.0 for x in bc)))
    bc = [x/nbc for x in bc]

    # Calculate scalar from normalized vectors
    scalar = sum((aa*bb for aa, bb in zip(ba, bc)))

    # calculate the angle in radian
    return math.acos(scalar)


def distance(p0, p1):
    # change this calculation to include z value, for sided face?
    return math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)


def process_expression(fexpression):

    train = fexpression.datapoints[:int(len(fexpression.datapoints)*3/4)]
    test = fexpression.datapoints[int(len(fexpression.datapoints)*3/4):]

    if not os.path.exists("train/"):
         os.makedirs("train/")
    if not os.path.exists("test/"):
         os.makedirs("test/")

    with open("train/"+fexpression.name.replace(".txt", ".json"), "w+") as outfile:
        expressions = []
        for expression in test:
            expression.points.append(expression.target)
        expressions.append(expression.__dict__)
        print(expressions)
        json.dump(expressions, outfile, sort_keys=True)

    with open("test/"+fexpression.name.replace(".txt", ".json"), "w+") as outfile:
        expressions = []
        for expression in test:
            expression.points.append(expression.target)
        expressions.append(expression.__dict__)
        json.dump(expressions, outfile, sort_keys=True)

    return 1

class Point:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.z = 0


class Datapoints:
    def __init__(self):
        self.frameID = 0
        self.points = []
        self.target = 0
        self.index = 0


class FacialExpressionDatapoints:
    def __init__(self):
        self.name = ""
        self.datapoints = []

class FEoutput:
    def __init__(self):
        self.d1 = 0
        self.d2 = 0
        self.d3 = 0
        self.d4 = 0
        self.d5 = 0
        self.d6 = 0
        self.d7 = 0
        self.d7 = 0
        self.d8 = 0
        self.d10 = 0
        self.d11 = 0
        self.d12 = 0
        self.a1 = 0
        self.a2 = 0
        self.a3 = 0
        self.a4 = 0
        self.a5 = 0
        self.a6 = 0
        self.a7 = 0
        self.a8 = 0
        self.target = 0
        self.index = 0


targets = []

i = 0
j = 0
files = []
for fileName in os.listdir("/home/nuno/Documents/GitHub/IART-FEUP/GFEData/RAW/compressed_data/targets/"):
    targets.append([])
    files.append(fileName)
    if fileName.endswith(".txt"):
        file = open("/home/nuno/Documents/GitHub/IART-FEUP/GFEData/RAW/compressed_data/targets/" + fileName, 'r')
        lines = file.readlines()
        file.close()
        for line in lines:
            if line[0] == "0":
                targets[j].append(0)
            else:
                targets[j].append(i + 1)
        i = i + 1
        j = j + 1
        if i == 9:
            i = 0

f = 0
for fileName in files:
        file = open("/home/nuno/Documents/GitHub/IART-FEUP/GFEData/RAW/compressed_data/datapoints/" + fileName, 'r')
        lines = file.readlines()
        file.close()
        i = 0
        facial_expression = FacialExpressionDatapoints()
        facial_expression.name = fileName
        for line in lines:
            # ignores first line
            if i > 0:
                line = line.split(" ")
                j = 0
                p = Point()
                d = Datapoints()
                for point in line:
                    if j == 0:
                        d.frameID = float(point)
                    if j == 1:
                        if float(point) == 0:
                            p.x = 1
                        else:
                            p.x = float(point)
                    if j == 2:
                        if float(point) == 0:
                            p.y = 1
                        else:
                            p.y = float(point)
                    if j == 3:
                        if float(point) == 0:
                            p.z = 1
                        else:
                            p.z = float(point)
                        d.points.append(p)
                        p = Point()
                        j = 0
                    j = j + 1
                d.target = targets[f][i-1]
                d.index = i
                facial_expression.datapoints.append(d)
            i = i + 1
        f = f+ 1
        process_expression(facial_expression)
