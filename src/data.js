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
    metahuman: `${IMG}/legacy/service-metahuman-c2.webp`,
    animation: `${IMG}/legacy/service-configurator.webp`, // legacy file names were swapped: this is the ad render
    configurator: `${IMG}/legacy/service-animation.webp`, // and this is the configurator UI
    simulation: `${IMG}/legacy/service-vr.webp`,
  },
  capImagesWide: {
    metahuman: `${IMG}/legacy/service-metahuman-w2.webp`,
    animation: `${IMG}/legacy/service-configurator.webp`,
    configurator: `${IMG}/legacy/service-animation.webp`,
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
  studioBg: `${IMG}/legacy/bg-studio.webp`, // dark abstract texture (decorative)
  contactBg: `${IMG}/legacy/bg-contact.webp`,
  // OMNIQ listings (Korean storefronts; the app is not released in the US yet)
  stores: {
    appstore: "https://apps.apple.com/kr/app/omniq/id6802925353",
    play: "https://play.google.com/store/apps/details?id=com.mediaartnation.omniq&hl=ko&gl=KR",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=72+Macheon-ro+Songpa-gu+Seoul",
};
