import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { json, useActionData } from "react-router";
import { db } from "~/utils/db.server";
import {
  Login as SessionLogin,
  createUserSession,
  register,
} from "~/utils/session.server";
interface FieldsProperty {
  loginType: string | null;
  username: string | null;
  password: string | null;
}

interface FieldsErrorProperty {
  username: string | null | undefined;
  password?: string | null | undefined;
}

interface FormData {
  fields: FieldsProperty;
  fieldsError?: FieldsErrorProperty;
  formError?: string;
}

function validateUsername(username: string | null): string | null | undefined {
  if (typeof username !== "string" || username.length < 3) {
    return "Username must be at least 3 character long";
  }
}

function validatePassword(password: string | null) {
  if (typeof password != "string" || password.length < 5) {
    return "Password must be at least 5 character long";
  }
}

function badRequest(data: FormData) {
  return json(data, { status: 400 });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();

  const loginType = form.get("loginType") as string | null;
  const username = form.get("username") as string | null;
  const password = form.get("password") as string | null;

  const fields: FieldsProperty = { loginType, username, password };

  const fieldsError = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError });
  }

  switch (loginType) {
    case "login": {
      // Find user
      const user = await SessionLogin({
        username: username || "",
        password: password || "",
      });
      // Check user
      if (!user) {
        return badRequest({
          fields,
          fieldsError: { username: "Invalid Credential" },
        });
      }
      // Create user session
      return createUserSession(user.id, "/posts");
    }
    case "register": {
      // Check if user exist
      const userExist = await db.user.findFirst({
        where: {
          username: username || "",
        },
      });

      if (userExist) {
        return badRequest({
          fields,
          fieldsError: {
            username: `Use ${username} already exists`,
          },
        });
      }

      // Create User
      const user = await register({
        username: username || "",
        password: password || "",
      });

      if (!user) {
        return badRequest({
          fields,
          formError: "Something went wrong",
        });
      }
      // Create user session
      return createUserSession(user.id, "/posts");
    }
    default: {
      return badRequest({ fields, formError: "Login type is not valid!" });
    }
  }

  return redirect("/posts");
};

function Login() {
  const actionData = useActionData() as FormData;

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />
              Login
            </label>

            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />
              Register
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username ?? ""}
            />
            <div className="error">
              {actionData?.fieldsError?.username &&
                actionData?.fieldsError?.username}
              {/* {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null} */}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password ?? ""}
            />
            <div className="error">
              {actionData?.fieldsError?.password &&
                actionData?.fieldsError?.password}
              {/* {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null} */}
            </div>
          </div>

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
