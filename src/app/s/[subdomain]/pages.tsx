
const SubdomainPage = async ({ params }:{
    params:Promise<{subdomain:string}>
}) => {
    const {subdomain} = await params
    console.log(subdomain)  
    
  return (
    <div>SubdomainPage</div>
  )
}

export default SubdomainPage