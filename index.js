const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "de-DE" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});


translateBtn.addEventListener("click", async () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value.split("-")[0],
        translateTo = selectTag[1].value.split("-")[0]; 
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    
    const url = `https://translated-mymemory---translation-memory.p.rapidapi.com/get?langpair=${translateFrom}%7C${translateTo}&q=${encodeURIComponent(text)}&mt=1&onlyprivate=0&de=a%40b.c`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '6156306e09msh2f97cf8163f4085p11854fjsnbb3af7764d75',
            'x-rapidapi-host': 'translated-mymemory---translation-memory.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            toText.value = data.responseData.translatedText;
        } else {
            
            console.error("Translation not found in API response:", data);
            toText.value = "Translation not available";
        }
    } catch (error) {
        console.error("Error fetching translation:", error);
        toText.value = "Error fetching translation";
    }

    toText.setAttribute("placeholder", "Translation");
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
