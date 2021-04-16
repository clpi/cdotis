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
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        welcome to clp.is
      </h2>
          <p>I'm Chris. I may or may not be posting here and keeping these collection of pages updated, so if you're trying to get ahold of me/keep up to date with what I'm doing, better off just shooting me a message directly!</p>
          {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </Container>
      </Layout>
  )
}

