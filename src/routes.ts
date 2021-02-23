import { Router } from "express";
import  UserController from "./controllers/UserController";

const router = Router();

router.post("/api/users", UserController.create);

router.get("/api/users", (request, response) => {
  return response.send().json({ da: "sdsd" });
});


export default router;
