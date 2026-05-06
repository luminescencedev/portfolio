const experiences = [
  {
    company: "Biokortex",
    url: "https://biokortex.com",
    role: "Frontend Engineer Intern",
    start: "Sep 2025",
    end: "Present",
  },
  {
    company: "Biokortex",
    url: "https://biokortex.com",
    role: "Frontend Engineer Stage",
    start: "Jun 2025",
    end: "Aug 2025",
  },
  {
    company: "Orange",
    url: "https://orange.com",
    role: "Sales",
    start: "Dec 2024",
    end: "Feb 2025",
  },
];

export default function WorkTimeline() {
  return (
    <section
      className="w-full rounded-2xl p-4 mb-12"
      aria-label="Work experience"
    >
      <h2 className="mb-3 px-2 text-sm font-medium text-neutral-800">Work</h2>

      <ul className="px-2">
        {experiences.map((item, index) => {
          const sameAsPrev =
            index > 0 && item.company === experiences[index - 1].company;

          return (
            <li
              key={`${item.company}-${item.start}`}
              className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-0.5"
            >
              <div>
                {sameAsPrev ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="inline-block text-neutral-400 mr-1.5 -mt-0.5 align-middle"
                  >
                    <path
                      d="M3 1 V7 Q3 9.5 5.5 9.5 H11 M8 7 L11 9.5 L8 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-neutral-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 rounded-sm"
                  >
                    {item.company}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-neutral-800">
                    {item.company}
                  </span>
                )}
                <span className="ml-2 text-sm text-neutral-500">
                  {item.role}
                </span>
              </div>
              <span className="text-sm text-neutral-400 whitespace-nowrap">
                {item.start} – {item.end}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
