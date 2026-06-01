export function thumbnail(url, size = "400x300") {
  if (!url || !url.includes("fit-in/")) return url
  return url.replace(/fit-in\/\d+x\d+/, `fit-in/${size}`)
}
