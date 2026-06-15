/**
 * Phonk Battle — Song catalog
 * Each song maps to real files in /public/audio and /public/images.
 */
export const songs = [
  {
    id: 1,
    title: "Luz Roja",
    artist: "Unknown",
    audioSrc: "/audio/Luz Roja.mp3",
    imageSrc: "/images/Luz Roja.jpg",
    coverColor: "#ff2d55",
  },
  {
    id: 2,
    title: "MONTAGEM XONADA",
    artist: "Unknown",
    audioSrc: "/audio/MONTAGEM XONADA.mp3",
    imageSrc: "/images/MONTAGEM XONADA.jpg",
    coverColor: "#bf5af2",
  },
  {
    id: 3,
    title: "Montagem Pegadora",
    artist: "Unknown",
    audioSrc: "/audio/Montagem Pegadora.mp3",
    imageSrc: "/images/Montagem Pegadora.jpg",
    coverColor: "#ff9f0a",
  },
  {
    id: 4,
    title: "Montagem Rugada",
    artist: "Unknown",
    audioSrc: "/audio/Montagem Rugada.mp3",
    imageSrc: "/images/Montagem Rugada.jpeg",
    coverColor: "#30d158",
  },
  {
    id: 5,
    title: "Montagem Coma",
    artist: "Unknown",
    audioSrc: "/audio/Montagem-Coma.mp3",
    imageSrc: "/images/MONTAGEM-COMA.jpg",
    coverColor: "#64d2ff",
  },
  {
    id: 6,
    title: "NO BATIDAO",
    artist: "Unknown",
    audioSrc: "/audio/NO BATIDAO.mp3",
    imageSrc: "/images/NO BATIDAO.jfif",
    coverColor: "#ff375f",
  },
  {
    id: 7,
    title: "Passo Bem Solto",
    artist: "Unknown",
    audioSrc: "/audio/Passo Bem Solto.mp3",
    imageSrc: "/images/Passo_Bem_Solto.jpg",
    coverColor: "#ffd60a",
  },
  {
    id: 8,
    title: "Sneha Phonk",
    artist: "Unknown",
    audioSrc: "/audio/Sneha-Phonk.mp3",
    imageSrc: "/images/Sneha-Phonk.jfif",
    coverColor: "#5e5ce6",
  },
  {
    id: 9,
    title: "Heavenly Jumpstyle",
    artist: "Unknown",
    audioSrc: "/audio/heavenly_jumpstyle.mp3",
    imageSrc: "/images/Heavenly Jumpstyle.jfif",
    coverColor: "#ac8e68",
  },
  {
    id: 10,
    title: "Montagem Alquimia",
    artist: "Unknown",
    audioSrc: "/audio/montagem-alquima.m4a",
    imageSrc: "/images/MONTAGEM-ALQUIMIA.jpg",
    coverColor: "#ff6482",
  },
];

/**
 * Returns two different random songs from the catalog.
 * @returns {[object, object]} A tuple of two distinct song objects.
 */
export function getRandomPair() {
  const shuffled = [...songs].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}
