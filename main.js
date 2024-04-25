const inputText = document.getElementById('input');
const PADDING = 10;
const VGAP = 30;
const NODE_DIAMETER = 20;

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
    for (let i = 0; i < node.children.length; i++) {
        size += updateSize(node.children[i]) + PADDING;
    }
    node.size = size;
    return size;
}

function updateDisplay(node, x, y) {
    if (node.children.length == 0) {
        drawNode(node, x, y);
        return;
    }
    if (node.children.length == 1) {
        line(x, y, x, y + VGAP);
        updateDisplay(node.children[0], x, y + VGAP);
        drawNode(node, x, y);
        return; 
    }
    let childrenSizeSum = -PADDING;
    for (const child of node.children) {
        childrenSizeSum += child.size + PADDING;
    }
    let xacc = x - childrenSizeSum/2;
    for (const child of node.children) {
        xacc += child.size/2;
        line(x, y, xacc, y + VGAP);
        updateDisplay(child, xacc, y + VGAP);
        xacc += child.size/2 + PADDING;
    }
    drawNode(node, x, y);
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
    createCanvas(500,500);
    stroke(255);
    fill(255);
    textSize(17);
    textAlign(CENTER, CENTER);
    background(0);
}

function keyPressed() {
    if (keyCode != 13) {
        return;
    }
    let word = inputText.value;
    if (word == '') {
        return;
    }
    if (!words.has(word)) {
        addToTrie(word);
    }
    words.add(word);
    inputText.value = '';
    background(0);
    updateSize(trie);
    updateDisplay(trie, width/2, VGAP);
}