import Layout from '../../components/layout'
import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import { getAllPosts } from '../../lib/api'
import Head from 'next/head'

export default function Posts({ allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout current="posts">
        <Container>
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        my posts
      </h2>
          <div class="border-l-4 border-green-300 pl-8">
          {morePosts.length >= 0 && <MoreStories posts={allPosts} />}
          </div>
        </Container>
      </Layout>

    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
