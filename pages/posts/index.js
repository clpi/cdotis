import Layout from '../../components/layout'
import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import HeroPost from '../../components/hero-post'
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
          {morePosts.length >= 0 && <MoreStories posts={allPosts} />}
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
