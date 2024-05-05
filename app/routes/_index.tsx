function Home() {
  return (
    <div>
      <h1>Welcome To Remix!</h1>
      <p>
        Remix is a full stack web framework that lets you focus on the user
        interface and work back through web standards to deliver a fast, slick,
        and resilient user experience. People are gonna love using your stuff.
      </p>
      <p>
        To learn more about Remix watch the video. <br />
        Youtube Link: <br />
        <strong>
          <a href="https://www.youtube.com/watch?v=d_BhzHVV4aQ">Part 1</a>
        </strong>{" "}
        <br />
        <strong>
          <a
            href="https://www.youtube.com/watch?v=wEoktJMSWLY"
            target="_blank"
            rel="noreferrer"
          >
            Part 2(User Authentication)
          </a>
        </strong>
      </p>
    </div>
  );
}

export default Home;

/* default index page */
/* import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
 */
