const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("> GO TO RSIM");
  await page.goto("https://www.rocket-simulator.com/csimulator.php", {
    timeout: 0,
  });

  console.log("> FORM SUBMIT");
  await page.$eval('input[name="t1"]', (el) => (el.value = "101"));
  await page.$eval('form[name="form1"]', (form) => form.submit());
  await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 0 });
  console.log("> IDLE");

  page.on("error", () => {
    console.log("Reload");
    page.reload();
  });

  const telemetries = await page.evaluate(() => {
    const rows = document.querySelectorAll("#AutoNumber1 tr");

    const arr = Array.from(rows, (row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(columns, (column) => column.innerText);
    });

    arr.shift();

    return arr;
  });
  console.log("> EVALUATE");

  await browser.close();
  console.log("> CLOSED");

  const indexs = telemetries.shift();
  const mainData = telemetries.map((telemetry) =>
    indexs.map((key, idx) => ({ [key]: telemetry[idx] }))
  );

  console.log(mainData);
})();
