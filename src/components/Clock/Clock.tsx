import { useEffect, useState } from "react";

function getParisTime() {
  return new Date().toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Clock() {
  const [time, setTime] = useState(getParisTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getParisTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full p-4" aria-label="Local time">
      <p className="px-2 text-sm text-neutral-400">
        <span className="text-neutral-500">France, Paris</span>
        {" — "}
        {time}
      </p>
    </section>
  );
}
