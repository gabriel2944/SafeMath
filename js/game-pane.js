import { Game } from './game.js';

export function createGamePane(mode, mainMenuCallback) {
    const game = new Game(mode);
    let selectedAnimal = game.currentAnimal;
    let lockedAnimal = null;
    let question = null;
    let gameActive = true;

    const MATEMATICA_BOSSES = [
        "images/matematica/boss1.png",
        "images/matematica/boss2.png",
        "images/matematica/boss3.png",
        "images/matematica/boss4.png",
        "images/matematica/boss5.png"
    ];
    const ARCADE_BOSSES = [
        "images/arcade/boss1.png",
        "images/arcade/boss2.png",
        "images/arcade/boss3.png"
    ];
    const INFINITO_BOSSES = [
        "images/infinito/boss1.png"
    ];

    // root
    const root = document.createElement('div');
    root.className = 'game-root';

    // background
    const bg = document.createElement('img');
    bg.src = 'images/BackgroundLutas.png';
    bg.className = "gamestack-bg";
    root.appendChild(bg);

    // pause button
    const pauseBtn = document.createElement('button');
    pauseBtn.className = "pause-btn";
    const pauseIcon = document.createElement('img');
    pauseIcon.src = "images/pause.png";
    pauseIcon.alt = "pause";
    pauseBtn.appendChild(pauseIcon);
    root.appendChild(pauseBtn);

    // center message container
    const centerMsgContainer = document.createElement('div');
    centerMsgContainer.className = "center-message";
    root.appendChild(centerMsgContainer);

    // pause overlay
    const pauseOverlay = document.createElement('div');
    pauseOverlay.className = "bg-pause-overlay";
    pauseOverlay.style.display = "none";
    pauseOverlay.innerHTML = `
      <div class="pause-panel">
        <div style="font-weight:bold; font-size:1.2em; margin-bottom:12px">PAUSADO</div>
        <button id="btn-resume">RETOMAR</button>
        <br/>
        <button id="btn-menu">MENU</button>
      </div>`;
    root.appendChild(pauseOverlay);

    pauseBtn.onclick = () => { pauseOverlay.style.display = "flex"; gameActive = false; };
    pauseOverlay.querySelector('#btn-resume').onclick = () => { pauseOverlay.style.display = "none"; gameActive = true; };
    pauseOverlay.querySelector('#btn-menu').onclick = () => { mainMenuCallback(); };

    // top: turn + question + input
    const gameTop = document.createElement('div');
    gameTop.className = "game-top";

    const turnLabel = document.createElement('div');
    turnLabel.className = 'question-title';
    turnLabel.textContent = '';

    const questionLabel = document.createElement('div');
    questionLabel.className = "question-label";

    const answerField = document.createElement('input');
    answerField.type = "text";
    answerField.className = "answer-input";
    answerField.placeholder = "Resposta";

    const btnSubmit = document.createElement('button');
    btnSubmit.className = "submit-btn";
    btnSubmit.textContent = "Responder";

    const questionPanel = document.createElement('div');
    questionPanel.className = "question-panel";
    questionPanel.appendChild(turnLabel);
    questionPanel.appendChild(questionLabel);
    questionPanel.appendChild(answerField);
    questionPanel.appendChild(btnSubmit);
    gameTop.appendChild(questionPanel);
    root.appendChild(gameTop);

    // panels row
    const panels = document.createElement('div');
    panels.className = "game-panels";

    // player box (left)
    const playerBox = document.createElement('div');
    playerBox.className = "player-box";

    const playerFigure = document.createElement('div');
    playerFigure.className = 'player-figure';

    const playerImg = document.createElement('img');
    playerImg.src = "images/player.png";
    playerImg.className = "player-sprite";
    playerImg.alt = "player";

    // animal do lado
    const animalImg = document.createElement('img');
    animalImg.className = "animal-overlay";
    animalImg.alt = "animal";

    playerFigure.appendChild(playerImg);
    playerFigure.appendChild(animalImg);

    // adiciona playerFigure ao playerBox
    playerBox.appendChild(playerFigure);

    // barra de vida player
    const playerHP = document.createElement('div');
    playerHP.className = "progress-bar-container";
    playerBox.appendChild(playerHP);

    // valor vida/dano
    const playerDamage = document.createElement('div');
    playerDamage.className = "damage-label hidden";
    playerBox.appendChild(playerDamage);

    // cards animais
    const animalSelection = document.createElement('div');
    animalSelection.className = "animal-selection";
    playerBox.appendChild(animalSelection);

    // boss box 
    const bossBox = document.createElement('div');
    bossBox.className = "boss-box";

    const bossHP = document.createElement('div');
    bossHP.className = "progress-bar-container boss-bar";
    bossBox.appendChild(bossHP);

    const bossImg = document.createElement('img');
    bossImg.className = "boss-sprite";
    bossImg.alt = "chefe";
    bossBox.appendChild(bossImg);

    const bossDamage = document.createElement('div');
    bossDamage.className = "damage-label hidden";
    bossBox.appendChild(bossDamage);

    panels.appendChild(playerBox);
    const centerSpacer = document.createElement('div');
    centerSpacer.style.flex = "1";
    panels.appendChild(centerSpacer);
    panels.appendChild(bossBox);
    root.appendChild(panels);

    function progressBar(barElem, value) {
        barElem.innerHTML = `<div class="progress-bar" style="width: ${(Math.max(0, Math.min(1, value)) * 100).toFixed(1)}%"></div>`;
    }
    function animalImgPath(name) {
        if (!name) return "images/animals/placeholder.png";
        name = name.toLowerCase().replace(/[ãâáà]/g,"a").replace(/[éê]/g,"e").replace(/[í]/g,"i")
                                .replace(/[óôõ]/g,"o").replace(/[ú]/g,"u").replace(/[ç]/g,"c");
        switch(name) {
            case "coelho": return "images/coelho.png";
            case "gato": return "images/gato.png";
            case "cao": case "cachorro": return "images/cachorro.png";
            case "leao": return "images/leao.png";
            case "tigre": return "images/tigre.png";
            default: return "images/animals/placeholder.png";
        }
    }
    function getBossImg() {
        if (game.mode === "Matematica") {
            const idx = Math.min(MATEMATICA_BOSSES.length, Math.max(1, game.animals.indexOf(game.currentAnimal) + 1));
            return MATEMATICA_BOSSES[idx - 1];
        } else if (game.mode === "Arcade") {
            const idx = Math.min(ARCADE_BOSSES.length, Math.max(1, game.arcadeStage + 1));
            return ARCADE_BOSSES[idx - 1];
        } else if (game.mode === "Infinito") {
            return INFINITO_BOSSES[0];
        }
        return "images/bosses/placeholder.png";
    }

    function updateAnimalSelection() {
        animalSelection.innerHTML = '';
        let available = [];
        if (game.mode === "Matematica") {
            let idx = game.animals.indexOf(game.currentAnimal);
            available = game.animals.slice(0, idx + 1);
        } else available = [...game.animals];

        if ((!selectedAnimal || selectedAnimal.cooldown > 0) && available.length > 0) {
            selectedAnimal = available.find(a => a.cooldown === 0) || available[0];
        }

        available.forEach(a => {
            const card = document.createElement('div');
            card.className = 'animal-card' + ((selectedAnimal === a) ? ' selected' : '') + ((a.cooldown > 0) ? ' locked' : '');
            const img = document.createElement('img');
            img.src = animalImgPath(a.name);
            img.alt = a.name;
            img.style.width = '38px';
            img.style.height = '38px';
            const label = document.createElement('div');
            label.style.fontSize = '0.9em';
            label.style.fontWeight = 'bold';
            label.textContent = a.name;
            card.appendChild(img);
            card.appendChild(label);

            if (a.cooldown > 0) {
                const badge = document.createElement('div');
                badge.className = 'badge';
                badge.innerText = String(a.cooldown);
                card.appendChild(badge);
            }

            card.onclick = () => {
                if (a.cooldown > 0) {
                    showCenteredMessage(a.name + " em cooldown", 1.0);
                    return;
                }
                selectedAnimal = a;
                // atualiza a imagem sobreposta (animal do jogador)
                animalImg.src = animalImgPath(selectedAnimal.name);
                updateAnimalSelection();
                updateAll();
                showCenteredMessage("Selecionado: " + a.name, 0.9);
            };
            animalSelection.appendChild(card);
        });
    }

    function updateAll() {
        bossImg.src = getBossImg();
        bossImg.alt = "chefe";
        if (selectedAnimal) {
            animalImg.src = animalImgPath(selectedAnimal.name);
            animalImg.style.display = "inline";
        } else {
            animalImg.style.display = "none";
        }
        progressBar(playerHP, game.player.getHealth() / game.player.getMaxHealth());
        let vidaMax = 1.0;
        if (game.mode === "Matematica") vidaMax = game.currentAnimal.force * 3.0;
        else if (game.mode === "Arcade") vidaMax = game.currentBoss.maxHealth;
        else if (game.mode === "Infinito") vidaMax = 999999;
        progressBar(bossHP, Math.max(0, game.currentBoss.health / vidaMax));
        updateAnimalSelection();
    }

    function showDamage(target, value) {
        const label = (target === "boss" ? bossDamage : playerDamage);
        label.textContent = "-" + value;
        label.classList.remove("hidden");
        setTimeout(() => label.classList.add("hidden"), 1400);
    }

    function showCenteredMessage(msg, seconds = 2.2) {
        centerMsgContainer.innerHTML = `<div class="msg">${msg.replace(/\n/g, '<br/>')}</div>`;
        setTimeout(() => { centerMsgContainer.innerHTML = ''; }, Math.max(700, seconds * 1000));
    }

    function formatAnswer(a) {
        if (Math.abs(a - Math.round(a)) < 0.0001) return String(Math.round(a));
        return a.toFixed(3).replace(',', '.');
    }

    function nextTurn() {
        if (!gameActive) return;
        if (!game.player.isAlive() || !game.currentBoss.isAlive()) return;

        turnLabel.textContent = game.isPlayerTurn() ? "ATAQUE" : "DEFESA";
        question = game.qGen.generate(game.difficultyForMode());
        questionLabel.textContent = question.text;
        answerField.value = '';
        answerField.disabled = false;
        answerField.focus();

        btnSubmit.disabled = false;
        btnSubmit.onclick = () => processAnswer(question);
        answerField.onkeypress = (e) => { if (e.key === "Enter") processAnswer(question); };
    }

    function processAnswer(q) {
        if (!q) return;
        let user = (answerField.value || '').replace(',', '.').trim();
        let correct = false;
        try {
            let ans = parseFloat(user);
            correct = (Math.abs(ans - q.answer) < 0.001);
        } catch (e) { correct = false; }
        game.qGen.recordAnswer(correct);

        if (game.isPlayerTurn()) {
            if (selectedAnimal && selectedAnimal.canAttack()) {
                if (correct) {
                    let dmg = selectedAnimal.force;
                    game.currentBoss.takeDamage(dmg);
                    showDamage("boss", dmg);

                    selectedAnimal.cooldown = Math.max(1, Math.round(selectedAnimal.force * 0.1));
                    if (selectedAnimal.cooldown > 0) {
                        lockedAnimal = selectedAnimal;
                        let available = [];
                        if (game.mode === "Matematica") {
                            let idx = game.animals.indexOf(game.currentAnimal);
                            available = game.animals.slice(0, idx + 1);
                        } else available = [...game.animals];
                        selectedAnimal = available.find(a => a.cooldown === 0) || available[0];
                    }

                    updateAll();
                    const status = game.checkBossDefeat();
                    updateAll();
                    if (status === "desbloqueou") {
                        showCenteredMessage("Novo animal desbloqueado: " + game.currentAnimal.name, 2.4);
                        setTimeout(() => nextTurn(), 1700);
                        return;
                    } else if (status === "vitoria") {
                        showCenteredMessage("VOCÊ VENCEU O MODO " + game.mode.toUpperCase() + "!", 3.4);
                        setTimeout(() => mainMenuCallback(), 3200);
                        return;
                    }
                } else {
                    showCenteredMessage("ERRADO!\nResposta correta: " + formatAnswer(q.answer), 1.4);
                }
            }
            game.decrementAllCooldowns();
            updateAnimalSelection();
        } else {
            let maxDmg = (game.mode === "Arcade" ? 50 + game.arcadeStage * 50 : (game.mode === "Infinito" ? 20 : 50));
            let dmg = game.getRandomDamage(maxDmg);

            if (correct) {
                showCenteredMessage("DEFESA PERFEITA!", 1.2);
            } else {
                game.player.takeDamage(dmg);
                showDamage("player", dmg);
                showCenteredMessage("DEFESA FALHOU! Recebeu " + dmg + " de dano.\nResposta correta: " + formatAnswer(q.answer), 1.8);
                if (!game.player.isAlive()) {
                    showCenteredMessage("DERROTADO!", 2.2);
                    gameActive = false;
                    setTimeout(() => mainMenuCallback(), 2100);
                    return;
                }
            }
        }

        updateAll();
        game.togglePlayerTurn();
        setTimeout(() => nextTurn(), 550);
    }

    updateAll();
    setTimeout(() => nextTurn(), 140);

    return root;

}

