
import type { StoryData } from "./config";

export const story: StoryData = {
    'START': {
        story: "Kamu terbangun oleh suara jam weker yang memekakkan telinga. Sinar matahari pagi menembus celah gorden, terasa menyilaukan. Satu hari lagi dimulai.\nPonselmu di samping tempat tidur menyala, menampilkan pengingat jadwal kuliah hari ini. Rumah terasa sunyi.",
        location: "Kamar Banyu",
        image: 'BANYU_ROOM_MORNING',
        mentalEnergy: 50,
        interactableObjects: [
            { name: "Lihat keluar jendela", description: "Langit pagi yang kelabu. Dunia di luar sana terasa begitu jauh dan asing." },
            { name: "Lihat buku sketsa", description: "Penuh dengan gambar-gambar yang belum selesai. Kamu sudah tidak menyentuhnya selama berminggu-minggu." }
        ],
        actions: [
            { text: "Cek ponsel.", nextNodeId: "CHECK_PHONE" },
            { text: "Bangun dari tempat tidur.", nextNodeId: "GET_UP" },
            { text: "Tetap di tempat tidur sebentar lagi.", nextNodeId: "STAY_IN_BED" },
        ],
    },
    'CHECK_PHONE': {
        story: "Kamu meraih ponselmu. Layarnya terasa dingin di tangan. Selain pengingat kuliah, ada pesan dari Surya, kakakmu. 'Jangan lupa makan malam keluarga nanti malam. Penting.' Rasa sesak yang familier kembali memenuhi dadamu.",
        location: "Kamar Banyu",
        image: 'PHONE_SCREEN',
        mentalEnergy: 45,
        newMemento: { name: "Pesan dari Surya", description: "Sebuah pengingat tentang makan malam keluarga yang 'penting'." },
        interactableObjects: [],
        actions: [
            { text: "Letakkan ponsel dan bangun.", nextNodeId: "GET_UP" },
            { text: "Menatap langit-langit kamar.", nextNodeId: "STAY_IN_BED_2" },
        ],
    },
    'STAY_IN_BED': {
        story: "Kamu menarik selimut hingga ke dagu, kain lembutnya menjadi perisai yang nyaman. Suara-suara dari luar kamar seakan memudar. Di sini aman. Tenang. Tapi pikiranmu tidak mau tenang.",
        location: "Banyu's Room",
        image: 'BANYU_ROOM_STAY_IN_BED',
        mentalEnergy: 40,
        interactableObjects: [
            { name: "Lihat kipas angin", description: "Baling-balingnya diam, mengumpulkan debu." },
            { name: "Dengarkan suara rumah", description: "Lantai kayu berderit di lantai bawah. Keran air menyala, lalu mati." }
        ],
        actions: [
            { text: "Memaksa diri untuk bangun.", nextNodeId: "GET_UP" },
        ],
    },
    'STAY_IN_BED_2': {
        story: "Kamu berbaring, menatap langit-langit. Pesan dari Surya terus terngiang. 'Penting'. Selalu ada sesuatu yang 'penting', tapi tidak pernah terasa penting untukmu. Energi rasanya terkuras habis bahkan sebelum hari dimulai.",
        location: "Banyu's Room",
        image: 'BANYU_ROOM_STAY_IN_BED',
        mentalEnergy: 38,
        interactableObjects: [],
        actions: [
            { text: "Cukup. Aku harus bangun.", nextNodeId: "GET_UP" },
        ],
    },
    'GET_UP': {
        story: "Dengan helaan napas panjang, kamu menyingkirkan selimut dan menurunkan kaki dari tempat tidur. Lantai kayu yang dingin menyentuh telapak kakimu. Hari ini resmi dimulai, siap atau tidak. Kamu mendengar suara samar dari dapur.",
        location: "Kamar Banyu",
        image: 'BANYU_ROOM_MORNING',
        interactableObjects: [
            { name: "Lemari pakaian", description: "Lemari kayu sederhana. Bayanganmu di cerminnya yang berdebu hanyalah siluet." },
            { name: "Meja belajar", description: "Buku-buku dan cangkir kosong mengotorinya. Lapisan debu tipis menutupi segalanya." }
        ],
        actions: [
            { text: "Menuju dapur.", nextNodeId: "KITCHEN" },
        ],
    },
    'KITCHEN': {
        story: "Aroma kopi terasa di udara. Ibumu sedang berada di meja dapur, memunggungimu, menyiapkan sarapan dalam diam. Sepertinya ia belum menyadari kehadiranmu. Radio menyenandungkan melodi yang lembut.",
        location: "Dapur",
        image: 'KITCHEN_MORNING',
        interactableObjects: [
            { name: "Lihat kalender", description: "Kalender dari bank. Tanggal hari ini dilingkari merah. Kamu tidak ingat kenapa." },
            { name: "Ambil segelas air", description: "Airnya sejuk dan tawar. Terasa melegakan saat ditelan." }
        ],
        actions: [
            { text: "Ucapkan 'Selamat pagi.'", nextNodeId: "GREET_MOTHER", relationshipChange: { character: 'Ibu', change: 5 } },
            { text: "Duduk di meja makan tanpa bicara.", nextNodeId: "SIT_QUIETLY", relationshipChange: { character: 'Ibu', change: -5 } },
        ],
    },
    'GREET_MOTHER': {
        story: "'Pagi, bu,' katamu pelan. Ibumu menoleh, senyum tipis yang lelah tersungging di wajahnya. 'Pagi, Banyu. Sudah bangun. Sarapan hampir siap.' Ia kembali melanjutkan pekerjaannya. Percakapan berakhir secepat dimulainya.",
        location: "Dapur",
        image: 'KITCHEN_MORNING',
        actions: [
            { text: "Setelah sarapan, apa yang harus kulakukan?", nextNodeId: "AFTER_BREAKFAST_CHOICE" },
        ],
        interactableObjects: [],
    },
    'SIT_QUIETLY': {
        story: "Kamu duduk di kursi meja makan tanpa sepatah kata pun. Ibumu melirik dari balik bahunya, mengangguk sekilas sebelum kembali ke kompor. Keheningan di antara kalian terasa berat, penuh dengan hal-hal yang tak terucapkan.",
        location: "Dapur",
        image: 'KITCHEN_MORNING',
        actions: [
            { text: "Setelah sarapan, apa yang harus kulakukan?", nextNodeId: "AFTER_BREAKFAS T_CHOICE" },
        ],
        interactableObjects: [],
    },
    'AFTER_BREAKFAST_CHOICE': {
        story: "Setelah menghabiskan sarapan dalam keheningan yang canggung, kamu berpikir tentang jadwal kuliahmu. Ada kelas penting hari ini, tapi rasanya berat sekali untuk keluar rumah.",
        location: "Dapur",
        image: "RUANG_MAKAN",
        actions: [
            { text: "Pergi ke kampus.", nextNodeId: "GO_TO_CAMPUS", mentalEnergyChange: 5 },
            { text: "Bolos saja. Kembali ke kamar.", nextNodeId: "SKIP_CLASS", mentalEnergyChange: -10 },
        ],
        interactableObjects: [],
    },
    'GO_TO_CAMPUS': {
        story: "Kamu memutuskan untuk memaksakan diri. Perjalanan ke kampus terasa kabur, seperti mimpi. Di kelas, dosen menjelaskan materi dengan antusias, tapi suaranya hanya terdengar seperti dengungan. Sulit untuk fokus.",
        location: "Kampus",
        image: "KAMPUS",
        mentalEnergy: 35,
        interactableObjects: [{name: "Lihat catatan", description: "Hanya beberapa coretan tak berarti. Kamu tidak menyerap apa-apa."}],
        actions: [
            { text: "Pulang setelah kelas selesai.", nextNodeId: "EVENING" },
        ],
    },
    'SKIP_CLASS': {
        story: "Kamu kembali ke kamar dan menutup pintu. Keheningan kamar terasa lebih baik daripada kebisingan dunia luar. Kamu duduk di tepi tempat tidur, tidak tahu harus berbuat apa. Siang berlalu begitu saja dalam lamunan kosong.",
        location: "Kamar Banyu",
        image: "BANYU_ROOM_MORNING",
        mentalEnergy: 25,
        interactableObjects: [],
        actions: [
            { text: "Menunggu hingga sore.", nextNodeId: "EVENING" },
        ],
    },
    'EVENING': {
        story: "Sore menjelang malam. Kamu mendengar pintu depan terbuka, disusul suara langkah kaki yang berat. Bapak sudah pulang. Tak lama kemudian, Surya juga tiba. Udara di rumah terasa semakin tegang, antisipasi makan malam yang 'penting' itu mulai terasa.",
        location: "Kamar Banyu",
        image: "BANYU_ROOM_MORNING",
        actions: [
            { text: "Tetap di kamar sampai dipanggil.", nextNodeId: "DINNER_TABLE" },
            { text: "Keluar untuk bicara dengan Surya.", nextNodeId: "TALK_TO_SURYA" },
        ],
        interactableObjects: [],
    },
    'TALK_TO_SURYA': {
        story: "Kamu menemukan Surya di ruang tengah. Dia menatapmu, ekspresinya sulit dibaca. 'Gimana kuliah?' tanyanya, nada suaranya datar.",
        location: "Ruang Tengah",
        image: "RUANG_MAKAN",
        actions: [
            { text: "'Baik-baik saja.'", nextNodeId: "DINNER_TABLE", relationshipChange: {character: "Surya", change: -5} },
            { text: "'Biasa saja. Agak capek.'", nextNodeId: "DINNER_TABLE", relationshipChange: {character: "Surya", change: 5} },
        ],
        interactableObjects: [],
    },
    'DINNER_TABLE': {
        story: "Semua orang duduk di meja makan dalam diam. Nasi dan lauk pauk sudah tersaji, tapi tidak ada yang berselera. Akhirnya, Bapak berdeham, memecah keheningan. 'Banyu,' mulainya, 'kita perlu bicara soal masa depanmu.'",
        location: "Ruang Makan",
        image: "RUANG_MAKAN",
        mentalEnergy: 20,
        interactableObjects: [],
        actions: [
            { text: "Mencoba menjelaskan perasaanmu.", nextNodeId: "EXPLAIN_FEELINGS" },
            { text: "Tetap diam dan mendengarkan.", nextNodeId: "STAY_SILENT", mentalEnergyChange: -10 },
            { text: "Menjawab dengan marah.", nextNodeId: "GET_ANGRY", relationshipChange: {character: "Bapak", change: -15} },
        ],
    },
    'EXPLAIN_FEELINGS': {
        story: "'Pak, Bu... aku cuma... aku merasa berat akhir-akhir ini. Semuanya terasa sulit, dan aku tidak tahu kenapa.' Kamu mencoba menyuarakan apa yang kamu rasakan, suaramu bergetar.",
        location: "Ruang Makan",
        image: "RUANG_MAKAN",
        actions: [
            { text: "Keluarga mencoba mengerti.", nextNodeId: "GOOD_ENDING_PATH" },
        ],
        interactableObjects: [],
    },
    'STAY_SILENT': {
        story: "Kamu menunduk, menatap piringmu. Bapak melanjutkan ceramahnya tentang tanggung jawab, tentang biaya kuliah, tentang kekecewaan mereka. Setiap kata terasa seperti beban yang semakin menekan pundakmu. Tidak ada yang membelamu.",
        location: "Ruang Makan",
        image: "RUANG_MAKAN",
        actions: [
            { text: "Malam ini terasa sangat panjang.", nextNodeId: "POST_DINNER_DESPAIR", relationshipChange: { character: "Bapak", change: -10 } },
        ],
        interactableObjects: [],
    },
    'GET_ANGRY': {
        story: "'Kenapa semua orang selalu menyudutkanku?!' Kamu membanting sendok ke piring, suaranya memekakkan telinga. 'Kalian tidak pernah tahu rasanya jadi aku!' Kamu berdiri dan meninggalkan meja makan, bantingan pintu kamarmu menjadi penutup malam itu.",
        location: "Ruang Makan",
        image: "RUANG_MAKAN",
        actions: [
            { text: "Aku tidak tahan lagi di sini.", nextNodeId: "ALTERNATE_ENDING_PATH", relationshipChange: { character: "Ibu", change: -10 } },
        ],
        interactableObjects: [],
    },
    'POST_DINNER_DESPAIR': {
        story: "Di dalam kamarmu, kamu merasa hampa. Kata-kata Bapak terngiang-ngiang. Keheningan dari Ibu dan Surya terasa seperti penghakiman. Rasanya tidak ada tempat untukmu di sini. Harapan terasa seperti barang mewah yang tidak bisa kamu miliki.",
        location: "Kamar Banyu",
        image: "BANYU_ROOM_STAY_IN_BED",
        mentalEnergy: 5,
        actions: [
            { text: "Semuanya terasa gelap.", nextNodeId: "BAD_ENDING_PATH" },
        ],
        interactableObjects: [],
    },
    'GOOD_ENDING_PATH': {
        story: "Mendengar suaramu yang bergetar, Ibumu menghentikan Bapak. 'Tunggu, Pak,' katanya lembut. 'Mungkin kita harus mendengarkan.' Untuk pertama kalinya, mereka benar-benar menatapmu, mencoba melihat melewati amarah dan kekecewaan mereka. Malam itu, kalian bicara. Panjang. Penuh air mata, tapi juga penuh pengertian yang baru tumbuh.",
        location: "Ruang Makan",
        image: "RUANG_MAKAN",
        mentalEnergy: 75,
        actions: [
            { text: "Mungkin... ada harapan.", nextNodeId: "GOOD_ENDING", relationshipChange: { character: "Ibu", change: 20 } },
        ],
        interactableObjects: [],
    },
    'ALTERNATE_ENDING_PATH': {
        story: "Kemarahan memberimu energi yang aneh. Kamu tidak mau lagi merasakan sakit ini. Di kamar, kamu membuka lemari dan menarik keluar ransel tuamu. Dengan tangan gemetar, kamu mulai memasukkan beberapa helai pakaian dan buku sketsa. Ini bukan rumahmu lagi.",
        location: "Kamar Banyu",
        image: "BANYU_ROOM_MORNING",
        mentalEnergy: 30,
        actions: [
            { text: "Pergi, sekarang juga.", nextNodeId: "ALTERNATE_ENDING" },
        ],
        interactableObjects: [],
    },
    'BAD_ENDING_PATH': {
        story: "Kamu berjalan keluar dari rumah tanpa suara. Malam begitu dingin dan sunyi. Langkah kakimu membawamu tanpa tujuan, hingga kamu tiba di sebuah jembatan penyeberangan yang sepi. Di bawah, lampu-lampu kendaraan bergerak seperti bintang yang jatuh. Semuanya terasa begitu jauh.",
        location: "Jembatan",
        image: "JEMBATAN_MALAM",
        mentalEnergy: 0,
        actions: [
            { text: "Aku hanya ingin semuanya berhenti.", nextNodeId: "BAD_ENDING" },
        ],
        interactableObjects: [],
    },
    'GOOD_ENDING': {
        story: "Malam itu tidak menyelesaikan semua masalah, tapi ia membuka sebuah pintu. Kamu kembali ke kamarmu, perasaan sesak di dadamu sedikit berkurang. Kamu mengambil buku sketsamu dan sebatang pensil. Untuk pertama kalinya setelah sekian lama, kamu mulai menggambar. Sebuah awal yang baru. Jalan di depan masih panjang, tapi setidaknya, kamu tidak lagi berjalan sendirian.",
        location: "Kamar Banyu",
        image: "BANYU_ROOM_MORNING",
        interactableObjects: [],
        actions: [
            { text: "Mulai Lagi", nextNodeId: "START" }
        ],
    },
    'ALTERNATE_ENDING': {
        story: "Di terminal bus yang remang-remang, kamu membeli tiket ke kota yang bahkan tidak kamu kenal. Sambil menunggu bus berangkat, kamu menatap keluar jendela. Kota ini, dengan segala kenangannya, perlahan akan kamu tinggalkan. Ada rasa takut, tapi juga ada secercah kebebasan. Ini adalah halaman kosongmu. Kamu akan menulis ceritamu sendiri, mulai dari sekarang.",
        location: "Terminal Bus",
        image: "TERMINAL_BUS",
        interactableObjects: [],
        actions: [
            { text: "Mulai Lagi", nextNodeId: "START" }
        ],
    },
    'BAD_ENDING': {
        story: "Keheningan malam adalah satu-satunya temanmu. Kamu memanjat pagar pembatas, angin malam menerpa wajahmu. Untuk sesaat, semuanya terasa tenang. Beban itu akhirnya terangkat.",
        location: "Jembatan",
        image: "JEMBATAN_MALAM",
        interactableObjects: [],
        actions: [
            { text: "Mulai Lagi", nextNodeId: "START" }
        ],
    }
};
