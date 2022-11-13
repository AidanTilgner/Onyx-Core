import { Router } from "express";
import {
  getIntentAndAction,
  getIntentAndActionForSpeechServer,
  unstable_getNLUData,
  unstable_getNLUDataForSpeechServer,
} from "../nlp/nlp";
import { NLUPackage, NLUPackageBody } from "../definitions/packages";
import FormData from "form-data";
import multer from "multer";
import axios from "axios";
const router = Router();

const mappings: { [key: string]: Function } = {
  get_nlu: getIntentAndAction,
  get_nlu_for_speech_server: unstable_getNLUDataForSpeechServer,
};

const handlePackage = async (pkg: NLUPackage) => {
  try {
    const { current_step, steps, session_id } = pkg;
    const {
      action,
      deposit,
      data: { deposited },
      next,
    } = steps[current_step];

    let result: any;

    const res = await mappings[action](session_id, deposited);
    result = res;
    steps[current_step].data.gathered = res;

    if (deposit >= 0) {
      steps[deposit].data.deposited = result;
    }

    if (next) {
      return [
        {
          current_step: current_step + 1,
          steps: steps,
        },
        next,
      ];
    }

    return [
      {
        current_step: current_step + 1,
        steps: steps,
      },
      null,
    ];
  } catch (err: any) {
    console.log("Error handling package: ", err);
    pkg.steps[pkg.current_step].errors.push(err);
    pkg.current_step = pkg.current_step + 1;
    if (pkg.steps[pkg.current_step].next) {
      return [
        pkg,
        pkg.steps[pkg.current_step].next,
        `There was an error handling the package: ${err}`,
      ];
    }
    return [pkg, null, `There was an error handling the package: ${err}`];
  }
};

const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/", storage: storage });

router.post("/", upload.any(), async (req, res) => {
  try {
    const { pkg } = req.body as NLUPackageBody;
    const [newPkg, next] = await handlePackage(JSON.parse(pkg));
    const files = req.files as Express.Multer.File[];

    const form = new FormData();
    form.append("pkg", JSON.stringify(newPkg));
    // append files to form
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as Express.Multer.File;
        form.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      }
    }

    if (!next) {
      return res.send({
        status: "success",
        message: "Package handled successfully",
        result: newPkg,
      });
    }

    const { data } = await axios.post(next + "/package-hook", form);

    return res.send({
      message: "Successfully handled package",
      result: data,
    });
  } catch (err) {
    console.log("Error in package hook: ", err);
    // TODO: This should just add an error to the body
    return {
      error: "There was an error processing the package",
    };
  }
});

export default router;
