/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';

const inventoryFix = async (profileArray) => {

  let profile = profileArray[0];
  let itemArr = await charadex.importSheet(charadex.sheet.pages.items);

  let inventoryData = [];
  for (let property in profile) {
    for (let item of itemArr) {
      if (property === charadex.tools.scrub(item.item) && profile[property] !== '') inventoryData.push({
        ... item,
        ... {
          quantity: profile[property]
        }
      });
    }
  }

  return inventoryData;

}


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  let dex = await charadex.initialize.page(
    null,
    charadex.page.inventory,
    null, 
    async (listData) => {

      if (listData.type == 'profile') {


        let inventory = await inventoryFix(listData.array);

        charadex.initialize.groupGallery(
          charadex.page.inventory.inventoryConfig,
          inventory,
          'type',
          'inventory',
          charadex.url.getPageUrl('items')
        )


      }

    }
  );
  
});