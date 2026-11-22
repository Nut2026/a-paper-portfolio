const greetings = ["hi", "hello", "hey", "heya", "hiya", "howdy", 'happily'];
const symbols = ["+", "-", "*", "/", "%", "^", "&", "(", ")", "="];
const container = document.getElementById("intro-text");

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function getFourWordSequence() {
    let words = [];
    while (words.length < 4) {
        let word = getRandomItem(greetings);
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

        await sleep(1800);

        letterSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("dissipate");
            }, index * 35);
        });
        await sleep(800);
    }
}

runAnimation();
