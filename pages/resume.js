import Layout from '../components/layout'
import Image from 'next/image'
import Container from '../components/container'
import Head from 'next/head'
export default function Resume() {
  return (
    <>
      <Head>
        <title>resume - clp.is chris pecunies</title>
      </Head>
      <Layout current="resume">
        <Container>
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        my resume
      </h2>
          <div class="border-l-4 border-green-300 pl-8">
          <p>Some things I've worked on before will be posted here.</p>
          </div>
        </Container>
      </Layout>

    </>
  )
}
