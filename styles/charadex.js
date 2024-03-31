/* ==================================================================== */
/* URLs
======================================================================= */

let url = new URL(window.location.href);
let baseURL = window.location.origin + window.location.pathname;
let folderURL = window.location.origin + '/' + window.location.pathname.split("/")[1];



/* ==================================================================== */
/* Load Header and Footer
======================================================================= */

$.get(folderURL + '/includes/header.html', function (data) { $('#header').replaceWith(data); });
$.get(folderURL + '/includes/footer.html', function (data) { $('#footer').replaceWith(data); });



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

    return scrubbedData;

}


/* ================================================================ */
/* Sort Options
/* ================================================================ */

let optionSorter = (op) => {
    let userOptions = op || {};
    let defaultOptions = {
        sheetID: userOptions.sheetID ? userOptions.sheetID.includes('/d/') ? userOptions.sheetID.split('/d/')[1].split('/edit')[0] : userOptions.sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc",
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Public Masterlist",
        itemAmount: userOptions.itemAmount ? userOptions.itemAmount : 12,
        itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
        filterColumn: userOptions.filterColumn ? keyCreator(userOptions.filterColumn) : false,
        searchFilterParams: userOptions.searchFilterParams ? addAll(userOptions.searchFilterParams) : false,
        fauxFolderColumn: userOptions.fauxFolderColumn ? keyCreator(userOptions.fauxFolderColumn) : false,
    }
    return defaultOptions;
}


/* ================================================================ */
/* QOL Funcs
/* ================================================================ */

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

let sheetPage = (id, pageName) => {
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL AND B=FALSE&sheet=${pageName}`
};



/* ================================================================ */
/* Get Keys
/* Makes an array for List.js to use
/* ================================================================ */
let sheetArrayKeys = (arr) => {

    let itemArray = Object.keys(arr[0]);
    if (itemArray.indexOf('cardlink')) itemArray[itemArray.indexOf('cardlink')] = { name: 'cardlink', attr: 'href' };
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

let searchParamOptions = (searchArr) => {
    if (searchArr) {
        addOptions(searchArr, $('#search-filter'));
        $('#search-filter').parent().show();
        $('#charadex-filters').show();
    }
};

let charadexSearch = (info, searchArray) => {

    let arr = searchArray.map(function (v) {
        return v.toLowerCase().replace(/\s/g, "");
    });

    $('#search').on('keyup', () => {
        let selection = $("#search-filter option:selected").val();
        let searchString = $('#search').val();
        if (selection && selection != 'all') {
            info.search(searchString, [selection]);
        } else {
            info.search(searchString, arr);
        }
    });

};



/* ================================================================ */
/* Custom Filter
/* ================================================================ */

let filterColumnOptions = (array, col) => {
    if (col) {
        const filterArr = [...new Set(array.map(i => i[col]))];
        if (filterArr.length > 2) {
            addOptions(addAll(filterArr), $('#filter'));
            $('#filter').parent().show();
            $('#charadex-filters').show();
        }
    }
};

let charadexFilterSelect = (info, filterKey) => {
    $("#filter").on('change', () => {
        let selection = $("#filter option:selected").text().toLowerCase();
        if (selection && !selection.includes('all')) {
            info.filter(function (i) { return i.values()[filterKey].toLowerCase() == selection; });
        } else {
            info.filter();
        }
    });
};



/* ================================================================ */
/* Faux Folder Function
/* ================================================================ */
let fauxFolderButtons = (array, fauxFolderColumn, params) => {

    if (array[0].hasOwnProperty(fauxFolderColumn)) {

        // Creates Param Object Array
        let urlParamArray = [];
        const uniqueArray = [...new Set(array.map(i => i[fauxFolderColumn]))];
        uniqueArray.forEach((i) => {
            urlParamArray.push($('#charadex-filter-buttons a').clone().text(i).attr("href", baseURL + '?' + fauxFolderColumn + '=' + i.toLowerCase()));
        });

        if (urlParamArray.length > 1) {

            // Adds All button
            urlParamArray.unshift($('#charadex-filter-buttons a').text('All').attr("href", baseURL));

            // Smacks the links in your flex column
            let btnCols = [];
            for (var i in urlParamArray) {btnCols.push($('#charadex-filter-buttons').html(urlParamArray[i]).clone());}
            $('#filter-buttons .row').append(btnCols);

            // Show Buttons
            $('#filter-buttons').show();

        }

    }

    // Filters out information based on URL parameters
    if (params.has(fauxFolderColumn) && fauxFolderColumn) {
        return array.filter((i) => i[fauxFolderColumn].toLowerCase() === params.get(fauxFolderColumn).toLowerCase());
    } else {
        return array;
    }

};




/* ================================================================ */
/* Prev and Next Links
/* ================================================================ */
let prevNextLinks = (array, url, params, currParam, key) => {

    let index = array.map(function (i) { return i[key]; }).indexOf(currParam.get(key));
    let leftItem = array[index - 1];
    let rightItem = array[index + 1];

    // Prev
    if (leftItem) {
        $("#entryPrev").attr("href", url + params + leftItem[key]);
        $("#entryPrev span").text(leftItem[key]);
    } else {
        $("#entryPrev i").remove();
    }

    // Next
    if (rightItem) {
        $("#entryNext").attr("href", url + params + rightItem[key]);
        $("#entryNext span").text(rightItem[key]);
    } else {
        $("#entryNext i").remove();
    }

    // Back to masterlist (keeps species parameter)
    $("#masterlistLink").attr("href", url);
    $('#prevNext').show();

};


/* ==================================================================== */
/* Charadex
======================================================================= */
const charadexLibrary = async (options) => {
    try {

        // Sort through options
        const charadexInfo = optionSorter(options);

        // Fetch sheet data to use
        const JSON = await fetch(sheetPage(charadexInfo.sheetID, charadexInfo.sheetPage)).then(i => i.text());

        // Clean up sheet data so we can use it
        let sheetArray = scrubData(JSON);

        // Grab all our url info
        const urlParams = new URLSearchParams(window.location.search);
        let cardKey = Object.keys(sheetArray[0])[0];
        let preParam = url.search.includes(charadexInfo.fauxFolderColumn) ? '?' + charadexInfo.fauxFolderColumn + '=' + urlParams.get(charadexInfo.fauxFolderColumn) + `&${cardKey}=` : `?${cardKey}=`;

        // Create faux folders
        // Filter through array based on folders
        if (charadexInfo.fauxFolderColumn) sheetArray = fauxFolderButtons(sheetArray, charadexInfo.fauxFolderColumn, urlParams);

        // Reverse baseds on preference
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
            let singleCard = sheetArray.filter((i) => i[cardKey].includes(urlParams.get(cardKey)))[0];

            // Render card
            let charadexItem = new List("charadex-gallery", itemOptions, singleCard);


        } else {

            // Add options to filters
            filterColumnOptions(sheetArray, charadexInfo.filterColumn);
            searchParamOptions(charadexInfo.searchFilterParams);

            // Show pagination
            showPagination(sheetArray, charadexInfo.itemAmount);

            // Create the Gallery
            (() => {

                let galleryOptions = {
                    item: 'charadex-entries',
                    valueNames: sheetArrayKeys(sheetArray),
                    searchColumns: charadexInfo.searchFilterParams,
                    page: charadexInfo.itemAmount,
                    pagination: [{
                        innerWindow: 3,
                        left: 1,
                        right: 1,
                        item: `<li class='page-item'><a class='page page-link'></a></li>`,
                        paginationClass: 'pagination-top',
                    }],
                };

                // Render Gallery
                let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

                // Make filters workie
                charadexFilterSelect(charadex, charadexInfo.filterColumn);
                charadexSearch(charadex, charadexInfo.searchFilterParams);

            })();

        }

        // 'Load' the page after the above is said and done
        $('#loading').hide();
        $('.masterlist-container').addClass('softload');

    } catch (error) {
        $('#loading').hide();
        console.log(error);
        window.alert(error, error);
    }
}; 





    /* ==================================================================== */
    /* Charadex
    ======================================================================= */
    const charadexCards = (options) => {


        /* ==================================================================== */
        /* Options & URL
        ======================================================================= */
        const urlParams = new URLsearchFilterParams(window.location.search);
        const charadexInfo = optionSorter;


        /* ==================================================================== */
        /* Fetching the Sheet
        ======================================================================= */
        fetch(sheetPage(charadexInfo.sheetID, charadexInfo.sheetPage)).then(i => i.text()).then(JSON => {

            /* ================================================================ */
            /* And so it begins
            /* ================================================================ */
            let sheetArray = scrubData(JSON); // Clean up sheet data so we can use it


            /* ================================================================ */
            /* Load Page
            /* ================================================================ */
            $('#loading').hide();
            $('.masterlist-container').addClass('softload');


            /* ================================================================ */
            /* URL Param Buttons
            /* ================================================================ */
            (() => {

                if (sheetArray[0].hasOwnProperty(charadexInfo.fauxFolderColumn)) {

                    // Creates Param Object Array
                    let urlParamArray = [];
                    const uniqueArray = [...new Set(sheetArray.map(i => i[charadexInfo.fauxFolderColumn]))];
                    uniqueArray.forEach((i) => {
                        urlParamArray.push({
                            title: i,
                            link: baseURL + '?' + charadexInfo.fauxFolderColumn + '=' + i.toLowerCase(),
                        });
                    });

                    // Adds All Button
                    urlParamArray.unshift({ title: 'All', link: baseURL });

                    // List.js options
                    let buttonOptions = {
                        valueNames: ['title', { name: 'link', attr: 'href' }],
                        item: 'charadex-filter-buttons',
                    };

                    // Creates singular item
                    let urlParamButtons = new List("filter-buttons", buttonOptions, urlParamArray);

                    // Show Buttons
                    $('#filter-buttons').show();

                }

                // Filters out information based on URL parameters
                if (urlParams.has(charadexInfo.fauxFolderColumn) && charadexInfo.fauxFolderColumn) {
                    sheetArray = sheetArray.filter((i) => i[charadexInfo.fauxFolderColumn].toLowerCase() === urlParams.get(charadexInfo.fauxFolderColumn).toLowerCase());
                }

            })();


            /* ================================================================ */
            /* Get Keys
            /* (Allows list.js to call info from sheet)
            /* ================================================================ */
            let sheetArrayKeys = () => {
                let itemArray = Object.keys(sheetArray[0]);
                itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };
                return itemArray;
            };


            /* ================================================================ */
            /* Charadex Gallery
            /* ================================================================ */

            // Add options to filters
            if (charadexInfo.filterColumn) {
                const filterArr = [...new Set(sheetArray.map(i => i[charadexInfo.filterColumn]))];
                if (filterArr > 2) {
                    addOptions(addAll(filterArr), $('#filter'));
                    $('#filter').parent().show();
                }
            }

            if (charadexInfo.searchFilterParams) {
                addOptions(charadexInfo.searchFilterParams, $('#search-filter'));
                $('#search-filter').parent().show();
            }

            // Show Filters
            $('#charadex-filters').show();

            // Create the Gallery
            (() => {
                let galleryOptions = {
                    item: 'charadex-entries',
                    valueNames: sheetArrayKeys(),
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

                let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

                // Sort based on ID
                charadex.sort("orderID", { order: charadexInfo.itemOrder, })

                // Calling all functions here
                charadexFilterSelect(charadex, charadexInfo.filterColumn);
                charadexSearch(charadex, charadexInfo.searchFilterParams);

            })();

        })
    };