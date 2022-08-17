import esMain from "es-main";
import fse from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const baseDir = dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(baseDir, "../build/ol-displaced-points");

async function main() {
  const argLocal = process.argv
    .slice(2)
    .find((arg) => arg.split("=")[0] === "local");

  const pkg = await fse.readJSON(path.resolve(baseDir, "../package.json"));

  // write out simplified package.json
  if (argLocal) {
    const localKey = argLocal.split("=")[1] || "local";
    console.info(`build: package.name = "@${localKey}/ol-displaced-points"`);
    pkg.name = `@${localKey}/ol-displaced-points`;
  }

  pkg.main = "index.js";
  delete pkg.scripts;
  delete pkg.devDependencies;
  delete pkg.optionalDependencies;
  delete pkg.style;
  delete pkg.eslintConfig;
  delete pkg.private;
  await fse.writeJSON(path.join(buildDir, "package.json"), pkg, { spaces: 2 });

  // copy in readme and license files
  await fse.copyFile(
    path.resolve(baseDir, "../README.md"),
    path.join(buildDir, "README.md")
  );

  await fse.copyFile(
    path.resolve(baseDir, "../LICENSE"),
    path.join(buildDir, "LICENSE")
  );
}

/**
 * If running this module directly, read the config file, call the main
 * function, and write the output file.
 */
if (esMain(import.meta)) {
  main().catch((err) => {
    process.stderr.write(`${err.message}\n`, () => process.exit(1));
  });
}
