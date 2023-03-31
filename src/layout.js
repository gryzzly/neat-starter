export function layout(content) {
  return `<!doctype html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
<script>
if (
  location.hash && 
  (
    location.hash.indexOf('#invite_token=') === 0 || 
    location.hash.indexOf('#access_token=') === 0)
  )
) {
  location.href = \`/admin/\${location.hash}\`;
}
</script>
<style>
  img {
    display: block;
    width: 100%;
  }
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