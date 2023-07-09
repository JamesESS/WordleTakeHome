const wordURL = "https://qgxxfd5hoh.execute-api.eu-west-2.amazonaws.com/DEV/getword";
fetch(wordURL)
.then(response => response.json())
.then(result => {
    let todaysWord = result.Items[0].word.S;
    let wordArr = todaysWord.split("");
    console.log(wordArr);
    if (wordArr.length != 5) console.error("incorrect word length!");
    wordArr.forEach(letter => {
        const letterContainer = document.createElement("p");
        letterContainer.textContent = letter;
        letterContainer.classList.add("letter");
        document.getElementById("wordOutput").appendChild(letterContainer);
  });
})


const updateWord = () => {
    fetch(wordURL, {
        method: "POST"
    })
}

document.getElementById("updateWord").addEventListener("click",updateWord)