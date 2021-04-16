import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'

export default function Index() {
  return (
      <Layout>
        <Head>
          <title>Welcome to clp.is</title>
        </Head>
        <Container>
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter md:text-7xl">
        Welcome to clp.is
      </h2>
          <p>I'm Chris.</p>
          {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </Container>
      </Layout>
  )
}

