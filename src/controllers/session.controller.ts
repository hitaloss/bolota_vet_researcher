import { Request, Response } from "express";

import sessionService, { ISessionCreate } from "../services/session.service";

async function sessionController(request: Request, response: Response) {
  const { username, password }: ISessionCreate = request.body;

  const session = await sessionService({ username, password });

  return response.json({ statusCode: 200, message: "Success", token: session });
}

export default sessionController;
