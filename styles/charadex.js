/* ==================================================================== */
/* URLs
======================================================================= */
let url = new URL(window.location.href);
let baseURL = window.location.origin + window.location.pathname;
let folderURL = window.location.origin + '/' + window.location.pathname.replace(/\/[^\/]+$/, "");
let urlParams = new URLSearchParams(window.location.search);


/* ==================================================================== */
/* Load Header and Footer
======================================================================= */
$(function () {
    $(".load-html").each(function () {$(this).load(this.dataset.source)});
});


/* ==================================================================== */
/* Clean Sheet Data
======================================================================= */
const scrubData = (sheetData) => {

    cleanJson = JSON.parse(sheetData.substring(47).slice(0, -2));

    // Grab column headers
    const col = [];
    if (cleanJson.table.cols[0].label) {
        cleanJson.table.cols.forEach((headers) => {
            if (headers.label) {
                col.push(headers.label.toLowerCase().replace(/\s/g, ""));
            }
        });
    }

    // Scrubs columns and puts them in a readable object
    const scrubbedData = [];
    cleanJson.table.rows.forEach((info, num) => {
        const row = {};
        const isBoolean = val => 'boolean' === typeof val;
        col.forEach((ele, ind) => {
            row[ele] = info.c[ind] != null ? info.c[ind].f != null && !isBoolean(info.c[ind].v) ? info.c[ind].f : info.c[ind].v != null ? info.c[ind].v : "" : "";
        });
        scrubbedData.push(row);
    });

    let publicData = scrubbedData.filter((i) => { return i['hide'] !== true; });

    return publicData;

}


/* ================================================================ */
/* Sort Options
/* ================================================================ */
let optionSorter = (options) => {

    // Clean up the sheetID - in case they used a link instead
    let scrubbedSheetId = sheetID ? sheetID.includes('/d/') ? sheetID.split('/d/')[1].split('/edit')[0] : sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc";

    // Call all options, make defaults of our own
    let userOptions = options;
    let defaultOptions = {

        sheetID: scrubbedSheetId,
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "masterlist",

        fauxFolderColumn: userOptions.fauxFolderColumn ? keyCreator(userOptions.fauxFolderColumn) : false,
        filterColumn: userOptions.filterColumn ? keyCreator(userOptions.filterColumn) : false,
        searchFilterParams: userOptions.searchFilterParams ? addAll(userOptions.searchFilterParams) : false,

    }

    // Merge options
    let mergedOptions = {...userOptions, ...defaultOptions};

    return mergedOptions;

}


/* ================================================================ */
/* QOL Funcs
/* ================================================================ */
let sheetPage = (id, pageName) => {
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${pageName}`
};

let fetchSheet = async (page, sheet = sheetID) => {
    const JSON = await fetch(sheetPage(sheet, page)).then(i => i.text());
    return scrubData(JSON);
}

let keyCreator = (key) => {
    return key.toLowerCase().replace(/\s/g, "");
};

let addAll = (key) => {
    key.unshift("All")
    return key;
};

let addOptions = (arr, filter) => {
    arr.forEach((val) => {
        let optionHTML = document.createElement('option');
        optionHTML.value = val.toLowerCase().replace(/\s/g, "");
        optionHTML.textContent = val;
        filter.append(optionHTML);
    });
};

let loadPage = () => {
    $('#loading').hide();
    $('.softload').addClass('active');
}

let urlParamFix = (key, folder, params = urlParams) => {
    return '?' + (url.search.includes(folder) ? folder + '=' + params.get(folder) + '&' : '') + `${key}=`;
};


/* ================================================================ */
/* Get a card's log
/* ================================================================ */
let getLog = (log, item, key = 'id') => {
    if ($("#log-table").length != 0) {

        let logArr = [];
        log.forEach((i) => {
            if (i[key].toLowerCase() === item[key].toLowerCase()) {
                let newLog = {
                    timestamp: i.timestamp,
                    reason: i.reason,
                };
                logArr.push(newLog);
            };
        });

        // Create Rows
        let rows = [];
        logArr.forEach((i) => {
            let HTML = $("#log-entry").clone();
            HTML.find(".timestamp").html(i.timestamp);
            HTML.find(".reason").html(i.reason);
            rows.push(HTML);
        });

        $("#log-table").html(rows);

    }
}


/* ================================================================ */
/* Get Keys
/* Makes an array for List.js to use
/* ================================================================ */
let sheetArrayKeys = (arr) => {
    let itemArray = Object.keys(arr[0]);
    if (itemArray.indexOf('cardlink')) itemArray[itemArray.indexOf('cardlink')] = { name: 'cardlink', attr: 'href' };
    if (itemArray.indexOf('cardlinkalt')) itemArray[itemArray.indexOf('cardlinkalt')] = { name: 'cardlinkalt', attr: 'href' };
    if (itemArray.indexOf('link')) itemArray[itemArray.indexOf('link')] = { name: 'link', attr: 'href' };
    if (itemArray.indexOf('image')) itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };
    return itemArray;
};


/* ================================================================ */
/* Pagination
/* ================================================================ */
let showPagination = (arr, amt) => {
    $('.btn-next').on('click', () => { $('.pagination .active').next().children('a')[0].click(); })
    $('.btn-prev').on('click', () => { $('.pagination .active').prev().children('a')[0].click(); })
    if (arr.length > amt) $('#charadex-pagination').show()
}


/* ================================================================ */
/* Search Filter
/* ================================================================ */
let charadexSearch = (info, searchArr) => {

    if (searchArr && searchArr.length > 2) {
        addOptions(searchArr, $('#search-filter'));
        $('#search-filter').parent().show();
        $('#search').addClass('filtered');
    }

    let arr = searchArr.map(function (v) { return v.toLowerCase().replace(/\s/g, ""); });

    $('#search').on('keyup', () => {
        let selection = $("#search-filter option:selected").val();
        let searchString = $('#search').val();
        if (selection && selection != 'all') {
            info.search(searchString, [selection]);
        } else {
            info.search(searchString, arr);
        }
    });

    $('#charadex-filters').show();

};



/* ================================================================ */
/* Custom Filter
/* ================================================================ */
let charadexFilterSelect = (info, arr, key) => {
    if (key) {

        const filterArr = [...new Set(arr.map(i => i[key]))];

        if (filterArr.length > 2) {

            addOptions(addAll(filterArr), $('#filter'));

            $("#filter").on('change', () => {
                let selection = $("#filter option:selected").text().toLowerCase();
                if (selection && !selection.includes('all')) {
                    info.filter(function (i) { return i.values()[key].toLowerCase() == selection; });
                } else {
                    info.filter();
                }
            });

            $('#filter').parent().show();
            $('#charadex-filters').show();

        }
    }
};



/* ================================================================ */
/* Faux Folder Function
/* ================================================================ */
let fauxFolderButtons = (array, fauxFolder, params = urlParams) => {

    if (array[0].hasOwnProperty(fauxFolder)) {

        // Creates Param Object Array
        let urlParamArray = [];
        const uniqueArray = [...new Set(array.map(i => i[fauxFolder]))].filter(n => n);
        uniqueArray.forEach((i) => {
            urlParamArray.push($('#charadex-filter-buttons a').clone().text(i).attr("href", baseURL + '?' + fauxFolder + '=' + i.toLowerCase()));
        });

        if (urlParamArray.length > 1) {

            // Adds All button
            urlParamArray.unshift($('#charadex-filter-buttons a').text('All').attr("href", baseURL));

            // Smacks the links in your flex column
            let btnCols = [];
            for (var i in urlParamArray) { btnCols.push($('#charadex-filter-buttons').html(urlParamArray[i]).clone()); }
            $('#filter-buttons .row').append(btnCols);

            // Show Buttons
            $('#filter-buttons').show();

        }

    }

    // Filters out information based on URL parameters
    if (params.has(fauxFolder) && fauxFolder) {
        return array.filter((i) => i[fauxFolder].toLowerCase() === params.get(fauxFolder).toLowerCase());
    } else {
        return array;
    }

};




/* ================================================================ */
/* Prev and Next Links
/* ================================================================ */
let prevNextLinks = (array, url, params, currParam, key, altkey = false) => {
    if ($("#entryPrev").length != 0) {

        let index = array.map(function (i) {return i[key];}).indexOf(currParam.get(key));
        let leftItem = array[index - 1];
        let rightItem = array[index + 1];

        // Basically a special declaration for the masterlist
        let chooseKey = altkey ? altkey : key;

        // Prev
        if (leftItem) {
            $("#entryPrev").attr("href", url + params + leftItem[chooseKey]);
            $("#entryPrev span").text(leftItem[chooseKey]);
        } else {
            $("#entryPrev i").remove();
        }

        // Next
        if (rightItem) {
            $("#entryNext").attr("href", url + params + rightItem[chooseKey]);
            $("#entryNext span").text(rightItem[chooseKey]);
        } else {
            $("#entryNext i").remove();
        }

        // Back to masterlist (keeps species parameter)
        $("#masterlistLink").attr("href", url);
        $('#prevNext').show();

    }
};


/* ==================================================================== */
/* Charadex w/ Gallery and Cards
======================================================================= */
const charadexLarge = async (options) => {

    // Sort through options
    const charadexInfo = optionSorter(options);

    // Grab the sheet
    let sheetArray = await fetchSheet(charadexInfo.sheetPage);

    // Grab all our url info
    let cardKey = Object.keys(sheetArray[0])[0];
    let preParam = urlParamFix(cardKey, charadexInfo.fauxFolderColumn);

    // Create faux folders
    // Filter through array based on folders
    if (charadexInfo.fauxFolderColumn) sheetArray = fauxFolderButtons(sheetArray, charadexInfo.fauxFolderColumn);

    // Reverse based on preference
    charadexInfo.itemOrder == 'asc' ? sheetArray.reverse() : '';

    // Add card links to the remaining array
    for (var i in sheetArray) { sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][cardKey]; }

    // Decide if the url points to profile or entire gallery
    if (urlParams.has(cardKey)) {

        // Render the prev/next links on profiles
        prevNextLinks(sheetArray, baseURL, preParam, urlParams, cardKey);

        // List.js options
        let itemOptions = {
            valueNames: sheetArrayKeys(sheetArray),
            item: 'charadex-card',
        };

        // Filter out the right card
        let singleCard = sheetArray.filter((i) => (i[cardKey] === urlParams.get(cardKey)))[0];

        // Render card
        let charadexItem = new List("charadex-gallery", itemOptions, singleCard);


    } else {


        // Create the Gallery

        let galleryOptions = {
            item: 'charadex-entries',
            valueNames: sheetArrayKeys(sheetArray),
            searchColumns: charadexInfo.searchFilterParams,
            page: charadexInfo.itemAmount,
            pagination: [{
                innerWindow: 1,
                left: 1,
                right: 1,
                item: `<li class='page-item'><a class='page page-link'></a></li>`,
                paginationClass: 'pagination-top',
            }],
        };

        // Render Gallery
        let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

        // Make filters workie
        charadexFilterSelect(charadex, sheetArray, charadexInfo.filterColumn);
        charadexSearch(charadex, charadexInfo.searchFilterParams);

        // Show pagination
        showPagination(sheetArray, charadexInfo.itemAmount);

    }

};


/* ==================================================================== */
/* Charadex w/ just Gallery
======================================================================= */
const charadexSmall = async (options) => {

    // Sort through options
    const charadexInfo = optionSorter(options);

    // Grab the sheet
    let sheetArray = await fetchSheet(charadexInfo.sheetPage);

    // Create the Gallery
    let galleryOptions = {
        item: 'charadex-entries',
        valueNames: sheetArrayKeys(sheetArray),
    };

    // Render Gallery
    let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

};


/* ==================================================================== */
/* Masterlist Only
======================================================================= */
const masterlist = async (options) => {

    // Sort through options
    const charadexInfo = optionSorter(options);

    // Grab the sheet
    let sheetArray = await fetchSheet(charadexInfo.sheetPage);

    // Grab all our url info
    let cardKey = Object.keys(sheetArray[0])[3];
    let cardKeyAlt = Object.keys(sheetArray[0])[0];

    let preParam = urlParamFix(cardKey, charadexInfo.fauxFolderColumn);

    // Create faux folders
    // Filter through array based on folders
    if (charadexInfo.fauxFolderColumn) sheetArray = fauxFolderButtons(sheetArray, charadexInfo.fauxFolderColumn);

    // Reverse based on preference
    charadexInfo.itemOrder == 'asc' ? sheetArray.reverse() : '';

    // Add card links to the remaining array
    for (var i in sheetArray) { 
        sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][cardKey]; 
        sheetArray[i].cardlinkalt = baseURL + urlParamFix(cardKeyAlt, charadexInfo.fauxFolderColumn) + sheetArray[i][Object.keys(sheetArray[0])[0]]; 
    }

    // Decide if the url points to profile or entire gallery
    if (urlParams.has(cardKey) || urlParams.has(cardKeyAlt)) {

        // Filter out the right card
        let currCardKey = urlParams.has(cardKey) ? cardKey : cardKeyAlt;
        let singleCard = sheetArray.filter((i) => (i[currCardKey] === urlParams.get(currCardKey)))[0];

        // Grab the log sheet and render log
        let logArray = await fetchSheet(charadexInfo.logSheetPage);
        getLog(logArray, singleCard);

        // List.js options
        let itemOptions = {
            valueNames: sheetArrayKeys(sheetArray),
            item: 'charadex-card',
        };

        // Render the prev/next links on profiles
        prevNextLinks(sheetArray, baseURL, preParam, urlParams, currCardKey, cardKey);

        // Render card
        let charadexItem = new List("charadex-gallery", itemOptions, singleCard);


    } else {

        // Show pagination
        showPagination(sheetArray, charadexInfo.itemAmount);

        // Create the Gallery
        let galleryOptions = {
            item: 'charadex-entries',
            valueNames: sheetArrayKeys(sheetArray),
            searchColumns: charadexInfo.searchFilterParams,
            page: charadexInfo.itemAmount,
            pagination: [{
                innerWindow: 1,
                left: 1,
                right: 1,
                item: `<li class='page-item'><a class='page page-link'></a></li>`,
                paginationClass: 'pagination-top',
            }],
        };

        // Render Gallery
        let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

        // Make filters workie
        charadexFilterSelect(charadex, sheetArray, charadexInfo.filterColumn);
        charadexSearch(charadex, charadexInfo.searchFilterParams);


    }

};


/* ==================================================================== */
/* Inventories
======================================================================= */
const inventory = async (options) => {

    // Sort through options
    const charadexInfo = optionSorter(options);

    // Grab the sheet
    let sheetArray = await fetchSheet(charadexInfo.sheetPage);

    // Grab all our url info
    let cardKey = Object.keys(sheetArray[0])[0];
    let preParam = `?${cardKey}=`;

    // Put in alphabetical order
    sheetArray.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));

    // Add card links to the remaining array
    for (var i in sheetArray) { sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][cardKey]; }

    // Decide if the url points to profile or entire gallery
    if (urlParams.has(cardKey)) {

        // Fetch item info from the item sheet
        let itemSheetArr = await fetchSheet(charadexInfo.itemSheetPage);
        let itemCardKey = Object.keys(itemSheetArr[0])[0];

        // List.js options
        let itemOptions = {
            valueNames: sheetArrayKeys(sheetArray),
            item: 'charadex-card',
        };

        // Filter out the right card
        let singleCard = sheetArray.filter((i) => (i[cardKey] === urlParams.get(cardKey)))[0];

        // Merge the user's inventory with the item sheet
        // Also remove any items they dont have atm
        let inventoryItemArr = [];
        itemSheetArr.forEach((i) => {
            for (var c in singleCard) {
                if (c === keyCreator(i.item) && ((singleCard[keyCreator(i.item)] !== "0" && singleCard[keyCreator(i.item)] !== ""))) {
                    let inventoryItems = {
                        type: i.type,
                        item: i.item,
                        image: i.image,
                        itemlink: folderURL + "/items.html?" + itemCardKey + "=" + i[itemCardKey],
                        amount: singleCard[keyCreator(i.item)],
                    };
                    inventoryItemArr.push(inventoryItems);
                };
            }
        });

        // Sort items by type if applicable
        if (charadexInfo.sortTypes) {
            inventoryItemArr.sort(function (a, b) {
                return charadexInfo.sortTypes.indexOf(a.type) - charadexInfo.sortTypes.indexOf(b.type);
            });
        };

        // Group by the item type
        let orderItems = Object.groupBy(inventoryItemArr, ({ type }) => type);

        // Create Rows
        let rows = [];
        for (var i in orderItems) {

            // Get the headers and cols
            let cols = [];
            orderItems[i].forEach((v) => {
                let HTML = $("#item-list-col").clone();
                HTML.find(".item-img").attr('src', v.image);
                HTML.find(".itemlink").attr('href', v.itemlink);
                HTML.find(".item").html(v.item);
                HTML.find(".amount").html(v.amount);
                cols.push(HTML);
            });

            // Smack everything together
            let rowHTML = $("#item-list-section").clone().html([
                $("#item-list-header").clone().html(i),
                $("#item-list-row").clone().html(cols)
            ]);

            rows.push(rowHTML);

        };

        // Make items show up
        $("#item-list").html(rows);

        // Grab the log sheet and render log
        let logArray = await fetchSheet(charadexInfo.logSheetPage);
        getLog(logArray, singleCard, "username");

        // Render card
        let charadexItem = new List("charadex-gallery", itemOptions, singleCard);


    } else {

        // Show pagination
        showPagination(sheetArray, charadexInfo.itemAmount);

        // Create the Gallery
        let galleryOptions = {
            item: 'charadex-entries',
            valueNames: sheetArrayKeys(sheetArray),
            searchColumns: [cardKey],
            page: charadexInfo.itemAmount,
            pagination: [{
                innerWindow: 1,
                left: 1,
                right: 1,
                item: `<li class='page-item'><a class='page page-link'></a></li>`,
                paginationClass: 'pagination-top',
            }],
        };

        // Render Gallery
        let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

        // Make filters workie
        charadexSearch(charadex, [cardKey]);


    }

};


/* ==================================================================== */
/* This is just to fill out some of the front page automatically
/* You're free to delete and create something yourself!
======================================================================= */
const frontPage = (options) => {

    const charadexInfo = optionSorter(options);

    // Events
    let addEvents = async () => {
        if ($("#prompt-gallery").length != 0) {
            if ( charadexInfo.numOfPrompts != 0) {

                // Grab dah sheet
                let events = await fetchSheet(charadexInfo.promptSheetPage);
                let cardKey = Object.keys(events[0])[0];
    
                // Sort by End Date
                let newestEvents = events.sort(function (a, b) {
                    var c = new Date(a.enddate);
                    var d = new Date(b.enddate);
                    return d - c;
                });
    
                // Show x Amount on Index
                let indexEvents = newestEvents.slice(0, charadexInfo.numOfPrompts);
    
                // Add card link
                for (var i in indexEvents) { indexEvents[i].cardlink = folderURL + "prompts.html?" + cardKey + "=" + indexEvents[i][cardKey]; }
    
                // Nyoom
                let galleryOptions = {
                    item: 'prompt-item',
                    valueNames: sheetArrayKeys(indexEvents),
                };
    
                // Render Gallery
                let charadex = new List('prompt-gallery', galleryOptions, indexEvents);
    
            } else {
                $("#prompt-gallery").hide();
            }
        }
    }; addEvents();

    // Staff
    let addStaff = async () => {
        if ($("#staff-gallery").length != 0) {
            if (charadexInfo.numOfStaff != 0) {

                // Grab dah sheet
                let mods = await fetchSheet(charadexInfo.staffSheetPage);

                // Show x Amount on Index
                let indexMods = mods.slice(0, charadexInfo.numOfStaff);

                // Nyoom
                let galleryOptions = {
                    item: 'staff-item',
                    valueNames: sheetArrayKeys(indexMods),
                };

                // Render Gallery
                let charadex = new List('staff-gallery', galleryOptions, indexMods);

            } else {
                $("#staff-gallery").hide();
            }
        }
    }; addStaff();

    // Designs
    let addDesigns = async () => {
        if ($("#design-gallery").length != 0) {
            if (charadexInfo.numOfDesigns != 0) {

                // Grab dah sheet
                let designs = await fetchSheet(charadexInfo.masterlistSheetPage);

                // Filter out any MYO slots, reverse and pull the first 4
                let selectDesigns = designs.filter((i) => { return i.designtype != 'MYO Slot' }).reverse().slice(0, charadexInfo.numOfDesigns);

                // Add cardlink
                let cardKey = Object.keys(selectDesigns[0])[0];
                for (var i in selectDesigns) { selectDesigns[i].cardlink = folderURL + "masterlist.html?" + cardKey + "=" + selectDesigns[i][cardKey]; }

                // Nyoom
                let galleryOptions = {
                    item: 'design-item',
                    valueNames: sheetArrayKeys(selectDesigns),
                };

                // Render Gallery
                let charadex = new List('design-gallery', galleryOptions, selectDesigns);

            } else {
                $("#design-gallery").hide();
            }
        }
    }; addDesigns();

}; 


/* ==================================================================== */
/* Softload pages
======================================================================= */
$(window).on('pageshow',function(){loadPage()});