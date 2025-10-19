const bent = require("bent")
const os = require("os")
const downloadFile = require("./download-file")
const path = require("path")
const fs = require("fs")
const tar = require("tar")
const xz = require("xz")

const getJSON = bent("json", {
  "User-Agent": "seveibar, postgrest-bin (an npm module)",
})

const platform = os.platform()
const arch = os.arch()
let osRelease = null

switch (platform) {
  case "win32":
    osRelease = `windows-${arch}`
    break
  case "darwin":
    osRelease = "osx"
    break
  case "freebsd":
    osRelease = "freebsd"
    break
  case "linux":
    osRelease = `linux-${arch}`
    break
  // case 'aix': console.log("IBM AIX platform");
  //   break;
  // case 'android': console.log("Android platform");
  //   break;
  // case 'openbsd': console.log("OpenBSD platform");
  //   break;
  // case 'sunos': console.log("SunOS platform");
  //   break;

  default:
    osRelease = `${platform}-${arch}`
}

// Originally derived from the package.json, but that approach doesn't allow for
// any patches to the bindings... Maybe only sync major versions in the future?
// Either that or tag the releases for older version e.g. 1.2.3-postgrest6
// NOTE: Version 8.0.0 doesn't seem to have osx support
const releaseVersionToUse = "8.0.0"

module.exports = async () => {
  // Get all the assets from the github release page
  const releaseAPIUrl = `https://api.github.com/repos/PostgREST/postgrest/releases/tags/v${releaseVersionToUse}`
  const { assets } = await getJSON(releaseAPIUrl)

  // Find the asset for my operating system
  const myAsset = assets.find((asset) => asset.name.includes(osRelease))

  if (!myAsset) {
    throw new Error(
      `Couldn't find postgrest version compatible with ${osRelease}`
    )
  }

  // Download the asset (which is a compressed version of the executable)
  // e.g. download something like postgrest-ubuntu.tar.xz

  const downloadPath = path.resolve(__dirname, myAsset.name)
  const exePath = path.resolve(__dirname, "postgrest")

  if (fs.existsSync(exePath)) {
    return exePath
  }

  if (!fs.existsSync(downloadPath)) {
    console.log(`Downloading ${myAsset.name}...`)

    await downloadFile(
      myAsset.browser_download_url,
      path.resolve(__dirname, downloadPath)
    )
  }

  // Extract the files from the downloaded asset (i.e. pull out the postgrest binary)
  // After this, you should have a "postgrest" executable file

  if (!fs.existsSync(path.join(__dirname, "extracted"))) {
    console.log(`extracting ${myAsset.name}...`)
    let tarXPath = downloadPath
    if (myAsset.name.endsWith(".xz")) {
      let newTarPath = path.join(__dirname, "postgrest.tar")
      const decomp = new xz.Decompressor()
      const readFile = fs.createReadStream(downloadPath)
      const writeFile = fs.createWriteStream(newTarPath)
      readFile.pipe(decomp).pipe(writeFile)
      await new Promise((resolve) => writeFile.on("finish", resolve))
      fs.unlinkSync(tarXPath)
      tarXPath = newTarPath
    }
    await tar.x({
      file: tarXPath,
    })
    fs.unlinkSync(tarXPath)

    if (!fs.existsSync(exePath)) {
      throw new Error(
        `For some reason, after extracting postgrest there was no executable!`
      )
    }
  }

  return exePath
}

if (!module.parent) {
  module.exports().then(() => {})
}
