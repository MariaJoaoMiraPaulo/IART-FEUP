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
    with open(fexpression.name.replace(".txt", ".json"), "w") as outfile:
        expressions = [];
        for expression in fexpression.datapoints:
            expression_output = FEoutput()
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
            expression_output.a1 = angle(expression.points[37], expression.points[40], expression.points[89])
            expression_output.a2 = angle(expression.points[89], expression.points[43], expression.points[46])
            expression_output.a3 = angle(expression.points[90], expression.points[20], expression.points[30])
            expression_output.a4 = angle(expression.points[20], expression.points[30], expression.points[95])
            expression_output.a5 = angle(expression.points[51], expression.points[48], expression.points[57])
            expression_output.a6 = angle(expression.points[51], expression.points[54], expression.points[57])
            expression_output.a7 = angle(expression.points[51], expression.points[48], expression.points[54])
            expression_output.a8 = angle(expression.points[51], expression.points[54], expression.points[48])
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





for fileName in os.listdir("/home/nuno/Documents/GitHub/IART-FEUP/GFEData/RAW/datapoints/"):
    if fileName.endswith(".txt"):
        file = open("/home/nuno/Documents/GitHub/IART-FEUP/GFEData/RAW/datapoints/" + fileName, 'r')
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
                facial_expression.datapoints.append(d)
            i = i + 1
        process_expression(facial_expression)
