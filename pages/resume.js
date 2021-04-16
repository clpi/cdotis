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
          <p>Some things I've worked on before...</p>
          <ul>

            <li>
              <div>
                <Image src="/assets/logo_icon_transparent.png" width="300" height="300" class = "float-left"/>
                <p><a href="https://devisa.io" class="text-green-500 font-semibold text-lg">Devisa</a> -- An life tracking/programmatic planning project/startup I'm working on.</p>
              </div>
            </li>
            </ul>
        </Container>
      </Layout>

    </>
  )
}
