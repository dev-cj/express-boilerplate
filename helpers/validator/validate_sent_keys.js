const validateSentKeys = (sent, allowed) => {
  if (!Object.keys(sent).length) return false
  const set = new Set(allowed)
  for (const key in sent) {
    if (!set.has(key)) return false
  }
  return true
}

module.exports = validateSentKeys
