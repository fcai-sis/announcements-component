import { Request, Response } from "express";

import { User } from '@fcai-sis/shared-models';

/**
 * An example handler that creates an example document in the database
 */
const handler = async (req: Request, res: Response) => {
  const example = await User.create({
    name: 'test',
    email: 'test@test.com',
    password: 'test',
  });

  res.status(200).json({ example });
};

export default handler;
