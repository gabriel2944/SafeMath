
import { createGamePane } from './game-pane.js';

function renderMainMenu() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const root = document.createElement('div');
    root.className = "menu-container";

    const modes = [
        ["MATEMÁTICA","Matematica"],
        ["ARCADE","Arcade"],
        ["INFINITO","Infinito"]
    ];
    modes.forEach(([title, value])=>{
        const btn = document.createElement('button');
        btn.className = "mode-btn";
        btn.innerText = title;
        btn.onclick = ()=>renderGame(value);
        root.appendChild(btn);
    });
    app.appendChild(root);
}

function renderGame(mode) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    app.appendChild(createGamePane(mode, renderMainMenu));
}

window.onload = renderMainMenu;