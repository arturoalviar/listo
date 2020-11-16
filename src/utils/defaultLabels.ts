import { uuid } from './'

interface Palette {
  [id: string]: {
    color: string
    button: string
    textColor: string
  }
}

const palette: Palette = {
  green: {
    color: '#68d391',
    button: '#48bb78',
    textColor: '#22543d',
  },
  yellow: {
    color: '#f6e05e',
    button: '#ecc94b',
    textColor: '#744210',
  },
  red: {
    color: '#fc8181',
    button: '#f56565',
    textColor: '#742a2a',
  },
  orange: {
    color: '#f6ad55',
    button: '#ed8936',
    textColor: '#7b341e',
  },
  teal: {
    color: '#4fd1c5',
    button: '#38b2ac',
    textColor: '#234e52',
  },
  blue: {
    color: '#63b3ed',
    button: '#4299e1',
    textColor: '#2a4365',
  },
  indigo: {
    color: '#7f9cf5',
    button: '#667eea',
    textColor: '#3c366b',
  },
  purple: {
    color: '#b794f4',
    button: '#9f7aea',
    textColor: '#44337a',
  },
  pink: {
    color: '#f687b3',
    button: '#ed64a6',
    textColor: '#702459',
  },
}

const labels = ['green', 'yellow', 'orange', 'teal', 'blue']
  .map((color) => {
    return {
      id: '',
      name: '',
      ...palette[color],
    }
  })
  .reduce((acc, curr) => {
    const currentId = uuid()
    const newCurr = { ...curr, id: currentId }
    acc = { ...acc, [currentId]: newCurr }

    return acc
  }, {})

const colorPalette = Object.keys(palette).map((color) => {
  return palette[color]
})

export default labels
export { colorPalette }
