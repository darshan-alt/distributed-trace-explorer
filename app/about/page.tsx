export default function AboutPage() {
    return (
        <div className="container about-page">
            <h1>About Trace Explorer</h1>
            <p>
                Trace Explorer is a premium observability tool designed for modern engineering teams.
                It provides a visual, interactive way to explore distributed traces, helping you
                understand system behavior, find bottlenecks, and debug failures across services.
            </p>

            <h2>Core Technologies</h2>
            <ul>
                <li><strong>React & Next.js:</strong> Powering a fast, responsive user interface.</li>
                <li><strong>OpenTelemetry:</strong> Adhering to industry standards for observability data.</li>
                <li><strong>Framer Motion:</strong> Providing smooth, meaningful transitions.</li>
            </ul>

            <h2>The Mission</h2>
            <p>
                Our goal is to make distributed systems transparent. By focusing on high-quality
                visualization and a clean, "Apple-like" user experience, we ensure that engineers
                can focus on solving problems rather than fighting with their tools.
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
        .about-page {
          padding-top: 4rem;
          padding-bottom: 8rem;
          max-width: 800px;
        }
        .about-page h1 {
          font-size: 3rem;
          margin-bottom: 2rem;
        }
        .about-page h2 {
          margin-top: 3rem;
          margin-bottom: 1.5rem;
        }
        .about-page p {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--secondary);
          margin-bottom: 1.5rem;
        }
        .about-page ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .about-page li {
          font-size: 1.125rem;
          color: var(--foreground);
        }
        .about-page li strong {
          color: var(--accent);
        }
      `}} />
        </div>
    );
}
