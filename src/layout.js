export function layout(content) {
  return `<!doctype html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
if (
  location.hash && 
  (
    location.hash.indexOf('#invite_token=') === 0 || 
    location.hash.indexOf('#access_token=') === 0
  )
) {
  location.href = '/admin/' + location.hash;
}
</script>
<style>
body {
  font-family: sans-serif;
  margin-bottom: 10px;
}
h1, h2, h3 {
  font-weight: normal;
  line-height: 1.5em;
}
* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
.page-header {
}
.page-header h1,
.page-header h2 {
  padding: 0 10vw;
}
.page-header > h2 {
  background: #000;
  color: #fff;
  margin: 0 0 .5em;
  font-size: 125%;
}
.page-header .phone-number {
  float: right;
}
.page-header .logo {
  color: #000;
  margin: 0 0 .5em;
  font-weight: bold;
}
.page-header .nav {
  padding: 0 10vw;
  text-transform: uppercase;
}
.page-header .nav a {
  color: #000;
}
.page-header .nav ul {
  text-align: justify;
}
.page-header .nav ul:after {
  content: "";
  display: inline-block;
  width: 100%;
}
.page-header .nav li {
  list-style: none;
  display: inline-block;
}
img,
video {
  display: block;
  width: 100%;
  height: auto;
}
.homepage-products {
  margin: 0 10vw;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
}
</style>
</head>
<body>
  <header class="page-header">
    <h2><span class="location">Наария</span> <span class="phone-number">тел. 0549212603</span></h2>
    <h1 class="logo">balexcomfort</h1>
    <nav class="nav">
      <ul>
        <li><a href="/">Главная</a></li>
      </ul>
    </nav>
  </header>
  ${content}
</body>
`;
}