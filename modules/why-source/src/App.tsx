import * as React from "react";

const S = {
  center: 260,
  outerRadius: 177,
  innerRadius: 38,
  initialRadii: [112, 157, 158, 99, 161, 110, 77, 118],
  white: ["#EEE9E9", "#F3F0F1", "#E9E7EF", "#E5E2EB", "#EEEAF2", "#DFDDE8", "#F1EDF0", "#ECE8E9"],
  grey: "#646263",
  bloomMs: 1533,
  closeMs: 1200,
  spinMsPerRevolution: 9744,
  spinDelayMs: 280,
  spinRampMs: 867,
  petalWidth: 78,
  petalLength: 76,
  restPetalOffset: 151,
  bloomPetalOffset: 154,
};

const GRADIENTS = [
  {
    colors: ["#000000", "#001230", "#155A7D", "#4D9CA1", "#B4E002"],
    glow: "#C7EB08",
    gx: "83%",
  },
  {
    colors: ["#071A05", "#063101", "#51A601", "#A1CA49", "#BFD887"],
    glow: "#D6F58A",
    gx: "75%",
  },
  {
    colors: ["#CBD1DD", "#A4B1C2", "#828FB8", "#4953A1", "#4248A0"],
    glow: "#F0F1F5",
    gx: "30%",
  },
  {
    colors: ["#BCE300", "#8BCF00", "#6FBB52", "#7F259B", "#440154"],
    glow: "#CBE900",
    gx: "32%",
  },
  {
    colors: ["#575757", "#878787", "#A2A2A2", "#BEBEBE", "#D3D3D3"],
    glow: "#FFFFFF",
    gx: "28%",
  },
  {
    colors: ["#A7915A", "#97824D", "#AA9E67", "#BFBB95", "#D0CDBA"],
    glow: "#EEE4C3",
    gx: "65%",
  },
  {
    colors: ["#042625", "#021F1D", "#012F15", "#25B37C", "#7AD3A9"],
    glow: "#21E6AB",
    gx: "68%",
  },
  {
    colors: ["#E0B185", "#D39F70", "#CD9D77", "#9A8B93", "#2D3342"],
    glow: "#F4C49A",
    gx: "27%",
  },
  {
    colors: ["#45000B", "#8A000B", "#B70002", "#E6B38F", "#EADDB4"],
    glow: "#FF7039",
    gx: "35%",
  },
];

const PALETTE_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function polar(radius: number, angle: number): [number, number] {
  const radians = (angle * Math.PI) / 180;
  return [S.center + radius * Math.cos(radians), S.center + radius * Math.sin(radians)];
}

function xy(radius: number, angle: number) {
  return polar(radius, angle)
    .map((value) => value.toFixed(3))
    .join(" ");
}

function wedgePath(index: number, outerR: number, gap = 0.75, outerCorner = 3.8, innerCorner = 10) {
  const start = -90 + 45 * index + gap;
  const end = -90 + 45 * (index + 1) - gap;
  const outerTrim = Math.min(12, (outerR - S.innerRadius) * 0.2);
  const innerTrim = 12;

  return [
    `M ${xy(S.innerRadius + innerTrim, start)}`,
    `L ${xy(outerR - outerTrim, start)}`,
    `Q ${xy(outerR, start)} ${xy(outerR, start + outerCorner)}`,
    `A ${outerR} ${outerR} 0 0 1 ${xy(outerR, end - outerCorner)}`,
    `Q ${xy(outerR, end)} ${xy(outerR - outerTrim, end)}`,
    `L ${xy(S.innerRadius + innerTrim, end)}`,
    `Q ${xy(S.innerRadius, end)} ${xy(S.innerRadius, end - innerCorner)}`,
    `A ${S.innerRadius} ${S.innerRadius} 0 0 0 ${xy(S.innerRadius, start + innerCorner)}`,
    `Q ${xy(S.innerRadius, start)} ${xy(S.innerRadius + innerTrim, start)}`,
    "Z",
  ].join(" ");
}

const fullRing = [
  `M ${S.center + S.outerRadius} ${S.center}`,
  `A ${S.outerRadius} ${S.outerRadius} 0 1 0 ${S.center - S.outerRadius} ${S.center}`,
  `A ${S.outerRadius} ${S.outerRadius} 0 1 0 ${S.center + S.outerRadius} ${S.center}`,
  `M ${S.center + S.innerRadius} ${S.center}`,
  `A ${S.innerRadius} ${S.innerRadius} 0 1 0 ${S.center - S.innerRadius} ${S.center}`,
  `A ${S.innerRadius} ${S.innerRadius} 0 1 0 ${S.center + S.innerRadius} ${S.center}`,
  "Z",
].join(" ");

export default function App() {
  const root = React.useRef<HTMLDivElement>(null);
  const svg = React.useRef<SVGSVGElement>(null);
  const [pressed, setPressed] = React.useState(false);
  const ids = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    const wrapper = root.current;
    const drawing = svg.current;
    if (!wrapper || !drawing) return;

    const whitePaths = [...drawing.querySelectorAll<SVGPathElement>("[data-white]")];
    const colored = [...drawing.querySelectorAll<SVGGElement>("[data-colored]")];
    const rotator = drawing.querySelector<SVGGElement>("[data-rotator]");
    const backing = drawing.querySelector<SVGPathElement>("[data-seamless]");
    if (!rotator || !backing) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let progress = 0;
    let target = 0;
    let tween: {
      from: number;
      to: number;
      start: number;
      duration: number;
    } | null = null;

    let rotation = 0;
    let spinStartedAt: number | null = null;
    let lastTime = 0;
    let frameId = 0;
    let pinned = false;
    let hovered = false;

    function render() {
      const closeSeams = ease((progress - 0.16) / 0.84);
      const gap = lerp(0.75, 0, closeSeams);
      const outerCorner = lerp(3.8, 0, closeSeams);
      const innerCorner = lerp(10, 0, closeSeams);

      whitePaths.forEach((path, index) => {
        path.setAttribute(
          "d",
          wedgePath(
            index,
            lerp(S.initialRadii[index], S.outerRadius, progress),
            gap,
            outerCorner,
            innerCorner,
          ),
        );
      });

      backing?.setAttribute("opacity", ease((progress - 0.95) / 0.05).toFixed(4));

      const bloom = Math.pow(clamp(progress), 0.78);
      const opacity = clamp(bloom * 1.75);
      const scale = lerp(0.19, 1, bloom);
      const offset = lerp(S.restPetalOffset, S.bloomPetalOffset, bloom);

      colored.forEach((petal, index) => {
        petal.setAttribute(
          "transform",
          `translate(${S.center} ${S.center}) rotate(${index * 45 + 22.5}) translate(0 ${-offset}) scale(${scale})`,
        );
        petal.setAttribute("opacity", opacity.toFixed(4));
      });

      rotator?.setAttribute("transform", `rotate(${rotation.toFixed(5)} ${S.center} ${S.center})`);
    }

    function schedule() {
      if (!frameId) frameId = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      frameId = 0;
      const delta = lastTime ? Math.min(50, now - lastTime) : 0;
      lastTime = now;

      if (tween) {
        const t = clamp((now - tween.start) / tween.duration);
        progress = lerp(tween.from, tween.to, ease(t));

        if (t >= 1) {
          progress = tween.to;
          tween = null;
        }
      }

      if (!motion.matches && target === 1 && progress >= 0.999) {
        if (spinStartedAt === null) spinStartedAt = now;

        const elapsed = now - spinStartedAt - S.spinDelayMs;

        if (elapsed > 0) {
          const velocity = ease(elapsed / S.spinRampMs);
          rotation = (rotation + (delta * velocity * 360) / S.spinMsPerRevolution) % 360;
        }
      }

      render();

      if (tween || (!motion.matches && target === 1 && progress >= 0.999)) {
        schedule();
      } else {
        lastTime = 0;
      }
    }

    function animate(open: boolean) {
      const next = open ? 1 : 0;
      if (next === target && !tween) return;

      target = next;
      if (!next) spinStartedAt = null;
      setPressed(Boolean(next));

      if (motion.matches) {
        progress = next;
        tween = null;
        render();
        return;
      }

      tween = {
        from: progress,
        to: next,
        start: performance.now(),
        duration: Math.max(1, (next ? S.bloomMs : S.closeMs) * Math.abs(next - progress)),
      };

      schedule();
    }

    const update = () => animate(pinned || hovered);

    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        hovered = true;
        update();
      }
    };

    const leave = () => {
      hovered = false;
      update();
    };

    const click = () => {
      pinned = !pinned;
      update();
    };

    const key = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pinned = !pinned;
        update();
      } else if (event.key === "Escape") {
        pinned = false;
        hovered = false;
        update();
      }
    };

    const onMotion = () => {
      if (motion.matches) {
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
        tween = null;
        progress = target;
        render();
      } else if (target === 1) {
        schedule();
      }
    };

    wrapper.addEventListener("pointerenter", enter);
    wrapper.addEventListener("pointerleave", leave);
    wrapper.addEventListener("click", click);
    wrapper.addEventListener("keydown", key);
    motion.addEventListener("change", onMotion);

    render();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      wrapper.removeEventListener("pointerenter", enter);
      wrapper.removeEventListener("pointerleave", leave);
      wrapper.removeEventListener("click", click);
      wrapper.removeEventListener("keydown", key);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Bloom the interactive flower"
      aria-pressed={pressed}
      className="grid h-full min-h-[120px] w-full min-w-[120px] cursor-pointer touch-manipulation
        place-items-center overflow-visible bg-transparent outline-none select-none
        [-webkit-tap-highlight-color:transparent]"
    >
      <svg
        ref={svg}
        viewBox="0 0 520 520"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="pointer-events-none block h-full w-full overflow-visible bg-transparent"
      >
        <defs>
          <mask
            id={`${ids}-outside`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="520"
            height="520"
          >
            <rect width="520" height="520" fill="white" />
            <circle cx="260" cy="260" r="175.2" fill="black" />
          </mask>

          {PALETTE_ORDER.map((paletteIndex, index) => {
            const palette = GRADIENTS[paletteIndex];

            return (
              <React.Fragment key={index}>
                <linearGradient id={`${ids}-base-${index}`} x1="0%" y1="36%" x2="100%" y2="64%">
                  {palette.colors.map((color, colorIndex) => (
                    <stop key={color} offset={`${colorIndex * 25}%`} stopColor={color} />
                  ))}
                </linearGradient>

                <radialGradient id={`${ids}-glow-${index}`} cx={palette.gx} cy="30%" r="69%">
                  {[0.76, 0.38, 0.09, 0].map((opacity, stopIndex) => (
                    <stop
                      key={opacity}
                      offset={["0%", "36%", "75%", "100%"][stopIndex]}
                      stopColor={palette.glow}
                      stopOpacity={opacity}
                    />
                  ))}
                </radialGradient>

                <radialGradient id={`${ids}-shade-${index}`} cx="43%" cy="30%" r="83%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.08" />
                  <stop offset="58%" stopColor="black" stopOpacity="0" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.16" />
                </radialGradient>
              </React.Fragment>
            );
          })}
        </defs>

        <g data-rotator="" mask={`url(#${ids}-outside)`}>
          {PALETTE_ORDER.map((_, index) => (
            <g data-colored="" key={index} opacity={0}>
              <ellipse
                cx="0"
                cy="0"
                rx={S.petalWidth}
                ry={S.petalLength}
                fill={`url(#${ids}-base-${index})`}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={S.petalWidth}
                ry={S.petalLength}
                fill={`url(#${ids}-glow-${index})`}
              />
              <ellipse
                cx="0"
                cy="0"
                rx={S.petalWidth}
                ry={S.petalLength}
                fill={`url(#${ids}-shade-${index})`}
              />
            </g>
          ))}
        </g>

        <g>
          {S.initialRadii.map((_, index) => (
            <path key={index} d={wedgePath(index, S.outerRadius)} fill={S.grey} stroke="none" />
          ))}
        </g>

        <path
          data-seamless=""
          d={fullRing}
          fill="#ECE8EE"
          fillRule="evenodd"
          opacity={0}
          stroke="none"
        />

        <g>
          {S.initialRadii.map((radius, index) => (
            <path
              data-white=""
              key={index}
              d={wedgePath(index, radius)}
              fill={S.white[index]}
              stroke="none"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
