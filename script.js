// Bisswiz Card Game

// ===== Constants =====
const SUITS = ['♠', '♥', '♦', '♣'];
const SUIT_NAMES = { '♠': 'Spades', '♥': 'Hearts', '♦': 'Diamonds', '♣': 'Clubs' };
const SUIT_COLORS = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const RANK_VALUES = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };
const WINNING_SCORE = 500;
const TOTAL_TRICKS = 13;

// ===== Game State =====
let game = null;

// ===== Card Helpers =====
function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank, value: RANK_VALUES[rank] });
        }
    }
    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function sortHand(hand) {
    const suitOrder = { '♠': 0, '♥': 1, '♦': 2, '♣': 3 };
    hand.sort((a, b) => {
        if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
        return a.value - b.value;
    });
}

// ===== Scoring =====
/**
 * Bisswiz scoring rules:
 *   bid === 13 AND tricks === 13  → +260
 *   bid === 13 AND tricks < 13   → −260
 *   bid < 13  AND tricks >= bid  → +10 × bid
 *   bid < 13  AND tricks < bid   → −10 × bid
 * Over-tricks beyond your bid give no bonus.
 */
function calculateScore(bid, tricks) {
    if (bid === 13) {
        return tricks === 13 ? 260 : -260;
    }
    return tricks >= bid ? 10 * bid : -(10 * bid);
}

// ===== Trick Logic =====
function cardBeats(card, other, ledSuit, trumpSuit) {
    const cardTrump = card.suit === trumpSuit;
    const otherTrump = other.suit === trumpSuit;
    if (cardTrump && !otherTrump) return true;
    if (!cardTrump && otherTrump) return false;
    if (card.suit === other.suit) return card.value > other.value;
    // card is not trump, not same suit as other → can't beat
    if (card.suit === ledSuit) return true;
    return false;
}

function getTrickWinner(trick, ledSuit, trumpSuit) {
    let winner = trick[0];
    for (let i = 1; i < trick.length; i++) {
        if (cardBeats(trick[i].card, winner.card, ledSuit, trumpSuit)) {
            winner = trick[i];
        }
    }
    return winner;
}

function isValidPlay(card, hand, ledSuit) {
    if (!ledSuit) return true;
    if (card.suit === ledSuit) return true;
    return !hand.some(c => c.suit === ledSuit);
}

// ===== AI =====
function aiCalculateBid(hand, trumpSuit) {
    let bid = 0;
    for (const card of hand) {
        if (card.value === 14) bid++;                               // Aces
        else if (card.value === 13) bid++;                          // Kings
        else if (card.suit === trumpSuit && card.value >= 10) bid++; // Trump face cards
    }
    return Math.min(bid, 13);
}

function aiChooseCard(player, trick, ledSuit, trumpSuit, numPlayers) {
    const valid = player.hand.filter(c => isValidPlay(c, player.hand, ledSuit));

    if (trick.length === 0) {
        // Leading: play highest card in a strong suit, prefer trump if many
        const trumpCards = valid.filter(c => c.suit === trumpSuit);
        const nonTrump = valid.filter(c => c.suit !== trumpSuit);
        const pool = nonTrump.length > 0 ? nonTrump : trumpCards;
        return pool.reduce((best, c) => c.value > best.value ? c : best);
    }

    const currentWinner = getTrickWinner(trick, ledSuit, trumpSuit);
    const aiWinning = currentWinner.playerIdx === player.idx;

    if (!aiWinning) {
        // Try to win with lowest winning card
        const winners = valid.filter(c => cardBeats(c, currentWinner.card, ledSuit, trumpSuit));
        if (winners.length > 0) {
            return winners.reduce((min, c) => c.value < min.value ? c : min);
        }
    }
    // Can't win or already winning: play lowest card
    return valid.reduce((min, c) => c.value < min.value ? c : min);
}

// ===== Game Object Factory =====
function createGame(numPlayers, humanName) {
    const names = [humanName || 'You', 'Alice', 'Bob', 'Carol'];
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push({
            idx: i,
            name: i === 0 ? (humanName || 'You') : names[i],
            isHuman: i === 0,
            hand: [],
            bid: null,
            tricks: 0,
            score: 0,
        });
    }
    return {
        numPlayers,
        players,
        trumpSuit: null,
        trick: [],          // {card, playerIdx}
        ledSuit: null,
        currentPlayer: 0,
        leadPlayer: 0,
        trickNumber: 0,     // 0-based, increments after each trick completes
        roundNumber: 0,
        phase: 'setup',     // setup | bidding | playing | roundEnd | gameOver
        biddingTurn: 0,     // which player's turn to bid (index into players)
        log: [],
    };
}

function addLog(msg) {
    if (!game) return;
    game.log.unshift(msg);
    if (game.log.length > 60) game.log.length = 60;
}

// ===== Round Setup =====
function startRound() {
    game.roundNumber++;
    game.trickNumber = 0;
    game.trick = [];
    game.ledSuit = null;

    // Choose random trump
    game.trumpSuit = SUITS[Math.floor(Math.random() * SUITS.length)];

    // Deal cards
    const deck = shuffle(createDeck());
    for (const p of game.players) {
        p.hand = deck.splice(0, TOTAL_TRICKS);
        p.bid = null;
        p.tricks = 0;
        sortHand(p.hand);
    }

    // Starting player rotates each round
    game.leadPlayer = (game.roundNumber - 1) % game.numPlayers;
    game.currentPlayer = game.leadPlayer;
    game.biddingTurn = 0; // count of bids placed so far

    game.phase = 'bidding';
    addLog(`Round ${game.roundNumber} — Trump: ${SUIT_NAMES[game.trumpSuit]} ${game.trumpSuit}`);

    render();
    processAITurn();
}

// ===== Bidding =====
function placeBid(bid) {
    const p = game.players[game.currentPlayer];
    p.bid = bid;
    addLog(`${p.name} bids ${bid}`);
    game.biddingTurn++;

    const allBid = game.players.every(pl => pl.bid !== null);
    if (allBid) {
        game.phase = 'playing';
        game.currentPlayer = game.leadPlayer;
        addLog('All bids placed — play begins!');
        render();
        processAITurn();
    } else {
        game.currentPlayer = (game.currentPlayer + 1) % game.numPlayers;
        render();
        processAITurn();
    }
}

// ===== Card Play =====
function playCard(playerIdx, cardIdx) {
    if (game.phase !== 'playing') return;
    if (playerIdx !== game.currentPlayer) return;

    const p = game.players[playerIdx];
    const card = p.hand[cardIdx];
    if (!isValidPlay(card, p.hand, game.ledSuit)) return;

    p.hand.splice(cardIdx, 1);

    if (game.trick.length === 0) game.ledSuit = card.suit;
    game.trick.push({ card, playerIdx });
    addLog(`${p.name} plays ${card.rank}${card.suit}`);

    render();

    if (game.trick.length === game.numPlayers) {
        setTimeout(evaluateTrick, 900);
    } else {
        game.currentPlayer = (game.currentPlayer + 1) % game.numPlayers;
        render();
        processAITurn();
    }
}

function evaluateTrick() {
    const winner = getTrickWinner(game.trick, game.ledSuit, game.trumpSuit);
    game.players[winner.playerIdx].tricks++;
    game.trickNumber++;

    addLog(`↳ ${game.players[winner.playerIdx].name} wins trick ${game.trickNumber}`);

    game.trick = [];
    game.ledSuit = null;
    game.currentPlayer = winner.playerIdx;

    if (game.trickNumber === TOTAL_TRICKS) {
        endRound();
    } else {
        render();
        processAITurn();
    }
}

// ===== Round End =====
function endRound() {
    game.phase = 'roundEnd';

    for (const p of game.players) {
        const delta = calculateScore(p.bid, p.tricks);
        p.score += delta;
        addLog(`${p.name}: bid ${p.bid}, got ${p.tricks} → ${delta >= 0 ? '+' : ''}${delta} (total ${p.score})`);
    }

    const contenders = game.players.filter(p => p.score >= WINNING_SCORE);
    if (contenders.length > 0) {
        game.phase = 'gameOver';
    }

    render();
}

// ===== AI Turn Dispatcher =====
function processAITurn() {
    const p = game.players[game.currentPlayer];
    if (!p || p.isHuman) return;

    if (game.phase === 'bidding') {
        setTimeout(() => {
            const bid = aiCalculateBid(p.hand, game.trumpSuit);
            placeBid(bid);
        }, 500);
    } else if (game.phase === 'playing') {
        setTimeout(() => {
            const card = aiChooseCard(p, game.trick, game.ledSuit, game.trumpSuit, game.numPlayers);
            const idx = p.hand.indexOf(card);
            playCard(game.currentPlayer, idx);
        }, 700);
    }
}

// ===== Rendering =====
function render() {
    renderTrump();
    renderScoreboard();
    renderOpponents();
    renderTrickArea();
    renderPlayerHand();
    renderBiddingPanel();
    renderStatusBar();
    renderRoundSummary();
    renderGameOver();
    renderLog();
}

function renderTrump() {
    const el = document.getElementById('trump-display');
    if (!game || !game.trumpSuit) { el.textContent = ''; return; }
    el.innerHTML = `Trump: <span style="color:${SUIT_COLORS[game.trumpSuit] === 'red' ? '#ff6b6b' : '#fff'}">${SUIT_NAMES[game.trumpSuit]} ${game.trumpSuit}</span>`;
}

function renderScoreboard() {
    const el = document.getElementById('scoreboard');
    if (!game) { el.innerHTML = ''; return; }

    el.innerHTML = game.players.map(p => {
        const classes = ['score-card'];
        if (p.isHuman) classes.push('human');
        if (p.idx === game.currentPlayer && game.phase !== 'roundEnd' && game.phase !== 'gameOver') {
            classes.push('active-player');
        }
        const bidText = p.bid !== null
            ? `bid ${p.bid} | got ${p.tricks}`
            : (game.phase === 'bidding' ? 'bidding…' : '');
        return `<div class="${classes.join(' ')}">
            <div class="score-name">${escHtml(p.name)}</div>
            <div class="score-value">${p.score}</div>
            <div class="score-bid">${bidText}</div>
        </div>`;
    }).join('');
}

function renderOpponents() {
    const el = document.getElementById('opponents-area');
    if (!game) { el.innerHTML = ''; return; }

    const opponents = game.players.filter(p => !p.isHuman);
    el.innerHTML = opponents.map(p => {
        const backs = p.hand.map(() => `<span class="card-back"></span>`).join('');
        return `<div class="opponent-slot">
            <div class="opponent-name">${escHtml(p.name)}</div>
            <div class="card-backs">${backs}</div>
        </div>`;
    }).join('');
}

function renderTrickArea() {
    const cardsEl = document.getElementById('trick-cards');
    const labelEl = document.getElementById('trick-label');
    if (!game) { cardsEl.innerHTML = ''; return; }

    const trickNum = Math.min(game.trickNumber + 1, TOTAL_TRICKS);
    labelEl.textContent = `Trick ${trickNum} of ${TOTAL_TRICKS}`;

    if (game.trick.length === 0) {
        cardsEl.innerHTML = '<span style="opacity:0.4;font-size:0.9em">Waiting for lead…</span>';
        return;
    }

    const winnerEntry = getTrickWinner(game.trick, game.ledSuit, game.trumpSuit);

    cardsEl.innerHTML = game.trick.map(entry => {
        const isWinning = entry === winnerEntry;
        const cardHtml = buildCardHtml(entry.card, ['played-in-trick', isWinning ? 'winning' : '']);
        return `<div class="trick-card-wrap">
            <div class="trick-player-name">${escHtml(game.players[entry.playerIdx].name)}</div>
            ${cardHtml}
        </div>`;
    }).join('');
}

function renderPlayerHand() {
    const handEl = document.getElementById('player-hand');
    const infoEl = document.getElementById('player-info');
    if (!game) { handEl.innerHTML = ''; return; }

    const human = game.players[0];
    const myTurn = game.phase === 'playing' && game.currentPlayer === 0;

    infoEl.textContent = `${human.name} — Score: ${human.score}${human.bid !== null ? ` | Bid: ${human.bid} | Tricks: ${human.tricks}` : ''}`;

    handEl.innerHTML = human.hand.map((card, i) => {
        const playable = myTurn && isValidPlay(card, human.hand, game.ledSuit);
        const classes = playable ? ['playable'] : [];
        return `<div ${playable ? `onclick="onCardClick(${i})"` : ''}>
            ${buildCardHtml(card, classes)}
        </div>`;
    }).join('');
}

function buildCardHtml(card, extraClasses = []) {
    const color = SUIT_COLORS[card.suit];
    const classes = ['card', color, ...extraClasses].filter(c => c).join(' ');
    return `<div class="${classes}">
        <div class="corner-top">${card.rank}<br>${card.suit}</div>
        <div class="center-suit">${card.suit}</div>
    </div>`;
}

function renderBiddingPanel() {
    const panel = document.getElementById('bidding-panel');
    const prompt = document.getElementById('bidding-prompt');
    const btns = document.getElementById('bid-buttons');

    if (!game || game.phase !== 'bidding' || game.players[game.currentPlayer].isHuman === false) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    prompt.textContent = `Your turn to bid — how many tricks will you take? (Trump: ${SUIT_NAMES[game.trumpSuit]} ${game.trumpSuit})`;

    btns.innerHTML = Array.from({ length: 14 }, (_, i) => {
        const special = i === 13;
        return `<button class="bid-btn${special ? ' special' : ''}" onclick="onBidClick(${i})">${i}</button>`;
    }).join('');
}

function renderStatusBar() {
    const el = document.getElementById('status-bar');
    if (!game) { el.textContent = ''; return; }

    if (game.phase === 'bidding') {
        const p = game.players[game.currentPlayer];
        if (!p.isHuman) {
            el.textContent = `${p.name} is bidding…`;
        } else {
            el.textContent = 'Your turn to bid — select a number above.';
        }
    } else if (game.phase === 'playing') {
        const p = game.players[game.currentPlayer];
        if (!p.isHuman) {
            el.textContent = `${p.name} is playing…`;
        } else {
            const canPlay = game.ledSuit
                ? (game.players[0].hand.some(c => c.suit === game.ledSuit) ? `You must follow suit (${SUIT_NAMES[game.ledSuit]})` : 'You may play any card')
                : 'You lead — click a card to play';
            el.textContent = canPlay;
        }
    } else {
        el.textContent = '';
    }
}

function renderRoundSummary() {
    const overlay = document.getElementById('round-summary');
    if (!game || game.phase !== 'roundEnd') {
        overlay.classList.add('hidden');
        return;
    }

    document.getElementById('summary-round').textContent = game.roundNumber;
    const table = document.getElementById('summary-table');
    const maxScore = Math.max(...game.players.map(p => p.score));

    table.innerHTML = `<thead><tr>
        <th>Player</th><th>Bid</th><th>Tricks</th><th>Round</th><th>Total</th>
    </tr></thead><tbody>` +
    game.players.map(p => {
        const delta = calculateScore(p.bid, p.tricks);
        const isLeader = p.score === maxScore;
        return `<tr class="${isLeader ? 'leader-row' : ''}">
            <td>${escHtml(p.name)}${p.isHuman ? ' 👤' : ''}</td>
            <td>${p.bid}</td>
            <td>${p.tricks}</td>
            <td class="${delta >= 0 ? 'score-gain' : 'score-loss'}">${delta >= 0 ? '+' : ''}${delta}</td>
            <td><strong>${p.score}</strong></td>
        </tr>`;
    }).join('') + '</tbody>';

    overlay.classList.remove('hidden');
}

function renderGameOver() {
    const overlay = document.getElementById('gameover-overlay');
    if (!game || game.phase !== 'gameOver') {
        overlay.classList.add('hidden');
        return;
    }

    const winner = game.players.reduce((best, p) => p.score > best.score ? p : best);
    document.getElementById('gameover-title').textContent = winner.isHuman ? '🎉 You Win!' : `${winner.name} Wins!`;
    document.getElementById('gameover-message').textContent =
        `${winner.name} reached ${winner.score} points and wins the game!`;

    const table = document.getElementById('final-table');
    const sorted = [...game.players].sort((a, b) => b.score - a.score);
    table.innerHTML = `<thead><tr><th>Place</th><th>Player</th><th>Score</th></tr></thead><tbody>` +
    sorted.map((p, i) => `<tr class="${i === 0 ? 'leader-row' : ''}">
        <td>${i + 1}</td>
        <td>${escHtml(p.name)}${p.isHuman ? ' 👤' : ''}</td>
        <td><strong>${p.score}</strong></td>
    </tr>`).join('') + '</tbody>';

    overlay.classList.remove('hidden');
}

function renderLog() {
    const el = document.getElementById('game-log');
    if (!game) { el.innerHTML = ''; return; }
    el.innerHTML = game.log.map(e => `<div class="log-entry">${escHtml(e)}</div>`).join('');
}

// ===== Event Handlers =====
function onCardClick(cardIdx) {
    if (!game || game.phase !== 'playing' || game.currentPlayer !== 0) return;
    playCard(0, cardIdx);
}

function onBidClick(bid) {
    if (!game || game.phase !== 'bidding' || game.currentPlayer !== 0) return;
    placeBid(bid);
}

// ===== Utility =====
function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Setup UI =====
document.addEventListener('DOMContentLoaded', () => {
    let selectedPlayerCount = 2;

    // Player count buttons
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPlayerCount = parseInt(btn.dataset.count, 10);
        });
    });

    // Start game
    document.getElementById('startGameBtn').addEventListener('click', () => {
        const name = document.getElementById('playerName').value.trim() || 'You';
        game = createGame(selectedPlayerCount, name);
        switchScreen('game-screen');
        startRound();
    });

    // New game button (in game header)
    document.getElementById('newGameBtn').addEventListener('click', () => {
        switchScreen('setup-screen');
        game = null;
    });

    // Next round button
    document.getElementById('nextRoundBtn').addEventListener('click', () => {
        document.getElementById('round-summary').classList.add('hidden');
        startRound();
    });

    // Play again button
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        document.getElementById('gameover-overlay').classList.add('hidden');
        switchScreen('setup-screen');
        game = null;
    });
});

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
