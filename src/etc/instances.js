class InstanceContainer {
  constructor () {
    this.instance = {}
  }

  set (instance) {
    this.instance = instance
  }

  get () {
    return this.instance
  }
}

export const vueInstance = new InstanceContainer()
export const configInstance = new InstanceContainer()
