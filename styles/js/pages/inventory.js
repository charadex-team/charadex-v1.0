/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  let dex = await charadex.initialize.page(
    null,
    charadex.page.player,
    null, 
    async (listData) => {

      if (listData.type == 'profile') {

        let profile = listData.profileArray[0];

        // Inventory
        if (charadex.tools.checkArray(profile.inventory)) {
          let itemArr = await charadex.manageData.relateInventory(profile.inventory);
          charadex.initialize.groupGallery(
            charadex.page.player.inventoryConfig,
            profile.inventory,
            'type',
            charadex.url.getPageUrl('items')
          )
        }

        // Designs
        if (charadex.tools.checkArray(profile.masterlist)) {
          let designs = await charadex.initialize.page(
            profile.masterlist,
            charadex.page.player.relatedData['masterlist'],
          );
        }

        // Logs
        if (charadex.tools.checkArray(profile.inventorylog)) {
          let logs = await charadex.initialize.page(
            profile.inventorylog,
            charadex.page.player.relatedData['inventory log'],
          );
        }


      }
    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});