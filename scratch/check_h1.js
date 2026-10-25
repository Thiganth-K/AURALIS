const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return 'NO H1 FOUND';
    const rect = h1.getBoundingClientRect();
    const comp = window.getComputedStyle(h1);
    const parent = h1.parentElement;
    const parentComp = window.getComputedStyle(parent);
    return {
      text: h1.innerText,
      rect,
      display: comp.display,
      visibility: comp.visibility,
      opacity: comp.opacity,
      color: comp.color,
      parentRect: parent.getBoundingClientRect(),
      parentDisplay: parentComp.display,
      parentOpacity: parentComp.opacity
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
