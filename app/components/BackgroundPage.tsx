
import type { CSSProperties } from "react";

const shootingStars = Array.from({ length: 12 }, (_, index) => index + 1);

const twinklingStars = [
  [5, 12, 1, 3.8, 0.2], [12, 31, 2, 4.6, 1.7],
  [18, 8, 1, 3.2, 0.8], [23, 46, 1, 5.1, 2.4],
  [29, 17, 2, 4.2, 1.1], [34, 68, 1, 3.5, 2.8],
  [39, 27, 1, 5.4, 0.5], [44, 9, 2, 4.8, 3.1],
  [48, 54, 1, 3.6, 1.4], [53, 22, 1, 4.4, 2.2],
  [58, 76, 2, 5.2, 0.7], [63, 39, 1, 3.9, 2.9],
  [68, 13, 1, 4.7, 1.8], [72, 59, 2, 3.4, 0.4],
  [77, 28, 1, 5.3, 2.5], [82, 7, 2, 4.1, 1.2],
  [87, 44, 1, 3.7, 3.2], [94, 19, 1, 4.9, 0.9],
  [9, 83, 2, 4.3, 2.6], [16, 61, 1, 3.6, 0.3],
  [25, 91, 1, 5.2, 1.9], [32, 38, 2, 4.5, 2.7],
  [37, 84, 1, 3.3, 1.5], [46, 72, 1, 4.8, 0.6],
  [55, 91, 1, 3.9, 2.1], [61, 6, 2, 5.1, 3.0],
  [70, 88, 1, 4.2, 1.3], [75, 48, 1, 3.5, 2.3],
  [84, 72, 2, 4.6, 0.1], [91, 86, 1, 3.8, 1.6],
  [3, 43, 1, 5.0, 2.0], [21, 75, 1, 4.1, 0.7],
  [41, 43, 2, 3.7, 2.6], [66, 29, 1, 4.9, 1.0],
  [79, 94, 1, 3.4, 2.4], [97, 57, 2, 4.5, 1.8],
] as const;

const constellations = [
  {
    className: "one",
    points: "95,120 145,92 191,125 224,83 270,106",
    stars: [[95, 120], [145, 92], [191, 125], [224, 83], [270, 106]],
  },
  {
    className: "two",
    points: "715,180 758,145 800,169 844,124 884,151",
    stars: [[715, 180], [758, 145], [800, 169], [844, 124], [884, 151]],
  },
  {
    className: "three",
    points: "110,690 154,655 193,681 225,632 270,650 300,614",
    stars: [[110, 690], [154, 655], [193, 681], [225, 632], [270, 650], [300, 614]],
  },
  {
    className: "four",
    points: "700,730 744,694 786,715 821,667 865,688 903,650",
    stars: [[700, 730], [744, 694], [786, 715], [821, 667], [865, 688], [903, 650]],
  },
];

export default function BackgroundPage() {
  return (
    <div className="site-background" aria-hidden="true">
      <div className="site-background__nebula site-background__nebula--cyan" />
      <div className="site-background__nebula site-background__nebula--blue" />
      <div className="site-background__nebula site-background__nebula--gold" />

      <div className="site-background__stars" />

      <div className="site-background__twinkle-field">
        {twinklingStars.map(([left, top, size, duration, delay], index) => (
          <span
            key={index}
            className="site-background__twinkle-star"
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                "--twinkle-size": `${size}px`,
                "--twinkle-duration": `${duration}s`,
                "--twinkle-delay": `${delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <svg
        className="site-background__constellations"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {constellations.map((constellation) => (
          <g
            key={constellation.className}
            className={`site-background__constellation site-background__constellation--${constellation.className}`}
          >
            <polyline points={constellation.points} />
            {constellation.stars.map(([cx, cy], index) => (
              <circle key={index} cx={cx} cy={cy} r={index % 2 === 0 ? 2 : 1.5} />
            ))}
          </g>
        ))}
      </svg>

      <div className="site-background__shooting-stars">
        {shootingStars.map((star) => (
          <span
            key={star}
            className={`site-background__shooting-star site-background__shooting-star--${star}`}
          />
        ))}
      </div>

      <div className="site-background__veil" />
    </div>
  );
}
