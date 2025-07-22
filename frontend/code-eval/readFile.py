def read_file(path):
    file = open(path[1:] + '.txt', 'r')

    lines = file.readlines()
    testCases = []
    testCase = []
    counter = 0
    for line in lines:
        if counter % 2 == 0 and counter != 0:
            testCases.append(testCase)
            testCase = []
        line = line.replace("\\n","\n")
        testCase.append(line)
        counter += 1
    testCases.append(testCase)
    file.close()
    return testCases

