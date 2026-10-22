
"use client";

import type { OperaExpression } from "./opera-types";

type OperaSpiritProps = {
  className?: string;
  expression?: OperaExpression;
};

const COLORS = {
  navy: "#102B3B",
  teal: "#287F83",
  tealLight: "#55C4BB",
  tealDark: "#19545F",
  cyan: "#A2F7EC",
  gold: "#E8BD63",
  goldLight: "#FFE3A0",
  goldDark: "#B98539",
  white: "#F5FFFF",
  mouth: "#102F3B",
};

export default function OperaSpirit({
  className = "",
  expression = "happy",
}: OperaSpiritProps) {
  return (
    <svg
      viewBox="0 0 320 340"
      xmlns="http://www.w3.org/2000/svg"
      className={`opera-spirit ${className}`}
      data-expression={expression}
      role="img"
      aria-label="Opera, the enchanted robot companion"
    >
      <defs>
        <linearGradient id="opera-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.tealLight} />
          <stop offset="45%" stopColor={COLORS.teal} />
          <stop offset="100%" stopColor={COLORS.tealDark} />
        </linearGradient>

        <linearGradient id="opera-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#163C4B" />
          <stop offset="100%" stopColor={COLORS.navy} />
        </linearGradient>

        <linearGradient id="opera-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.goldDark} />
          <stop offset="50%" stopColor={COLORS.goldLight} />
          <stop offset="100%" stopColor={COLORS.gold} />
        </linearGradient>

        <radialGradient id="opera-eye-glow">
          <stop offset="0%" stopColor={COLORS.white} />
          <stop offset="45%" stopColor={COLORS.cyan} />
          <stop offset="100%" stopColor={COLORS.tealLight} />
        </radialGradient>

        <linearGradient id="opera-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.white} />
          <stop offset="45%" stopColor={COLORS.cyan} />
          <stop offset="100%" stopColor="#45AFC0" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* ================================================== */}
      {/* 1. BACK-MOUNTED JETPACK                            */}
      {/* ================================================== */}
      <g className="opera-jetpack">
        <g transform="translate(17.6 19.8) scale(0.89)">
        {/* Mounting frame: centered behind the torso */}
        <path
          d="M126 207 L119 218 L119 258 L132 270
             M194 207 L201 218 L201 258 L188 270"
          fill="none"
          stroke={COLORS.goldDark}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left thruster */}
        <g className="opera-thruster-left">
          <rect
            x="108"
            y="192"
            width="31"
            height="76"
            rx="13"
            fill="url(#opera-shell)"
            stroke={COLORS.gold}
            strokeWidth="2.5"
          />

          <rect
            x="114"
            y="202"
            width="19"
            height="34"
            rx="7"
            fill={COLORS.navy}
            stroke={COLORS.tealLight}
            strokeWidth="1.5"
          />

          <path
            d="M119 211 L128 211 M119 218 L128 218"
            stroke={COLORS.cyan}
            strokeWidth="2"
            strokeLinecap="round"
          />

          <rect
            x="112"
            y="250"
            width="23"
            height="14"
            rx="5"
            fill={COLORS.goldDark}
            stroke={COLORS.gold}
            strokeWidth="2"
          />

          <path
            d="M115 266 L115 276 Q123 291 131 276 L131 266 Z"
            fill={COLORS.navy}
            stroke={COLORS.gold}
            strokeWidth="2"
          />

          <path
            className="opera-jet-flame"
            d="M119 279 Q123 291 123 302 Q131 290 127 279 Z"
            fill="url(#opera-flame)"
          />
        </g>

        {/* Right thruster */}
        <g className="opera-thruster-right">
          <rect
            x="181"
            y="192"
            width="31"
            height="76"
            rx="13"
            fill="url(#opera-shell)"
            stroke={COLORS.gold}
            strokeWidth="2.5"
          />

          <rect
            x="187"
            y="202"
            width="19"
            height="34"
            rx="7"
            fill={COLORS.navy}
            stroke={COLORS.tealLight}
            strokeWidth="1.5"
          />

          <path
            d="M192 211 L201 211 M192 218 L201 218"
            stroke={COLORS.cyan}
            strokeWidth="2"
            strokeLinecap="round"
          />

          <rect
            x="185"
            y="250"
            width="23"
            height="14"
            rx="5"
            fill={COLORS.goldDark}
            stroke={COLORS.gold}
            strokeWidth="2"
          />

          <path
            d="M189 266 L189 276 Q197 291 205 276 L205 266 Z"
            fill={COLORS.navy}
            stroke={COLORS.gold}
            strokeWidth="2"
          />

          <path
            className="opera-jet-flame"
            d="M193 279 Q197 291 197 302 Q205 290 201 279 Z"
            fill="url(#opera-flame)"
          />
        </g>

        {/* Top connection bridge */}
        <path
          d="M137 207 Q160 195 183 207"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      

      {/* ================================================== */}
      {/* 2. SLEEK TORSO                                     */}
      {/* ================================================== */}
      <g className="opera-body">
        {/* Neck joint */}
        <rect
          x="147"
          y="184"
          width="26"
          height="28"
          rx="9"
          fill={COLORS.navy}
          stroke={COLORS.goldDark}
          strokeWidth="2"
        />

        <rect
          x="153"
          y="190"
          width="14"
          height="17"
          rx="5"
          fill="url(#opera-metal)"
        />

        {/* Streamlined torso shell */}
        <path
          d="
            M139 202
            Q160 193 181 202
            Q197 209 199 229
            L194 269
            Q191 285 175 291
            L145 291
            Q129 285 126 269
            L121 229
            Q123 209 139 202 Z
          "
          fill="url(#opera-shell)"
          stroke={COLORS.tealDark}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Side armor panels */}
        <path
          d="M130 226 L135 267 L143 273 L140 226 Z"
          fill={COLORS.tealDark}
          opacity="0.75"
        />

        <path
          d="M190 226 L185 267 L177 273 L180 226 Z"
          fill={COLORS.tealDark}
          opacity="0.75"
        />

        {/* Chest display */}
        <path
          d="M143 218 Q160 211 177 218 L182 258
             Q160 270 138 258 Z"
          fill="url(#opera-screen)"
          stroke={COLORS.tealLight}
          strokeWidth="2"
        />

        {/* Story-core ring */}
        <circle
          cx="160"
          cy="241"
          r="13"
          fill={COLORS.navy}
          stroke={COLORS.gold}
          strokeWidth="2.5"
        />

        <circle
          cx="160"
          cy="241"
          r="8"
          fill={COLORS.tealDark}
          stroke={COLORS.cyan}
          strokeWidth="1.5"
        />

        <path
          d="M160 235 L164 241 L160 247 L156 241 Z"
          fill={COLORS.goldLight}
        />

        {/* Small torso status lights */}
        <circle cx="145" cy="263" r="2" fill={COLORS.cyan} />
        <circle cx="160" cy="266" r="2" fill={COLORS.gold} />
        <circle cx="175" cy="263" r="2" fill={COLORS.cyan} />

        {/* Lower wheel suspension */}
        <path
          d="M147 286 L147 299 L173 299 L173 286"
          fill={COLORS.navy}
          stroke={COLORS.goldDark}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <rect
          x="151"
          y="291"
          width="18"
          height="12"
          rx="4"
          fill={COLORS.gold}
        />
      </g>
      

      {/* ================================================== */}
      {/* 3. FLEXIBLE TUBE ARMS                              */}
      {/* ================================================== */}
      <g className="opera-arms">
        {/* Left shoulder socket */}
        <circle
          cx="126"
          cy="216"
          r="10"
          fill={COLORS.navy}
          stroke={COLORS.gold}
          strokeWidth="3"
        />

        <circle cx="126" cy="216" r="4" fill={COLORS.cyan} />

        {/* Left flexible tube */}
        <path
          d="M123 222 C111 229 107 239 110 248
             C112 254 109 259 103 262"
          fill="none"
          stroke={COLORS.tealDark}
          strokeWidth="13"
          strokeLinecap="round"
        />

        <path
          d="M123 222 C111 229 107 239 110 248
             C112 254 109 259 103 262"
          fill="none"
          stroke={COLORS.tealLight}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Left tube connector rings */}
        <g stroke={COLORS.gold} strokeWidth="2.5" fill={COLORS.goldDark}>
          <ellipse cx="111" cy="244" rx="6" ry="4" transform="rotate(-12 111 244)" />
          <ellipse cx="106" cy="257" rx="6" ry="4" transform="rotate(-40 106 257)" />
        </g>

        {/* Left wrist connector */}
        <circle
          cx="101"
          cy="264"
          r="7"
          fill={COLORS.navy}
          stroke={COLORS.gold}
          strokeWidth="2"
        />

        {/* Left three-prong gripper */}
        <g
          className="opera-hand-left"
          fill="none"
          stroke={COLORS.tealLight}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M99 267 L92 272 L86 269" />
          <path d="M99 268 L96 278 L90 281" />
          <path d="M103 267 L107 276 L103 282" />
        </g>

        <circle cx="86" cy="269" r="2.5" fill={COLORS.gold} />
        <circle cx="90" cy="281" r="2.5" fill={COLORS.gold} />
        <circle cx="103" cy="282" r="2.5" fill={COLORS.gold} />

        {/* Right shoulder socket */}
        <circle
          cx="194"
          cy="216"
          r="10"
          fill={COLORS.navy}
          stroke={COLORS.gold}
          strokeWidth="3"
        />

        <circle cx="194" cy="216" r="4" fill={COLORS.cyan} />

        {/* Right flexible tube */}
        <path
          d="M197 222 C209 228 214 237 211 246
             C209 252 215 258 223 260"
          fill="none"
          stroke={COLORS.tealDark}
          strokeWidth="13"
          strokeLinecap="round"
        />

        <path
          d="M197 222 C209 228 214 237 211 246
             C209 252 215 258 223 260"
          fill="none"
          stroke={COLORS.tealLight}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Right tube connector rings */}
        <g stroke={COLORS.gold} strokeWidth="2.5" fill={COLORS.goldDark}>
          <ellipse cx="211" cy="243" rx="6" ry="4" transform="rotate(12 211 243)" />
          <ellipse cx="217" cy="255" rx="6" ry="4" transform="rotate(35 217 255)" />
        </g>

        {/* Right wrist connector */}
        <circle
          cx="225"
          cy="261"
          r="7"
          fill={COLORS.navy}
          stroke={COLORS.gold}
          strokeWidth="2"
        />

        {/* Right three-prong gripper holding the quill */}
        <g
          className="opera-hand-right"
          fill="none"
          stroke={COLORS.tealLight}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M223 258 L218 251 L222 246" />
          <path d="M227 257 L234 250 L237 244" />
          <path d="M229 263 L237 267 L242 263" />
        </g>

        <circle cx="222" cy="246" r="2.5" fill={COLORS.gold} />
        <circle cx="237" cy="244" r="2.5" fill={COLORS.gold} />
        <circle cx="242" cy="263" r="2.5" fill={COLORS.gold} />
      </g>
      
     
{/* ================================================== */}
{/* 4. SINGLE CENTRAL WHEEL — FRONT VIEW               */}
{/* ================================================== */}

<g className="opera-wheel">
  {/* Suspension */}
  <path
    d="M147 291 L147 301 L173 301 L173 291"
    fill={COLORS.navy}
    stroke={COLORS.goldDark}
    strokeWidth="3"
    strokeLinejoin="round"
  />

  {/* Thick tire body: rounded cylinder silhouette */}
  <path
    d="
      M137 305
      Q137 299 145 299
      L175 299
      Q183 299 183 305
      L183 341
      Q183 351 175 353
      L145 353
      Q137 351 137 341
      Z
    "
    fill="#111820"
    stroke="#35464D"
    strokeWidth="3"
    strokeLinejoin="round"
  />

  {/* Curved tread surface */}
  <path
    d="
      M140 307
      Q160 300 180 307
      L180 339
      Q160 346 140 339
      Z
    "
    fill="#202D35"
    stroke="#53636A"
    strokeWidth="2"
  />

  {/* Tread grooves */}
  <g
    fill="none"
    stroke="#68767C"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M145 307 Q141 323 145 339" />
    <path d="M155 304 Q151 323 155 342" />
    <path d="M165 304 Q169 323 165 342" />
    <path d="M175 307 Q179 323 175 339" />
  </g>
</g>


      {/* ================================================== */}
      {/* 5. ROUND ROBOT HEAD                                */}
      {/* ================================================== */}
      <g className="opera-head">
        {/* Head mounting collar */}
        <path
          d="M137 185 L137 194 Q160 204 183 194 L183 185"
          fill={COLORS.navy}
          stroke={COLORS.goldDark}
          strokeWidth="2.5"
        />

        <path
          d="M145 191 Q160 197 175 191"
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth="2"
        />

        {/* Outer spherical head shell */}
        <circle
          cx="160"
          cy="111"
          r="87"
          fill="url(#opera-shell)"
          stroke={COLORS.tealDark}
          strokeWidth="5"
        />

        {/* Outer shell highlight */}
        <path
          d="M105 62 Q124 34 155 31"
          fill="none"
          stroke={COLORS.tealLight}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Side mechanical hinge caps */}
        <g className="opera-head-hinges">
          <rect
            x="72"
            y="96"
            width="14"
            height="30"
            rx="6"
            fill="url(#opera-metal)"
            stroke={COLORS.goldDark}
            strokeWidth="2"
          />

          <circle cx="79" cy="111" r="4" fill={COLORS.navy} />

          <rect
            x="234"
            y="96"
            width="14"
            height="30"
            rx="6"
            fill="url(#opera-metal)"
            stroke={COLORS.goldDark}
            strokeWidth="2"
          />

          <circle cx="241" cy="111" r="4" fill={COLORS.navy} />
        </g>

        {/* Dark glass screen inset */}
        <rect
          x="91"
          y="49"
          width="138"
          height="124"
          rx="53"
          fill="url(#opera-screen)"
          stroke={COLORS.tealLight}
          strokeWidth="2.5"
        />

        {/* Glass reflection */}
        <path
          d="M111 66 Q122 55 137 57"
          fill="none"
          stroke={COLORS.white}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.18"
        />

        {/* Gold forehead detail */}
        <path
          d="M135 39 Q160 31 185 39"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Small center indicator */}
        <path
          d="M160 35 L166 42 L160 49 L154 42 Z"
          fill={COLORS.goldLight}
          stroke={COLORS.goldDark}
          strokeWidth="1"
        />

        {/* Small screen status indicators */}
        <circle cx="109" cy="91" r="2" fill={COLORS.tealLight} />
        <circle cx="221" cy="91" r="2" fill={COLORS.tealLight} />
      </g>

      
      {/* ================================================== */}
      {/* 6. EXPRESSIVE DIGITAL FACE                         */}
      {/* ================================================== */}
      <g className="opera-face" data-expression={expression}>
        {/* Eyebrows: their shapes reinforce the emotion */}
        <g
          className="opera-brows"
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth="3"
          strokeLinecap="round"
        >
          {expression === "surprised" || expression === "excited" ? (
            <>
              <path d="M116 76 Q130 67 144 76" />
              <path d="M176 76 Q190 67 204 76" />
            </>
          ) : expression === "confused" || expression === "curious" ? (
            <>
              <path d="M116 79 Q129 68 143 77" />
              <path d="M178 73 Q191 79 203 75" />
            </>
          ) : expression === "sad" || expression === "concerned" ? (
            <>
              <path d="M116 75 Q129 82 143 78" />
              <path d="M177 78 Q191 82 204 75" />
            </>
          ) : expression === "determined" ? (
            <>
              <path d="M116 77 L143 82" />
              <path d="M177 82 L204 77" />
            </>
          ) : expression === "mischievous" || expression === "proud" ? (
            <>
              <path d="M117 78 Q130 72 143 78" />
              <path d="M179 77 Q192 69 203 75" />
            </>
          ) : null}
        </g>

        {/* Eyes */}
        <g className="opera-eyes">
          {expression === "winking" || expression === "shy" ? (
            <>
              <path
                d="M117 103 Q130 113 143 103"
                fill="none"
                stroke={COLORS.cyan}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <ellipse
                cx="190"
                cy="101"
                rx="13"
                ry="17"
                fill="url(#opera-eye-glow)"
              />
              <ellipse
                cx="193"
                cy="97"
                rx="4"
                ry="5"
                fill={COLORS.white}
              />
            </>
          ) : expression === "sleepy" || expression === "relaxed" ? (
            <>
              <path
                d="M117 101 Q130 111 143 101"
                fill="none"
                stroke={COLORS.cyan}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M177 101 Q190 111 203 101"
                fill="none"
                stroke={COLORS.cyan}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </>
          ) : expression === "surprised" || expression === "excited" ? (
            <>
              <ellipse
                cx="130"
                cy="100"
                rx="15"
                ry="20"
                fill="url(#opera-eye-glow)"
              />
              <ellipse
                cx="133"
                cy="94"
                rx="5"
                ry="6"
                fill={COLORS.white}
              />
              <ellipse
                cx="190"
                cy="100"
                rx="15"
                ry="20"
                fill="url(#opera-eye-glow)"
              />
              <ellipse
                cx="193"
                cy="94"
                rx="5"
                ry="6"
                fill={COLORS.white}
              />
            </>
          ) : expression === "mischievous" ? (
            <>
              <path
                d="M116 94 Q130 87 144 98 L142 108 Q130 115 118 107 Z"
                fill="url(#opera-eye-glow)"
              />
              <path
                d="M176 98 Q190 87 204 94 L202 107 Q190 115 178 108 Z"
                fill="url(#opera-eye-glow)"
              />
            </>
          ) : (
            <>
              <ellipse
                cx="130"
                cy="101"
                rx="13"
                ry={expression === "sad" || expression === "concerned" ? 14 : 17}
                fill="url(#opera-eye-glow)"
              />
              <ellipse
                cx="133"
                cy="97"
                rx="4"
                ry="5"
                fill={COLORS.white}
                opacity="0.95"
              />
              <ellipse
                cx="190"
                cy="101"
                rx="13"
                ry={expression === "sad" || expression === "concerned" ? 14 : 17}
                fill="url(#opera-eye-glow)"
              />
              <ellipse
                cx="193"
                cy="97"
                rx="4"
                ry="5"
                fill={COLORS.white}
                opacity="0.95"
              />
            </>
          )}
        </g>

        {/* Mouth: each emotion gets its own silhouette */}
        <g className="opera-mouth">
          {expression === "surprised" ? (
            <ellipse
              cx="160"
              cy="137"
              rx="7"
              ry="10"
              fill={COLORS.cyan}
            />
          ) : expression === "excited" ? (
            <path
              d="M145 132 Q160 154 175 132 Q173 150 160 150 Q147 150 145 132 Z"
              fill={COLORS.cyan}
            />
          ) : expression === "sad" || expression === "concerned" ? (
            <path
              d="M146 145 Q160 130 174 145"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : expression === "confused" ? (
            <path
              d="M148 139 Q158 132 164 139 Q169 144 175 136"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : expression === "mischievous" || expression === "proud" ? (
            <path
              d="M147 137 Q163 146 175 132"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : expression === "determined" ? (
            <path
              d="M149 139 L171 139"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : expression === "sleepy" ? (
            <path
              d="M151 139 Q160 143 169 139"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : expression === "embarrassed" || expression === "shy" ? (
            <path
              d="M151 138 Q160 145 169 138"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : expression === "scribing" ? (
            <path
              d="M151 139 L169 139"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M146 135 Q160 146 174 135"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Cheek pixels */}
          <rect
            x="111"
            y="125"
            width="5"
            height="3"
            rx="1.5"
            fill={COLORS.tealLight}
            opacity={
              expression === "shy" || expression === "embarrassed" ? 1 : 0.75
            }
          />
          <rect
            x="204"
            y="125"
            width="5"
            height="3"
            rx="1.5"
            fill={COLORS.tealLight}
            opacity={
              expression === "shy" || expression === "embarrassed" ? 1 : 0.75
            }
          />
        </g>
      </g>

{/* ================================================== */}
{/* 7. GOLDEN QUILL HELD BY THE RIGHT GRIPPER          */}
{/* ================================================== */}
<g className="opera-quill">
  {/* Main quill shaft */}
  <path
    d="M232 265 Q249 221 267 177"
    fill="none"
    stroke={COLORS.gold}
    strokeWidth="2"
    strokeLinecap="round"
  />

  {/* Fine feather barbs — left side */}
  <g
    fill="none"
    stroke={COLORS.goldLight}
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M239 249 L231 243 M239 249 L234 251" />
    <path d="M242 242 L232 235 M242 242 L236 245" />
    <path d="M245 235 L234 228 M245 235 L238 239" />
    <path d="M248 228 L237 221 M248 228 L241 232" />
    <path d="M251 221 L241 214 M251 221 L244 225" />
    <path d="M254 214 L245 207 M254 214 L247 218" />
    <path d="M257 207 L249 201 M257 207 L250 211" />
    <path d="M260 200 L253 194 M260 200 L253 204" />
    <path d="M263 193 L257 188 M263 193 L256 197" />
    <path d="M265 187 L261 183" />
  </g>

  {/* Fine feather barbs — right side */}
  <g
    fill="none"
    stroke={COLORS.gold}
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M239 249 L246 251" />
    <path d="M242 242 L251 245 M242 242 L249 238" />
    <path d="M245 235 L255 239 M245 235 L252 231" />
    <path d="M248 228 L258 232 M248 228 L255 224" />
    <path d="M251 221 L261 225 M251 221 L258 217" />
    <path d="M254 214 L264 218 M254 214 L261 210" />
    <path d="M257 207 L266 210 M257 207 L264 203" />
    <path d="M260 200 L268 203 M260 200 L266 196" />
    <path d="M263 193 L269 195 M263 193 L268 190" />
  </g>

  {/* Fine pointed feather tip */}
  <path
    d="M267 177 L264 185"
    fill="none"
    stroke={COLORS.goldLight}
    strokeWidth="1.5"
    strokeLinecap="round"
  />

  {/* Writing nib */}
  <path
    d="M232 265 L226 275 L237 268 Z"
    fill={COLORS.goldLight}
    stroke={COLORS.goldDark}
    strokeWidth="1"
    strokeLinejoin="round"
  />

  {/* Nib slit */}
  <path
    d="M232 267 L234 271"
    fill="none"
    stroke={COLORS.goldDark}
    strokeWidth="1"
    strokeLinecap="round"
  />
</g>

      {/* ================================================== */}
      {/* 8. SMALL FINISHING DETAILS                         */}
      {/* ================================================== */}
      <g className="opera-details">
        {/* Torso screws */}
        <circle cx="132" cy="232" r="2" fill={COLORS.goldLight} />
        <circle cx="188" cy="232" r="2" fill={COLORS.goldLight} />

        {/* Tiny side shell lights */}
        <circle cx="91" cy="137" r="3" fill={COLORS.gold} />
        <circle cx="229" cy="137" r="3" fill={COLORS.gold} />

        {/* Jetpack status lights visible beside torso */}
        <circle cx="119" cy="242" r="2.5" fill={COLORS.cyan} />
        <circle cx="201" cy="242" r="2.5" fill={COLORS.cyan} />
      </g>
      </g>
    </svg>
  );
}
