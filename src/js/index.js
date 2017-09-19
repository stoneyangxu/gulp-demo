window.onload = () => {
  load()
}

function load() {
  const dom = document.getElementById('timer')
  const timer = new Timer(dom)

  timer.render()
}
