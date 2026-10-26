/** Language-independent content: image paths and structured lists. */
const IMG = "/assets/img";

const clients = [
  { name: "Hyundai", img: `${IMG}/ir/project-hyundai.webp` },
  { name: "Porsche", img: `${IMG}/ir/project-porsche.webp` },
  { name: "Bugatti", img: `${IMG}/ir/project-bugatti.webp` },
  { name: "Kakao Mobility", img: `${IMG}/ir/project-kakao-mobility.webp` },
  { name: "Kakao Entertainment", img: `${IMG}/ir/project-kakao-ent.webp` },
  { name: "Firefighting Drone", img: `${IMG}/ir/project-drone.webp` },
  { name: "Donga-Otsuka", img: `${IMG}/ir/project-donga-otsuka.webp` },
  { name: "Military Simulation", img: `${IMG}/ir/project-military.webp` },
];

const counts = { metahuman: 8, animation: 15, configurator: 12, simulation: 1 };
const gallery = Object.entries(counts).flatMap(([cat, n]) =>
  Array.from({ length: n }, (_, i) => ({
    cat,
    img: `${IMG}/work/${cat}-${String(i + 1).padStart(2, "0")}.webp`,
    w: 335,
    h: 216,
  }))
);

const work = [
  ...clients.map((c) => ({ cat: "clients", title: c.name, img: c.img, w: 1600, h: 800 })),
  ...gallery,
];

module.exports = {
  IMG,
  clients,
  work,
  capImages: {
    metahuman: `${IMG}/legacy/service-metahuman.webp`,
    animation: `${IMG}/legacy/service-animation.webp`,
    configurator: `${IMG}/legacy/service-configurator.webp`,
    simulation: `${IMG}/legacy/service-vr.webp`,
  },
  heroBg: `${IMG}/legacy/swiper-01.webp`,
  omniq: {
    mark: `${IMG}/ir/omniq-mark.webp`,
    screen: `${IMG}/ir/omniq-screen-01.webp`,
    screenLogin: `${IMG}/ir/omniq-screen-login.webp`,
    original: `${IMG}/ir/omniq-original.webp`,
    result: `${IMG}/ir/omniq-result.webp`,
    fourUp: `${IMG}/ir/omniq-4up.webp`,
  },
  omniplay: {
    concept: `${IMG}/ir/omniplay-concept.webp`,
    hero: `${IMG}/ir/hero-illustration.webp`,
    photos: [
      `${IMG}/ir/omniplay-proto-01.webp`,
      `${IMG}/ir/omniplay-proto-02.webp`,
      `${IMG}/ir/omniplay-office-01.webp`,
      `${IMG}/ir/omniplay-office-02.webp`,
      `${IMG}/ir/omniplay-office-03.webp`,
    ],
  },
  studioBg: `${IMG}/legacy/bg-studio.webp`,
  contactBg: `${IMG}/legacy/bg-contact.webp`,
  // store links are not public yet; the page shows buttons that fall back to the store search
  stores: {
    appstore: "https://apps.apple.com/search?term=OMNIQ",
    play: "https://play.google.com/store/search?q=OMNIQ&c=apps",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=54+Haeryong-ro+Pocheon-si+Gyeonggi-do",
};
