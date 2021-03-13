import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'

export default function Index() {
  return (
    <>
      <Layout>
        <Head>
          <title>Welcome to clp.is</title>
        </Head>
        <Container>
          <Intro current=""/>
          <h1>Welcome to clp.is</h1>
          <p>I'm Chris.</p>
          {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </Container>
      </Layout>
    </>
  )
}

