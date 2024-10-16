document.addEventListener('DOMContentLoaded', () => {
  const getById = id => document.getElementById(id);

  const getIO = () => ({ 
    text: getById("text").value.normalize(),
    search: getById("search").value.normalize(),
    view: getById("view")
  });

  const cleanString = (text) => 
    text
      .replace(/[\n\r\t]+/igm, " ") // Replace newlines, tabs with space
      .replace(/[^a-z\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa0-9 .,;:()?!“”'‘’-_]+/igm, "") // Allow only certain characters
      .replace(/[ ]+/gm, " "); // Remove extra spaces

  const wordArray = (text) => 
    cleanString(text)
      .toLowerCase() // Normalize to lowercase
      .split(/[^a-z\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa]+/) // Split into words
      .filter(w => w !== ""); // Remove empty strings

  const repetitions = (orderedArray) => 
    orderedArray.reduce((acc, el, i, a) => {
      if (i === 0) acc.push({ s: el, n: 1 });
      else if (el === a[i - 1]) acc[acc.length - 1].n++;
      else acc.push({ s: el, n: 1 });
      return acc;
    }, []);

  const count = () => {
    let { text, view } = getIO();
    let charCount = cleanString(text).replace(/[^a-z\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa]/igm, "").length;
    let wordCount = wordArray(text).length;
    let sentenceCount = text.split(/[.!?]/).filter(s => s.trim() !== "").length;
    let lineCount = text.split("\n").length;
    
    let result = `Caracteres: ${charCount}\nPalabras: ${wordCount}\nFrases: ${sentenceCount}\nLíneas: ${lineCount}`;
    view.innerHTML = result;
  };

  const wordIndex = () => {
    let { text, view } = getIO();
    let words = wordArray(text).sort();
    let result = repetitions(words)
      .map(el => `${el.s}: ${el.n}`)
      .join("\n");
    view.innerHTML = result;
  };

  const searchWords = () => {
    let { text, search, view } = getIO();
    let words = wordArray(text).filter(word => word.includes(search.toLowerCase())).sort();
    let result = `Hay ${words.length} palabras que contienen '${search}'.\n\n`;
    result += repetitions(words)
      .map(el => `${el.n} repeticiones de: ${el.s}`)
      .join("\n");
    view.innerHTML = result;
  };

  document.addEventListener('click', ev => {
    if (ev.target.matches('.count')) count();
    else if (ev.target.matches('.word_index')) wordIndex();
    else if (ev.target.matches('.search_words')) searchWords();
  });
});