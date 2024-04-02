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
            fauxFolderColumn: userOptions.fauxFolderColumn ? keyCreator(userOptions.fauxFolderColumn) : false,
            filterColumn: userOptions.filterColumn ? keyCreator(userOptions.filterColumn) : false,
            searchFilterParams: userOptions.searchFilterParams ? addAll(userOptions.searchFilterParams) : false,
            includeDesigns: userOptions.includeDesigns ? true : false
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

    let loadPage = () => {
        $('#loading').hide();
        $('#main-container').addClass('softload');
    } 


/* ================================================================ */
/* Get Keys
/* Makes an array for List.js to use
/* ================================================================ */
    let sheetArrayKeys = (arr) => {
        let itemArray = Object.keys(arr[0]);
        if (itemArray.indexOf('cardlink')) itemArray[itemArray.indexOf('cardlink')] = { name: 'cardlink', attr: 'href' };
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
            const uniqueArray = [...new Set(array.map(i => i[fauxFolderColumn]))].filter(n => n);
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
        if($("#entryPrev").length != 0) {

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

        }
    };


/* ==================================================================== */
/* Masterlist
======================================================================= */
    const masterlist = async (options) => {

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

    }; 


/* ==================================================================== */
/* For showing off just cards
======================================================================= */
    const cards = async (options) => {

        // Sort through options
        const charadexInfo = optionSorter(options);

        // Fetch sheet data to use
        const JSON = await fetch(sheetPage(charadexInfo.sheetID, charadexInfo.sheetPage)).then(i => i.text());

        // Clean up sheet data so we can use it
        let sheetArray = scrubData(JSON);

        // Create the Gallery
        (() => {

            let galleryOptions = {
                item: 'charadex-entries',
                valueNames: sheetArrayKeys(sheetArray),
            };

            // Render Gallery
            let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

        })();

        // 'Load' the page after the above is said and done
        loadPage();

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
                    if (c === keyCreator(i.item)) {
                        let inventoryItems = {
                            type: i.type,
                            item: i.item,
                            image: i.image,
                            amount: scrubbedCard[keyCreator(i.item)],
                        };
                        inventoryItemArr.push(inventoryItems);
                    };
                }
            });

            // Throw all the boys in a column 
            let cols = [];
            inventoryItemArr.forEach((val) => {
                let colHTML = $("#item-list-col").clone();
                colHTML.find(".item-img").attr('src', val.image);
                colHTML.find(".item").html(val.item);
                colHTML.find(".amount").html(val.amount);
                cols.push(colHTML);
            });

            // Make items show up
            $("#item-list-row").html(cols);

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


/* ==================================================================== */
/* For showing off just cards
======================================================================= */
    const frontPage = (options) => {

        const charadexInfo = optionSorter(options);
        quickURL = baseURL.substring(0, baseURL.lastIndexOf('/')) + "/";

        //Events
        let addEvents = async () => {
            if($("#events .gallery-row").length != 0) {

                // Grab dah sheet
                const eventsJSON = await fetch(sheetPage(charadexInfo.sheetID, 'prompts')).then(i => i.text());
                let events = scrubData(eventsJSON);
                let cardKey = Object.keys(events[0])[0];

                // Sort by End Date
                let newestEvents = events.sort(function(a, b) {
                    var c = new Date(a.enddate);
                    var d = new Date(b.enddate);
                    return d-c;
                });

                // Pull first 3 from sorted
                let lastEvents = newestEvents.slice(0, 3)

                // Beyblade let it RIP
                let eventsArr = [];
                lastEvents.forEach((i) => {
                    let colHTML = $("#events .gallery-item").clone();
                    colHTML.find(".link").attr('href', quickURL + "prompts.html?" + cardKey + "=" + i.title);
                    colHTML.find(".title").html(i.title);
                    colHTML.find(".startdate").html(i.startdate);
                    colHTML.find(".enddate").html(i.enddate);
                    eventsArr.push(colHTML);
                });

                // Make items show up
                $("#events .gallery-row").html(eventsArr);

            }
        }
        addEvents();

        //Staff
        let addStaff = async () => {
            if($("#staff .gallery-row").length != 0) {

                // Grab dah sheet
                const modsJSON = await fetch(sheetPage(charadexInfo.sheetID, 'mods')).then(i => i.text());
                let mods = scrubData(modsJSON);

                // Nyoom
                let modsArr = [];
                mods.forEach((i) => {
                    let colHTML = $("#staff .gallery-item").clone();
                    colHTML.find(".link").attr('href', i.link);
                    colHTML.find(".image").attr('src', i.image);
                    colHTML.find(".username").html(i.username);
                    colHTML.find(".jobtitle").html(i.jobtitle);
                    modsArr.push(colHTML);
                });

                // Make items show up
                $("#staff .gallery-row").html(modsArr);

            }
        }
        addStaff();

        //Designs
        let addDesigns = async () => {
            if($("#designs .gallery-row").length != 0) {

                // Grab dah sheet
                const designJSON = await fetch(sheetPage(charadexInfo.sheetID, 'masterlist')).then(i => i.text());
                let designs = scrubData(designJSON);

                // Filter out any MYO slots, reverse and pull the first 4
                let selectDesigns = designs.filter((i) => {return i.designtype != 'MYO Slot'}).reverse().slice(0, 4);
                
                // Grab your key for single card
                let cardKey = Object.keys(selectDesigns[0])[0];

                let designsArr = [];
                selectDesigns.forEach((i) => {
                    let colHTML = $("#designs .gallery-item").clone();
                    colHTML.find(".link").attr('href', quickURL + "masterlist.html?" + cardKey + "=" + i.id);
                    colHTML.find(".image").attr('src', i.image);
                    colHTML.find(".id").html(i.id);
                    designsArr.push(colHTML);
                });

                // Make items show up
                $("#designs .gallery-row").html(designsArr);

            }
        }
        addDesigns();

        // Loading...
        loadPage();

    }; 