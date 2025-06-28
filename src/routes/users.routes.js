import { Router } from "express"; 
import userController from "../controllers/user.controller.js";
import validate from "../validators/validate.js";
import { userRegisterSchema } from "../validators/user.validate.js";
import { authenticateToken } from "../middlewares/authenticated.js";

const router = Router();

/*router.get("/", userController.getUsers);
router.post("/", userController.createUser);*/

//Routes
router.route("/")
    .get(userController.getUsers)
    .post(validate(userRegisterSchema, 'body'), userController.createUser)

//METODO DEL LISTADO DE USUARIOS CON PAGINACION
router.route("/list/pagination")
    .get(userController.getUsersList);

router.route("/:id")
    .get(authenticateToken, userController.gestUser)
    .put(authenticateToken, userController.updateUser)
    .delete(authenticateToken, userController.deleteUser)
    .patch(authenticateToken, userController.activateInactiveUser);

router.get('/:id/tasks', authenticateToken, userController.getTasks);

export default router;