import { join } from "path";
import YAML from "yamljs";

const swaggerDocument = YAML.load(join(__dirname, "../docs/swagger/index.yml"));

export const swaggerSpecs = swaggerDocument;
