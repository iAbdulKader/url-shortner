import axios from 'axios'

export default function slug(){
  
  return(
    <div></div>
    )
}

export const getServerSideProps = async (ctx) => {
  try {
    const slug = ctx.params.slug;
    const HOST_URL = process.env.HOST_URL
    const res = await axios.post(`${HOST_URL}/api/getBySlug`, { slug: slug })
    
    if(res.status == 200){
      return {
        redirect: {
          permanent: true,
          destination: res.data.url,
        },
        props: {}
      }
    } 
    
  } catch (error) {
    console.log(error);
    return {
        redirect: {
          permanent: true,
          destination: "/404",
        },
        props: {}
      }
  }
};