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
        for expression in train:
            expression_output = FEoutput()
            expression_output.index = expression.index
            expression_output.d1 = distance(expression.points[48], expression.points[54])
            expression_output.d2 = distance(expression.points[51], expression.points[57])
            expression_output.d3 = distance(expression.points[62], expression.points[66])
            expression_output.d4 = distance(expression.points[25], expression.points[31])
            expression_output.d5 = distance(expression.points[31], expression.points[47])
            expression_output.d6 = distance(expression.points[25], expression.points[36])
            expression_output.d7 = distance(expression.points[4], expression.points[0])
            expression_output.d8 = distance(expression.points[2], expression.points[6])
            expression_output.d9 = distance(expression.points[23], expression.points[3])
            expression_output.d10 = distance(expression.points[33], expression.points[11])
            expression_output.d11 = distance(expression.points[10], expression.points[14])
            expression_output.d12 = distance(expression.points[8], expression.points[12])
            expression_output.d13 = distance(expression.points[90], expression.points[95])
            expression_output.d14 = distance(expression.points[16], expression.points[26])
            expression_output.d15 = distance(expression.points[30], expression.points[95])
            expression_output.d16 = distance(expression.points[20], expression.points[90])
            expression_output.d17 = distance(expression.points[21], expression.points[4])
            expression_output.d18 = distance(expression.points[24], expression.points[1])
            expression_output.d19 = distance(expression.points[38], expression.points[6])
            expression_output.d20 = distance(expression.points[37], expression.points[46])
            expression_output.d21 = distance(expression.points[32], expression.points[9])
            expression_output.d22 = distance(expression.points[47], expression.points[36])
            expression_output.d23 = distance(expression.points[35], expression.points[12])
            expression_output.d24 = distance(expression.points[45], expression.points[14])
            expression_output.d25 = distance(expression.points[39], expression.points[69])
            expression_output.d26 = distance(expression.points[44], expression.points[85])
            expression_output.d27 = distance(expression.points[53], expression.points[43])
            expression_output.d28 = distance(expression.points[51], expression.points[89])
            expression_output.d29 = distance(expression.points[40], expression.points[49])
            expression_output.d30 = distance(expression.points[77], expression.points[57])
            expression_output.a1 = angle(expression.points[37], expression.points[40], expression.points[89])
            expression_output.a2 = angle(expression.points[89], expression.points[43], expression.points[46])
            expression_output.a3 = angle(expression.points[90], expression.points[20], expression.points[30])
            expression_output.a4 = angle(expression.points[20], expression.points[30], expression.points[95])
            expression_output.a5 = angle(expression.points[51], expression.points[48], expression.points[57])
            expression_output.a6 = angle(expression.points[51], expression.points[54], expression.points[57])
            expression_output.a7 = angle(expression.points[51], expression.points[48], expression.points[54])
            expression_output.a8 = angle(expression.points[51], expression.points[54], expression.points[48])
            expression_output.target = expression.target
            expressions.append(expression_output.__dict__)
        json.dump(expressions, outfile, sort_keys=True)

    with open("test/"+fexpression.name.replace(".txt", ".json"), "w+") as outfile:
        expressions = []
        for expression in test:
            expression_output = FEoutput()
            expression_output.index = expression.index
            expression_output.d1 = distance(expression.points[48], expression.points[54])
            expression_output.d2 = distance(expression.points[51], expression.points[57])
            expression_output.d3 = distance(expression.points[62], expression.points[66])
            expression_output.d4 = distance(expression.points[25], expression.points[31])
            expression_output.d5 = distance(expression.points[31], expression.points[47])
            expression_output.d6 = distance(expression.points[25], expression.points[36])
            expression_output.d7 = distance(expression.points[4], expression.points[0])
            expression_output.d8 = distance(expression.points[2], expression.points[6])
            expression_output.d9 = distance(expression.points[23], expression.points[3])
            expression_output.d10 = distance(expression.points[33], expression.points[11])
            expression_output.d11 = distance(expression.points[10], expression.points[14])
            expression_output.d12 = distance(expression.points[8], expression.points[12])
            expression_output.d13 = distance(expression.points[90], expression.points[95])
            expression_output.d14 = distance(expression.points[16], expression.points[26])
            expression_output.d15 = distance(expression.points[30], expression.points[95])
            expression_output.d16 = distance(expression.points[20], expression.points[90])
            expression_output.d17 = distance(expression.points[21], expression.points[4])
            expression_output.d18 = distance(expression.points[24], expression.points[1])
            expression_output.d19 = distance(expression.points[38], expression.points[6])
            expression_output.d20 = distance(expression.points[37], expression.points[46])
            expression_output.d21 = distance(expression.points[32], expression.points[9])
            expression_output.d22 = distance(expression.points[47], expression.points[36])
            expression_output.d23 = distance(expression.points[35], expression.points[12])
            expression_output.d24 = distance(expression.points[45], expression.points[14])
            expression_output.d25 = distance(expression.points[39], expression.points[69])
            expression_output.d26 = distance(expression.points[44], expression.points[85])
            expression_output.d27 = distance(expression.points[53], expression.points[43])
            expression_output.d28 = distance(expression.points[51], expression.points[89])
            expression_output.d29 = distance(expression.points[40], expression.points[49])
            expression_output.d30 = distance(expression.points[77], expression.points[57])
            expression_output.a1 = angle(expression.points[37], expression.points[40], expression.points[89])
            expression_output.a2 = angle(expression.points[89], expression.points[43], expression.points[46])
            expression_output.a3 = angle(expression.points[90], expression.points[20], expression.points[30])
            expression_output.a4 = angle(expression.points[20], expression.points[30], expression.points[95])
            expression_output.a5 = angle(expression.points[51], expression.points[48], expression.points[57])
            expression_output.a6 = angle(expression.points[51], expression.points[54], expression.points[57])
            expression_output.a7 = angle(expression.points[51], expression.points[48], expression.points[54])
            expression_output.a8 = angle(expression.points[51], expression.points[54], expression.points[48])
            expression_output.target = expression.target
            expressions.append(expression_output.__dict__)
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
for fileName in os.listdir("/Users/mariajoaomirapaulo/Desktop/Joao/Feup_3Ano/IART-FEUP/GFEData/RAW/compressed_data/targets/"):
    targets.append([])
    files.append(fileName)
    if fileName.endswith(".txt"):
        file = open("/Users/mariajoaomirapaulo/Desktop/Joao/Feup_3Ano/IART-FEUP/GFEData/RAW/compressed_data/targets/" + fileName, 'r')
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
        file = open("/Users/mariajoaomirapaulo/Desktop/Joao/Feup_3Ano/IART-FEUP/GFEData/RAW/compressed_data/datapoints/" + fileName, 'r')
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
