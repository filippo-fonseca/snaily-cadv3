import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
import fs from "fs";
const router: Router = Router();

router.get(
  "/penal-codes",
  useAuth,
  useOfficerAuth,
  (_req: IRequest, res: Response) => {
    const rawCodes = fs.readFileSync("./src/data/penal-codes.json");
    const penalCodes = JSON.parse(String(rawCodes));

    return res.json({ penalCodes, status: "success" });
  }
);

router.get(
  "/my-officers",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const officers = await processQuery(
      "SELECT * FROM `officers` WHERE `user_id` = ?",
      [req.user?.id]
    );

    return res.json({ officers, status: "success" });
  }
);

router.post(
  "/my-officers",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { name, department } = req.body;
    const id = uuidv4();

    if (name && department) {
      await processQuery(
        "INSERT INTO `officers` (`id`, `officer_name`,`officer_dept`,`user_id`,`status`,`status2`) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, department, req.user?.id, "off-duty", ""]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  }
);

router.delete(
  "/:id",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    await processQuery("DELETE FROM `officers` WHERE `id` = ?", [id]);

    const officers = await processQuery(
      "SELECT * FROM `officers` WHERE `user_id` = ?",
      [req.user?.id]
    );

    return res.json({ status: "success", officers });
  }
);

router.get(
  "/status/:id",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const officer = await processQuery(
      "SELECT * FROM `officers` WHERE  `officers`.`id` = ?",
      [id]
    );

    return res.json({ officer: officer[0], status: "success" });
  }
);

router.put(
  "/status/:id",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { status, status2 } = req.body;

    await processQuery(
      "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?",
      [status, status2, id]
    );

    const updatedOfficer = await processQuery(
      "SELECT * FROM `officers` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", officer: updatedOfficer });
  }
);

router.get(
  "/departments",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const departments = await processQuery("SELECT * FROM `departments`");

    return res.json({ departments, status: "success" });
  }
);

/**
 *
 * Check if the authenticated user has permission to access '/officer' routes
 */
async function useOfficerAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await processQuery("SELECT `leo` from `users` WHERE `id` = ?", [
    req.user?.id,
  ]);

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (user[0].leo !== "1") {
    res.json({
      error: "Forbidden",
      status: "error",
    });
    return;
  }

  next();
}

export { useOfficerAuth };
export default router;
