export const COLORS = {
  primary: '#FF4655', 
  background: '#0F1923',
  cardBg: '#1F2326',
  textPrimary: '#ECE8E1',
  textSecondary: '#768079',
  white: '#FFFFFF',
  gold: '#D4AF37'
};

export const FONTS = {
  regular: 'Poppins-Regular',
  bold: 'Poppins-Bold',
  semiBold: 'Poppins-SemiBold',
};

// DATA DIPERBARUI DENGAN PATH VIDEO LOKAL
export const TOURNAMENTS = [
  {
    id: 1,
    name: "VCT Champions 2021",
    location: "Berlin, Germany",
    winner: "Acend",
    lat: 52.5200,
    lng: 13.4050,
    year: "2021",
    prizePool: "US$ 1,000,000",
    score: "Acend 3-2 Gambit Esports",
    mvp: "Aleksander “zeek” Zygmunt",
    anthemUrl: "https://youtu.be/h7MYJghRWt0?si=bL4V5yqCi1DjLyxr",
    // BARU: Tambahkan path require ke video lokal
    localAnthem: require('@/assets/videos/anthem_2021.mp4')
  },
  {
    id: 2,
    name: "VCT Champions 2022",
    location: "Istanbul, Turkey",
    winner: "LOUD",
    lat: 41.0082,
    lng: 28.9784,
    year: "2022",
    prizePool: "US$ 1,000,000",
    score: "LOUD 3-1 OpTic Gaming",
    mvp: "Bryan “pANcada” Luna",
    anthemUrl: "https://youtu.be/DqgK4llE1cw?si=ABorcrI05aOFO593",
    localAnthem: require('@/assets/videos/anthem_2022.mp4')
  },
  {
    id: 3,
    name: "VCT Champions 2023",
    location: "Los Angeles, USA",
    winner: "Evil Geniuses",
    lat: 34.0522,
    lng: -118.2437,
    year: "2023",
    prizePool: "US$ 2,250,000",
    score: "Evil Geniuses 3-1 Paper Rex",
    mvp: "Max “Demon1” Mazanov",
    anthemUrl: "https://youtu.be/CdZN8PI3MqM?si=Ka1gLnoOl3kBPiG-",
    localAnthem: require('@/assets/videos/anthem_2023.mp4')
  },
  {
    id: 5,
    name: "VCT Champions 2024",
    location: "Seoul, South Korea",
    winner: "EDward Gaming",
    lat: 37.5665,
    lng: 126.9780,
    year: "2024",
    prizePool: "US$ 2,250,000",
    score: "EDward Gaming 3-2 Team Heretics",
    mvp: "Zheng “ZmjjKK” Yongkang",
    anthemUrl: "https://youtu.be/DX4BE9GmpH4?si=2gPaJDC9nTGuQ57Y",
    localAnthem: require('@/assets/videos/anthem_2024.mp4')
  },
  {
    id: 6,
    name: "VCT Champions 2025",
    location: "Paris, France",
    winner: "NRG",
    lat: 48.8566,
    lng: 2.3522,
    year: "2025",
    prizePool: "US$ 2,250,000",
    score: "NRG 3-2 Fnatic",
    mvp: "Brock “brawk” Somerhalder",
    anthemUrl: "https://youtu.be/cLx3tyzht3Y?si=HK9RRt8-plUVLB4s",
    localAnthem: require('@/assets/videos/anthem_2025.mp4')
  }
];