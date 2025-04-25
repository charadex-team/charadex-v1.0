/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from './utilities.js';



/* ==================================================================== */
/* Initialize
/* ====================================================================  /

  This is where the real magic happens
    
======================================================================= */
charadex.initialize = {};



/* ==================================================================== */
/* Page
======================================================================= */
charadex.initialize.page = async (dataArr, config, dataCallback, listCallback, customPageUrl = false, selector = 'charadex') => {

  if (!config) throw Error('No configuration added.');

  // Set up
  let pageUrl = customPageUrl || charadex.url.getBaseUrl();
  let folders = false;

  // Get our data
  let charadexData = dataArr || await charadex.importSheet(config.sheetPage);

  // Add Folders
  if (config.fauxFolder?.toggle ?? false) {
    folders = charadex.listFeatures.fauxFolders(pageUrl, config.fauxFolder.parameters, selector);
  }

  // Add profile information
  for (let entry of charadexData) {
    charadex.tools.addProfileLinks(entry, pageUrl, config.profileKey, selector); // Go ahead and add profile keys just in case
    if (folders) folders(entry, config.fauxFolder.dataKey); // If folders, add folder info
  }

  // If there's related data, add it
  if (config.relatedData) {
    for (let page in config.relatedData) {
      await charadex.data.relateData(charadexData, config.relatedData[page].primaryPageKey, page, config.relatedData[page].secondaryPageKey);
    }
  }

  // Initialize the list
  let list = charadex.buildList(selector);

  // Let us manipulate the data before it gets to the list
  if (typeof dataCallback === 'function') {
    dataCallback(charadexData);
  }

  console.log(charadexData);

  /* Sort the Dex */
  if (config.sort?.toggle ?? false) {
    charadexData = charadex.data.sortArray(
      charadexData, 
      config.sort.key, 
      config.sort.order,
      config.sort.params
    );
  }

  // Create Profile
  const createProfile = () => {

    let profileArr = list.getProfile(charadexData);
    if (!profileArr) return false;
    console.log(profileArr);

    if (config.prevNext?.toggle ?? false) {
      charadex.listFeatures.prevNextLink(pageUrl, charadexData, profileArr, selector);
    }
    
    /* Create Profile */
    let profileList = list.initializeProfile(profileArr);

    // Return those values on Callback
    if (typeof listCallback === 'function') {
      listCallback({
        type: 'profile',
        pageUrl: pageUrl,
        array: profileArr,
        list: profileList
      })
    }

    return true;

  }

  // If there's a profile, nyoom
  if (createProfile()) return;

  // Create Gallery
  const createGallery = () => {

    // Add additional list junk
    let additionalListConfigs = {};

    // Filter by parameters
    charadexData = charadex.data.filterByPageParameters(charadexData);

    // Add Pagination
    if (config.pagination?.toggle ?? false) {
      let pagination = charadex.listFeatures.pagination(charadexData.length, config.pagination.amount, config.pagination.bottomToggle, selector);
      if (pagination) additionalListConfigs = { ...additionalListConfigs, ...pagination };
    }

    // Initialize Gallery
    let galleryList = list.initializeGallery(charadexData, additionalListConfigs);

    // Create Search
    if (config.search?.toggle ?? false) {
      charadex.listFeatures.search(galleryList, config.search.parameters, selector);
    }

    // Add filters
    if (config.filters?.toggle ?? false) {
      let filters = charadex.listFeatures.filters(galleryList, config.filters.parameters, selector); 
    }

    // Return those values on Callback
    if (typeof listCallback === 'function') {
      listCallback({
        type: 'gallery',
        pageUrl: pageUrl,
        array: charadexData,
        list: galleryList,
      })
    }

    return true;

  }

  // Else the gallery nyooms instead
  return createGallery();

}


export { charadex };