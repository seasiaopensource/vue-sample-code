import Queue from 'promise-queue'

const maxConcurrent = 1
const maxQueue = 10000

class QueueCollection {
  constructor () {
    this.collection = {}
  }

  addQueue (id) {
    this.collection[id] = new Queue(maxConcurrent, maxQueue)
    return this.collection[id]
  }

  getQueue (id) {
    let queue = this.collection[id]
    return queue || this.addQueue(id)
  }
}

export default new QueueCollection()
