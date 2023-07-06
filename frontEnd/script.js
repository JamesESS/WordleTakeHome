fetch("https://qgxxfd5hoh.execute-api.eu-west-2.amazonaws.com/DEV/getword")
.then(response => response.json())
.then(result => {
    let todaysWord = result.Items[0].word.S;
  console.log(result.Items[0].word.S);
  document.getElementById("wordOutput").textContent = result.Items[0].word.S;
  let wordArr = todaysWord.split("");
  console.log(wordArr);
  if (wordArr.length != 5) console.error("incorrect word length!");
  wordArr.forEach(letter => {
        const letterContainer = document.createElement("p");
        letterContainer.textContent = letter;
        document.getElementById("wordOutput").appendChild(letterContainer);
  });
})