import { Outlet } from "@remix-run/react";

export function Posts() {
  return (
    <>
      {/* <h1>This is the post routes!</h1> */}
      <Outlet />
    </>
  );
}

export default Posts;
