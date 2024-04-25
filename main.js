const inputText = document.getElementById('input');
let PADDING = 10;
let VGAP = 30;
let NODE_DIAMETER = 20;
let suffixMode = false;
let showEnd = true;

let words = new Set();

function binarySearch(arr, val) {
    let left = 0;
    let right = arr.length;
    let mid = Math.floor((right - left) / 2) + left;
    while (left < right) {
        if (arr[mid].val < val) {
            left = mid + 1;
        } else {
            right = mid;
        }
        mid = Math.floor((right - left) / 2) + left;
    }
    return mid;
}


function createNode(char) {
    return {
        val : char,
        children : [],
        size : NODE_DIAMETER
    }
}

const trie = createNode('^');

function drawNode(node, x, y) {
    ellipse(x, y, NODE_DIAMETER, NODE_DIAMETER);
    fill(0);
    text(node.val, x, y);
    fill(255);
}

function updateSize(node) {
    if (node.children.length == 0) {
        node.size = NODE_DIAMETER;
        return node.size;
    }
    if (node.children.length == 1) {
        node.size = updateSize(node.children[0]);
        return node.size;
    }
    let size = -PADDING;
    for (const child of node.children) {
        if (!showEnd && child.children.length == 0) {
            continue;
        }
        size += updateSize(child) + PADDING;
    }
    node.size = size;
    return size;
}

function drawTrie(node, x, y) {
    if (node.children.length == 0) {
        drawNode(node, x, y);
        return;
    }
    if (node.children.length == 1) {
        if (showEnd || node.children[0].children.length != 0) {
            line(x, y, x, y + VGAP);
            drawTrie(node.children[0], x, y + VGAP);
        }
        drawNode(node, x, y);
        return; 
    }
    let childrenSizeSum = -PADDING;
    for (const child of node.children) {
        if (!showEnd && child.children.length == 0) {
            continue;
        }
        childrenSizeSum += child.size + PADDING;
    }
    let xacc = x - childrenSizeSum/2;
    for (const child of node.children) {
        if (!showEnd && child.children.length == 0) {
            continue;
        }
        xacc += child.size/2;
        line(x, y, xacc, y + VGAP);
        drawTrie(child, xacc, y + VGAP);
        xacc += child.size/2 + PADDING;
    }
    drawNode(node, x, y);
}

function updateDisplay() {
    background(0);
    updateSize(trie);
    drawTrie(trie, width/2, NODE_DIAMETER/2 + 10);
}

function addToTrie(word) {
    let curr = trie;
    let idx = 0;
    let childIdx = binarySearch(curr.children, word[idx]);
    while (idx < word.length && childIdx < curr.children.length && curr.children[childIdx].val == word[idx]) {
        curr = curr.children[childIdx];
        idx++;
        childIdx = binarySearch(curr.children, word[idx]);
    }
    while (idx < word.length) {
        let node = createNode(word[idx]);
        let sortedIdx = binarySearch(curr.children, word[idx]);
        curr.children.splice(sortedIdx, 0, node);
        curr = curr.children[sortedIdx];
        idx++;
    }
    curr.children.push(createNode('$'));
}

// inputText.addEventListener('keypress', (event) => {
//     if (event.key != "Enter") {
//         return;
//     }
//     let word = inputText.value;
//     if (word == '') {
//         return;
//     }
//     if (!words.has(word)) {
//         addToTrie(word);
//     }
//     words.add(word);
//     inputText.value = '';
// });

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(255);
    fill(255);
    textSize(17);
    textAlign(CENTER, CENTER);
    updateDisplay();
}

function addCurrentInput() {
    let word = inputText.value;
    if (suffixMode) {
        words.clear();
        trie.children = [];
        for (let i = 0, l = word.length; i <= l; i++) {
            if (!words.has(word)) {
                addToTrie(word);
            }
            words.add(word);
            word = word.substring(1);
        }
    } else {
        if (!words.has(word)) {
            addToTrie(word);
        }
        words.add(word);
    }
    inputText.value = '';
    updateDisplay();
}

function keyPressed() {
    if (keyCode != 13) {
        return;
    }
    addCurrentInput();
}

const suffixModeCheck = document.getElementById('suffixmode');
const showEndCheck = document.getElementById('showend');

const node_size = document.getElementById('node_size');
const hgap = document.getElementById('hgap');
const vgap = document.getElementById('vgap');

const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const hideBtn = document.getElementById('hideControls');
const controls = document.getElementById('control');

addBtn.addEventListener('click', addCurrentInput);
clearBtn.addEventListener('click', () => {
    trie.children = [];
    updateDisplay();
});
// refreshBtn.addEventListener('click', updateDisplay);


suffixModeCheck.addEventListener('change', (event) => {
    suffixMode = event.target.checked;
});

node_size.addEventListener('change', (event) => {
    NODE_DIAMETER = parseInt(event.target.value);
    updateDisplay();
});
hgap.addEventListener('change', (event) => {
    PADDING = parseInt(event.target.value);
    updateDisplay();
});
vgap.addEventListener('change', (event) => {
    VGAP = parseInt(event.target.value);
    updateDisplay();
});
showEndCheck.addEventListener('change', (event) => {
    showEnd = event.target.checked;
    updateDisplay();
});

hideBtn.addEventListener('click', () => {
    controls.hidden = !controls.hidden;
});