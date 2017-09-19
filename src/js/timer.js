class Timer {

  constructor(dom) {
    this.dom = dom
  }

  render() {
    setInterval(() => {
      this.dom.textContent = new Date()
    }, 1000)
  }
}
