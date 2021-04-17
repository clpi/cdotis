
import Head from 'next/head';
import Layout from '../../components/layout'
import Container from '../../components/container'
export default function Resources(props) {
  return (
    <>
      <Head>
        <title>resources - clp.is chris pecunies</title>
      </Head>
      <Layout current="resources">
        <Container>
          <div class="inline-block mb-0 mt-5 grid grid-cols-2">
            <div class="float-left mr-8">
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter">
        resources
      </h2>
            </div>
            <div class="ml-24 float-right text-sm">
          <a href="mailto:clp@clp.is"><button class="px-5 py-3 rounded-lg shadow bg-green-500 text-white mr-4">Contact me</button></a>

          <a href="mailto:chris@devisa.io"><button class="px-5 py-3 rounded-lg shadow bg-white-500 text-black">Schedule me</button></a>
            </div>
          </div>
          <div class="border-l-4 border-green-300 pl-8">
      <h2 className="mb-8 text-3xl font-light leading-tight tracking-tighter">
        files
      </h2>
          <div class="border-l-4 border-green-300 pl-8">
          <p>one day files will be here...</p>
          </div>
      <h2 className="mb-8 text-3xl font-light leading-tight tracking-tighter">
        links
      </h2>
          <p>one day links will be here...</p>
          </div>
        </Container>
      </Layout>

    </>
  )
}
