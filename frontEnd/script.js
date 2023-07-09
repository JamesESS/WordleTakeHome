const board = document.createElement("div");
board.className = "playBoard"
board.id = "playBoard"
makeRow(0,"DIV","row",board);
document.getElementById("boardContainer").appendChild(board);

function makeRow(i,tagName,className,parent) {
    if (i<7) {
        const row = document.createElement(tagName);
        row.className = className;
        parent.appendChild(row);
        makeTile(0,"P","tile",row);
        makeRow(i+1,tagName,className,parent)
    }
    else return
}

function makeTile(i,tagName,className,parent) {
    if (i<5) {
        const row = document.createElement(tagName);
        row.className = className;
        parent.appendChild(row);
        makeTile(i+1,tagName,className,parent)
    }
    else return
}

const wordURL = "https://qgxxfd5hoh.execute-api.eu-west-2.amazonaws.com/DEV/getword";
fetch(wordURL)
.then(response => response.json())
.then(result => {
    let todaysWord = result.Items[0].word.S;
    let wordArr = todaysWord.split("");
    console.log(wordArr);
    if (wordArr.length != 5) console.error("incorrect word length!");
    wordArr.forEach((letter,i) => {
        // const letterContainer = document.createElement("p");
        // letterContainer.textContent = letter;
        // letterContainer.classList.add("letter");
        // letterContainer.style.color = "white";
        // document.getElementById("playBoard").childNodes[6].childNodes[i].appendChild(letterContainer);
        document.getElementById("playBoard").childNodes[6].childNodes[i].textContent = letter;
  });
})


const updateWord = () => {
    fetch(wordURL, {
        method: "POST"
    })
}

document.getElementById("updateWord").addEventListener("click",updateWord)