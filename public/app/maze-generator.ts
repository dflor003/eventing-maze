namespace app {
    export interface IMaze {
        width: number;
        height: number;
        horiz: number[][];
        vert: number[][];
    }

    export function maze(width, height): IMaze {
        var numOpenings = width * height - 1;
        if (numOpenings < 0) {
            throw new Error("illegal maze dimensions");
        }

        var horiz = [],
            vert = [],
            here = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)],
            path = [here],
            unvisited = [];

        for (var j = 0; j < width + 1; j++) {
            vert[j] = [];
            horiz[j] = [];
        }

        for (var j = 0; j < width + 2; j++) {
            unvisited[j] = [];
            for (var k = 0; k < height + 1; k++)
                unvisited[j].push(j > 0 && j < width + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
        }
        while (0 < numOpenings) {
            var potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1],
                [here[0] - 1, here[1]], [here[0], here[1] - 1]];
            var neighbors = [];

            for (var j = 0; j < 4; j++) {
                if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) {
                    neighbors.push(potential[j]);
                }
            }

            if (neighbors.length) {
                numOpenings = numOpenings - 1;
                var next = neighbors[Math.floor(Math.random() * neighbors.length)];
                unvisited[next[0] + 1][next[1] + 1] = false;

                if (next[0] == here[0]) {
                    horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
                }
                else {
                    vert[(next[0] + here[0] - 1) / 2][next[1]] = true;
                }

                path.push(here = next);
            } else {
                here = path.pop();
            }
        }

        return { width: width, height: height, horiz: horiz, vert: vert };
    }

    export function display(m: IMaze) {
        var text = [];
        for (var j = 0; j < m.width * 2 + 1; j++) {
            var line = [];
            if (0 == j % 2)
                for (var k = 0; k < m.height * 4 + 1; k++)
                    if (0 == k % 4)
                        line[k] = '+';
                    else if (j > 0 && m.vert[j / 2 - 1][Math.floor(k / 4)])
                        line[k] = ' ';
                    else
                        line[k] = '-';
            else
                for (var k = 0; k < m.height * 4 + 1; k++)
                    if (0 == k % 4)
                        if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1])
                            line[k] = ' ';
                        else
                            line[k] = '|';
                    else
                        line[k] = ' ';
            if (0 == j) line[1] = line[2] = line[3] = ' ';
            if (m.width * 2 - 1 == j) line[4 * m.height] = ' ';
            text.push(line.join('') + '\r\n');
        }
        return text.join('');
    }
}