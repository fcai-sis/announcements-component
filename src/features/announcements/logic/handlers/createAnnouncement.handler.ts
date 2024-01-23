import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {}
>;

/*
 * Creates an announcement.
 * */
const handler = async (req: HandlerRequest, res: Response) => {

}

const createAnnouncementHandler = handler;
export default createAnnouncementHandler;
