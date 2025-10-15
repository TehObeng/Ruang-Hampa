// Import each image file directly into the script.
// This allows the Vite build tool to process the images, assign them a unique hashed filename,
// and return the correct public URL for use in the application.
import banyuRoomMorning from './img/banyu_room_morning.jpg';
import banyuRoomStayInBed from './img/banyu_room_stay_in_bed.jpg';
import phoneScreen from './img/phone_screen.jpg';
import kitchenMorning from './img/kitchen_morning.jpg';
import ruangMakan from './img/ruang_makan.jpg';
import kampus from './img/kampus.jpg';
import jembatanMalam from './img/jembatan_malam.jpg';
import terminalBus from './img/terminal_bus.jpg';

// The images object now maps the story keys to the URLs provided by the import statements.
export const images: { [key: string]: string } = {
    'BANYU_ROOM_MORNING': banyuRoomMorning,
    'BANYU_ROOM_STAY_IN_BED': banyuRoomStayInBed,
    'PHONE_SCREEN': phoneScreen,
    'KITCHEN_MORNING': kitchenMorning,
    'RUANG_MAKAN': ruangMakan,
    'KAMPUS': kampus,
    'JEMBATAN_MALAM': jembatanMalam,
    'TERMINAL_BUS': terminalBus,
};
