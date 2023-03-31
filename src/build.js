import fs from 'node:fs';
import path from 'node:path';

import getParse from '../vendor/snarkdown.js';
import { getImageDimensions } from './get-image-dimensions.js';
import { layout } from './layout.js';

const imgixDomain = "https://balex.imgix.net/";
const ucarecdn = "https://10c1520917af0bff2053.ucr.io/"
const balex = "https://7balex.netlify.app/"

// FIXME: make this work with absolute urls from other domains

// Via srcset, the browser knows the resources available 
// and their widths. Via sizes it knows the width of the <img> 
// for a given window width. It can now pick the best
// resource to load.
const imgTemplate = ({src, alt}) => {
  const {width, height, type} = getImageDimensions(src);
  const widths = [width, Math.floor((width/3)*2), Math.floor(width/3)];

  if (type === 'gif') {
    return `<video 
      width="${width}"
      height="${height}" 
      autoplay loop muted webkit-playsinline playsinline
    >
      <source src="${ucarecdn}gif2video/-/format/webm/${balex}${src}" type="video/webm"/>
      <source src="${ucarecdn}gif2video/-/format/mp4/${balex}${src}" type="video/mp4"/>
    </video>`
  }

  const srcset = widths.map(width => 
    `${imgixDomain}/${src}?auto=format&w=${width} ${width}w`
  ).join(',');

  const srcFallback = `${imgixDomain}/${src}?auto=format&w=${widths[0]}`;

  return `<img
    srcset="${srcset}"
    src="${srcFallback}"
    alt="${alt}"
    sizes="100vw"
    lazy="true"
    style="aspect-ratio: ${width}/${height}"
  >`;
};

const parse = getParse({
  img: imgTemplate
});

const buildDir = 'build';

const cmsConfig = 
  JSON.parse(
    fs.readFileSync('./admin/config.yml', 'utf-8')
    // remove yml-style comments before parsing JSON
      .replace(/(?:\s*)#.*/gm,'')
  );

function getProducts() {
  const productsPath = cmsConfig.collections[0].folder;
  
  if (getProducts.products) {
    return getProducts.products;
  }
  // todo: find page matching the path of this route and 
  // add its content to the page
  const products = fs.readdirSync(productsPath)
    .map(fileName => {
      const productPath = path.join(productsPath, fileName);
      const productFile = {
        path: productPath,
        content: JSON.parse(fs.readFileSync(productPath, 'utf8')),
        name: path.parse(productPath).name
      };
      productFile.content.fileName = productFile.name;
      return productFile;
    })
    .reduce((result, current)=>{
      result[current.name] = current.content;
      return result;
    }, {});

  getProducts.products = products;

  return products;
}

function getPageData() {
  if (getPageData.pages) return pages;
  const pagesPath = cmsConfig.collections[1].folder;
  const pages = fs.readdirSync(pagesPath)
    .map(fileName => {
      const pagePath = path.join(pagesPath, fileName);
      const pageFile = {
        path: pagePath,
        content: JSON.parse(fs.readFileSync(pagePath, 'utf8')),
      };
      pageFile.name = pageFile.content.path;
      return pageFile;
    })
    .reduce((result, current) => {
      result[current.name] = current.content;
      return result;
    }, {});
  return pages;
}

const routes = [
  {
    path: '/',
    getData() {
      const products = getProducts();
      
      return {
        products,
        page: getPageData()['/'],
      }
    },
    template({products, page}) {
      return `<div class="homepage">
        <h2>${page.title}</h2>
        ${imgTemplate({src: page.image, alt: page.title })}
        ${
          Object.values(products).map(
            ({title, fileName}) => `<li><a href="/products/${fileName}">${title}</a></li>`
          ).join('')
        }
        </div>
      `
    }
  },
  {
    path: ({id}) => `/products/${id}`,
    getPathsAndData() {
      return Object.entries(getProducts()).map(([name, product]) => ({
        pathArgument: {id: name},
        data: product
      }));
    },
    template({title, description, dimensions, photo}) {
      return `<div class="product">
        <h1>${title}</h1>
        <h2>${parse(description)}</h2>
        ${imgTemplate({src: photo, alt: `фотография ${title}`})}
        <dl>
          <dt>ширина</dt>
          <dd>${dimensions.width}</dd>
          <dt>длина</dt>
          <dd>${dimensions.length}</dd>
        </dl>
    </div>`
    } 
  }
];

const pages = {};
routes.forEach(route => {
  if (typeof route.path === 'string') {
    pages[route.path] = layout(route.template(route.getData()));
  }
  if (typeof route.path === 'function') {
    route.getPathsAndData().forEach(subRoute => {
      pages[route.path(subRoute.pathArgument)] = 
        layout(route.template(subRoute.data));
    });
  }
});

Object.entries(pages).map(([path, content]) => {
  console.log(path);
  path = `${buildDir}${path}`;

  if (path.endsWith('/')) {
    path += '/index.html';
  }
  if (!path.endsWith('.html')) {
    path += '/index.html';
  }

  // ensurePath
  const dir = path.replace(/index\.html$/, '');
  fs.existsSync(dir) || fs.mkdirSync(dir, {recursive: true});

  fs.writeFileSync(path, content);
});

console.log(pages);
// TODO:
// generate pages from template for data on route