export function getErrorMessage(error) {
  const data = error?.response?.data
  if (data?.errors) {
    return Object.values(data.errors).flat().join(' ')
  }
  if (data?.message) {
    return data.message
  }
  return "Une erreur inattendue s'est produite. Veuillez réessayer."
}
