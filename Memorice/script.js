document.addEventListener("DOMContentLoaded",(event)=>{
  const startButton = document.getElementById("start-game"); 
  startButton.addEventListener("click",startGame); 
});

function startGame() {
  const interval = document.getElementById('time').timer
  clearInterval(interval);
  const numCards = parseInt(document.getElementById('num-cards').value);
  const cards = generateCards(numCards);
  const shuffCards = shuffle(cards);
  const gameTimer = resetGameInfo();
  renderBoard(shuffCards, gameTimer);
}

function generateCards(num) {
  const shapes = ['🔴', '🔵', '🟢', '🟣', '🟠', '🟡', '🟤', '⚫', '⭐', '✨', '🌙', '🌟', '🌞', '🌝', '🌛', '🌈', '⚡', '☀️', '🌪️'];
  const selectedShapes = shapes.slice(0, num / 2);
  return [...selectedShapes, ...selectedShapes].map(shape => ({
    shape,
    matched: false
  }));
}

function shuffle(array) {
  const newArray = [...array]; 
  newArray.forEach((elem, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  });
  return newArray; 
}

function renderBoard(cards, timer) {
  const boardTable = document.getElementById("game-board");
  boardTable.innerHTML = '';
  const columns = 4;
  const rows = Math.ceil(cards.length / columns);

  boardTable.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  boardTable.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', 'hidden');
    cardElement.dataset.index = index;
    cardElement.originalEventListener = cardElement.addEventListener('click', () => handleCardClick(cards, timer)); 
    boardTable.appendChild(cardElement);
  });
}


function handleCardClick(cards, timer) { 
  const allCards = document.querySelectorAll('.card');
  const preFlippedCards = Array.from(allCards).filter(card => card.classList.contains('flipped'));
  const clickedCard = event.target; 
  if (clickedCard.classList.contains("flipped") || clickedCard.classList.contains("match")|| preFlippedCards.length>=2) {
    return;
  }
  clickedCard.classList.add("flipped");
  clickedCard.classList.remove("hidden");
  const cardIndex = parseInt(clickedCard.dataset.index);
  const cardShape = cards[cardIndex].shape;
  clickedCard.textContent = cardShape; 
  const flippedCards = Array.from(allCards).filter(card => card.classList.contains('flipped'));
  if(flippedCards.length == 2){
    const turns = parseInt(document.getElementById('turn-count').textContent);
    document.getElementById('turn-count').textContent = turns+1;
    checkForMatch(flippedCards, timer);
}
}
function checkForMatch(flippedCards, timer) {
  if(flippedCards[0].textContent == flippedCards[1].textContent){
    setTimeout(()=>{
      flippedCards.forEach(card => {
        card.classList.remove("flipped");
        card.classList.add("match");
        card.style.visibility = 'hidden';
        });
    const allCards = document.querySelectorAll('.card');
    const matchedCards = Array.from(allCards);
    if (matchedCards.every(card => card.classList.contains("match"))){
      const turnCount =  document.getElementById('turn-count').textContent;
      const time = document.getElementById('time').textContent;
      clearInterval(timer);
        alert(`You won in ${turnCount} turns and ${time} seconds!`);
    }
    },2000);
}   
  
  else{
    setTimeout(() =>{
    flippedCards.forEach(card => {
    card.classList.remove("flipped");
    card.classList.add("hidden");
    card.textContent = '';
    });
   },2000);
  }
}

function resetGameInfo() {
  const turnCurrent = document.getElementById('turn-count');
  const timeCurrent = document.getElementById('time');
  const turnStart = 0;
  const timeStart = 0;
  timeCurrent.textContent = timeStart;
  turnCurrent.textContent = turnStart;
  const timer = setInterval(() => {
    const time = parseInt(document.getElementById('time').textContent);
    timeCurrent.textContent = time+1;
  }, 1000);
  const gameTime = document.getElementById('time');
  gameTime.timer = timer; 
  return timer;
}
