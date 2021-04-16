import Head from 'next/head';
import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Head>
        <title>resources - clp.is chris pecunies</title>
      </Head>
      <Layout current="resources">
        <Container>
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        resources
      </h2>
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
