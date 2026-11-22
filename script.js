const greetings = ["hi", "hello", "hey", "heya", "hiya", "howdy", 'happily'];
const container = document.getElementById("intro-text");

function getRandomGreeting(){
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAnimation() {
    let previousWord = "";
    while (true) {
        let word = getRandomGreeting();

        while (word === previousWord && greetings.length > 1) {
            word = getRandomGreeting();
        }
        previousWord = word;

        container.innerHTML = "";
        const letterSpans = [];

        for (let i=0; i < word.length; i++) {
            const span = document.createElement("span");
            span.textContent = word[i];
            span.className = "letter-block bg-amber-200 text-yellow-950 px-1.5 py-0.5-mx-[2px] rounded border-2 border-yellow-950 shadow-[2px_2px_0px_#422006]"
            container.appendChild(span);
            letterSpans.push(span);
            await sleep(120);
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
