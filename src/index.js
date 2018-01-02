import HelloWorld from './hello-world.html'

var app = new HelloWorld({
  target: document.getElementById('app'),
  data: {
    name: 'Jake'
  }
})
