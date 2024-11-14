import esMain from "es-main";
import fse from "fs-extra";
import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";

const baseDir = dirname(fileURLToPath(import.meta.url));
const buildDir = resolve(baseDir, "../build/ol-displaced-points");

async function main() {
  const argLocal = process.argv
    .slice(2)
    .find((arg) => arg.split("=")[0] === "local");

  const pkg = await fse.readJSON(resolve(baseDir, "../package.json"));

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
  delete pkg.files;

  await fse.writeJSON(join(buildDir, "package.json"), pkg, { spaces: 2 });

  // copy in readme and license files
  await fse.copyFile(
    resolve(baseDir, "../README.md"),
    join(buildDir, "README.md")
  );

  await fse.copyFile(
    resolve(baseDir, "../LICENSE"),
    join(buildDir, "LICENSE")
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
