const programmingTerms = ["try-except", "yield", "get", "return", "Math.random()", "arr.length", 'let j'];
const symbols = ["+", "-", "*", "/", "%", "^", "&", "(", ")", "="];
const container = document.getElementById("intro-text");

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function getFourWordSequence() {
    let words = [];
    while (words.length < 4) {
        let word = getRandomItem(programmingTerms);
        if (!words.includes(word)) {
            words.push(word);
        }
    }

    let sym1 = getRandomItem(symbols);
    let sym2 = getRandomItem(symbols);
    let sym3 = getRandomItem(symbols);

    return `${words[0]} ${sym1} ${words[1]} ${sym2} ${words[2]} ${sym3} ${words[3]}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAnimation() {
    while (true) {
        const fullText = getFourWordSequence();
        container.innerHTML = "";
        const letterSpans = [];

        for (let i = 0; i < fullText.length; i++) {
            const span = document.createElement("span");
            span.textContent = fullText[i];
            
            if (fullText[i] === " ") {
                span.className = "inline-block mx-1";
            } else {
                span.className = "letter-block inline-block";
            }
            
            container.appendChild(span);
            letterSpans.push(span);
            await sleep(90);
        }

        await sleep(1500);

        letterSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("dissipate");
            }, index * 35);
        });
        await sleep(800);
    }
}

runAnimation();

let currentState = 0;
const trackElement = document.getElementById("plane-track");
const planeElement = document.querySelector(".paper-plane-loop");

trackElement.addEventListener("click", () => {
    currentState = (currentState + 1) % 4;

    switch (currentState) {
        case 0:
            document.body.classList.remove("dyslexic-theme");
            planeElement.classList.remove("paused");
            break;
        case 1:
            document.body.classList.add("dyslexic-theme");
            planeElement.classList.remove("paused");
            break;
        case 2:
            document.body.classList.add("dyslexic-theme");
            planeElement.classList.add("paused");
            break;
        case 3:
            document.body.classList.remove("dyslexic-theme");
            planeElement.classList.add("paused");
            break;
    }
});
