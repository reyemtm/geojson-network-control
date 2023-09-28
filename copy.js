const fs = require('fs');
fs.rmSync('docs', { recursive: true });
fs.mkdirSync('docs');
//copy all files and directories recursively from src to docs
const copy = (src, dest) =>
  fs.lstatSync(src).isDirectory()
    ? copyDir(src, dest)
    : copyFile(src, dest);
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(child =>
    copy(`${src}/${child}`, `${dest}/${child}`)
  );
}
const copyFile = (src, dest) => {
  fs.copyFileSync(src, dest);
}
copy('src', 'docs');