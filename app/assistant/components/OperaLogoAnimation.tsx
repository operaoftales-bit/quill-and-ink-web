
"use client";

import Image from "next/image";
import OperaSpirit from "./OperaSpirit";
import "./opera-logo-animation.css";

export default function OperaLogoAnimation() {
  return (
    <section
      className="opera-logo-test"
      aria-label="Opera introduces the Quill and Ink logo"
    >
      <div className="opera-logo-scene">
        
<div className="opera-starfield" aria-hidden="true">
  <div className="opera-fixed-stars" />
  <span className="opera-twinkle star-one">✦</span>
  <span className="opera-twinkle star-two">✧</span>
  <span className="opera-twinkle star-three">✦</span>
  <span className="opera-shooting-star shooting-one" />
  <span className="opera-shooting-star shooting-two" />
</div>


<div className="opera-plugin-labels" aria-hidden="true">
  <div className="opera-plugin-track">
    {[
      "Advanced AutoMod",
      "Anchor",
      "AutoMod",
      "Birthday",
      "Bulletin",
      "Confessions",
      "Economy",
      "Games",
      "Giveaway",
      "Leveling",
      "Logging",
      "Moderation",
      "Opera Assistant",
      "Premium Tickets",
      "Pressure",
      "Reaction Roles",
      "Robbery",
      "Store",
      "TCG",
      "Tickets",
      "Utility",
      "Voice",
      "Welcome",
    ].map((plugin, index) => (
      <div className="opera-plugin" key={`${plugin}-${index}`}>
        <span className="opera-plugin-star">
          {index % 4 === 2 ? "✧" : "✦"}
        </span>
        {plugin}
      </div>
    ))}
  </div>
</div>


        <div className="opera-scene-mascot">
          <OperaSpirit expression="curious" />
        </div>

        <div className="opera-scene-logo">
          <Image
            src="/images/quill-icon.png"
            alt="Quill & Ink"
            width={360}
            height={360}
            priority
            className="opera-scene-logo-image"
          />
          
  
        </div>

        <p className="opera-scene-tagline">
          Built for communities. Made for stories.
        </p>
      </div>

      <p className="opera-logo-instructions">
        Opera has something to show you.
      </p>

    </section>
  );
}
