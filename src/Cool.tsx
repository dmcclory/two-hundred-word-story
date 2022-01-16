
export const tokenize = (text: string) => {
  let res = text.replace(/\p{Punctuation}+/gu, '').split(/\p{Separator}|\s/gu).map(t => t.toLocaleLowerCase()).filter(t => t.length > 0)
  return res
}

export const buildState = (tokens: string[]) => {
  let res: WordMap = {}
  tokens.forEach((e, i) => {
    if (!(e in res)) {
      res[e] = { word: e, firstOccurrence: i, occurrences: [i]}
    } else {
      res[e].occurrences.push(i)
    }
  })
  return res
}

type WordMapEntry = {
  occurrences: number[];
  firstOccurrence: number;
  word: string
}

type WordMap = {
  [token: string]: WordMapEntry
}

const skipList = [
  'the',
  'a',
  'to',
  'from',
  'up',
  'and',
  'or',
  'but',
  'yet',
  'with',
  'at',
  'until',
  'among',
  'for',
  'on',
  'by',
  'before',
  'after',
  'since',
  'over',
  // pronouns
  'he',
  'she',
  'we',
  'you',
  'they',
  'it',
  'my',
  'our',
  'your',
  'his',
  'hers',
  'their',
]

export const totalWords = (wordMap: WordMap, skipFrequentWords = false) => {
  if (wordMap === undefined) {
    return 0
  }
  const filterFn = skipFrequentWords ?
    (w: WordMapEntry) => skipList.indexOf(w.word) < 0
    : (w: WordMapEntry) => true
  return Object.values(wordMap)
    .filter(filterFn)
    .reduce((acc, b) => (acc + b.occurrences.length), 0)
}

export const totalUniqueWords = (wordMap: WordMap) => {
  if (wordMap === undefined) {
    return 0
  }
  return Object.keys(wordMap).length
}

export const partition = (words: string[], rows=20, columns=3) => {
  const wordCopy = [...words]
  const res = []

  for (let i = 0; i < columns; i++) {
    const subArray = []
    for (let j = 0; j < rows; j++) {
      subArray.push(wordCopy.shift())
    }
    res.push(subArray)
  }

  return res
}

export const sortWords = (wordMap: WordMap) => {
  const res = []
  const cool = Object.values(wordMap).sort((a, b) => a.firstOccurrence < b.firstOccurrence ? -1 : 1)

  return cool.map(e => e.word)
}