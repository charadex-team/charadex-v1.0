/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from './config.js';


/* ==================================================================== */
/* Tools
=======================================================================  /

  A bunch of tools I made for the dex to ease my woes
    
======================================================================= */
charadex.tools = {

  // Scrub
  // Scrubs data so its all lowercase with no spaces
  scrub(str) {
    if (!str) return str;
    if (!isNaN(str)) return Number(str);
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  },

  // Similar to scrub
  // Scrubs data so its all lowercase with no spaces
  createKey(str) {
    if (!str) return str;
    return String(str).toLowerCase().replaceAll(" ", "");
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

  // Load files via include
  // Will replace the entire div
  loadIncludedFiles() {
    $(".load-html").each(function () {
      const target = $(this);
      $.get(this.dataset.source, function (data) {
        target.replaceWith(data);
      });
    });
  },

  // Load Page
  // Load selected areas
  loadPage(loadAreaSelector = '', timeout = 500, loadIconSelector = '#loading') {
    setTimeout(function () {
      $(loadIconSelector).hide();
      $(loadAreaSelector).addClass('active');
    }, timeout);
  },
  
  // Change meta information
  updateMeta() {
    try {
      let title =  $('title');
      let titleStr = title.text();
      if ((titleStr).includes('Charadex')) {
        titleStr = titleStr.replace('Charadex', charadex.site.title);
        title.text(titleStr);
        $('meta[name="title"]').attr("content", titleStr);
        $('meta[name="url"]').attr("content", charadex.site.url);
        $('meta[name="description"]').attr("content", charadex.site.description);
      }
      return;
    } catch (err) {
      return console.error(err);
    }
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
  
  // Adds profile links
  addProfileLinks(entry, pageUrl, key = 1) {
    entry.profileid = entry[key];
    entry.profilelink = charadex.url.addUrlParameters(pageUrl, { profile: entry[key] });
  },

  // Try to add the select picker
  addMultiselect (selectElement) {
    try {
      selectElement.selectpicker({
        noneSelectedText : `All`,
        style: '',
        styleBase: 'form-control'
      });
    } catch (err) { 
      console.error('Make sure the Multiselect CDN is in this file.') 
    }
  } 

}



/* ==================================================================== */
/* URL
=======================================================================  /

  We're keeping urls CLEAN this time i s2g
    
======================================================================= */
charadex.url = {

  // Returns the entire URL w/ parameters 
  // https://charadex.com/masterlist.html?param=value
  getUrl(url) {
    return new URL(url || window.location.href).href;
  },

  // Returns the base site URL
  // https://charadex.com
  getSiteUrl() {
    let host = window.location.protocol + window.location.host;
    if (host.includes('localhost')) {
      let fileName = window.location.pathname.split("/");
      fileName.pop();
      let baseFile = fileName.join("/");
      host += baseFile;
    } else if (!host.includes('localhost')) {
      host = charadex.site.url;
    }
    return charadex.url.getUrl(host);
  },

  // Returns the page URL
  // https://charadex.com/masterlist.html
  getPageUrl(page, url) {
    let pageUrl = url ?? charadex.url.getSiteUrl();
    return `${pageUrl.replace(/\/$/, '')}/${page}.html`
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParameters(url) {
    return new URLSearchParams(url || window.location.search)
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParametersObject(url, keys = false) {

    let params = charadex.url.getUrlParameters(url);
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
    for (let k in obj) params += `&${encodeURIComponent(charadex.tools.scrub(k))}=${encodeURIComponent(charadex.tools.createKey(obj[k]))}`;
    if (!url.includes('?')) params = '?' + params.substring(1);
    return url + params;
  },

}



/* ==================================================================== */
/* Data Processor
/* ====================================================================  /

    A library of functions you can use to manage the data
    received from the sheet
    
======================================================================= */
charadex.manageData = {

  /* Sort Array
  ===================================================================== */
  sortArray(sheetArray, property, order = 'asc', orderArrayKey, orderArray = false) {

    let sorted;

    if (charadex.tools.checkArray(orderArray)) {
      const orderMap = new Map(orderArray.map((item, index) => [item, index]));
      sorted = sheetArray.sort((a, b) => {
        const aIndex = orderMap.get(a[orderArrayKey]);
        const bIndex = orderMap.get(b[orderArrayKey]);
        return aIndex - bIndex;
      });
    } else {
      sorted = sheetArray.slice(0).sort(function (a, b) {
        const valA = String(a[property] || '');
        const valB = String(b[property] || '');
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return charadex.tools.scrub(order) === 'asc' ? sorted : sorted.reverse();

  },

  /* Filter Array
  ===================================================================== */
  filterArray(sheetArray, criteria) {

    // Profiles have theri own filter so we want to omit them
    if (criteria.hasOwnProperty('profile')) delete criteria.profile;

    let filterArr = sheetArray.filter(function (item) {
      for (let key in criteria) {

        // Make the values into an array no matter what
        if(!charadex.tools.checkArray(criteria[key])) criteria[key] = [criteria[key]];

        // Scrub criteria
        criteria[key] = criteria[key].map(c => charadex.tools.scrub(c)).filter(c => c !== 'all');

        // If the item is an array, loop through it
        if (charadex.tools.checkArray(item[key])) {
          item[key] = item[key].map(i => charadex.tools.scrub(i));
          for (const name of criteria[key]) if (!item[key].includes(name)) return false;
        } 
        
        // Else check the string
        else if (!criteria[key].includes(charadex.tools.scrub(item[key]))) return false;

      }
      return true;
    });

    return filterArr;

  },

  /* Filter sheet by the page parameters
  ===================================================================== */
  filterByPageParameters(sheetArray) {

    let filterParams = charadex.url.getUrlParametersObject();
    if (!filterParams) return sheetArray;

    let filteredArray = charadex.manageData.filterArray(sheetArray, filterParams);

    return filteredArray;

  },

 /* Relates data to a main sheet via a key
  ===================================================================== */
  async relateData (primaryArray, primaryKey, secondaryPageName, secondaryKey) {

    let scrub = charadex.tools.scrub;
    let secondaryArray = await charadex.importSheet(secondaryPageName);

    for (let primaryEntry of primaryArray) {
      primaryEntry[scrub(secondaryPageName)] = [];
      for (let secondaryEntry of secondaryArray) {
        let secondaryDataArray = secondaryEntry[secondaryKey].split(',');
        for (let prop of secondaryDataArray) {
          if (scrub(primaryEntry[primaryKey]) === scrub(prop)) {
            primaryEntry[scrub(secondaryPageName)].push(secondaryEntry);
          }
        }
      }
    }

  },

  /* Fixes old style of inventories
  ===================================================================== */
  async inventoryFix(profileArray) {

    let itemArr = await charadex.importSheet(charadex.sheet.pages.items);
  
    let inventoryData = [];
    for (let property in profileArray) {
      for (let item of itemArr) {
        if (property === charadex.tools.scrub(item.item) && profileArray[property] !== '') inventoryData.push({
          ... item,
          ... {
            quantity: profileArray[property]
          }
        });
      }
    }
  
    return inventoryData;
  
  },
  
  /* Adds profile links
  ===================================================================== */
  addProfileLinks(pageUrl, key, galleryArray) {
    for (let entry of galleryArray) {
      entry.profileid = entry[key];
      entry.profilelink = charadex.manage.url.addParameters(pageUrl, { profile: entry[key] });
    };
  }

}



/* ==================================================================== */
/* Import Sheet
/* ====================================================================  /

  Does what it says on the box.
    
======================================================================= */
charadex.importSheet = async (sheetPage, sheetId = charadex.sheet.id) => {

  if (!sheetId) return console.error('Missing sheetID.');
  if (!sheetPage) return console.error('Missing sheetPage.');

  // Fetch the sheet
  const importUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${sheetPage}`;

  // Attempt to get it
  const sheetJSON = await fetch(importUrl).then(i => i.text()).catch(err => {
    return console.error(`${err} sheet. Please make sure that the sheet is public and that you're only using the ID.`);
  });

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


export { charadex };