// ===================================
// IMAGE ASSETS
// All image paths for the game
// ===================================

/**
 * Image asset mapping for the game.
 * All images should be placed in the /public folder
 * and will be served from the root path in production.
 */

export const ImageAssets: Record<string, string> = {
  BANYU_ROOM_MORNING: '/banyu_room_morning.jpg',
  BANYU_ROOM_STAY_IN_BED: '/banyu_room_stay_in_bed.jpg',
  PHONE_SCREEN: '/phone_screen.jpg',
  KITCHEN_MORNING: '/kitchen_morning.jpg',
  RUANG_MAKAN: '/ruang_makan.jpg',
  KAMPUS: '/kampus.jpg',
  JEMBATAN_MALAM: '/jembatan_malam.jpg',
  TERMINAL_BUS: '/terminal_bus.jpg',
};

/**
 * Validates if an image exists and can be loaded
 * @param imageKey - The key of the image in ImageAssets
 * @returns Promise<boolean> - True if image loads successfully
 */
export const validateImage = (imageKey: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const url = ImageAssets[imageKey];
    if (!url) {
      console.warn(`[Image] ⚠️ Image key "${imageKey}" not found in ImageAssets`);
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      console.log(`[Image] ✓ Loaded: ${imageKey} (${url})`);
      resolve(true);
    };
    img.onerror = () => {
      console.error(`[Image] ✗ Failed to load: ${imageKey} (${url})`);
      resolve(false);
    };
    img.src = url;
  });
};

/**
 * Preloads all game images
 * @returns Promise<void>
 */
export const preloadAllImages = async (): Promise<void> => {
  console.log('[Image] 🖼️ Starting image preload...');
  const keys = Object.keys(ImageAssets);
  const results = await Promise.all(keys.map(validateImage));
  const successCount = results.filter(Boolean).length;
  console.log(`[Image] ✓ Preload complete: ${successCount}/${keys.length} images loaded`);
};
