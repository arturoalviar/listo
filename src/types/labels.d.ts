interface Label {
  readonly id: string
  name: string
  button: string
  textColor: string
  color: string
}

interface LabelTemp {
  name: string
  button: string
  textColor: string
  color: string
}

interface Labels {
  [id: string]: Label
}

interface LabelColor {
  button: string
  textColor: string
  color: string
}

export default Labels
export { LabelTemp, Label, LabelColor }
