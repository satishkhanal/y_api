import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { onErrorMsg } from "../../utils/zodValidationMessage";
import { UserService } from "../user/user.service";
import { authGoogleSigninSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { setCookie, getCookie } from "hono/cookie";
import {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} from "../../utils/jwt";
import { validateAuth } from "../../middleware/auth.middleware";

type Variables = {
  userId: string;
};
export const authRoute = new Hono<{ Variables: Variables }>();
const authService = new AuthService();
const userService = new UserService();

authRoute
  .use(validateAuth)
  .post(
    "/signin/google",
    zValidator("json", authGoogleSigninSchema, onErrorMsg),
    async (c) => {
      try {
        const validated = c.req.valid("json");
        const data = await authService.verifyGoogleToken(validated.token);
        const user = await userService.findByEmail(data.email);

        let usr;
        if (user.email) {
          usr = user;
        } else {
          usr = await userService.create(data);
        }

        const accessToken = generateAccessToken({
          userId: usr.id,
          username: usr.email,
        });

        const refreshToken = generateRefreshToken({
          userId: usr.id,
          username: usr.email,
        });

        setCookie(c, "refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        });

        return c.json({
          message: usr.email
            ? "Signed in successfully"
            : "User created successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (error) {
        console.error(error);
        throw new HTTPException(400, { message: "Failed to validate token" });
      }
    }
  )

  .post("/refresh-token", async (c) => {
    const refreshTokenFromCookie = getCookie(c, "refreshToken");
    const body = await c.req.json();
    let refreshToken = body.refreshToken || refreshTokenFromCookie;

    if (!refreshToken) {
      throw new HTTPException(400, { message: "No refresh token found" });
    }
    try {
      const decoded = validateToken(refreshToken);
      const accessToken = generateAccessToken({
        userId: decoded.userId,
        username: decoded.username,
      });
      const newRefreshToken = generateRefreshToken({
        userId: decoded.userId,
        username: decoded.username,
      });

      setCookie(c, "refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      });
      return c.json({
        message: "Token refreshed successfully",
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error(error);
      throw new HTTPException(400, { message: "Failed to refresh token" });
    }
  })
  .get("/me", async (c) => {
    const userId = c.get("userId");
    const user = await userService.findById(userId);
    c.status(200);
    return c.json(user);
  })
  .post("/logout", async (c) => {
    setCookie(c, "refreshToken", "", {
      httpOnly: true,
      secure: true,
    });
    c.status(200);
    return c.json({ message: "Logged out successfully" });
  });
