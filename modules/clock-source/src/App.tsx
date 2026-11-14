import { useEffect, useState } from "react";

const clockFace = "/assets/4b8bb.svg";

type ClockState = {
  date: Date;
  hourAngle: number;
  minuteAngle: number;
};

function rawHandAngles(date: Date) {
  const milliseconds = date.getMilliseconds();
  const seconds = date.getSeconds() + milliseconds / 1000;
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;

  return {
    hour: hours * 30,
    minute: minutes * 6,
  };
}

function continueRotation(previous: number, next: number) {
  const previousNormalized = ((previous % 360) + 360) % 360;
  const shortestForwardDelta = ((next - previousNormalized + 540) % 360) - 180;
  return previous + shortestForwardDelta;
}

function createClockState(date: Date, previous?: ClockState): ClockState {
  const angles = rawHandAngles(date);

  return {
    date,
    hourAngle: previous ? continueRotation(previous.hourAngle, angles.hour) : angles.hour,
    minuteAngle: previous ? continueRotation(previous.minuteAngle, angles.minute) : angles.minute,
  };
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
});

function LiveClock() {
  const [clock, setClock] = useState(() => createClockState(new Date()));

  useEffect(() => {
    const updateClock = () => {
      setClock((previous) => createClockState(new Date(), previous));
    };

    const interval = window.setInterval(updateClock, 100);
    window.addEventListener("focus", updateClock);
    document.addEventListener("visibilitychange", updateClock);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateClock);
      document.removeEventListener("visibilitychange", updateClock);
    };
  }, []);

  const time = timeFormatter.format(clock.date);
  const date = dateFormatter.format(clock.date);
  const day = dayFormatter.format(clock.date);

  return (
    <section className="live-clock" role="timer" aria-label={`${time}, ${day}, ${date}`}>
      <div className="clock-face" aria-hidden="true">
        <img src={clockFace} alt="" />
        <span className="clock-center-mask" />
        <span
          className="clock-hand clock-hand-hour"
          style={{ transform: `translateX(-50%) rotate(${clock.hourAngle}deg)` }}
        />
        <span
          className="clock-hand clock-hand-minute"
          style={{
            transform: `translateX(-50%) rotate(${clock.minuteAngle}deg)`,
          }}
        />
        <span className="clock-pin" />
      </div>

      <div className="clock-copy">
        <time className="clock-time" dateTime={clock.date.toISOString()}>
          {time}
        </time>
        <div className="clock-calendar">
          <time dateTime={clock.date.toISOString().slice(0, 10)}>{date}</time>
          <p>{day}</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="app-shell">
      <LiveClock />
    </main>
  );
}
