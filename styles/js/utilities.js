/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from './config.js';


/* ==================================================================== */
/* Tools
=======================================================================  /

    
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
    let host = window.location.host;
    if (host === 'localhost') {
      let fileName = window.location.pathname.split("/");
      fileName.pop();
      let baseFile = fileName.join("/");
      host += baseFile;
    }
    return charadex.url.getUrl(window.location.protocol + host);
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

  /* Create Classes for List JS
  ===================================================================== */
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
        if (scrub(primaryEntry[primaryKey]) == scrub(secondaryEntry[secondaryKey])) {
          primaryEntry[scrub(secondaryPageName)].push(secondaryEntry);
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

  if (!sheetId) throw Error('Missing sheetID.');
  if (!sheetPage) throw Error('Missing sheetPage.');

  // Fetch the sheet
  const importUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${sheetPage}`;

  // Attempt to get it
  const sheetJSON = await fetch(importUrl).then(i => i.text()).catch(err => {
    return alert(`${err} sheet. Please make sure that the sheet is public and that you're only using the ID.`);
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
    listConfig.valueNames =  charadex.tools.createListClasses(profileArray);
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
charadex.listFeatures = {};

/* ==================================================================== */
/* Filters
======================================================================= */
charadex.listFeatures.filters = (parameters, selector = 'charadex') => {

  if (!parameters ) return false;

  // Get selection
  const filtersElement = $(`#${selector}-filters`);
  const filterElement = $(`#${selector}-filter`);
  const filterClass = `${selector}-filter`;

  const createFilters = () => {

    // Add filters
    for (let filter in parameters) {

      // Get the filter containers
      let newFilter = filterElement.clone();

      // Remove the id and add a special class
      newFilter
      .removeAttr('id')
      .addClass(filterClass);

      // Find the label and add the filter name
      newFilter
      .find('label')
      .text(filter);

      // Find the select and add the filter name & options
      newFilter
      .find('select')
      .attr('name', charadex.tools.scrub(filter))
      .append(charadex.tools.createSelectOptions(parameters[filter]));

      // Add to the filters container
      filtersElement.append(newFilter);

    }

    // Show the filters
    filtersElement.parents(`#${selector}-filter-container`).show();

    return true;

  } 

  // Create the filters when created;
  createFilters();

  const initializeFilters = (listJs) => {

    if (!listJs) return false;

    // Deal with the Dom
    $(`.${filterClass}`).each(function(el) {
      $(this).on('change', () => {

        // Get the key from the select name attr
        // And whatever the user selected
        let key = $(this).find('select').attr('name');
        let selection = $(this).find('option:selected').val();

        // Filter the list
        if (selection && selection !== 'all') {
          listJs.filter(list => charadex.tools.scrub(list.values()[key]) === selection);
        } else {
          listJs.filter();
        }

      });
    });
    
    // If they're in a container, hide it if there's nothing in it
    listJs.on('updated', (list) => {
      let listClass = $(`.${list.listClass}`);
      let listContainerSelector = `.${selector}-list-container`;
      if (list.matchingItems.length < 1 && listClass.length > 0) {
        listClass.parents(listContainerSelector).hide();
      } else {
        listClass.parents(listContainerSelector).show()
      }
    })

    return true;

  }

  return {
    initializeFilters,
  }

}

/* ==================================================================== */
/* Faux Folders
======================================================================= */
charadex.listFeatures.fauxFolders = (pageUrl, folderParameters, selector = 'charadex') => {

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
  folderElement.parents(`#${selector}-folder-container`).show();

  // Return a lil thing that'll add folders to entries
  const addFolder = (entry, key) => {
    entry.folder = entry[charadex.tools.scrub(key)];
  };

  return addFolder;

}


/* ==================================================================== */
/* Pagination
======================================================================= */
charadex.listFeatures.pagination = (galleryArrayLength, pageAmount = 12, bottomPaginationToggle = true, selector = 'charadex') => {

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
  pagination.parents(`.${selector}-pagination-container`).show();

  // Create the config
  let paginationConfig = {
    page: pageAmount,
    pagination: [
      {
        innerWindow: 1,
        left: 1,
        right: 1,
        item: `<li class='page-item'><a class='page page-link'></a></li>`,
        paginationClass: `${elementSelector}-top`,
      },
    ],
  }

  // If there needs to be a bottom one, set it up
  if (bottomPaginationToggle) paginationConfig.pagination.push(
    {
      innerWindow: 1,
      left: 1,
      right: 1,
      item: `<li class='page-item'><a class='page page-link'></a></li>`,
      paginationClass: `${elementSelector}-bottom`,
    },
  )

  return paginationConfig;

}


/* ==================================================================== */
/* Initialize Search
======================================================================= */
charadex.listFeatures.search = (searchParameters, searchFilterToggle = true, selector = 'charadex') => {

  if (!charadex.tools.checkArray(searchParameters)) return false;

  const searchElement = $(`#${selector}-search`);
  const searchFilter = $(`#${selector}-search-filter`);

  const createSearch = () => {

    // If the filter is toggled, create it
    if (searchFilterToggle) {
      searchFilter.append(charadex.tools.createSelectOptions(searchParameters));
      searchFilter.parent().show();
    }

  }

  createSearch();

  const initializeSearch = (listJs) => {

    if (!listJs) return false;

    // Scrub the parameters
    searchParameters = searchParameters.map(i => charadex.tools.scrub(i));

    // Decide to use search filter or not when searching
    searchElement.on("keyup", () => {

      const selectedFilter = searchFilter.length > 0 ? searchFilter.val() : false;
      const searchString = searchElement.val();

      if (selectedFilter && selectedFilter !== 'all') {
        listJs.search(searchString, [charadex.tools.scrub(selectedFilter)]); // Search by the filter val
      } else {
        listJs.search(searchString, searchParameters); // Else search any of the parameters
      }

    });

    // Show search
    searchElement.parents(`#${selector}-search-container`).show();

  }

  return {
    initializeSearch
  };

}

charadex.listFeatures.prevNextLink = function (pageUrl, galleryArray, profileArray, selector = 'charadex') {

  if (!charadex.tools.checkArray(galleryArray) || !charadex.tools.checkArray(profileArray) || !pageUrl) return false;

  const updateLink = (selector, profile) => {
    const element = $(selector);
    if (profile) {
      element.attr('href', charadex.url.addUrlParameters(pageUrl, { profile: profile.profileid }));
      element.find('span').text(profile.profileid);
      element.show();
    } else {
      element.hide();
    }
  };

  const currentIndex = galleryArray.findIndex((item) => item.profileid === profileArray[0].profileid);
  if (currentIndex === -1) return false;

  updateLink('#entryPrev', galleryArray[currentIndex - 1] || null);
  updateLink('#entryNext', galleryArray[currentIndex + 1] || null);

  $(`#${selector}-prevnext-container`).show();
  
  return true;

};


export { charadex };