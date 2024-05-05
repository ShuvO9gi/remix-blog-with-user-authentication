import {
  Link,
  LiveReload,
  Outlet,
  Links,
  Meta,
  useRouteError,
  isRouteErrorResponse,
  ScrollRestoration,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";
import { getUser } from "./utils/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

export const meta = () => {
  const description =
    "A awesome Remix blog page. Youtube Link: Part1-(https://www.youtube.com/watch?v=d_BhzHVV4aQ)";
  const keywords = "remix, react, javascript";
  return [{ description, keywords }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const data = { user };

  return data;
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

type DocumentProps = {
  title?: string;
  children: React.ReactNode;
};

function Document({ children, title }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        {/* <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={globalStylesUrl} /> */}
        <Meta />
        <Links />
        <title>{title ? title : "My Remix Blog Page"}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = "Unknown Error!";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <h2>{errorStatus}</h2>
        <p>{errorMessage}</p>
      </Layout>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}

/* default errorboundary for all routes */
/* export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack track is: </p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
} */

/* default html */
/* import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
} */
