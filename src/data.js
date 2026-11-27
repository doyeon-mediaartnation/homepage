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
  /** Downloadable company documents (served from /files/). Bump `?v=` whenever a PDF is replaced
      so browsers holding the old copy fetch the new one. */
  docs: [
    { key: "ir", file: "/files/MediaArtNation_IR_2026.pdf?v=20261126", pages: 27, size: "4.1MB" },
    { key: "proposal", file: "/files/MediaArtNation_OMNIPlay_Partnership_Proposal_2026.pdf?v=20261126b", pages: 34, size: "4.9MB" },
  ],
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
    /** Before/after sliders: the same selfie cropped to line up with a frame from each OMNIQ theme video.
        Keys match i18n `omniq.compareThemes`. */
    compare: ["toon", "santa"].map((k) => ({
      key: k,
      before: `${IMG}/ir/omniq-cmp-${k}-before.webp`,
      after: `${IMG}/ir/omniq-cmp-${k}-after.webp`,
    })),
    fourUp: `${IMG}/ir/omniq-4up.webp`,
    /** Feature-card media, in the order of i18n `omniq.features` (taken from the 2026 IR deck, p.6/8/9).
        Each entry is a list of [src, w, h, object-position]; several entries tile inside the box,
        and `live` / `share` compose a small phone scene (see featureMedia in pages/omniq.js). */
    featureMedia: [
      {
        kind: "live",
        items: [
          [`${IMG}/ir/omniq-feat-live-original.webp`, 154, 300, "50% 50%"],
          [`${IMG}/ir/omniq-screen-01.webp`, 946, 2048, "50% 62%"],
        ],
      },
      {
        kind: "quad",
        items: [
          [`${IMG}/ir/omniq-look-cowboy.webp`, 488, 237, "50% 30%"],
          [`${IMG}/ir/omniq-look-padding.webp`, 488, 237, "30% 40%"],
          [`${IMG}/ir/omniq-look-aviator.webp`, 488, 237, "50% 30%"],
          [`${IMG}/ir/omniq-look-hoodie.webp`, 488, 237, "30% 40%"],
        ],
      },
      {
        kind: "pair",
        items: [
          [`${IMG}/ir/omniq-look-plain.webp`, 488, 237, "33% 40%"],
          [`${IMG}/ir/omniq-look-armor.webp`, 488, 237, "32% 40%"],
        ],
      },
      { kind: "share", items: [[`${IMG}/ir/omniq-feat-result.webp`, 323, 619, "50% 30%"]] },
    ],
  },
  omniplay: {
    concept: `${IMG}/ir/omniplay-concept.webp`,
    hero: `${IMG}/ir/hero-illustration.webp`,
    /** Product shot and "for whom" concept images from the partnership proposal (p.8, p.13). */
    device: `${IMG}/ir/omniplay-device.webp`,
    forWhom: [`${IMG}/ir/omniplay-for-kids.webp`, `${IMG}/ir/omniplay-for-family.webp`, `${IMG}/ir/omniplay-for-active.webp`],
    /** "In development" gallery: real prototype play from the 2026 IR deck (p.14-15) and the
        game-select screen from the partnership proposal (p.12). `game` indexes i18n `omniplay.games`;
        `cam` is the player camera shown picture-in-picture. */
    play: [
      { src: `${IMG}/ir/omniplay-play-select.webp`, w: 930, h: 525 },
      { src: `${IMG}/ir/omniplay-play-baseball.webp`, w: 663, h: 345, game: 1, cam: `${IMG}/ir/omniplay-play-baseball-cam.webp` },
      { src: `${IMG}/ir/omniplay-play-basketball.webp`, w: 660, h: 345, game: 0, cam: `${IMG}/ir/omniplay-play-basketball-cam.webp` },
      { src: `${IMG}/ir/omniplay-play-rhythm.webp`, w: 660, h: 345, game: 2, cam: `${IMG}/ir/omniplay-play-rhythm-cam.webp` },
      { src: `${IMG}/ir/omniplay-play-flying.webp`, w: 667, h: 348, game: 3, cam: `${IMG}/ir/omniplay-play-flying-cam.webp` },
    ],
  },
  contactBg: `${IMG}/legacy/bg-contact.webp`,
  // OMNIQ listings (Korean storefronts; the app is not released in the US yet)
  stores: {
    appstore: "https://apps.apple.com/kr/app/omniq/id6802925353",
    play: "https://play.google.com/store/apps/details?id=com.mediaartnation.omniq&hl=ko&gl=KR",
  },
  mapUrl: "https://maps.app.goo.gl/AMHqWZPGmzshZVVw8",
};
