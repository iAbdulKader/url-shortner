import axios from 'axios'

export default function slug(){
  
  return(
    <div></div>
    )
}

export const getServerSideProps = async (ctx) => {
  try {
    const slug = ctx.params.slug;
    const res = await axios.post('http://localhost:3000/api/getBySlug', { slug: slug })
    
    if(res.data.success != false){
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