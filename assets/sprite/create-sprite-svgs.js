const fs = require('fs');

const colors = [
  { hex: '#12eded', name: 'aqua' },
  { hex: '#3bffff', name: 'aqua_light' },
  { hex: '#007a7a', name: 'aqua_dark' },
  { hex: '#64b4b4', name: 'aqua_desaturated' },
  { hex: '#12eda4', name: 'teal' },
  { hex: '#b3ffe6', name: 'teal_light' },
  { hex: '#007a52', name: 'teal_dark' },
  { hex: '#64b49a', name: 'teal_desaturated' },
  { hex: '#12ed12', name: 'green' },
  { hex: '#b3ffb3', name: 'green_light' },
  { hex: '#007a00', name: 'green_dark' },
  { hex: '#64b464', name: 'green_desaturated' },
  { hex: '#a5ed12', name: 'chartreuse' },
  { hex: '#e6ffb3', name: 'chartreuse_light' },
  { hex: '#527a00', name: 'chartreuse_dark' },
  { hex: '#9ab464', name: 'chartreuse_desaturated' },
  { hex: '#eded12', name: 'yellow' },
  { hex: '#ffffb3', name: 'yellow_light' },
  { hex: '#7a7a00', name: 'yellow_dark' },
  { hex: '#b4b464', name: 'yellow_desaturated' },
  { hex: '#edbd12', name: 'gold' },
  { hex: '#ffeeb3', name: 'gold_light' },
  { hex: '#7a6000', name: 'gold_dark' },
  { hex: '#b4a364', name: 'gold_desaturated' },
  { hex: '#ed7d12', name: 'orange' },
  { hex: '#ffd8b3', name: 'orange_light' },
  { hex: '#7a3c00', name: 'orange_dark' },
  { hex: '#b48b64', name: 'orange_desaturated' },
  { hex: '#ed1212', name: 'red' },
  { hex: '#ffb3b3', name: 'red_light' },
  { hex: '#7a0000', name: 'red_dark' },
  { hex: '#b46464', name: 'red_desaturated' },
  { hex: '#ed1294', name: 'fuchsia' },
  { hex: '#ffb3e0', name: 'fuchsia_light' },
  { hex: '#7a0048', name: 'fuchsia_dark' },
  { hex: '#b46494', name: 'fuchsia_desaturated' },
  { hex: '#9912ed', name: 'purple' },
  { hex: '#e2b3ff', name: 'purple_light' },
  { hex: '#4b007a', name: 'purple_dark' },
  { hex: '#9664b4', name: 'purple_desaturated' },
  { hex: '#1212ed', name: 'indigo' },
  { hex: '#b3b3ff', name: 'indigo_light' },
  { hex: '#00007a', name: 'indigo_dark' },
  { hex: '#6464b4', name: 'indigo_desaturated' },
  { hex: '#129ded', name: 'blue' },
  { hex: '#b3e3ff', name: 'blue_light' },
  { hex: '#004e7a', name: 'blue_dark' },
  { hex: '#6497b4', name: 'blue_desaturated' },
];

colors.forEach((color) => {
  // 1 pixel diagonal line
  const path1 = `assets/sprite/svg/${color.name}-diagonal-1px.svg`;
  const svg1 = `
<svg xmlns='http://www.w3.org/2000/svg' width='5' height='5'>
  <rect width='5' height='5' fill='none'/>
  <path d='M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z' stroke='${color.hex}' stroke-width='1' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path1, svg1, (err) => {
    if (err) throw err;
    console.log(`${path1} created!`);
  });


  // 2 pixel diagonal line
  const path2 = `assets/sprite/svg/${color.name}-diagonal-2px.svg`;
  const svg2 = `
<svg xmlns='http://www.w3.org/2000/svg' width='5' height='5'>
  <rect width='5' height='5' fill='none'/>
  <path d='M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z' stroke='${color.hex}' stroke-width='2' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path2, svg2, (err) => {
    if (err) throw err;
    console.log(`${path2} created!`);
  });


  // 3 pixel diagonal line
  const path3 = `assets/sprite/svg/${color.name}-diagonal-3px.svg`;
  const svg3 = `
<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>
  <rect width='10' height='10' fill='none'/>
  <path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='${color.hex}' stroke-width='3' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path3, svg3, (err) => {
    if (err) throw err;
    console.log(`${path3} created!`);
  });


  // 4 pixel diagonal line
  const path4 = `assets/sprite/svg/${color.name}-diagonal-4px.svg`;
  const svg4 = `
<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>
  <rect width='10' height='10' fill='none'/>
  <path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='${color.hex}' stroke-width='4' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path4, svg4, (err) => {
    if (err) throw err;
    console.log(`${path4} created!`);
  });


  // 5 pixel diagonal line
  const path5 = `assets/sprite/svg/${color.name}-diagonal-5px.svg`;
  const svg5 = `
<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>
  <rect width='10' height='10' fill='none'/>
  <path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='${color.hex}' stroke-width='5' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path5, svg5, (err) => {
    if (err) throw err;
    console.log(`${path5} created!`);
  });


  // 6 pixel diagonal line
  const path6 = `assets/sprite/svg/${color.name}-diagonal-6px.svg`;
  const svg6 = `
<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>
  <rect width='10' height='10' fill='none'/>
  <path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='${color.hex}' stroke-width='6' stroke-linecap='square'/>
</svg>`;

  fs.writeFile(path6, svg6, (err) => {
    if (err) throw err;
    console.log(`${path6} created!`);
  });
});
