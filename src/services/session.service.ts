import { compare } from "bcrypt";
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
  console.log(
    `[DEBUG] Iniciando tentativa de login para o usuário: ${username}`
  );

  try {
    const queryText = 'SELECT * FROM "User" WHERE username = $1';
    const result = await pool.query<IUser>(queryText, [username]);
    if (result.rowCount === 0) {
      console.error(
        `[DEBUG] Usuário '${username}' NÃO encontrado no banco de dados.`
      );
      throw new AppError(403, "Invalid username or password.");
    }
    const user = result.rows[0];
    console.log(`[DEBUG] Usuário '${username}' encontrado. ID: ${user.id}`);

    console.log(`[DEBUG] Hash armazenado no banco: ${user.password}`);
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      console.log(
        `[DEBUG] Resultado da comparação de senha (bcrypt): ${passwordMatch}`
      );
      throw new AppError(403, "Invalid username or password.");
    }

    console.log(
      `[DEBUG] Autenticação bem-sucedida para '${username}'. Gerando token...`
    );
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
