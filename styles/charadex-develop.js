
/* ==================================================================== */
/* Load Header and Footer
======================================================================= */
$(function () {
  $(".load-html").each(function () { $(this).load(this.dataset.source) });
});


/* ================================================================ */
/* QOL Funcs
/* ================================================================ */
let charadex = {};


charadex.tools = {

  // Scrub
  // Scrubs data so its all lowercase with no spaces
  scrub(str) {
    if (!str) return str;
    if (!isNaN(str)) return Number(str);
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  },

  // Create Select Options
  // Creates select options from an array
  createSelectOptions(optionArray) {
    let options = [];
    for (let value of optionArray) {
      options.push(`<option value="${charadex.tools.scrub(value)}">${value}</option>`);
    };
    return options;
  },

  // Load Page
  // Loads a page idk
  loadPage(loadAreaSelector = '', loadIconSelector = '#loading', timeout = 500) {
    setTimeout(function () {
      $(loadIconSelector).hide();
      $(loadAreaSelector).addClass('active');
    }, timeout);
  },

  // Check Array
  // Check if array is actually an array and has info
  checkArray(arr) {
    return (arr && Array.isArray(arr) && arr.length > 0);
  },

  // Create list classes for List.JS
  // All things with the word 'image' will be made into images
  // And all things with the word 'link' will be made into links
  createListClasses(sheetArray) {

    let classArr = [...new Set(sheetArray.slice(0, 5).flatMap(Object.keys))];
    let newArr = [];
    for (let i in classArr) {
      newArr[i] = classArr[i];
      if (classArr[i].includes('image') || classArr[i].includes('avatar') || classArr[i].includes('thumbnail')) {
        newArr[i] = { name: classArr[i], attr: 'src' };
      }
      if (classArr[i].includes('link') || classArr[i].includes('toyhouse')) {
        newArr[i] = { name: classArr[i], attr: 'href' };
      }
    }

    return newArr;

  },

}


/* ==================================================================== */
/* URL
=======================================================================  /

    You can use this method to grab these URLs at any time

    console.log(createUrl.fullUrl);
    console.log(createUrl.addParams(createUrl.pageUrl, {'design': 'CHA0001'}));
    
======================================================================= */
charadex.url = {

  // Returns the entire URL w/ parameters 
  // https://charadex.com/masterlist.html?param=value
  getUrl(url) {
    return new URL(url || window.location.href).href;
  },

  // Returns the base site URL
  // https://charadex.com
  getSiteUrl(url) {
    let pageUrl = url ?? charadex.url.getUrl();
    return pageUrl.split('?')[0].replace(/\/[^\/]+$/, "").replace(/\/$/, '');
  },

  // Returns the page URL without the paramenters
  // https://charadex.com/masterlist.html
  getBaseUrl(url) {
    let pageUrl = url ?? charadex.url.getUrl();
    return pageUrl.split('?')[0].replace(/\/$/, '');
  },

  // Returns the page URL
  // https://charadex.com/masterlist.html
  getPageUrl(page, url) {
    let pageUrl = url ?? charadex.url.getSiteUrl();
    return `${pageUrl.replace(/\/[^\/]+$/, "")}/${page}.html`
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParameters(url, keys = false) {

    let params = new URLSearchParams(url || window.location.search);
    if (params.size === 0) return false;

    let newObject = {};
    params.forEach((value, key) => {
      let newValue = !value ? '' : String(value).split(',').filter(function (i) { return i !== 'all' })
      if (charadex.tools.checkArray(newValue)) {
        if (charadex.tools.checkArray(keys)) {
          if (keys.includes(key)) newObject[key] = newValue;
        } else {
          newObject[key] = newValue;
        }
      }
    });

    return newObject;

  },

  // Adds parameters based on an object
  addUrlParameters(url, obj) {
    let params = '';
    for (let k in obj) params += `&${encodeURIComponent(charadex.tools.scrub(k))}=${encodeURIComponent(charadex.tools.scrub(obj[k]))}`;
    if (!url.includes('?')) params = '?' + params.substring(1);
    return url + params;
  },

}


/* ==================================================================== */
/* Import SHeet
======================================================================= */
charadex.importSheet = async (sheetId, sheetPage) => {

  // Fetch the sheet
  const importUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${sheetPage}`;
  const sheetJSON = await fetch(importUrl).then(i => i.text());

  // Parse the text
  const sliceJSON = JSON.parse(sheetJSON.substring(47).slice(0, -2));

  // Grab column headers
  const col = [];
  if (sliceJSON.table.cols[0].label) {
    for (let headers of sliceJSON.table.cols) {
      if (headers.label) col.push(headers.label.toLowerCase().replace(/\s/g, ""));
    };
  }

  // Scrubs columns and puts them in a readable object
  const scrubbedData = [];
  for (let info of sliceJSON.table.rows) {
    const row = {};
    const isBoolean = val => 'boolean' === typeof val;
    col.forEach((ele, ind) => {
        row[ele] = info.c[ind] != null ? 
        info.c[ind].f != null && !isBoolean(info.c[ind].v) ? 
        info.c[ind].f : info.c[ind].v != null ? 
        info.c[ind].v : "" : "";
    });
    scrubbedData.push(row);
  };

  // Filter out everything that says hide
  let publicData = scrubbedData.filter(i => !i['hide']);

  // Return Data
  return publicData;

};




let testFunction = async () => {

  console.log(await charadex.importSheet('1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak', 'masterlist'));

}; testFunction();