import * as fs from "node:fs";
import * as path from "node:path";
import spawn from "cross-spawn";

export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) copyDir(src, dest);
  else fs.copyFileSync(src, dest);
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

export function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") continue;
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

export function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0]!;
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, "utf-8");
  fs.writeFileSync(file, callback(content), "utf-8");
}

export function updatePackageJson(
  projectPath: string,
  updates: Record<string, any>
) {
  const pkgPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  const updatedPkg = {
    ...pkg,
    ...updates,
  };

  fs.writeFileSync(pkgPath, JSON.stringify(updatedPkg, null, 2) + "\n");
}

export function installDependencies(
  projectPath: string,
  dependencies: string[],
  dev = false
) {
  const command = "npm";
  const args = ["install", ...(dev ? ["-D"] : []), ...dependencies];

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: projectPath,
    });

    child.on("close", (code: number) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(" ")} failed`));
        return;
      }
      resolve();
    });
  });
}
