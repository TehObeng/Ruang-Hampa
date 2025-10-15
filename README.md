# Ruang Hampa

Sebuah simulasi naratif tentang depresi dan dinamika keluarga di Indonesia.

## 🎮 Tentang Game

"Ruang Hampa" adalah sebuah simulasi interaktif yang mengeksplorasi pengalaman seseorang yang menghadapi depresi dalam konteks keluarga Indonesia. Game ini menggunakan pilihan naratif untuk menggambarkan kompleksitas kesehatan mental dan hubungan keluarga.

## 🚀 Deployment

### Netlify Deployment

1. Push ke GitHub repository
2. Connect repository ke Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (Custom Design System)
- **Deployment**: Netlify

## 📁 Project Structure

```
/
├── index.html          # Entry HTML
├── main.tsx           # App entry point
├── App.tsx            # Main app component
├── types.ts           # TypeScript definitions
├── gameEngine.ts      # Game logic
├── storyData.ts       # Story content
├── imageAssets.ts     # Image paths
├── styles.css         # Global styles
└── public/            # Static assets
```

## 🎯 Features

- Interactive narrative gameplay
- Mental energy system
- Relationship tracking
- Journal/memento system
- Multiple endings
- Responsive design (mobile + desktop)
- Save/load functionality
- TypeScript type safety

## ⚠️ Content Warning

Game ini mengandung tema-tema sensitif termasuk depresi, konflik keluarga, dan kesehatan mental. Mohon bermain dengan bijak.

## 📝 License

This project is for educational and research purposes.

---

Made with ❤️ for mental health awareness
