const greetings = ["hi", "hello", "hey", "heya", "hiya", "howdy", 'happily'];
const symbols = ["+", "-", "*", "/", "%", "^", "&", "(", ")", "="];
const container = document.getElementById("intro-text");

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function getGreetingPair() {
    let greetingA = getRandomItem(greetings);
    let greetingB = getRandomItem(greetings);

    while (greetingA === greetingB && greetings.length > 1) {
        greetingB = getRandomItem(greetings);
    }

    let randomSymbol = getRandomItem(symbols);

    return `${greetingA} ${randomSymbol} ${greetingB}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAnimation() {
    while (true) {
        const fullText = getGreetingPair();
        container.innerHTML = "";
        const letterSpans = [];

        for (let i=0; i < fullText.length; i++) {
            const span = document.createElement("span");
            span.textContent = fullText[i];
            
            if (fullText[i] === " ") {
                span.className = "inline-block mx-1";
            } else if (symbols.includes(fullText[i])) {
                span.className = "inline-block font-bold px-1.5 py-0.5 text-yellow-900 bg-amber-300 rounded border-2 border-yellow-950 shadow-[2px_2px_0px_0px_#422006]";
            } else {
                span.className = "letter-block bg-amber-200 text-yellow-950 px-1.5 py-0.5 mx-[1px] rounded border-2 border-yellow-950 shadow-[2px_2px_0px_0px_#422006]";
            }
            
            container.appendChild(span);
            letterSpans.push(span);
            await sleep(90);
        }

        await sleep(1400);

        letterSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("dissipate");
            }, index * 45);
        });
        await sleep(800);
    }
}

runAnimation();
