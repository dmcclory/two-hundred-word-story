import { describe, expect, it } from "vitest";

import { tokenize, buildState, partition, totalWords, sortWords } from '../Cool'


describe('tokenize', () => {
  it('returns a list of tokens', () => {
    let input = ('This is a story')
    const result = tokenize(input)
    expect(result.length).toEqual(4)
  })

  it('splits tokens when there is any whitespace', () => {
    let input = `this is
    a story
    `
    const result = tokenize(input)
    expect(result.length).toEqual(4)
  })

  it('downcases them', () => {
    let input = ('This is a story')
    const result = tokenize(input)
    expect(result[0]).toEqual('this')
  })

  it('strips out punctuation', () => {
    let input = ('This is a story. About a man?')
    const result = tokenize(input)
    expect(result.every(w => w.match(/^[a-zA-Z0-9]+$/))).toBeTruthy()
  })

  it('discards empty strings if the input ends with a space', () => {
    let input = ('This is a story. About a man?')
    const result = tokenize(input)
    expect(result.every(w => w.length > 0 )).toBeTruthy()
  })

  it('discards empty strings if the input ends with a space', () => {
    let input = ('This is a story. About a man (')
    const result = tokenize(input)
    expect(result.every(w => w.length > 0 )).toBeTruthy()
  })

})

describe('buildState', () => {
  it('filters uniq', () => {
    let input = (['This', 'is', 'a', 'story', 'about', 'a', 'man'])
    const result = buildState(input)
    expect(result['a'].word === 'a').toBeTruthy()
    expect(result['a'].firstOccurrence === 2).toBeTruthy()
    expect(result['a'].occurrences.length === 2).toBeTruthy()
  })
})


describe('partition', () => {
  const input = ["a", "cool", "short", "sweet", "story"]
  it('returns a list of N lists', () => {
    const result = partition(input, 5, 4)
    expect(result.length === 4).toBeTruthy()
    expect(result.every(c => c.constructor.name === 'Array')).toBeTruthy()
  })

  it('fills the lists with keys from the word map', () => {
    const result = partition(input, 10, 3)
    expect(
      input.every(w => result[0].find(e => e == w))
    ).toBeTruthy()
  })

  it('ensures that all lists have the same length (by filling empty slots with undefined)', () => {
    const result = partition(input, 8, 9)
    expect(result.length).toEqual(9)
    expect(
      result.every(c => c.length == 8)
    ).toBeTruthy()
  })
})


// need to add "alphabetic and first occurence sorting tests around here"
// make sure to add the case where there's a number in the story too!

describe('sortWords', () => {
  it('returns a list of tokens in the order they appear', () => {
    const text = "A good story about a regular person"
    const tokens = tokenize(text)
    const input = buildState(tokens)
    const result = sortWords(input)
    expect(result.length).toEqual(Object.keys(input).length)
    expect(result[0]).toEqual('a')
    expect(result[1]).toEqual('good')
  })

  it('does not pull numbers to the front of the list', () => {
    const text = "A story that ends with the number 50"
    const tokens = tokenize(text)
    const input = buildState(tokens)
    const result = sortWords(input)
    expect(result.length).toEqual(Object.keys(input).length)
    expect(result[0]).toEqual('a')
    expect(result[1]).toEqual('story')
    expect(result[result.length -1 ]).toEqual('50')
  })
})


// maybe make it so we ignore plurals??

describe('totalWords', () => {
  const text = "The long story told to a man who wore a hat"
  const input = buildState(tokenize(text))

  it('returns a count of all words', () => {
    const res = totalWords(input)
    expect(res).toEqual(11)
  })

  it('can be configured to skip a set of words', () => {
    const res = totalWords(input, true)
    expect(res).toEqual(7)
  })
})