import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { postId } = params;
  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("Post not found!");

  const data = { post };
  return data;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { postId } = params;
  const form = await request.formData();

  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error("Post is not found!");

    await db.post.delete({ where: { id: postId } });

    return redirect("/posts");
  }
};

function DynamicRoutes() {
  /* const { postId } = useParams(); */
  //   console.log(params);

  const { post } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">{post.body}</div>
      <div className="page-footer">
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="btn btn-delete">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default DynamicRoutes;
