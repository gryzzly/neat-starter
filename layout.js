export function layout(content) {
  return `<!doctype html>
<head>
<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@1.*/css/pico.min.css">
</head>
<body>
  ${content}
</body>
  `;
}