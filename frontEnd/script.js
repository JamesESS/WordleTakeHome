const board = document.createElement("div");
board.className = "playBoard";
board.id = "playBoard";
makeRow(0, "div", "row", board);
document.getElementById("boardContainer").appendChild(board);

function makeRow(i, tagName, className, parent) {
  if (i < 7) {
    const row = document.createElement(tagName);
    row.className = className;
    parent.appendChild(row);
    makeTile(0, "p", "tile", row);
    makeRow(i + 1, tagName, className, parent);
  }
}

function makeTile(i, tagName, className, parent) {
  if (i < 5) {
    const tile = document.createElement(tagName);
    tile.className = className;
    parent.appendChild(tile);
    makeTile(i + 1, tagName, className, parent);
  }
}

const wordURL = "https://qgxxfd5hoh.execute-api.eu-west-2.amazonaws.com/DEV/getword";

const getWord = () => {
  fetch(wordURL)
    .then(response => response.json())
    .then(result => {
      const todaysWord = result.Items[0].word.S;
      const wordArr = todaysWord.split("");
      if (wordArr.length !== 5) {
        console.error("Incorrect word length!");
      }
      wordArr.forEach((letter, i) => {
        const playBoard = document.getElementById("playBoard");
        const row = playBoard.childNodes[6];
        const tile = row.childNodes[i];
        tile.textContent = letter;
      });
    })
    .catch(error => {
      console.error("Failed to fetch word:", error);
    });
};

getWord();

const updateWord = () => {
  fetch(wordURL, {
    method: "POST"
  })
    .then(() => getWord())
    .catch(error => {
      console.error("Failed to update word:", error);
    });
};

document.getElementById("updateWord").addEventListener("click", updateWord);
