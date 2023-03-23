export function layout(content) {
  return `<!doctype html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- <link rel="stylesheet" href="//writ.cmcenroe.me/1.0.4/writ.min.css"> -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yegor256/tacit@gh-pages/tacit-css-1.5.5.min.css"/> -->
<!-- <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@1.*/css/pico.min.css"> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
<style>
  .homepage > img {
    aspect-ratio: 1.67 / 1;
  }
</style>
</head>
<body>
  ${content}
</body>
  `;
}