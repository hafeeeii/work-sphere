
export const getDepartments = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/departments`)
    // console.log(res,'this is data')
    return []
  } catch (error) {
    console.log(error)
    return []
  }
}
