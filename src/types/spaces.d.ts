interface Spaces {
  spaces: SpacesCollection
}

interface SpacesCollection {
  [id: string]: Space
}

interface Space {
  readonly id: string
  name: string
  createdAt: Date
  boards: string[]
}

export default Spaces
export { Spaces, Space, SpacesCollection }
