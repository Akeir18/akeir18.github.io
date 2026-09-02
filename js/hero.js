const commands = [
    {
        command: "whoami",
        output: ["Christian Jiménez Roche"],
    },
    {
        command: "echo $ROLE",
        output: ["Full Stack Developer"],
    },
    {
        command: "echo $STACK",
        output: [
            "frontend  → HTML · CSS · JavaScript · React · Angular · Vue",
            "backend   → PHP · Laravel",
            "database  → MySQL · SQLServer · PostgreSQL · MongoDB",
            "other     → Git · Docker · Linux",
        ],
    },
    {
        command: "cat about-me.txt",
        output: [
            "Building web applications",
            "Designing APIs",
            "Working with databases",
            "Coffee powered developer",
        ],
    },
    {
        command: "status",
        output: ["Ready to build something great_"],
    },
    {
        command: "exit",
        output: ["Goodbye!"],
    },
];

const section = document.querySelector(".terminal-section");
const terminal = document.querySelector("#terminal-content");

function getProgress() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress = -rect.top / scrollable;
    return Math.max(0, Math.min(1, progress));
}

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderCompletedCommand(data) {
    const output = data.output.map((line) => escapeHTML(line)).join("<br>");

    return `
        <div class="command">
            <div class="command-line">
                <span class="prompt">$</span>
                ${escapeHTML(data.command)}
            </div>
            <div class="output">${output}</div>
        </div>
    `;
}

function renderCurrentCommand(data, progress) {
    /*
    Primera mitad:
    escribir comando

    Segunda mitad:
    escribir resultado
    */

    const commandProgress = Math.min(progress * 2, 1);
    const outputProgress = Math.max((progress - 0.5) * 2, 0);

    const commandLength = Math.floor(data.command.length * commandProgress);
    const visibleCommand = data.command.slice(0, commandLength);

    const outputText = data.output.join("\n");
    const outputLength = Math.floor(outputText.length * outputProgress);
    const visibleOutput = outputText.slice(0, outputLength);
    const formattedOutput = escapeHTML(visibleOutput).replace(/\n/g, "<br>");

    const showCursor = progress < 1;

    return `
        <div class="command">
            <div class="command-line">
                <span class="prompt">$</span>
                    ${escapeHTML(visibleCommand)}
                ${showCursor ? '<span class="cursor">▌</span>' : ""}
            </div>
            ${outputLength > 0 ? ` <div class="output"> ${formattedOutput} </div> ` : ""}
        </div>
    `;
}

function renderTerminal(progress) {
    /*
    Convertimos:
        0 → 1
    en:
        0 → número de comandos
    */

    const position = progress * commands.length;

    let currentIndex = Math.floor(position);

    /*
    Progreso dentro del comando actual
    Ejemplo:
        position = 1.4
        currentIndex = 1
        localProgress = 0.4
    */

    let localProgress = position - currentIndex;

    /*
    Si hemos llegado exactamente
    al final de todo.
    */

    // console.log(progress);
    // if (currentIndex >= commands.length) {
    //     currentIndex = commands.length;
    //     localProgress = 1;
    //     console.log("entra");
    //     document.getElementById("sobre-mi").scrollIntoView();
    // }

    let html = "";

    for (let i = 0; i < currentIndex; i++) {
        html += renderCompletedCommand(commands[i]);
    }

    if (currentIndex < commands.length) {
        html += renderCurrentCommand(commands[currentIndex], localProgress);
    }

    terminal.innerHTML = html;

    const targetScroll = terminal.scrollHeight - terminal.clientHeight;
    terminal.scrollTop += (targetScroll - terminal.scrollTop) * 0.15;
}

let ticking = false;

function update() {
    const progress = getProgress();
    renderTerminal(progress);
    ticking = false;
}

const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible) {
        section.scrollIntoView({ behavior: "instant" });
    }
});

let lastScrollY = window.scrollY;
let scrollingDown = true;
window.addEventListener(
    "scroll",
    () => {
        const currentScrollY = window.scrollY;
        scrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;

        observer.observe(terminal);
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    },
    {
        passive: true,
    },
);

update();
