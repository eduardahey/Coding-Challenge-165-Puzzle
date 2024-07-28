// Source image to chop up
let source;

// Tiles configuration
let tiles = [];
let cols = 5;
let rows = 5;
let w, h;

// Order of tiles
let board = [];

// Loading the image
function preload() {
  source = loadImage("assets/puzzle.png"); // Carrega a imagem antes do setup
}

function setup() {
  createCanvas(400, 400); // Define o tamanho do canvas
  w = width / cols; // Calcula a largura de cada tile
  h = height / rows; // Calcula a altura de cada tile
  
  // Chop up source image into tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w; // Calcula a coordenada x do tile
      let y = j * h; // Calcula a coordenada y do tile
      
      let img = createImage(w, h); // Cria uma imagem para o tile
      img.copy(source, x, y, w, h, 0, 0, w, h); // Copia a parte correspondente da imagem fonte para o tile
      let index = i + j * cols; // Calcula o índice do tile
      board.push(index); // Adiciona o índice ao array do tabuleiro
      let tile = new Tile(index, img); // Cria um novo tile
      tiles.push(tile); // Adiciona o tile ao array de tiles
    }
  }
  
  // Remove the last tile
  tiles.pop(); // Remove o último tile
  board.pop(); // Remove o último índice do tabuleiro
  board.push(-1); // Adiciona -1 para representar a posição vazia
  
  // Shuffle the board
  simpleShuffle(board); // Embaralha o tabuleiro
}

// Swap two elements of an array
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Pick a random spot to attempt a move
// This should be improved to select from only valid moves
function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  move(r1, r2, arr);
}

// Shuffle the board
function simpleShuffle(arr) {
  for (let i = 0; i < 100000; i++) {
    randomMove(arr); // Chama randomMove várias vezes para embaralhar o tabuleiro
  }
}

// Move based on click
function mousePressed() {
  let i = floor(mouseX / w); // Calcula o índice da coluna clicada
  let j = floor(mouseY / h); // Calcula o índice da linha clicada
  move(i, j, board); // Move a peça baseada no clique do mouse
}

function draw() {
  background(0); // Desenha o fundo do canvas

  // Draw the current board
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) { // Verifica se o índice do tile não é a posição vazia
        let img = tiles[tileIndex].img;
        image(img, x, y, w, h); // Desenha o tile
      }
    }
  }
  
  // Show it as grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      strokeWeight(2);
      noFill();
      rect(x, y, w, h); // Desenha a grade
    }
  }
  
  // If it is solved
  if (isSolved()) {
    console.log("SOLVED"); // Verifica se o quebra-cabeça está resolvido
  }
}

// Check if solved
function isSolved() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true; // Verifica se o quebra-cabeça está resolvido
}

// Swap two pieces
function move(i, j, arr) {
  let blank = findBlank(); // Encontra a posição do tile em branco
  let blankCol = blank % cols; // Calcula a coluna do tile em branco
  let blankRow = floor(blank / rows); // Calcula a linha do tile em branco
  
  // Double check valid move
  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr); // Troca as peças se forem vizinhas
  }
}

// Check if neighbor
function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false; // Verifica se as peças são vizinhas
}

// Probably could just use a variable
// to track blank spot
function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i; // Encontra a posição do tile em branco
  }
}
