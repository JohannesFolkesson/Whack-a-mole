import { Mole } from "./mole.js";

// Centrera eventhantering via delegering på brädet (se vecko-materialet om
// addEventListener & bubbling).

export class Game {
  constructor({ boardEl, scoreEl, timeEl, missesEl, appearedEl }) {
    this.boardEl = boardEl;
    this.scoreEl = scoreEl;
    this.timeEl = timeEl;
    this.missesEl = missesEl;
    this.appearedEl = appearedEl;
    this.gridSize = 3;
    this.duration = 60; // sekunder
   
    this.state = {
      score: 0,
      misses: 0,
      appeared: 0,
      timeLeft: this.duration,
      running: false
    };

    this._tickId = null;
    this._spawnId = null;
    this._activeMoles = new Set();
    this.handleBoardClick = this.handleBoardClick.bind(this);
  }

  init() {
    this.createGrid(this.gridSize);
    this.updateHud();

    // Eventdelegering: en lyssnare hanterar alla barn-noder.
    this.boardEl.addEventListener('click', this.handleBoardClick);
    this.boardEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const cells = Array.from(this.boardEl.querySelectorAll('.cell'));
        const currentIndex = cells.indexOf(document.activeElement);
        let nextIndex;
    if (!e.shiftKey) {
        nextIndex = (currentIndex + 1) % cells.length;
    } else {
       nextIndex = (currentIndex - 1 + cells.length) % cells.length;
    }
      cells[nextIndex].focus();
  }

  if (e.key === 'Enter' || e.key === 'space') {
    e.preventDefault();
    this.handleBoardClick(e);
  }
});

    const cells = this.boardEl.querySelectorAll('.cell');
    cells.forEach(cell => { cell.tabIndex = 0; });
  }

  createGrid(size = 3) {
    this.boardEl.innerHTML = '';
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.setAttribute('aria-label', `Hål ${i + 1}`);
      this.boardEl.appendChild(cell);
    }
  }

  start() {
    if (this.state.running) return;

    this.state.running = true;
    this.state.score = 0;
    this.state.misses = 0;
    this.state.appeared = 0;
    this.state.timeLeft = this.duration;
    this.updateHud();


    this._tickId = setInterval(() => {
      this.state.timeLeft--;
      this.updateHud();
      if(this.state.timeLeft <= 0) {
        this.state.running = false;
        clearInterval(this._tickId);
        this._tickId = null;
        clearInterval(this._spawnId);
        this._spawnId = null;
        for(const mole of this._activeMoles) mole.disappear();
        this._activeMoles.clear();
      }
    }, 1000);

    let baseInterval = 1200;
    this._spawnId = setInterval(() => {
      if(!this.state.running) return;

      let tempo = baseInterval * (0.5 + this.state.timeLeft / this.duration)
      clearInterval(this._spawnId);
      this._spawnId = setInterval(() => this.spawnMole(), Math.max(500, tempo));
      this.spawnMole();
    }, baseInterval)

  }
  spawnMole() {
    const cells = Array.from(this.boardEl.querySelectorAll('.cell'));
    const freeCells = cells.filter(cell => !cell.classList.contains('has-mole'))
    if(freeCells.length === 0) return;
    const cell = freeCells[Math.floor(Math.random() * freeCells.length)];
    const minTTL = 500, maxTTL = 800;
    const ttl = Math.max(minTTL, maxTTL * (0.5 + this.state.timeLeft / this.duration));
    
    const mole = new Mole(cell, ttl);
    this._activeMoles.add(mole);
    mole.appear(() => {
      if(this._activeMoles.has(mole)) {
        this._activeMoles.delete(mole);
        this.state.misses++;
        this.updateHud();
      }
    });
  
    this.state.appeared++;
    this.updateHud();
  }

  reset() {
    if(this._tickId) {
      clearInterval(this._tickId)
      this._tickId = null;
    }
    if(this._spawnId) {
      clearInterval(this._spawnId);
      this._spawnId = null;
    }

    for(const mole of this._activeMoles) mole.disappear();
    this._activeMoles.clear();
    this.state.score = 0;
    this.state.misses = 0;
    this.state.appeared = 0;
    this.state.timeLeft = this.duration;
    this.state.running = false;
    this.updateHud();
  }


  handleBoardClick(e) {

    if(!this.state.running) return;
    const cell = e.target.closest('.cell')
    if(!cell || !this.boardEl.contains(cell)) return;

    if(cell.classList.contains('has-mole')) {
      for (const mole of this._activeMoles) {
        if(mole.cellEl === cell) {
          mole.disappear();
          this._activeMoles.delete(mole);
          this.state.score++;
          this.updateHud();
          break;
        }
      }
    }
  }

  updateHud() {
    if (this.scoreEl) this.scoreEl.textContent = `Poäng: ${this.state.score}`;
    if (this.missesEl) this.missesEl.textContent = `Missar: ${this.state.misses}`;
    if (this.timeEl) this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
    if (this.appearedEl) this.appearedEl.textContent = `Visade: ${this.state.appeared}`;
  }
}