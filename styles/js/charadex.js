/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from './config.js';


/* ==================================================================== */
/* Tools
=======================================================================  /

    You can use this method to grab these URLs at any time

    console.log(createUrl.fullUrl);
    console.log(createUrl.addParams(createUrl.pageUrl, {'design': 'CHA0001'}));
    
======================================================================= */
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
  
  // Adds profile links
  addProfileLinks(entry, pageUrl, key = 1) {
    entry.profileid = entry[key];
    entry.profilelink = charadex.url.addUrlParameters(pageUrl, { profile: entry[key] });
  }

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
  getUrlParameters(url) {
    return new URLSearchParams(url || window.location.search)
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParameterObject(url, keys = false) {

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
    for (let k in obj) params += `&${encodeURIComponent(charadex.tools.scrub(k))}=${encodeURIComponent(charadex.tools.scrub(obj[k]))}`;
    if (!url.includes('?')) params = '?' + params.substring(1);
    return url + params;
  },

}



/* ==================================================================== */
/* Import Sheet
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



/* ==================================================================== */
/* Build List
/* ====================================================================  /

  list
  params
  selector
    
======================================================================= */
charadex.buildList = (selector = 'charadex') => {

  let listConfig = {
    listClass: `${selector}-list`,
    item: `${selector}-gallery-item`,
  }
  
  /* Initialize Gallery
  ===================================================================== */
  const initializeGallery = (galleryArray, additionalListConfigs, gallerySelector) => {

    // Check if there's an array
    if (!charadex.tools.checkArray(galleryArray)) return false;

    // Create list classes
    listConfig.valueNames =  charadex.tools.createListClasses(galleryArray);

    // Return the list
    return new List(gallerySelector || `${selector}-gallery`, {...listConfig, ...additionalListConfigs}, galleryArray);

  };

  /* Attempt to get profile Array
  ===================================================================== */
  const getProfile = (galleryArray) => {

    // Check the parameters
    let pageParameter = charadex.url.getUrlParameters().get('profile');
    if (!pageParameter) return false;

    // Attempt to find the profile
    let profile = galleryArray.find((entry) => {
      return charadex.tools.scrub(entry.profileid) === charadex.tools.scrub(pageParameter)
    });

    // Return the profile in an array if it exists 
    return profile ? [profile] : false;
  
  };

  /* Initialize Profile
  ===================================================================== */
  const initializeProfile = (profileArray, profileSelector) => {

    // Check if there's an array
    if (!charadex.tools.checkArray(profileArray)) return false;

    // Create list classes & update the item name
    listConfig.valueNames =  charadex.manage.data.createListClasses(profileArray);
    listConfig.item = `${selector}-profile`;

    // Return the list
    return new List(profileSelector || `${selector}-gallery`, listConfig, profileArray);

  };

  return {
    initializeGallery,
    getProfile,
    initializeProfile
  }

}

/* ==================================================================== */
/* Features
/* ====================================================================  /

  list
  params
  selector
    
======================================================================= */
charadex.features = {};


charadex.features.fauxFolders = (pageUrl, folderParameters, selector = 'charadex') => {

  if (!pageUrl || !charadex.tools.checkArray(folderParameters) || !selector) return false;

  // Get the elements
  const folderElement = $(`#${selector}-folders`);
  const buttonElement = $(`#${selector}-folder`).clone();

  // Loop through parameters and add them to the folder element
  for (let key of folderParameters) {
    buttonElement.find('.btn')
      .text(key)
      .attr('href', charadex.url.addUrlParameters(pageUrl, { folder: key }));
    folderElement.append(buttonElement);
  }

  // Show the folders
  folderElement.parents(".folder-container").show();

  // Return a lil thing that'll add folders to entries
  const addFolder = (entry, key) => {
    entry.folder = entry[charadex.tools.scrub(key)];
  };

  return addFolder;

}


/* ==================================================================== */
/* Pagination
======================================================================= */
charadex.features.pagination = (pageAmount, galleryArrayLength, selector = 'charadex') => {

  if (!pageAmount || !galleryArrayLength || !selector) return false;
  if (galleryArrayLength <= pageAmount) return false;

  // Get our selectors
  const elementSelector = `${selector}-pagination`;
  const pagination = $(`.${elementSelector}`);

  // Create the buttons
  pagination.next().on('click', () => {
    const nextElement = $('.pagination .active').next().children('a')[0];
    if (nextElement) nextElement.click();
  });

  pagination.prev().on('click', () => {
    const prevElement = $('.pagination .active').prev().children('a')[0];
    if (prevElement) prevElement.click();
  });

  // Show the container
  pagination.parents(`.pagination-container`).show();

  return {
    page: pageAmount,
    pagination: [
      {
        innerWindow: 1,
        left: 1,
        right: 1,
        item: `<li class='page-item'><a class='page page-link'></a></li>`,
        paginationClass: `${elementSelector}-top`,
      },
      {
        innerWindow: 1,
        left: 1,
        right: 1,
        item: `<li class='page-item'><a class='page page-link'></a></li>`,
        paginationClass: `${elementSelector}-bottom`,
      },
    ],
  };

}



/* ==================================================================== */
/* Initialize Search
======================================================================= */
charadex.features.search = (listJs, searchParameters, searchFilterToggle = true, selector = 'charadex') => {

  if (!listJs || !charadex.tools.checkArray(searchParameters) || !selector) return false;

  const searchElement = $(`#${selector}-search`);
  const searchFilter = $(`#${selector}-search-filter`);

  // If the filter is toggled, create it
  if (searchFilterToggle) {
    searchFilter.append(charadex.tools.createSelectOptions(searchParameters));
    searchFilter.parent().show();
  }

  // Decide to use search filter or not when searching
  searchElement.on("keyup", () => {

    const selectedFilter = searchFilter.length > 0 ? searchFilter.val() : false;
    const searchString = searchElement.val();

    if (selectedFilter && selectedFilter !== 'all') {
      listJs.search(searchString, [selectedFilter]);
    } else {
      listJs.search(searchString, searchColumns);
    }

  });

  // Show search
  searchElement.parents(".search-container").show();

  return true;

}


/* ==================================================================== */
/* Initialize
/* ====================================================================  /

  list
  params
  selector
    
======================================================================= */
charadex.initialize = async (dataArr, config, dataCallback) => {

  if (!config) throw Error('No configuration added.');

  // Set up
  let pageUrl = charadex.url.getBaseUrl();
  let folders = false;

  // Get our data
  let charadexData = dataArr || await charadex.importSheet(config.sheetId || charadex.sheet.id, config.sheetPage);

  // Add Folders
  if (config.fauxFolder?.toggle) folders = charadex.features.fauxFolders(pageUrl, config.fauxFolder.parameters);

  // Add profile information
  for (let entry of charadexData) {
    charadex.tools.addProfileLinks(entry, pageUrl, config.profileKey); // Go ahead and add profile keys just in case
    if (folders) folders(entry, config.fauxFolder.dataKey); // If folders, add folder info
  }

  console.log(charadexData);
  // Initialize the list
  let list = charadex.buildList();

  // Let us manipulate the data before it gets to the list
  if (typeof dataCallback === 'function') {
    dataCallback(charadexData);
  }

  // Create Profile
  const createProfile = () => {

  }

  // Create Gallery
  const createGallery = () => {

    let additionalListConfigs = {};

    // Add Pagination
    if (config.pagination?.toggle) {
      let pagination = charadex.features.pagination(config.pagination.itemAmount, charadexData.length);
      if (pagination) additionalListConfigs = { ...additionalListConfigs, ...pagination };
    }

    // Initialize Gallery
    let gallery = list.initializeGallery(charadexData, additionalListConfigs);

    // Create Search
    if (config.search?.toggle) {
      charadex.features.search(gallery, config.search.parameters);
    }

  }

  return createGallery();

}


export { charadex };