import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  /* const data = {
    posts: [
      { id: 1, title: "Post 1", body: "This test page 1" },
      { id: 2, title: "Post 2", body: "This test page 2" },
      { id: 3, title: "Post 3", body: "This test page 3" },
    ],
  }; */
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return data;
};

/* type Post = {
  id: string;
  title: string;
  body: string;
};

interface LoaderData {
  posts: Post[];
} */

function PostItems() {
  // const { posts } = useLoaderData<LoaderData>();
  const { posts } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PostItems;
