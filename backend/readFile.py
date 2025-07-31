def read_file(path):
    file = open(path[1:] + '.txt', 'r')

    lines = file.readlines()
    testCases = []
    testCase = []
    for line in lines:
        if ("newtestcase" in line):
            testCases.append(testCase)
            testCase = []
        else:
            line = line.replace("\\n","\n")
            testCase.append(line)
    file.close()
    return testCases

