const form = document.querySelector('form');
const resultDiv = document.querySelector('#result');

// Hide result box initially
resultDiv.style.display = "none";

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value.trim());
});

const getWordInfo = async (word) => {

    if (!word) {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = `<p>Please enter a word.</p>`;
        return;
    }

    try {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "Fetching Data...";

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        let definitions = data[0].meanings[0].definitions[0];
        let antonyms = definitions.antonyms || [];
        let synonyms = definitions.synonyms || [];   // ✅ FIXED

        // Build output
        resultDiv.innerHTML =
            `<h2><strong>Word:</strong> ${data[0].word}</h2>
             <p class="partofSpeech">${data[0].meanings[0].partOfSpeech}</p>
             <p><strong>Meaning:</strong> ${definitions.definition || "Not Found"}</p>
             <p><strong>Example:</strong> ${definitions.example || "Not Found"}</p>

             <p><strong>Synonyms:</strong></p>`;    // MOVE SYNONYMS UP

        // Synonyms list
        if (synonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            synonyms.forEach(item => {
                resultDiv.innerHTML += `<li>${item}</li>`;
            });
        }

        // Antonyms section
        resultDiv.innerHTML += `<p><strong>Antonyms:</strong></p>`;
        if (antonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            antonyms.forEach(item => {
                resultDiv.innerHTML += `<li>${item}</li>`;
            });
        }

        // Source link
        resultDiv.innerHTML += `<div><br><a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a></div>`;

        console.log(data);

    } catch (error) {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = `<p>SORRY, The Word Could Not Be Found</p>`;
    }
};
