// This file maps story keys to their corresponding image file paths.
// By importing the images directly, we let Vite handle the bundling and path resolution,
// ensuring the images are always found regardless of the server setup.

import BanyuRoomMorning from '@/banyu_room_morning.jpg';
import BanyuRoomStayInBed from '@/banyu_room_stay_in_bed.jpg';
import PhoneScreen from '@/phone_screen.jpg';
import KitchenMorning from '@/kitchen_morning.jpg';
import RuangMakan from '@/ruang_makan.jpg';
import Kampus from '@/kampus.jpg';
import JembatanMalam from '@/jembatan_malam.jpg';
import TerminalBus from '@/terminal_bus.jpg';

export const images: { [key:string]: string } = {
    'BANYU_ROOM_MORNING': BanyuRoomMorning,
    'BANYU_ROOM_STAY_IN_BED': BanyuRoomStayInBed,
    'PHONE_SCREEN': PhoneScreen,
    'KITCHEN_MORNING': KitchenMorning,
    'RUANG_MAKAN': RuangMakan,
    'KAMPUS': Kampus,
    'JEMBATAN_MALAM': JembatanMalam,
    'TERMINAL_BUS': TerminalBus,
};