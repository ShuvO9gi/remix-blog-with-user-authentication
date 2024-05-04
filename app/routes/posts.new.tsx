import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  redirect,
  useActionData,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/utils/db.server";

function validateTitle(title: string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title must be at least 3 characters long";
  }
}

function validateBody(body: string) {
  if (typeof body !== "string" || body.length < 10) {
    return "Body must be at least 10 characters long";
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  console.log(form);
  const title = form.get("title") as string | null;
  const body = form.get("body") as string | null;

  if (title == null || body == null) {
    throw new Error("Title or Body is missing");
  }

  const fields = { title, body };
  console.log(fields);

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors, fields }, { status: 400 });
  }

  //submit to database
  const post = await db.post.create({ data: fields });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const actionData = useActionData<typeof action>();
  console.log(actionData);

  return (
    <>
      <div className="page-header">
        <h1>New Posts</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Body of the Post</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
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
}

export default NewPost;
