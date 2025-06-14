// import { useState } from 'react'
import { useEffect, useState } from "react";
import "./App.css";

const permute = (word: string, limit = 20000): string[] => {
  if (word.length === 1) return [word];
  const perms: string[] = [];

  for (let i = 0; i < word.length; i++) {
    const current = word[i];
    const rest = word.slice(0, i) + word.slice(i + 1);
    for (const p of permute(rest, limit)) {
      const perm = current + p;
      if (!perms.includes(perm)) {
        perms.push(perm);
        if (perms.length >= limit) return perms;
      }
    }
    if (perms.length >= limit) return perms;
  }
  return perms;
};

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Fonction pour compter occurrences de chaque lettre
function countDuplicates(word: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const char of word) {
    counts[char] = (counts[char] || 0) + 1;
  }
  return counts;
}

// Fonction pour calculer nombre d'anagrammes théorique
function numberOfAnagrams(word: string): number {
  const counts = countDuplicates(word);
  const length = word.length;

  if (length === 0) return 0;
  let denominator = 1;
  for (const char in counts) {
    denominator *= factorial(counts[char]);
  }

  return factorial(length) / denominator;
}

function App() {
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anagrammes, setAnagrammes] = useState<string[]>([]);
  const [theorique, setTheorique] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setAnagrammes(permute(word));
    setTheorique(numberOfAnagrams(word));
    setFavorites([]);
    setIsLoading(false);
  }, [word]);

  const addToFavorite = (word: string) => {
    if (favorites.includes(word)) {
      setFavorites(favorites.filter((w) => w !== word));
    } else {
      setFavorites([...favorites, word]);
    }
  };

  return (
    <div>
      <header>
        <h1>Anagramme anything</h1>
        <p>
          Looking for a name for your brand or website? Generate anagrams of any
          word. Let's play!
        </p>
        <input
          type="text"
          name="anagrame"
          id="anagrame"
          maxLength={9}
          className="border rounded-sm"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          disabled={isLoading}
        />
      </header>
      <p>
        Number of anagrammes found: {anagrammes.length}{" "}
        {theorique > anagrammes.length && "- Théorique: " + theorique}
      </p>
      {favorites.length > 0 && (
        <>
          <h2>Favorite anagrammes</h2>
          <div className="anagrammesGrid">
            {favorites
              .sort((a, b) => a.localeCompare(b))
              .map((anagramme) => (
                <button
                  key={anagramme}
                  onClick={() => {
                    addToFavorite(anagramme);
                  }}
                >
                  {anagramme}
                </button>
              ))}
          </div>
        </>
      )}
      <h2>All anagrammes</h2>
      <div className="anagrammesGrid">
        {anagrammes &&
          anagrammes
            .sort((a, b) => a.localeCompare(b))
            .map((anagramme) => (
              <button
                key={anagramme}
                onClick={() => {
                  addToFavorite(anagramme);
                }}
                className={favorites.includes(anagramme) ? "selected" : ""}
              >
                {anagramme}
              </button>
            ))}
      </div>
    </div>
  );
}

export default App;
