import { useCallback, useMemo, useState } from 'react'
import './App.css'
import {tokenize, buildState, totalWords, partition, totalUniqueWords, sortWords } from './Cool'

const helper = (input: string) => buildState(tokenize(input))
const starterText = "Write a story! Make it 200 words long, but here's the catch: you can only use 50 words. This writing exercise is from A Swim In The Lake in the Rain by George Saunders, you should read his description of it, if you're curious. \n\nDelete this to get started!"

// numbers sort first .. a wierd bug
// probably can "alphabetize them based on the first number"

function App() {
  const [storyText, setStoryText] = useState(() => starterText)
  const [words, setWords] = useState(() => {
    let wordMap = helper(starterText)
    return wordMap
  })

  const formChange = useCallback((e) => {
    const text = e.target.value
    const lastChar = text[text.length -1]

    setStoryText(text)
    if (
      (lastChar && lastChar.match(/\p{Separator}|\s|\p{Punctuation}/u))
      || text === ''
    ) {
      setWords(helper(text))
    }
  }, [])

  const wordList = useMemo(() => (
    sortWords(words)
  ), [words])

  const columns = partition(wordList, 20, 3).map((c,i) =>
    <div className="column" key={i}>
      {c.map((w, j) => (
        <div
          className="entry"
          key={`${w}-${i}-${j}`}
        >
          {i*20 + j + 1}: {w}
        </div>
      ))}
    </div>
  )

  const total = !!words && totalWords(words)
  const totalUnique = !!words && totalUniqueWords(words)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Two Hundred Word Story</h1>
      </header>
        <div className="Main">
          <div className="TextArea">
            Total: {total} words
            <textarea defaultValue={storyText} onChange={formChange}>
            </textarea>
          </div>
          <div className="WordList">
            {totalUnique} unique words
            <div className="WordList--main">
              {columns}
            </div>
          </div>
        </div>
      <footer>
        By the way: we don't save <i>anything</i> so if you write a little story you like ... make sure to save it!
      </footer>
    </div>
  )
}

export default App
