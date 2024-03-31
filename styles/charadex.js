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
            sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Masterlist",
            itemSheetPage: userOptions.itemSheetPage ? userOptions.itemSheetPage : 'Items',
            itemAmount: userOptions.itemAmount ? userOptions.itemAmount : 12,
            itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
            fauxFolderColumn: userOptions.fauxFolderColumn ? createKey(userOptions.fauxFolderColumn) : false,
            filterColumn: userOptions.filterColumn ? createKey(userOptions.filterColumn) : false,
            searchFilterParams: userOptions.searchFilterParams ? addAll(userOptions.searchFilterParams) : false,
            includeDesigns: userOptions.includeDesigns ? true : false
        }
        return defaultOptions;
    }


/* ================================================================ */
/* QOL Funcs
/* ================================================================ */
    let createKey = (key) => {
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

    let loadPage = () => {
        $('#loading').hide();
        $('.masterlist-container').addClass('softload');
    } 


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
    let charadexSearch = (info, searchArr) => {

        if (searchArr && searchArr.length > 1) {
            addOptions(searchArr, $('#search-filter'));
            $('#search-filter').parent().show();
            $('#search').addClass('filtered');
        }

        let arr = searchArr.map(function (v) {return v.toLowerCase().replace(/\s/g, "");});

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
    let charadexFilterSelect = (info, arr, filterKey) => {
        if (filterKey) {

            const filterArr = [...new Set(arr.map(i => i[filterKey]))];
            
            if (filterArr.length > 2) {

                addOptions(addAll(filterArr), $('#filter'));
                
                $("#filter").on('change', () => {
                    let selection = $("#filter option:selected").text().toLowerCase();
                    if (selection && !selection.includes('all')) {
                        info.filter(function (i) { return i.values()[filterKey].toLowerCase() == selection; });
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
/* Masterlist
======================================================================= */
    const masterlist = async (options) => {
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


                // Create the Gallery
                (() => {

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

                })();

            }

            // 'Load' the page after the above is said and done
            loadPage();

        } catch (error) {
            $('#loading').hide();
            console.log(error);
            window.alert(error, error);
        }
    }; 


/* ==================================================================== */
/* Inventories
======================================================================= */
    const inventories = async (options) => {

        // Sort through options
        const charadexInfo = optionSorter(options);

        // Fetch sheet data to use
        const userJSON = await fetch(sheetPage(charadexInfo.sheetID, charadexInfo.sheetPage)).then(i => i.text());

        // Clean up sheet data so we can use it
        let sheetArray = scrubData(userJSON);

        // Grab all our url info
        const urlParams = new URLSearchParams(window.location.search);
        let cardKey = Object.keys(sheetArray[0])[0];
        let preParam = `?${cardKey}=`;

        // Put in alphabetical order
        sheetArray.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()))

        // Add card links to the remaining array
        for (var i in sheetArray) {sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][cardKey];}

        // Decide if the url points to profile or entire gallery
        if (urlParams.has(cardKey)) {

            // If it is a single item, fetch the items page too
            const itemJSON = await fetch(sheetPage(charadexInfo.sheetID, charadexInfo.itemSheetPage)).then(i => i.text());
            let itemSheetArray = scrubData(itemJSON);

            // List.js options
            let itemOptions = {
                valueNames: sheetArrayKeys(sheetArray),
                item: 'charadex-card',
            };

            // Filter out the right card
            let singleArr = sheetArray.filter((i) => i[cardKey].includes(urlParams.get(cardKey)))[0];
            let scrubbedCard = Object.entries(singleArr).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {});

            // Merge the user's inventory with the item sheet
            let inventoryItemArr = [];
            itemSheetArray.forEach((i) => {
                for (var c in scrubbedCard) {
                    if (c === createKey(i.item)) {
                        let inventoryItems = {
                            type: i.type,
                            item: createKey(i.item),
                            image: i.image,
                            amount: scrubbedCard[createKey(i.item)],
                        };
                        inventoryItemArr.push(inventoryItems);
                    };
                }
            });

            // Make some delicious keys
            let inventorySorted = Object.groupBy(inventoryItemArr, ({ type }) => type);
            let inventoryItemKeys = [...new Set(inventoryItemArr.map(i => i['type']))];

            // Loop through items and add general structure to dom
            for (let k = 0; k < inventoryItemKeys.length; k++) {

                // Get the item types for future refence
                let currUserItems = inventorySorted[inventoryItemKeys[k]];

                // Only append to this section
                $("#item-list").append([

                    // Clone each section depending on how many types there are
                    $("#item-list-section").clone().addClass('new-list-section').attr('id', createKey(inventoryItemKeys[k])).html([

                        // Add header info
                        $("#item-type-title").text(inventoryItemKeys[k]).clone(),

                        // Rows and add amount of columns needed
                        $("#item-list-row").clone().html(currUserItems.map(i  => $("#item-list-col").clone())),

                    ])
                ]);
            };

            for (let k = 0; k < inventoryItemArr.length; k++) {
                $("#" + createKey(inventoryItemArr[k].type) + ' .item-img').attr('src', inventoryItemArr[k].image);
                $("#" + createKey(inventoryItemArr[k].type) + ' .item').html(inventoryItemArr[k].item);
            }

            $("#item-list .new-list-section").show();

            // Render card
            let charadexItem = new List("charadex-gallery", itemOptions, scrubbedCard);


        } else {

            // Show pagination
            showPagination(sheetArray, charadexInfo.itemAmount);

            // Create the Gallery
            (() => {

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

            })();

        }

        // 'Load' the page after the above is said and done
        loadPage();

    }; 