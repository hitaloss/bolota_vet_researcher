import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { AppError } from "../errors/appError";
import { pool } from "../database";

export interface ISessionCreate {
  username: string;
  password: string;
}

interface IUser {
  id: string;
  username: string;
  password: string;
}

async function sessionService({
  username,
  password,
}: ISessionCreate): Promise<string> {
  try {
    const queryText = 'SELECT * FROM "User" WHERE username = $1';
    const result = await pool.query<IUser>(queryText, [username]);
    if (result.rowCount === 0) {
      throw new AppError(403, "Invalid username or password.");
    }
    const user = result.rows[0];
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError(403, "Invalid username or password.");
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1d",
        subject: user.id.toString(),
      }
    );
    return token;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error on session service", error);
    throw new AppError(500, "Internal server error.");
  }
}

export default sessionService;
